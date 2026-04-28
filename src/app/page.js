'use client'
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
              <div className="eyebrow">Prologue</div>
              <h2 className="section-heading">Every day, millions compete for one spot.</h2>
              <div className="rule" />
              <p className="body-text">
                YouTube&apos;s trending tab is one of the most competitive surfaces on the
                internet — a daily snapshot of what a nation collectively decides is worth
                watching. But behind the algorithm lie patterns that reveal something deeper:
                the geography of taste, the rhythm of culture, and the vocabulary of attention.
              </p>
              <p className="body-text">
                TrendScope is our attempt to make those patterns visible — and navigable.
              </p>
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {[
                  { num: '4.6M', label: '2024 peak avg views',        color: 'var(--accent)' },
                  { num: '8.27', label: 'Philippines top engagement',  color: 'var(--red)' },
                  { num: '14',   label: 'Countries where Music is #1', color: 'var(--accent)' },
                  { num: '~0',   label: 'Clickbait to engagement r',   color: 'var(--red)' },
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
            <div className="ch-text-title">The Geography of Trending</div>
            <div className="ch-text-sub">Where you are shapes what you watch.</div>
          </div>
        </div>

        {/* CHAPTER I NARRATIVE */}
        <section className="narrative reveal">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            <div>
              <div className="eyebrow">Chapter I - Geography</div>
              <h2 className="section-heading">
                Music unites the world.<br /><em>Everything else</em> divides it.
              </h2>
              <div className="rule" />
              <p className="body-text">
                Across 23 countries, one pattern dominates: <strong>Music</strong> is the #1
                trending category in 14 of them — from Brazil to Japan to Germany.
              </p>
              <p className="body-text">
                Entertainment dominates in Southeast Asia and parts of Africa. People and Blogs
                leads in Egypt and Pakistan. And the Philippines stands alone with the highest
                engagement score globally at <strong>8.27</strong>.
              </p>
              <div style={{ display: 'flex', gap: 10, fontSize: 12, fontStyle: 'italic', color: 'var(--muted)', marginTop: 16, opacity: 0.8 }}>
                <span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>&#8627;</span>
                Scroll down to explore the interactive map.
              </div>
            </div>
            <div>
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
        <div id="geo-section" style={{ padding: '72px 56px 40px', maxWidth: 860 }}>
          <div className="eyebrow">Interactive Explorer — Views 1 and 2</div>
          <h2 className="section-heading">Now explore it yourself.</h2>
          <p className="body-text">
            Click any bubble on the map to filter the dashboard. The bar chart shows that
            country&apos;s category breakdown. The stacked area chart shows how those categories
            evolved over time — drag the slider to zoom into any time window.
          </p>
        </div>
        <GeoExplorer />

        {/* CHAPTER II BREAK */}
        <div className="ch-break reveal" id="ch2" style={{ marginTop: 80 }}>
          <div className="ch-num">II</div>
          <div>
            <div className="ch-text-title">The Hierarchy of Attention</div>
            <div className="ch-text-sub">Not all views are created equal.</div>
          </div>
        </div>
        <GroupedBar />

        {/* CHAPTER III BREAK */}
        <div className="ch-break reveal" id="ch3">
          <div className="ch-num">III</div>
          <div>
            <div className="ch-text-title">The Language of Trending Titles</div>
            <div className="ch-text-sub">What you say matters less than how you say it.</div>
          </div>
        </div>
        <TitleAnalysis />

        {/* CLOSING */}
        <section
          id="closing"
          className="reveal"
          style={{ padding: '120px 56px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div className="eyebrow">Epilogue</div>
          <h2 className="section-heading" style={{ textAlign: 'center', maxWidth: 640 }}>
            The algorithm does not decide culture.<br /><em>People do.</em>
          </h2>
          <p className="body-text" style={{ textAlign: 'center', margin: '0 auto 32px' }}>
            Six years of data tell a consistent story: authentic engagement beats manufactured
            attention. Music crosses every border. Science builds the deepest communities.
            And 2024 showed us that YouTube&apos;s ceiling is still rising.
          </p>
          <a href="#cover" className="cta-btn">Back to the Beginning</a>
          <div style={{ marginTop: 48, fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
            TrendScope - InfoVis Final Project - Qianyin Tan - Junjun Sun - Mingxi Xiao
          </div>
        </section>
      </main>
    </>
  )
}