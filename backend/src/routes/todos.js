import { Router } from 'express'
import { getDb, all, get, run } from '../db.js'

const router = Router()

const mapRow = (row) => ({
  id: row.id,
  title: row.title,
  completed: !!row.completed,
  created_at: row.created_at
})

router.get('/', async (req, res, next) => {
  try {
    const db = getDb()
    const rows = await all(db, 'SELECT * FROM todos ORDER BY id DESC')
    res.json(rows.map(mapRow))
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const { title } = req.body || {}
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'title is required string' })
    }
    const db = getDb()
    const result = await run(db, 'INSERT INTO todos (title, completed) VALUES (?, ?)', [title.trim(), 0])
    const row = await get(db, 'SELECT * FROM todos WHERE id = ?', [result.id])
    res.status(201).json(mapRow(row))
  } catch (e) { next(e) }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, completed } = req.body || {}
    if (title !== undefined && typeof title !== 'string') {
      return res.status(400).json({ error: 'title must be string' })
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be boolean' })
    }

    const db = getDb()
    const existing = await get(db, 'SELECT * FROM todos WHERE id = ?', [id])
    if (!existing) return res.status(404).json({ error: 'not found' })

    const newTitle = title !== undefined ? title.trim() : existing.title
    const newCompleted = completed !== undefined ? (completed ? 1 : 0) : existing.completed

    await run(db, 'UPDATE todos SET title = ?, completed = ? WHERE id = ?', [newTitle, newCompleted, id])
    const row = await get(db, 'SELECT * FROM todos WHERE id = ?', [id])
    res.json(mapRow(row))
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const db = getDb()
    const result = await run(db, 'DELETE FROM todos WHERE id = ?', [id])
    if (result.changes === 0) return res.status(404).json({ error: 'not found' })
    res.status(204).send()
  } catch (e) { next(e) }
})

export default router
