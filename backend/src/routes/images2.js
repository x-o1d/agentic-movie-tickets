import { Router } from 'express'

const router = Router()

// Another simple in-memory list of 9 image items (placeholder images)
const images = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/seed/alt_movie_${i + 1}/400/600`,
  title: `Alt Movie Poster ${i + 1}`
}))

router.get('/', (req, res) => {
  res.json(images)
})

export default router
