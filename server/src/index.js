import 'dotenv/config'
import app from './app.js'
import { storageMode } from './lib/leadStore.js'

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`🎄 Festive Lighting API running on http://localhost:${PORT}`)
  console.log(`🗄️  Lead storage: ${storageMode()}`)
})