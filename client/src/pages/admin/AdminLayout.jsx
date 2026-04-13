import { useAdminAuth } from "./AdminApp";

const G = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const NAV = [
  { id: "dashboard", label: "Dashboard", roles: ["admin","superadmin"], icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "products",  label: "Products",  roles: ["admin","superadmin"], icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: "orders",    label: "Orders",    roles: ["admin","superadmin"], icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { id: "users",     label: "Users",     roles: ["admin","superadmin"], icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  {id: 'returns',    label: 'Returns',   roles: ['admin','superadmin'], icon: "M3 10h11a1 1 0 010 2H5.618a12.042 12.042 0 006.962 6.962L13 18a1 1 0 012 0v4a1 1 0 01-1 1h-4a1 1 0 110-2h.879A14.041 14.041 0 013.05 12zM21 10h-11a1 1 0 000 2h7.382a12.042 12.042 0 01-6.962 6.962L11 18a1 1 0 00-2 0v4a1 1 0 001 1h4a1 1 0 100-2h-.879A14.041 14.041 0 0020.95 12z"},
  // ✅ Register only visible to superadmin
  { id: "register",  label: "Add Admin",  roles: ["superadmin"],         icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
];

export default function AdminLayout({ page, setPage, children }) {
  const { admin, logout } = useAdminAuth();

  const visibleNav = NAV.filter(n => n.roles.includes(admin?.role));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080706; }

        .admin-wrap { display: flex; min-height: 100vh; font-family: 'Jost', sans-serif; background: #080706; }

        .sidebar {
          width: 240px; flex-shrink: 0;
          background: #0d0b09;
          border-right: 1px solid rgba(201,168,76,0.10);
          display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
        }
        .sidebar-brand { padding: 28px 24px 24px; border-bottom: 1px solid rgba(201,168,76,0.08); }
        .sidebar-brand-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; letter-spacing: 0.4em; color: #c9a84c; }
        .sidebar-brand-sub  { font-size: 8.5px; font-weight: 300; letter-spacing: 0.5em; text-transform: uppercase; color: rgba(255,255,255,0.18); margin-top: 3px; }

        .sidebar-label { font-size: 8px; font-weight: 500; letter-spacing: 0.5em; text-transform: uppercase; color: rgba(255,255,255,0.18); padding: 20px 24px 8px; }

        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 24px; cursor: pointer;
          color: rgba(255,255,255,0.35);
          font-size: 12px; font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase;
          transition: all 0.2s; border-left: 2px solid transparent;
        }
        .nav-item:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.02); }
        .nav-item.active { color: #c9a84c; border-left-color: #c9a84c; background: rgba(201,168,76,0.05); }

        /* Divider before register item */
        .nav-divider { height: 1px; background: rgba(201,168,76,0.08); margin: 8px 24px; }

        /* Register nav item special style */
        .nav-item.register-item { color: rgba(201,168,76,0.50); }
        .nav-item.register-item:hover { color: rgba(201,168,76,0.85); background: rgba(201,168,76,0.04); }
        .nav-item.register-item.active { color: #c9a84c; border-left-color: #c9a84c; }

        .sidebar-footer { margin-top: auto; border-top: 1px solid rgba(201,168,76,0.08); padding: 16px 24px; }
        .admin-role { font-size: 8px; letter-spacing: 0.4em; text-transform: uppercase; color: #c9a84c; margin-bottom: 3px; }
        .admin-name { font-size: 13px; color: rgba(255,255,255,0.65); margin-bottom: 12px; }
        .btn-logout {
          display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 14px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.30); font-family: 'Jost', sans-serif;
          font-size: 10px; font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
          clip-path: polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px));
        }
        .btn-logout:hover { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.15); }

        .main { margin-left: 240px; flex: 1; min-height: 100vh; display: flex; flex-direction: column; }
        .topbar {
          height: 60px; padding: 0 32px;
          border-bottom: 1px solid rgba(201,168,76,0.08);
          display: flex; align-items: center; justify-content: space-between;
          background: #080706; position: sticky; top: 0; z-index: 50;
        }
        .page-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; color: rgba(255,255,255,0.80); letter-spacing: 0.05em; }
        .topbar-right { display: flex; align-items: center; gap: 8px; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.2); }
        .role-badge { padding: 4px 10px; background: rgba(201,168,76,0.10); border: 1px solid rgba(201,168,76,0.25); color: #c9a84c; font-size: 8.5px; letter-spacing: 0.35em; text-transform: uppercase; clip-path: polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px)); }
        .content { padding: 32px; flex: 1; }

        /* ── Shared styles used by child pages ── */
        .card { background: rgba(255,255,255,0.025); border: 1px solid rgba(201,168,76,0.10); padding: 24px; }
        .card-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 400; color: rgba(255,255,255,0.75); margin-bottom: 20px; }

        .btn-gold { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; background: #c9a84c; border: none; color: #080706; font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; transition: all 0.25s; clip-path: polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px)); }
        .btn-gold:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; background: transparent; border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.45); font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; clip-path: polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px)); }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.28); color: rgba(255,255,255,0.75); }
        .btn-danger { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; background: rgba(220,60,60,0.10); border: 1px solid rgba(220,60,60,0.25); color: rgba(220,100,100,0.8); font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; clip-path: polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px)); }
        .btn-danger:hover { background: rgba(220,60,60,0.20); border-color: rgba(220,60,60,0.45); }

        .tbl { width: 100%; border-collapse: collapse; }
        .tbl th { text-align: left; padding: 10px 14px; font-size: 8.5px; font-weight: 500; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(201,168,76,0.5); border-bottom: 1px solid rgba(201,168,76,0.10); }
        .tbl td { padding: 12px 14px; font-size: 12.5px; color: rgba(255,255,255,0.60); border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
        .tbl tr:hover td { background: rgba(255,255,255,0.015); }

        .inp { width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10); color: rgba(255,255,255,0.80); font-family: 'Jost', sans-serif; font-size: 13px; outline: none; transition: border-color 0.2s; clip-path: polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px)); }
        .inp:focus { border-color: rgba(201,168,76,0.4); }
        .inp::placeholder { color: rgba(255,255,255,0.20); }
        select.inp option { background: #1a1610; color: #fff; }
        .inp-label { display: block; font-size: 9px; font-weight: 500; letter-spacing: 0.38em; text-transform: uppercase; color: rgba(255,255,255,0.30); margin-bottom: 7px; }

        .modal-bg { position: fixed; inset: 0; z-index: 999; background: rgba(0,0,0,0.80); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal { background: #0f0d0a; border: 1px solid rgba(201,168,76,0.18); width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; padding: 32px; position: relative; animation: fadeUp 0.3s ease; }
        .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; color: rgba(255,255,255,0.85); margin-bottom: 24px; }
        .modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; font-size: 18px; line-height: 1; transition: color 0.2s; }
        .modal-close:hover { color: rgba(255,255,255,0.7); }
        .form-grid { display: grid; gap: 16px; }
        .form-row  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .badge { display: inline-block; padding: 3px 10px; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; clip-path: polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px)); }
        .badge-green  { background: rgba(60,200,100,0.12);  color: rgba(80,220,120,0.85);  border: 1px solid rgba(60,200,100,0.2); }
        .badge-yellow { background: rgba(201,168,76,0.12);  color: rgba(201,168,76,0.85);  border: 1px solid rgba(201,168,76,0.25); }
        .badge-red    { background: rgba(220,60,60,0.12);   color: rgba(220,100,100,0.85); border: 1px solid rgba(220,60,60,0.2); }
        .badge-gray   { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.35); border: 1px solid rgba(255,255,255,0.10); }

        .stat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 28px; }
        .stat-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(201,168,76,0.10); padding: 20px 22px; position: relative; overflow: hidden; }
        .stat-card::after { content:''; position:absolute; top:0; right:0; width:60px; height:60px; background: radial-gradient(circle at top right, rgba(201,168,76,0.08), transparent 70%); }
        .stat-label { font-size:9px; letter-spacing:0.4em; text-transform:uppercase; color:rgba(255,255,255,0.25); margin-bottom:10px; }
        .stat-value { font-family:'Cormorant Garamond',serif; font-size:34px; font-weight:300; color:rgba(255,255,255,0.85); line-height:1; }
        .stat-sub   { font-size:10px; color:rgba(201,168,76,0.55); margin-top:6px; }

        .empty-state { text-align:center; padding:60px 0; color:rgba(255,255,255,0.20); font-size:13px; letter-spacing:0.1em; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="admin-wrap">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-name">FRAGY</div>
            <div className="sidebar-brand-sub">Admin Console</div>
          </div>

          <div className="sidebar-label">Navigation</div>

          {visibleNav.filter(n => n.id !== "register").map((n) => (
            <div key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}>
              <G d={n.icon} size={16} />
              {n.label}
            </div>
          ))}

          {/* Register — superadmin only, separated */}
          {admin?.role === "superadmin" && (
            <>
              <div className="nav-divider" />
              <div className="sidebar-label">Access Control</div>
              <div
                className={`nav-item register-item ${page === "register" ? "active" : ""}`}
                onClick={() => setPage("register")}>
                <G d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" size={16} />
                Add Admin
              </div>
            </>
          )}

          <div className="sidebar-footer">
            <div className="admin-role">{admin?.role}</div>
            <div className="admin-name">{admin?.name || admin?.email}</div>
            <button className="btn-logout" onClick={logout}>
              <G d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={13} />
              Logout
            </button>
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <div className="page-title">
              {visibleNav.find(n => n.id === page)?.label || "Admin"}
            </div>
            <div className="topbar-right">
              <span className="role-badge">{admin?.role}</span>
              <span>{admin?.name || admin?.email}</span>
            </div>
          </header>
          <div className="content">{children}</div>
        </div>
      </div>
    </>
  );
}