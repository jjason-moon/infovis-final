'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Cover from '@/components/Cover'
import ScrollObserver from '@/components/ScrollObserver'

const GeoExplorer   = dynamic(() => import('@/components/GeoExplorer'),   { ssr: false })
const GroupedBar    = dynamic(() => import('@/components/GroupedBar'),    { ssr: false })
const TitleAnalysis = dynamic(() => import('@/components/TitleAnalysis'), { ssr: false })

function PodiumCard({ rank, flag, country, value, cardStyle }) {
  const styles = {
    gold:   { background: 'rgba(240,160,80,0.1)',   border: '1px solid rgba(240,160,80,0.3)' },
    silver: { background: 'rgba(160,160,160,0.08)', border: '1px solid rgba(160,160,160,0.2)' },
    bronze: { background: 'rgba(180,120,60,0.06)',  border: '1px solid rgba(180,120,60,0.18)' },
  }
  return (
    <div style={{ flex: 1, minWidth: 140, padding: 18, borderRadius: 6, position: 'relative', ...styles[cardStyle] }}>
      <div style={{ fontFamily: 'Georgia,serif', fontSize: 26, fontWeight: 900, opacity: 0.15, position: 'absolute', top: 10, right: 14 }}>{rank}</div>
      <div style={{ fontSize: 26, marginBottom: 6 }}>{flag}</div>
      <div style={{ fontWeight: 700, fontSize: 16 }}>{country}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>Engagement Score</div>
      <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--red)', marginTop: 3 }}>{value}</div>
    </div>
  )
}

export default function Home() {
  const [geoSelectedCat, setGeoSelectedCat] = useState(null)
  return (
    <>
      <ScrollObserver />
      <Navbar />
      <main style={{ paddingTop: 52 }}>
        <Cover />

        {/* PROLOGUE */}
        <section className="narrative reveal" id="intro">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            <div>
              <div className="eyebrow">Your Guide to Going Viral</div>
              <h2 className="section-heading">
                Want to trend on YouTube?<br /><em>Here&apos;s what the data says.</em>
              </h2>
              <div className="rule" />
              <p className="body-text">
                We dug through <strong>10,000 trending videos</strong> across 23 countries
                and 6 years to find the patterns. Spoiler: it&apos;s not about clickbait.
                It&apos;s about market, format, and covering things people actually care about.
              </p>
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {[
                  { num: '10K',  label: 'Trending videos analyzed', color: 'var(--accent)' },
                  { num: '23',   label: 'Countries in the dataset',  color: 'var(--red)' },
                  { num: '7',    label: 'Years of data (2020–2026)', color: 'var(--accent)' },
                  { num: '~0',   label: 'Clickbait↔view rate r',   color: 'var(--red)' },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div className="stat-num" style={{ color: s.color }}>{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="pull-quote">
                Culture does not travel the internet uniformly — it clusters, diverges, and surprises.
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER I BREAK */}
        <div className="ch-break reveal" id="ch1">
          <div className="ch-num">I</div>
          <div>
            <div className="ch-text-title">Find Your Market</div>
            <div className="ch-text-sub">Where you want to be viral determines what you should make.</div>
          </div>
        </div>

        {/* CHAPTER I NARRATIVE */}
        <section className="narrative reveal">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            <div>
              <div className="eyebrow">Chapter I - Geography</div>
              <h2 className="section-heading">
                Music is the safest bet.<br /><em>But every market</em> is different.
              </h2>
              <div className="rule" />
              <p className="body-text">
                Music tops the trending tab in <strong>14 of 23 countries</strong> — the safest
                bet if you&apos;re starting out. But audiences differ by region: the Philippines
                leads globally with an engagement score of <strong>8.27</strong>, Entertainment
                rules Southeast Asia, News dominates the Middle East.
                <strong> Pick your market first, then decide what to make.</strong>
              </p>
            </div>
            <div>
              <div style={{ marginBottom: 10, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)' }}>
                Top engagement scores globally
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <PodiumCard rank="1" flag="🇵🇭" country="Philippines" value="8.27" cardStyle="gold" />
                <PodiumCard rank="2" flag="🇦🇺" country="Australia"   value="7.91" cardStyle="silver" />
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <PodiumCard rank="3" flag="🇧🇷" country="Brazil"  value="7.89" cardStyle="bronze" />
                <PodiumCard rank="3" flag="🇨🇦" country="Canada"  value="7.89" cardStyle="bronze" />
              </div>
            </div>
          </div>
        </section>

        {/* GEO EXPLORER */}
        <div id="geo-section" style={{ padding: '48px 56px 32px', maxWidth: 860 }}>
          <div className="eyebrow">Interactive — Views 1 and 2</div>
          <h2 className="section-heading" style={{ fontSize: 'clamp(24px,3vw,38px)' }}>
            Explore any country. See how its trends evolve.
          </h2>
          <p className="body-text">
            Click a country bubble to see its category breakdown and how that mix has
            shifted year by year. Switch to Category mode to compare which countries
            are strongest for a given content type.
          </p>
        </div>
        <GeoExplorer onCategoryChange={setGeoSelectedCat} />

        {/* CHAPTER II BREAK */}
        <div className="ch-break reveal" id="ch2" style={{ marginTop: 80 }}>
          <div className="ch-num">II</div>
          <div>
            <div className="ch-text-title">Understand Your Audience</div>
            <div className="ch-text-sub">Likes, comments, video length — every category has its own signature.</div>
          </div>
        </div>
        <GroupedBar highlightCat={geoSelectedCat} />

        {/* CHAPTER III BREAK */}
        <div className="ch-break reveal" id="ch3">
          <div className="ch-num">III</div>
          <div>
            <div className="ch-text-title">What Gets Clicked</div>
            <div className="ch-text-sub">Real events and real names beat clickbait every time.</div>
          </div>
        </div>
        <TitleAnalysis />

        {/* CLOSING */}
        <section
          id="closing"
          className="reveal"
          style={{ padding: '120px 56px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div className="eyebrow">The Playbook</div>
          <h2 className="section-heading" style={{ textAlign: 'center', maxWidth: 700 }}>
            Pick your market. Know your audience.<br /><em>Be honest.</em>
          </h2>
          <p className="body-text" style={{ textAlign: 'center', margin: '0 auto 16px', maxWidth: 560 }}>
            The data tells a consistent story across 10,000 videos and six years:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 680, margin: '0 auto 40px', textAlign: 'left' }}>
            {[
              { num: '01', title: 'Find your market', body: 'Music works everywhere, but high-engagement audiences are in PH, AU, BR. Know where you want to be seen.' },
              { num: '02', title: 'Choose your lane', body: 'Music earns the most likes. News sparks the most comments. Gaming runs longest at 25 min avg. Know what engagement your category naturally attracts.' },
              { num: '03', title: 'Cover real events', body: 'Clickbait has near-zero correlation with views (r=0.007). High-view titles reference real events (World Cup, Olympics) and real people. Specificity wins.' },
            ].map(s => (
              <div key={s.num} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: 20 }}>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 900, color: 'var(--accent)', opacity: 0.3, marginBottom: 8 }}>{s.num}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{s.body}</div>
              </div>
            ))}
          </div>
          <a href="#cover" className="cta-btn">Back to the Top</a>
          <div style={{ marginTop: 48, fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
            TrendScope — InfoVis Final Project — Qianyin Tan · Junjun Sun · Mingxi Xiao
          </div>
        </section>
      </main>
    </>
  )
}
