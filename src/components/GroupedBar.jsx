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
  like:     { Music:6.8, Entertainment:5.9, Gaming:8.2, Sports:7.1, News:4.3, Science:7.4, Comedy:6.2, Education:6.9 },
  comment:  { Music:2.1, Entertainment:2.8, Gaming:3.9, Sports:2.4, News:4.6, Science:2.2, Comedy:3.1, Education:2.5 },
  duration: { Music:3.2, Entertainment:4.8, Gaming:6.7, Sports:4.1, News:5.3, Science:5.8, Comedy:3.9, Education:4.4 },
}

const LABELS = {
  like:     'Like / View Ratio (%)',
  comment:  'Comment / View Ratio (%)',
  duration: 'Avg Trending Days',
}

// insight text per category per metric
const INSIGHTS = {
  like: {
    Gaming:  'Gamers hit Like more than any other category',
    Science: 'High approval — curious audiences validate content',
    Music:   'Strong emotional connection drives likes',
    News:    'Controversial content → lower like ratio',
  },
  comment: {
    News:    'News sparks debate — most comments per view',
    Gaming:  'Gaming communities are vocal and reactive',
    Comedy:  'Jokes invite reactions and replies',
    Science: 'Science audiences engage deeply in discussion',
  },
  duration: {
    Gaming:  'Gaming videos stay trending the longest',
    News:    'Breaking stories sustain interest for days',
    Science: 'Educational content has long shelf life',
    Music:   'Music fades fast — high peak, quick drop',
  },
}

const COLOR = Object.fromEntries(CATS.map(c => [c.id, c.color]))

// ── Animated Bar Chart ────────────────────────────────────────────────
function BarChart({ metric }) {
  const svgRef  = useRef(null)
  const wrapRef = useRef(null)
  const prevRef = useRef({})

  useEffect(() => {
    drawOrUpdate()
  }, [metric])

  useEffect(() => {
    const ro = new ResizeObserver(drawOrUpdate)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [metric])

  function drawOrUpdate() {
    const wrap  = wrapRef.current
    const svgEl = svgRef.current
    if (!wrap || !svgEl) return

    const W  = wrap.offsetWidth || 700
    const H  = 220
    const ML = 44, MR = 16, MT = 20, MB = 44
    const PW = W - ML - MR
    const PH = H - MT - MB

    const vals   = DATA[metric]
    const maxVal = Math.max(...Object.values(vals)) * 1.15

    // sort by current value
    const sorted = [...CATS]
      .map(c => ({ ...c, val: vals[c.id] || 0 }))
      .sort((a, b) => b.val - a.val)

    const isFirst = Object.keys(prevRef.current).length === 0

    d3.select(svgEl).attr('width', W).attr('height', H)

    let svg = d3.select(svgEl)
    if (isFirst) {
      svg.selectAll('*').remove()
    }

    const g = isFirst
      ? svg.append('g').attr('class', 'main-g').attr('transform', `translate(${ML},${MT})`)
      : svg.select('g.main-g')

    const x = d3.scaleBand().domain(sorted.map(d => d.id)).range([0, PW]).padding(0.22)
    const y = d3.scaleLinear().domain([0, maxVal]).range([PH, 0])

    if (isFirst) {
      // grid
      y.ticks(4).forEach(v => {
        g.append('line').attr('class', 'grid-line')
          .attr('x1', 0).attr('x2', PW).attr('y1', y(v)).attr('y2', y(v))
          .attr('stroke', 'rgba(255,255,255,0.05)').attr('stroke-width', 0.5)
        g.append('text').attr('class', 'grid-label')
          .attr('x', -8).attr('y', y(v))
          .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
          .attr('font-size', 9).attr('fill', 'rgba(232,232,240,0.35)')
          .text(v.toFixed(1))
      })
      g.append('line')
        .attr('x1', 0).attr('x2', PW).attr('y1', PH).attr('y2', PH)
        .attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-width', 0.5)
    } else {
      // update grid on metric change
      g.selectAll('.grid-line').remove()
      g.selectAll('.grid-label').remove()
      y.ticks(4).forEach(v => {
        g.insert('line', ':first-child').attr('class', 'grid-line')
          .attr('x1', 0).attr('x2', PW).attr('y1', y(v)).attr('y2', y(v))
          .attr('stroke', 'rgba(255,255,255,0.05)').attr('stroke-width', 0.5)
        g.insert('text', ':first-child').attr('class', 'grid-label')
          .attr('x', -8).attr('y', y(v))
          .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
          .attr('font-size', 9).attr('fill', 'rgba(232,232,240,0.35)')
          .text(v.toFixed(1))
      })
    }

    // highlight top 2 categories
    const top2 = sorted.slice(0, 2).map(d => d.id)

    // ── bars ──
    const bars = g.selectAll('.bar-group').data(sorted, d => d.id)

    const barsEnter = bars.enter().append('g').attr('class', 'bar-group')

    // rect
    barsEnter.append('rect').attr('class', 'bar-rect')
      .attr('rx', 3)
      .attr('x', d => x(d.id))
      .attr('width', x.bandwidth())
      .attr('y', PH).attr('height', 0)
      .transition().duration(700).delay((_, i) => i * 50).ease(d3.easeCubicOut)
      .attr('y',      d => y(d.val))
      .attr('height', d => PH - y(d.val))
      .attr('fill',   d => d.color)
      .attr('opacity', d => top2.includes(d.id) ? 0.92 : 0.55)

    // value label
    barsEnter.append('text').attr('class', 'bar-val-label')
      .attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('font-family', 'Syne, sans-serif').attr('font-weight', '700')
      .attr('fill', d => d.color)
      .attr('opacity', 0)
      .attr('x', d => x(d.id) + x.bandwidth() / 2)
      .attr('y', d => y(d.val) - 5)
      .text(d => d.val.toFixed(1))
      .transition().duration(300).delay((_, i) => i * 50 + 500)
      .attr('opacity', 1)

    // x label
    barsEnter.append('text').attr('class', 'bar-x-label')
      .attr('text-anchor', 'middle')
      .attr('font-size', 9).attr('fill', 'rgba(232,232,240,0.5)')
      .attr('x', d => x(d.id) + x.bandwidth() / 2)
      .attr('y', PH + 14)
      .text(d => d.id)

    // highlight ring for top category
    barsEnter.filter(d => d.id === sorted[0].id)
      .append('rect').attr('class', 'highlight-ring')
      .attr('rx', 3)
      .attr('x', d => x(d.id) - 2).attr('width', x.bandwidth() + 4)
      .attr('y', d => y(d.val) - 2)
      .attr('height', d => PH - y(d.val) + 2)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 2')
      .attr('opacity', 0.6)

    // hover interaction
    barsEnter.append('rect').attr('class', 'hover-rect')
      .attr('x', d => x(d.id)).attr('width', x.bandwidth())
      .attr('y', 0).attr('height', PH)
      .attr('fill', 'transparent').attr('cursor', 'default')
      .on('mouseenter', function (event, d) {
        const tip = document.getElementById('gb-tip')
        if (!tip) return
        const insight = INSIGHTS[metric]?.[d.id]
        tip.innerHTML = `
          <div style="color:${d.color};font-weight:700;margin-bottom:4px">${d.id}</div>
          <div style="color:#E8E8F0">${LABELS[metric]}: <strong>${d.val.toFixed(2)}</strong></div>
          ${insight ? `<div style="color:rgba(232,232,240,0.5);font-size:11px;margin-top:4px;font-style:italic">${insight}</div>` : ''}
        `
        tip.style.left    = (event.clientX + 14) + 'px'
        tip.style.top     = (event.clientY - 48) + 'px'
        tip.style.opacity = '1'
      })
      .on('mousemove', function (event) {
        const tip = document.getElementById('gb-tip')
        if (tip) { tip.style.left = (event.clientX + 14) + 'px'; tip.style.top = (event.clientY - 48) + 'px' }
      })
      .on('mouseleave', () => {
        const tip = document.getElementById('gb-tip')
        if (tip) tip.style.opacity = '0'
      })

    // ── UPDATE existing bars with smooth transition ──
    const barsUpdate = bars.merge(barsEnter)

    barsUpdate.select('.bar-rect')
      .transition().duration(600).ease(d3.easeCubicInOut)
      .attr('x',      d => x(d.id))
      .attr('width',  x.bandwidth())
      .attr('y',      d => y(d.val))
      .attr('height', d => PH - y(d.val))
      .attr('fill',   d => d.color)
      .attr('opacity', d => top2.includes(d.id) ? 0.92 : 0.55)

    barsUpdate.select('.bar-val-label')
      .transition().duration(600).ease(d3.easeCubicInOut)
      .attr('x',  d => x(d.id) + x.bandwidth() / 2)
      .attr('y',  d => y(d.val) - 5)
      .attr('fill', d => d.color)
      .text(d => d.val.toFixed(1))

    barsUpdate.select('.bar-x-label')
      .transition().duration(600)
      .attr('x', d => x(d.id) + x.bandwidth() / 2)

    barsUpdate.select('.hover-rect')
      .attr('x', d => x(d.id)).attr('width', x.bandwidth())

    barsUpdate.select('.highlight-ring')
      .transition().duration(600).ease(d3.easeCubicInOut)
      .attr('x',      d => x(d.id) - 2).attr('width', x.bandwidth() + 4)
      .attr('y',      d => y(d.val) - 2)
      .attr('height', d => PH - y(d.val) + 2)
      .attr('stroke', d => d.color)

    prevRef.current = vals
  }

  return (
    <div ref={wrapRef} style={{ width: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block', overflow: 'visible' }} />
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────
export default function GroupedBar() {
  const [metric, setMetric] = useState('like')

  return (
    <section className="narrative reveal" id="ch2-content" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div style={{ maxWidth: 860, marginBottom: 40 }}>
        <div className="eyebrow">Chapter II - Categories</div>
        <h2 className="section-heading">
          Sports packs arenas.<br /><em>Science</em> builds communities.
        </h2>
        <div className="rule" />
        <p className="body-text">
          Not all engagement looks the same. Gaming videos stay on the trending list the longest.
          News drives the most comments per view — audiences debate, not just watch.
          Switch metrics to see how each category shifts.
        </p>
      </div>

      {/* bar chart */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '20px 24px' }}>
        <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
          <span style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginRight: 4 }}>Metric:</span>
          {Object.entries(LABELS).map(([key, label]) => (
            <button key={key} className={`gbtn ${metric === key ? 'active' : ''}`} onClick={() => setMetric(key)}>
              {label}
            </button>
          ))}
        </div>
        <BarChart metric={metric} />
      </div>

      {/* tooltip */}
      <div id="gb-tip" style={{
        position: 'fixed',
        background: 'rgba(18,18,30,0.96)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 12,
        lineHeight: 1.6,
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity .12s',
        zIndex: 200,
        maxWidth: 240,
        backdropFilter: 'blur(8px)',
      }} />
    </section>
  )
}
