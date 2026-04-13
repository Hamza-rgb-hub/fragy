import { useState, useEffect, createContext, useContext } from "react";

const AdminAuthContext = createContext(null);
export const useAdminAuth = () => useContext(AdminAuthContext);

import AdminLogin    from "./pages/AdminLogin";
import AdminLayout   from "./AdminLayout";
import Dashboard     from "./pages/Dashboard";
import Products      from "./pages/Product";
import Orders        from "./pages/Orders";
import Users         from "./pages/Users";
import AdminRegister from "./pages/AdminRegister";
import AdminReturns from './pages/AdminReturns';

export default function AdminApp() {
  const [admin, setAdmin]     = useState(null);
  const [page, setPage]       = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.role === "admin" || parsed.role === "superadmin") setAdmin(parsed);
    }
    setLoading(false);
  }, []);

  const login  = (u) => { setAdmin(u); localStorage.setItem("adminUser", JSON.stringify(u)); };
  const logout = () => { setAdmin(null); localStorage.removeItem("adminUser"); localStorage.removeItem("token"); setPage("dashboard"); };

  if (loading) return (
    <div style={{ background: "#080706", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "2px solid rgba(201,168,76,0.15)", borderTopColor: "#c9a84c", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!admin) return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      <AdminLogin />
    </AdminAuthContext.Provider>
  );

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "products":  return <Products />;
      case "orders":    return <Orders />;
      case "users":     return <Users />;
      case "register":  return <AdminRegister />;
      case "returns":   return <AdminReturns />;
      default:          return <Dashboard />;
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      <AdminLayout page={page} setPage={setPage}>
        {renderPage()}
      </AdminLayout>
    </AdminAuthContext.Provider>
  );
}