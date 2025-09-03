import React, { useEffect, useState } from 'react'

const API = 'http://localhost:4000/api/todos'

export default function App () {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchTodos () {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(API)
      const data = await res.json()
      setTodos(data)
    } catch (e) {
      setError('Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTodos() }, [])

  async function addTodo (e) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) })
      if (!res.ok) throw new Error('Failed to add')
      setTitle('')
      fetchTodos()
    } catch (e) { setError('Failed to add todo') }
  }

  async function toggleTodo (todo) {
    try {
      const res = await fetch(`${API}/${todo.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed: !todo.completed }) })
      if (!res.ok) throw new Error('Failed to update')
      fetchTodos()
    } catch (e) { setError('Failed to update todo') }
  }

  async function deleteTodo (id) {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (res.status !== 204) throw new Error('Failed to delete')
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (e) { setError('Failed to delete todo') }
  }

  return (
    <div className="container">
      <h1>Todos</h1>

      <form onSubmit={addTodo} className="row">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New todo" />
        <button type="submit">Add</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="list">
        {todos.map(t => (
          <li key={t.id} className={t.completed ? 'completed' : ''}>
            <label>
              <input type="checkbox" checked={t.completed} onChange={() => toggleTodo(t)} />
              <span>{t.title}</span>
            </label>
            <button onClick={() => deleteTodo(t.id)} className="danger">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
