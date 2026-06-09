import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEED_LEADS } from './seed.js'

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

export async function getLeads() {
  return readAll()
}

export async function saveLead(lead) {
  const leads = await readAll()
  const saved = { id: randomUUID(), ...lead }
  leads.push(saved)

  await mkdir(DATA_DIR, { recursive: true }) // ensure the data/ folder exists
  await writeFile(DB_FILE, JSON.stringify(leads, null, 2))
  return saved
}