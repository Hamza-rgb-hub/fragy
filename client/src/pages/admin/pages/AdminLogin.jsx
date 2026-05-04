import { useState } from "react";
import { useAdminAuth } from "../AdminApp";
import API from "../../../utils/api";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError("All fields required"); return; }
    try {
      setLoading(true); setError("");
      const { data } = await API.post("/auth/admin/login", form, { withCredentials: true });

      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      console.log("Token payload:", tokenPayload);

      if (tokenPayload.role !== "admin" && tokenPayload.role !== "superadmin") {
        setError("Access denied. Admin only."); return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(tokenPayload)); // ✅ yeh add kiya
      login(tokenPayload);

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        .aroma-admin * { box-sizing: border-box; }

        .aroma-bg {
          background: #090806;
          background-image:
            radial-gradient(ellipse 60% 50% at 70% 30%, rgba(201,168,76,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(201,168,76,0.05) 0%, transparent 60%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        .card-glass {
          background: linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%);
          border: 1px solid rgba(201,168,76,0.18);
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(201,168,76,0.06),
            0 32px 80px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(201,168,76,0.12);
        }

        .aroma-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,168,76,0.18);
          color: rgba(255,255,255,0.85);
          padding: 13px 16px 13px 44px;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.08em;
          outline: none;
          transition: all 0.3s ease;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
        }
        .aroma-input::placeholder { color: rgba(255,255,255,0.2); letter-spacing: 0.1em; }
        .aroma-input:focus {
          border-color: rgba(201,168,76,0.55);
          background: rgba(201,168,76,0.04);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.08), 0 0 20px rgba(201,168,76,0.06);
        }

        .aroma-btn {
          width: 100%;
          background: #c9a84c;
          color: #0a0804;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          padding: 15px 24px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
          box-shadow: 0 8px 32px rgba(201,168,76,0.30);
          position: relative;
          overflow: hidden;
        }
        .aroma-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .aroma-btn:hover::before { opacity: 1; }
        .aroma-btn:hover { box-shadow: 0 12px 40px rgba(201,168,76,0.45); transform: translateY(-1px); }
        .aroma-btn:active { transform: translateY(0); }
        .aroma-btn:disabled { background: rgba(201,168,76,0.45); cursor: not-allowed; transform: none; box-shadow: none; }

        .input-wrapper { position: relative; }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(201,168,76,0.45);
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .aroma-label {
          display: block;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(201,168,76,0.6);
          margin-bottom: 8px;
        }

        .fade-in { animation: fadeUp 0.6s ease both; }
        .fade-in-1 { animation-delay: 0.1s; }
        .fade-in-2 { animation-delay: 0.2s; }
        .fade-in-3 { animation-delay: 0.3s; }
        .fade-in-4 { animation-delay: 0.4s; }
        .fade-in-5 { animation-delay: 0.5s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .corner-tl, .corner-br {
          position: absolute;
          width: 20px; height: 20px;
          pointer-events: none;
        }
        .corner-tl { top: -1px; left: -1px; border-top: 1.5px solid #c9a84c; border-left: 1.5px solid #c9a84c; }
        .corner-br { bottom: -1px; right: -1px; border-bottom: 1.5px solid #c9a84c; border-right: 1.5px solid #c9a84c; }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="aroma-admin aroma-bg flex items-center justify-center min-h-screen px-4 relative">
        <div className="noise-overlay" />

        {/* Decorative rings */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "700px", height: "700px",
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.04)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "500px", height: "500px",
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.06)",
          pointerEvents: "none",
        }} />

        <div className="relative z-10 w-full max-w-105">

          {/* Brand header */}
          <div className="text-center mb-10 fade-in fade-in-1">
            <a href="/" style={{ textDecoration: "none" }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "28px",
                fontWeight: 300,
                letterSpacing: "0.45em",
                color: "#c9a84c",
                display: "block",
              }}>
                FRAGY
              </span>
              <span style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "9px",
                fontWeight: 300,
                letterSpacing: "0.55em",
                color: "rgba(255,255,255,0.25)",
                display: "block",
                marginTop: "4px",
                textTransform: "uppercase",
              }}>
                Admin Console
              </span>
            </a>
          </div>

          {/* Card */}
          <div className="card-glass relative rounded-none px-8 py-10 fade-in fade-in-2">
            <div className="corner-tl" />
            <div className="corner-br" />

            {/* Card heading */}
            <div className="mb-8">
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                <div style={{ height: "1px", width: "28px", background: "rgba(201,168,76,0.5)" }} />
                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "9.5px",
                  fontWeight: 400,
                  letterSpacing: "0.45em",
                  color: "rgba(201,168,76,0.6)",
                  textTransform: "uppercase",
                }}>
                  Restricted Access
                </span>
              </div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "34px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.90)",
                letterSpacing: "0.02em",
                lineHeight: 1.1,
                margin: 0,
              }}>
                Admin Sign In
              </h2>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(220,50,50,0.08)",
                border: "1px solid rgba(220,50,50,0.25)",
                padding: "10px 14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e05555" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "12px",
                  fontWeight: 300,
                  color: "#e07070",
                  letterSpacing: "0.04em",
                  margin: 0,
                }}>
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Email */}
              <div className="fade-in fade-in-3">
                <label className="aroma-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    className="aroma-input"
                    placeholder="admin@fragy.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="fade-in fade-in-4">
                <label className="aroma-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    className="aroma-input"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="fade-in fade-in-5" style={{ marginTop: "4px" }}>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="aroma-btn"
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        style={{ animation: "spin 0.8s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Authenticating…
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      Enter Console
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p style={{
            textAlign: "center",
            fontFamily: "'Jost', sans-serif",
            fontSize: "10px",
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.12)",
            margin: "24px 0",
          }}>
            © FRAGY — Maison de Parfum. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}