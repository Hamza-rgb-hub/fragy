import { useState } from "react";
import API from "../../utils/api";
import '../../Style/track-order.css'; 
// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const SprayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3h2l.5 2"/><path d="M7 13H4.5A1.5 1.5 0 0 1 3 11.5V9a1.5 1.5 0 0 1 1.5-1.5H7"/>
    <rect x="7" y="5" width="10" height="14" rx="2"/><line x1="11" y1="5" x2="11" y2="2"/>
    <line x1="15" y1="2" x2="11" y2="2"/>
  </svg>
);

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_STEPS = [
  { key: "pending",    label: "Order Placed",    icon: ClockIcon,   desc: "Your order has been received" },
  { key: "confirmed",  label: "Confirmed",        icon: CheckIcon,   desc: "Order confirmed & being prepared" },
  { key: "processing", label: "Processing",       icon: PackageIcon, desc: "Fragrances being carefully packaged" },
  { key: "shipped",    label: "Shipped",          icon: TruckIcon,   desc: "On its way to you" },
  { key: "delivered",  label: "Delivered",        icon: CheckIcon,   desc: "Arrived at your doorstep" },
];

const STATUS_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered"];

const getStepIndex = (status) => {
  const s = (status || "").toLowerCase();
  const idx = STATUS_ORDER.indexOf(s);
  return idx === -1 ? 0 : idx;
};

const STATUS_COLOR = {
  pending:    "#c9a84c",
  confirmed:  "#c9a84c",
  processing: "#c9a84c",
  shipped:    "#c9a84c",
  delivered:  "#c9a84c",
  cancelled:  "#f87171",
};

// ── Particle dots ─────────────────────────────────────────────────────────────
const Particles = ({ accent }) => (
  <>
    {[...Array(6)].map((_, i) => (
      <div key={i} style={{
        position: "absolute",
        width: i % 2 === 0 ? 3 : 2, height: i % 2 === 0 ? 3 : 2,
        borderRadius: "50%", background: accent, opacity: 0.25 + (i % 3) * 0.1,
        top: `${10 + i * 14}%`, left: `${5 + (i % 3) * 30}%`,
        animation: `floatP${i % 3} ${2.5 + i * 0.4}s ease-in-out infinite`,
        animationDelay: `${i * 0.35}s`, pointerEvents: "none",
      }} />
    ))}
  </>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function TrackOrder() {
  const [form, setForm]       = useState({ orderId: "", email: "" });
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [focused, setFocused] = useState("");

  const accent = order
    ? STATUS_COLOR[order.status?.toLowerCase()] || "#c9a84c"
    : "#c9a84c";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.orderId.trim() || !form.email.trim()) {
      setError("Please fill in both Order ID and Email.");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await API.get(`/orders/track`, {
        params: { orderId: form.orderId.trim(), email: form.email.trim() },
      });
      const data = res.data?.order || res.data;
      if (!data) throw new Error("Order not found.");
      setOrder(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.status === 404
          ? "No order found with this ID and email combination."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setOrder(null); setError(""); setForm({ orderId: "", email: "" }); };

  const stepIdx     = order ? getStepIndex(order.status) : -1;
  const isCancelled = order?.status?.toLowerCase() === "cancelled";

  return (
    <>
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0804 0%, #110e06 50%, #1a1508 100%)",
        paddingTop: 90, paddingBottom: 60,
        fontFamily: "'Jost', sans-serif", position: "relative", overflow: "hidden",
        "--accent": accent,
        "--accent-dim": `${accent}55`,
      }}>
        <Particles accent={accent} />

        {/* Ambient glow */}
        <div style={{
          position:"absolute", top:"10%", left:"50%", transform:"translateX(-50%)",
          width:500, height:500, borderRadius:"50%", background:accent,
          opacity:0.08, filter:"blur(120px)", pointerEvents:"none",
          animation:"pulse 5s ease-in-out infinite", transition:"background 0.8s",
        }} />

        {/* Top rule */}
        <div style={{
          position:"absolute", top:0, left:"8%", right:"8%", height:1,
          background:`linear-gradient(90deg, transparent, ${accent}30, transparent)`,
        }} />

        <div style={{ maxWidth:780, margin:"0 auto", padding:"0 24px", position:"relative", zIndex:1 }}>

          {/* ── HEADER ── */}
          <div className="track-fade-in" style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:16 }}>
              <div style={{ width:40, height:1, background:accent, opacity:0.7 }} />
              <span style={{ fontSize:9, letterSpacing:"0.5em", color:accent, textTransform:"uppercase", fontWeight:500 }}>
                Order Status
              </span>
              <div style={{ width:40, height:1, background:accent, opacity:0.7 }} />
            </div>
            <h1 className="track-title" style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:"clamp(42px, 9vw, 80px)", fontWeight:300,
              color:"#f5f0e8", letterSpacing:"-0.02em", lineHeight:0.95,
              marginBottom:14,
            }}>
              Track Your<br />
              <em style={{ fontStyle:"italic", color:accent }}>Order</em>
            </h1>
            <p style={{
              fontSize:13, color:"rgba(255,255,255,0.3)", letterSpacing:"0.15em",
              fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic",
            }}>
              Enter your details to discover where your fragrance is
            </p>
          </div>

          {/* ── SEARCH CARD ── */}
          {!order && (
            <div className="track-card track-fade-in-d1" style={{
              background:"rgba(255,255,255,0.03)",
              border:`1px solid rgba(255,255,255,0.08)`,
              padding:"44px 40px", marginBottom:32,
              clipPath:"polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px))",
              backdropFilter:"blur(12px)",
            }}>
              <form onSubmit={handleSubmit}>
                <div style={{ display:"grid", gap:16, marginBottom:20 }}>

                  {/* Order ID */}
                  <div>
                    <label style={{
                      display:"block", fontSize:9, letterSpacing:"0.4em",
                      color:`${accent}90`, textTransform:"uppercase",
                      fontWeight:500, marginBottom:8,
                    }}>Order ID</label>
                    <input
                      className="track-input"
                      type="text"
                      placeholder="e.g. ORD-2024-00123"
                      value={form.orderId}
                      onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))}
                      onFocus={() => setFocused("orderId")}
                      onBlur={() => setFocused("")}
                      style={{ "--accent": accent, "--accent-dim": `${accent}40` }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{
                      display:"block", fontSize:9, letterSpacing:"0.4em",
                      color:`${accent}90`, textTransform:"uppercase",
                      fontWeight:500, marginBottom:8,
                    }}>Email Address</label>
                    <input
                      className="track-input"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused("")}
                      style={{ "--accent": accent, "--accent-dim": `${accent}40` }}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    padding:"12px 16px", marginBottom:16,
                    background:"rgba(248,113,113,0.08)",
                    border:"1px solid rgba(248,113,113,0.25)",
                    clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
                    display:"flex", alignItems:"center", gap:10,
                  }}>
                    <XIcon style={{ color:"#f87171", flexShrink:0 }} />
                    <span style={{ fontSize:12, color:"#f87171", letterSpacing:"0.05em" }}>{error}</span>
                  </div>
                )}

                <button className="track-btn" type="submit" disabled={loading}
                  style={{ "--accent": accent, "--accent-dim": `${accent}55` }}>
                  {loading
                    ? <><div style={{
                        width:14, height:14, borderRadius:"50%",
                        border:"2px solid rgba(10,8,6,0.3)", borderTopColor:"#0a0806",
                        animation:"spinRing 0.7s linear infinite",
                      }} /> Searching...</>
                    : <><SearchIcon /> Track Order</>
                  }
                </button>
              </form>

              {/* Hint */}
              <p style={{
                marginTop:20, textAlign:"center", fontSize:11,
                color:"rgba(255,255,255,0.18)", letterSpacing:"0.12em",
              }}>
                Find your Order ID in your confirmation email
              </p>
            </div>
          )}

          {/* ── ORDER RESULT ── */}
          {order && (
            <div className="track-fade-in">

              {/* Top bar: order meta */}
              <div className="track-card" style={{
                background:"rgba(255,255,255,0.03)",
                border:`1px solid ${accent}30`,
                padding:"28px 36px", marginBottom:20,
                clipPath:"polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))",
                display:"flex", flexWrap:"wrap", alignItems:"center",
                justifyContent:"space-between", gap:16,
              }}>
                <div>
                  <p style={{ fontSize:9, letterSpacing:"0.45em", color:`${accent}80`, textTransform:"uppercase", marginBottom:6 }}>Order Reference</p>
                  <p style={{
                    fontFamily:"'Cormorant Garamond', serif", fontSize:26,
                    fontWeight:500, color:"#f5f0e8", letterSpacing:"0.04em",
                  }}>{order.orderId || order._id}</p>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:10, alignItems:"center" }}>
                  {/* Status badge */}
                  <div style={{
                    padding:"8px 18px",
                    background: isCancelled ? "rgba(248,113,113,0.12)" : `${accent}18`,
                    border:`1px solid ${isCancelled ? "rgba(248,113,113,0.4)" : `${accent}50`}`,
                    clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
                  }}>
                    <span style={{
                      fontSize:10, letterSpacing:"0.35em", textTransform:"uppercase",
                      fontWeight:600, color: isCancelled ? "#f87171" : accent,
                    }}>{order.status}</span>
                  </div>
                  <button onClick={reset} style={{
                    padding:"8px 16px", background:"transparent",
                    border:"1px solid rgba(255,255,255,0.12)", cursor:"pointer",
                    fontFamily:"'Jost', sans-serif", fontSize:10,
                    letterSpacing:"0.25em", textTransform:"uppercase",
                    color:"rgba(255,255,255,0.4)", transition:"all 0.2s",
                    clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
                  }}>
                    New Search
                  </button>
                </div>
              </div>

              {/* Progress stepper */}
              {!isCancelled && (
                <div className="track-card track-fade-in-d1" style={{
                  background:"rgba(255,255,255,0.03)",
                  border:`1px solid rgba(255,255,255,0.07)`,
                  padding:"36px 36px 28px",
                  clipPath:"polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))",
                  marginBottom:20,
                }}>
                  <p style={{
                    fontSize:9, letterSpacing:"0.45em", color:`${accent}80`,
                    textTransform:"uppercase", marginBottom:28,
                  }}>Journey</p>

                  {/* Steps */}
                  <div className="steps-wrap" style={{ position:"relative" }}>
                    {/* Progress line */}
                    <div style={{
                      position:"absolute", top:24, left:24,
                      right:24, height:1,
                      background:"rgba(255,255,255,0.06)",
                    }}>
                      <div style={{
                        height:"100%", background:accent, opacity:0.6,
                        width:`${Math.min((stepIdx / (STATUS_STEPS.length - 1)) * 100, 100)}%`,
                        transition:"width 1s cubic-bezier(0.22,1,0.36,1)",
                        boxShadow:`0 0 8px ${accent}80`,
                      }} />
                    </div>

                    <div style={{
                      display:"grid",
                      gridTemplateColumns:`repeat(${STATUS_STEPS.length}, 1fr)`,
                      gap:8, position:"relative",
                    }}>
                      {STATUS_STEPS.map((step, i) => {
                        const done    = i <= stepIdx;
                        const current = i === stepIdx;
                        const Icon    = step.icon;
                        return (
                          <div key={step.key} style={{
                            display:"flex", flexDirection:"column", alignItems:"center", gap:10,
                            animation: done ? `stepPop 0.4s ${i * 0.08}s both` : "none",
                          }}>
                            <div className="step-icon-wrap" style={{
                              borderColor: done ? accent : "rgba(255,255,255,0.1)",
                              background: current
                                ? `${accent}22`
                                : done
                                  ? `${accent}15`
                                  : "rgba(255,255,255,0.03)",
                              boxShadow: current ? `0 0 16px ${accent}50` : "none",
                              color: done ? accent : "rgba(255,255,255,0.2)",
                            }}>
                              <Icon />
                            </div>
                            <div style={{ textAlign:"center" }}>
                              <p className="step-label" style={{
                                fontSize:10, letterSpacing:"0.2em",
                                textTransform:"uppercase", fontWeight:500,
                                color: done ? accent : "rgba(255,255,255,0.2)",
                                marginBottom:3,
                              }}>{step.label}</p>
                              {current && (
                                <p style={{
                                  fontSize:9, color:"rgba(255,255,255,0.3)",
                                  letterSpacing:"0.05em", lineHeight:1.4,
                                }}>{step.desc}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Cancelled banner */}
              {isCancelled && (
                <div className="track-fade-in-d1" style={{
                  padding:"20px 28px", marginBottom:20,
                  background:"rgba(248,113,113,0.07)",
                  border:"1px solid rgba(248,113,113,0.25)",
                  clipPath:"polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))",
                  display:"flex", gap:12, alignItems:"flex-start",
                }}>
                  <div style={{ color:"#f87171", marginTop:1 }}><XIcon /></div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:500, color:"#f87171", letterSpacing:"0.1em", marginBottom:4 }}>Order Cancelled</p>
                    <p style={{ fontSize:12, color:"rgba(248,113,113,0.6)", letterSpacing:"0.05em" }}>
                      {order.cancellationReason || "This order has been cancelled. Please contact support for assistance."}
                    </p>
                  </div>
                </div>
              )}

              {/* Info grid */}
              <div className="result-grid track-fade-in-d2" style={{
                display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20,
              }}>
                {/* Order Details */}
                <div className="track-card" style={{
                  background:"rgba(255,255,255,0.03)",
                  border:"1px solid rgba(255,255,255,0.07)",
                  padding:"24px 28px",
                  clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))",
                }}>
                  <p style={{ fontSize:9, letterSpacing:"0.45em", color:`${accent}80`, textTransform:"uppercase", marginBottom:18 }}>Details</p>
                  {[
                    ["Placed",   order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { day:"numeric", month:"short", year:"numeric" }) : "—"],
                    ["Total",    order.totalAmount ? `$${order.totalAmount}` : "—"],
                    ["Payment",  order.paymentMethod || "—"],
                    ["Items",    order.items?.length ? `${order.items.length} item${order.items.length > 1 ? "s" : ""}` : "—"],
                  ].map(([k, v]) => (
                    <div key={k} style={{
                      display:"flex", justifyContent:"space-between",
                      alignItems:"center", padding:"8px 0",
                      borderBottom:"1px solid rgba(255,255,255,0.04)",
                    }}>
                      <span style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)" }}>{k}</span>
                      <span style={{ fontSize:13, fontFamily:"'Cormorant Garamond', serif", color:"#f5f0e8", fontWeight:500 }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping */}
                <div className="track-card" style={{
                  background:"rgba(255,255,255,0.03)",
                  border:"1px solid rgba(255,255,255,0.07)",
                  padding:"24px 28px",
                  clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))",
                }}>
                  <p style={{ fontSize:9, letterSpacing:"0.45em", color:`${accent}80`, textTransform:"uppercase", marginBottom:18 }}>Shipping</p>
                  {order.shippingAddress ? (
                    <>
                      <p style={{ fontSize:14, fontFamily:"'Cormorant Garamond', serif", color:"#f5f0e8", lineHeight:1.7, marginBottom:12 }}>
                        {order.shippingAddress.name && <>{order.shippingAddress.name}<br /></>}
                        {order.shippingAddress.street && <>{order.shippingAddress.street}<br /></>}
                        {order.shippingAddress.city && <>{order.shippingAddress.city}, {order.shippingAddress.state}<br /></>}
                        {order.shippingAddress.zip && <>{order.shippingAddress.zip}</>}
                      </p>
                      {order.trackingNumber && (
                        <div>
                          <p style={{ fontSize:9, letterSpacing:"0.3em", color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:5 }}>Tracking #</p>
                          <p style={{ fontSize:12, color:accent, letterSpacing:"0.1em", fontFamily:"monospace" }}>{order.trackingNumber}</p>
                        </div>
                      )}
                      {order.estimatedDelivery && (
                        <div style={{ marginTop:12 }}>
                          <p style={{ fontSize:9, letterSpacing:"0.3em", color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:5 }}>Est. Delivery</p>
                          <p style={{ fontSize:13, color:"#f5f0e8", fontFamily:"'Cormorant Garamond', serif" }}>
                            {new Date(order.estimatedDelivery).toLocaleDateString("en-US", { weekday:"long", month:"short", day:"numeric" })}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)" }}>No shipping info available.</p>
                  )}
                </div>
              </div>

              {/* Items */}
              {order.items?.length > 0 && (
                <div className="track-card track-fade-in-d3" style={{
                  background:"rgba(255,255,255,0.03)",
                  border:"1px solid rgba(255,255,255,0.07)",
                  padding:"24px 28px",
                  clipPath:"polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))",
                }}>
                  <p style={{ fontSize:9, letterSpacing:"0.45em", color:`${accent}80`, textTransform:"uppercase", marginBottom:18 }}>Fragrances</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item-row">
                      {/* Image or placeholder */}
                      <div style={{
                        width:52, height:52, flexShrink:0,
                        background:`${accent}10`,
                        border:`1px solid ${accent}25`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        clipPath:"polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))",
                        overflow:"hidden",
                      }}>
                        {item.image
                          ? <img src={item.image} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          : <SprayIcon style={{ color:accent }} />
                        }
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:13, color:"#f5f0e8", fontFamily:"'Cormorant Garamond', serif", fontWeight:500, marginBottom:3 }}>
                          {item.name || "Fragrance"}
                        </p>
                        {item.brand && (
                          <p style={{ fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase", color:`${accent}70` }}>{item.brand}</p>
                        )}
                        <div style={{ display:"flex", gap:8, marginTop:6, flexWrap:"wrap" }}>
                          {item.size && <span className="info-chip">{item.size}</span>}
                          {item.category && <span className="info-chip">{item.category}</span>}
                        </div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, fontWeight:600, color:accent }}>
                          ${item.price || 0}
                        </p>
                        <p style={{ fontSize:10, color:"rgba(255,255,255,0.25)", letterSpacing:"0.15em" }}>
                          × {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ── BOTTOM RULE ── */}
          <div style={{
            marginTop:52, textAlign:"center",
            borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:28,
          }}>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.18)", letterSpacing:"0.2em" }}>
              Need help?{" "}
              <a href="/contact" style={{ color:`${accent}80`, textDecoration:"none", letterSpacing:"0.2em" }}>
                Contact Support →
              </a>
            </p>
          </div>

        </div>
      </section>
    </>
  );
}