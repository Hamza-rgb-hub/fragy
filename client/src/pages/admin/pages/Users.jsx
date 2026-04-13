import { useEffect, useState } from "react";
import API from "../../../utils/api";
import { useAdminAuth } from "../AdminApp";

const G = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const roleColor = (r) => {
  if (r === "superadmin") return "badge-yellow";
  if (r === "admin") return "badge-green";
  return "badge-gray";
};

export default function Users() {
  const { admin } = useAdminAuth();
  const isSuperAdmin = admin?.role === "superadmin";
  const canWrite = admin?.role === "admin" || admin?.role === "superadmin";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [roleModal, setRoleModal] = useState(null); // { user }
  const [newRole, setNewRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/auth/admin/showAll");
      setUsers(data.users || data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openRoleModal = (u) => { setRoleModal(u); setNewRole(u.role || "user"); };

  const updateRole = async () => {
    try {
      setSaving(true);
      await API.put(`/auth/user/${roleModal._id}/role`, { role: newRole });
      await fetchUsers();
      setRoleModal(null);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update role");
    } finally { setSaving(false); }
  };

  const deleteUser = async (id) => {
    try {
      await API.delete(`/auth/user/${id}`);
      setDeleteId(null);
      await fetchUsers();
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed");
    }
  };

  const filtered = users.filter(u => {
    const matchFilter = filter === "all" || u.role === filter;
    const matchSearch = !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: users.length,
    superadmin: users.filter(u => u.role === "superadmin").length,
    admin: users.filter(u => u.role === "admin").length,
    user: users.filter(u => u.role === "user").length,
  };

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
        <input className="inp" placeholder="Search users..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ width: 240, fontSize: 12 }} />

        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(counts).map(([role, count]) => (
            <button key={role} onClick={() => setFilter(role)}
              style={{
                padding: "7px 14px", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
                border: `1px solid ${filter === role ? "#c9a84c" : "rgba(255,255,255,0.10)"}`,
                background: filter === role ? "rgba(201,168,76,0.10)" : "transparent",
                color: filter === role ? "#c9a84c" : "rgba(255,255,255,0.30)",
                cursor: "pointer", transition: "all 0.2s",
                clipPath: "polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px))",
              }}>
              {role} ({count})
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
            <div style={{ width: 24, height: 24, border: "2px solid rgba(201,168,76,0.15)", borderTopColor: "#c9a84c", borderRadius: "50%" }} className="spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">No users found</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Quiz</th>
                <th>Joined</th>
                {canWrite && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: "rgba(201,168,76,0.12)",
                        border: "1px solid rgba(201,168,76,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, color: "#c9a84c", fontFamily: "'Cormorant Garamond',serif",
                        fontWeight: 400,
                      }}>
                        {(u.name || u.email || "?")[0].toUpperCase()}
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>{u.name || "—"}</span>
                    </div>
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.40)", fontSize: 12 }}>{u.email}</td>
                  <td><span className={`badge ${roleColor(u.role)}`}>{u.role || "user"}</span></td>
                  <td>
                    <span className={`badge ${u.quizCompleted ? "badge-green" : "badge-gray"}`}>
                      {u.quizCompleted ? "Done" : "Pending"}
                    </span>
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>
                  {canWrite && (
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        {/* Only superadmin can change roles */}
                        {isSuperAdmin && u._id !== admin._id && (
                          <button className="btn-ghost" onClick={() => openRoleModal(u)} style={{ padding: "6px 12px", fontSize: 10 }}>
                            <G d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" size={12} />
                            Role
                          </button>
                        )}
                        {/* Only superadmin can delete, and cannot delete self */}
                        {isSuperAdmin && u._id !== admin._id && u.role !== "superadmin" && (
                          <button className="btn-danger" onClick={() => setDeleteId(u._id)}>
                            <G d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Role Modal */}
      {roleModal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setRoleModal(null)}>
          <div className="modal" style={{ maxWidth: 380 }}>
            <button className="modal-close" onClick={() => setRoleModal(null)}>✕</button>
            <div className="modal-title">Change Role</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>{roleModal.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{roleModal.email}</div>
            </div>
            <div>
              <label className="inp-label">New Role</label>
              <select className="inp" value={newRole} onChange={e => setNewRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button className="btn-gold" onClick={updateRole} disabled={saving}>
                {saving ? "Saving..." : "Update Role"}
              </button>
              <button className="btn-ghost" onClick={() => setRoleModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 360, textAlign: "center" }}>
            <div className="modal-title">Delete User?</div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: "8px 0 28px" }}>
              This will permanently remove the user and all their data.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn-danger" onClick={() => deleteUser(deleteId)} style={{ padding: "10px 24px" }}>Delete</button>
              <button className="btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}