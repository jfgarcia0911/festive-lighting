import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { SEED_LEADS } from './seed.js'

// --- Storage selection -------------------------------------------------------
// Use Supabase (persistent Postgres) when configured; otherwise fall back to a
// local JSON file so dev and demos work with zero setup. The public API
// (getLeads / saveLead) is identical either way, so nothing else has to change.
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  : null

export function storageMode() {
  return supabase ? 'Supabase (Postgres)' : 'local JSON file'
}

// DB rows use snake_case (received_at); the frontend expects camelCase
// (receivedAt). Translate at the boundary so the API contract is unchanged.
function rowToLead(row) {
  const { received_at, ...rest } = row
  return { ...rest, receivedAt: received_at }
}

// --- Supabase implementation -------------------------------------------------
async function getLeadsSupabase() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('received_at', { ascending: false })
  if (error) throw new Error(`Supabase read failed: ${error.message}`)
  return data.map(rowToLead)
}

async function saveLeadSupabase(lead) {
  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      pkg: lead.pkg,
      feet: lead.feet,
      estimate: lead.estimate,
      message: lead.message,
      received_at: lead.receivedAt,
    })
    .select()
    .single()
  if (error) throw new Error(`Supabase write failed: ${error.message}`)
  return rowToLead(data)
}

// --- JSON file implementation (fallback) ------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', '..', 'data')
const DB_FILE = join(DATA_DIR, 'leads.json')

async function readAll() {
  try {
    return JSON.parse(await readFile(DB_FILE, 'utf-8'))
  } catch (err) {
    // No file yet (e.g. a fresh deploy) → show sample leads so the dashboard
    // isn't empty. The first real submission persists everything to disk.
    if (err.code === 'ENOENT') return SEED_LEADS.map((lead) => ({ ...lead }))
    throw err
  }
}

async function saveLeadFile(lead) {
  const leads = await readAll()
  const saved = { id: randomUUID(), ...lead }
  leads.push(saved)

  await mkdir(DATA_DIR, { recursive: true }) // ensure the data/ folder exists
  await writeFile(DB_FILE, JSON.stringify(leads, null, 2))
  return saved
}

// --- Public API --------------------------------------------------------------
export async function getLeads() {
  return supabase ? getLeadsSupabase() : readAll()
}

export async function saveLead(lead) {
  return supabase ? saveLeadSupabase(lead) : saveLeadFile(lead)
}
