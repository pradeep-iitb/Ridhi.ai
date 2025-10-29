import React from 'react'

export default function Header() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <img src="/Assets/Images/Lucid_Origin_Create_an_ultradetailed_futuristic_logo_for_Ridhi_2.jpg" alt="Ridhi logo" style={{ height: 44, borderRadius: 8 }} />
      <div style={{ color: '#e6eef8', fontWeight: 700, fontSize: 18 }}>Ridhi.ai</div>
      <nav style={{ marginLeft: 'auto' }}>
        <a href="/" style={{ color: '#9fb2d6', marginRight: 12 }}>Home</a>
        <a href="/app" style={{ color: '#9fb2d6' }}>App</a>
      </nav>
    </header>
  )
}
