import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const HeartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const CartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const UserIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6"  y1="6" x2="18" y2="18"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const NAV_LINKS = ["Home", "About", "Products", "Contact"];
const ACCENT = "#c9a84c";

// ── Cart Drawer ───────────────────────────────────────────────────────────────
const CartDrawer = () => {
  const {
    drawerOpen, setDrawerOpen,
    cartItems, totalPrice, totalCount,
    updateQty, removeFromCart,
  } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 998,
          background: "rgba(0,0,0,0.72)",
          backdropFilter: "blur(4px)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 999,
        width: "min(420px, 100vw)",
        background: "#0a0806",
        borderLeft: `1px solid ${ACCENT}22`,
        transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        fontFamily: "'Jost', sans-serif",
        boxShadow: drawerOpen ? `-20px 0 80px rgba(0,0,0,0.85)` : "none",
      }}>

        {/* Header */}
        <div style={{
          padding: "22px 28px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: "#f5f0e8", letterSpacing: "0.04em" }}>
                Your Cart
              </span>
              {totalCount > 0 && (
                <span style={{ background: ACCENT, color: "#0a0806", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                  {totalCount}
                </span>
              )}
            </div>
            <div style={{ fontSize: 9, letterSpacing: "0.35em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginTop: 2 }}>
              FRAGY · Maison de Parfum
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.5)", cursor: "pointer",
              width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            <XIcon />
          </button>
        </div>

        {/* Gold line */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${ACCENT}55, transparent)`, flexShrink: 0 }} />

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 28px" }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", color: "rgba(255,255,255,0.18)" }}>
              <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.25 }}>◈</div>
              <p style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>Cart is empty</p>
              <p style={{ fontSize: 10, marginTop: 6, opacity: 0.6 }}>Add a fragrance to begin</p>
            </div>
          ) : cartItems.map((item, idx) => {
            const p = item.perfume;
            if (!p) return null;
            const catAccents = { Oriental:"#c9a84c", Floral:"#a78bfa", "Floral-Oriental":"#e8927c", Fresh:"#6ee7b7", Woody:"#f0c87a", Citrus:"#94a3b8" };
            const ia = catAccents[p.category] || ACCENT;

            return (
              <div key={p._id || idx} style={{
                display: "flex", gap: 14,
                paddingBottom: 18, marginBottom: 18,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                animation: "slideInR 0.3s ease forwards",
                animationDelay: `${idx * 0.05}s`, opacity: 0,
              }}>
                {/* Thumb */}
                <div style={{
                  width: 66, height: 82, flexShrink: 0,
                  background: `${ia}0c`, border: `1px solid ${ia}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  {p.image?.url
                    ? <img src={p.image.url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : (
                      <svg width="28" height="42" viewBox="0 0 120 180" fill="none">
                        <rect x="46" y="30" width="28" height="30" rx="4" fill={ia} fillOpacity="0.25" />
                        <rect x="50" y="18" width="20" height="14" rx="3" fill={ia} fillOpacity="0.6" />
                        <rect x="22" y="58" width="76" height="100" rx="12" fill={ia} fillOpacity="0.1" stroke={ia} strokeOpacity="0.35" strokeWidth="1.5" />
                      </svg>
                    )
                  }
                  <div style={{ position:"absolute",top:0,left:0,width:8,height:8,borderTop:`1px solid ${ia}`,borderLeft:`1px solid ${ia}` }} />
                  <div style={{ position:"absolute",bottom:0,right:0,width:8,height:8,borderBottom:`1px solid ${ia}`,borderRight:`1px solid ${ia}` }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 8, color: ia, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 2 }}>{p.category || "Fragrance"}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 600, color: "#f5f0e8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 2 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginBottom: 8 }}>
                    {p.size || "50ml"} · ${p.price}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Qty */}
                    <div style={{ display: "flex", alignItems: "center", border: `1px solid ${ia}28` }}>
                      <button onClick={() => updateQty(p._id, item.quantity - 1)} style={{ width:26,height:26,background:"transparent",border:"none",color:ia,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.15s" }}
                        onMouseEnter={e=>e.currentTarget.style.background=`${ia}15`}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                      >−</button>
                      <span style={{ width:24,textAlign:"center",color:"#f5f0e8",fontSize:12,fontWeight:500 }}>{item.quantity}</span>
                      <button onClick={() => updateQty(p._id, item.quantity + 1)} style={{ width:26,height:26,background:"transparent",border:"none",color:ia,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.15s" }}
                        onMouseEnter={e=>e.currentTarget.style.background=`${ia}15`}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                      >+</button>
                    </div>

                    {/* Subtotal */}
                    <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:ia }}>
                      ${(p.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Remove */}
                    <button onClick={() => removeFromCart(p._id)} style={{ background:"transparent",border:"1px solid rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.28)",cursor:"pointer",width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s" }}
                      onMouseEnter={e=>{ e.currentTarget.style.borderColor="#e8927c"; e.currentTarget.style.color="#e8927c"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.color="rgba(255,255,255,0.28)"; }}
                    ><TrashIcon /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding:"18px 28px 26px", borderTop:"1px solid rgba(255,255,255,0.06)", flexShrink:0, background:"rgba(0,0,0,0.25)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4 }}>
              <span style={{ fontSize:9,letterSpacing:"0.28em",color:"rgba(255,255,255,0.28)",textTransform:"uppercase" }}>Total</span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:"#f5f0e8",fontWeight:600 }}>${totalPrice.toFixed(2)}</span>
            </div>
            <p style={{ fontSize:9,color:"rgba(255,255,255,0.18)",letterSpacing:"0.05em",marginBottom:16 }}>Shipping calculated at checkout</p>

            {/* ✅ window.location.href ki jagah Link use kiya */}
            <Link
              to="/cart"
              onClick={() => setDrawerOpen(false)}
              style={{
                display:"block", width:"100%", padding:"13px 0",
                background:ACCENT, border:"none", color:"#0a0806",
                fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:700,
                letterSpacing:"0.32em", textTransform:"uppercase",
                cursor:"pointer", textDecoration:"none", textAlign:"center",
                clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",
                marginBottom:8, transition:"opacity 0.2s",
              }}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.87"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            >Proceed to Checkout</Link>

            <button
              onClick={() => setDrawerOpen(false)}
              style={{ width:"100%",padding:"10px 0",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.45)",fontFamily:"'Jost',sans-serif",fontSize:9,letterSpacing:"0.25em",textTransform:"uppercase",cursor:"pointer",clipPath:"polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)",transition:"all 0.2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.22)"; e.currentTarget.style.color="rgba(255,255,255,0.75)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(255,255,255,0.45)"; }}
            >Continue Shopping</button>
          </div>
        )}
      </div>

      <style>{`@keyframes slideInR { from{opacity:0;transform:translateX(14px)} to{opacity:1;transform:translateX(0)} }`}</style>
    </>
  );
};

// ── Mobile Menu ───────────────────────────────────────────────────────────────
const MobileMenu = ({ open, onClose, accent }) => (
  <>
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:88,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",opacity:open?1:0,pointerEvents:open?"auto":"none",transition:"opacity 0.3s" }} />
    <div style={{
      position:"fixed",top:0,left:0,bottom:0,zIndex:89,
      width:"min(300px,85vw)",
      background:"#080604",
      borderRight:`1px solid ${accent}18`,
      transform:open?"translateX(0)":"translateX(-100%)",
      transition:"transform 0.4s cubic-bezier(0.4,0,0.2,1)",
      display:"flex",flexDirection:"column",
      padding:"80px 0 40px",
    }}>
      <div style={{ flex:1,display:"flex",flexDirection:"column",gap:2,padding:"0 24px" }}>
        {NAV_LINKS.map((item,i) => (
          // ✅ <a> ki jagah <Link> use kiya
          <Link
            key={item}
            to={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`}
            onClick={onClose}
            style={{
              display:"block",padding:"14px 0",
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:26,fontWeight:400,color:"rgba(255,255,255,0.7)",
              letterSpacing:"0.06em",textDecoration:"none",
              borderBottom:"1px solid rgba(255,255,255,0.05)",
              transition:"color 0.2s",
              animation:open?`fadeInL 0.4s ease forwards`:"none",
              animationDelay:`${i*0.07}s`,
              opacity:0,
            }}
            onMouseEnter={e=>e.currentTarget.style.color=accent}
            onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.7)"}
          >{item}</Link>
        ))}
      </div>

      <div style={{ padding:"0 24px" }}>
        {/* ✅ <a> ki jagah <Link> use kiya */}
        <Link
          to="/user/register"
          onClick={onClose}
          style={{
            display:"block",textAlign:"center",padding:"12px 0",
            background:accent,color:"#0a0806",
            fontFamily:"'Jost',sans-serif",fontSize:10,fontWeight:700,
            letterSpacing:"0.3em",textTransform:"uppercase",textDecoration:"none",
            clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)",
          }}
        >Register</Link>
      </div>
    </div>
    <style>{`@keyframes fadeInL{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}`}</style>
  </>
);

// ── Navbar ────────────────────────────────────────────────────────────────────
export default function Navbar({ accent = ACCENT }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [wishlist,    setWishlist]    = useState(0);
  const [wishPop,     setWishPop]     = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const { totalCount, setDrawerOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleWish = () => {
    setWishlist(w => w + 1);
    setWishPop(true);
    setTimeout(() => setWishPop(false), 1800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@200;300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        .nav-link{
          position:relative; font-family:'Jost',sans-serif;
          font-size:12px; letter-spacing:0.22em;
          text-transform:uppercase; font-weight:300;
          color:rgba(255,255,255,0.5); text-decoration:none;
          transition:color 0.25s;
          padding-bottom:2px;
        }
        .nav-link::after{
          content:''; position:absolute; bottom:-2px; left:0;
          width:0; height:1px;
          background:${accent};
          transition:width 0.3s ease;
        }
        .nav-link:hover{ color:rgba(255,255,255,0.92); }
        .nav-link:hover::after{ width:100%; }
        .nav-link.active{ color:${accent}; }
        .nav-link.active::after{ width:100%; }

        .icon-btn{
          position:relative; width:38px; height:38px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.1);
          color:rgba(255,255,255,0.55);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all 0.25s;
        }
        .icon-btn:hover{
          color:rgba(255,255,255,0.9);
          border-color:${accent}55;
          background:${accent}0e;
        }

        .badge{
          position:absolute; top:-6px; right:-6px;
          min-width:18px; height:18px; padding:0 4px;
          border-radius:10px;
          font-family:'Jost',sans-serif;
          font-size:9px; font-weight:700;
          display:flex; align-items:center; justify-content:center;
          color:#0a0806; background:${accent};
          animation:popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        .pop-toast{
          position:absolute; top:-38px; left:50%;
          transform:translateX(-50%);
          background:${accent}; color:#0a0806;
          font-family:'Jost',sans-serif;
          font-size:10px; font-weight:700;
          padding:4px 10px; white-space:nowrap;
          clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
          animation:toastUp 0.25s ease;
          pointer-events:none;
        }

        @keyframes popIn   { from{transform:scale(0)} to{transform:scale(1)} }
        @keyframes toastUp { from{opacity:0;transform:translateX(-50%) translateY(6px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

        .register-btn{
          display:flex; align-items:center; gap:6px;
          padding:8px 18px;
          font-family:'Jost',sans-serif;
          font-size:10px; font-weight:600;
          letter-spacing:0.28em; text-transform:uppercase;
          color:${accent}; text-decoration:none;
          border:1px solid ${accent}44;
          background:${accent}0d;
          clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));
          transition:all 0.25s;
        }
        .register-btn:hover{
          background:${accent}1a;
          border-color:${accent}88;
          transform:translateY(-1px);
        }
      `}</style>

      {/* Cart Drawer lives here — renders in navbar so it's always available */}
      <CartDrawer />

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.4s ease",
        padding: scrolled ? "10px 0" : "18px 0",
        background: scrolled ? "rgba(6,4,3,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? `1px solid ${accent}18` : "1px solid transparent",
        boxShadow: scrolled ? `0 8px 40px rgba(0,0,0,0.5)` : "none",
      }}>
        <div style={{
          maxWidth: 1380, margin: "0 auto",
          padding: "0 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* ── Logo ── */}
          {/* ✅ <a> ki jagah <Link> use kiya */}
          <Link to="/" style={{ textDecoration:"none", display:"flex", flexDirection:"column", lineHeight:1 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 26, fontWeight: 400,
              letterSpacing: "0.42em",
              color: accent,
              textTransform: "uppercase",
              transition: "opacity 0.2s",
            }}>FRAGY</span>
            <span style={{
              fontSize: 8, letterSpacing: "0.55em",
              color: "rgba(255,255,255,0.22)",
              textTransform: "uppercase",
              fontFamily: "'Jost',sans-serif",
              fontWeight: 300,
              marginTop: 2,
            }}>Maison de Parfum</span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul style={{ display:"flex", alignItems:"center", gap:36, listStyle:"none", margin:0, padding:0 }}
            className="nav-links-desktop">
            {NAV_LINKS.map(item => (
              <li key={item}>
                <Link
                  to={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`}
                  className="nav-link"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Right Actions ── */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>

            {/* <ThemeToggle /> */}
            {/* <ThemeToggle/> */}

            <Link to="/user/register" className="register-btn" style={{ display:"none" }} id="register-btn-desktop">
              <UserIcon />
              Register
            </Link>

            <button className="icon-btn" onClick={() => setDrawerOpen(true)} title="Cart">
              <CartIcon />
              {totalCount > 0 && <span className="badge">{totalCount}</span>}
            </button>

            

            {/* Mobile hamburger */}
            <button
              className="icon-btn"
              onClick={() => setMobileOpen(o => !o)}
              style={{ display:"none" }}
              id="hamburger-btn"
              title="Menu"
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Thin accent underline */}
        <div style={{
          position:"absolute",bottom:0,left:"8%",right:"8%",height:"1px",
          background:`linear-gradient(90deg,transparent,${accent}${scrolled?"30":"18"},transparent)`,
          transition:"opacity 0.4s",
        }} />
      </nav>

      {/* Mobile Menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} accent={accent} />

      {/* Responsive styles */}
      <style>{`
        @media(min-width:769px){
          #register-btn-desktop{ display:flex !important; }
          #hamburger-btn{ display:none !important; }
          .nav-links-desktop{ display:flex !important; }
        }
        @media(max-width:768px){
          #register-btn-desktop{ display:none !important; }
          #hamburger-btn{ display:flex !important; }
          .nav-links-desktop{ display:none !important; }
        }
        @media(max-width:640px){
          nav > div { padding: 0 20px !important; }
        }
      `}</style>
    </>
  );
}


