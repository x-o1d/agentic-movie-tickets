import { Router } from 'express'

const router = Router()

// Simple in-memory list of 9 movie posters with names
// Keeping keys as { id, url, title } for frontend compatibility
const images = [
  {
    id: 1,
    url: 'https://picsum.photos/seed/inception/400/600',
    title: 'Inception'
  },
  {
    id: 2,
    url: 'https://picsum.photos/seed/darkknight/400/600',
    title: 'The Dark Knight'
  },
  {
    id: 3,
    url: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
    title: 'Interstellar'
  },
  {
    id: 4,
    url: 'https://picsum.photos/seed/matrix/400/600',
    title: 'The Matrix'
  },
  {
    id: 5,
    url: 'https://picsum.photos/seed/titanic/400/600',
    title: 'Titanic'
  },
  {
    id: 6,
    url: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg',
    title: 'Avatar'
  },
  {
    id: 7,
    url: 'https://picsum.photos/seed/gladiator/400/600',
    title: 'Gladiator'
  },
  {
    id: 8,
    url: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg',
    title: 'The Godfather'
  },
  {
    id: 9,
    url: 'https://picsum.photos/seed/pulpfiction/400/600',
    title: 'Pulp Fiction'
  }
]

router.get('/', (req, res) => {
  res.json(images)
})

export default router
