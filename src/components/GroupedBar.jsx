'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

const CATS = [
  { id: 'Music',         color: '#F05A7E' },
  { id: 'Entertainment', color: '#F0A050' },
  { id: 'Gaming',        color: '#50C8F0' },
  { id: 'Sports',        color: '#50F0A0' },
  { id: 'News',          color: '#A078F0' },
  { id: 'Science',       color: '#78C8F0' },
  { id: 'Comedy',        color: '#F07850' },
  { id: 'Education',     color: '#C8F090' },
]

const DATA = {
  like:     { Music: 5.73, Entertainment: 5.51, Gaming: 5.65, Sports: 5.61, News: 5.57, Science: 5.66, Comedy: 5.63, Education: 5.68 },
  comment:  { Music: 0.655, Entertainment: 0.672, Gaming: 0.652, Sports: 0.659, News: 0.697, Science: 0.692, Comedy: 0.646, Education: 0.653 },
  duration: { Music: 4.6, Entertainment: 12.5, Gaming: 25.6, Sports: 12.4, News: 12.2, Science: 14.7, Comedy: 13.5, Education: 14.2 },
}

const LABELS = {
  like:     'Like / View Ratio (%)',
  comment:  'Comment / View Ratio (%)',
  duration: 'Avg Video Duration (min)',
}

const DESCRIPTIONS = {
  like:     'Like ratios are remarkably consistent across categories (5.5–5.7%) — audiences approve at similar rates regardless of content type. Music edges ahead at 5.73%.',
  comment:  'News generates the most comments per view (0.697%) — audiences feel compelled to respond and debate. Science follows closely at 0.692%.',
  duration: 'Gaming videos are dramatically longer than any other category — averaging 25.6 minutes vs Music at just 4.6 minutes. Format shapes who watches and for how long.',
}

const METRIC_DEFS = {
  like:     'Like / View Ratio: (total likes ÷ total views) × 100 — measures how likely a viewer is to like the video after watching it',
  comment:  'Comment / View Ratio: (total comments ÷ total views) × 100 — measures how likely a viewer is to leave a comment; higher = more discussion',
  duration: 'Avg Video Duration: mean length of trending videos in this category (minutes); longer = more watch time commitment required',
}

export default function GroupedBar() {
  const svgRef  = useRef(null)
  const wrapRef = useRef(null)
  const tipRef  = useRef(null)
  const [metric, setMetric] = useState('like')

  useEffect(() => {
    draw(metric)
  }, [metric])

  useEffect(() => {
    const ro = new ResizeObserver(() => draw(metric))
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [metric])

  function draw(m) {
    const wrap  = wrapRef.current
    const svgEl = svgRef.current
    if (!wrap || !svgEl) return

    const W  = wrap.offsetWidth || 700
    const H  = 280
    const ML = 44, MR = 16, MT = 24, MB = 44
    const PW = W - ML - MR
    const PH = H - MT - MB

    const vals   = DATA[m]
    const maxVal = Math.max(...Object.values(vals)) * 1.15

    // sort descending
    const sorted = [...CATS]
      .map(c => ({ ...c, val: vals[c.id] || 0 }))
      .sort((a, b) => b.val - a.val)

    d3.select(svgEl).attr('width', W).attr('height', H)
    const svg = d3.select(svgEl)
    svg.selectAll('*').remove()
    const g = svg.append('g').attr('transform', `translate(${ML},${MT})`)

    const x = d3.scaleBand().domain(sorted.map(d => d.id)).range([0, PW]).padding(0.22)
    const y = d3.scaleLinear().domain([0, maxVal]).range([PH, 0])

    // grid
    y.ticks(4).forEach(v => {
      g.append('line')
        .attr('x1', 0).attr('x2', PW)
        .attr('y1', y(v)).attr('y2', y(v))
        .attr('stroke', 'rgba(255,255,255,0.05)').attr('stroke-width', 0.5)
      g.append('text')
        .attr('x', -8).attr('y', y(v))
        .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
        .attr('font-size', 11).attr('fill', 'rgba(232,232,240,0.35)')
        .text(v.toFixed(1))
    })

    // baseline
    g.append('line')
      .attr('x1', 0).attr('x2', PW)
      .attr('y1', PH).attr('y2', PH)
      .attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-width', 0.5)

    // y-axis label
    g.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -PH / 2).attr('y', -ML + 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11).attr('fill', 'rgba(232,232,240,0.3)')
      .text(LABELS[m])

    sorted.forEach((cat, i) => {
      const bx   = x(cat.id)
      const bw   = x.bandwidth()
      const barH = PH - y(cat.val)
      const isTop = i === 0

      // bar
      g.append('rect')
        .attr('x', bx).attr('y', y(cat.val))
        .attr('width', bw).attr('height', barH)
        .attr('rx', 3)
        .attr('fill', cat.color)
        .attr('opacity', isTop ? 0.92 : 0.60)

      // dashed border for top
      if (isTop) {
        g.append('rect')
          .attr('x', bx - 2).attr('y', y(cat.val) - 2)
          .attr('width', bw + 4).attr('height', barH + 2)
          .attr('rx', 3)
          .attr('fill', 'none')
          .attr('stroke', cat.color)
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '4 2')
          .attr('opacity', 0.7)
      }

      // value label above bar
      g.append('text')
        .attr('x', bx + bw / 2).attr('y', y(cat.val) - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12).attr('font-weight', '700')
        .attr('fill', cat.color)
        .text(cat.val.toFixed(1))

      // x label
      g.append('text')
        .attr('x', bx + bw / 2).attr('y', PH + 16)
        .attr('text-anchor', 'middle')
        .attr('font-size', 11).attr('fill', 'rgba(232,232,240,0.5)')
        .text(cat.id)

      // hover area
      g.append('rect')
        .attr('x', bx).attr('y', 0)
        .attr('width', bw).attr('height', PH)
        .attr('fill', 'transparent')
        .attr('cursor', 'default')
        .on('mouseenter', function (event) {
          const tip = tipRef.current
          if (!tip) return
          tip.innerHTML = `
            <span style="color:${cat.color};font-weight:700">${cat.id}</span>
            &nbsp;&nbsp;
            <span style="color:rgba(232,232,240,0.5)">${LABELS[m]}:</span>
            &nbsp;
            <strong style="color:#E8E8F0">${cat.val.toFixed(2)}</strong>
          `
          tip.style.left    = (event.clientX + 14) + 'px'
          tip.style.top     = (event.clientY - 36) + 'px'
          tip.style.opacity = '1'
        })
        .on('mousemove', function (event) {
          const tip = tipRef.current
          if (tip) {
            tip.style.left = (event.clientX + 14) + 'px'
            tip.style.top  = (event.clientY - 36) + 'px'
          }
        })
        .on('mouseleave', () => {
          if (tipRef.current) tipRef.current.style.opacity = '0'
        })
    })
  }

  return (
    <section className="narrative reveal" id="ch2-content" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div style={{ maxWidth: 860, marginBottom: 40 }}>
        <div className="eyebrow">Chapter II - Categories</div>
        <h2 className="section-heading">
          Format shapes content.<br /><em>News</em> sparks the debate.
        </h2>
        <div className="rule" />
        <p className="body-text">
          Audiences like videos at roughly the same rate no matter the category.
          But <strong>News sparks the most debate</strong> (highest comment rate),
          and <strong>format varies wildly</strong> — a Gaming video averages 25 minutes
          while a Music video runs just 4.6. Your category sets the rules of the game.
        </p>
        <p className="body-text" style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 500 }}>
          Switch between metrics to see how each category&apos;s profile shifts. ↓
        </p>
      </div>

      {/* chart card */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '20px 24px' }}>

        {/* metric tabs */}
        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
          <span style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginRight: 4 }}>
            Metric:
          </span>
          {Object.entries(LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`gbtn ${metric === key ? 'active' : ''}`}
              onClick={() => setMetric(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* metric description */}
        <p style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 12, minHeight: 20 }}>
          {DESCRIPTIONS[metric]}
        </p>

        {/* chart */}
        <div ref={wrapRef} style={{ width: '100%' }}>
          <svg ref={svgRef} style={{ display: 'block', overflow: 'visible' }} />
        </div>

        {/* metric definition footnote */}
        <p style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', marginTop: 10, marginBottom: 0, opacity: 0.6, lineHeight: 1.5 }}>
          {METRIC_DEFS[metric]}
        </p>
      </div>

      {/* takeaway summary */}
      <div style={{ marginTop: 32, padding: '20px 24px', background: 'rgba(232,240,96,0.04)', border: '1px solid rgba(232,240,96,0.18)', borderRadius: 8, borderLeft: '3px solid var(--accent)' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14 }}>What This Means for You</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { cat: 'Music',   color: '#F05A7E', icon: '🎵', tip: 'Keep it short (avg 4.6 min). Expect high likes, low debate. Great for passive listeners who watch and move on.' },
            { cat: 'Gaming',  color: '#50C8F0', icon: '🎮', tip: 'Go long (avg 25.6 min). Viewers are invested — they stay for the journey. Build personality and consistency.' },
            { cat: 'News',    color: '#A078F0', icon: '📢', tip: 'Expect comments. You have the highest comment rate of any category. Post when stories break and be ready to engage.' },
          ].map(t => (
            <div key={t.cat} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '14px 16px' }}>
              <div style={{ fontSize: 16, marginBottom: 6 }}>{t.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: t.color, marginBottom: 6 }}>{t.cat}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{t.tip}</div>
            </div>
          ))}
        </div>
      </div>

      {/* tooltip */}
      <div
        ref={tipRef}
        style={{
          position: 'fixed',
          background: 'rgba(18,18,30,0.96)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '7px 14px',
          fontSize: 12,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity .12s',
          zIndex: 200,
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
        }}
      />
    </section>
  )
}
