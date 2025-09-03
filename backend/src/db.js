import sqlite3 from 'sqlite3'
import path from 'path'
import fs from 'fs'

sqlite3.verbose()

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'backend', 'data', 'app.db')

let dbInstance = null

export function getDb () {
  if (!dbInstance) {
    // Ensure directory exists
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    dbInstance = new sqlite3.Database(DB_PATH)
  }
  return dbInstance
}

export async function initDb () {
  const db = getDb()
  await run(db, `CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)
}

export function run (db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err)
      resolve({ id: this.lastID, changes: this.changes })
    })
  })
}

export function all (db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err)
      resolve(rows)
    })
  })
}

export function get (db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err)
      resolve(row)
    })
  })
}
