import { useState } from "react";
import API from "../../../utils/api";

export default function AdminRegister() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.name.trim())                      return "Name is required";
    if (!form.email.trim())                     return "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email))       return "Invalid email address";
    if (form.password.length < 8)               return "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); setSuccess(""); return; }

    try {
      setLoading(true); setError(""); setSuccess("");
      await API.post("/auth/admin/register", {
        name:     form.name,
        email:    form.email,
        password: form.password,
      });
      setSuccess(`Admin account created successfully for ${form.name}!`);
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const EyeOpen = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const EyeOff = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
    </svg>
  );

  const strengthLevel = form.password.length >= 10 ? 3 : form.password.length >= 8 ? 2 : form.password.length >= 4 ? 1 : 0;
  const strengthColor = ["transparent", "rgba(220,60,60,0.7)", "#c9a84c", "rgba(60,200,100,0.7)"][strengthLevel];
  const strengthWidth = ["0%", "33%", "66%", "100%"][strengthLevel];

  // ✅ Sirf superadmin access kar sakta hai
  if (currentUser?.role !== "superadmin") {
    return (
      <>
        <style>{`
          .no-access-wrap { animation: fadeUp 0.4s ease; max-width: 560px; }
          .no-access-card {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            min-height: 280px; gap: 18px;
            background: linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012));
            border: 1px solid rgba(220,60,60,0.18); padding: 48px 36px; position: relative;
            box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          }
          .no-access-corner-tl { position:absolute; top:-1px; left:-1px; width:18px; height:18px; border-top:1.5px solid rgba(220,60,60,0.5); border-left:1.5px solid rgba(220,60,60,0.5); }
          .no-access-corner-br { position:absolute; bottom:-1px; right:-1px; width:18px; height:18px; border-bottom:1.5px solid rgba(220,60,60,0.5); border-right:1.5px solid rgba(220,60,60,0.5); }
          .no-access-title { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:400; color:rgba(255,255,255,0.75); letter-spacing:0.03em; }
          .no-access-sub { font-size:11px; font-weight:300; letter-spacing:0.12em; color:rgba(255,255,255,0.22); text-align:center; }
          @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        `}</style>
        <div className="no-access-wrap">
          <div className="reg-eyebrow" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <div style={{ height:1, width:28, background:"rgba(220,60,60,0.35)" }} />
            <span style={{ fontSize:9, fontWeight:400, letterSpacing:"0.48em", textTransform:"uppercase", color:"rgba(220,60,60,0.45)" }}>Access Control</span>
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:400, color:"rgba(255,255,255,0.85)", letterSpacing:"0.03em", marginBottom:28 }}>
            Register Admin
          </div>
          <div className="no-access-card">
            <div className="no-access-corner-tl" /><div className="no-access-corner-br" />
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="rgba(220,60,60,0.6)" strokeWidth="1.2">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <div className="no-access-title">Access Restricted</div>
            <div className="no-access-sub">Only Super Admin can register<br/>new admin accounts</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .reg-wrap { animation: fadeUp 0.4s ease; max-width: 560px; }
        .reg-eyebrow { display:flex; align-items:center; gap:10px; margin-bottom:6px; }
        .reg-eyebrow-line { height:1px; width:28px; background:rgba(201,168,76,0.45); }
        .reg-eyebrow-text { font-size:9px; font-weight:400; letter-spacing:0.48em; text-transform:uppercase; color:rgba(201,168,76,0.55); }
        .reg-title { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:400; color:rgba(255,255,255,0.85); letter-spacing:0.03em; }
        .reg-subtitle { font-size:11px; font-weight:300; letter-spacing:0.12em; color:rgba(255,255,255,0.22); margin-top:6px; margin-bottom:28px; }

        .reg-card {
          background: linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012));
          border: 1px solid rgba(201,168,76,0.14);
          padding: 36px; position: relative;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
        }
        .corner-tl { position:absolute; top:-1px; left:-1px; width:18px; height:18px; border-top:1.5px solid #c9a84c; border-left:1.5px solid #c9a84c; pointer-events:none; }
        .corner-br { position:absolute; bottom:-1px; right:-1px; width:18px; height:18px; border-bottom:1.5px solid #c9a84c; border-right:1.5px solid #c9a84c; pointer-events:none; }

        .sec-label { font-size:8.5px; font-weight:500; letter-spacing:0.48em; text-transform:uppercase; color:rgba(201,168,76,0.4); margin:24px 0 14px; padding-bottom:8px; border-bottom:1px solid rgba(201,168,76,0.08); }
        .sec-label:first-of-type { margin-top:0; }

        .reg-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .reg-grid { display:grid; gap:16px; }

        .pass-wrap { position:relative; }
        .pass-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(255,255,255,0.25); cursor:pointer; padding:0; transition:color 0.2s; line-height:1; }
        .pass-toggle:hover { color:rgba(255,255,255,0.55); }

        .strength-bar  { height:2px; background:rgba(255,255,255,0.06); margin-top:8px; }
        .strength-fill { height:2px; transition:width 0.3s,background 0.3s; }

        .role-badge-display {
          display:flex; align-items:center; gap:10px; padding:13px 16px;
          background:rgba(201,168,76,0.06); border:1px solid rgba(201,168,76,0.18);
        }
        .role-badge-display span { font-size:11px; letter-spacing:0.12em; color:rgba(255,255,255,0.40); }
        .role-badge-display strong { color:#c9a84c; letter-spacing:0.25em; font-weight:500; }

        .reg-error { display:flex; align-items:center; gap:10px; padding:12px 14px; margin-top:20px; background:rgba(220,60,60,0.08); border:1px solid rgba(220,60,60,0.20); font-size:11.5px; color:rgba(220,110,110,0.90); letter-spacing:0.05em; }
        .reg-success { display:flex; align-items:center; gap:10px; padding:12px 14px; margin-top:20px; background:rgba(60,200,100,0.08); border:1px solid rgba(60,200,100,0.20); font-size:11.5px; color:rgba(80,210,120,0.90); letter-spacing:0.05em; }

        .reg-btn { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:14px; background:#c9a84c; border:none; color:#080706; font-family:'Jost',sans-serif; font-size:11px; font-weight:500; letter-spacing:0.38em; text-transform:uppercase; cursor:pointer; transition:all 0.28s; clip-path:polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,9px 100%,0 calc(100% - 9px)); box-shadow:0 6px 24px rgba(201,168,76,0.22); margin-top:24px; }
        .reg-btn:hover:not(:disabled) { box-shadow:0 10px 32px rgba(201,168,76,0.38); transform:translateY(-1px); }
        .reg-btn:disabled { opacity:0.50; cursor:not-allowed; transform:none; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="reg-wrap">
        {/* Header */}
        <div className="reg-eyebrow">
          <div className="reg-eyebrow-line" />
          <span className="reg-eyebrow-text">Access Control</span>
        </div>
        <div className="reg-title">Register Admin</div>
        <div className="reg-subtitle">Create a new admin account for the console</div>

        {/* Card */}
        <div className="reg-card">
          <div className="corner-tl" /><div className="corner-br" />

          {/* Personal Info */}
          <div className="sec-label">Personal Information</div>
          <div className="reg-grid">
            <div className="reg-row">
              <div>
                <label className="inp-label">Full Name *</label>
                <input className="inp" value={form.name}
                  onChange={e => set("name", e.target.value)}
                  placeholder="John Doe" />
              </div>
              <div>
                <label className="inp-label">Email Address *</label>
                <input className="inp" type="email" value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="admin@example.com" />
              </div>
            </div>

            <div className="reg-row">
              <div>
                <label className="inp-label">Password *</label>
                <div className="pass-wrap">
                  <input className="inp" type={showPass ? "text" : "password"}
                    value={form.password} onChange={e => set("password", e.target.value)}
                    placeholder="Min 8 characters" style={{ paddingRight: 38 }} />
                  <button className="pass-toggle" type="button" onClick={() => setShowPass(v => !v)}>
                    {showPass ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {form.password && (
                  <div className="strength-bar">
                    <div className="strength-fill" style={{ width: strengthWidth, background: strengthColor }} />
                  </div>
                )}
              </div>

              <div>
                <label className="inp-label">Confirm Password *</label>
                <div className="pass-wrap">
                  <input className="inp" type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
                    placeholder="Re-enter password" style={{ paddingRight: 38 }} />
                  <button className="pass-toggle" type="button" onClick={() => setShowConfirm(v => !v)}>
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {form.confirmPassword && (
                  <div style={{ marginTop: 6, fontSize: 10, letterSpacing: "0.08em", color: form.password === form.confirmPassword ? "rgba(80,210,120,0.75)" : "rgba(220,100,100,0.75)" }}>
                    {form.password === form.confirmPassword ? "✓ Passwords match" : "✗ Do not match"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Role — fixed display */}
          <div className="sec-label">Role</div>
          <div className="role-badge-display">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.7)" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Account will be registered as <strong>ADMIN</strong></span>
          </div>

          {/* Alerts */}
          {error && (
            <div className="reg-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="reg-success">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {success}
            </div>
          )}

          {/* Submit */}
          <button className="reg-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <div style={{ width: 14, height: 14, border: "2px solid rgba(8,7,6,0.3)", borderTopColor: "#080706", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                Creating Account...
              </>
            ) : (
              <>
                Create Admin Account
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}