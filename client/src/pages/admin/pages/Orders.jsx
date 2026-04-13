import { useEffect, useState } from "react";
import API from "../../../utils/api";
import { useAdminAuth } from "../AdminApp";

const G = ({ d, size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColor = (s) => {
  const m = {
    pending: "badge-yellow",
    processing: "badge-yellow",
    shipped: "badge-green",
    delivered: "badge-green",
    cancelled: "badge-red",
  };
  return m[s?.toLowerCase()] || "badge-gray";
};

export default function Orders() {
  const { admin } = useAdminAuth();
  const canWrite = admin?.role === "admin" || admin?.role === "superadmin";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        return;
      }

      const { data } = await API.get("/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(data.orders || data || []);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchOrders();
    }
  }, []); 

  const updateStatus = async (orderId, status) => {
    try {
      setUpdating(orderId);
      await API.put(`/orders/${orderId}/status`, { status });
      await fetchOrders();
      if (detail?._id === orderId) setDetail((prev) => ({ ...prev, status }));
    } catch (e) {
      alert(e.response?.data?.message || "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status?.toLowerCase() === filter;
    const matchSearch =
      !search ||
      String(o._id).includes(search) ||
      (o.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.email || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          className="inp"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 240, fontSize: 12 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "7px 14px",
                fontSize: 9,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                border: `1px solid ${filter === s ? "#c9a84c" : "rgba(255,255,255,0.10)"}`,
                background:
                  filter === s ? "rgba(201,168,76,0.10)" : "transparent",
                color: filter === s ? "#c9a84c" : "rgba(255,255,255,0.30)",
                cursor: "pointer",
                transition: "all 0.2s",
                clipPath:
                  "polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px))",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {error && !loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 12,
              height: 200,
            }}
          >
            <div
              style={{
                color: "rgba(220,100,100,0.8)",
                fontSize: 12,
                letterSpacing: "0.05em",
              }}
            >
              {error}
            </div>
            <button
              className="btn-ghost"
              onClick={fetchOrders}
              style={{ fontSize: 10, padding: "6px 16px" }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 200,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                border: "2px solid rgba(201,168,76,0.15)",
                borderTopColor: "#c9a84c",
                borderRadius: "50%",
              }}
              className="spin"
            />
          </div>
        ) : !error && filtered.length === 0 ? (
          <div className="empty-state">No orders found</div>
        ) : (
          !error && (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  {canWrite && <th>Update</th>}
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o._id}>
                    <td
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: "rgba(201,168,76,0.7)",
                      }}
                    >
                      #{String(o._id).slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: "rgba(255,255,255,0.70)",
                        }}
                      >
                        {o.user?.name || o.shippingAddress?.name || "Guest"}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "rgba(255,255,255,0.25)",
                        }}
                      >
                        {o.user?.email || ""}
                      </div>
                    </td>
                    <td style={{ color: "rgba(255,255,255,0.40)" }}>
                      {o.items?.length || o.orderItems?.length || "—"}
                    </td>
                    <td style={{ color: "#c9a84c" }}>
                      ${(o.totalAmount || o.total || 0).toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge ${statusColor(o.status)}`}>
                        {o.status || "pending"}
                      </span>
                    </td>
                    <td
                      style={{ color: "rgba(255,255,255,0.30)", fontSize: 11 }}
                    >
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    {canWrite && (
                      <td>
                        <div className="select-wrapper">
                          <select
                            className="inp"
                            value={o.status || "pending"}
                            onChange={(e) =>
                              updateStatus(o._id, e.target.value)
                            }
                            disabled={updating === o._id}
                            style={{
                              padding: "5px 40px 5px 10px", // 👈 thori zyada space
                              fontSize: 10,
                              width: "auto",
                              appearance: "none",
                              WebkitAppearance: "none",
                              MozAppearance: "none",
                            }}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    )}
                    <td>
                      <button
                        className="btn-ghost"
                        onClick={() => setDetail(o)}
                        style={{ padding: "5px 12px", fontSize: 10 }}
                      >
                        <G
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          size={12}
                        />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      {/* Order Detail Modal */}
      {detail && (
        <div
          className="modal-bg"
          onClick={(e) => e.target === e.currentTarget && setDetail(null)}
        >
          <div className="modal" style={{ maxWidth: 600 }}>
            <button className="modal-close" onClick={() => setDetail(null)}>
              ✕
            </button>
            <div className="modal-title">Order Detail</div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.5)",
                    marginBottom: 4,
                  }}
                >
                  Order ID
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  #{String(detail._id).slice(-12).toUpperCase()}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.5)",
                    marginBottom: 4,
                  }}
                >
                  Status
                </div>
                <span className={`badge ${statusColor(detail.status)}`}>
                  {detail.status || "pending"}
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.5)",
                    marginBottom: 4,
                  }}
                >
                  Customer
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}>
                  {detail.user?.name || detail.shippingAddress?.name || "Guest"}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                  {detail.user?.email}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.5)",
                    marginBottom: 4,
                  }}
                >
                  Total Amount
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontFamily: "'Cormorant Garamond',serif",
                    color: "#c9a84c",
                  }}
                >
                  ${(detail.totalAmount || detail.total || 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Shipping */}
            {detail.shippingAddress && (
              <div
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "14px 18px",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.4)",
                    marginBottom: 8,
                  }}
                >
                  Shipping Address
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.7,
                  }}
                >
                  {detail.shippingAddress.name}
                  <br />
                  {detail.shippingAddress.address},{" "}
                  {detail.shippingAddress.city}
                  <br />
                  {detail.shippingAddress.country}{" "}
                  {detail.shippingAddress.postalCode}
                </div>
              </div>
            )}

            {/* Items */}
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.4)",
                marginBottom: 10,
              }}
            >
              Items Ordered
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 24,
              }}
            >
              {(detail.items || detail.orderItems || []).map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 13, color: "rgba(255,255,255,0.70)" }}
                    >
                      {item.name || item.product?.name || "Item"}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}
                    >
                      Qty: {item.quantity || 1}
                    </div>
                  </div>
                  <div style={{ color: "#c9a84c", fontSize: 13 }}>
                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {canWrite && (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  Update Status:
                </label>
                <select
                  className="inp"
                  value={detail.status || "pending"}
                  onChange={(e) => updateStatus(detail._id, e.target.value)}
                  style={{
                    width: "auto",
                    padding: "7px 12px",
                    fontSize: 11,
                    clipPath: "none",
                  }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
