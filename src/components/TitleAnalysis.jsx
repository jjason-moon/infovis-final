'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'

const SCATTER_DOTS = [
  { cb: .12, eng: 9.1, cat: 'Music',         color: '#F05A7E', keys: ['honest','real','viral'] },
  { cb: .18, eng: 8.9, cat: 'Music',         color: '#F05A7E', keys: ['truth','viral','real'] },
  { cb: .08, eng: 9.4, cat: 'Science',       color: '#78C8F0', keys: ['inside','real','world record'] },
  { cb: .22, eng: 8.6, cat: 'Music',         color: '#F05A7E', keys: ['emotional','honest'] },
  { cb: .35, eng: 8.5, cat: 'Science',       color: '#78C8F0', keys: ['inside','first time','best ever'] },
  { cb: .15, eng: 8.8, cat: 'Music',         color: '#F05A7E', keys: ['viral','real','emotional'] },
  { cb: .42, eng: 8.1, cat: 'Gaming',        color: '#50C8F0', keys: ['reaction','challenge','gone wrong'] },
  { cb: .55, eng: 7.9, cat: 'Gaming',        color: '#50C8F0', keys: ['reaction','exposed','challenge'] },
  { cb: .28, eng: 8.3, cat: 'Sports',        color: '#50F0A0', keys: ['world record','best ever','honest'] },
  { cb: .48, eng: 7.7, cat: 'Comedy',        color: '#F07850', keys: ['gone wrong','challenge','reaction'] },
  { cb: .62, eng: 7.5, cat: 'News',          color: '#A078F0', keys: ['exposed','truth','inside'] },
  { cb: .71, eng: 7.2, cat: 'Entertainment', color: '#F0A050', keys: ['exposed','secret','never seen'] },
  { cb: .38, eng: 7.9, cat: 'Sports',        color: '#50F0A0', keys: ['best ever','world record'] },
  { cb: .19, eng: 8.7, cat: 'Education',     color: '#C8F090', keys: ['inside','first time','real'] },
  { cb: .82, eng: 6.8, cat: 'Entertainment', color: '#F0A050', keys: ['exposed','never seen'] },
  { cb: .65, eng: 7.3, cat: 'Comedy',        color: '#F07850', keys: ['gone wrong','challenge'] },
  { cb: .53, eng: 7.6, cat: 'Gaming',        color: '#50C8F0', keys: ['reaction','first time','challenge'] },
  { cb: .25, eng: 8.4, cat: 'Science',       color: '#78C8F0', keys: ['inside','world record','best ever'] },
  { cb: .44, eng: 8.0, cat: 'Music',         color: '#F05A7E', keys: ['honest','real','truth'] },
  { cb: .76, eng: 6.9, cat: 'Entertainment', color: '#F0A050', keys: ['secret','never seen','exposed'] },
  { cb: .31, eng: 8.2, cat: 'Sports',        color: '#50F0A0', keys: ['best ever','honest','world record'] },
  { cb: .59, eng: 7.4, cat: 'News',          color: '#A078F0', keys: ['truth','exposed','inside'] },
  { cb: .13, eng: 9.0, cat: 'Education',     color: '#C8F090', keys: ['real','inside','first time'] },
  { cb: .86, eng: 6.6, cat: 'Comedy',        color: '#F07850', keys: ['gone wrong','never seen'] },
  { cb: .40, eng: 7.8, cat: 'Gaming',        color: '#50C8F0', keys: ['reaction','gone wrong'] },
  { cb: .23, eng: 8.5, cat: 'Music',         color: '#F05A7E', keys: ['viral','honest','emotional'] },
  { cb: .68, eng: 7.1, cat: 'Entertainment', color: '#F0A050', keys: ['secret','exposed'] },
  { cb: .50, eng: 7.7, cat: 'Sports',        color: '#50F0A0', keys: ['world record','challenge'] },
  { cb: .33, eng: 8.1, cat: 'Science',       color: '#78C8F0', keys: ['inside','real','best ever'] },
  { cb: .78, eng: 6.7, cat: 'News',          color: '#A078F0', keys: ['truth','never seen','exposed'] },
]

const KW_WORDS = [
  { text: 'viral',             size: 52, color: '#F05A7E', eng: 8.41, freq: 18.3, cats: ['Music','Entertainment'],    views: '5.2M' },
  { text: 'honest',            size: 46, color: '#E8F060', eng: 8.29, freq: 12.1, cats: ['People & Blogs','Comedy'],  views: '4.8M' },
  { text: 'real',              size: 44, color: '#50C8F0', eng: 8.22, freq: 11.4, cats: ['News','People & Blogs'],    views: '4.5M' },
  { text: 'truth',             size: 42, color: '#F05A7E', eng: 8.18, freq: 10.9, cats: ['News','Entertainment'],     views: '4.3M' },
  { text: 'reaction',          size: 38, color: '#F0A050', eng: 8.05, freq: 9.6,  cats: ['Gaming','Entertainment'],   views: '4.1M' },
  { text: 'challenge',         size: 34, color: '#A078F0', eng: 7.98, freq: 8.4,  cats: ['Sports','Comedy'],          views: '3.9M' },
  { text: 'I tried',           size: 32, color: '#50F0A0', eng: 7.95, freq: 7.8,  cats: ['People & Blogs','Comedy'],  views: '3.7M' },
  { text: 'emotional',         size: 30, color: '#F0A050', eng: 7.91, freq: 7.2,  cats: ['Music','People & Blogs'],   views: '3.5M' },
  { text: 'exposed',           size: 30, color: '#F05A7E', eng: 7.88, freq: 6.9,  cats: ['Entertainment','News'],     views: '3.4M' },
  { text: 'inside',            size: 28, color: '#78C8F0', eng: 7.84, freq: 6.4,  cats: ['Science','Education'],      views: '3.2M' },
  { text: 'first time',        size: 28, color: '#C8F090', eng: 7.81, freq: 6.1,  cats: ['People & Blogs','Gaming'],  views: '3.1M' },
  { text: 'world record',      size: 24, color: '#50C8F0', eng: 7.75, freq: 5.3,  cats: ['Sports','Gaming'],          views: '2.9M' },
  { text: 'best ever',         size: 24, color: '#F0D850', eng: 7.72, freq: 5.1,  cats: ['Sports','Music'],           views: '2.8M' },
  { text: 'unbelievable',      size: 22, color: '#A078F0', eng: 7.68, freq: 4.7,  cats: ['Sports','Entertainment'],   views: '2.6M' },
  { text: 'secret',            size: 22, color: '#F090C8', eng: 7.65, freq: 4.4,  cats: ['People & Blogs','News'],    views: '2.5M' },
  { text: 'gone wrong',        size: 20, color: '#F07850', eng: 7.61, freq: 4.0,  cats: ['Comedy','Entertainment'],   views: '2.3M' },
  { text: 'never seen',        size: 18, color: '#F0D850', eng: 7.58, freq: 3.6,  cats: ['Science','Sports'],         views: '2.1M' },
  { text: 'behind the scenes', size: 18, color: '#E8F060', eng: 7.54, freq: 3.2,  cats: ['Film','Music'],             views: '2.0M' },
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

    // draw dots
    const dotSvg = d3.select(wrap).append('svg')
      .attr('width', W).attr('height', H)
      .style('position', 'absolute').style('top', 0).style('left', 0)

    const dotEls = []

    SCATTER_DOTS.forEach((d, i) => {
      const x  = L + d.cb * PW
      const y  = T + (1 - (d.eng - 6) / 4) * PH
      const r  = 6 + Math.random() * 5

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
          tip.textContent  = `${d.cat} · CB:${d.cb.toFixed(2)} · Eng:${d.eng.toFixed(1)}`
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

      // collect keyword frequencies
      const keyFreq = {}
      brushed.forEach(({ d }) => d.keys.forEach(k => { keyFreq[k] = (keyFreq[k] || 0) + 1 }))
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
        <div className="s-ly">← Engagement Score</div>
        <div className="s-insight">r = 0.003<br />Near-zero correlation</div>
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
    <section className="narrative reveal" id="ch4-content" style={{ paddingTop: 64, paddingBottom: 64 }}>
      {/* text intro */}
      <div style={{ maxWidth: 860, marginBottom: 40 }}>
        <div className="eyebrow">Chapter III · Title Analysis</div>
        <h2 className="section-heading">
          Clickbait is a <em>red herring.</em>
        </h2>
        <div className="rule" />
        <p className="body-text">
          A video&apos;s clickbait score has essentially <strong>zero correlation</strong> with
          its engagement (r = 0.003). The audience has learned to see through manipulation.
          But add an emoji — engagement rises 4%. Drag a brush on the scatter plot to filter
          the word cloud and see which keywords dominate high-engagement videos.
        </p>

        {/* stat pills */}
        <div className="d-flex gap-3 flex-wrap mt-3">
          <div className="stat-card" style={{ minWidth: 160 }}>
            <div className="stat-num" style={{ color: '#50F0A0', fontSize: 26 }}>+4%</div>
            <div className="stat-label">Engagement boost: emoji in title</div>
          </div>
          <div className="stat-card" style={{ minWidth: 160 }}>
            <div className="stat-num" style={{ color: 'var(--red)', fontSize: 26 }}>−1%</div>
            <div className="stat-label">Engagement drop: ALL CAPS title</div>
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
          </div>
        </div>
      </div>
    </section>
  )
}