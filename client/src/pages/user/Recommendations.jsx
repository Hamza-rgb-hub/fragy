import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";
import "../../Style/recommendation.css";

const Recommendations = () => {
  const [recs, setRecs] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/quiz/recommendations");
        if (!mounted) return;
        setRecs(data.recommendations || []);
        setTags(data.generatedTags || []);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError(err.response?.data?.message || "Failed to load recommendations");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRecs();
    return () => { mounted = false; };
  }, []);

  // ✅ FIX #5: Clean price formatter
  const formatPrice = (price) =>
    typeof price === "number" ? `$${price.toFixed(2)}` : "—";

  return (
    <>
      <div className="rec-page rec-bg">
        <div className="noise-overlay" />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto" }}>

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "4px", animation: "fadeUp 0.45s ease both" }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300,
              color: "rgba(255,255,255,0.90)", letterSpacing: "0.06em",
              margin: "28px 0 0",
            }}>Your Curated Selection</h1>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{
              display: "flex", justifyContent: "center", flexWrap: "wrap",
              gap: "8px", margin: "18px 0 0",
              animation: "fadeUp 0.5s ease both",
            }}>
              {tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          )}

          <div className="gold-divider"><span>Matched for you</span></div>

          {/* States */}
          {loading && (
            <div className="state-card">
              <div className="spinner" />
              <p style={{
                fontFamily: "'Jost', sans-serif", fontSize: "12px",
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)", margin: 0,
              }}>Curating your selection…</p>
            </div>
          )}

          {!loading && error && (
            <div className="state-card">
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "22px", color: "rgba(255,255,255,0.6)", marginBottom: "8px",
              }}>Something went wrong</p>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontSize: "12px",
                color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", marginBottom: 0,
              }}>{error}</p>
              <button className="btn-quiz" onClick={() => navigate("/quiz")}>
                Retake Quiz
              </button>
            </div>
          )}

          {!loading && !error && recs.length === 0 && (
            <div className="state-card">
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "26px", color: "rgba(255,255,255,0.7)", marginBottom: "10px",
              }}>No recommendations yet</p>
              <p style={{
                fontFamily: "'Jost', sans-serif", fontSize: "12px",
                color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em",
              }}>Complete the quiz to discover your signature scent.</p>
              <button className="btn-quiz" onClick={() => navigate("/quiz")}>
                Take the Quiz
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && recs.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "20px",
            }}>
              {recs.map((p, idx) => (
                <div
                  key={p._id || p.id || idx}
                  className="rec-card"
                  style={{ animationDelay: `${idx * 0.07}s` }}
                >
                  <div className="card-img-wrap">
                    {p.image?.url ? (
                      <img src={p.image.url} alt={p.name || "Perfume"} />
                    ) : (
                      <div className="img-placeholder">
                        {/* Placeholder icon */}
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                          stroke="rgba(201,168,76,0.18)" strokeWidth="1">
                          <path d="M12 2C8 2 6 5 6 8c0 4 6 14 6 14s6-10 6-14c0-3-2-6-6-6z"/>
                          <circle cx="12" cy="8" r="2"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="card-body">
                    <p className="card-brand">{p.brand || "Fragy"}</p>
                    <p className="card-name">{p.name || p.title || "Signature Scent"}</p>

                    <div className="card-footer">
                      {/* ✅ FIX #5: Clean price display */}
                      <span className="card-price">{formatPrice(p.price)}</span>
                      <button className="btn-view" onClick={() => navigate(`/product/${p._id}`)}>
                        View
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Recommendations;