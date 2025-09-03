import React from 'react'

export default function Todos () {
  return (
    <div className="container">
      <h1>Buy Tickets</h1>
      <div style={{
        border: '1px solid #2a356a',
        background: 'linear-gradient(180deg, rgba(10,16,46,0.9), rgba(9,12,32,0.9))',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 0 12px rgba(0,229,255,0.06), 0 0 30px rgba(255,0,245,0.05) inset'
      }}>
        <h2 style={{ marginTop: 0 }}>Under Construction</h2>
        <p style={{ opacity: 0.9 }}>
          We are crafting an awesome ticket purchasing experience. Please check back soon.
        </p>
      </div>
    </div>
  )
}
