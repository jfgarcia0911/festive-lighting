import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', '..', 'data')
const DB_FILE = join(DATA_DIR, 'leads.json')

async function readAll() {
  try {
    return JSON.parse(await readFile(DB_FILE, 'utf-8'))
  } catch (err) {
    if (err.code === 'ENOENT') return [] // no file yet → start empty
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