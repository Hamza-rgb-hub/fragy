import { useEffect, useState } from "react";
import API from "../../../utils/api";

const G = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, oRes, uRes] = await Promise.allSettled([
          API.get("/products"),
          API.get("/orders/all"),
          API.get("/auth/user"),
        ]);

        const products = pRes.status === "fulfilled" ? (pRes.value.data.perfumes || pRes.value.data.products || []) : [];
        const orders   = oRes.status === "fulfilled" ? (oRes.value.data.orders || oRes.value.data || []) : [];
        const users    = uRes.status === "fulfilled" ? (uRes.value.data.users || uRes.value.data || []) : [];

        const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0);

        setStats({
          products: products.length,
          orders: orders.length,
          users: users.length,
          revenue,
        });
        setRecentOrders(orders.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: "Total Products", value: stats.products, sub: "In catalogue", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { label: "Total Orders",   value: stats.orders,   sub: "All time",     icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "Registered Users",value: stats.users,   sub: "Active accounts",icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Total Revenue",  value: `$${stats.revenue.toFixed(0)}`, sub: "Gross earnings", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 6v1m0 4v2m-5.196-5.196a9 9 0 1012.728 0M15.536 15.536A5 5 0 0112 17a5 5 0 01-3.536-1.464" },
  ];

  const statusColor = (s) => {
    const m = { pending: "badge-yellow", processing: "badge-yellow", delivered: "badge-green", cancelled: "badge-red", shipped: "badge-green" };
    return m[s?.toLowerCase()] || "badge-gray";
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
      <div style={{ width: 28, height: 28, border: "2px solid rgba(201,168,76,0.15)", borderTopColor: "#c9a84c", borderRadius: "50%" }} className="spin" />
    </div>
  );

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      {/* Stats */}
      <div className="stat-grid">
        {statCards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
            <div style={{ position: "absolute", top: 18, right: 18, color: "rgba(201,168,76,0.25)" }}>
              <G d={s.icon} size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="card-title">Recent Orders</div>
        {recentOrders.length === 0 ? (
          <div className="empty-state">No orders yet</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o._id}>
                  <td style={{ color: "rgba(201,168,76,0.7)", fontFamily: "monospace", fontSize: 11 }}>
                    #{String(o._id).slice(-8).toUpperCase()}
                  </td>
                  <td>{o.user?.name || o.shippingAddress?.name || "—"}</td>
                  <td style={{ color: "#c9a84c" }}>${(o.totalAmount || o.total || 0).toFixed(2)}</td>
                  <td><span className={`badge ${statusColor(o.status)}`}>{o.status || "pending"}</span></td>
                  <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}