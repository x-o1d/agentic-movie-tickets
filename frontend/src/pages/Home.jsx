import React, { useEffect, useState } from 'react'

export default function Home () {
  function getTodayStr () {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images2, setImages2] = useState([])
  const [loading2, setLoading2] = useState(false)
  const [error2, setError2] = useState('')

  // Modal state for first grid
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null) // { id, url, title }
  const [selectedDate, setSelectedDate] = useState(() => getTodayStr())
  const [selectedTime, setSelectedTime] = useState('')
  const [step, setStep] = useState('details') // 'details' | 'seats' | 'success'
  const [selectedSeat, setSelectedSeat] = useState('')
  const timeSlots = ['10:00', '13:00', '16:00', '19:00', '22:00']
  // Modal for second grid (info only)
  const [infoOpen, setInfoOpen] = useState(false)
  const [infoSelected, setInfoSelected] = useState(null) // { id, url, title }

  useEffect(() => {
    let ignore = false
    async function fetchImages () {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/images')
        if (!res.ok) throw new Error('Failed to load images')
        const data = await res.json()
        if (!ignore) setImages(data)
      } catch (e) {
        if (!ignore) setError('Failed to load images')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    async function fetchImages2 () {
      setLoading2(true)
      setError2('')
      try {
        const res = await fetch('/api/images2')
        if (!res.ok) throw new Error('Failed to load images 2')
        const data = await res.json()
        if (!ignore) setImages2(data)
      } catch (e) {
        if (!ignore) setError2('Failed to load images')
      } finally {
        if (!ignore) setLoading2(false)
      }
    }
    fetchImages()
    fetchImages2()
    return () => { ignore = true }
  }, [])

  // Close modal(s) on Escape and lock scroll when any modal is open
  useEffect(() => {
    function onKeyDown (e) {
      if (e.key === 'Escape') { setOpen(false); setInfoOpen(false) }
    }
    if (open || infoOpen) {
      // Reset date to today each time the dialog opens
      if (open) setSelectedDate(getTodayStr())
      document.addEventListener('keydown', onKeyDown)
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', onKeyDown)
        document.body.style.overflow = prev
      }
    }
  }, [open, infoOpen])

  return (
    <div className="container">
      <h1 style={{ marginBottom: 40 }}>Now Showing</h1>

      {loading && <p>Loading images...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="image-grid">
          {images.slice(0, 9).map(img => (
            <button
              key={img.id}
              className="image-card image-button"
              onClick={() => { setSelected(img); setOpen(true); setSelectedTime(''); setSelectedSeat(''); setStep('details') }}
              aria-label={`Open details for ${img.title}`}
            >
              <img
                src={img.url}
                alt={img.title}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = 'https://placehold.co/400x600?text=Poster'
                }}
              />
            </button>
          ))}
        </div>
      )}

      <h1 style={{ margin: '40px 0' }}>Coming Soon</h1>

      {loading2 && <p>Loading images...</p>}
      {error2 && <p className="error">{error2}</p>}

      {!loading2 && !error2 && (
        <div className="image-grid">
          {images2.slice(0, 9).map(img => (
            <button
              key={img.id}
              className="image-card image-button"
              onClick={() => { setInfoSelected(img); setInfoOpen(true) }}
              aria-label={`Open details for ${img.title}`}
            >
              <img
                src={img.url}
                alt={img.title}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = 'https://placehold.co/400x600?text=Poster'
                }}
              />
            </button>
          ))}
        </div>
      )}

      {open && selected && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Movie details dialog" onClick={() => setOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-left">
              {step === 'details' && (
                <>
                  <h2 style={{ marginTop: 0 }}>{selected.title}</h2>
                  <p style={{ opacity: 0.9 }}>
                    Enjoy an immersive cinema experience. Choose a date and time slot to proceed with booking.
                  </p>

                  <div className="row" style={{ alignItems: 'center' }}>
                    <label htmlFor="show-date" style={{ minWidth: 80 }}>Date</label>
                    <input
                      id="show-date"
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ marginBottom: 8, fontWeight: 600 }}>Time Slots</div>
                    <div className="time-slots">
                      {timeSlots.map(t => (
                        <button
                          key={t}
                          className={`time-slot ${selectedTime === t ? 'active' : ''}`}
                          onClick={() => setSelectedTime(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <button onClick={() => setOpen(false)} className="secondary">Close</button>
                    <button
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setStep('seats')}
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}

              {step === 'seats' && (
                <>
                  <h2 style={{ marginTop: 0 }}>Select a Seat</h2>
                  <p style={{ opacity: 0.9 }}>Pick your preferred seat for {selectedDate} at {selectedTime}.</p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 1fr)',
                      gap: 8,
                      marginTop: 12
                    }}
                  >
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const row = String.fromCharCode(65 + Math.floor(idx / 6)) // A,B,C,D
                      const col = (idx % 6) + 1
                      const seat = `${row}${col}`
                      const active = selectedSeat === seat
                      return (
                        <button
                          key={seat}
                          className={`time-slot ${active ? 'active' : ''}`}
                          onClick={() => setSelectedSeat(seat)}
                          aria-label={`Select seat ${seat}`}
                        >
                          {seat}
                        </button>
                      )
                    })}
                  </div>

                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <button onClick={() => setStep('details')} className="secondary">Back</button>
                    <button
                      disabled={!selectedSeat}
                      onClick={() => { setStep('success') }}
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}

              {step === 'success' && (
                <>
                  <h2 style={{ marginTop: 0 }}>Successfully Booked</h2>
                  <p style={{ opacity: 0.9 }}>
                    Your booking for <strong>{selected.title}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>, seat <strong>{selectedSeat}</strong> is confirmed.
                  </p>
                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        setOpen(false)
                        setStep('details')
                      }}
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="modal-right">
              <img
                src={selected.url}
                alt={selected.title}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = 'https://placehold.co/400x600?text=Poster'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {infoOpen && infoSelected && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Coming soon details dialog" onClick={() => setInfoOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-left">
              <h2 style={{ marginTop: 0 }}>{infoSelected.title}</h2>
              <p style={{ opacity: 0.9 }}>
                A thrilling upcoming release. Stay tuned for showtimes and booking.
              </p>
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button onClick={() => setInfoOpen(false)} className="secondary">Close</button>
              </div>
            </div>
            <div className="modal-right">
              <img
                src={infoSelected.url}
                alt={infoSelected.title}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = 'https://placehold.co/400x600?text=Poster'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
