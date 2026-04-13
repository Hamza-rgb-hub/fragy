import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems,   setCartItems]   = useState([]);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [loading,     setLoading]     = useState(false);

  // ── Totals ─────────────────────────────────────────────────────────────────
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.perfume?.price || 0) * item.quantity, 0
  );

  // ── Helper: check if user is logged in ────────────────────────────────────
  const isLoggedIn = () => !!localStorage.getItem("token"); 

  // ── Fetch cart from backend on mount ──────────────────────────────────────
  useEffect(() => {
    if (isLoggedIn()) fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/cart");
      // Backend returns: { cart: { items: [{ perfume: {...}, quantity: N }] } }
      setCartItems(data.cart?.items || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Add to Cart ────────────────────────────────────────────────────────────
  const addToCart = async (product, qty = 1) => {
    // 1. Optimistic UI update — drawer turant kholo
    setCartItems(prev => {
      const existing = prev.find(i => i.perfume?._id === product._id);
      if (existing) {
        return prev.map(i =>
          i.perfume?._id === product._id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { perfume: product, quantity: qty }];
    });
    setDrawerOpen(true);

    // 2. Backend sync
    if (isLoggedIn()) {
      try {
        await API.post("/cart/add", {
          perfumeId: product._id,
          quantity:  qty,
        });
        // Fresh data backend se lo
        await fetchCart();
      } catch (err) {
        console.error("Add to cart API error:", err);
        // Agar error aaye toh fresh cart reload karo
        await fetchCart();
      }
    }
  };

  // ── Update Quantity ────────────────────────────────────────────────────────
  const updateQty = async (productId, qty) => {
    if (qty <= 0) { removeFromCart(productId); return; }

    // Optimistic update
    setCartItems(prev =>
      prev.map(i =>
        i.perfume?._id === productId ? { ...i, quantity: qty } : i
      )
    );

    // Backend sync
    if (isLoggedIn()) {
      try {
        await API.post("/cart/update", {
          perfumeId: productId,
          quantity:  qty,
        });
      } catch (err) {
        console.error("Update cart API error:", err);
        await fetchCart(); // rollback — fresh data lo
      }
    }
  };

  // ── Remove from Cart ───────────────────────────────────────────────────────
  const removeFromCart = async (productId) => {
    // Optimistic update
    setCartItems(prev => prev.filter(i => i.perfume?._id !== productId));

    // Backend sync
    if (isLoggedIn()) {
      try {
        await API.post("/cart/remove", { perfumeId: productId });
      } catch (err) {
        console.error("Remove from cart API error:", err);
        await fetchCart(); // rollback
      }
    }
  };

  // ── Clear cart (logout pe use karo) ───────────────────────────────────────
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{
      cartItems,
      drawerOpen, setDrawerOpen,
      totalCount, totalPrice,
      loading,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}