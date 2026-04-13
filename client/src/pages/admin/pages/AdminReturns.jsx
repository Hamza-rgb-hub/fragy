import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api", withCredentials: true });

// ── Icons ──
const Ic = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ic = {
  return:   "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  exchange: "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  search:   "M21 21l-4.35-4.35 M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  edit:     "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:    "M3 6h18 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 11v6 M14 11v6 M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8 M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  close:    "M18 6L6 18 M6 6l12 12",
  chevL:    "M15 18l-6-6 6-6",
  chevR:    "M9 18l6-6-6-6",
  refresh:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  check:    "M20 6L9 17l-5-5",
  clock:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2",
  reject:   "M18 6L6 18 M6 6l12 12",
};

const statusColors = {
  Pending:      { c: "#93c5fd", bg: "rgba(147,197,253,0.08)", b: "rgba(147,197,253,0.2)" },
  "Under Review":{ c: "#fbbf24", bg: "rgba(251,191,36,0.08)",  b: "rgba(251,191,36,0.2)" },
  Approved:     { c: "#6ee7b7", bg: "rgba(110,231,183,0.08)", b: "rgba(110,231,183,0.2)" },
  Rejected:     { c: "#fca5a5", bg: "rgba(252,165,165,0.08)", b: "rgba(252,165,165,0.2)" },
  Completed:    { c: "#c9a84c", bg: "rgba(201,168,76,0.08)",  b: "rgba(201,168,76,0.25)" },
};

const Chip = ({ label }) => {
  const s = statusColors[label] || { c: "#aaa", bg: "rgba(170,170,170,0.08)", b: "rgba(170,170,170,0.2)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px",
      fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
      color: s.c, background: s.bg, border: `1px solid ${s.b}`,
      clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
    }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: s.c, flexShrink: 0 }} />
      {label}
    </span>
  );
};

const TypeBadge = ({ type }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px",
    fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
    color: type === "return" ? "rgba(147,197,253,0.9)" : "rgba(201,168,76,0.9)",
    background: type === "return" ? "rgba(147,197,253,0.06)" : "rgba(201,168,76,0.06)",
    border: `1px solid ${type === "return" ? "rgba(147,197,253,0.18)" : "rgba(201,168,76,0.18)"}`,
    clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
  }}>
    <Ic d={type === "return" ? ic.return : ic.exchange} size={11} />
    {type}
  </span>
);

// ── Modal ──
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0e0c08", border: "1px solid rgba(201,168,76,0.2)",
        width: "100%", maxWidth: 540, maxHeight: "88vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.85)",
        clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: "rgba(255,255,255,0.88)" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer" }}><Ic d={ic.close} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

const td = { padding: "13px 16px", fontSize: 12.5, fontWeight: 300, letterSpacing: "0.04em", color: "rgba(255,255,255,0.6)", verticalAlign: "middle" };
const Th = ({ children }) => <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 9, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", borderBottom: "1px solid rgba(201,168,76,0.07)", whiteSpace: "nowrap" }}>{children}</th>;
const Loader = () => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, color: "rgba(201,168,76,0.4)" }}><Ic d={ic.refresh} size={28} /></div>;

const DetailRow = ({ label, value, accent }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", gap: 16 }}>
    <span style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 300, color: accent ? "#c9a84c" : "rgba(255,255,255,0.72)", textAlign: "right", letterSpacing: "0.04em" }}>{value || "—"}</span>
  </div>
);

export default function AdminReturns() {
  const [requests, setRequests]     = useState([]);
  const [stats, setStats]           = useState(null);
  const [total, setTotal]           = useState(0);
  const [pages, setPages]           = useState(1);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType]     = useState("");

  const [viewModal, setViewModal]   = useState(null);
  const [editModal, setEditModal]   = useState(null);
  const [newStatus, setNewStatus]   = useState("");
  const [adminNote, setAdminNote]   = useState("");
  const [updating, setUpdating]     = useState(false);

  const loadStats = useCallback(() => {
    API.get("/returns/stats").then(r => setStats(r.data.stats)).catch(() => {});
  }, []);

  const loadRequests = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 10 });
    if (filterStatus) params.set("status", filterStatus);
    if (filterType)   params.set("type",   filterType);
    if (search)       params.set("search", search);
    API.get(`/returns?${params}`)
      .then(r => { setRequests(r.data.requests); setTotal(r.data.total); setPages(r.data.pages); })
      .finally(() => setLoading(false));
  }, [page, filterStatus, filterType, search]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { loadRequests(); }, [loadRequests]);

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    setUpdating(true);
    try {
      await API.patch(`/returns/${editModal._id}/status`, { status: newStatus, adminNote });
      setEditModal(null);
      loadRequests();
      loadStats();
    } catch (e) {
      alert(e.response?.data?.message || "Error updating");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this request permanently?")) return;
    await API.delete(`/returns/${id}`);
    loadRequests();
    loadStats();
  };

  const openEdit = (r) => { setEditModal(r); setNewStatus(r.status); setAdminNote(r.adminNote || ""); };

  const statCards = stats ? [
    { label: "Total Requests",   value: stats.total,     color: "#c9a84c" },
    { label: "Pending",          value: stats.pending,   color: "#93c5fd" },
    { label: "Approved",         value: stats.approved,  color: "#6ee7b7" },
    { label: "Rejected",         value: stats.rejected,  color: "#fca5a5" },
    { label: "Completed",        value: stats.completed, color: "#c9a84c" },
    { label: "Return Requests",  value: stats.returns,   color: "#93c5fd" },
    { label: "Exchange Requests",value: stats.exchanges, color: "#fbbf24" },
  ] : [];

  const statusFilters = ["", "Pending", "Under Review", "Approved", "Rejected", "Completed"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        .adm-ret * { box-sizing: border-box; }
        .adm-ret { font-family: 'Jost', sans-serif; animation: retFade 0.4s ease; }
        @keyframes retFade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .ret-stat-card { background: #0b0a07; padding: 22px 20px; transition: background 0.3s; position: relative; overflow: hidden; }
        .ret-stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--ac),transparent); transform:scaleX(0); transition:transform 0.4s; }
        .ret-stat-card:hover { background: rgba(201,168,76,0.04); }
        .ret-stat-card:hover::before { transform:scaleX(1); }
        .adm-ret textarea { width:100%; background:rgba(255,255,255,0.03); border:1px solid rgba(201,168,76,0.18); color:rgba(255,255,255,0.75); padding:11px 14px; font-family:'Jost',sans-serif; font-size:13px; font-weight:300; outline:none; resize:vertical; min-height:80px; clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px)); }
        .adm-ret select { width:100%; background:rgba(255,255,255,0.03); border:1px solid rgba(201,168,76,0.18); color:rgba(255,255,255,0.75); padding:11px 14px; font-family:'Jost',sans-serif; font-size:13px; font-weight:300; outline:none; appearance:none; cursor:pointer; clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px)); }
        .adm-ret select option { background:#0e0c08; }
        .adm-ret tbody tr { transition: background 0.2s; }
        .adm-ret tbody tr:hover td { background: rgba(201,168,76,0.03); }
        .action-btn { background:transparent; border:1px solid rgba(201,168,76,0.12); color:rgba(255,255,255,0.3); cursor:pointer; padding:5px 8px; transition:all 0.2s; display:inline-flex; align-items:center; }
        .action-btn:hover { border-color:rgba(201,168,76,0.35); color:rgba(201,168,76,0.75); }
        .action-btn.danger { border-color:rgba(252,165,165,0.15); color:#fca5a5; background:rgba(252,165,165,0.04); }
        .action-btn.danger:hover { border-color:rgba(252,165,165,0.35); }
        .filter-tab { padding:7px 14px; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; background:transparent; border:1px solid transparent; cursor:pointer; transition:all 0.2s; font-family:'Jost',sans-serif; }
        .filter-tab.active { background:rgba(201,168,76,0.1); border-color:rgba(201,168,76,0.28); color:#c9a84c; }
        .filter-tab:not(.active) { color:rgba(255,255,255,0.28); }
        .filter-tab:not(.active):hover { color:rgba(255,255,255,0.6); background:rgba(201,168,76,0.04); }
        .upd-btn { width:100%; padding:13px 24px; background:#c9a84c; border:none; color:#07060a; font-family:'Jost',sans-serif; font-size:11px; font-weight:500; letter-spacing:0.35em; text-transform:uppercase; cursor:pointer; transition:all 0.3s; margin-top:8px; clip-path:polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,9px 100%,0 calc(100% - 9px)); box-shadow:0 6px 24px rgba(201,168,76,0.25); }
        .upd-btn:hover { box-shadow:0 10px 32px rgba(201,168,76,0.4); transform:translateY(-1px); }
        .upd-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.2); border-radius:2px; }
      `}</style>

      <div className="adm-ret">
        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 400, color: "rgba(255,255,255,0.88)", lineHeight: 1 }}>
              Returns &amp; <em style={{ fontStyle: "italic", color: "#c9a84c" }}>Exchanges</em>
            </h1>
            <p style={{ fontSize: 10.5, fontWeight: 300, letterSpacing: "0.3em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", marginTop: 5 }}>
              {total} total requests
            </p>
          </div>
          <button onClick={() => { loadRequests(); loadStats(); }} style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)", color: "rgba(201,168,76,0.7)", cursor: "pointer", padding: "9px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: "0.2em", fontFamily: "'Jost',sans-serif", textTransform: "uppercase" }}>
            <Ic d={ic.refresh} size={13} /> Refresh
          </button>
        </div>

        {/* Stats grid */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.1)", marginBottom: 20 }}>
            {statCards.map((s, i) => (
              <div key={i} className="ret-stat-card" style={{ "--ac": s.color }}>
                <div style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>{s.label}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, color: s.color, lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 14, alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 300 }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(201,168,76,0.35)", pointerEvents: "none" }}>
              <Ic d={ic.search} size={13} />
            </span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search order ID or email…"
              style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.16)", color: "rgba(255,255,255,0.7)", padding: "9px 14px 9px 34px", fontFamily: "'Jost',sans-serif", fontSize: 12.5, fontWeight: 300, outline: "none", clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }} />
          </div>

          {/* Type filter */}
          <div style={{ display: "flex", gap: 2, background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.1)", padding: 3 }}>
            {[["", "All"], ["return", "Returns"], ["exchange", "Exchanges"]].map(([v, l]) => (
              <button key={v} className={`filter-tab ${filterType === v ? "active" : ""}`} onClick={() => { setFilterType(v); setPage(1); }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Status filter tabs */}
        <div style={{ display: "flex", gap: 2, marginBottom: 14, flexWrap: "wrap", background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.08)", padding: 3 }}>
          {statusFilters.map(s => (
            <button key={s} className={`filter-tab ${filterStatus === s ? "active" : ""}`} onClick={() => { setFilterStatus(s); setPage(1); }}>
              {s || "All Status"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "#0b0a07", border: "1px solid rgba(201,168,76,0.1)" }}>
          {loading ? <Loader /> : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Order ID", "Email", "Type", "Reason", "Status", "Submitted", "Actions"].map(h => <Th key={h}>{h}</Th>)}
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={td}><span style={{ color: "rgba(201,168,76,0.8)", fontSize: 12, letterSpacing: "0.1em", fontWeight: 400 }}>{r.orderId}</span></td>
                      <td style={td}><span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{r.email}</span></td>
                      <td style={td}><TypeBadge type={r.type} /></td>
                      <td style={td}><span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, letterSpacing: "0.04em" }}>{r.reason?.replace(/_/g, " ")}</span></td>
                      <td style={td}><Chip label={r.status} /></td>
                      <td style={td}><span style={{ color: "rgba(255,255,255,0.28)", fontSize: 11 }}>{new Date(r.createdAt).toLocaleDateString()}</span></td>
                      <td style={td}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="action-btn" onClick={() => setViewModal(r)} title="View Details"><Ic d={ic.eye} size={13} /></button>
                          <button className="action-btn" onClick={() => openEdit(r)} title="Update Status"><Ic d={ic.edit} size={13} /></button>
                          <button className="action-btn danger" onClick={() => handleDelete(r._id)} title="Delete"><Ic d={ic.trash} size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!requests.length && (
                    <tr><td colSpan={7} style={{ ...td, textAlign: "center", color: "rgba(255,255,255,0.18)", padding: 48 }}>No requests found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", padding: "14px 20px", borderTop: "1px solid rgba(201,168,76,0.07)" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ background: "none", border: "1px solid rgba(201,168,76,0.15)", color: "rgba(255,255,255,0.35)", cursor: page === 1 ? "not-allowed" : "pointer", padding: "5px 8px" }}>
              <Ic d={ic.chevL} size={14} />
            </button>
            <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>{page} / {pages || 1}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}
              style={{ background: "none", border: "1px solid rgba(201,168,76,0.15)", color: "rgba(255,255,255,0.35)", cursor: page >= pages ? "not-allowed" : "pointer", padding: "5px 8px" }}>
              <Ic d={ic.chevR} size={14} />
            </button>
          </div>
        </div>

        {/* ── VIEW DETAILS MODAL ── */}
        <Modal open={!!viewModal} onClose={() => setViewModal(null)} title="Request Details">
          {viewModal && (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <TypeBadge type={viewModal.type} />
                <Chip label={viewModal.status} />
              </div>
              <DetailRow label="Order ID"   value={viewModal.orderId}   accent />
              <DetailRow label="Email"      value={viewModal.email} />
              <DetailRow label="Reason"     value={viewModal.reason?.replace(/_/g, " ")} />
              {viewModal.type === "exchange" && (
                <DetailRow label="Exchange Item" value={viewModal.exchangeItem} accent />
              )}
              {viewModal.message && (
                <div style={{ marginTop: 16, padding: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.1)" }}>
                  <div style={{ fontSize: 9.5, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 8 }}>Customer Note</div>
                  <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, letterSpacing: "0.04em" }}>{viewModal.message}</p>
                </div>
              )}
              {viewModal.adminNote && (
                <div style={{ marginTop: 12, padding: 14, background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)" }}>
                  <div style={{ fontSize: 9.5, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 8 }}>Admin Note</div>
                  <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, letterSpacing: "0.04em" }}>{viewModal.adminNote}</p>
                </div>
              )}
              <DetailRow label="Submitted"  value={new Date(viewModal.createdAt).toLocaleString()} />
              {viewModal.resolvedAt && <DetailRow label="Resolved At" value={new Date(viewModal.resolvedAt).toLocaleString()} />}
              <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => { setViewModal(null); openEdit(viewModal); }}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)", color: "#c9a84c", fontFamily: "'Jost',sans-serif", fontSize: 10.5, letterSpacing: "0.28em", textTransform: "uppercase", cursor: "pointer", clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))" }}>
                  <Ic d={ic.edit} size={13} /> Update Status
                </button>
              </div>
            </>
          )}
        </Modal>

        {/* ── UPDATE STATUS MODAL ── */}
        <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Update Request Status">
          {editModal && (
            <>
              <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.12)", padding: 14, marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
                  Order <span style={{ color: "#c9a84c" }}>{editModal.orderId}</span> — {editModal.email}
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <TypeBadge type={editModal.type} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", alignSelf: "center" }}>current:</span>
                  <Chip label={editModal.status} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 9.5, fontWeight: 400, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: 8 }}>New Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {["Pending", "Under Review", "Approved", "Rejected", "Completed"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 9.5, fontWeight: 400, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)", marginBottom: 8 }}>Admin Note (optional)</label>
                <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Internal note about this decision…" />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setEditModal(null)} style={{ flex: 1, padding: "11px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)", fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer", clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))" }}>
                  Cancel
                </button>
                <button className="upd-btn" onClick={handleUpdateStatus} disabled={updating} style={{ flex: 2 }}>
                  {updating ? "Saving…" : "Save Status"}
                </button>
              </div>
            </>
          )}
        </Modal>
      </div>
    </>
  );
}