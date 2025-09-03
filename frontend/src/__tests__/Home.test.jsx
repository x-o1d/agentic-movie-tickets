import React from 'react'
import { describe, it, beforeEach, afterEach, expect } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import Home from '../pages/Home.jsx'

function getTodayStr () {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const makeMovies = (prefix) => Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  url: `https://example.com/${prefix}-${i + 1}.jpg`,
  title: `${prefix.toUpperCase()} ${i + 1}`
}))

const NOW = makeMovies('now')
const SOON = makeMovies('soon')

beforeEach(() => {
  global.fetch = (url) => {
    if (url === '/api/images') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(NOW) })
    }
    if (url === '/api/images2') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(SOON) })
    }
    return Promise.resolve({ ok: false })
  }
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('Home – grids render and modals open', () => {
  it('[HOME-001] renders Now Showing posters', async () => {
    render(<Home />)
    const grid = await screen.findByRole('grid', { hidden: true }).catch(() => null)
    // The component does not use role=grid; assert by images count
    const posters = await screen.findAllByRole('img', { name: /NOW|SOON/i })
    // We expect at least 9 (Now Showing) + 9 (Coming Soon) = 18 images
    expect(posters.length).toBeGreaterThanOrEqual(18)
  })

  it('[BOOK-001] clicking a Now Showing poster opens booking modal', async () => {
    render(<Home />)
    const openBtns = await screen.findAllByRole('button', { name: /Open details for NOW/i })
    fireEvent.click(openBtns[0])
    expect(screen.getByRole('dialog', { name: /Movie details dialog/i })).toBeInTheDocument()
  })
})

describe('Modal A – Details step', () => {
  it('[BOOK-002] date is prefilled to today', async () => {
    render(<Home />)
    const openBtns = await screen.findAllByRole('button', { name: /Open details for NOW/i })
    fireEvent.click(openBtns[0])
    const dateInput = screen.getByLabelText(/Date/i)
    expect(dateInput).toHaveValue(getTodayStr())
  })

  it('[BOOK-003] Continue disabled until time selected and enables after', async () => {
    render(<Home />)
    const openBtns = await screen.findAllByRole('button', { name: /Open details for NOW/i })
    fireEvent.click(openBtns[0])
    const continueBtn = screen.getByRole('button', { name: /Continue/i })
    expect(continueBtn).toBeDisabled()
    const timeBtn = screen.getByRole('button', { name: '10:00' })
    fireEvent.click(timeBtn)
    expect(continueBtn).not.toBeDisabled()
  })

  it('[BOOK-004] Continue proceeds to Seats step', async () => {
    render(<Home />)
    const openBtns = await screen.findAllByRole('button', { name: /Open details for NOW/i })
    fireEvent.click(openBtns[0])
    fireEvent.click(screen.getByRole('button', { name: '10:00' }))
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))
    expect(screen.getByText(/Select a Seat/i)).toBeInTheDocument()
  })
})

describe('Modal A – Seats step', () => {
  function openSeats () {
    render(<Home />)
    const openBtns = screen.getAllByRole('button', { name: /Open details for NOW/i })
    fireEvent.click(openBtns[0])
    fireEvent.click(screen.getByRole('button', { name: '10:00' }))
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))
  }

  it('[BOOK-005] seat grid renders 24 seats', () => {
    openSeats()
    const seatButtons = screen.getAllByRole('button', { name: /Select seat [A-D][1-6]/i })
    expect(seatButtons.length).toBe(24)
  })

  it('[BOOK-006] Confirm disabled until a seat is selected', () => {
    openSeats()
    const confirmBtn = screen.getByRole('button', { name: /Confirm/i })
    expect(confirmBtn).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /Select seat B3/i }))
    expect(confirmBtn).not.toBeDisabled()
  })

  it('[BOOK-007] Back returns to Details keeping time', () => {
    openSeats()
    // Select a specific time before navigating back to assert active state persists
    const backBtn = screen.getByRole('button', { name: /Back/i })
    fireEvent.click(backBtn)
    // Time button should still be active (cannot directly read class; ensure Continue is enabled)
    const continueBtn = screen.getByRole('button', { name: /Continue/i })
    expect(continueBtn).not.toBeDisabled()
  })

  it('[BOOK-008] Confirm shows Success summary', () => {
    openSeats()
    fireEvent.click(screen.getByRole('button', { name: /Select seat C4/i }))
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }))
    expect(screen.getByText(/Successfully Booked/i)).toBeInTheDocument()
    expect(screen.getByText(/seat C4/i)).toBeInTheDocument()
  })
})

describe('Modal A – Success step', () => {
  it('[BOOK-009] Done closes modal and restores scroll', async () => {
    render(<Home />)
    const openBtns = await screen.findAllByRole('button', { name: /Open details for NOW/i })
    fireEvent.click(openBtns[0])
    fireEvent.click(screen.getByRole('button', { name: '10:00' }))
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))
    fireEvent.click(screen.getByRole('button', { name: /Select seat A1/i }))
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }))

    const dialog = screen.getByRole('dialog', { name: /Movie details dialog/i })
    expect(document.body.style.overflow).toBe('hidden')

    fireEvent.click(screen.getByRole('button', { name: /Done/i }))
    expect(dialog).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
  })
})

describe('Modal behaviors – ESC and scroll lock', () => {
  it('[REG-001] ESC closes booking modal at any step', async () => {
    render(<Home />)
    const openBtns = await screen.findAllByRole('button', { name: /Open details for NOW/i })
    fireEvent.click(openBtns[0])
    // Escape on Details
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: /Movie details dialog/i })).not.toBeInTheDocument()

    // Reopen; go to Seats, then ESC
    fireEvent.click(openBtns[0])
    fireEvent.click(screen.getByRole('button', { name: '10:00' }))
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: /Movie details dialog/i })).not.toBeInTheDocument()
  })

  it('[REG-002] Scroll is locked while any modal is open and restored on close', async () => {
    render(<Home />)
    const nowBtn = await screen.findAllByRole('button', { name: /Open details for NOW/i })
    fireEvent.click(nowBtn[0])
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.body.style.overflow).toBe('')
  })
})

describe('Coming Soon – Info-only modal', () => {
  it('[INFO-001][INFO-002] opens info dialog without booking controls', async () => {
    render(<Home />)
    const infoBtns = await screen.findAllByRole('button', { name: /Open details for SOON/i })
    fireEvent.click(infoBtns[0])
    const dialog = screen.getByRole('dialog', { name: /Coming soon details dialog/i })
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: /Continue|Confirm|Back/i })).toBeNull()
    expect(within(dialog).getByRole('button', { name: /Close/i })).toBeInTheDocument()
  })
})

describe('Image fallback behavior', () => {
  it('[HOME-002][INFO-003] swaps to placeholder on error', async () => {
    render(<Home />)
    const nowBtns = await screen.findAllByRole('button', { name: /Open details for NOW/i })
    // Trigger error on first Now Showing image
    const img = within(nowBtns[0]).getByRole('img')
    // Simulate an error event
    fireEvent.error(img)
    expect(img.src).toContain('https://placehold.co/400x600?text=Poster')
  })
})
