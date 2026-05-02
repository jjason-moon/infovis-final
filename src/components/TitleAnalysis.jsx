'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { SCATTER_DOTS } from './data'

const KW_WORDS = [
  { text: 'highlights',    size: 52, color: '#50F0A0', eng: 7.58, freq: 2.20, cats: ['Sports','Gaming'],          views: '1.7M' },
  { text: 'football',      size: 46, color: '#F05A7E', eng: 8.01, freq: 0.88, cats: ['Sports'],                   views: '14.8M' },
  { text: 'breaking',      size: 44, color: '#A078F0', eng: 7.15, freq: 1.40, cats: ['News'],                     views: '2.9M' },
  { text: 'quantum',       size: 42, color: '#78C8F0', eng: 7.91, freq: 1.32, cats: ['Science & Technology'],     views: '1.6M' },
  { text: 'palworld',      size: 38, color: '#50C8F0', eng: 8.06, freq: 1.12, cats: ['Gaming'],                   views: '2.2M' },
  { text: 'computing',     size: 36, color: '#78C8F0', eng: 8.00, freq: 1.04, cats: ['Science & Technology'],     views: '2.7M' },
  { text: 'world cup',     size: 34, color: '#50F0A0', eng: 7.45, freq: 0.84, cats: ['Sports'],                   views: '4.2M' },
  { text: 'olympics',      size: 32, color: '#F0A050', eng: 7.47, freq: 0.76, cats: ['Sports','News'],            views: '1.8M' },
  { text: 'mma',           size: 30, color: '#F05A7E', eng: 7.55, freq: 0.68, cats: ['Sports'],                   views: '1.9M' },
  { text: 'coverage',      size: 28, color: '#A078F0', eng: 7.15, freq: 1.40, cats: ['News'],                     views: '2.9M' },
  { text: 'ishowspeed',    size: 26, color: '#50C8F0', eng: 7.28, freq: 0.52, cats: ['Gaming','Entertainment'],   views: '848K' },
  { text: 'black holes',   size: 26, color: '#78C8F0', eng: 6.99, freq: 0.60, cats: ['Science & Technology'],     views: '681K' },
  { text: 'nicki minaj',   size: 24, color: '#F090C8', eng: 7.16, freq: 0.60, cats: ['Music'],                    views: '3.6M' },
  { text: 'valorant',      size: 24, color: '#50C8F0', eng: 7.40, freq: 1.40, cats: ['Gaming'],                   views: '2.1M' },
  { text: 'nba finals',    size: 22, color: '#50F0A0', eng: 7.48, freq: 0.72, cats: ['Sports'],                   views: '2.8M' },
  { text: 'emma chamberlain', size: 20, color: '#F0D850', eng: 7.02, freq: 0.60, cats: ['People & Blogs'],        views: '13.8M' },
  { text: 'weapons',       size: 20, color: '#A078F0', eng: 7.36, freq: 0.80, cats: ['News','Gaming'],            views: '1.4M' },
  { text: 'super bowl',    size: 18, color: '#F05A7E', eng: 7.45, freq: 0.72, cats: ['Sports'],                   views: '3.2M' },
]

// ── Word Cloud ────────────────────────────────────────────────────────
function WordCloud({ keyFilter }) {
  const wrapRef  = useRef(null)
  const popupRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    import('d3-cloud').then(cloudModule => {
      const cloud = cloudModule.default
      const W = Math.min(wrap.offsetWidth || 420, 500)
      const H = 280

      const words = KW_WORDS.map(w => {
        let sz = w.size
        if (keyFilter) {
          sz = keyFilter[w.text] ? Math.min(w.size * 1.3, 56) : Math.max(w.size * 0.4, 12)
        }
        return { ...w, size: sz }
      })

      cloud()
        .size([W, H])
        .words(words)
        .padding(4)
        .rotate(() => Math.random() > 0.65 ? 90 : 0)
        .font('Georgia, serif')
        .fontWeight('bold')
        .fontSize(d => d.size)
        .on('end', placed => {
          d3.select(wrap).selectAll('svg').remove()

          const svg = d3.select(wrap).append('svg')
            .attr('width', W).attr('height', H)
            .style('overflow', 'visible').style('display', 'block')

          const g = svg.append('g').attr('transform', `translate(${W / 2},${H / 2})`)

          g.selectAll('text')
            .data(placed)
            .join('text')
            .style('font-family', 'Georgia, serif')
            .style('font-weight', 'bold')
            .style('font-size', d => d.size + 'px')
            .style('fill', d => d.color)
            .style('cursor', 'default')
            .style('opacity', 0)
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text(d => d.text)
            .transition().delay((_, i) => i * 30).duration(350)
            .style('opacity', d => {
              if (!keyFilter) return 1
              return keyFilter[d.text] ? 1 : 0.2
            })
            .selection()
            .on('mouseenter', function (event, d) {
              // scale up
              d3.select(this).transition().duration(100)
                .style('opacity', 0.75)
                .attr('transform', `translate(${d.x},${d.y}) rotate(${d.rotate}) scale(1.1)`)

              // show popup
              const popup = popupRef.current
              if (!popup) return
              const rect    = wrap.getBoundingClientRect()
              const engPct  = ((d.eng - 7) / 2 * 100).toFixed(0)
              popup.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
                  <div style="font-family:Georgia,serif;font-weight:700;font-size:18px;color:${d.color}">&ldquo;${d.text}&rdquo;</div>
                </div>
                <div style="margin-bottom:10px">
                  <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(232,232,240,0.4);margin-bottom:4px">Avg Engagement</div>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div style="flex:1;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden">
                      <div style="width:${engPct}%;height:100%;background:${d.color};border-radius:3px"></div>
                    </div>
                    <span style="font-size:15px;font-weight:700;color:${d.color}">${d.eng}</span>
                  </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
                  <div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:8px">
                    <div style="font-size:9px;color:rgba(232,232,240,0.4);letter-spacing:1px;text-transform:uppercase;margin-bottom:2px">Avg Views</div>
                    <div style="font-size:16px;font-weight:700;color:#E8E8F0">${d.views}</div>
                  </div>
                  <div style="background:rgba(255,255,255,0.04);border-radius:6px;padding:8px">
                    <div style="font-size:9px;color:rgba(232,232,240,0.4);letter-spacing:1px;text-transform:uppercase;margin-bottom:2px">In Titles</div>
                    <div style="font-size:16px;font-weight:700;color:#E8E8F0">${d.freq}%</div>
                  </div>
                </div>
                <div style="display:flex;gap:5px;flex-wrap:wrap">
                  ${d.cats.map(c => `<span style="padding:2px 8px;border-radius:100px;background:${d.color}22;border:1px solid ${d.color}55;font-size:10px;color:${d.color}">${c}</span>`).join('')}
                </div>
              `
              // position popup
              let px = event.clientX - rect.left + 14
              let py = event.clientY - rect.top  - 10
              if (px + 260 > rect.width)  px = event.clientX - rect.left - 270
              if (py + 200 > rect.height) py = event.clientY - rect.top  - 210
              popup.style.left    = px + 'px'
              popup.style.top     = py + 'px'
              popup.style.opacity = '1'
            })
            .on('mouseleave', function (_, d) {
              d3.select(this).transition().duration(100)
                .style('opacity', !keyFilter ? 1 : keyFilter[d.text] ? 1 : 0.2)
                .attr('transform', `translate(${d.x},${d.y}) rotate(${d.rotate})`)
              if (popupRef.current) popupRef.current.style.opacity = '0'
            })
        })
        .start()
    })
  }, [keyFilter])

  return (
    <div style={{ position: 'relative' }}>
      <div ref={wrapRef} />
      {/* hover popup */}
      <div
        ref={popupRef}
        style={{
          position: 'absolute',
          background: '#1a1a2e',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12,
          padding: '16px 18px',
          minWidth: 220, maxWidth: 260,
          zIndex: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity .15s',
        }}
      />
    </div>
  )
}

// ── Scatter Plot ──────────────────────────────────────────────────────
function ScatterPlot({ onBrush }) {
  const wrapRef = useRef(null)
  const tipRef  = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const W = wrap.offsetWidth || 500
    const H = wrap.offsetHeight || 280
    const L = 52, R = 16, T = 16, B = 36
    const PW = W - L - R
    const PH = H - T - B

    // draw axes with arrows
    const dotSvg = d3.select(wrap).append('svg')
      .attr('width', W).attr('height', H)
      .style('position', 'absolute').style('top', 0).style('left', 0)

    const axisColor = 'rgba(232,232,240,0.25)'
    // y axis line with arrow
    dotSvg.append('line')
      .attr('x1', L).attr('x2', L).attr('y1', T + PH).attr('y2', T)
      .attr('stroke', axisColor).attr('stroke-width', 1)
    dotSvg.append('polygon')
      .attr('points', `${L-4},${T+6} ${L+4},${T+6} ${L},${T}`)
      .attr('fill', axisColor)
    // x axis line with arrow
    dotSvg.append('line')
      .attr('x1', L).attr('x2', L + PW).attr('y1', T + PH).attr('y2', T + PH)
      .attr('stroke', axisColor).attr('stroke-width', 1)
    dotSvg.append('polygon')
      .attr('points', `${L+PW-6},${T+PH-4} ${L+PW-6},${T+PH+4} ${L+PW},${T+PH}`)
      .attr('fill', axisColor)
    // y axis tick labels
    dotSvg.append('text').attr('x', L-6).attr('y', T+10)
      .attr('text-anchor','end').attr('font-size',11).attr('fill',axisColor).text('10M')
    dotSvg.append('text').attr('x', L-6).attr('y', T+PH)
      .attr('text-anchor','end').attr('font-size',11).attr('fill',axisColor).text('10K')
    // x axis tick labels
    dotSvg.append('text').attr('x', L).attr('y', T+PH+16)
      .attr('text-anchor','middle').attr('font-size',11).attr('fill',axisColor).text('0')
    dotSvg.append('text').attr('x', L+PW).attr('y', T+PH+16)
      .attr('text-anchor','middle').attr('font-size',11).attr('fill',axisColor).text('1')

    const dotEls = []

    SCATTER_DOTS.forEach((d, i) => {
      const x  = L + d.cb * PW
      const y  = T + PH - ((d.y - 4.0) / 3.0) * PH  // log10(views) 4-7, high = top
      const r  = 5

      const circle = dotSvg.append('circle')
        .attr('cx', x).attr('cy', y).attr('r', r)
        .attr('fill', d.color).attr('opacity', 0)
        .style('transition', `opacity .4s ${i * 0.03}s, stroke .15s`)
        .attr('stroke', 'none').attr('stroke-width', 1.5)

      setTimeout(() => circle.attr('opacity', 0.72), 100 + i * 30)

      circle
        .on('mouseenter', function () {
          const tip = tipRef.current
          if (!tip) return
          tip.textContent  = `${d.cat} · Clickbait:${d.cb.toFixed(2)} · Views:${d.views}`
          tip.style.left   = (x + 10) + 'px'
          tip.style.top    = (y - 16) + 'px'
          tip.style.opacity = '1'
        })
        .on('mouseleave', () => { if (tipRef.current) tipRef.current.style.opacity = '0' })

      dotEls.push({ circle, d, x, y })
    })

    // brush overlay
    const brushSvg = d3.select(wrap).append('svg')
      .attr('width', W).attr('height', H)
      .style('position', 'absolute').style('top', 0).style('left', 0)
      .style('cursor', 'crosshair')

    const brushRect = brushSvg.append('rect')
      .attr('class', 'brush-rect').attr('display', 'none')

    let brushStart = null, isDragging = false

    brushSvg.on('mousedown', function (event) {
      const [mx, my] = d3.pointer(event)
      brushStart  = { x: mx, y: my }
      isDragging  = true
      brushRect.attr('display', 'block').attr('x', mx).attr('y', my).attr('width', 0).attr('height', 0)
    })

    brushSvg.on('mousemove', function (event) {
      if (!isDragging || !brushStart) return
      const [mx, my] = d3.pointer(event)
      const x1 = Math.min(brushStart.x, mx)
      const y1 = Math.min(brushStart.y, my)
      brushRect
        .attr('x', x1).attr('y', y1)
        .attr('width', Math.abs(mx - brushStart.x))
        .attr('height', Math.abs(my - brushStart.y))
    })

    brushSvg.on('mouseup', function (event) {
      if (!isDragging) return
      isDragging = false
      const [mx, my] = d3.pointer(event)
      const x1 = Math.min(brushStart.x, mx), x2 = Math.max(brushStart.x, mx)
      const y1 = Math.min(brushStart.y, my), y2 = Math.max(brushStart.y, my)

      if (x2 - x1 < 8 && y2 - y1 < 8) {
        // too small — clear brush
        clearBrush()
        return
      }

      const brushed = dotEls.filter(({ x, y }) => x >= x1 && x <= x2 && y >= y1 && y <= y2)

      // dim/highlight dots
      dotEls.forEach(({ circle, x, y }) => {
        const inBrush = x >= x1 && x <= x2 && y >= y1 && y <= y2
        circle.attr('opacity', inBrush ? 1 : 0.08)
          .attr('stroke', inBrush ? 'white' : 'none')
      })

      // collect categories of brushed points -> highlight matching keywords
      const brushedCats = new Set(brushed.map(({ d }) => d.cat))
      // map categories to actual KW_WORDS entries
      const catKeywords = {
        Sports:              ['highlights', 'football', 'world cup', 'olympics', 'mma', 'nba finals', 'super bowl'],
        Gaming:              ['highlights', 'palworld', 'ishowspeed', 'valorant', 'weapons'],
        News:                ['breaking', 'coverage', 'weapons', 'olympics'],
        Science:             ['quantum', 'computing', 'black holes'],
        'Science & Technology': ['quantum', 'computing', 'black holes'],
        Music:               ['nicki minaj'],
        Entertainment:       ['ishowspeed', 'emma chamberlain'],
        'People & Blogs':    ['emma chamberlain'],
        People:              ['emma chamberlain'],
        Comedy:              ['ishowspeed', 'highlights'],
        Education:           ['quantum', 'computing', 'black holes'],
        Film:                ['highlights'],
      }
      const keyFreq = {}
      brushedCats.forEach(cat => {
        const kws = catKeywords[cat] || []
        kws.forEach(k => { keyFreq[k] = (keyFreq[k] || 0) + 1 })
      })
      onBrush(brushed.length > 0 ? keyFreq : null, brushed.length)
    })

    // double-click to clear
    brushSvg.on('dblclick', clearBrush)

    function clearBrush() {
      brushRect.attr('display', 'none')
      brushStart = null
      dotEls.forEach(({ circle }) => circle.attr('opacity', 0.72).attr('stroke', 'none'))
      onBrush(null, 0)
    }

    return () => {
      d3.select(wrap).selectAll('svg').remove()
    }
  }, [onBrush])

  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
        Scatter — drag to filter cloud →
      </div>
      <div className="scatter-wrap" ref={wrapRef}>
        <div className="scatter-axis-x" />
        <div className="scatter-axis-y" />
        <div className="s-lx">Clickbait Score →</div>
        <div className="s-ly">Views (log scale)</div>
        <div className="s-insight">r = 0.007<br />Near-zero correlation</div>
        <div
          ref={tipRef}
          style={{
            position: 'absolute',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: 5,
            padding: '6px 10px',
            fontSize: 11,
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity .15s',
            zIndex: 20,
            whiteSpace: 'nowrap',
          }}
        />
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, fontStyle: 'italic', opacity: 0.7 }}>
        Drag to select a cluster · double-click to reset
      </div>
      <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, borderLeft: '2px solid rgba(232,232,240,0.15)' }}>
        <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, lineHeight: 1.7, opacity: 0.75 }}>
          <strong style={{ color: 'rgba(232,232,240,0.5)', fontStyle: 'normal' }}>X-axis — Clickbait Score:</strong> 0 = neutral / descriptive title; 1 = highly sensational phrasing (e.g. "YOU WON'T BELIEVE…")<br />
          <strong style={{ color: 'rgba(232,232,240,0.5)', fontStyle: 'normal' }}>Y-axis — Views (log scale):</strong> 10K at bottom, 10M at top; log scale used so low- and high-view videos are both visible
        </p>
      </div>
    </div>
  )
}

// ── Main TitleAnalysis ────────────────────────────────────────────────
export default function TitleAnalysis() {
  const [keyFilter,      setKeyFilter]      = useState(null)
  const [brushCount,     setBrushCount]     = useState(0)

  const handleBrush = useCallback((kf, count) => {
    setKeyFilter(kf)
    setBrushCount(count)
  }, [])

  return (
    <section className="narrative reveal" id="ch3-content" style={{ paddingTop: 64, paddingBottom: 64 }}>
      {/* text intro */}
      <div style={{ maxWidth: 860, marginBottom: 40 }}>
        <div className="eyebrow">Chapter III - Title Analysis</div>
        <h2 className="section-heading">
          Clickbait doesn&apos;t drive views.<br /><em>Real events</em> do.
        </h2>
        <div className="rule" />
        <p className="body-text">
          A video&apos;s clickbait score shows near-zero correlation with view count (r = 0.007).
          More sensational titles do not reliably lead to more views. What actually
          drives high view counts is more straightforward: <strong>real events, real names,
          real moments</strong>.
        </p>
        <p className="body-text">
          The titles that appear most often in high-view videos reference specific events —
          <strong>World Cup, Olympics, NBA Finals, Super Bowl</strong> — or specific people —
          <strong>Nicki Minaj, Emma Chamberlain, IShowSpeed</strong>. Science topics like
          <strong>quantum computing</strong> and <strong>black holes</strong> also punch
          above their weight. Trending is less about how you write your title,
          and more about <em>what</em> you&apos;re covering.
        </p>
        <p className="body-text">
          One consistent signal: titles with <strong>emojis see ~4% higher engagement</strong>.
          Personality and specificity beat shock value.
        </p>
        <p className="body-text" style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--muted)', opacity: 0.7 }}>
          Drag to select a region on the scatter plot — the word cloud updates to show
          which keywords appear most in that view range.
        </p>

        {/* stat pills */}
        <div className="d-flex gap-3 flex-wrap mt-3">
          <div className="stat-card" style={{ minWidth: 160 }}>
            <div className="stat-num" style={{ color: '#50F0A0', fontSize: 26 }}>+4%</div>
            <div className="stat-label">Engagement boost: emoji in title</div>
          </div>
          <div className="stat-card" style={{ minWidth: 160 }}>
            <div className="stat-num" style={{ color: 'var(--accent)', fontSize: 26 }}>r=0.007</div>
            <div className="stat-label">Clickbait vs views correlation</div>
          </div>
        </div>
      </div>

      {/* two-panel: scatter + word cloud */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <ScatterPlot onBrush={handleBrush} />
        </div>
        <div className="col-12 col-lg-6">
          <div className="kw-cloud-wrap">
            <div className="kw-cloud-label">
              Keywords —{' '}
              <span style={{ color: 'var(--accent)' }}>
                {brushCount > 0 ? `${brushCount} selected videos` : 'all videos'}
              </span>
            </div>
            <WordCloud keyFilter={keyFilter} />
            <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, borderLeft: '2px solid rgba(232,232,240,0.15)' }}>
              <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, lineHeight: 1.7, opacity: 0.75 }}>
                <strong style={{ color: 'rgba(232,232,240,0.5)' }}>Word size</strong> = frequency in high-view titles<br />
                <strong style={{ color: 'rgba(232,232,240,0.5)' }}>Avg Engagement</strong> = composite score (0–10) combining likes, comments &amp; shares relative to views<br />
                Hover a word for details · drag scatter to filter by view range
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
