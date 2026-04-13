import { Link } from "react-router-dom";
import '../../Style/not-found.css';

const NotFound = () => {
  return (
    <>
      <div className="nf-wrap">
        <div className="nf-noise" />

        <div className="nf-ring" style={{ width: 700, height: 700, border: "1px solid rgba(201,168,76,0.04)" }} />
        <div className="nf-ring" style={{ width: 460, height: 460, border: "1px solid rgba(201,168,76,0.07)" }} />
        <div className="nf-ring" style={{ width: 260, height: 260, border: "1px solid rgba(201,168,76,0.05)" }} />

        {[...Array(6)].map((_, i) => (
          <div key={i} className="nf-particle" style={{
            width: 3 + i, height: 3 + i,
            left: `${18 + i * 12}%`,
            bottom: `${10 + (i % 3) * 8}%`,
            animationDuration: `${3.5 + i * 0.8}s`,
            animationDelay: `${i * 0.6}s`,
          }} />
        ))}

        {/* Brand */}
        <Link to="/" className="nf-brand">
          <span className="nf-brand-name">FRAGY</span>
          <span className="nf-brand-sub">Maison de Parfum</span>
        </Link>

        {/* Content */}
        <div className="nf-content">
          <div className="nf-404">404</div>

          <div className="nf-divider"><span>Lost</span></div>

          <div className="nf-title">The page has vanished</div>

          <div className="nf-sub">Like a fading scent — this page no longer exists</div>

          <Link to="/" className="nf-btn">
            <span>
              Return Home
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </Link>
        </div>

        {/* Footer */}
        <p style={{
          position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
          fontFamily: "'Jost', sans-serif", fontSize: "9.5px", fontWeight: 300,
          letterSpacing: "0.14em", color: "rgba(255,255,255,0.10)", whiteSpace: "nowrap",
        }}>
          © FRAGY — Maison de Parfum. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default NotFound;