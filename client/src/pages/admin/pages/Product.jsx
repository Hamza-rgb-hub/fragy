import { useEffect, useState } from "react";
import API from "../../../utils/api";
import { useAdminAuth } from "../AdminApp";
import '../../../App.css'

const G = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const EMPTY_FORM = {
  name: "", brand: "", price: "", stock: "", tags: "",
  description: "", category: "", size: "",
  isNewArrival: false, bestSeller: false, limitedEdition: false, featured: false,
};

const BADGE_FLAGS = [
  { key: "isNewArrival",   label: "New Arrival" },
  { key: "bestSeller",     label: "Best Seller" },
  { key: "limitedEdition", label: "Limited Edition" },
  { key: "featured",       label: "Featured" },
];

export default function Products() {
  const { admin } = useAdminAuth();
  const canWrite = admin?.role === "admin" || admin?.role === "superadmin";

  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null);
  const [selected, setSelected]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [image, setImage]         = useState(null);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [deleteId, setDeleteId]   = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/products");
      setProducts(data.perfumes || data.products || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProducts(); }, []);

  const openAdd = () => {
    setForm(EMPTY_FORM); setImage(null); setError(""); setModal("add");
  };

  const openEdit = (p) => {
    setSelected(p);
    setForm({
      name:           p.name          || "",
      brand:          p.brand         || "",
      price:          p.price         ?? "",
      stock:          p.stock         ?? "",
      tags:           (p.tags || []).join(", "),
      description:    p.description   || "",
      category:       p.category      || "",
      size:           p.size          || "",
      isNewArrival:   p.isNewArrival   || false,
      bestSeller:     p.bestSeller     || false,
      limitedEdition: p.limitedEdition || false,
      featured:       p.featured       || false,
    });
    setImage(null); setError(""); setModal("edit");
  };

  const closeModal = () => { setModal(null); setSelected(null); setError(""); };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.price) {
      setError("Name, brand and price are required"); return;
    }
    try {
      setSaving(true); setError("");
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);

      if (modal === "add") {
        await API.post("/products/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await API.put(`/products/update/${selected._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      await loadProducts();
      closeModal();
    } catch (e) {
      setError(e.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/delete/${id}`);
      setDeleteId(null);
      await loadProducts();
    } catch (e) { alert(e.response?.data?.message || "Delete failed"); }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: 4 }}>Manage</div>
          <input className="inp" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ width: 260, fontSize: 12 }} />
        </div>
        {canWrite && (
          <button className="btn-gold" onClick={openAdd}>
            <G d="M12 4v16m8-8H4" size={13} /> Add Product
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
            <div style={{ width: 24, height: 24, border: "2px solid rgba(201,168,76,0.15)", borderTopColor: "#c9a84c", borderRadius: "50%" }} className="spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">No products found</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Tags</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                {canWrite && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {p.image?.url
                        ? <img src={p.image.url} alt={p.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 2, opacity: 0.85 }} />
                        : <div style={{ width: 40, height: 40, background: "rgba(201,168,76,0.08)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <G d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" size={16} />
                          </div>
                      }
                      <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 400 }}>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.brand}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {(p.tags || []).slice(0, 3).map(t => (
                        <span key={t} style={{ padding: "2px 8px", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(201,168,76,0.65)", textTransform: "uppercase" }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ color: "#c9a84c" }}>${Number(p.price).toFixed(2)}</td>
                  <td style={{ color: p.stock > 0 ? "rgba(255,255,255,0.6)" : "rgba(220,100,100,0.8)" }}>{p.stock}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <span className={`badge ${p.stock > 0 ? "badge-green" : "badge-red"}`}>
                        {p.stock > 0 ? "In Stock" : "Out"}
                      </span>
                      {p.isNewArrival   && <span className="badge badge-gold">New</span>}
                      {p.bestSeller     && <span className="badge badge-gold">Best Seller</span>}
                      {p.limitedEdition && <span className="badge badge-red">Limited</span>}
                      {p.featured       && <span className="badge badge-green">Featured</span>}
                    </div>
                  </td>
                  {canWrite && (
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn-ghost" onClick={() => openEdit(p)} style={{ padding: "6px 12px", fontSize: 10 }}>
                          <G d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" size={12} />
                          Edit
                        </button>
                        <button className="btn-danger" onClick={() => setDeleteId(p._id)}>
                          <G d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" size={12} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <div className="modal-title">{modal === "add" ? "Add New Product" : "Edit Product"}</div>

            <div className="form-grid">
              <div className="form-row">
                <div>
                  <label className="inp-label">Product Name *</label>
                  <input className="inp" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Rose Noir" />
                </div>
                <div>
                  <label className="inp-label">Brand *</label>
                  <input className="inp" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} placeholder="Fragy" />
                </div>
              </div>
              <div className="form-row">
                <div>
                  <label className="inp-label">Price (USD) *</label>
                  <input className="inp" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="99.99" />
                </div>
                <div>
                  <label className="inp-label">Stock</label>
                  <input className="inp" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="10" />
                </div>
              </div>
              <div>
                <label className="inp-label">Tags (comma separated)</label>
                <input className="inp" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="fresh, floral, woody" />
              </div>
              <div className="form-row">
                <div>
                  <label className="inp-label">Category</label>
                  <select className="inp" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="">Select</option>
                    <option value="floral">Floral</option>
                    <option value="woody">Woody</option>
                    <option value="fresh">Fresh</option>
                    <option value="spicy">Spicy</option>
                    <option value="sweet">Sweet</option>
                  </select>
                </div>
                <div>
                  <label className="inp-label">Size</label>
                  <input className="inp" value={form.size} onChange={e => setForm({...form, size: e.target.value})} placeholder="50ml" />
                </div>
              </div>
              <div>
                <label className="inp-label">Description</label>
                <textarea className="inp" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe this fragrance..." style={{ resize: "vertical", clipPath: "none" }} />
              </div>
              <div>
                <label className="inp-label">Product Image</label>
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
                  style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "'Jost',sans-serif" }} />
                {selected?.image?.url && !image && (
                  <img src={selected.image.url} alt="" style={{ marginTop: 10, height: 60, borderRadius: 3, opacity: 0.7 }} />
                )}
              </div>

              {/* Badge Flags */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {BADGE_FLAGS.map(({ key, label }) => (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input type="checkbox" id={key} checked={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.checked })}
                      style={{ accentColor: "#c9a84c", width: 15, height: 15 }} />
                    <label htmlFor={key} style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", cursor: "pointer" }}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {error && <div style={{ marginTop: 16, fontSize: 11, color: "rgba(220,100,100,0.85)" }}>⚠ {error}</div>}

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button className="btn-gold" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : modal === "add" ? "Create Product" : "Save Changes"}
              </button>
              <button className="btn-ghost" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 380, textAlign: "center" }}>
            <div className="modal-title" style={{ marginBottom: 10 }}>Delete Product?</div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 28 }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn-danger" onClick={() => handleDelete(deleteId)} style={{ padding: "10px 24px" }}>
                Delete
              </button>
              <button className="btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}