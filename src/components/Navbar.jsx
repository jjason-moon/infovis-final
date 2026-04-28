'use client'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '#cover',       label: 'Intro' },
  { href: '#geo-section', label: 'Explorer' },
  { href: '#ch3',         label: 'Categories' },
  { href: '#ch4',         label: 'Titles' },
  { href: '#closing',     label: 'Epilogue' },
]

export default function Navbar() {
  const [active, setActive] = useState('')
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const pct = scrollY / (document.body.scrollHeight - innerHeight) * 100
      setScrollPct(pct)

      // active link detection
      document.querySelectorAll('section[id], div[id]').forEach(s => {
        const r = s.getBoundingClientRect()
        if (r.top < 160 && r.bottom > 0) setActive('#' + s.id)
      })
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div
        id="progress-bar"
        style={{ width: `${scrollPct}%` }}
      />
      <nav
        className="navbar navbar-dark fixed-top"
        style={{
          background: 'rgba(13,13,20,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '0 40px',
          height: '52px',
        }}
      >
        <span className="navbar-brand mb-0" style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
          Trend<span style={{ color: 'var(--accent)' }}>Scope</span>
        </span>

        <div className="d-flex gap-4">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link p-0"
              style={{
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: active === link.href ? 'var(--text)' : 'var(--muted)',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}