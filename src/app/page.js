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
              <div className="eyebrow">Your Guide to Going Viral</div>
              <h2 className="section-heading">
                So you want to be a creator.
              </h2>
              <div className="rule" />
              <p className="body-text">
                Every day, millions of videos compete for a spot on YouTube&apos;s trending tab —
                a daily snapshot of what the world collectively decides is worth watching.
                But what actually drives that decision? Is it the category you choose?
                The country you target? The way you write your title?
              </p>
              <p className="body-text">
                We analyzed <strong>10,000 trending videos</strong> across 23 countries and
                6 years to find out. This is your data-driven playbook.
              </p>
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {[
                  { num: '10K',  label: 'Trending videos analyzed', color: 'var(--accent)' },
                  { num: '23',   label: 'Countries in the dataset',  color: 'var(--red)' },
                  { num: '6',    label: 'Years of data (2020–2026)', color: 'var(--accent)' },
                  { num: '~0',   label: 'Clickbait↔engagement r',   color: 'var(--red)' },
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
                Music is the #1 trending category in <strong>14 out of 23 countries</strong> —
                the most globally consistent content type on the platform. If you have no strong
                preference, Music is your safest entry point.
              </p>
              <p className="body-text">
                But regional patterns diverge sharply. Entertainment dominates Southeast Asia
                and parts of Africa. People &amp; Blogs leads in Egypt and Pakistan.
                The Philippines stands alone with the highest engagement score globally
                at <strong>8.27</strong> — a highly active, emotionally engaged audience.
              </p>
              <p className="body-text">
                Before you decide what to make, decide <em>where</em> you want to be seen.
                Then use the map below to study that market.
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
        <GeoExplorer />

        {/* CHAPTER II BREAK */}
        <div className="ch-break reveal" id="ch2" style={{ marginTop: 80 }}>
          <div className="ch-num">II</div>
          <div>
            <div className="ch-text-title">Understand Your Audience</div>
            <div className="ch-text-sub">Likes, comments, video length — every category has its own signature.</div>
          </div>
        </div>
        <GroupedBar />

        {/* CHAPTER III BREAK */}
        <div className="ch-break reveal" id="ch3">
          <div className="ch-num">III</div>
          <div>
            <div className="ch-text-title">Write a Better Title</div>
            <div className="ch-text-sub">The data on what actually makes people click — and stay.</div>
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
              { num: '02', title: 'Choose your lane', body: 'Science earns the most likes. News sparks the most comments. Gaming runs longest at 25 min avg. Know what engagement your category naturally attracts.' },
              { num: '03', title: 'Write with honesty', body: 'Clickbait scores near-zero correlation with engagement. Titles with "honest", "real", "first time" consistently outperform.' },
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
