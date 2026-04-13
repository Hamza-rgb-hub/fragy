import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";
import { useCart } from "../../context/CartContext";

// ── Constants ─────────────────────────────────────────────────────────────────
const ACCENT = "#c9a84c";
const CAT_ACCENT = {
  Oriental: "#c9a84c", Floral: "#a78bfa",
  "Floral-Oriental": "#e8927c", Fresh: "#6ee7b7",
  Woody: "#f0c87a", Citrus: "#94a3b8",
};
const TAG_COLORS = ["#c9a84c","#a78bfa","#e8927c","#6ee7b7","#f0c87a","#94a3b8"];
const getAccent = (cat) => CAT_ACCENT[cat] || ACCENT;

// ── Icons ─────────────────────────────────────────────────────────────────────
const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);
const CartPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? ACCENT : "none"} stroke={ACCENT} strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const ShareIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const BottleDecorIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 120 180" fill="none">
    <defs>
      <radialGradient id="btlGrad" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor={ACCENT} stopOpacity="0.3"/>
        <stop offset="100%" stopColor={ACCENT} stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="160" rx="38" ry="8" fill={ACCENT} fillOpacity="0.12"/>
    <rect x="46" y="30" width="28" height="30" rx="4" fill="#1a1408" stroke={ACCENT} strokeOpacity="0.35" strokeWidth="0.8"/>
    <rect x="50" y="18" width="20" height="14" rx="3" fill={ACCENT} fillOpacity="0.8"/>
    <rect x="54" y="14" width="12" height="6" rx="2" fill={ACCENT}/>
    <rect x="22" y="58" width="76" height="100" rx="12" fill="#1a1408" stroke={ACCENT} strokeOpacity="0.4" strokeWidth="1"/>
    <rect x="22" y="58" width="76" height="100" rx="12" fill="url(#btlGrad)"/>
    <rect x="32" y="88" width="56" height="52" rx="4" fill={ACCENT} fillOpacity="0.08" stroke={ACCENT} strokeOpacity="0.3" strokeWidth="0.7"/>
    <line x1="38" y1="100" x2="82" y2="100" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="0.6"/>
    <rect x="42" y="106" width="36" height="2.5" rx="1" fill={ACCENT} fillOpacity="0.8"/>
    <line x1="38" y1="116" x2="82" y2="116" stroke={ACCENT} strokeOpacity="0.3" strokeWidth="0.5"/>
    <rect x="28" y="65" width="6" height="60" rx="3" fill="white" fillOpacity="0.04"/>
  </svg>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = ({ w = "100%", h = 16, mb = 10 }) => (
  <div style={{
    width: w, height: h, marginBottom: mb,
    background: "rgba(201,168,76,0.06)",
    borderRadius: 2,
    animation: "skelShimmer 1.6s ease-in-out infinite",
    backgroundSize: "200% 100%",
  }}/>
);

// ── Main Component ────────────────────────────────────────────────────────────
const PerfumeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [perfume,   setPerfume]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [qty,       setQty]       = useState(1);
  const [wishlisted,setWishlisted]= useState(false);
  const [added,     setAdded]     = useState(false);

  const inCart = cartItems.some(i => i.perfume?._id === id);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        if (!mounted) return;
        setPerfume(data.perfume);
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || "Failed to load product.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [id]);

  const handleAddToCart = () => {
    if (!perfume || perfume.stock === 0) return;
    addToCart({
      _id:      perfume._id,
      name:     perfume.name,
      category: perfume.category,
      price:    perfume.price,
      size:     perfume.size || "50ml",
      image:    perfume.image || null,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const accent = perfume ? getAccent(perfume.category) : ACCENT;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@200;300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer     { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes skelShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spinRing    { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes checkPop    { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }

        .detail-wrap { padding: 100px 48px 80px; }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        .detail-img-panel { position: sticky; top: 100px; }

        /* Tablet */
        @media (max-width: 900px) {
          .detail-wrap { padding: 80px 28px 60px; }
          .detail-grid { grid-template-columns: 1fr; gap: 36px; }
          .detail-img-panel { position: static; }
        }

        /* Mobile */
        @media (max-width: 599px) {
          .detail-wrap { padding: 70px 16px 60px; }
          .detail-grid { gap: 24px; }
          .detail-actions { flex-direction: column !important; }
          .detail-actions button { width: 100% !important; }
        }
      `}</style>

      <div
        className="detail-wrap"
        style={{ minHeight:"100vh", background:"#090806", fontFamily:"'Jost',sans-serif", position:"relative", overflow:"hidden" }}
      >
        {/* Ambient glow */}
        <div style={{ position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)",width:600,height:280,background:`radial-gradient(ellipse,${ACCENT}07 0%,transparent 70%)`,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",top:0,left:"8%",right:"8%",height:1,background:`linear-gradient(90deg,transparent,${ACCENT}22,transparent)` }}/>

        <div style={{ maxWidth:1200, margin:"0 auto" }}>

          {/* Back link */}
          <div style={{ marginBottom:32, animation:"fadeUp 0.4s 0.05s ease both", opacity:0 }}>
            <button
              onClick={() => navigate(-1)}
              style={{ display:"inline-flex",alignItems:"center",gap:7,background:"transparent",border:"none",color:"rgba(255,255,255,0.3)",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",cursor:"pointer",transition:"color 0.2s",padding:0 }}
              onMouseEnter={e=>e.currentTarget.style.color=ACCENT}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.3)"}
            >
              <ArrowLeft/> Back
            </button>
          </div>

          {/* ── Error ── */}
          {error && (
            <div style={{ textAlign:"center", padding:"80px 0", animation:"fadeUp 0.4s ease both" }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:"rgba(255,255,255,0.55)", marginBottom:12 }}>
                Product not found
              </p>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"rgba(255,255,255,0.22)", letterSpacing:"0.1em", marginBottom:28 }}>
                {error}
              </p>
              <button
                onClick={() => navigate("/products")}
                style={{ padding:"10px 28px", background:"transparent", border:`1px solid ${ACCENT}44`, color:ACCENT, fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", cursor:"pointer", clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)" }}
              >
                Browse Collection
              </button>
            </div>
          )}

          {/* ── Loading skeleton ── */}
          {loading && !error && (
            <div className="detail-grid" style={{ animation:"fadeUp 0.4s ease both" }}>
              <div>
                <div style={{ height:480, background:"rgba(201,168,76,0.04)", border:"1px solid rgba(201,168,76,0.1)", marginBottom:16 }}/>
              </div>
              <div style={{ paddingTop:8 }}>
                <Skeleton w="40%" h={10} mb={14}/>
                <Skeleton w="75%" h={36} mb={10}/>
                <Skeleton w="55%" h={36} mb={24}/>
                <Skeleton w="100%" h={1} mb={24}/>
                <Skeleton w="90%" h={12} mb={8}/>
                <Skeleton w="80%" h={12} mb={8}/>
                <Skeleton w="60%" h={12} mb={28}/>
                <Skeleton w="100%" h={48} mb={0}/>
              </div>
            </div>
          )}

          {/* ── Product detail ── */}
          {!loading && !error && perfume && (
            <div className="detail-grid" style={{ animation:"fadeUp 0.5s 0.1s ease both", opacity:0 }}>

              {/* LEFT: Image panel */}
              <div className="detail-img-panel">
                <div style={{
                  position:"relative",
                  background:`${accent}06`,
                  border:`1px solid ${accent}22`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  minHeight:460,
                  overflow:"hidden",
                }}>
                  {/* Decorative corner marks */}
                  <div style={{ position:"absolute",top:0,left:0,width:24,height:24,borderTop:`1.5px solid ${accent}`,borderLeft:`1.5px solid ${accent}`,opacity:0.7 }}/>
                  <div style={{ position:"absolute",bottom:0,right:0,width:24,height:24,borderBottom:`1.5px solid ${accent}`,borderRight:`1.5px solid ${accent}`,opacity:0.7 }}/>

                  {/* Spinning ring */}
                  <div style={{ position:"absolute",width:180,height:180,border:`1px dashed ${accent}18`,borderRadius:"50%",top:"50%",left:"50%",animation:"spinRing 28s linear infinite" }}/>

                  {perfume.image?.url ? (
                    <img
                      src={perfume.image.url}
                      alt={perfume.name}
                      style={{ maxWidth:"70%", maxHeight:400, objectFit:"contain", filter:`drop-shadow(0 0 24px ${accent}33)`, position:"relative", zIndex:1 }}
                    />
                  ) : (
                    <div style={{ width:160, height:240, filter:`drop-shadow(0 0 20px ${accent}28)` }}>
                      <BottleDecorIcon/>
                    </div>
                  )}

                  {/* Stock badge */}
                  {perfume.stock === 0 && (
                    <div style={{ position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",background:"rgba(232,146,124,0.15)",border:"1px solid rgba(232,146,124,0.4)",color:"#e8927c",fontSize:9,letterSpacing:"0.18em",padding:"3px 12px",textTransform:"uppercase",fontFamily:"'Jost',sans-serif" }}>
                      Sold Out
                    </div>
                  )}
                  {perfume.isNewArrival && perfume.stock > 0 && (
                    <div style={{ position:"absolute",top:16,right:16,background:`${accent}18`,border:`1px solid ${accent}44`,color:accent,fontSize:8,letterSpacing:"0.18em",padding:"2px 10px",textTransform:"uppercase",fontFamily:"'Jost',sans-serif",clipPath:"polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)" }}>
                      New Arrival
                    </div>
                  )}
                </div>

                {/* Thumbnail strip (if multiple images ever added) */}
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <div style={{ width:60, height:60, border:`1px solid ${accent}44`, background:`${accent}08`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                    {perfume.image?.url
                      ? <img src={perfume.image.url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                      : <div style={{ width:28, height:42, opacity:0.4 }}><BottleDecorIcon/></div>
                    }
                  </div>
                </div>
              </div>

              {/* RIGHT: Info panel */}
              <div>
                {/* Category + brand */}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <span style={{ fontSize:8, letterSpacing:"0.28em", textTransform:"uppercase", color:accent, fontFamily:"'Jost',sans-serif" }}>
                    {perfume.category || "Fragrance"}
                  </span>
                  {perfume.brand && (
                    <>
                      <span style={{ color:"rgba(255,255,255,0.15)", fontSize:10 }}>·</span>
                      <span style={{ fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)", fontFamily:"'Jost',sans-serif" }}>
                        {perfume.brand}
                      </span>
                    </>
                  )}
                </div>

                {/* Name */}
                <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:600, color:"#f5f0e8", lineHeight:1.1, letterSpacing:"0.03em", marginBottom:8 }}>
                  {perfume.name}
                </h1>

                {/* Accent line */}
                <div style={{ width:48, height:1, background:`linear-gradient(90deg,${accent},transparent)`, marginBottom:18 }}/>

                {/* Price + size */}
                <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:20 }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:600, color:accent }}>
                    {typeof perfume.price === "number" ? `$${perfume.price.toFixed(2)}` : "—"}
                  </span>
                  {perfume.size && (
                    <span style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", fontFamily:"'Jost',sans-serif" }}>
                      {perfume.size}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {perfume.tags?.length > 0 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
                    {perfume.tags.map((tag, i) => (
                      <span key={tag} style={{
                        fontSize:8, letterSpacing:"0.14em", textTransform:"uppercase",
                        padding:"3px 10px", fontFamily:"'Jost',sans-serif",
                        border:`1px solid ${TAG_COLORS[i%TAG_COLORS.length]}33`,
                        color:`${TAG_COLORS[i%TAG_COLORS.length]}cc`,
                        clipPath:"polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Divider */}
                <div style={{ height:1, background:"rgba(201,168,76,0.1)", marginBottom:20 }}/>

                {/* Description */}
                {perfume.description && (
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:13, fontWeight:300, color:"rgba(245,240,232,0.5)", lineHeight:1.85, letterSpacing:"0.04em", marginBottom:24 }}>
                    {perfume.description}
                  </p>
                )}

                {/* Details grid */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 20px", marginBottom:28 }}>
                  {[
                    ["Category",  perfume.category],
                    ["Size",      perfume.size || "50ml"],
                    ["Stock",     perfume.stock > 0 ? `${perfume.stock} available` : "Out of stock"],
                    ["Brand",     perfume.brand || "Fragy"],
                  ].map(([k, v]) => v && (
                    <div key={k} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", paddingBottom:8 }}>
                      <div style={{ fontSize:8, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", fontFamily:"'Jost',sans-serif", marginBottom:3 }}>{k}</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)", fontFamily:"'Jost',sans-serif", letterSpacing:"0.05em" }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Qty + Add to cart */}
                <div className="detail-actions" style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                  {/* Qty stepper */}
                  <div style={{ display:"flex", alignItems:"center", border:`1px solid ${accent}30`, flexShrink:0 }}>
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      disabled={perfume.stock === 0}
                      style={{ width:36, height:44, background:"transparent", border:"none", color:accent, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=`${accent}15`}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >−</button>
                    <span style={{ width:36, textAlign:"center", color:"#f5f0e8", fontSize:14, fontWeight:500, fontFamily:"'Jost',sans-serif" }}>{qty}</span>
                    <button
                      onClick={() => setQty(q => Math.min(perfume.stock || 99, q + 1))}
                      disabled={perfume.stock === 0}
                      style={{ width:36, height:44, background:"transparent", border:"none", color:accent, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.2s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=`${accent}15`}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    >+</button>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={perfume.stock === 0}
                    style={{
                      flex:1, padding:"12px 0",
                      background: added ? `${accent}22` : perfume.stock===0 ? "rgba(255,255,255,0.03)" : ACCENT,
                      border:`1px solid ${added ? accent : perfume.stock===0 ? "rgba(255,255,255,0.08)" : ACCENT}`,
                      color: added ? accent : perfume.stock===0 ? "rgba(255,255,255,0.2)" : "#0a0806",
                      fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:700,
                      letterSpacing:"0.28em", textTransform:"uppercase",
                      cursor: perfume.stock===0 ? "not-allowed" : "pointer",
                      clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      transition:"all 0.25s",
                      boxShadow: added || perfume.stock===0 ? "none" : `0 8px 28px ${ACCENT}30`,
                    }}
                    onMouseEnter={e=>{ if(perfume.stock>0 && !added) e.currentTarget.style.opacity="0.88"; }}
                    onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                  >
                    {added ? (
                      <><div style={{ animation:"checkPop 0.35s ease both" }}><CheckIcon/></div> Added to Cart</>
                    ) : perfume.stock===0 ? (
                      "Sold Out"
                    ) : (
                      <><CartPlusIcon/> Add to Cart</>
                    )}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => setWishlisted(w => !w)}
                    style={{ width:44, height:44, flexShrink:0, background: wishlisted ? `${ACCENT}18` : "transparent", border:`1px solid ${wishlisted ? ACCENT : "rgba(255,255,255,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.25s" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=ACCENT}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=wishlisted?ACCENT:"rgba(255,255,255,0.1)"}
                  >
                    <HeartIcon filled={wishlisted}/>
                  </button>
                </div>

                {/* Go to cart if already in cart */}
                {inCart && !added && (
                  <button
                    onClick={() => navigate("/cart")}
                    style={{ width:"100%", padding:"12px 0", background:"transparent", border:`1px solid ${ACCENT}33`, color:ACCENT, fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", cursor:"pointer", clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)", transition:"all 0.2s", marginBottom:16 }}
                    onMouseEnter={e=>e.currentTarget.style.background=`${ACCENT}10`}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    View Cart →
                  </button>
                )}

                {/* Trust badges */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginTop:4 }}>
                  {[
                    ["Free Delivery", "3–5 days"],
                    ["Cash on Delivery", "No advance"],
                    ["Easy Returns", "7 days"],
                  ].map(([title, sub]) => (
                    <div key={title} style={{ padding:"10px 8px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(201,168,76,0.1)", textAlign:"center" }}>
                      <div style={{ fontSize:8, letterSpacing:"0.15em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", fontFamily:"'Jost',sans-serif", marginBottom:3 }}>{title}</div>
                      <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", fontFamily:"'Jost',sans-serif" }}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:`linear-gradient(90deg,transparent,${ACCENT}18,transparent)` }}/>
      </div>
    </>
  );
};

export default PerfumeDetailPage;