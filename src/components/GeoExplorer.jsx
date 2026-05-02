'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import {
  GEO_CATS, CAT_COLOR, COUNTRIES,
  COUNTRY_CATS, CAT_VIEWS, CAT_ENG,
  YEARS, AREA_CATS, AREA_GLOBAL, AREA_COUNTRY,
} from './data'

// ── helpers ──────────────────────────────────────────────────────────
function fmtVal(val, metric) {
  if (metric === 'videos')     return val + '%'
  if (metric === 'views')      return val >= 1000 ? (val / 1000).toFixed(1) + 'M' : val + 'K'
  if (metric === 'engagement') return val.toFixed(2)
  return val
}

// ── BarChart (right panel) ────────────────────────────────────────────
function BarChart({ mode, selectedCountry, selectedCat, metric }) {
  const bodyRef = useRef(null)

  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    body.innerHTML = ''

    let items = []

    if (mode === 'country' && selectedCountry) {
      const c = COUNTRIES.find(x => x.code === selectedCountry)
      if (!c) return
      const pcts = COUNTRY_CATS[c.code]
      items = GEO_CATS.map((cat, i) => ({
        label: cat.id, sub: null, color: cat.color,
        pct:   pcts[i],
        views: CAT_VIEWS[cat.id]?.[c.code] || 1500,
        eng:   CAT_ENG[cat.id]?.[c.code]   || c.eng,
      }))
    } else if (mode === 'category' && selectedCat) {
      const cat     = GEO_CATS.find(x => x.id === selectedCat)
      const catIdx  = GEO_CATS.findIndex(x => x.id === selectedCat)
      items = COUNTRIES.map(c => ({
        label: `${c.flag} ${c.code}`, sub: c.name, color: cat.color,
        pct:   COUNTRY_CATS[c.code][catIdx],
        views: CAT_VIEWS[selectedCat]?.[c.code] || c.views,
        eng:   CAT_ENG[selectedCat]?.[c.code]   || c.eng,
        isTop: c.top === selectedCat,
      }))
    } else {
      return
    }

    const vals   = items.map(x => metric === 'videos' ? x.pct : metric === 'views' ? x.views : x.eng)
    const maxVal = metric === 'engagement' ? 8.5 : Math.max(...vals)
    const sorted = items.map((it, i) => ({ ...it, val: vals[i] })).sort((a, b) => b.val - a.val)

    sorted.forEach((item, i) => {
      const pct = (item.val / maxVal * 91).toFixed(1)
      const div = document.createElement('div')
      div.className = 'bar-item' + (i === 0 || item.isTop ? ' highlight' : '')
      div.style.transitionDelay = (i * 0.04) + 's'
      div.innerHTML = `
        <div class="bar-name">${item.label}${item.sub ? `<small>${item.sub}</small>` : ''}</div>
        <div class="bar-track">
          <div class="bar-fill" style="background:${item.color}" data-pct="${pct}">
            <span class="bar-fill-label">${fmtVal(item.val, metric)}</span>
          </div>
        </div>
        <div class="bar-val">${fmtVal(item.val, metric)}</div>
      `
      body.appendChild(div)
      requestAnimationFrame(() => setTimeout(() => {
        div.classList.add('show')
        const fill = div.querySelector('.bar-fill')
        fill.style.width = pct + '%'
        setTimeout(() => fill.querySelector('.bar-fill-label').classList.add('show'), 600)
      }, i * 45))
    })
  }, [mode, selectedCountry, selectedCat, metric])

  return <div className="geo-chart-body" ref={bodyRef}>
    <div className="geo-empty">
      <div className="geo-empty-icon">🌍</div>
      <div className="geo-empty-text">Click a country bubble<br />or a category in the legend.</div>
    </div>
  </div>
}

// ── DualRangeSlider ───────────────────────────────────────────────────
function DualRangeSlider({ lo, hi, min, max, labels, onChange }) {
  const trackRef  = useRef(null)
  const dragging  = useRef(null)

  const pct = v => (v - min) / (max - min) * 100

  const getVal = clientX => {
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round(ratio * (max - min) + min)
  }

  const startDrag = which => e => {
    e.preventDefault()
    dragging.current = which
    const move = e => {
      const v = getVal(e.clientX)
      if (dragging.current === 'lo') onChange(Math.min(v, hi - 1), hi)
      else                           onChange(lo, Math.max(v, lo + 1))
    }
    const up = () => {
      dragging.current = null
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup',   up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup',   up)
  }

  const handle = (which) => (
    <div
      onMouseDown={startDrag(which)}
      style={{
        position: 'absolute',
        left: pct(which === 'lo' ? lo : hi) + '%',
        transform: 'translateX(-50%)',
        width: 13, height: 13,
        background: 'var(--accent)',
        border: '2px solid #0D0D14',
        borderRadius: '50%',
        cursor: 'grab',
        zIndex: 2,
        userSelect: 'none',
        flexShrink: 0,
      }}
    />
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, minWidth: 32, textAlign: 'right' }}>
        {labels[lo]}
      </span>
      <div ref={trackRef} style={{ position: 'relative', width: 140, height: 20, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', width: '100%', height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} />
        <div style={{
          position: 'absolute',
          left: pct(lo) + '%',
          width: (pct(hi) - pct(lo)) + '%',
          height: 3,
          background: 'var(--accent)',
          borderRadius: 2,
        }} />
        {handle('lo')}
        {handle('hi')}
      </div>
      <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, minWidth: 32 }}>
        {labels[hi]}
      </span>
    </div>
  )
}

// ── AreaChart (bottom left) ───────────────────────────────────────────
function AreaChart({ countryCode, highlightCat }) {
  const svgRef        = useRef(null)
  const tipRef        = useRef(null)
  const [lo, setLo]   = useState(0)
  const [hi, setHi]   = useState(6)
  const [flash, setFlash] = useState(false)

  // flash header whenever the selected country changes
  useEffect(() => {
    if (!countryCode) return
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 700)
    return () => clearTimeout(t)
  }, [countryCode])

  const draw = useCallback(() => {
    const svgEl = svgRef.current
    if (!svgEl) return
    const data   = AREA_COUNTRY[countryCode] || AREA_GLOBAL
    const sliced = YEARS.slice(lo, hi + 1)

    d3.select(svgEl).selectAll('*').remove()

    const W  = svgEl.parentElement?.offsetWidth  || 400
    const H  = svgEl.parentElement?.offsetHeight || 200
    const ML = 40, MR = 16, MT = 12, MB = 24
    const PW = W - ML - MR
    const PH = H - MT - MB

    d3.select(svgEl).attr('width', W).attr('height', H)

    const rows = sliced.map((yr, i) => {
      const obj = { year: yr }
      AREA_CATS.forEach(cat => { obj[cat.id] = (data[cat.id] || [])[lo + i] || 0 })
      return obj
    })

    const allVals = AREA_CATS.flatMap(cat => rows.map(r => r[cat.id]))
    const maxVal  = Math.ceil(Math.max(...allVals) / 5) * 5 || 50

    const x = d3.scalePoint().domain(sliced).range([0, PW]).padding(0.1)
    const y = d3.scaleLinear().domain([0, maxVal]).range([PH, 0])
    const g = d3.select(svgEl).append('g').attr('transform', `translate(${ML},${MT})`)

    // grid
    y.ticks(4).forEach(v => {
      g.append('line')
        .attr('x1', 0).attr('x2', PW).attr('y1', y(v)).attr('y2', y(v))
        .attr('stroke', 'rgba(255,255,255,0.04)').attr('stroke-width', 0.5)
      g.append('text')
        .attr('x', -4).attr('y', y(v))
        .attr('text-anchor', 'end').attr('dominant-baseline', 'central')
        .attr('font-size', 11).attr('fill', 'rgba(232,232,240,0.3)')
        .text(v + '%')
    })

    const lineFn = d3.line()
      .x((_, i) => x(sliced[i]))
      .y(d => y(d))
      .curve(d3.curveCatmullRom)

    const tip = tipRef.current

    AREA_CATS.forEach(cat => {
      const dim  = highlightCat && highlightCat !== cat.id
      const vals = rows.map(r => r[cat.id])
      const op   = dim ? 0.08 : 0.85

      // line
      g.append('path')
        .datum(vals)
        .attr('d', lineFn)
        .attr('fill', 'none')
        .attr('stroke', cat.color)
        .attr('stroke-width', dim ? 1 : 2)
        .attr('opacity', op)
        .style('transition', 'opacity .25s')

      // dots + tooltip
      rows.forEach((row, i) => {
        g.append('circle')
          .attr('cx', x(sliced[i])).attr('cy', y(row[cat.id])).attr('r', dim ? 2 : 3.5)
          .attr('fill', cat.color).attr('opacity', op)
          .style('cursor', 'crosshair')
          .on('mouseenter', function (event) {
            d3.select(this).attr('r', 5).attr('opacity', 1)
            if (!tip) return
            tip.innerHTML = `
              <span style="color:${cat.color};font-weight:600">${cat.id}</span>
              &nbsp;
              <span style="color:rgba(232,232,240,0.5)">${sliced[i]}</span>
              &nbsp;·&nbsp;
              <strong style="color:#E8E8F0">${row[cat.id]}%</strong>
            `
            tip.style.left    = (event.clientX + 14) + 'px'
            tip.style.top     = (event.clientY - 32) + 'px'
            tip.style.opacity = '1'
          })
          .on('mouseleave', function () {
            d3.select(this).attr('r', dim ? 2 : 3.5).attr('opacity', op)
            if (tip) tip.style.opacity = '0'
          })
      })
    })

    // x axis
    const xAxis = g.append('g').attr('transform', `translate(0,${PH})`)
    sliced.forEach(yr => {
      xAxis.append('text')
        .attr('x', x(yr)).attr('y', 14).attr('text-anchor', 'middle')
        .attr('font-size', 11).attr('fill', 'rgba(232,232,240,0.4)').text(yr)
    })
  }, [countryCode, highlightCat, lo, hi])

  useEffect(() => { draw() }, [draw])

  useEffect(() => {
    const ro = new ResizeObserver(draw)
    if (svgRef.current?.parentElement) ro.observe(svgRef.current.parentElement)
    return () => ro.disconnect()
  }, [draw])

  return (
    <div className="geo-area-panel">
      {/* floating tooltip */}
      <div
        ref={tipRef}
        style={{
          position: 'fixed',
          background: 'rgba(18,18,30,0.96)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '6px 12px',
          fontSize: 12,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity .12s',
          zIndex: 200,
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
        }}
      />
      {/* header */}
      {(() => {
        const country = countryCode ? COUNTRIES.find(c => c.code === countryCode) : null
        const accentColor = country ? (CAT_COLOR[country.top] || 'var(--accent)') : 'var(--accent)'
        return (
          <div
            className="d-flex align-items-center flex-wrap gap-2 px-3"
            style={{
              minHeight: 48,
              borderBottom: '1px solid var(--border)',
              borderLeft: `3px solid ${accentColor}`,
              background: flash ? 'rgba(232,240,96,0.05)' : 'var(--surface2)',
              transition: 'background 0.5s, border-left-color 0.3s',
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
                View 2 · Temporal Trend
                {!countryCode && (
                  <span style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1, fontWeight: 400, textTransform: 'none' }}>
                    · linked to map ↑
                  </span>
                )}
              </div>
              {country ? (
                <div style={{ fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 17, lineHeight: 1 }}>{country.flag}</span>
                  {country.name}
                  <span style={{ fontSize: 10, color: accentColor, fontWeight: 600 }}>· {country.top}</span>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Global — all countries</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, opacity: 0.7 }}>
                    ↑ Click a country bubble on the map to see its trend
                  </div>
                </div>
              )}
            </div>

            {/* year range slider */}
            <div className="d-flex align-items-center gap-2 ms-auto">
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Years:</span>
              <DualRangeSlider
                lo={lo} hi={hi} min={0} max={6} labels={YEARS}
                onChange={(newLo, newHi) => { setLo(newLo); setHi(newHi) }}
              />
            </div>
          </div>
        )
      })()}

      {/* legend */}
      <div className="d-flex flex-wrap gap-2 px-3 pt-2" style={{ flexShrink: 0 }}>
        {AREA_CATS.map(cat => (
          <div key={cat.id} className="d-flex align-items-center gap-1" style={{ fontSize: 12, color: 'var(--muted)' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
            {cat.id}
          </div>
        ))}
      </div>

      {/* chart */}
      <div style={{ flex: 1, padding: '8px 12px', overflow: 'hidden', position: 'relative' }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }} />
      </div>

      {/* footnote */}
      <div style={{ padding: '4px 14px 8px', flexShrink: 0, borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', margin: 0, opacity: 0.6, lineHeight: 1.5 }}>
          Y-axis: Video % — share of trending videos in each category for the selected country (or global if none selected)
        </p>
      </div>
    </div>
  )
}

// ── SummaryCard ───────────────────────────────────────────────────────
function SummaryCard({ countryCode }) {
  if (!countryCode) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px 8px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)', flexShrink: 0 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent)' }}>Summary</div>
          <div style={{ fontWeight: 700, fontSize: 13 }}>No country selected</div>
        </div>
        <div style={{ flex: 1, padding: '16px 18px' }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
            Click a country on the map to see engagement, views, and category details.
          </p>
        </div>
      </div>
    )
  }

  const c          = COUNTRIES.find(x => x.code === countryCode)
  const globalEng  = 7.55
  const globalViews = 2800
  const engDiff    = ((c.eng - globalEng) / globalEng * 100).toFixed(0)
  const viewDiff   = ((c.views - globalViews) / globalViews * 100).toFixed(0)
  const engSign    = c.eng   > globalEng   ? '+' : ''
  const viewSign   = c.views > globalViews ? '+' : ''
  const isEngPos   = c.eng   > globalEng
  const isViewPos  = c.views > globalViews
  const topCatName = c.top
  const topColor   = CAT_COLOR[topCatName] || 'var(--accent)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '12px 18px 8px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)', flexShrink: 0 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent)' }}>Summary</div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{c.flag} {c.name}</div>
      </div>
      <div style={{ flex: 1, padding: '16px 18px', overflowY: 'auto' }}>
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Engagement</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>{c.eng.toFixed(2)}</div>
              <div style={{ fontSize: 12, color: isEngPos ? '#50F0A0' : '#F05A7E', marginTop: 3 }}>
                {engSign}{engDiff}% vs global
              </div>
            </div>
          </div>
          <div className="col-6">
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Avg Views</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>
                {c.views >= 1000 ? (c.views / 1000).toFixed(1) + 'M' : c.views + 'K'}
              </div>
              <div style={{ fontSize: 12, color: isViewPos ? '#50F0A0' : '#F05A7E', marginTop: 3 }}>
                {viewSign}{viewDiff}% vs global
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 2 }}>
          Top category: <strong style={{ color: topColor }}>{topCatName}</strong><br />
          Total trending videos: <strong style={{ color: 'var(--text)' }}>{c.vids.toLocaleString()}</strong><br />
          <span style={{ opacity: 0.5, fontSize: 12 }}>↓ Area chart shows temporal trend</span>
        </div>
      </div>
    </div>
  )
}

// ── GeoMap ───────────────────────────────────────────────────────────
function GeoMap({ mode, selectedCountry, selectedCat, onCountryClick, is3D }) {
  const svgRef   = useRef(null)
  const tipRef   = useRef(null)
  const projRef  = useRef(null)
  const worldRef = useRef(null)               // cached atlas data (load once)
  const rotRef   = useRef([0, -20, 0])        // current 3-D rotation
  const zoomRef  = useRef({ k: 1, x: 0, y: 0 }) // current zoom state

  // returns true if [lng, lat] is on the visible hemisphere
  function isVisible3D(lng, lat) {
    const [rl, rp] = rotRef.current
    const p1 = lat * Math.PI / 180,  l1 = lng * Math.PI / 180
    const p0 = -rp * Math.PI / 180,  l0 = -rl * Math.PI / 180
    return Math.sin(p0)*Math.sin(p1) + Math.cos(p0)*Math.cos(p1)*Math.cos(l1-l0) > 0
  }

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const svgEl = svgRef.current
      if (!svgEl) return
      const wrap = svgEl.parentElement
      const W = wrap.offsetWidth  || 700
      const H = wrap.offsetHeight || 500

      const svg = d3.select(svgEl).attr('width', W).attr('height', H)
      svg.selectAll('*').remove()
      zoomRef.current = { k: 1, x: 0, y: 0 }

      // all content lives inside zoomG so scroll-zoom transforms everything at once
      const zoomG = svg.append('g')
      svg.on('wheel.mapzoom', (event) => {
        event.preventDefault()
        const rect = svgEl.getBoundingClientRect()
        const mx = event.clientX - rect.left
        const my = event.clientY - rect.top
        const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15
        const { k: oldK, x: oldX, y: oldY } = zoomRef.current
        const newK = Math.max(0.4, Math.min(8, oldK * factor))
        const newX = mx - (mx - oldX) * newK / oldK
        const newY = my - (my - oldY) * newK / oldK
        zoomRef.current = { k: newK, x: newX, y: newY }
        zoomG.attr('transform', `translate(${newX},${newY}) scale(${newK})`)
      }, { passive: false })

      const projection = is3D
        ? d3.geoOrthographic()
            .scale(Math.min(W / 2.1, H * 0.46))
            .translate([W / 2, H / 2])
            .rotate(rotRef.current)
            .clipAngle(90)
        : d3.geoNaturalEarth1()
            .scale(Math.min(W / 6.0, H / 3.2))
            .translate([W / 2, H / 2 + H * 0.03])

      projRef.current = projection
      const pathGen = d3.geoPath().projection(projection)

      const sphereEl = zoomG.append('path').datum({ type: 'Sphere' }).attr('class', 'sphere').attr('d', pathGen)
      const gratEl   = zoomG.append('path').datum(d3.geoGraticule()()).attr('class', 'graticule').attr('d', pathGen)
      const landG    = zoomG.append('g')
      const borderEl = zoomG.append('path')
        .attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-width', '0.4')

      // wire up drag: rotate in 3D, pan in 2D
      const setupDrag = () => {
        svg.style('cursor', 'grab').call(
          d3.drag()
            .on('start', () => svg.style('cursor', 'grabbing'))
            .on('drag', (event) => {
              if (is3D) {
                // 3D: rotate the globe
                const [rl, rp, rg] = projection.rotate()
                const newRot = [
                  rl + event.dx * 0.4,
                  Math.max(-90, Math.min(90, rp - event.dy * 0.4)),
                  rg,
                ]
                projection.rotate(newRot)
                rotRef.current = newRot

                sphereEl.attr('d', pathGen)
                gratEl.attr('d', pathGen)
                landG.selectAll('path').attr('d', pathGen)
                borderEl.attr('d', pathGen)

                zoomG.selectAll('.bubble-group').each(function () {
                  const c = COUNTRIES.find(x => x.code === this.dataset.code)
                  if (!c) return
                  const vis = isVisible3D(c.lng, c.lat)
                  const pos = vis ? projection([c.lng, c.lat]) : null
                  d3.select(this).style('display', pos ? null : 'none')
                  if (pos) {
                    d3.select(this).selectAll('circle').attr('cx', pos[0]).attr('cy', pos[1])
                    d3.select(this).select('text').attr('x', pos[0]).attr('y', pos[1] + 3.5)
                  }
                })
              } else {
                // 2D: pan the map
                const { k, x, y } = zoomRef.current
                const newX = x + event.dx
                const newY = y + event.dy
                zoomRef.current = { k, x: newX, y: newY }
                zoomG.attr('transform', `translate(${newX},${newY}) scale(${k})`)
              }
            })
            .on('end', () => svg.style('cursor', 'grab'))
        )
      }

      const renderWorld = (data) => {
        landG.selectAll('path').data(data.land.features).join('path')
          .attr('class', 'land').attr('d', pathGen)
        borderEl.datum(data.borders).attr('d', pathGen)
        addBubbles(zoomG, projection, wrap)
        setupDrag()
      }

      if (worldRef.current) {
        renderWorld(worldRef.current)
      } else {
        ;(async () => {
          try {
            const [world, topo] = await Promise.all([
              d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'),
              import('topojson-client'),
            ])
            worldRef.current = {
              land:    topo.feature(world, world.objects.countries),
              borders: topo.mesh(world, world.objects.countries, (a, b) => a !== b),
            }
            renderWorld(worldRef.current)
          } catch {
            addBubbles(zoomG, projection, wrap)
            setupDrag()
          }
        })()
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [is3D])

  // update bubble highlight/dim states on selection change
  useEffect(() => {
    d3.selectAll('.bubble-group').each(function () {
      const g    = d3.select(this)
      const code = this.dataset.code
      g.classed('selected', false).classed('dimmed', false)

      if (mode === 'country' && selectedCountry) {
        if (code === selectedCountry) g.classed('selected', true)
        else g.classed('dimmed', true)
      } else if (mode === 'category' && selectedCat) {
        const c = COUNTRIES.find(x => x.code === code)
        if (c && c.top !== selectedCat) g.classed('dimmed', true)
      }
    })
  }, [mode, selectedCountry, selectedCat])

  function addBubbles(svg, projection, wrap) {
    const tip = tipRef.current

    COUNTRIES.forEach((c, i) => {
      const pos = projection([c.lng, c.lat])
      if (!pos) return
      const [px, py] = pos
      const color = CAT_COLOR[c.top] || '#888'
      const r     = Math.max(9, Math.min(18, 7 + c.vids / 85))
      const startVis = is3D ? isVisible3D(c.lng, c.lat) : true

      const g = svg.append('g')
        .attr('class', 'bubble-group')
        .attr('data-code', c.code)
        .style('color', color)
        .style('opacity', 0)
        .style('display', startVis ? null : 'none')

      g.append('circle')
        .attr('cx', px).attr('cy', py).attr('r', r + 5)
        .attr('fill', 'none').attr('stroke', color)
        .attr('stroke-width', 1).attr('opacity', 0.2)

      if (c.code === 'PH') {
        g.append('circle')
          .attr('cx', px).attr('cy', py).attr('r', r + 10)
          .attr('fill', 'none').attr('stroke', color)
          .attr('stroke-width', 1).attr('opacity', 0.1)
      }

      g.append('circle').attr('class', 'bubble-circle')
        .attr('cx', px).attr('cy', py).attr('r', r)
        .attr('fill', color).attr('fill-opacity', 0.78)
        .attr('stroke', color).attr('stroke-width', 0)

      g.append('text')
        .attr('x', px).attr('y', py + 3.5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '8').attr('font-family', 'Syne, sans-serif')
        .attr('font-weight', '700').attr('fill', 'rgba(0,0,0,0.85)')
        .attr('pointer-events', 'none').text(c.code)

      g.on('mouseenter', function (event) {
        if (!tip) return
        const rect = wrap.getBoundingClientRect()
        let x = event.clientX - rect.left + 14
        let y = event.clientY - rect.top  - 12
        if (x + 165 > wrap.offsetWidth) x -= 180
        tip.style.left    = x + 'px'
        tip.style.top     = y + 'px'
        tip.style.opacity = '1'
        tip.innerHTML     = `
          <div class="tt-country">${c.flag} ${c.name}</div>
          <div class="tt-row"><span>Top Category</span><span style="color:${color}">${c.top}</span></div>
          <div class="tt-row"><span>Engagement</span><span>${c.eng.toFixed(2)}</span></div>
          <div class="tt-row"><span>Avg Views</span><span>${c.views.toLocaleString()}K</span></div>
        `
      })
      .on('mouseleave', () => { if (tip) tip.style.opacity = '0' })
      .on('click', () => onCountryClick(c.code))

      if (startVis) {
        setTimeout(() => g.transition().duration(400).style('opacity', 1), 200 + i * 30)
      }
    })
  }

  return (
    <div className="geo-map-svg-wrap">
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      <div id="geoTip" ref={tipRef} />
    </div>
  )
}

const METRIC_DEFS = {
  videos:     'Video %: share of a country\'s trending videos that belong to this category (e.g. 40% means 40 out of every 100 trending videos are in this category)',
  views:      'Avg Views: average view count per trending video in this category (in thousands)',
  engagement: 'Engagement Score: composite of likes, comments & shares relative to views — scale 0–10; global avg ≈ 7.5',
}

// ── Main GeoExplorer ─────────────────────────────────────────────────
export default function GeoExplorer() {
  const [mode,            setMode]            = useState('country')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedCat,     setSelectedCat]     = useState(null)
  const [metric,          setMetric]          = useState('videos')
  const [highlightCat] = useState(null)
  const [is3D,            setIs3D]            = useState(false)

  const handleCountryClick = useCallback(code => {
    setMode('country')
    setSelectedCountry(code)
    setSelectedCat(null)
  }, [])

  const handleLegendClick = useCallback(catId => {
    setMode('category')
    setSelectedCat(catId)
    setSelectedCountry(null)
  }, [])

  const handleModeToggle = m => {
    setMode(m)
    if (m === 'country') setSelectedCat(null)
    else setSelectedCountry(null)
  }

  const metricLabel = { videos: 'Video %', views: 'Avg Views', engagement: 'Engagement Score' }[metric]

  return (
    <div className="geo-app">

      {/* ── TOP ROW ── */}
      <div className="geo-top-row">

        {/* map panel */}
        <div className="geo-map-panel">
          {/* toolbar */}
          <div
            className="d-flex align-items-center flex-wrap gap-2 px-4"
            style={{ minHeight: 56, padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)', flexShrink: 0 }}
          >
            <div style={{ marginRight: 12, flexShrink: 0 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent)', lineHeight: 1.2 }}>View 1</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>World Map</div>
            </div>
            <div style={{ width: 1, height: 28, background: 'var(--border)', flexShrink: 0, marginRight: 8 }} />
            <span style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginRight: 4 }}>
              Category →
            </span>
            {GEO_CATS.map(cat => (
              <div
                key={cat.id}
                className={`legend-pill ${selectedCat === cat.id ? 'selected' : ''}`}
                style={{ color: cat.color }}
                onClick={() => handleLegendClick(cat.id)}
              >
                <div className="legend-dot" style={{ background: cat.color }} />
                {cat.id}
              </div>
            ))}

            {/* mode toggle */}
            <div className="geo-mode-toggle ms-auto">
              <button
                className={`geo-mode-btn ${mode === 'country' ? 'active' : ''}`}
                onClick={() => handleModeToggle('country')}
              >Country</button>
              <button
                className={`geo-mode-btn ${mode === 'category' ? 'active' : ''}`}
                onClick={() => handleModeToggle('category')}
              >Category</button>
            </div>

            {/* 2D / 3D toggle */}
            <div className="geo-mode-toggle" style={{ marginLeft: 8 }}>
              <button
                className={`geo-mode-btn ${!is3D ? 'active' : ''}`}
                onClick={() => setIs3D(false)}
              >2D</button>
              <button
                className={`geo-mode-btn ${is3D ? 'active' : ''}`}
                onClick={() => setIs3D(true)}
              >3D</button>
            </div>
          </div>

          <GeoMap
            mode={mode}
            selectedCountry={selectedCountry}
            selectedCat={selectedCat}
            onCountryClick={handleCountryClick}
            is3D={is3D}
          />
        </div>

        {/* bar chart panel */}
        <div className="geo-chart-panel">
          {/* header */}
          <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0, background: 'var(--surface2)' }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>
              {mode === 'country' ? 'Country View' : 'Category View'}
            </div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              {mode === 'country' && selectedCountry
                ? `${COUNTRIES.find(c => c.code === selectedCountry)?.flag} ${COUNTRIES.find(c => c.code === selectedCountry)?.name}`
                : mode === 'category' && selectedCat
                ? `${selectedCat} — Global Comparison`
                : 'Explore the Data'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>
              {selectedCountry || selectedCat
                ? `Category breakdown · ${metricLabel}`
                : 'Select a bubble or legend item to begin.'}
            </div>
          </div>

          {/* metric tabs */}
          <div className="d-flex align-items-center gap-1 px-3" style={{ borderBottom: '1px solid var(--border)', height: 38, flexShrink: 0 }}>
            <span style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', marginRight: 4 }}>Metric:</span>
            {['videos', 'views', 'engagement'].map(m => (
              <button key={m} className={`metric-tab ${metric === m ? 'active' : ''}`} onClick={() => setMetric(m)}>
                {m === 'videos' ? 'Video %' : m === 'views' ? 'Avg Views' : 'Engagement'}
              </button>
            ))}
          </div>

          <BarChart
            mode={mode}
            selectedCountry={selectedCountry}
            selectedCat={selectedCat}
            metric={metric}
          />

          {/* metric definition */}
          <div style={{ padding: '8px 18px 12px', flexShrink: 0, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', margin: 0, lineHeight: 1.6, opacity: 0.7 }}>
              {METRIC_DEFS[metric]}
            </p>
          </div>

          {/* status bar */}
          <div
            className="d-flex justify-content-between px-3"
            style={{ height: 30, borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--surface2)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', alignItems: 'center' }}
          >
            <span>Mode: <span style={{ color: 'var(--accent)' }}>{mode === 'country' ? 'Country' : 'Category'}</span></span>
            <span>Selected: <span style={{ color: 'var(--accent)' }}>{selectedCountry || selectedCat || '—'}</span></span>
            <span>Metric: <span style={{ color: 'var(--accent)' }}>{metricLabel}</span></span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="geo-bottom-row">
        <AreaChart
          countryCode={selectedCountry}
          highlightCat={highlightCat}
        />

        <SummaryCard countryCode={selectedCountry} />
      </div>
    </div>
  )
}
  