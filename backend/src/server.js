import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDb } from './db.js'
import todosRouter from './routes/todos.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const PORT = process.env.PORT || 4000
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: CORS_ORIGIN }))
app.use(express.json())

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend', time: new Date().toISOString() })
})

// API routes
app.use('/api/todos', todosRouter)

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Start server after DB init
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('Failed to initialize database:', err)
    process.exit(1)
  })
