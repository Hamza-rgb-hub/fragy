import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext"; // apna path adjust karo
import API from "../utils/api";
import "../Style/product.css";

// ── Accent colors per category ────────────────────────────────────────────────
const CATEGORY_THEME = {
  Oriental:         { accent: "#c9a84c", bottleBody: "#1a1408", bg: "radial-gradient(ellipse at 60% 30%, rgba(201,168,76,0.13) 0%, transparent 70%)"   },
  Floral:           { accent: "#a78bfa", bottleBody: "#100d1a", bg: "radial-gradient(ellipse at 40% 40%, rgba(167,139,250,0.13) 0%, transparent 70%)"  },
  "Floral-Oriental":{ accent: "#e8927c", bottleBody: "#1a0d0a", bg: "radial-gradient(ellipse at 60% 30%, rgba(232,146,124,0.13) 0%, transparent 70%)"  },
  Fresh:            { accent: "#6ee7b7", bottleBody: "#080f0d", bg: "radial-gradient(ellipse at 40% 60%, rgba(110,231,183,0.12) 0%, transparent 70%)"   },
  Woody:            { accent: "#f0c87a", bottleBody: "#130f05", bg: "radial-gradient(ellipse at 55% 35%, rgba(240,200,122,0.13) 0%, transparent 70%)"   },
  Citrus:           { accent: "#94a3b8", bottleBody: "#0d0f11", bg: "radial-gradient(ellipse at 50% 50%, rgba(148,163,184,0.12) 0%, transparent 70%)"   },
  default:          { accent: "#c9a84c", bottleBody: "#1a1408", bg: "radial-gradient(ellipse at 60% 30%, rgba(201,168,76,0.13) 0%, transparent 70%)"   },
};

const TAG_COLORS = ["#c9a84c", "#a78bfa", "#e8927c", "#6ee7b7", "#f0c87a", "#94a3b8"];
const getTheme   = (category) => CATEGORY_THEME[category] || CATEGORY_THEME.default;

// ── Perfume Bottle SVG ────────────────────────────────────────────────────────
const BottleSVG = ({ accent, bottleBody, size = 160 }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id={`glow-${accent.replace("#","")}`} cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
        <stop offset="100%" stopColor={accent} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`bottle-${accent.replace("#","")}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor={bottleBody} />
        <stop offset="50%"  stopColor={accent} stopOpacity="0.18" />
        <stop offset="100%" stopColor={bottleBody} />
      </linearGradient>
      <filter id={`blur-${accent.replace("#","")}`}><feGaussianBlur stdDeviation="4" /></filter>
    </defs>
    <ellipse cx="60" cy="160" rx="38" ry="8" fill={accent} fillOpacity="0.18" filter={`url(#blur-${accent.replace("#","")})`} />
    <rect x="46" y="30" width="28" height="30" rx="4" fill={`url(#bottle-${accent.replace("#","")})`} stroke={accent} strokeOpacity="0.4" strokeWidth="0.8" />
    <rect x="50" y="18" width="20" height="14" rx="3" fill={accent} fillOpacity="0.85" />
    <rect x="54" y="14" width="12" height="6"  rx="2" fill={accent} />
    <rect x="22" y="58" width="76" height="100" rx="12" fill={`url(#bottle-${accent.replace("#","")})`} stroke={accent} strokeOpacity="0.5" strokeWidth="1" />
    <rect x="22" y="58" width="76" height="100" rx="12" fill={`url(#glow-${accent.replace("#","")})`} />
    <rect x="32" y="88" width="56" height="52"  rx="4"  fill={accent} fillOpacity="0.12" stroke={accent} strokeOpacity="0.5" strokeWidth="0.7" />
    <line x1="38" y1="100" x2="82" y2="100" stroke={accent} strokeOpacity="0.7" strokeWidth="0.6" />
    <rect x="42" y="106" width="36" height="2.5" rx="1" fill={accent} fillOpacity="0.9" />
    <line x1="38" y1="116" x2="82" y2="116" stroke={accent} strokeOpacity="0.4" strokeWidth="0.5" />
    <rect x="48" y="121" width="24" height="1.5" rx="0.75" fill={accent} fillOpacity="0.5" />
    <rect x="28" y="65"  width="6"  height="60" rx="3" fill="white" fillOpacity="0.06" />
    <rect x="50" y="26"  width="20" height="2"  rx="1" fill={accent} fillOpacity="0.6" />
  </svg>
);

// ── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{
    background: "#0c0a08", border: "1px solid rgba(201,168,76,0.1)",
    borderRadius: 2, overflow: "hidden", minHeight: 480, position: "relative",
  }}>
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.04) 50%, transparent 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmerSkel 1.8s ease-in-out infinite",
    }} />
    <div style={{ padding: 20 }}>
      <div style={{ height: 200, background: "rgba(201,168,76,0.05)", borderRadius: 4, marginBottom: 16 }} />
      <div style={{ height: 10, background: "rgba(201,168,76,0.07)", borderRadius: 2, width: "40%", marginBottom: 10 }} />
      <div style={{ height: 22, background: "rgba(201,168,76,0.07)", borderRadius: 2, marginBottom: 10 }} />
      <div style={{ height: 1,  background: "rgba(201,168,76,0.05)", marginBottom: 10 }} />
      <div style={{ height: 12, background: "rgba(201,168,76,0.05)", borderRadius: 2, marginBottom: 6, width: "90%" }} />
      <div style={{ height: 12, background: "rgba(201,168,76,0.05)", borderRadius: 2, marginBottom: 6, width: "75%" }} />
      <div style={{ height: 12, background: "rgba(201,168,76,0.05)", borderRadius: 2, marginBottom: 16, width: "60%" }} />
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[1,2,3].map(i => <div key={i} style={{ height: 20, width: 52, background: "rgba(201,168,76,0.06)", borderRadius: 2 }} />)}
      </div>
      <div style={{ height: 38, background: "rgba(201,168,76,0.08)", borderRadius: 2, marginBottom: 8 }} />
      <div style={{ height: 36, background: "rgba(201,168,76,0.04)", borderRadius: 2 }} />
    </div>
  </div>
);

// ── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, wishlistItems, cartItemIds, onWishlist, onCart }) => {
  const [hovered, setHovered] = useState(false);
  const isWishlisted = wishlistItems.includes(product._id);
  const inCart       = cartItemIds.includes(product._id);

  const { accent, bottleBody, bg } = getTheme(product.category);
  const hasImage = !!product.image?.url;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", background: "#0c0a08",
        border: `1px solid ${hovered ? accent : "rgba(201,168,76,0.15)"}`,
        borderRadius: 2, overflow: "hidden",
        transition: "border-color 0.4s, transform 0.4s, box-shadow 0.4s",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${accent}22`
          : "0 8px 32px rgba(0,0,0,0.4)",
        flex: "0 0 auto", width: "100%",
        fontFamily: "'Jost', sans-serif",
      }}
    >
      {/* Glow bg */}
      <div style={{ position: "absolute", inset: 0, background: bg, opacity: hovered ? 1 : 0.5, transition: "opacity 0.4s", pointerEvents: "none" }} />

      {/* Corner accents */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 24, height: 24, borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}`, opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s", zIndex: 2 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}`, opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s", zIndex: 2 }} />

      {/* New Arrival Tag */}
      {product.isNewArrival && (
        <div style={{
          position: "absolute", top: 14, right: 14, zIndex: 3,
          background: `${accent}18`, border: `1px solid ${accent}55`,
          color: accent, fontSize: 9, letterSpacing: "0.18em",
          padding: "3px 10px", fontWeight: 400, textTransform: "uppercase",
          clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
        }}>
          New Arrival
        </div>
      )}

      {/* Wishlist btn */}
      <button
        onClick={() => onWishlist(product._id)}
        style={{
          position: "absolute", top: 14, left: 14, zIndex: 3,
          background: isWishlisted ? `${accent}22` : "transparent",
          border: `1px solid ${isWishlisted ? accent : "rgba(201,168,76,0.25)"}`,
          borderRadius: 0, width: 30, height: 30,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.3s",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24"
          fill={isWishlisted ? accent : "none"}
          stroke={isWishlisted ? accent : "rgba(201,168,76,0.6)"} strokeWidth="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Image / Bottle area */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "36px 0 20px", minHeight: 200, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", width: 140, height: 140,
          border: `1px dashed ${accent}28`, borderRadius: "50%",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "spinSlow 20s linear infinite",
        }} />

        {hasImage ? (
          <img
            src={product.image.url}
            alt={product.name}
            style={{
              width: 110, height: 165, objectFit: "contain",
              filter: `drop-shadow(0 0 18px ${accent}44)`,
              transition: "filter 0.4s, transform 0.4s",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              position: "relative", zIndex: 1,
            }}
          />
        ) : (
          <div style={{
            filter: `drop-shadow(0 0 18px ${accent}44)`,
            transition: "filter 0.4s, transform 0.4s",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}>
            <BottleSVG accent={accent} bottleBody={bottleBody} size={110} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 20px" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.22em", color: accent, textTransform: "uppercase", fontWeight: 400, marginBottom: 4 }}>
          {product.category || "Fragrance"}
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#f5f0e8", letterSpacing: "0.06em", lineHeight: 1.1, marginBottom: 6 }}>
          {product.name}
        </div>
        <div style={{ width: hovered ? 48 : 24, height: 1, background: `linear-gradient(90deg, ${accent}, transparent)`, marginBottom: 10, transition: "width 0.4s" }} />

        <p style={{
          fontSize: 12, lineHeight: 1.7, color: "rgba(245,240,232,0.55)",
          marginBottom: 12, fontWeight: 300,
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.description || "A distinctive fragrance crafted from the finest botanicals."}
        </p>

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {product.tags.slice(0, 4).map((tag, i) => (
              <span key={tag} style={{
                fontSize: 9, letterSpacing: "0.14em",
                color: TAG_COLORS[i % TAG_COLORS.length],
                border: `1px solid ${TAG_COLORS[i % TAG_COLORS.length]}44`,
                padding: "2px 8px", textTransform: "uppercase",
                clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)",
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: accent, letterSpacing: "0.02em" }}>
            ${product.price}
          </span>
          {product.size && (
            <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "rgba(245,240,232,0.35)", textTransform: "uppercase", marginLeft: "auto" }}>
              {product.size}
            </span>
          )}
          {product.stock === 0 && (
            <span style={{ fontSize: 9, color: "#e8927c", letterSpacing: "0.1em", textTransform: "uppercase", marginLeft: "auto" }}>
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 20px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="hero-cta-primary1"
            onClick={() => product.stock > 0 && onCart(product._id)}
            disabled={product.stock === 0}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {inCart ? "Added ✓" : "Add to Cart"}
          </button>

          <button className="hero-cta-secondary1"
            onClick={() => product.stock > 0 && onCart(product._id)}
            disabled={product.stock === 0}>
            {product.stock === 0 ? "Out of Stock" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Section ──────────────────────────────────────────────────────────────
const ProductSection = () => {
  const [products,        setProducts]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState("");
  const [activeCategory,  setActiveCategory]  = useState("All");
  const [sliderIndex,     setSliderIndex]     = useState(0);
  const [wishlistItems,   setWishlistItems]   = useState([]);

  // ── Responsive window width ─────────────────────────────────────────────────
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop: 4, Medium (768–1023px): 3, Small (<768px): 1
  const visibleCount = windowWidth < 768 ? 1 : windowWidth < 1024 ? 2 : 4;

  const sliderRef = useRef(null);

  // ── useCart hook ────────────────────────────────────────────────────────────
  const { addToCart, cartItems: contextCart } = useCart();

  // IDs of items already in cart (for visual state)
  const cartItemIds = contextCart.map(i => i.perfume?._id).filter(Boolean);

  // ── Fetch products ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/products");
        setProducts(data.perfumes || []);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ── Derived data ────────────────────────────────────────────────────────────
  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  const maxIndex = Math.max(0, filtered.length - visibleCount);

  const slide = (dir) =>
    setSliderIndex(prev => Math.max(0, Math.min(maxIndex, prev + dir)));

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleWishlist = (id) => {
    setWishlistItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCart = (productId) => {
    const product = products.find(p => p._id === productId);
    console.log("Adding to cart:", product);
    if (!product) return;
    addToCart({
      _id:      product._id,
      name:     product.name,
      category: product.category,
      price:    product.price,
      size:     product.size   || "50ml",
      image:    product.image  || null,
    }, 1);
  };

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft")  slide(-1);
      if (e.key === "ArrowRight") slide(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [maxIndex]);

  // Reset slider on category change or visibleCount change
  useEffect(() => { setSliderIndex(0); }, [activeCategory, visibleCount]);

  // Card width & gap
  const cardGap = 20;
  const cardWidthPercent = 100 / visibleCount;
  const cardWidthCalc = `calc(${cardWidthPercent}% - ${(cardGap * (visibleCount - 1)) / visibleCount}px)`;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <section style={{
        background: "#090806", minHeight: "100vh",
        position: "relative", overflow: "hidden",
        padding: "100px 0 80px", fontFamily: "'Jost', sans-serif",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 300,
          background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent)" }} />

        <div className="pad" style={{ maxWidth: 1380, margin: "0 auto", padding: "0 25px" }}>

          {/* Header */}
          <div className="section-reveal" style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, color: "#c9a84c", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 400, marginBottom: 18 }}>
              <div style={{ width: 32, height: 1, background: "#c9a84c", opacity: 0.6 }} />
              Our Collection
              <div style={{ width: 32, height: 1, background: "#c9a84c", opacity: 0.6 }} />
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(38px,5vw,64px)", fontWeight: 600, color: "#f5f0e8", letterSpacing: "0.04em", lineHeight: 1.1, margin: "0 0 12px" }}>
              Rare{" "}
              <em style={{ color: "#c9a84c", backgroundImage: "linear-gradient(90deg,#c9a84c,#e8d5a0,#c9a84c)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>
                Fragrances
              </em>
            </h2>
            <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(245,240,232,0.45)", letterSpacing: "0.08em", maxWidth: 420, margin: "0 auto", lineHeight: 1.8 }}>
              Each bottle holds a world — a story distilled from the rarest botanicals, resins, and essences across the globe.
            </p>
          </div>

          {/* Category Filter */}
          {!loading && !error && (
            <div className="section-reveal-1" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 44 }}>
              {categories.map(cat => (
                <button key={cat} className={`cat-btn ${activeCategory === cat ? "active" : "inactive"}`}
                  onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 16, opacity: 0.4 }}>✦</div>
              <p style={{ color: "rgba(232,146,124,0.8)", fontSize: 13, letterSpacing: "0.1em" }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: 20, background: "transparent",
                  border: "1px solid rgba(201,168,76,0.4)", color: "#c9a84c",
                  padding: "8px 24px", fontFamily: "'Jost',sans-serif",
                  fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
              gap: cardGap,
            }}>
              {Array.from({ length: visibleCount }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.2 }}>◈</div>
              <p style={{ color: "rgba(245,240,232,0.3)", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                No fragrances in this category
              </p>
            </div>
          )}

          {/* Product Slider */}
          {!loading && !error && filtered.length > 0 && (
            <div className="section-reveal-2">
              {/* Controls bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", color: "rgba(245,240,232,0.3)", textTransform: "uppercase", fontWeight: 300 }}>
                  {filtered.length} {filtered.length === 1 ? "fragrance" : "fragrances"}
                </div>

                {maxIndex > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                        <div key={i} className={`progress-pip ${i === sliderIndex ? "active" : ""}`}
                          style={{ width: i === sliderIndex ? 28 : 14 }}
                          onClick={() => setSliderIndex(i)} />
                      ))}
                    </div>
                    <button className="slider-btn" onClick={() => slide(-1)} disabled={sliderIndex === 0}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button className="slider-btn" onClick={() => slide(1)} disabled={sliderIndex >= maxIndex}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Slider viewport */}
              <div style={{ overflow: "hidden" }}>
                <div
                  ref={sliderRef}
                  className="slider-track"
                  style={{
                    gap: `${cardGap}px`,
                    transform: `translateX(calc(-${sliderIndex * cardWidthPercent}% - ${sliderIndex * cardGap}px))`,
                  }}
                >
                  {filtered.map(product => (
                    <div
                      key={product._id}
                      style={{
                        flex: `0 0 ${cardWidthCalc}`,
                        minWidth: 0,
                      }}
                    >
                      <ProductCard
                        product={product}
                        wishlistItems={wishlistItems}
                        cartItemIds={cartItemIds}
                        onWishlist={handleWishlist}
                        onCart={handleCart}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg,transparent,rgba(201,168,76,0.25),transparent)" }} />
      </section>
    </>
  );
};

export default ProductSection;