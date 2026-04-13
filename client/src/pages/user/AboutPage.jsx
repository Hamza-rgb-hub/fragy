import { useEffect, useRef, useState } from "react";
import "../../Style/about.css";

const values = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Heritage",
    desc: "Over fifteen years of crafting timeless scents rooted in old-world perfumery traditions.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Purity",
    desc: "Only the finest natural ingredients — ethically sourced, never compromised.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: "Artistry",
    desc: "Each bottle is a canvas — designed by hand, filled with intention, worn as identity.",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const About = () => {
  const [heroRef, heroIn] = useInView(0.1);
  const [storyRef, storyIn] = useInView(0.1);
  const [valuesRef, valuesIn] = useInView(0.1);

  return (
    <>
      <section className="about-root">
        <div className="noise" />

        {/* ── HERO ── */}
        <div className="about-hero" ref={heroRef}>
          <div className={`hero-eyebrow reveal ${heroIn ? "visible" : ""}`}>
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Our Story</span>
            <div className="eyebrow-line" />
          </div>
          <h1 className={`hero-title reveal reveal-d1 ${heroIn ? "visible" : ""}`}>
            The Art of<br /><em>Invisible Luxury</em>
          </h1>
          <p className={`hero-sub reveal reveal-d2 ${heroIn ? "visible" : ""}`}>
            We believe a fragrance is not merely a scent — it is a signature, a memory, a second skin woven from the rarest botanicals on earth.
          </p>
        </div>

        {/* ── STORY ── */}
        <div className="about-story" ref={storyRef}>

          {/* Visual side — static image replaces SVG bottle */}
          <div className={`story-visual reveal ${storyIn ? "visible" : ""}`}>

            {/* Ambient glow */}
            <div className="bottle-glow" />

            {/* Decorative rings */}
            <div className="bottle-ring" style={{ width: 340, height: 340, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
            <div className="bottle-ring" style={{ width: 260, height: 260, top: "50%", left: "50%", transform: "translate(-50%,-50%)", borderStyle: "dashed", opacity: 0.5 }} />

            <img
              src="/gen1.png"
              alt="FRAGY signature bottle"
              className="story-bottle-img"
            />

            {/* Floating particles */}
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                width: 5, height: 5, borderRadius: "50%",
                background: "#c9a84c",
                opacity: 0.2 + i * 0.06,
                top: `${22 + i * 13}%`,
                left: `${18 + (i % 2) * 55}%`,
                animation: `floatP${i} ${2.5 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
                pointerEvents: "none",
              }} />
            ))}
          </div>

          {/* Text side */}
          <div className="story-text">
            <div className={`section-tag reveal ${storyIn ? "visible" : ""}`}>
              <div className="tag-line" />
              <span className="tag-label">Founded 2009</span>
            </div>

            <h2 className={`section-heading reveal reveal-d1 ${storyIn ? "visible" : ""}`}>
              Born from<br /><em>Obsession</em>
            </h2>

            <p className={`section-body reveal reveal-d2 ${storyIn ? "visible" : ""}`}>
              AROMA was born in a small Parisian atelier, where master perfumer Élise Valmont spent seven years perfecting her first accord. What began as a personal obsession with the language of scent became a quietly revered house — one that never compromised craft for commerce.
            </p>

            <div className={`divider-ornament reveal reveal-d2 ${storyIn ? "visible" : ""}`}>
              <div className="orn-line" />
              <div className="orn-diamond" />
              <div className="orn-line-long" />
            </div>

            <p className={`section-body reveal reveal-d3 ${storyIn ? "visible" : ""}`}>
              Today, every bottle carries the weight of that origin — hand-blended, slow-cured, and composed the way a poem is written: with silence between the notes as much as the notes themselves.
            </p>

            {/* Signature */}
            <div className={`reveal reveal-d4 ${storyIn ? "visible" : ""}`} style={{ marginTop: "32px" }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "28px", fontWeight: 400, fontStyle: "italic",
                color: "rgba(201,168,76,0.7)", letterSpacing: "0.04em",
              }}>
                Élise Valmont
              </span>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontSize: "9.5px",
                fontWeight: 300, letterSpacing: "0.42em",
                color: "rgba(255,255,255,0.22)", textTransform: "uppercase",
                marginTop: "6px",
              }}>
                Founder & Master Perfumer
              </p>
            </div>
          </div>
        </div>

        {/* ── VALUES ── */}
        <div className="about-values" ref={valuesRef}>
          <div className="values-header">
            <div className={`section-tag reveal ${valuesIn ? "visible" : ""}`}
              style={{ justifyContent: "center" }}>
              <div className="tag-line" />
              <span className="tag-label">What We Stand For</span>
              <div className="tag-line" />
            </div>
            <h2 className={`section-heading reveal reveal-d1 ${valuesIn ? "visible" : ""}`}
              style={{ textAlign: "center", marginTop: "8px" }}>
              Our <em>Pillars</em>
            </h2>
          </div>

          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className={`value-card reveal reveal-d${i + 1} ${valuesIn ? "visible" : ""}`}>
                <div className="value-icon">{v.icon}</div>
                <div style={{ height: "1px", width: "28px", background: "rgba(201,168,76,0.3)" }} />
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="about-stats">
          {[["250+","Fragrances"],["15","Years"],["18","Awards"],["99K","Clients"]].map(([num, label]) => (
            <div key={label} className="stat-cell">
              <span className="stat-num">{num}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>

        {/* ── QUOTE ── */}
        <div className="about-quote">
          <div className="quote-mark">"</div>
          <p className="quote-text">
            Perfume is the art that makes memory speak — it is the invisible part of a person's identity, and the most powerful.
          </p>
          <span className="quote-author">— Élise Valmont, FRAGY</span>
        </div>
      </section>
    </>
  );
};

export default About;