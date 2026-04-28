export default function Cover() {
  return (
    <section id="cover">
      <div className="cover-grid" />
      <div
        className="cover-orb"
        style={{ width: 560, height: 560, top: -120, right: -60, background: 'rgba(240,90,126,.18)' }}
      />
      <div
        className="cover-orb"
        style={{ width: 380, height: 380, bottom: 80, left: 120, background: 'rgba(232,240,96,.10)' }}
      />
      <div
        className="cover-orb"
        style={{ width: 300, height: 300, top: '40%', left: '40%', background: 'rgba(80,200,240,.08)' }}
      />

      <div style={{ position: 'relative', zIndex: 2, padding: '80px 56px' }}>
        <div className="eyebrow">A Data-Driven Story · 2020 – 2026</div>
        <h1 className="display-heading">
          What Does the<br />World <em>Watch?</em>
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.75, maxWidth: 520, color: 'var(--muted)', marginTop: 24 }}>
          Six years. 23 countries. 10,000 trending videos. This is the story of how
          YouTube's trending tab reveals the pulse of global digital culture.
        </p>

        {/* stats row */}
        <div
          className="d-flex gap-4 flex-wrap"
          style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border)' }}
        >
          {[
            { num: '10K', label: 'Trending Videos' },
            { num: '23',  label: 'Countries' },
            { num: '17',  label: 'Categories' },
            { num: '6',   label: 'Years' },
          ].map(s => (
            <div key={s.label} className="d-flex flex-column gap-1">
              <span style={{ fontWeight: 800, fontSize: 32, color: 'var(--text)', lineHeight: 1 }}>
                {s.num}
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-hint">Scroll to begin</div>
    </section>
  )
}