import { useState } from "react";
import { useCart } from "../../context/CartContext"; // apna path adjust karo
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const ACCENT = "#c9a84c";

// ── Bottle placeholder SVG ────────────────────────────────────────────────────
const MiniBottle = ({ accent = ACCENT }) => (
  <svg width="32" height="48" viewBox="0 0 120 180" fill="none">
    <rect x="46" y="30" width="28" height="30" rx="4" fill={accent} fillOpacity="0.2" stroke={accent} strokeOpacity="0.4" strokeWidth="1"/>
    <rect x="50" y="18" width="20" height="14" rx="3" fill={accent} fillOpacity="0.7"/>
    <rect x="22" y="58" width="76" height="100" rx="12" fill={accent} fillOpacity="0.08" stroke={accent} strokeOpacity="0.4" strokeWidth="1.5"/>
    <rect x="32" y="88" width="56" height="40" rx="3" fill={accent} fillOpacity="0.1" stroke={accent} strokeOpacity="0.3" strokeWidth="0.8"/>
  </svg>
);

// ── Category accent colors ────────────────────────────────────────────────────
const CAT_ACCENT = {
  Oriental: "#c9a84c", Floral: "#a78bfa",
  "Floral-Oriental": "#e8927c", Fresh: "#6ee7b7",
  Woody: "#f0c87a", Citrus: "#94a3b8",
};
const getAccent = (cat) => CAT_ACCENT[cat] || ACCENT;

// ── Step Indicator ────────────────────────────────────────────────────────────
const StepBar = ({ step }) => {
  const steps = ["Cart", "Shipping", "Review"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 48 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 32, height: 32,
              borderRadius: "50%",
              background: i < step ? ACCENT : i === step ? "transparent" : "transparent",
              border: `2px solid ${i <= step ? ACCENT : "rgba(201,168,76,0.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: i < step ? "#0a0806" : i === step ? ACCENT : "rgba(255,255,255,0.2)",
              fontSize: 11, fontWeight: 700, fontFamily: "'Jost',sans-serif",
              transition: "all 0.3s",
            }}>
              {i < step ? <CheckIcon /> : i + 1}
            </div>
            <span style={{
              fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
              color: i <= step ? ACCENT : "rgba(255,255,255,0.2)",
              fontFamily: "'Jost',sans-serif", fontWeight: i === step ? 500 : 300,
            }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 80, height: 1, margin: "0 12px",
              marginBottom: 22,
              background: i < step
                ? `linear-gradient(90deg, ${ACCENT}, ${ACCENT})`
                : `linear-gradient(90deg, ${i === step ? ACCENT : "rgba(201,168,76,0.15)"}, rgba(201,168,76,0.15))`,
              transition: "all 0.4s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
};

// ── Cart Items Step ───────────────────────────────────────────────────────────
const CartStep = ({ onNext, cartItems, updateQty, removeFromCart, totalPrice, totalCount }) => {
  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.15 }}>◈</div>
        <p style={{ color: "rgba(245,240,232,0.3)", fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24 }}>
          Your cart is empty
        </p>
        <a href="/products" style={{
          display: "inline-block", padding: "10px 28px",
          border: `1px solid ${ACCENT}55`, color: ACCENT,
          fontFamily: "'Jost',sans-serif", fontSize: 10,
          letterSpacing: "0.28em", textTransform: "uppercase",
          textDecoration: "none",
          clipPath: "polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
          transition: "all 0.25s",
        }}>
          Explore Collection
        </a>
      </div>
    );
  }

  return (
    <div className="cart-step-grid">
      {/* Items list */}
      <div>
        <div style={{ borderBottom: `1px solid rgba(201,168,76,0.12)`, paddingBottom: 16, marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, letterSpacing: "0.28em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontFamily: "'Jost',sans-serif" }}>
            Product
          </span>
          <div style={{ display: "flex", gap: 60 }}>
            <span style={{ fontSize: 9, letterSpacing: "0.28em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontFamily: "'Jost',sans-serif" }}>Qty</span>
            <span style={{ fontSize: 9, letterSpacing: "0.28em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", fontFamily: "'Jost',sans-serif" }}>Total</span>
          </div>
        </div>

        {cartItems.map((item, idx) => {
          const p = item.perfume;
          if (!p) return null;
          const accent = getAccent(p.category);
          return (
            <div key={p._id || idx} style={{
              display: "flex", alignItems: "center", gap: 18,
              padding: "20px 0",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              animation: "fadeUp 0.4s ease forwards",
              animationDelay: `${idx * 0.06}s`,
              opacity: 0,
            }}>
              {/* Thumbnail */}
              <div style={{
                width: 72, height: 90, flexShrink: 0,
                background: `${accent}08`,
                border: `1px solid ${accent}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                {p.image?.url
                  ? <img src={p.image.url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <MiniBottle accent={accent} />
                }
                <div style={{ position:"absolute",top:0,left:0,width:8,height:8,borderTop:`1px solid ${accent}`,borderLeft:`1px solid ${accent}` }}/>
                <div style={{ position:"absolute",bottom:0,right:0,width:8,height:8,borderBottom:`1px solid ${accent}`,borderRight:`1px solid ${accent}` }}/>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 8, color: accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 3, fontFamily: "'Jost',sans-serif" }}>
                  {p.category || "Fragrance"}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: "#f5f0e8", marginBottom: 3 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'Jost',sans-serif" }}>
                  {p.size || "50ml"} · ${p.price} each
                </div>
              </div>

              {/* Qty controls */}
              <div className="q-btn" style={{ display: "flex", alignItems: "center", border: `1px solid ${accent}30`, flexShrink: 0 }}>
                <button
                  onClick={() => updateQty(p._id, item.quantity - 1)}
                  style={{ width:30,height:30,background:"transparent",border:"none",color:accent,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}
                  onMouseEnter={e=>e.currentTarget.style.background=`${accent}15`}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >−</button>
                <span style={{ width:32,textAlign:"center",color:"#f5f0e8",fontSize:13,fontWeight:500,fontFamily:"'Jost',sans-serif" }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQty(p._id, item.quantity + 1)}
                  style={{ width:30,height:30,background:"transparent",border:"none",color:accent,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}
                  onMouseEnter={e=>e.currentTarget.style.background=`${accent}15`}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >+</button>
              </div>

              {/* Subtotal */}
              <div style={{ width: 'auto', textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:accent }}>
                  ${(p.price * item.quantity).toFixed(2)}
                </span>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(p._id)}
                style={{ background:"transparent",border:"1px solid rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.25)",cursor:"pointer",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",flexShrink:0 }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#e8927c";e.currentTarget.style.color="#e8927c";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.color="rgba(255,255,255,0.25)";}}
              >
                <TrashIcon/>
              </button>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="cart-sticky" style={{
        background: "#0c0a08",
        border: `1px solid rgba(201,168,76,0.18)`,
        padding: 28, position: "sticky", top: 100,
      }}>
        <div style={{ position:"absolute",top:0,left:0,width:20,height:20,borderTop:`2px solid ${ACCENT}`,borderLeft:`2px solid ${ACCENT}` }}/>
        <div style={{ position:"absolute",bottom:0,right:0,width:20,height:20,borderBottom:`2px solid ${ACCENT}`,borderRight:`2px solid ${ACCENT}` }}/>

        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#f5f0e8", letterSpacing:"0.04em", marginBottom:20 }}>
          Order Summary
        </h3>

        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em", fontFamily:"'Jost',sans-serif" }}>
              Subtotal ({totalCount} items)
            </span>
            <span style={{ fontSize:13, color:"#f5f0e8", fontFamily:"'Cormorant Garamond',serif", fontWeight:600 }}>
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em", fontFamily:"'Jost',sans-serif" }}>
              Shipping
            </span>
            <span style={{ fontSize:11, color:"#6ee7b7", fontFamily:"'Jost',sans-serif", letterSpacing:"0.08em" }}>
              FREE
            </span>
          </div>
          <div style={{ height:1, background:"rgba(201,168,76,0.12)", margin:"4px 0" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.6)", letterSpacing:"0.14em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>
              Total
            </span>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, color:ACCENT }}>
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* COD badge */}
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:`${ACCENT}08`, border:`1px solid ${ACCENT}22`, marginBottom:20 }}>
          <TruckIcon />
          <span style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)", fontFamily:"'Jost',sans-serif" }}>
            Cash on Delivery
          </span>
        </div>

        <button
          onClick={onNext}
          style={{
            width:"100%", padding:"14px 0",
            background:ACCENT, border:"none",
            color:"#0a0806", fontFamily:"'Jost',sans-serif",
            fontSize:10, fontWeight:700,
            letterSpacing:"0.3em", textTransform:"uppercase",
            cursor:"pointer",
            clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
            transition:"opacity 0.2s, transform 0.2s",
            boxShadow:`0 8px 28px ${ACCENT}30`,
          }}
          onMouseEnter={e=>{e.currentTarget.style.opacity="0.88";e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}
        >
          Proceed to Shipping →
        </button>
      </div>
    </div>
  );
};

// ── Shipping Step ─────────────────────────────────────────────────────────────
const ShippingStep = ({ onNext, onBack, shippingData, setShippingData }) => {
  const [errors, setErrors] = useState({});

  const fields = [
    { key:"fullName",  label:"Full Name",       placeholder:"Muhammad Ali",     half:false },
    { key:"phone",     label:"Phone Number",    placeholder:"+92 300 0000000",  half:true  },
    { key:"email",     label:"Email Address",   placeholder:"ali@email.com",    half:true  },
    { key:"address",   label:"Street Address",  placeholder:"House #, Street, Area", half:false },
    { key:"city",      label:"City",            placeholder:"Karachi",          half:true  },
    { key:"province",  label:"Province",        placeholder:"Sindh",            half:true  },
    { key:"postalCode",label:"Postal Code",     placeholder:"75000",            half:true  },
    { key:"country",   label:"Country",         placeholder:"Pakistan",         half:true  },
  ];

  const validate = () => {
    const e = {};
    if (!shippingData.fullName?.trim())  e.fullName  = "Required";
    if (!shippingData.phone?.trim())     e.phone     = "Required";
    if (!shippingData.address?.trim())   e.address   = "Required";
    if (!shippingData.city?.trim())      e.city      = "Required";
    if (!shippingData.province?.trim())  e.province  = "Required";
    if (!shippingData.country?.trim())   e.country   = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (key, val) => {
    setShippingData(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = () => { if (validate()) onNext(); };

  // Pair half-width fields
  const rows = [];
  let i = 0;
  while (i < fields.length) {
    if (fields[i].half && fields[i+1]?.half) {
      rows.push([fields[i], fields[i+1]]);
      i += 2;
    } else {
      rows.push([fields[i]]);
      i += 1;
    }
  }

  return (
    <div className="shipping-step-grid">
      {/* Form */}
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
          <MapPinIcon />
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:"#f5f0e8", letterSpacing:"0.04em" }}>
            Shipping Address
          </h3>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {rows.map((row, ri) => (
            <div key={ri} className={row.length === 2 ? "form-row-half" : "form-row-full"}>
              {row.map(field => (
                <div key={field.key}>
                  <label style={{ display:"block", fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color: errors[field.key] ? "#e8927c" : "rgba(255,255,255,0.35)", fontFamily:"'Jost',sans-serif", marginBottom:6 }}>
                    {field.label} {["fullName","phone","address","city","province","country"].includes(field.key) && <span style={{color:ACCENT}}>*</span>}
                  </label>
                  <input
                    value={shippingData[field.key] || ""}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    style={{
                      width:"100%", padding:"12px 14px",
                      background:"rgba(255,255,255,0.03)",
                      border:`1px solid ${errors[field.key] ? "#e8927c55" : "rgba(201,168,76,0.18)"}`,
                      color:"#f5f0e8", fontFamily:"'Jost',sans-serif",
                      fontSize:13, outline:"none",
                      transition:"border-color 0.2s",
                      boxSizing:"border-box",
                    }}
                    onFocus={e=>e.target.style.borderColor=ACCENT}
                    onBlur={e=>e.target.style.borderColor=errors[field.key]?"#e8927c55":"rgba(201,168,76,0.18)"}
                  />
                  {errors[field.key] && (
                    <span style={{ fontSize:9, color:"#e8927c", letterSpacing:"0.1em", marginTop:3, display:"block" }}>
                      {errors[field.key]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:12, marginTop:28 }}>
          <button onClick={onBack} style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"12px 22px", background:"transparent",
            border:"1px solid rgba(255,255,255,0.1)",
            color:"rgba(255,255,255,0.45)", fontFamily:"'Jost',sans-serif",
            fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase",
            cursor:"pointer",
            clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
            transition:"all 0.2s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.25)";e.currentTarget.style.color="rgba(255,255,255,0.75)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.45)";}}
          >
            <ChevronLeft /> Back
          </button>
          <button onClick={handleSubmit} style={{
            flex:1, padding:"13px 0",
            background:ACCENT, border:"none",
            color:"#0a0806", fontFamily:"'Jost',sans-serif",
            fontSize:10, fontWeight:700,
            letterSpacing:"0.3em", textTransform:"uppercase",
            cursor:"pointer",
            clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
            transition:"opacity 0.2s",
            boxShadow:`0 8px 28px ${ACCENT}30`,
          }}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.88"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}
          >
            Review Order →
          </button>
        </div>
      </div>

      {/* Mini summary */}
      <div className="cart-sticky" style={{ background:"#0c0a08", border:`1px solid rgba(201,168,76,0.14)`, padding:22, position:"sticky", top:100 }}>
        <div style={{ fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase", color:ACCENT, marginBottom:14, fontFamily:"'Jost',sans-serif" }}>
          Delivery Info
        </div>
        {[
          ["Delivery Time", "3–5 Business Days"],
          ["Payment",       "Cash on Delivery"],
          ["Returns",       "7-Day Easy Returns"],
          ["Support",       "24/7 Customer Care"],
        ].map(([k,v]) => (
          <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:10, marginBottom:10, borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"'Jost',sans-serif", letterSpacing:"0.05em" }}>{k}</span>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.65)", fontFamily:"'Jost',sans-serif" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Review Step ───────────────────────────────────────────────────────────────
const ReviewStep = ({ onBack, cartItems, totalPrice, totalCount, shippingData, onPlaceOrder, placing }) => (
  <div className="review-step-grid">
    <div>
      {/* Shipping summary */}
      <div style={{ background:"#0c0a08", border:`1px solid rgba(201,168,76,0.15)`, padding:22, marginBottom:20, position:"relative" }}>
        <div style={{ position:"absolute",top:0,left:0,width:16,height:16,borderTop:`1px solid ${ACCENT}`,borderLeft:`1px solid ${ACCENT}` }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:ACCENT, fontFamily:"'Jost',sans-serif" }}>
            Shipping To
          </span>
          <button onClick={onBack} style={{ background:"transparent", border:"none", color:"rgba(201,168,76,0.6)", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", cursor:"pointer", fontFamily:"'Jost',sans-serif", textDecoration:"underline" }}>
            Edit
          </button>
        </div>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, color:"#f5f0e8", lineHeight:1.6 }}>
          {shippingData.fullName}
        </p>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.45)", lineHeight:1.7, fontFamily:"'Jost',sans-serif" }}>
          {shippingData.address}, {shippingData.city}, {shippingData.province} {shippingData.postalCode}, {shippingData.country}
        </p>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:4, fontFamily:"'Jost',sans-serif" }}>
          {shippingData.phone} {shippingData.email && `· ${shippingData.email}`}
        </p>
      </div>

      {/* Items review */}
      <div style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)", fontFamily:"'Jost',sans-serif", marginBottom:12 }}>
        Order Items
      </div>
      {cartItems.map((item, idx) => {
        const p = item.perfume;
        if (!p) return null;
        const accent = getAccent(p.category);
        return (
          <div key={p._id||idx} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ width:48, height:60, background:`${accent}08`, border:`1px solid ${accent}22`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {p.image?.url ? <img src={p.image.url} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <MiniBottle accent={accent} />}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:"#f5f0e8", fontWeight:600 }}>{p.name}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"'Jost',sans-serif" }}>Qty: {item.quantity} · {p.size || "50ml"}</div>
            </div>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, color:accent, fontWeight:600 }}>
              ${(p.price * item.quantity).toFixed(2)}
            </span>
          </div>
        );
      })}

      <div style={{ display:"flex", gap:12, marginTop:24 }}>
        <button onClick={onBack} style={{
          display:"flex", alignItems:"center", gap:6,
          padding:"12px 22px", background:"transparent",
          border:"1px solid rgba(255,255,255,0.1)",
          color:"rgba(255,255,255,0.45)", fontFamily:"'Jost',sans-serif",
          fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase",
          cursor:"pointer",
          clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
          transition:"all 0.2s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.25)";e.currentTarget.style.color="rgba(255,255,255,0.75)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.45)";}}
        >
          <ChevronLeft /> Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={placing}
          style={{
            flex:1, padding:"14px 0",
            background: placing ? "rgba(201,168,76,0.4)" : ACCENT,
            border:"none", color:"#0a0806",
            fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:700,
            letterSpacing:"0.3em", textTransform:"uppercase",
            cursor: placing ? "not-allowed" : "pointer",
            clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
            transition:"opacity 0.2s",
            boxShadow: placing ? "none" : `0 8px 28px ${ACCENT}35`,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}
          onMouseEnter={e=>{ if(!placing) e.currentTarget.style.opacity="0.88"; }}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}
        >
          {placing ? (
            <>
              <div style={{ width:14, height:14, border:`2px solid #0a080655`, borderTop:`2px solid #0a0806`, borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
              Placing Order...
            </>
          ) : (
            <>
              <PackageIcon /> Place Order (COD)
            </>
          )}
        </button>
      </div>
    </div>

    {/* Final summary */}
    <div className="cart-sticky" style={{ background:"#0c0a08", border:`1px solid rgba(201,168,76,0.18)`, padding:28, top:100, position:"relative" }}>
      <div style={{ position:"absolute",top:0,left:0,width:20,height:20,borderTop:`2px solid ${ACCENT}`,borderLeft:`2px solid ${ACCENT}` }}/>
      <div style={{ position:"absolute",bottom:0,right:0,width:20,height:20,borderBottom:`2px solid ${ACCENT}`,borderRight:`2px solid ${ACCENT}` }}/>

      <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#f5f0e8", marginBottom:20 }}>
        Final Total
      </h3>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", fontFamily:"'Jost',sans-serif" }}>Items ({totalCount})</span>
          <span style={{ fontSize:13, color:"#f5f0e8", fontFamily:"'Cormorant Garamond',serif", fontWeight:600 }}>${totalPrice.toFixed(2)}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", fontFamily:"'Jost',sans-serif" }}>Delivery</span>
          <span style={{ fontSize:11, color:"#6ee7b7", fontFamily:"'Jost',sans-serif" }}>FREE</span>
        </div>
        <div style={{ height:1, background:"rgba(201,168,76,0.12)" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.14em", fontFamily:"'Jost',sans-serif" }}>Total</span>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:600, color:ACCENT }}>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <div style={{ padding:"10px 14px", background:"rgba(110,231,183,0.06)", border:"1px solid rgba(110,231,183,0.2)", display:"flex", alignItems:"center", gap:8 }}>
        <TruckIcon />
        <span style={{ fontSize:9, letterSpacing:"0.15em", color:"rgba(110,231,183,0.7)", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>
          Pay on delivery — no advance required
        </span>
      </div>
    </div>
  </div>
);

// ── Success Screen ────────────────────────────────────────────────────────────
const SuccessScreen = ({ orderId }) => (
  <div style={{ textAlign:"center", padding:"60px 0" }}>
    <div style={{
      width:72, height:72, borderRadius:"50%",
      border:`2px solid ${ACCENT}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      margin:"0 auto 24px",
      background:`${ACCENT}10`,
      animation:"scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
    }}>
      <CheckIcon />
    </div>
    <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:600, color:"#f5f0e8", marginBottom:8 }}>
      Order Placed!
    </h2>
    <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", letterSpacing:"0.1em", marginBottom:6, fontFamily:"'Jost',sans-serif" }}>
      Thank you for your order
    </p>
    {orderId && (
      <p style={{ fontSize:10, color:ACCENT, letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif", marginBottom:32 }}>
        Order ID: {orderId}
      </p>
    )}
    <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", maxWidth:360, margin:"0 auto 36px", lineHeight:1.7, fontFamily:"'Jost',sans-serif" }}>
      Our team will contact you shortly to confirm your delivery. Payment on delivery.
    </p>
    <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
      <a href="/" style={{
        padding:"11px 28px", background:"transparent",
        border:`1px solid rgba(201,168,76,0.3)`, color:ACCENT,
        fontFamily:"'Jost',sans-serif", fontSize:10,
        letterSpacing:"0.25em", textTransform:"uppercase",
        textDecoration:"none",
        clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
        transition:"all 0.2s",
      }}>
        Back to Home
      </a>
      <a href="/products" style={{
        padding:"11px 28px", background:ACCENT,
        border:"none", color:"#0a0806",
        fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:700,
        letterSpacing:"0.25em", textTransform:"uppercase",
        textDecoration:"none",
        clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
      }}>
        Shop More
      </a>
    </div>
  </div>
);

// ── Main Cart Page ────────────────────────────────────────────────────────────
const CartPage = () => {
  const { cartItems, totalPrice, totalCount, updateQty, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [step,         setStep]         = useState(0); // 0=cart, 1=shipping, 2=review, 3=success
  const [shippingData, setShippingData] = useState({});
  const [placing,      setPlacing]      = useState(false);
  const [orderId,      setOrderId]      = useState(null);

  const handlePlaceOrder = async () => {
    try {
      setPlacing(true);

      const { data } = await API.post("/orders", {
        shippingAddress: shippingData,
        paymentMethod:   "COD",
      });

      setOrderId(data.order?._id || null);
      clearCart();
      setStep(3);

    } catch (err) {
      console.error("Place order error:", err);
      const msg = err?.response?.data?.message || "Order place karne mein error aaya.";
      alert(msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@200;300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(245,240,232,0.18); }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #0c0a08 inset !important; -webkit-text-fill-color: #f5f0e8 !important; }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn   { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }

        /* ── Shared grid layouts ── */
        .cart-step-grid,
        .shipping-step-grid,
        .review-step-grid {
          display: grid;
          gap: 28px;
          align-items: start;
        }
        .cart-step-grid    { grid-template-columns: 1fr 360px; }
        .shipping-step-grid{ grid-template-columns: 1fr 340px; }
        .review-step-grid  { grid-template-columns: 1fr 360px; }

        /* ── Form row helpers ── */
        .form-row-half { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-row-full { display: grid; grid-template-columns: 1fr; }

        /* ── Step bar connector line ── */
        .step-bar-line { width: 80px; }

        /* ── Tablet: 768px – 900px ── */
        @media (max-width: 900px) {
          .cart-step-grid,
          .shipping-step-grid,
          .review-step-grid {
            grid-template-columns: 1fr;
          }
          .cart-sticky {
            position: static !important;
          }
        }

        /* ── Mobile: ≤ 600px ── */
        @media (max-width: 600px) {
          .cart-page-wrap {
            padding: 80px 16px 60px !important;
          }
          .step-bar-line {
            width: 36px !important;
          }
          /* Stack half-width form fields on small screens */
          .form-row-half {
            grid-template-columns: 1fr;
          }
          /* Cart item row: tighter on mobile */
          .cart-item-row {
            gap: 10px !important;
          }
          /* Slightly smaller product name on mobile */
          .cart-item-name {
            font-size: 15px !important;
          }
          /* Hide subtotal column label on mobile */
          .cart-col-total-label {
            display: none;
          }
        }

        /* ── Extra small: ≤ 420px ── */
        @media (max-width: 420px) {
          .cart-page-wrap {
            padding: 70px 12px 48px !important;
          }
          /* Reduce thumbnail on very small screens */
          .cart-thumb {
            width: 56px !important;
            height: 70px !important;
          }
          .q-btn{
            display: flex;
            flex-direction: column;
            align-items: center;
          }  
        }
      `}</style>

      <div className="cart-page-wrap" style={{
        minHeight: "100vh",
        background: "#090806",
        padding: "100px 48px 80px",
        fontFamily: "'Jost', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Ambient glow */}
        <div style={{ position:"absolute", top:-100, left:"50%", transform:"translateX(-50%)", width:500, height:300, background:`radial-gradient(ellipse, ${ACCENT}08 0%, transparent 70%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:0, left:"8%", right:"8%", height:1, background:`linear-gradient(90deg,transparent,${ACCENT}25,transparent)` }}/>

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Header */}
          {step < 3 && (
            <div style={{ textAlign:"center", marginBottom:40, animation:"fadeUp 0.5s ease forwards" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:10, color:ACCENT, fontSize:9, letterSpacing:"0.35em", textTransform:"uppercase", marginBottom:12, fontFamily:"'Jost',sans-serif" }}>
                <div style={{ width:28, height:1, background:ACCENT, opacity:0.6 }}/>
                FRAGY · Maison de Parfum
                <div style={{ width:28, height:1, background:ACCENT, opacity:0.6 }}/>
              </div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,5vw,52px)", fontWeight:600, color:"#f5f0e8", letterSpacing:"0.04em", lineHeight:1.1 }}>
                {step === 0 ? "Your " : step === 1 ? "Shipping " : "Review "}
                <em style={{ color:ACCENT, backgroundImage:`linear-gradient(90deg,${ACCENT},#e8d5a0,${ACCENT})`, backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"shimmer 4s linear infinite" }}>
                  {step === 0 ? "Cart" : step === 1 ? "Details" : "Order"}
                </em>
              </h1>
            </div>
          )}

          {/* Step bar */}
          {step < 3 && <StepBar step={step} />}

          {/* Steps */}
          <div style={{ animation:"fadeUp 0.5s 0.1s ease forwards", opacity:0 }}>
            {step === 0 && (
              <CartStep
                onNext={() => setStep(1)}
                cartItems={cartItems}
                updateQty={updateQty}
                removeFromCart={removeFromCart}
                totalPrice={totalPrice}
                totalCount={totalCount}
              />
            )}
            {step === 1 && (
              <ShippingStep
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
                shippingData={shippingData}
                setShippingData={setShippingData}
              />
            )}
            {step === 2 && (
              <ReviewStep
                onBack={() => setStep(1)}
                cartItems={cartItems}
                totalPrice={totalPrice}
                totalCount={totalCount}
                shippingData={shippingData}
                onPlaceOrder={handlePlaceOrder}
                placing={placing}
              />
            )}
            {step === 3 && <SuccessScreen orderId={orderId} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;