import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API from "../utils/api";
import '../Style/hero.css'

// ── Category → accent color map ───────────────────────────────────────────────
const CATEGORY_ACCENT = {
  oriental: {
    accent: "#c9a84c",
    bgFrom: "#0a0804",
    bgVia: "#110e06",
    bgTo: "#1a1508",
  },
  woody: {
    accent: "#8b5cf6",
    bgFrom: "#06050f",
    bgVia: "#0c0a1a",
    bgTo: "#120f22",
  },
  floral: {
    accent: "#c0896a",
    bgFrom: "#0f0806",
    bgVia: "#180f0a",
    bgTo: "#1e1208",
  },
  fresh: {
    accent: "#5ba4c9",
    bgFrom: "#04080f",
    bgVia: "#060d18",
    bgTo: "#081220",
  },
  aquatic: {
    accent: "#38bdf8",
    bgFrom: "#04090f",
    bgVia: "#060e18",
    bgTo: "#081420",
  },
  citrus: {
    accent: "#d4a84b",
    bgFrom: "#0b0904",
    bgVia: "#140e05",
    bgTo: "#1c1407",
  },
  gourmand: {
    accent: "#e07b6a",
    bgFrom: "#0f0706",
    bgVia: "#180c0a",
    bgTo: "#1e100c",
  },
  default: {
    accent: "#c9a84c",
    bgFrom: "#0a0804",
    bgVia: "#110e06",
    bgTo: "#1a1508",
  },
};

const getTheme = (category = "") => {
  const key = category.toLowerCase().trim();
  return CATEGORY_ACCENT[key] || CATEGORY_ACCENT.default;
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── Bottle SVG ────────────────────────────────────────────────────────────────
const BottleSVG = ({ accent, name, sub, image }) => {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        style={{
          width: "100%",
          maxWidth: 350,
          height: "auto",
          maxHeight: 490,
          objectFit: "contain",
          filter: `drop-shadow(0 0 40px ${accent}55)`,
          position: "relative",
          zIndex: 2,
        }}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 320"
      width="220"
      style={{ filter: `drop-shadow(0 0 40px ${accent}55)`, maxWidth: "100%" }}
    >
      <defs>
        <linearGradient
          id={`btl-${accent.replace("#", "")}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#0e0c08" />
          <stop offset="50%" stopColor={accent} stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0e0c08" />
        </linearGradient>
        <radialGradient
          id={`glow-${accent.replace("#", "")}`}
          cx="50%"
          cy="35%"
          r="55%"
        >
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <filter id={`shadow-${accent.replace("#", "")}`}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <ellipse
        cx="100"
        cy="308"
        rx="44"
        ry="7"
        fill={accent}
        fillOpacity="0.12"
        filter={`url(#shadow-${accent.replace("#", "")})`}
      />
      <rect x="88" y="4" width="24" height="8" rx="3" fill={accent} />
      <rect
        x="82"
        y="10"
        width="36"
        height="20"
        rx="4"
        fill={accent}
        fillOpacity="0.9"
      />
      <rect
        x="82"
        y="26"
        width="36"
        height="3"
        rx="0"
        fill={accent}
        fillOpacity="0.4"
      />
      <rect
        x="86"
        y="29"
        width="28"
        height="24"
        rx="3"
        fill={`url(#btl-${accent.replace("#", "")})`}
        stroke={accent}
        strokeWidth="0.6"
        strokeOpacity="0.4"
      />
      <rect
        x="50"
        y="52"
        width="100"
        height="244"
        rx="12"
        fill={`url(#btl-${accent.replace("#", "")})`}
        stroke={accent}
        strokeWidth="0.9"
        strokeOpacity="0.45"
      />
      <rect
        x="50"
        y="52"
        width="100"
        height="244"
        rx="12"
        fill={`url(#glow-${accent.replace("#", "")})`}
      />
      <rect
        x="57"
        y="60"
        width="12"
        height="230"
        rx="6"
        fill="white"
        fillOpacity="0.05"
      />
      <rect
        x="61"
        y="64"
        width="4"
        height="218"
        rx="2"
        fill="white"
        fillOpacity="0.08"
      />
      <rect
        x="60"
        y="130"
        width="80"
        height="100"
        rx="4"
        fill={accent}
        fillOpacity="0.1"
        stroke={accent}
        strokeWidth="0.6"
        strokeOpacity="0.5"
      />
      <line
        x1="66"
        y1="142"
        x2="134"
        y2="142"
        stroke={accent}
        strokeWidth="0.5"
        strokeOpacity="0.5"
      />
      <text
        x="100"
        y="165"
        textAnchor="middle"
        fill={accent}
        fontSize="12"
        fontFamily="'Cormorant Garamond',serif"
        letterSpacing="3.5"
        fontWeight="500"
        fillOpacity="0.95"
      >
        {name}
      </text>
      <line
        x1="66"
        y1="173"
        x2="134"
        y2="173"
        stroke={accent}
        strokeWidth="0.4"
        strokeOpacity="0.4"
      />
      <text
        x="100"
        y="186"
        textAnchor="middle"
        fill={accent}
        fontSize="5.5"
        fontFamily="sans-serif"
        letterSpacing="2.5"
        fillOpacity="0.65"
      >
        {sub}
      </text>
      <text
        x="100"
        y="204"
        textAnchor="middle"
        fill="white"
        fontSize="5"
        fontFamily="sans-serif"
        letterSpacing="1.5"
        fillOpacity="0.25"
      >
        50ml · 1.7 fl.oz
      </text>
      <line
        x1="66"
        y1="218"
        x2="134"
        y2="218"
        stroke={accent}
        strokeWidth="0.4"
        strokeOpacity="0.3"
      />
      <ellipse
        cx="100"
        cy="294"
        rx="44"
        ry="5"
        fill={accent}
        fillOpacity="0.07"
      />
    </svg>
  );
};

// ── Particles ─────────────────────────────────────────────────────────────────
const Particles = ({ accent }) => (
  <>
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: i % 2 === 0 ? 3 : 2,
          height: i % 2 === 0 ? 3 : 2,
          borderRadius: "50%",
          background: accent,
          opacity: 0.35 + (i % 3) * 0.1,
          top: `${12 + i * 10}%`,
          left: `${8 + (i % 4) * 22}%`,
          animation: `float${i % 4} ${2.2 + i * 0.35}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`,
        }}
      />
    ))}
  </>
);

// ── Loading Skeleton ──────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div
    style={{
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #0a0804 0%, #110e06 50%, #1a1508 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "2px solid rgba(201,168,76,0.2)",
        borderTopColor: "#c9a84c",
        animation: "spinRing 0.8s linear infinite",
      }}
    />
    <p
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: 11,
        letterSpacing: "0.4em",
        color: "rgba(201,168,76,0.5)",
        textTransform: "uppercase",
      }}
    >
      Loading Collection
    </p>
  </div>
);

// ── Error State ───────────────────────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <div
    style={{
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #0a0804 0%, #110e06 50%, #1a1508 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 20,
    }}
  >
    <p
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: 13,
        color: "rgba(255,255,255,0.4)",
        letterSpacing: "0.1em",
      }}
    >
      {message || "Failed to load products"}
    </p>
    <button
      onClick={onRetry}
      style={{
        padding: "12px 28px",
        background: "#c9a84c",
        border: "none",
        cursor: "pointer",
        fontFamily: "'Jost', sans-serif",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "#0a0804",
        clipPath:
          "polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))",
      }}
    >
      Retry
    </button>
  </div>
);

// ── Map API product → slide shape ─────────────────────────────────────────────
const mapProductToSlide = (product) => {
  const theme = getTheme(product.category);
  const imageUrl =
    product.image?.url || product.imageUrl || product.img || null;
  const badge = product.isNewArrival
    ? "New Arrival"
    : product.stock < 10
      ? "Limited Edition"
      : product.tags?.[0] || "Featured";

  return {
    id: product._id || product.id,
    name: (product.name || "FRAGRANCE").toUpperCase(),
    sub: product.concentration || product.type || "EAU DE PARFUM",
    badge,
    desc: product.description || "",
    price: product.price || 0,
    size: product.size || "50ml",
    category: product.category || "Fragrance",
    brand: product.brand || "",
    stock: product.stock ?? 0,
    image: imageUrl,
    ...theme,
  };
};

// ── Main Hero ─────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/products/");
      const payload = res.data;
      const list = Array.isArray(payload)
        ? payload
        : payload.perfumes ||
          payload.products ||
          payload.data ||
          payload.items ||
          Object.values(payload).find(Array.isArray) ||
          [];

      if (!list.length) throw new Error("No products found");

      setSlides(list.slice(0, 5).map(mapProductToSlide));
      setCurrent(0);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load products",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const goTo = (idx) => {
    if (animating || idx === current || !slides.length) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 420);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  const handleAddToCart = () => {
    if (!slides[current]) return;
    const slide = slides[current];
    addToCart(
      {
        _id: slide.id,
        name: slide.name,
        brand: slide.brand,
        category: slide.category,
        price: slide.price,
        size: slide.size,
        image: slide.image,
      },
      1,
    );
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchProducts} />;
  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <>
   

      <section
        style={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${slide.bgFrom} 0%, ${slide.bgVia} 50%, ${slide.bgTo} 100%)`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          paddingTop: 80,
          transition: "background 0.8s ease",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        {/* Noise overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Ambient glows */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "20%",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: slide.accent,
            opacity: 0.12,
            filter: "blur(110px)",
            pointerEvents: "none",
            transition: "background 0.8s ease",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: slide.accent,
            opacity: 0.07,
            filter: "blur(90px)",
            pointerEvents: "none",
            transition: "background 0.8s ease",
          }}
        />

        {/* Top decorative rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "8%",
            right: "8%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${slide.accent}30, transparent)`,
          }}
        />

        {/* Main grid */}
        <div
          className="hero-inner"
          style={{
            maxWidth: 1380,
            margin: "0 auto",
            padding: "35px 48px 100px",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              alignItems: "flex-start",
            }}
          >
            {/* LEFT: Text */}
            <div
              className={`hero-text-col ${animating ? "hero-text-exit" : "hero-text-enter"}`}
            >
              {/* Badge */}
              <div
                className="hero-badge"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 1,
                    background: slide.accent,
                    opacity: 0.7,
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.45em",
                    color: slide.accent,
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {slide.badge}
                </span>
              </div>

              {/* Name */}
              <h1
                className="hero-name"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(52px, 9vw, 118px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 0.92,
                  color: "#f5f0e8",
                  // marginBottom: 8,
                }}
              >
                {slide.name}
              </h1>

              {/* Sub */}
              <p
                className="hero-sub"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.65em",
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  fontWeight: 300,
                  marginBottom: 0,
                }}
              >
                {slide.sub}
              </p>

              {/* Divider */}
              <div
                className="hero-divider"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                 margin:'10px 0'
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 1,
                    background: `${slide.accent}80`,
                  }}
                />
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: slide.accent,
                    opacity: 0.7,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    maxWidth: 180,
                    height: 1,
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
              </div>

              {/* Description */}
              <p
                className="hero-desc"
                style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  maxWidth: 420,
                  marginBottom: 36,
                }}
              >
                {slide.desc}
              </p>

              {/* Price */}
              <div
                className="hero-price"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 36,
                }}
              >
                <span
                  className="hero-price-num"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 38,
                    fontWeight: 600,
                    color: slide.accent,
                    letterSpacing: "0.02em",
                  }}
                >
                  ${slide.price}
                </span>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  {slide.brand && (
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.3em",
                        color: `${slide.accent}90`,
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      {slide.brand}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.25em",
                      color: "rgba(255,255,255,0.25)",
                      textTransform: "uppercase",
                    }}
                  >
                    {slide.size}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      color: `${slide.accent}60`,
                      textTransform: "uppercase",
                    }}
                  >
                    {slide.category}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div
                className="hero-ctas"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginBottom: 52,
                }}
              >
                <button
                  className="hero-cta-primary"
                  onClick={handleAddToCart}
                  style={{
                    background: slide.accent,
                    boxShadow: `0 10px 36px ${slide.accent}40`,
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Add to Cart
                </button>
                <button
                  className="hero-cta-secondary"
                  onClick={handleAddToCart}
                >
                  Buy Now
                </button>
              </div>

              {/* Stats */}
              <div
                className="hero-stats"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 0,
                  paddingTop: 28,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {[
                  ["250+", "Fragrances"],
                  ["18", "Awards"],
                  ["99K", "Clients"],
                ].map(([num, label], i) => (
                  <div
                    key={label}
                    className="hero-stat-item"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      paddingRight: i < 2 ? 32 : 0,
                      marginRight: i < 2 ? 32 : 0,
                      borderRight:
                        i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    }}
                  >
                    <span
                      className="hero-stat-num"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 28,
                        fontWeight: 500,
                        backgroundImage: `linear-gradient(90deg, ${slide.accent}, #fff8e8, ${slide.accent})`,
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "shimmerText 4s linear infinite",
                      }}
                    >
                      {num}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.32em",
                        color: "rgba(255,255,255,0.25)",
                        textTransform: "uppercase",
                        marginTop: 4,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Bottle */}
            <div
              className={`hero-bottle-col ${animating ? "hero-bottle-exit" : "hero-bottle-enter"}`}
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 480,
              }}
            >
              <BottleSVG
                accent={slide.accent}
                name={slide.name}
                sub={slide.sub}
                image={slide.image}
              />
            </div>
          </div>
        </div>

        {/* ── SLIDE CONTROLS ── */}
        <div
          className="slide-controls-wrap"
          style={{
            position: "absolute",
            bottom: 36,
            right: 48,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {/* Dot indicators */}
          <div
            className="hero-dots"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginRight: 16,
            }}
          >
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === current ? 28 : 6,
                  height: 6,
                  borderRadius: 3,
                  background:
                    i === current ? s.accent : "rgba(255,255,255,0.18)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: i === current ? `0 0 10px ${s.accent}60` : "none",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Prev button */}
          <button
            className="slide-ctrl-btn"
            onClick={prev}
            style={{
              border: `1.5px solid ${slide.accent}40`,
              color: slide.accent,
            }}
          >
            <ChevronLeft />
          </button>

          {/* Slide counter */}
          <div
            className="slide-counter"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "8px 14px",
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(12px)",
              clipPath:
                "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
              border: `1.5px solid ${slide.accent}30`,
              minWidth: 52,
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontWeight: 500,
                color: slide.accent,
                lineHeight: 1,
              }}
            >
              {String(current + 1).padStart(2, "0")}
            </span>
            <div
              style={{
                width: 20,
                height: 1,
                background: `${slide.accent}50`,
                margin: "3px 0",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.25)",
                fontFamily: "'Jost', sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Next button */}
          <button
            className="slide-ctrl-btn"
            onClick={next}
            style={{
              border: `1.5px solid ${slide.accent}40`,
              color: slide.accent,
            }}
          >
            <ChevronRight />
          </button>
        </div>

        {/* Bottom rule */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "8%",
            right: "8%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${slide.accent}20, transparent)`,
          }}
        />
      </section>
    </>
  );
}