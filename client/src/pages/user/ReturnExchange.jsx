import { useState, useRef, useEffect } from "react";
import axios from "axios";
import '../../Style/rx-page.css';

const API = axios.create({ baseURL: "http://localhost:5000/api", withCredentials: true });

// ── Scroll reveal hook ──
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ── SVG Icons ──
const Ic = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ic = {
  return:   "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  exchange: "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
  check:    "M20 6L9 17l-5-5",
  clock:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 6v6l4 2",
  box:      "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  mail:     "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  alert:    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  close:    "M18 6L6 18 M6 6l12 12",
  send:     "M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z",
  arrow:    "M5 12h14 M12 5l7 7-7 7",
  seal:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  tag:      "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  truck:    "M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
};

// ── Policy steps ──
const returnSteps = [
  { num: "01", title: "Submit Request", desc: "Fill the return form below with your order ID and reason. Our team reviews within 24 hours." },
  { num: "02", title: "Approval & Label", desc: "Once approved, a prepaid shipping label is emailed to you within 2 business days." },
  { num: "03", title: "Pack & Ship", desc: "Repack the item in its original box — unused, sealed, with all accessories included." },
  { num: "04", title: "Refund Issued", desc: "Upon receipt and inspection, refund is processed within 5–7 business days." },
];

const exchangeSteps = [
  { num: "01", title: "Select New Item", desc: "Choose the fragrance you'd like to exchange for and note it in your request." },
  { num: "02", title: "Ship Your Item", desc: "Send the original item back using the label we provide. Must be in original condition." },
  { num: "03", title: "Quality Check", desc: "Our team inspects the returned item within 48 hours of receipt." },
  { num: "04", title: "New Order Dispatched", desc: "Your exchange item ships via priority courier once inspection is complete." },
];

const policies = [
  { icon: ic.clock, title: "30-Day Window", desc: "Returns and exchanges accepted within 30 days of delivery date." },
  { icon: ic.seal,  title: "Unopened Only", desc: "Items must be sealed, unused, and in original packaging with all accessories." },
  { icon: ic.tag,   title: "Gift Items", desc: "Gift purchases may be exchanged for store credit of equal value." },
  { icon: ic.truck, title: "Free Returns", desc: "We cover return shipping costs for defective or incorrectly shipped items." },
  { icon: ic.alert, title: "Non-Returnable", desc: "Opened, used, or custom-engraved fragrances cannot be returned or exchanged." },
  { icon: ic.mail,  title: "Support", desc: "Reach us at returns@aromaparfum.com or via live chat for any queries." },
];

const faqs = [
  { q: "How long do I have to initiate a return?", a: "You have 30 days from the date of delivery to submit a return or exchange request. After this window, we are unable to process requests." },
  { q: "Can I return a fragrance I've already opened?", a: "Unfortunately, opened or used fragrances cannot be returned due to hygiene and quality standards. Only sealed, unused items in original packaging are eligible." },
  { q: "What if my order arrived damaged or incorrect?", a: "We sincerely apologize. Please contact us within 48 hours of delivery with photos of the item and packaging. We will arrange a full replacement at no cost." },
  { q: "How will I receive my refund?", a: "Refunds are credited to your original payment method within 5–7 business days after the returned item passes inspection. You'll receive an email confirmation." },
  { q: "Can I exchange for a different fragrance?", a: "Yes. You may exchange any eligible item for any other product of equal or greater value (with the difference charged). Simply note your preferred exchange item in the form." },
  { q: "Do I need the original packaging?", a: "Yes — the item must be returned in its original box, with the sealed cap, bottle, and any included accessories. Items missing original packaging may not be accepted." },
];

export default function ReturnExchangePage() {
  const [tab, setTab] = useState("return");
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ orderId: "", email: "", type: "return", reason: "", exchange: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [heroRef, heroIn]       = useInView(0.08);
  const [policyRef, policyIn]   = useInView(0.08);
  const [stepsRef, stepsIn]     = useInView(0.08);
  const [formRef, formIn]       = useInView(0.08);
  const [faqRef, faqIn]         = useInView(0.08);

  const validate = () => {
    const e = {};
    if (!form.orderId.trim()) e.orderId = "Order ID is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.reason) e.reason = "Please select a reason";
    if (form.type === "exchange" && !form.exchange.trim()) e.exchange = "Please specify desired exchange item";
    return e;
  };

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError("");
    setSubmitting(true);
    try {
      await API.post("/returns/submit", {
        orderId:      form.orderId,
        email:        form.email,
        type:         form.type,
        reason:       form.reason,
        exchangeItem: form.exchangeItem || "",
        message:      form.message || "",
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = tab === "return" ? returnSteps : exchangeSteps;

  return (
    <>
       <div className="rx">
        <div className="rx-noise" />

        {/* Decorative rings */}
        <div className="rx-ring" style={{ width: 700, height: 700, top: "8%", left: "70%", transform: "translate(-50%,-50%)" }} />
        <div className="rx-ring" style={{ width: 400, height: 400, top: "8%", left: "70%", transform: "translate(-50%,-50%)", borderStyle: "dashed", opacity: 0.6 }} />

        {/* ── HERO ── */}
        <div className="rx-hero" ref={heroRef}>
          <div className="rx-inner">
            <div className={`eyebrow reveal ${heroIn ? "visible" : ""}`}>
              <div className="eyebrow-line" />
              <span className="eyebrow-text">Customer Care</span>
              <div className="eyebrow-line" />
            </div>

            <h1 className={`hero-title reveal d1 ${heroIn ? "visible" : ""}`}>
              Returns &<br /><em>Exchanges</em>
            </h1>

            <p className={`hero-sub reveal d2 ${heroIn ? "visible" : ""}`}>
              We want every AROMA experience to be perfect. If something isn't right, we make it right — simply and swiftly.
            </p>

            {/* Tab switcher */}
            <div className={`rx-tabs reveal d3 ${heroIn ? "visible" : ""}`}>
              <button className={`rx-tab ${tab === "return" ? "active" : ""}`} onClick={() => setTab("return")}>
                <Ic d={ic.return} size={14} /> Return
              </button>
              <button className={`rx-tab ${tab === "exchange" ? "active" : ""}`} onClick={() => setTab("exchange")}>
                <Ic d={ic.exchange} size={14} /> Exchange
              </button>
            </div>
          </div>
        </div>

        {/* ── POLICY GRID ── */}
        <div className="rx-section" ref={policyRef}>
          <div className="rx-inner">
            <div className={`reveal ${policyIn ? "visible" : ""}`}>
              <div className="section-tag">
                <div className="tag-line" />
                <span className="tag-text">Our Policy</span>
              </div>
              <h2 className="section-title">What You Need <em>to Know</em></h2>
            </div>

            <div className="policy-grid">
              {policies.map((p, i) => (
                <div key={i} className={`policy-card reveal d${i + 1} ${policyIn ? "visible" : ""}`}>
                  <div className="policy-icon"><Ic d={p.icon} size={22} /></div>
                  <div style={{ height: 1, width: 28, background: "rgba(201,168,76,0.3)" }} />
                  <div className="policy-title">{p.title}</div>
                  <div className="policy-desc">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PROCESS STEPS ── */}
        <div className="rx-section" ref={stepsRef}>
          <div className="rx-inner">
            <div className={`reveal ${stepsIn ? "visible" : ""}`} style={{ marginBottom: 0 }}>
              <div className="section-tag">
                <div className="tag-line" />
                <span className="tag-text">{tab === "return" ? "Return Process" : "Exchange Process"}</span>
              </div>
              <h2 className="section-title">How It <em>Works</em></h2>
            </div>

            <div className="steps-grid" key={tab}>
              {steps.map((s, i) => (
                <div key={i} className={`step-item reveal d${i + 1} ${stepsIn ? "visible" : ""}`}>
                  <div className="step-num-wrap">
                    <span className="step-num">{s.num}</span>
                  </div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FORM ── */}
        <div className="rx-section" ref={formRef} style={{ borderBottom: "none" }}>
          <div className="rx-inner">
            <div className={`reveal ${formIn ? "visible" : ""}`} style={{ marginBottom: 40 }}>
              <div className="section-tag">
                <div className="tag-line" />
                <span className="tag-text">Submit Request</span>
              </div>
              <h2 className="section-title">Start Your <em>Request</em></h2>
            </div>

            <div className="rx-form-wrap">
              {/* Form */}
              <div className={`reveal d1 ${formIn ? "visible" : ""}`}>
                {submitted ? (
                  <div className="success-card">
                    <svg className="success-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <div className="success-title">Request Submitted</div>
                    <div className="success-desc">
                      Thank you. We've received your {form.type} request for order <strong style={{ color: "rgba(255,255,255,0.65)" }}>{form.orderId}</strong>.<br />
                      A confirmation has been sent to <strong style={{ color: "rgba(255,255,255,0.65)" }}>{form.email}</strong>.<br />
                      Our team will respond within 24 business hours.
                    </div>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ orderId: "", email: "", type: "return", reason: "", exchange: "", message: "" }); }}
                      style={{ marginTop: 28, padding: "10px 24px", background: "transparent", border: "1px solid rgba(110,231,183,0.3)", color: "#6ee7b7", fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer", clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))" }}
                    >
                      New Request
                    </button>
                  </div>
                ) : (
                  <div className="rx-form-card">
                    <form onSubmit={handleSubmit}>
                      {/* Request type */}
                      <div style={{ marginBottom: 24 }}>
                        <label className="field-label">Request Type</label>
                        <div className="type-toggle">
                          <button type="button" className={`type-btn ${form.type === "return" ? "active" : ""}`}
                            onClick={() => setForm(f => ({ ...f, type: "return" }))}>
                            <Ic d={ic.return} size={13} /> Return
                          </button>
                          <button type="button" className={`type-btn ${form.type === "exchange" ? "active" : ""}`}
                            onClick={() => setForm(f => ({ ...f, type: "exchange" }))}>
                            <Ic d={ic.exchange} size={13} /> Exchange
                          </button>
                        </div>
                      </div>

                      {/* Order ID + Email */}
                      <div className="field-row">
                        <div className="field-group">
                          <label className="field-label">Order ID *</label>
                          <input className="field-input" value={form.orderId} onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))} placeholder="e.g. ORD-4821" />
                          {errors.orderId && <div className="field-error">{errors.orderId}</div>}
                        </div>
                        <div className="field-group">
                          <label className="field-label">Email Address *</label>
                          <input className="field-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
                          {errors.email && <div className="field-error">{errors.email}</div>}
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="field-group">
                        <label className="field-label">Reason for {form.type === "return" ? "Return" : "Exchange"} *</label>
                        <select className="field-select" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}>
                          <option value="">— Select a reason —</option>
                          <option value="wrong_item">Received wrong item</option>
                          <option value="damaged">Item arrived damaged</option>
                          <option value="not_as_described">Not as described</option>
                          <option value="changed_mind">Changed my mind</option>
                          <option value="quality">Quality concern</option>
                          <option value="gift">Gift — wrong item</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.reason && <div className="field-error">{errors.reason}</div>}
                      </div>

                      {/* Exchange item */}
                      {form.type === "exchange" && (
                        <div className="field-group">
                          <label className="field-label">Desired Exchange Item *</label>
                          <input className="field-input" value={form.exchange} onChange={e => setForm(f => ({ ...f, exchange: e.target.value }))} placeholder="e.g. OBSIDIAN Extrait 50ml" />
                          {errors.exchange && <div className="field-error">{errors.exchange}</div>}
                        </div>
                      )}

                      {/* Message */}
                      <div className="field-group">
                        <label className="field-label">Additional Notes</label>
                        <textarea className="field-textarea" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Any additional details about your request..." />
                      </div>

                      {apiError && (
                        <div style={{ background: "rgba(252,165,165,0.08)", border: "1px solid rgba(252,165,165,0.22)", padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                          <Ic d={ic.alert} size={14} />
                          <span style={{ fontSize: 12, color: "#fca5a5", letterSpacing: "0.04em" }}>{apiError}</span>
                        </div>
                      )}

                      <button type="submit" className="submit-btn" disabled={submitting}>
                        {submitting ? "Submitting…" : <>Submit Request <Ic d={ic.send} size={13} /></>}
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className={`rx-sidebar reveal d2 ${formIn ? "visible" : ""}`}>
                <div className="sidebar-card">
                  <div className="sidebar-card-title">
                    <Ic d={ic.check} size={16} /> Eligibility Checklist
                  </div>
                  <ul className="sidebar-list">
                    <li>Item purchased within the last 30 days</li>
                    <li>Product is unopened and unused</li>
                    <li>Original packaging and seal intact</li>
                    <li>All accessories and inserts included</li>
                    <li>Order confirmation email available</li>
                    <li>Not a custom-engraved or personalized item</li>
                  </ul>
                </div>

                <div className="sidebar-card">
                  <div className="sidebar-card-title">
                    <Ic d={ic.clock} size={16} /> Timeline
                  </div>
                  <ul className="sidebar-list">
                    <li>Request reviewed: within 24 hrs</li>
                    <li>Shipping label sent: within 2 days</li>
                    <li>Inspection after receipt: 48 hrs</li>
                    <li>Refund processing: 5–7 business days</li>
                    <li>Exchange dispatch: same day as approval</li>
                  </ul>
                </div>

                <div className="sidebar-card">
                  <div className="sidebar-card-title">
                    <Ic d={ic.mail} size={16} /> Need Help?
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(255,255,255,0.36)", lineHeight: 1.8, letterSpacing: "0.03em" }}>
                    Our customer care team is available Monday–Saturday, 9am–6pm PKT.
                  </p>
                  <a href="mailto:returns@aromaparfum.com" className="contact-link">
                    <Ic d={ic.arrow} size={13} /> returns@aromaparfum.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ padding: "72px 0 100px", borderTop: "1px solid rgba(201,168,76,0.07)" }} ref={faqRef}>
          <div className="rx-inner">
            <div className={`reveal ${faqIn ? "visible" : ""}`}>
              <div className="section-tag">
                <div className="tag-line" />
                <span className="tag-text">FAQ</span>
              </div>
              <h2 className="section-title">Common <em>Questions</em></h2>
            </div>

            <div className="faq-list">
              {faqs.map((f, i) => (
                <div key={i} className={`faq-item reveal d${Math.min(i + 1, 6)} ${faqIn ? "visible" : ""} ${openFaq === i ? "open" : ""}`}>
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {f.q}
                    <span className="faq-chevron"><Ic d={ic.plus ?? "M12 5v14 M5 12h14"} size={16} /></span>
                  </button>
                  <div className="faq-a">
                    <div className="faq-a-text">{f.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}