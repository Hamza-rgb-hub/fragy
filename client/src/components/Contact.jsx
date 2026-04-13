import { useState, useEffect, useRef } from "react";
import "../Style/contact.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [focused, setFocused] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1800);
  };

  const infoCards = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: "Atelier",
      value: "12 Rue de la Paix",
      sub: "Paris, France 75001",
      accent: "#c9a84c",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.45 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.58a16 16 0 0 0 5.51 5.51l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: "Consultation",
      value: "+33 1 42 86 00 00",
      sub: "Mon–Sat, 10am–7pm CET",
      accent: "#a78bfa",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: "Correspondence",
      value: "maison@aroma.com",
      sub: "Response within 24 hours",
      accent: "#e8927c",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: "Hours",
      value: "Mon – Sat",
      sub: "10:00 AM — 7:00 PM",
      accent: "#6ee7b7",
    },
  ];

  const subjects = ["General Enquiry", "Bespoke Order", "Wholesale", "Press & Media", "Other"];

  return (
    <>
     <section
        ref={sectionRef}
        className="section-padding"
        style={{
          background: "#090806",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          padding: "100px 0 90px",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        {/* Noise overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }} />

        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: -80, left: "50%",
          transform: "translateX(-50%)",
          width: "min(700px, 90vw)", height: 340,
          background: "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, right: "10%",
          width: "min(400px, 50vw)", height: 300,
          background: "radial-gradient(ellipse, rgba(167,139,250,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Top rule */}
        <div style={{
          position: "absolute", top: 0, left: "4%", right: "4%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
        }} />

        {/* Decorative orbiting rings — hidden on small screens */}
        <div style={{
          position: "absolute", left: -80, top: "30%",
          width: 320, height: 320,
          border: "1px dashed rgba(201,168,76,0.1)",
          borderRadius: "50%",
          animation: "spinSlow 30s linear infinite",
          pointerEvents: "none",
          display: "block",
        }}
          className="orbit-ring"
        >
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 200, height: 200,
            border: "1px dashed rgba(201,168,76,0.07)",
            borderRadius: "50%",
            animation: "spinSlowReverse 20s linear infinite",
          }} />
          <div style={{
            position: "absolute", top: 0, left: "50%",
            transform: "translateX(-50%)",
            width: 5, height: 5,
            borderRadius: "50%",
            background: "#c9a84c",
            opacity: 0.6,
            animation: "floatDot 3s ease-in-out infinite",
          }} />
        </div>

        <div className="outer-padding" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 12px" }}>

          {/* ── Section header ── */}
          <div className={`contact-reveal d1 ${visible ? "visible" : ""}`}
            style={{ textAlign: "center", marginBottom: 58 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 14,
              color: "#c9a84c", fontSize: 9,
              letterSpacing: "0.3em", textTransform: "uppercase",
              fontWeight: 400, marginBottom: 20,
            }}>
              <div style={{ width: 36, height: 1, background: "linear-gradient(90deg, transparent, #c9a84c)" }} />
              Get In Touch
              <div style={{ width: 36, height: 1, background: "linear-gradient(270deg, transparent, #c9a84c)" }} />
            </div>

            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 5vw, 62px)",
              fontWeight: 600, color: "#f5f0e8",
              letterSpacing: "0.04em", lineHeight: 1.1,
              margin: "0 0 14px",
            }}>
              A Word{" "}
              <em style={{
                backgroundImage: "linear-gradient(90deg, #c9a84c, #e8d5a0, #c9a84c)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "shimmer 4s linear infinite",
                fontStyle: "italic",
              }}>
                Awaits You
              </em>
            </h2>

            <p style={{
              fontSize: "clamp(12px, 1.5vw, 13px)", fontWeight: 300,
              color: "rgba(245,240,232,0.42)",
              letterSpacing: "0.08em",
              maxWidth: 400, margin: "0 auto",
              lineHeight: 1.85,
            }}>
              Whether you seek a bespoke creation, a rare bottle, or simply wish to speak with our perfumers — we are here, always.
            </p>
          </div>

          {/* ── Info Cards Row ── */}
          <div className={`info-grid contact-reveal d2 ${visible ? "visible" : ""}`}>
            {infoCards.map((card, i) => (
              <div
                key={i}
                className="info-card"
                onMouseEnter={() => setHoveredInfo(i)}
                onMouseLeave={() => setHoveredInfo(null)}
                style={{
                  borderColor: hoveredInfo === i ? `${card.accent}55` : "rgba(201,168,76,0.14)",
                  boxShadow: hoveredInfo === i ? `0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${card.accent}14` : "none",
                }}
              >
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  height: 2, width: hoveredInfo === i ? "100%" : "0%",
                  background: `linear-gradient(90deg, ${card.accent}, transparent)`,
                  transition: "width 0.45s ease",
                }} />
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  width: 14, height: 14,
                  borderTop: `1.5px solid ${card.accent}`,
                  borderLeft: `1.5px solid ${card.accent}`,
                  opacity: hoveredInfo === i ? 1 : 0.35,
                  transition: "opacity 0.3s",
                }} />
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 14, height: 14,
                  borderBottom: `1.5px solid ${card.accent}`,
                  borderRight: `1.5px solid ${card.accent}`,
                  opacity: hoveredInfo === i ? 1 : 0.35,
                  transition: "opacity 0.3s",
                }} />
                <div style={{
                  width: 42, height: 42,
                  border: `1px solid ${card.accent}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 14, color: card.accent,
                  clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                  background: hoveredInfo === i ? `${card.accent}20` : `${card.accent}10`,
                  transition: "background 0.3s",
                }}>
                  {card.icon}
                </div>
                <div style={{
                  fontSize: 9, letterSpacing: "0.22em",
                  textTransform: "uppercase", color: card.accent,
                  fontWeight: 400, marginBottom: 6,
                }}>
                  {card.label}
                </div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(14px, 1.5vw, 16px)", fontWeight: 500,
                  color: "#f5f0e8", letterSpacing: "0.04em",
                  marginBottom: 3, lineHeight: 1.3,
                }}>
                  {card.value}
                </div>
                <div style={{
                  fontSize: 11, color: "rgba(245,240,232,0.38)",
                  fontWeight: 300, letterSpacing: "0.05em",
                }}>
                  {card.sub}
                </div>
              </div>
            ))}
          </div>

          {/* ── Main grid: Form + Right Column ── */}
          <div className="contact-grid">

            {/* ── Contact Form ── */}
            <div
              className={`form-panel contact-reveal d3 ${visible ? "visible" : ""}`}
              style={{
                position: "relative",
                border: "1px solid rgba(201,168,76,0.18)",
                padding: "44px 42px",
                background: "rgba(12,10,8,0.6)",
                backdropFilter: "blur(8px)",
              }}
            >
              {[["top","left"],["bottom","right"]].map(([v,h],i) => (
                <div key={i} style={{
                  position: "absolute",
                  [v]: 0, [h]: 0,
                  width: 22, height: 22,
                  [`border${v.charAt(0).toUpperCase()+v.slice(1)}`]: "1.5px solid #c9a84c",
                  [`border${h.charAt(0).toUpperCase()+h.slice(1)}`]: "1.5px solid #c9a84c",
                  opacity: 0.7,
                }} />
              ))}

              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 600,
                color: "#f5f0e8", letterSpacing: "0.05em",
                marginBottom: 6,
              }}>
                Send a Message
              </div>
              <div style={{
                width: 40, height: 1,
                background: "linear-gradient(90deg, #c9a84c, transparent)",
                marginBottom: 28,
              }} />

              {submitted ? (
                <div style={{
                  textAlign: "center",
                  padding: "48px 20px",
                  animation: "successScale 0.5s ease forwards",
                }}>
                  <div style={{
                    width: 72, height: 72,
                    border: "1.5px solid #c9a84c",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 22px",
                    animation: "pulseRing 3s ease-in-out infinite",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                      <polyline
                        points="20 6 9 17 4 12"
                        style={{
                          strokeDasharray: 40,
                          animation: "checkDraw 0.6s 0.3s ease forwards",
                          strokeDashoffset: 40,
                        }}
                      />
                    </svg>
                  </div>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 600,
                    color: "#f5f0e8", letterSpacing: "0.05em",
                    marginBottom: 10,
                  }}>
                    Message Received
                  </div>
                  <p style={{
                    fontSize: 12, fontWeight: 300,
                    color: "rgba(245,240,232,0.42)",
                    letterSpacing: "0.07em", lineHeight: 1.85,
                    maxWidth: 300, margin: "0 auto 28px",
                  }}>
                    Our perfumers will respond within 24 hours. A rare conversation awaits.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name:"", email:"", subject:"", message:"" }); }}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(201,168,76,0.35)",
                      color: "rgba(245,240,232,0.6)",
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 9, letterSpacing: "0.2em",
                      textTransform: "uppercase", fontWeight: 400,
                      padding: "10px 28px", cursor: "pointer",
                      clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="#c9a84c"; e.currentTarget.style.color="#c9a84c"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(201,168,76,0.35)"; e.currentTarget.style.color="rgba(245,240,232,0.6)"; }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Row 1: Name + Email */}
                  <div className="form-row">
                    {[
                      { name: "name", label: "Full Name", type: "text", placeholder: "Élise Valmont" },
                      { name: "email", label: "Email Address", type: "email", placeholder: "elise@maison.com" },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="label-float"
                          style={{ color: focused === f.name ? "#c9a84c" : "rgba(201,168,76,0.6)" }}>
                          {f.label}
                        </label>
                        <input
                          className="aroma-input"
                          type={f.type}
                          name={f.name}
                          value={formData[f.name]}
                          placeholder={f.placeholder}
                          onChange={handleChange}
                          onFocus={() => setFocused(f.name)}
                          onBlur={() => setFocused("")}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <label className="label-float"
                      style={{ color: focused === "subject" ? "#c9a84c" : "rgba(201,168,76,0.6)" }}>
                      Subject
                    </label>
                    <select
                      className="aroma-input aroma-select"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocused("subject")}
                      onBlur={() => setFocused("")}
                      required
                    >
                      <option value="" disabled>Select a subject…</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div style={{ marginBottom: 36 }}>
                    <label className="label-float"
                      style={{ color: focused === "message" ? "#c9a84c" : "rgba(201,168,76,0.6)" }}>
                      Your Message
                    </label>
                    <textarea
                      className="aroma-input"
                      name="message"
                      value={formData.message}
                      placeholder="Tell us about your fragrance journey…"
                      rows={5}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused("")}
                      required
                    />
                  </div>

                  <div className="submit-row">
                    <button type="submit" className="send-btn" disabled={sending}>
                      {sending ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            style={{ animation: "spinSlow 0.9s linear infinite" }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                          Send Message
                        </>
                      )}
                    </button>
                    <p style={{
                      fontSize: 10, color: "rgba(245,240,232,0.25)",
                      letterSpacing: "0.1em", fontWeight: 300,
                    }}>
                      We reply within 24 hours
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* ── Right Column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Brand identity block */}
              <div
                className={`brand-panel contact-reveal d4 ${visible ? "visible" : ""}`}
                style={{
                  position: "relative",
                  border: "1px solid rgba(201,168,76,0.18)",
                  padding: "34px 30px",
                  background: "rgba(12,10,8,0.5)",
                  overflow: "hidden",
                  flex: "0 0 auto",
                }}
              >
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  width: 20, height: 20,
                  borderTop: "1.5px solid #c9a84c",
                  borderLeft: "1.5px solid #c9a84c",
                  opacity: 0.6,
                }} />
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 20, height: 20,
                  borderBottom: "1.5px solid #c9a84c",
                  borderRight: "1.5px solid #c9a84c",
                  opacity: 0.6,
                }} />

                <div style={{
                  position: "absolute", top: "30%", right: -20,
                  width: 180, height: 180,
                  background: "radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 70%)",
                  animation: "pulseRing 4s ease-in-out infinite",
                  pointerEvents: "none",
                }} />

                <div style={{ marginBottom: 18 }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 600,
                    color: "#c9a84c", letterSpacing: "0.22em",
                    lineHeight: 1,
                  }}>
                    AROMA
                  </div>
                  <div style={{
                    fontSize: 9, letterSpacing: "0.3em",
                    color: "rgba(201,168,76,0.55)",
                    textTransform: "uppercase", fontWeight: 300,
                    marginTop: 3,
                  }}>
                    Maison de Parfum
                  </div>
                </div>

                <div style={{
                  width: 36, height: 1,
                  background: "linear-gradient(90deg, #c9a84c, transparent)",
                  marginBottom: 16,
                }} />

                <p style={{
                  fontSize: 12, fontWeight: 300,
                  color: "rgba(245,240,232,0.42)",
                  lineHeight: 1.9, letterSpacing: "0.05em",
                  marginBottom: 22,
                }}>
                  Founded in Paris, 2009. Every fragrance we create begins with a conversation — a whisper of memory, a vision of desire, a story yet untold.
                </p>

                <div style={{
                  borderTop: "1px solid rgba(201,168,76,0.12)",
                  paddingTop: 20,
                  marginBottom: 20,
                }}>
                  <div style={{
                    fontSize: 9, letterSpacing: "0.22em",
                    textTransform: "uppercase", color: "#c9a84c",
                    fontWeight: 400, marginBottom: 12,
                  }}>
                    Follow the Maison
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[
                      { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>, label: "Instagram" },
                      { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, label: "Facebook" },
                      { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>, label: "TikTok" },
                      { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"/></svg>, label: "Twitter" },
                    ].map((s) => (
                      <a key={s.label} href="#" className="social-link" title={s.label}>
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Newsletter strip */}
                <div style={{
                  borderTop: "1px solid rgba(201,168,76,0.12)",
                  paddingTop: 18,
                }}>
                  <div style={{
                    fontSize: 9, letterSpacing: "0.22em",
                    textTransform: "uppercase", color: "#c9a84c",
                    fontWeight: 400, marginBottom: 10,
                  }}>
                    Rare Drops — Newsletter
                  </div>
                  <div style={{ display: "flex", gap: 0 }}>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      style={{
                        flex: 1,
                        minWidth: 0,
                        background: "rgba(201,168,76,0.05)",
                        border: "1px solid rgba(201,168,76,0.22)",
                        borderRight: "none",
                        color: "#f5f0e8",
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 11, fontWeight: 300,
                        letterSpacing: "0.06em",
                        padding: "9px 14px",
                        outline: "none",
                        clipPath: "polygon(6px 0%, 100% 0%, 100% 100%, 0% 100%)",
                      }}
                    />
                    <button style={{
                      background: "#c9a84c",
                      border: "none",
                      color: "#090806",
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 9, letterSpacing: "0.18em",
                      textTransform: "uppercase", fontWeight: 600,
                      padding: "9px 16px",
                      cursor: "pointer",
                      clipPath: "polygon(0% 0%, calc(100% - 6px) 0%, 100% 100%, 0% 100%)",
                      whiteSpace: "nowrap",
                      transition: "opacity 0.2s",
                      flexShrink: 0,
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>

              {/* Quote block */}
              <div className={`contact-reveal d5 ${visible ? "visible" : ""}`}
                style={{
                  border: "1px solid rgba(201,168,76,0.13)",
                  padding: "28px 28px",
                  background: "rgba(201,168,76,0.03)",
                  position: "relative",
                  flex: 1,
                }}
              >
                <div style={{
                  position: "absolute", top: 16, left: 22,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 56, lineHeight: 1,
                  color: "rgba(201,168,76,0.15)",
                  fontWeight: 600,
                  userSelect: "none",
                }}>
                  "
                </div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(15px, 1.5vw, 17px)", fontStyle: "italic",
                  fontWeight: 400, lineHeight: 1.75,
                  color: "rgba(245,240,232,0.6)",
                  letterSpacing: "0.04em",
                  paddingTop: 24,
                  marginBottom: 16,
                }}>
                  A perfume is not made for the eyes — it is made for the soul. Come, let us craft yours.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 24, height: 1, background: "#c9a84c", opacity: 0.5 }} />
                  <span style={{
                    fontSize: 9, letterSpacing: "0.2em",
                    color: "rgba(201,168,76,0.55)",
                    textTransform: "uppercase", fontWeight: 400,
                  }}>
                    Élise Valmont · Founder
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom rule */}
        <div style={{
          position: "absolute", bottom: 0, left: "4%", right: "4%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent)",
        }} />
      </section>
    </>
  );
};

export default ContactSection;