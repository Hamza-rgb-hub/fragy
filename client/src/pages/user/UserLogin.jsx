import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import '../../Style/user-login.css';

const UserLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await API.post(
        "/auth/user/login",
        formData,
        {
          withCredentials: true,
        }
      );

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.success || data.user) {
        alert(data.message || "Login successful!");
        navigate("/quiz");
      } else {
        setError(data.message || "Login failed");
      }

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="aroma-login aroma-bg flex items-center justify-center min-h-screen px-4 relative">
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

        <div className="relative z-10 w-full max-w-105 px-4">

          {/* Brand header */}
          <div className="text-center mb-10 fade-in fade-in-1">
            <Link to="/" style={{ textDecoration: "none" }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "28px",
                fontWeight: 300,
                marginTop: "8px",
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
                Maison de Parfum
              </span>
            </Link>
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
                  Welcome Back
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
                Sign In
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

            {/* Form — logic untouched */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Email */}
              <div className="fade-in fade-in-3">
                <label className="aroma-label" htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="aroma-input"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="fade-in fade-in-4">
                <label className="aroma-label" htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="aroma-input"
                    placeholder="Your password"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="fade-in fade-in-5" style={{ marginTop: "4px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="aroma-btn"
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        style={{ animation: "spin 0.8s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Logging in…
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      Sign In
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              margin: "24px 0 20px",
            }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
              <span style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
              }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Register link */}
            <p style={{
              textAlign: "center",
              fontFamily: "'Jost', sans-serif",
              fontSize: "12.5px",
              fontWeight: 300,
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.28)",
              margin: 0,
            }}>
              Don't have an account?{" "}
              <Link
                to="/user/register"
                style={{
                  color: "#c9a84c",
                  textDecoration: "none",
                  fontWeight: 400,
                  borderBottom: "1px solid rgba(201,168,76,0.3)",
                  paddingBottom: "1px",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.target.style.borderColor = "#c9a84c"}
                onMouseLeave={e => e.target.style.borderColor = "rgba(201,168,76,0.3)"}
              >
                Register
              </Link>
            </p>
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
};

export default UserLogin;