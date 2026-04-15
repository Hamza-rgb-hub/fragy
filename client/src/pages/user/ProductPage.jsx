import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import API from "../../utils/api";

// ── Category & Tag theme colors ───────────────────────────────────────────────
const CAT_ACCENT = {
  Oriental: "#c9a84c", Floral: "#a78bfa",
  "Floral-Oriental": "#e8927c", Fresh: "#6ee7b7",
  Woody: "#f0c87a", Citrus: "#94a3b8",
};
const TAG_COLORS = ["#c9a84c","#a78bfa","#e8927c","#6ee7b7","#f0c87a","#94a3b8"];
const ACCENT = "#c9a84c";
const getAccent = (cat) => CAT_ACCENT[cat] || ACCENT;

// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const HeartIcon = ({ filled, color }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const CartPlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── Bottle SVG ────────────────────────────────────────────────────────────────
const BottleSVG = ({ accent, bottleBody, size = 100 }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 120 180" fill="none">
    <defs>
      <radialGradient id={`pg-${accent.replace("#","")}`} cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor={accent} stopOpacity="0.35"/>
        <stop offset="100%" stopColor={accent} stopOpacity="0"/>
      </radialGradient>
      <linearGradient id={`pb-${accent.replace("#","")}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor={bottleBody}/>
        <stop offset="50%"  stopColor={accent} stopOpacity="0.18"/>
        <stop offset="100%" stopColor={bottleBody}/>
      </linearGradient>
      <filter id={`pf-${accent.replace("#","")}`}><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <ellipse cx="60" cy="160" rx="38" ry="8" fill={accent} fillOpacity="0.18" filter={`url(#pf-${accent.replace("#","")})`}/>
    <rect x="46" y="30" width="28" height="30" rx="4" fill={`url(#pb-${accent.replace("#","")})`} stroke={accent} strokeOpacity="0.4" strokeWidth="0.8"/>
    <rect x="50" y="18" width="20" height="14" rx="3" fill={accent} fillOpacity="0.85"/>
    <rect x="54" y="14" width="12" height="6"  rx="2" fill={accent}/>
    <rect x="22" y="58" width="76" height="100" rx="12" fill={`url(#pb-${accent.replace("#","")})`} stroke={accent} strokeOpacity="0.5" strokeWidth="1"/>
    <rect x="22" y="58" width="76" height="100" rx="12" fill={`url(#pg-${accent.replace("#","")})`}/>
    <rect x="32" y="88" width="56" height="52" rx="4" fill={accent} fillOpacity="0.1" stroke={accent} strokeOpacity="0.4" strokeWidth="0.7"/>
    <line x1="38" y1="100" x2="82" y2="100" stroke={accent} strokeOpacity="0.6" strokeWidth="0.6"/>
    <rect x="42" y="106" width="36" height="2.5" rx="1" fill={accent} fillOpacity="0.85"/>
    <line x1="38" y1="116" x2="82" y2="116" stroke={accent} strokeOpacity="0.35" strokeWidth="0.5"/>
    <rect x="28" y="65"  width="6"  height="60" rx="3" fill="white" fillOpacity="0.05"/>
    <rect x="50" y="26"  width="20" height="2"  rx="1" fill={accent} fillOpacity="0.6"/>
  </svg>
);

// ── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{ background:"#0c0a08", border:"1px solid rgba(201,168,76,0.08)", borderRadius:2, overflow:"hidden", position:"relative" }}>
    <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.04),transparent)", backgroundSize:"200% 100%", animation:"skelShimmer 1.6s ease-in-out infinite" }}/>
    <div style={{ height:220, background:"rgba(201,168,76,0.04)" }}/>
    <div style={{ padding:16 }}>
      {[["40%",10],["100%",14],["60%",10],["80%",10],["100%",36],].map(([w,h],i)=>(
        <div key={i} style={{ height:h, width:w, background:"rgba(201,168,76,0.05)", borderRadius:2, marginBottom:10 }}/>
      ))}
    </div>
  </div>
);

// ── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, inCart, isWishlisted, onCart, onWishlist }) => {
  const [hovered, setHovered] = useState(false);
  const accent    = getAccent(product.category);
  const bottleBody = { Oriental:"#1a1408", Floral:"#100d1a","Floral-Oriental":"#1a0d0a", Fresh:"#080f0d", Woody:"#130f05", Citrus:"#0d0f11" }[product.category] || "#0e0c08";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:"relative", background:"#0c0a08",
        border:`1px solid ${hovered ? accent+"88" : "rgba(201,168,76,0.12)"}`,
        borderRadius:2, overflow:"hidden",
        transition:"border-color 0.35s, transform 0.35s, box-shadow 0.35s",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? `0 18px 50px rgba(0,0,0,0.55), 0 0 24px ${accent}18` : "0 4px 20px rgba(0,0,0,0.35)",
        display:"flex", flexDirection:"column",
      }}
    >
      {/* Corner marks */}
      <div style={{ position:"absolute",top:0,left:0,width:18,height:18,borderTop:`1.5px solid ${accent}`,borderLeft:`1.5px solid ${accent}`,opacity:hovered?1:0.4,transition:"opacity 0.3s",zIndex:2 }}/>
      <div style={{ position:"absolute",bottom:0,right:0,width:18,height:18,borderBottom:`1.5px solid ${accent}`,borderRight:`1.5px solid ${accent}`,opacity:hovered?1:0.4,transition:"opacity 0.3s",zIndex:2 }}/>

      {/* Glow bg */}
      <div style={{ position:"absolute",inset:0,background:`radial-gradient(ellipse at 60% 30%, ${accent}10 0%, transparent 70%)`,opacity:hovered?1:0.4,transition:"opacity 0.4s",pointerEvents:"none" }}/>

      {/* New arrival badge */}
      {product.isNewArrival && (
        <div style={{ position:"absolute",top:12,right:12,zIndex:3,background:`${accent}18`,border:`1px solid ${accent}44`,color:accent,fontSize:8,letterSpacing:"0.18em",padding:"2px 8px",textTransform:"uppercase",fontFamily:"'Jost',sans-serif",clipPath:"polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)" }}>
          New
        </div>
      )}

      {/* Out of stock overlay */}
      {product.stock === 0 && (
        <div style={{ position:"absolute",top:12,right:12,zIndex:3,background:"rgba(232,146,124,0.15)",border:"1px solid rgba(232,146,124,0.4)",color:"#e8927c",fontSize:8,letterSpacing:"0.18em",padding:"2px 8px",textTransform:"uppercase",fontFamily:"'Jost',sans-serif",clipPath:"polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)" }}>
          Sold Out
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={() => onWishlist(product._id)}
        style={{ position:"absolute",top:12,left:12,zIndex:3,background:isWishlisted?`${accent}20`:"rgba(0,0,0,0.4)",border:`1px solid ${isWishlisted?accent:"rgba(255,255,255,0.1)"}`,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.25s",backdropFilter:"blur(8px)" }}
        onMouseEnter={e=>e.currentTarget.style.borderColor=accent}
        onMouseLeave={e=>e.currentTarget.style.borderColor=isWishlisted?accent:"rgba(255,255,255,0.1)"}
      >
        <HeartIcon filled={isWishlisted} color={isWishlisted ? accent : "rgba(255,255,255,0.4)"}/>
      </button>

      {/* Image area */}
      <div style={{ position:"relative",height:220,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0 }}>
        <div style={{ position:"absolute",width:120,height:120,border:`1px dashed ${accent}20`,borderRadius:"50%",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:"spinRing 22s linear infinite" }}/>
        {product.image?.url ? (
          <img src={product.image.url} alt={product.name} style={{ width:110,height:165,objectFit:"contain",filter:`drop-shadow(0 0 16px ${accent}33)`,transition:"transform 0.4s",transform:hovered?"scale(1.07)":"scale(1)",position:"relative",zIndex:1 }}/>
        ) : (
          <div style={{ filter:`drop-shadow(0 0 16px ${accent}33)`,transition:"transform 0.4s",transform:hovered?"scale(1.07)":"scale(1)" }}>
            <BottleSVG accent={accent} bottleBody={bottleBody} size={100}/>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:"14px 16px 0", flex:1 }}>
        <div style={{ fontSize:8,letterSpacing:"0.22em",color:accent,textTransform:"uppercase",marginBottom:3,fontFamily:"'Jost',sans-serif" }}>
          {product.category || "Fragrance"}
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:"#f5f0e8",lineHeight:1.2,marginBottom:5,
          display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
          {product.name}
        </div>
        <div style={{ width:hovered?36:18,height:1,background:`linear-gradient(90deg,${accent},transparent)`,marginBottom:8,transition:"width 0.35s" }}/>

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div style={{ display:"flex",gap:4,flexWrap:"wrap",marginBottom:8 }}>
            {product.tags.slice(0,3).map((tag,i) => (
              <span key={tag} style={{ fontSize:7,letterSpacing:"0.12em",color:TAG_COLORS[i%TAG_COLORS.length],border:`1px solid ${TAG_COLORS[i%TAG_COLORS.length]}33`,padding:"1px 6px",textTransform:"uppercase",fontFamily:"'Jost',sans-serif",clipPath:"polygon(3px 0%,100% 0%,calc(100% - 3px) 100%,0% 100%)" }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price row */}
        <div style={{ display:"flex",alignItems:"baseline",gap:6,marginBottom:12 }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:accent }}>
            ${product.price}
          </span>
          {product.size && (
            <span style={{ fontSize:9,color:"rgba(255,255,255,0.28)",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"'Jost',sans-serif" }}>
              {product.size}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"0 16px 16px" }}>
        <button
          onClick={() => product.stock > 0 && onCart(product._id)}
          disabled={product.stock === 0}
          style={{
            width:"100%",padding:"10px 0",
            background: inCart ? `${accent}18` : product.stock===0 ? "rgba(255,255,255,0.03)" : "transparent",
            border:`1px solid ${inCart ? accent : product.stock===0 ? "rgba(255,255,255,0.06)" : accent+"44"}`,
            color: inCart ? accent : product.stock===0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.65)",
            fontFamily:"'Jost',sans-serif",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:500,
            cursor:product.stock===0?"not-allowed":"pointer",
            transition:"all 0.25s",
            display:"flex",alignItems:"center",justifyContent:"center",gap:6,
          }}
          onMouseEnter={e=>{ if(product.stock>0 && !inCart){ e.currentTarget.style.background=`${accent}14`; e.currentTarget.style.borderColor=accent; e.currentTarget.style.color=accent; } }}
          onMouseLeave={e=>{ if(!inCart){ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=accent+"44"; e.currentTarget.style.color="rgba(255,255,255,0.65)"; } }}
        >
          <CartPlusIcon/>
          {product.stock===0 ? "Sold Out" : inCart ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

// ── Price Range Slider ────────────────────────────────────────────────────────
const PriceSlider = ({ min, max, value, onChange }) => {
  const pct = (v) => ((v - min) / (max - min)) * 100;
  return (
    <div style={{ padding:"8px 4px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
        <span style={{ fontSize:10,color:ACCENT,fontFamily:"'Jost',sans-serif" }}>${value[0]}</span>
        <span style={{ fontSize:10,color:ACCENT,fontFamily:"'Jost',sans-serif" }}>${value[1]}</span>
      </div>
      <div style={{ position:"relative",height:4,background:"rgba(201,168,76,0.15)",borderRadius:2,margin:"0 8px" }}>
        <div style={{
          position:"absolute",left:`${pct(value[0])}%`,right:`${100-pct(value[1])}%`,
          height:"100%",background:ACCENT,borderRadius:2,
        }}/>
        {[0,1].map(i => (
          <input key={i} type="range" min={min} max={max} value={value[i]}
            onChange={e => {
              const v = Number(e.target.value);
              if (i===0 && v <= value[1]) onChange([v, value[1]]);
              if (i===1 && v >= value[0]) onChange([value[0], v]);
            }}
            style={{ position:"absolute",width:"100%",height:"100%",opacity:0,cursor:"pointer",top:0,left:0 }}
          />
        ))}
        {[0,1].map(i => (
          <div key={i} style={{ position:"absolute",top:"50%",left:`${pct(value[i])}%`,transform:"translate(-50%,-50%)",width:14,height:14,borderRadius:"50%",background:ACCENT,border:"2px solid #090806",boxShadow:`0 0 8px ${ACCENT}55`,pointerEvents:"none" }}/>
        ))}
      </div>
    </div>
  );
};

// ── Sidebar Filter ────────────────────────────────────────────────────────────
const FilterSidebar = ({ categories, allTags, filters, setFilters, onClear, totalResults, mobileOpen, onMobileClose }) => {
  const hasActive = filters.category !== "All" || filters.tags.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 1000;

  const SectionHead = ({ label }) => (
    <div style={{ fontSize:8,letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(255,255,255,0.25)",fontFamily:"'Jost',sans-serif",marginBottom:12,paddingBottom:8,borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
      {label}
    </div>
  );

  return (
    <div style={{ width: mobileOpen ? "100%" : 240, flexShrink:0, fontFamily:"'Jost',sans-serif" }}>
      {/* Header */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,color:ACCENT }}>
          <FilterIcon/>
          <span style={{ fontSize:11,letterSpacing:"0.22em",textTransform:"uppercase",fontWeight:500 }}>Filters</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          {hasActive && (
            <button onClick={onClear} style={{ fontSize:8,letterSpacing:"0.15em",color:"rgba(232,146,124,0.7)",background:"transparent",border:"none",cursor:"pointer",textTransform:"uppercase",textDecoration:"underline",fontFamily:"'Jost',sans-serif",transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#e8927c"}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(232,146,124,0.7)"}
            >
              Clear all
            </button>
          )}
          {mobileOpen && (
            <button onClick={onMobileClose} style={{ background:"transparent",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <XIcon/>
            </button>
          )}
        </div>
      </div>

      <div style={{ fontSize:10,letterSpacing:"0.1em",color:"rgba(255,255,255,0.2)",marginBottom:24,fontFamily:"'Jost',sans-serif" }}>
        {totalResults} {totalResults===1?"fragrance":"fragrances"} found
      </div>

      {/* Category */}
      <div style={{ marginBottom:28 }}>
        <SectionHead label="Category"/>
        <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setFilters(f => ({ ...f, category: cat }))}
              style={{
                display:"flex",alignItems:"center",gap:10,
                padding:"8px 10px",border:"none",cursor:"pointer",
                color: filters.category===cat ? ACCENT : "rgba(255,255,255,0.45)",
                fontSize:11,letterSpacing:"0.1em",fontFamily:"'Jost',sans-serif",
                transition:"all 0.2s",textAlign:"left",
                borderLeft: filters.category===cat ? `2px solid ${ACCENT}` : "2px solid transparent",
                background: filters.category===cat ? `${ACCENT}08` : "transparent",
              }}
              onMouseEnter={e=>{ if(filters.category!==cat){ e.currentTarget.style.color="rgba(255,255,255,0.75)"; e.currentTarget.style.borderLeftColor="rgba(201,168,76,0.3)"; } }}
              onMouseLeave={e=>{ if(filters.category!==cat){ e.currentTarget.style.color="rgba(255,255,255,0.45)"; e.currentTarget.style.borderLeftColor="transparent"; } }}
            >
              <div style={{ width:6,height:6,borderRadius:"50%",background:filters.category===cat ? getAccent(cat) : "rgba(255,255,255,0.15)",flexShrink:0,transition:"background 0.2s" }}/>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div style={{ marginBottom:28 }}>
        <SectionHead label="Price Range"/>
        <PriceSlider
          min={0} max={1000}
          value={filters.priceRange}
          onChange={(v) => setFilters(f => ({ ...f, priceRange: v }))}
        />
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div style={{ marginBottom:28 }}>
          <SectionHead label="Tags"/>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
            {allTags.map((tag,i) => {
              const active = filters.tags.includes(tag);
              const tc = TAG_COLORS[i%TAG_COLORS.length];
              return (
                <button key={tag}
                  onClick={() => setFilters(f => ({
                    ...f,
                    tags: active ? f.tags.filter(t=>t!==tag) : [...f.tags, tag]
                  }))}
                  style={{
                    fontSize:8,letterSpacing:"0.14em",textTransform:"uppercase",
                    padding:"3px 9px",cursor:"pointer",fontFamily:"'Jost',sans-serif",
                    background: active ? `${tc}18` : "transparent",
                    border:`1px solid ${active ? tc : tc+"33"}`,
                    color: active ? tc : `${tc}88`,
                    clipPath:"polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)",
                    transition:"all 0.2s",
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=tc; e.currentTarget.style.color=tc; }}
                  onMouseLeave={e=>{ if(!active){ e.currentTarget.style.borderColor=`${tc}33`; e.currentTarget.style.color=`${tc}88`; } }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active filters chips */}
      {hasActive && (
        <div style={{ paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize:8,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.2)",marginBottom:8 }}>Active</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
            {filters.category!=="All" && (
              <span style={{ display:"flex",alignItems:"center",gap:4,fontSize:8,color:ACCENT,border:`1px solid ${ACCENT}33`,padding:"2px 8px",fontFamily:"'Jost',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase" }}>
                {filters.category}
                <button onClick={()=>setFilters(f=>({...f,category:"All"}))} style={{ background:"none",border:"none",cursor:"pointer",color:ACCENT,display:"flex",padding:0 }}><XIcon/></button>
              </span>
            )}
            {filters.tags.map(tag => (
              <span key={tag} style={{ display:"flex",alignItems:"center",gap:4,fontSize:8,color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.12)",padding:"2px 8px",fontFamily:"'Jost',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase" }}>
                {tag}
                <button onClick={()=>setFilters(f=>({...f,tags:f.tags.filter(t=>t!==tag)}))} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",display:"flex",padding:0 }}><XIcon/></button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Products Page ────────────────────────────────────────────────────────
const ProductsPage = () => {
  const [products,     setProducts]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [search,       setSearch]       = useState("");
  const [sortBy,       setSortBy]       = useState("newest");
  const [wishlist,     setWishlist]     = useState([]);
  const [sortOpen,     setSortOpen]     = useState(false);
  const [mobileFilter, setMobileFilter] = useState(false);
  const sortRef = useRef(null);

  const [filters, setFilters] = useState({
    category:   "All",
    priceRange: [0, 1000],
    tags:       [],
  });

  const { addToCart, cartItems: contextCart } = useCart();
  const cartItemIds = contextCart.map(i => i.perfume?._id).filter(Boolean);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/products");
        setProducts(data.perfumes || []);
      } catch (err) {
        setError("Failed to load products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];
  const allTags    = [...new Set(products.flatMap(p => p.tags || []))].slice(0, 16);

  const filtered = products
    .filter(p => {
      if (filters.category !== "All" && p.category !== filters.category) return false;
      if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;
      if (filters.tags.length > 0 && !filters.tags.some(t => p.tags?.includes(t))) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.name?.toLowerCase().includes(q) && !p.category?.toLowerCase().includes(q) && !p.tags?.some(t=>t.toLowerCase().includes(q))) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc")   return a.name.localeCompare(b.name);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const handleCart = (productId) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    addToCart({
      _id:      product._id,
      name:     product.name,
      category: product.category,
      price:    product.price,
      size:     product.size  || "50ml",
      image:    product.image || null,
    }, 1);
  };

  const handleWishlist = (id) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  const clearFilters = () =>
    setFilters({ category:"All", priceRange:[0,1000], tags:[] });

  const SORT_OPTIONS = [
    { value:"newest",     label:"Newest First"      },
    { value:"price-asc",  label:"Price: Low → High" },
    { value:"price-desc", label:"Price: High → Low" },
    { value:"name-asc",   label:"Name: A → Z"       },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@200;300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp     {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer    {0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes spinRing   {from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes skelShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes fadeIn     {from{opacity:0}to{opacity:1}}

        .prod-card-anim{animation:fadeUp 0.45s ease forwards;opacity:0;}

        input[type=range]{-webkit-appearance:none;appearance:none;height:4px;background:transparent;pointer-events:none;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;pointer-events:all;width:14px;height:14px;border-radius:50%;background:${ACCENT};border:2px solid #090806;cursor:pointer;}

        .sort-option{
          padding:10px 16px;font-family:'Jost',sans-serif;font-size:11px;
          letter-spacing:0.1em;color:rgba(255,255,255,0.55);cursor:pointer;
          transition:all 0.18s;background:transparent;border:none;
          text-align:left;width:100%;white-space:nowrap;
        }
        .sort-option:hover{background:rgba(201,168,76,0.08);color:rgba(255,255,255,0.9);}
        .sort-option.active{color:${ACCENT};}

        /* ─────────────────────────────────────────────
           DESKTOP ≥ 1024px
           Sidebar visible · 3-column product grid
        ───────────────────────────────────────────── */
        .page-wrap          { padding: 100px 48px 80px; }
        .page-layout        { display: flex; flex-direction: row; gap: 36px; align-items: flex-start; }
        .filter-sidebar     { display: block; width: 240px; flex-shrink: 0; position: sticky; top: 100px; max-height: calc(100vh - 120px); overflow-y: auto; }
        .mobile-filter-btn  { display: none !important; }
        .prod-grid          { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

        /* ─────────────────────────────────────────────
           TABLET  768px – 1023px
           Sidebar hidden (drawer only) · 2-column grid
        ───────────────────────────────────────────── */
        @media (max-width: 1023px) {
          .page-wrap         { padding: 80px 28px 60px; }
          .page-layout       { flex-direction: column; gap: 0; }
          .filter-sidebar    { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
          .prod-grid         { grid-template-columns: repeat(2, 1fr) !important; gap: 16px; }
        }

        /* ─────────────────────────────────────────────
           MOBILE  ≤ 599px
           1-column grid · tighter padding
        ───────────────────────────────────────────── */
        @media (max-width: 599px) {
          .page-wrap { padding: 70px 14px 60px; }
          .prod-grid { grid-template-columns: 1fr !important; gap: 14px; }
          /* Toolbar wraps cleanly */
          .toolbar   { flex-wrap: wrap; gap: 10px !important; }
          /* Sort pushes to new line on very small phones */
          .sort-wrap { margin-left: 0 !important; }
        }

        /* ─────────────────────────────────────────────
           EXTRA SMALL  ≤ 380px
        ───────────────────────────────────────────── */
        @media (max-width: 380px) {
          .page-wrap { padding: 65px 10px 50px; }
        }
      `}</style>

      {/* Mobile filter drawer */}
      {mobileFilter && (
        <>
          <div
            onClick={() => setMobileFilter(false)}
            style={{ position:"fixed",inset:0,zIndex:88,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)" }}
          />
          <div style={{
            position:"fixed",top:0,left:0,bottom:0,zIndex:89,
            width:"min(300px,90vw)",background:"#090806",
            borderRight:`1px solid ${ACCENT}18`,
            padding:"80px 24px 40px",overflowY:"auto",
          }}>
            <FilterSidebar
              categories={categories} allTags={allTags}
              filters={filters} setFilters={setFilters}
              onClear={clearFilters} totalResults={filtered.length}
              mobileOpen onMobileClose={() => setMobileFilter(false)}
            />
          </div>
        </>
      )}

      <div className="page-wrap" style={{ minHeight:"100vh",background:"#090806",fontFamily:"'Jost',sans-serif",position:"relative",overflow:"hidden" }}>

        {/* Ambient */}
        <div style={{ position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)",width:600,height:280,background:`radial-gradient(ellipse,${ACCENT}07 0%,transparent 70%)`,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",top:0,left:"8%",right:"8%",height:1,background:`linear-gradient(90deg,transparent,${ACCENT}22,transparent)` }}/>

        <div style={{ maxWidth:1400,margin:"0 auto" }}>

          {/* Page header */}
          <div style={{ textAlign:"center",marginBottom:48,animation:"fadeUp 0.5s ease forwards" }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:10,color:ACCENT,fontSize:9,letterSpacing:"0.38em",textTransform:"uppercase",marginBottom:14,fontFamily:"'Jost',sans-serif" }}>
              <div style={{ width:28,height:1,background:ACCENT,opacity:0.6 }}/>
              FRAGY · Maison de Parfum
              <div style={{ width:28,height:1,background:ACCENT,opacity:0.6 }}/>
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(30px,5vw,62px)",fontWeight:600,color:"#f5f0e8",letterSpacing:"0.04em",lineHeight:1.1,marginBottom:10 }}>
              Our{" "}
              <em style={{ color:ACCENT,backgroundImage:`linear-gradient(90deg,${ACCENT},#e8d5a0,${ACCENT})`,backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 4s linear infinite" }}>
                Collection
              </em>
            </h1>
            <p style={{ fontSize:13,fontWeight:300,color:"rgba(245,240,232,0.38)",letterSpacing:"0.08em",maxWidth:400,margin:"0 auto",lineHeight:1.8 }}>
              Each bottle holds a world — distilled from the rarest botanicals across the globe.
            </p>
          </div>

          {/* Search + Sort + Mobile filter bar */}
          <div
            className="toolbar"
            style={{ display:"flex",alignItems:"center",gap:12,marginBottom:32,animation:"fadeUp 0.5s 0.1s ease forwards",opacity:0 }}
          >
            {/* Search */}
            <div style={{ flex:1,position:"relative",minWidth:160 }}>
              <div style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"rgba(201,168,76,0.45)",pointerEvents:"none" }}><SearchIcon/></div>
              <input
                value={search}
                onChange={e=>setSearch(e.target.value)}
                placeholder="Search fragrances..."
                style={{ width:"100%",padding:"11px 14px 11px 42px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(201,168,76,0.18)",color:"#f5f0e8",fontFamily:"'Jost',sans-serif",fontSize:12,outline:"none",letterSpacing:"0.05em",transition:"border-color 0.2s" }}
                onFocus={e=>e.target.style.borderColor=ACCENT}
                onBlur={e=>e.target.style.borderColor="rgba(201,168,76,0.18)"}
              />
              {search && (
                <button onClick={()=>setSearch("")} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"rgba(255,255,255,0.3)",cursor:"pointer",display:"flex" }}>
                  <XIcon/>
                </button>
              )}
            </div>

            {/* Mobile filter toggle — shown on ≤1023px via CSS */}
            <button
              onClick={() => setMobileFilter(true)}
              className="mobile-filter-btn"
              style={{
                alignItems:"center",gap:6,
                padding:"11px 16px",background:"transparent",
                border:`1px solid rgba(201,168,76,0.25)`,
                color:"rgba(255,255,255,0.5)",fontFamily:"'Jost',sans-serif",
                fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",
                cursor:"pointer",transition:"all 0.2s",flexShrink:0,
              }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=ACCENT;e.currentTarget.style.color=ACCENT;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.25)";e.currentTarget.style.color="rgba(255,255,255,0.5)";}}>
              <FilterIcon/> Filters
            </button>

            {/* Sort dropdown */}
            <div ref={sortRef} className="sort-wrap" style={{ position:"relative",marginLeft:"auto" }}>
              <button
                onClick={()=>setSortOpen(o=>!o)}
                style={{ display:"flex",alignItems:"center",gap:8,padding:"11px 16px",background:"transparent",border:`1px solid rgba(201,168,76,0.22)`,color:"rgba(255,255,255,0.55)",fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=ACCENT;e.currentTarget.style.color=ACCENT;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.22)";e.currentTarget.style.color="rgba(255,255,255,0.55)";}}
              >
                {SORT_OPTIONS.find(o=>o.value===sortBy)?.label}
                <div style={{ transform:sortOpen?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s" }}><ChevronDown/></div>
              </button>
              {sortOpen && (
                <div style={{ position:"absolute",top:"calc(100% + 6px)",right:0,background:"#0e0c0a",border:`1px solid rgba(201,168,76,0.2)`,zIndex:50,minWidth:190,boxShadow:"0 16px 40px rgba(0,0,0,0.6)",animation:"fadeIn 0.18s ease" }}>
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt.value} className={`sort-option ${sortBy===opt.value?"active":""}`}
                      onClick={()=>{ setSortBy(opt.value); setSortOpen(false); }}>
                      {sortBy===opt.value && <span style={{ color:ACCENT,marginRight:6 }}>✦</span>}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Layout: sidebar + grid */}
          <div className="page-layout">

            {/* Desktop sticky sidebar */}
            <div className="filter-sidebar">
              <FilterSidebar
                categories={categories} allTags={allTags}
                filters={filters} setFilters={setFilters}
                onClear={clearFilters} totalResults={filtered.length}
              />
            </div>

            {/* Grid */}
            <div style={{ flex:1, '@media(maxWidth:599px)': { width: '100%' } }}>

              {/* Error */}
              {error && (
                <div style={{ textAlign:"center",padding:"60px 0" }}>
                  <p style={{ color:"rgba(232,146,124,0.8)",fontSize:13,letterSpacing:"0.1em",marginBottom:20 }}>{error}</p>
                  <button onClick={()=>window.location.reload()} style={{ padding:"9px 24px",background:"transparent",border:`1px solid rgba(201,168,76,0.35)`,color:ACCENT,fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer" }}>
                    Retry
                  </button>
                </div>
              )}

              {/* Skeletons */}
              {loading && (
                <div className="prod-grid">
                  {[1,2,3,4,5,6].map(i=><SkeletonCard key={i}/>)}
                </div>
              )}

              {/* Empty */}
              {!loading && !error && filtered.length===0 && (
                <div style={{ textAlign:"center",padding:"80px 0" }}>
                  <div style={{ fontSize:44,opacity:0.12,marginBottom:16 }}>◈</div>
                  <p style={{ color:"rgba(245,240,232,0.28)",fontSize:13,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:20 }}>
                    No fragrances found
                  </p>
                  <button onClick={clearFilters} style={{ padding:"9px 24px",background:"transparent",border:`1px solid rgba(201,168,76,0.3)`,color:ACCENT,fontFamily:"'Jost',sans-serif",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer" }}>
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Products grid */}
              {!loading && !error && filtered.length>0 && (
                <div className="prod-grid">
                  {filtered.map((product, i) => (
                    <div key={product._id} className="prod-card-anim" style={{ animationDelay:`${(i%6)*0.06}s` }}>
                      <ProductCard
                        product={product}
                        inCart={cartItemIds.includes(product._id)}
                        isWishlisted={wishlist.includes(product._id)}
                        onCart={handleCart}
                        onWishlist={handleWishlist}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ position:"absolute",bottom:0,left:"8%",right:"8%",height:1,background:`linear-gradient(90deg,transparent,${ACCENT}18,transparent)` }}/>
      </div>
    </>
  );
};

export default ProductsPage;