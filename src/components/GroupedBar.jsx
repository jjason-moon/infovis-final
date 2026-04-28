'use client'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

const GB_CATS = [
  { id: 'Music',         color: '#F05A7E' },
  { id: 'Entertainment', color: '#F0A050' },
  { id: 'Gaming',        color: '#50C8F0' },
  { id: 'Sports',        color: '#50F0A0' },
  { id: 'News',          color: '#A078F0' },
  { id: 'Science',       color: '#78C8F0' },
  { id: 'Comedy',        color: '#F07850' },
  { id: 'Education',     color: '#C8F090' },
]

const GB_DATA = {
  like:     { Music: 6.8, Entertainment: 5.9, Gaming: 8.2, Sports: 7.1, News: 4.3, Science: 7.4, Comedy: 6.2, Education: 6.9 },
  comment:  { Music: 2.1, Entertainment: 2.8, Gaming: 3.9, Sports: 2.4, News: 4.6, Science: 2.2, Comedy: 3.1, Education: 2.5 },
  duration: { Music: 3.2, Entertainment: 4.8, Gaming: 6.7, Sports: 4.1, News: 5.3, Science: 5.8, Comedy: 3.9, Education: 4.4 },
}

const GB_LABELS = {
  like:     'Like / view ratio (%)',
  comment:  'Comment / view ratio (%)',
  duration: 'Avg trending days',
}

export default function GroupedBar() {
  const svgRef     = useRef(null)
  const tipRef     = useRef(null)
  const [metric, setMetric] = useState('like')

  useEffect(() => {
    const svgEl = svgRef.current
    if (!svgEl) return

    const container = svgEl.parentElement
    const W  = Math.max(container.offsetWidth - 4, 500)
    const H  = 260
    const ML = 44, MR = 20, MT = 24, MB = 56
    const PW = W - ML - MR
    const PH = H - MT - MB

    const svg = d3.select(svgEl)
    svg.selectAll('*').remove()
    svg.attr('width', W).attr('height', H)

    const g = svg.append('g').attr('transform', `translate(${ML},${MT})`)

    const vals   = GB_DATA[metric]
    const maxVal = Math.max(...Object.values(vals)) * 1.15

    const xOuter = d3.scaleBand().domain(GB_CATS.map(c => c.id)).range([0, PW]).padding(0.2)
    const y      = d3.scaleLinear().domain([0, maxVal]).range([PH, 0])

    // grid lines
    y.ticks(4).forEach(v => {
      g.append('line')
        .attr('x1', 0).attr('x2', PW)
        .attr('y1', y(v)).attr('y2', y(v))
        .attr('stroke', 'rgba(255,255,255,0.05)').attr('stroke-width', 0.5)
      g.append('text')
        .attr('x', -8).attr('y', y(v))
        .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
        .attr('font-size', 9).attr('fill', 'rgba(232,232,240,0.35)')
        .text(v.toFixed(1))
    })

    // baseline
    g.append('line')
      .attr('x1', 0).attr('x2', PW)
      .attr('y1', PH).attr('y2', PH)
      .attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-width', 0.5)

    // bars
    GB_CATS.forEach((cat, ci) => {
      const bx   = xOuter(cat.id)
      const bw   = xOuter.bandwidth()
      const val  = vals[cat.id] || 0
      const barH = PH - y(val)

      g.append('rect')
        .attr('x', bx).attr('y', PH)
        .attr('width', bw).attr('height', 0)
        .attr('fill', cat.color).attr('opacity', 0.78).attr('rx', 2)
        .transition().duration(600).delay(ci * 60)
        .attr('y', y(val)).attr('height', barH)

      // value label above bar
      g.append('text')
        .attr('x', bx + bw / 2).attr('y', y(val) - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', 9).attr('fill', cat.color).attr('opacity', 0)
        .transition().duration(300).delay(ci * 60 + 500)
        .attr('opacity', 0.9)
        .text(val.toFixed(1))

      // x label — split long names into two lines
      const label  = cat.id
      const words  = label.split(' ')
      const line1  = words.length > 1 ? words.slice(0, Math.ceil(words.length / 2)).join(' ') : label
      const line2  = words.length > 1 ? words.slice(Math.ceil(words.length / 2)).join(' ') : null
      const xLabel = g.append('text')
        .attr('x', bx + bw / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', 9)
        .attr('fill', 'rgba(232,232,240,0.55)')

      xLabel.append('tspan')
        .attr('x', bx + bw / 2).attr('y', PH + 14)
        .text(line1)
      if (line2) {
        xLabel.append('tspan')
          .attr('x', bx + bw / 2).attr('dy', 12)
          .text(line2)
      }

      // invisible hover rect
      g.append('rect')
        .attr('x', bx).attr('y', 0)
        .attr('width', bw).attr('height', PH)
        .attr('fill', 'transparent').attr('cursor', 'pointer')
        .on('mouseenter', function (event) {
          const tip = tipRef.current
          if (!tip) return
          tip.innerHTML = `<span style="color:${cat.color};font-weight:600">${cat.id}</span> &nbsp; ${GB_LABELS[metric]}: <strong style="color:#E8E8F0">${val.toFixed(2)}</strong>`
          tip.style.left    = (event.clientX + 12) + 'px'
          tip.style.top     = (event.clientY - 28) + 'px'
          tip.style.opacity = '1'
        })
        .on('mouseleave', () => {
          if (tipRef.current) tipRef.current.style.opacity = '0'
        })
    })

    // y-axis label
    g.append('text')
      .attr('x', -ML + 8).attr('y', PH / 2)
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90,${-ML + 8},${PH / 2})`)
      .attr('font-size', 9).attr('fill', 'rgba(232,232,240,0.35)')
      .text(GB_LABELS[metric])

  }, [metric])

  // redraw on resize
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const svgEl = svgRef.current
      if (svgEl) {
        const evt = new Event('resize-trigger')
        svgEl.dispatchEvent(evt)
      }
    })
    if (svgRef.current?.parentElement) ro.observe(svgRef.current.parentElement)
    return () => ro.disconnect()
  }, [metric])

  return (
    <section
      className="narrative reveal"
      id="ch3-content"
      style={{ paddingTop: 64, paddingBottom: 64 }}
    >
      {/* text intro */}
      <div style={{ maxWidth: 860, marginBottom: 32 }}>
        <div className="eyebrow">Chapter II · Categories</div>
        <h2 className="section-heading">
          Sports packs arenas.<br /><em>Science</em> builds communities.
        </h2>
        <div className="rule" />
        <p className="body-text">
          Different categories dominate on different dimensions. Sports wins on reach;
          Science wins on loyalty. Switch between metrics to see how each category profile
          changes — some categories earn likes but fade fast, others persist on trending
          lists with quieter but dedicated audiences.
        </p>
      </div>

      {/* chart card */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '24px 28px' }}>
        {/* metric tabs */}
        <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
          <span style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginRight: 4 }}>
            Metric:
          </span>
          {Object.entries(GB_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`gbtn ${metric === key ? 'active' : ''}`}
              onClick={() => setMetric(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* legend */}
        <div className="d-flex flex-wrap gap-3 mb-3">
          {GB_CATS.map(cat => (
            <div key={cat.id} className="d-flex align-items-center gap-1" style={{ fontSize: 11, color: 'var(--muted)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
              {cat.id}
            </div>
          ))}
        </div>

        {/* chart */}
        <div style={{ position: 'relative', overflowX: 'auto' }}>
          <svg ref={svgRef} style={{ overflow: 'visible', minWidth: 500, display: 'block' }} />
        </div>
      </div>

      {/* floating tooltip */}
      <div
        ref={tipRef}
        style={{
          position: 'fixed',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '7px 12px',
          fontSize: 12,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity .15s',
          zIndex: 100,
          whiteSpace: 'nowrap',
        }}
      />
    </section>
  )
}