import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ── Shared styles injected once ───────────────────────────────────────────────
import "../../Style/pp.css";

const ACCENT = "#c9a84c";

// ── Particles ─────────────────────────────────────────────────────────────────
const Particles = () => (
  <>
    {[...Array(5)].map((_,i) => (
      <div key={i} style={{
        position:"absolute", width: i%2===0?3:2, height: i%2===0?3:2,
        borderRadius:"50%", background:ACCENT, opacity: 0.2+(i%3)*0.08,
        top:`${8+i*16}%`, left:`${6+(i%3)*28}%`,
        animation:`floatP${i%3} ${2.5+i*0.4}s ease-in-out infinite`,
        animationDelay:`${i*0.4}s`, pointerEvents:"none",
      }}/>
    ))}
  </>
);

// ── TOC data ──────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id:"s1",  num:"01", title:"Information We Collect" },
  { id:"s2",  num:"02", title:"How We Use Your Data" },
  { id:"s3",  num:"03", title:"Data Sharing" },
  { id:"s4",  num:"04", title:"Cookies & Tracking" },
  { id:"s5",  num:"05", title:"Your Rights" },
  { id:"s6",  num:"06", title:"Data Retention" },
  { id:"s7",  num:"07", title:"Security" },
  { id:"s8",  num:"08", title:"Children's Privacy" },
  { id:"s9",  num:"09", title:"Changes to Policy" },
  { id:"s10", num:"10", title:"Contact Us" },
];

// ── Section content ───────────────────────────────────────────────────────────
const CONTENT = [
  {
    id:"s1", title:"Information We Collect",
    body:[
      `When you place an order, create an account, or interact with our boutique, we collect information necessary to serve you with care and precision.`,
      `**Personal Identifiers:** Full name, email address, phone number, and shipping/billing addresses provided during checkout or account registration.`,
      `**Order & Transaction Data:** Details of fragrances purchased, order history, payment method type (we never store full card numbers — all payments are processed via PCI-compliant third-party gateways), and correspondence related to your orders.`,
      `**Usage & Device Data:** Browser type, IP address, pages visited, time spent, referring URLs, and device identifiers — collected automatically when you browse our site to help us improve your experience.`,
      `**Preference Data:** Fragrance preferences, wishlist items, and communication preferences you explicitly provide.`,
    ]
  },
  {
    id:"s2", title:"How We Use Your Data",
    body:[
      `Every piece of information we hold is used solely to deliver the luxury experience you deserve. Specifically, we use your data to:`,
      `**Fulfil Orders:** Process payments, arrange shipping, send dispatch and delivery notifications, and handle returns or exchanges.`,
      `**Account Management:** Allow you to view order history, manage saved addresses, and update preferences.`,
      `**Customer Support:** Respond to enquiries, resolve complaints, and provide after-sale assistance.`,
      `**Personalisation:** Recommend fragrances aligned with your purchase history and stated preferences — only when you have opted in.`,
      `**Legal Compliance:** Maintain records as required by applicable commercial and tax law.`,
      `We do not sell your personal data. We do not use it for automated profiling that produces legal or similarly significant effects.`,
    ]
  },
  {
    id:"s3", title:"Data Sharing",
    body:[
      `We share your data only where strictly necessary and always under data-processing agreements that bind recipients to confidentiality and security obligations.`,
      `**Logistics Partners:** Your name and address are shared with courier and fulfilment partners solely to deliver your order.`,
      `**Payment Processors:** Transaction data is passed to our payment gateway; we receive only a tokenised confirmation of payment success or failure.`,
      `**Technology Providers:** Hosting, email, and analytics platforms that process data on our behalf under written data-processing agreements.`,
      `**Legal Obligations:** We may disclose data if required by law, court order, or to protect the rights and safety of our customers or staff.`,
      `We will never sell, rent, or trade your personal information to third parties for their marketing purposes.`,
    ]
  },
  {
    id:"s4", title:"Cookies & Tracking",
    body:[
      `Our site uses cookies — small text files stored on your device — to make your browsing experience seamless and relevant.`,
      `**Essential Cookies:** Required for the site to function (cart contents, session authentication, security tokens). These cannot be disabled without breaking core features.`,
      `**Analytics Cookies:** Help us understand how visitors navigate our site so we can improve content and performance. Data is aggregated and anonymised.`,
      `**Preference Cookies:** Remember your choices such as language or currency so you don't have to re-select them each visit.`,
      `**Marketing Cookies:** Used only with your explicit consent to show you relevant fragrance recommendations on third-party platforms.`,
      `You may manage cookie preferences at any time via your browser settings or our cookie consent panel. Note that disabling non-essential cookies will not affect your ability to browse or purchase.`,
    ]
  },
  {
    id:"s5", title:"Your Rights",
    body:[
      `Depending on your jurisdiction, you hold the following rights over your personal data. We honour all requests within 30 days.`,
      `**Access:** Request a copy of all personal data we hold about you.`,
      `**Rectification:** Ask us to correct inaccurate or incomplete data.`,
      `**Erasure:** Request deletion of your data where we have no overriding legal obligation to retain it.`,
      `**Restriction:** Ask us to pause processing your data while a dispute is resolved.`,
      `**Portability:** Receive your data in a structured, machine-readable format.`,
      `**Objection:** Object to processing based on legitimate interests, including direct marketing.`,
      `To exercise any right, email us at privacy@yourfragrancebrand.com with your name, email address on file, and the specific request. We may ask for identity verification before acting on sensitive requests.`,
    ]
  },
  {
    id:"s6", title:"Data Retention",
    body:[
      `We retain personal data only as long as necessary for the purpose it was collected, or as required by law.`,
      `**Order Records:** Retained for 7 years to comply with tax and commercial law requirements.`,
      `**Account Data:** Retained while your account is active. If you request account deletion, we erase all data not subject to legal retention obligations within 30 days.`,
      `**Marketing Preferences:** Retained until you withdraw consent.`,
      `**Support Correspondence:** Retained for 2 years after resolution to assist with any follow-up queries.`,
      `Anonymised, aggregated analytics data may be retained indefinitely as it cannot be linked to any individual.`,
    ]
  },
  {
    id:"s7", title:"Security",
    body:[
      `We take the protection of your information seriously and employ industry-standard measures to safeguard it.`,
      `All data transmitted between your device and our servers is encrypted via TLS (HTTPS). Sensitive data at rest is encrypted using AES-256. Access to customer data is restricted to authorised personnel on a strict need-to-know basis.`,
      `We conduct regular security audits and penetration testing. Our payment processing is handled by PCI DSS-compliant partners — we never store raw card data on our systems.`,
      `While we implement every reasonable precaution, no internet transmission is 100% secure. If you suspect any unauthorised access to your account, please contact us immediately.`,
    ]
  },
  {
    id:"s8", title:"Children's Privacy",
    body:[
      `Our site and services are intended for individuals aged 18 and over. We do not knowingly collect personal data from anyone under 18.`,
      `If you are a parent or guardian and believe your child has submitted personal information to us, please contact us at privacy@yourfragrancebrand.com and we will delete it promptly.`,
    ]
  },
  {
    id:"s9", title:"Changes to This Policy",
    body:[
      `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.`,
      `When we make material changes, we will notify you by email (if you have an account) and by posting a prominent notice on our site for at least 30 days before the changes take effect. The "Last Updated" date at the top of this page will always reflect the most recent revision.`,
      `Your continued use of our site after a policy update constitutes your acceptance of the revised terms.`,
    ]
  },
  {
    id:"s10", title:"Contact Us",
    body:[
      `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out:`,
      `**Email:** privacy@yourfragrancebrand.com`,
      `**Post:** Data Privacy Officer, [Your Brand Name], [Your Address]`,
      `**Response Time:** We aim to respond to all privacy enquiries within 5 business days.`,
      `If you are unsatisfied with our response, you have the right to lodge a complaint with your local data protection authority.`,
    ]
  },
];

// ── Render rich text (bold via **) ────────────────────────────────────────────
function RichText({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <p style={{
      fontFamily:"'Cormorant Garamond', serif",
      fontSize:17, lineHeight:1.85,
      color:"rgba(255,255,255,0.42)",
      marginBottom:16,
    }}>
      {parts.map((p,i) =>
        i%2===1
          ? <span key={i} style={{ color:"rgba(255,255,255,0.7)", fontWeight:500 }}>{p}</span>
          : <span key={i}>{p}</span>
      )}
    </p>
  );
}

// ── Scroll spy hook ───────────────────────────────────────────────────────────
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const handler = () => {
      for (let i = ids.length-1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActive(ids[i]); return;
        }
      }
      setActive(ids[0]);
    };
    window.addEventListener("scroll", handler, { passive:true });
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);
  return active;
}

// ── Intersection observer for section reveal ──────────────────────────────────
function useSectionReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".legal-section-block");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold:0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function PrivacyPolicy() {
  const sectionIds = SECTIONS.map(s => s.id);
  const active = useScrollSpy(sectionIds);
  useSectionReveal();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div style={{
        minHeight:"100vh",
        background:"linear-gradient(160deg, #080604 0%, #0f0d07 45%, #16120a 100%)",
        color:"#f5f0e8", fontFamily:"'Jost', sans-serif",
        position:"relative", overflowX:"hidden",
      }}>
        <Particles />

        {/* Ambient glow */}
        <div style={{
          position:"absolute", top:"8%", right:"15%",
          width:560, height:560, borderRadius:"50%",
          background:ACCENT, opacity:0.07, filter:"blur(130px)",
          pointerEvents:"none", animation:"pulse 6s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute", bottom:"20%", left:"5%",
          width:320, height:320, borderRadius:"50%",
          background:ACCENT, opacity:0.04, filter:"blur(100px)",
          pointerEvents:"none",
        }}/>

        {/* Top rule */}
        <div style={{
          position:"absolute", top:0, left:"6%", right:"6%", height:1,
          background:`linear-gradient(90deg, transparent, ${ACCENT}35, transparent)`,
        }}/>

        <div className="legal-inner" style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px" }}>

          {/* ── HERO ── */}
          <div style={{ paddingTop:110, paddingBottom:64, borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <Link to="/" className="back-link legal-fade" style={{ marginBottom:36, display:"inline-flex" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back to Home
            </Link>

            <div className="legal-fade-d1" style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
              <div style={{ width:44, height:1, background:ACCENT, opacity:0.7 }}/>
              <span style={{ fontSize:9, letterSpacing:"0.5em", color:ACCENT, textTransform:"uppercase", fontWeight:500 }}>
                Legal
              </span>
            </div>

            <h1 className="legal-hero-title legal-fade-d1" style={{
              fontFamily:"'Cormorant Garamond', serif",
              fontSize:"clamp(48px,8vw,96px)", fontWeight:300,
              letterSpacing:"-0.02em", lineHeight:0.93,
              color:"#f5f0e8", marginBottom:22,
            }}>
              Privacy<br/>
              <em style={{ fontStyle:"italic", color:ACCENT }}>Policy</em>
            </h1>

            <div className="legal-fade-d2" style={{ display:"flex", flexWrap:"wrap", gap:20, alignItems:"center" }}>
              <span style={{
                padding:"6px 16px", fontSize:10, letterSpacing:"0.3em",
                textTransform:"uppercase", color:"rgba(255,255,255,0.3)",
                border:"1px solid rgba(255,255,255,0.08)",
                clipPath:"polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))",
              }}>Last Updated: January 2025</span>
              <p style={{
                fontSize:14, color:"rgba(255,255,255,0.28)",
                fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic",
              }}>
                Your privacy is as precious to us as the rarest oud.
              </p>
            </div>
          </div>

          {/* ── LAYOUT ── */}
          <div className="legal-layout" style={{
            display:"grid", gridTemplateColumns:"260px 1fr",
            gap:0, paddingBottom:80,
          }}>

            {/* TOC sidebar */}
            <aside className="legal-toc" style={{
              paddingTop:48, paddingRight:32,
              position:"sticky", top:90,
              height:"fit-content", alignSelf:"start",
            }}>
              <p style={{
                fontSize:9, letterSpacing:"0.45em", textTransform:"uppercase",
                color:`${ACCENT}70`, marginBottom:16, paddingLeft:14,
              }}>Contents</p>
              <nav>
                {SECTIONS.map(s => (
                  <button key={s.id}
                    className={`toc-link ${active===s.id?"active":""}`}
                    onClick={() => scrollTo(s.id)}
                    style={{ background:"none", border:"none", cursor:"pointer", width:"100%", textAlign:"left" }}
                  >
                    <span className="toc-num">{s.num}</span>
                    {s.title}
                  </button>
                ))}
              </nav>

              {/* Sister page link */}
              <div style={{ marginTop:40, paddingLeft:14 }}>
                <div style={{ width:"100%", height:1, background:"rgba(255,255,255,0.06)", marginBottom:20 }}/>
                <p style={{ fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)", marginBottom:10 }}>
                  Also Read
                </p>
                <Link to="/terms" style={{
                  fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase",
                  color:`${ACCENT}70`, textDecoration:"none", transition:"color 0.2s",
                  display:"flex", alignItems:"center", gap:8,
                }}
                  onMouseEnter={e=>e.currentTarget.style.color=ACCENT}
                  onMouseLeave={e=>e.currentTarget.style.color=`${ACCENT}70`}
                >
                  Terms of Service →
                </Link>
              </div>
            </aside>

            {/* Body */}
            <main className="legal-body" style={{
              paddingTop:48, paddingLeft:52,
              borderLeft:"1px solid rgba(255,255,255,0.05)",
            }}>
              {CONTENT.map((sec, si) => (
                <div key={sec.id} id={sec.id} className="legal-section-block"
                  style={{ transitionDelay:`${si*0.04}s` }}
                >
                  {/* Section header */}
                  <div style={{ display:"flex", alignItems:"flex-start", gap:18, marginBottom:24 }}>
                    <span style={{
                      fontFamily:"'Cormorant Garamond', serif",
                      fontSize:13, fontWeight:400, color:`${ACCENT}50`,
                      letterSpacing:"0.1em", paddingTop:6, minWidth:28,
                    }}>
                      {SECTIONS[si].num}
                    </span>
                    <div style={{ flex:1 }}>
                      <h2 style={{
                        fontFamily:"'Cormorant Garamond', serif",
                        fontSize:28, fontWeight:400, letterSpacing:"0.02em",
                        color:"#f5f0e8", marginBottom:8,
                      }}>{sec.title}</h2>
                      <div style={{
                        width:52, height:1,
                        background:`linear-gradient(90deg, ${ACCENT}80, transparent)`,
                        transformOrigin:"left",
                        animation:"lineGrow 0.6s ease both",
                      }}/>
                    </div>
                  </div>

                  {/* Section body */}
                  <div style={{ paddingLeft:46 }}>
                    {sec.body.map((para, pi) => <RichText key={pi} text={para} />)}
                  </div>
                </div>
              ))}

              {/* Bottom stamp */}
              <div style={{
                marginTop:52, padding:"28px 32px",
                background:"rgba(201,168,76,0.04)",
                border:`1px solid ${ACCENT}20`,
                clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))",
              }}>
                <p style={{
                  fontFamily:"'Cormorant Garamond', serif",
                  fontSize:15, fontStyle:"italic",
                  color:"rgba(255,255,255,0.3)", lineHeight:1.8,
                }}>
                  By continuing to use our site, you acknowledge that you have read and understood this Privacy Policy. For questions, reach us at{" "}
                  <a href="mailto:privacy@yourfragrancebrand.com"
                    style={{ color:ACCENT, textDecoration:"none" }}>
                    privacy@yourfragrancebrand.com
                  </a>
                </p>
              </div>
            </main>
          </div>
        </div>

        {/* Bottom rule */}
        <div style={{
          height:1,
          background:`linear-gradient(90deg, transparent, ${ACCENT}20, transparent)`,
        }}/>
      </div>
    </>
  );
}


// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// const ACCENT  = "#c9a84c";
// const BG_CARD = "rgba(255,255,255,0.03)";
// const BORDER  = "rgba(255,255,255,0.07)";

// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
// *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

// @keyframes fadeUp {from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
// @keyframes glowPulse{0%,100%{opacity:.06}50%{opacity:.16}}
// @keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}

// .fu  {animation:fadeUp .7s cubic-bezier(.22,1,.36,1) both}
// .fu1 {animation:fadeUp .7s .1s cubic-bezier(.22,1,.36,1) both}
// .fu2 {animation:fadeUp .7s .2s cubic-bezier(.22,1,.36,1) both}
// .fu3 {animation:fadeUp .7s .3s cubic-bezier(.22,1,.36,1) both}

// .reveal{
//   opacity:0;transform:translateY(24px);
//   transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1);
// }
// .reveal.vis{opacity:1;transform:translateY(0)}

// .toc-btn{
//   display:flex;align-items:center;gap:10px;width:100%;padding:9px 14px;
//   background:none;border:none;border-left:1.5px solid transparent;
//   cursor:pointer;text-align:left;
//   font-family:'DM Sans',sans-serif;font-size:10.5px;letter-spacing:.18em;
//   text-transform:uppercase;color:rgba(255,255,255,.22);transition:all .22s;
// }
// .toc-btn:hover{color:rgba(201,168,76,.75);border-left-color:rgba(201,168,76,.35);background:rgba(201,168,76,.04)}
// .toc-btn.on{color:#c9a84c;border-left-color:#c9a84c;background:rgba(201,168,76,.07)}
// .toc-num{font-family:'Playfair Display',serif;font-size:12px;min-width:22px;color:rgba(201,168,76,.35)}
// .toc-btn.on .toc-num{color:#c9a84c}

// .item-card{
//   padding:20px 22px;background:rgba(255,255,255,.03);
//   border:1px solid rgba(255,255,255,.07);border-left:2px solid rgba(201,168,76,.3);
//   border-radius:3px;transition:all .22s;
// }
// .item-card:hover{background:rgba(201,168,76,.055);border-left-color:rgba(201,168,76,.75)}

// .back-lnk{
//   display:inline-flex;align-items:center;gap:7px;text-decoration:none;
//   font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:.35em;
//   text-transform:uppercase;color:rgba(255,255,255,.25);transition:color .2s;
// }
// .back-lnk:hover{color:#c9a84c}

// @media(max-width:1080px){
//   .pp-layout{grid-template-columns:1fr !important}
//   .pp-toc   {display:none !important}
//   .pp-body  {padding-left:0 !important;border-left:none !important}
// }
// @media(max-width:600px){
//   .pp-wrap  {padding:0 18px !important}
//   .hero-h   {font-size:clamp(44px,12vw,68px) !important}
//   .item-grid{grid-template-columns:1fr !important}
// }
// `;

// const SECTIONS = [
//   {id:"p1",n:"01",t:"Information We Collect"},
//   {id:"p2",n:"02",t:"How We Use Your Data"},
//   {id:"p3",n:"03",t:"Data Sharing"},
//   {id:"p4",n:"04",t:"Cookies & Tracking"},
//   {id:"p5",n:"05",t:"Your Rights"},
//   {id:"p6",n:"06",t:"Data Retention"},
//   {id:"p7",n:"07",t:"Security"},
//   {id:"p8",n:"08",t:"Children's Privacy"},
//   {id:"p9",n:"09",t:"Policy Changes"},
//   {id:"p10",n:"10",t:"Contact Us"},
// ];

// const DATA = [
//   {id:"p1",items:[
//     {h:"Personal Identifiers",b:"Full name, email address, phone number, and shipping / billing addresses provided during checkout or account registration."},
//     {h:"Order & Transaction Data",b:"Fragrances purchased, order history, and payment method type. We never store full card numbers — payments are processed via PCI-compliant gateways."},
//     {h:"Usage & Device Data",b:"Browser type, IP address, pages visited, session duration, and device identifiers — collected to improve your browsing experience."},
//     {h:"Preference Data",b:"Fragrance preferences, wishlist items, and communication preferences you explicitly share with us."},
//   ]},
//   {id:"p2",items:[
//     {h:"Order Fulfilment",b:"Process payments, arrange shipping, send dispatch and delivery notifications, and handle returns or exchanges."},
//     {h:"Account Management",b:"Allow you to view order history, manage saved addresses, and update fragrance preferences."},
//     {h:"Customer Support",b:"Respond to enquiries, resolve complaints, and provide attentive after-sale assistance."},
//     {h:"Personalisation",b:"Recommend fragrances aligned with your purchase history — only when you have opted in."},
//     {h:"Legal Compliance",b:"Maintain records as required by applicable commercial and tax law. We never sell your data."},
//   ]},
//   {id:"p3",items:[
//     {h:"Logistics Partners",b:"Your name and address are shared with courier partners solely to deliver your order."},
//     {h:"Payment Processors",b:"Transaction data is passed to our gateway. We receive only a tokenised confirmation of payment."},
//     {h:"Technology Providers",b:"Hosting, email, and analytics platforms under binding data-processing agreements."},
//     {h:"Legal Obligations",b:"Disclosure may occur if required by law or to protect the safety of our customers and staff."},
//   ]},
//   {id:"p4",items:[
//     {h:"Essential Cookies",b:"Required for core site functions — cart, session, and security. Cannot be disabled without breaking the experience."},
//     {h:"Analytics Cookies",b:"Help us understand navigation so we can improve content. Data is aggregated and anonymised."},
//     {h:"Preference Cookies",b:"Remember your choices (language, currency) so you don't re-select them each visit."},
//     {h:"Marketing Cookies",b:"Used only with explicit consent to surface relevant recommendations on third-party platforms."},
//   ]},
//   {id:"p5",items:[
//     {h:"Access",b:"Request a copy of all personal data we hold about you, delivered within 30 days."},
//     {h:"Rectification",b:"Ask us to correct inaccurate or incomplete information at any time."},
//     {h:"Erasure",b:"Request deletion of your data where no overriding legal obligation exists."},
//     {h:"Portability",b:"Receive your data in a structured, machine-readable format."},
//     {h:"Objection",b:"Object to processing based on legitimate interests, including direct marketing."},
//   ]},
//   {id:"p6",items:[
//     {h:"Order Records",b:"Retained for 7 years to comply with tax and commercial law."},
//     {h:"Account Data",b:"Retained while your account is active. Deleted within 30 days of a deletion request."},
//     {h:"Marketing Data",b:"Retained until you withdraw consent. One-click unsubscribe in every email."},
//     {h:"Support History",b:"Retained for 2 years after resolution to assist with any follow-up."},
//   ]},
//   {id:"p7",items:[
//     {h:"Encryption in Transit",b:"All data between your device and our servers is encrypted via TLS (HTTPS)."},
//     {h:"Encryption at Rest",b:"Sensitive stored data uses AES-256 encryption."},
//     {h:"Access Controls",b:"Customer data access is restricted to authorised personnel on a need-to-know basis."},
//     {h:"PCI Compliance",b:"Payments handled by PCI DSS-compliant partners. No raw card data on our systems."},
//   ]},
//   {id:"p8",items:[
//     {h:"Age Requirement",b:"Our site is intended exclusively for individuals aged 18 and over."},
//     {h:"No Child Data",b:"We do not knowingly collect data from anyone under 18. Contact us immediately if you believe otherwise."},
//   ]},
//   {id:"p9",items:[
//     {h:"Notification",b:"Material changes communicated by email and prominent site notice at least 30 days before taking effect."},
//     {h:"Acceptance",b:"Continued use of our site after an update constitutes acceptance of the revised terms."},
//   ]},
//   {id:"p10",items:[
//     {h:"Email",b:"privacy@yourfragrancebrand.com — we respond within 5 business days."},
//     {h:"Post",b:"Data Privacy Officer, [Your Brand Name], [Your Address], Pakistan."},
//     {h:"Regulator",b:"If unsatisfied, you may lodge a complaint with your local data protection authority."},
//   ]},
// ];

// function useScrollSpy(ids){
//   const [active,setActive]=useState(ids[0]);
//   useEffect(()=>{
//     const fn=()=>{
//       for(let i=ids.length-1;i>=0;i--){
//         const el=document.getElementById(ids[i]);
//         if(el&&el.getBoundingClientRect().top<=150){setActive(ids[i]);return}
//       }
//       setActive(ids[0]);
//     };
//     window.addEventListener("scroll",fn,{passive:true});
//     return()=>window.removeEventListener("scroll",fn);
//   },[ids]);
//   return active;
// }

// function useReveal(){
//   useEffect(()=>{
//     const els=document.querySelectorAll(".reveal");
//     const ob=new IntersectionObserver(
//       e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add("vis")}),
//       {threshold:.06}
//     );
//     els.forEach(el=>ob.observe(el));
//     return()=>ob.disconnect();
//   },[]);
// }

// export default function PrivacyPolicy(){
//   const ids=SECTIONS.map(s=>s.id);
//   const active=useScrollSpy(ids);
//   useReveal();
//   const go=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});

//   return(<>
//     <style>{CSS}</style>
//     <div style={{
//       minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#f5f0e8",
//       background:"#08070b",overflowX:"hidden",position:"relative",
//     }}>

//       {/* Background radial glows */}
//       <div style={{
//         position:"fixed",top:"-10%",right:"-5%",width:600,height:600,
//         borderRadius:"50%",pointerEvents:"none",zIndex:0,
//         background:"radial-gradient(circle,rgba(201,168,76,.1) 0%,transparent 65%)",
//         animation:"glowPulse 8s ease-in-out infinite",
//       }}/>
//       <div style={{
//         position:"fixed",bottom:"10%",left:"-10%",width:500,height:500,
//         borderRadius:"50%",pointerEvents:"none",zIndex:0,
//         background:"radial-gradient(circle,rgba(201,168,76,.06) 0%,transparent 65%)",
//         animation:"glowPulse 11s 2s ease-in-out infinite",
//       }}/>

//       {/* Grain */}
//       <div style={{
//         position:"fixed",inset:0,pointerEvents:"none",zIndex:0,opacity:.025,
//         backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
//         backgroundSize:"200px 200px",
//       }}/>

//       {/* Top accent rule */}
//       <div style={{
//         position:"absolute",top:0,left:0,right:0,height:1,zIndex:1,
//         background:`linear-gradient(90deg,transparent,${ACCENT}50,transparent)`,
//       }}/>

//       <div className="pp-wrap" style={{
//         maxWidth:1220,margin:"0 auto",padding:"0 48px",
//         position:"relative",zIndex:2,
//       }}>

//         {/* ── HERO ── */}
//         <header style={{padding:"108px 0 60px",borderBottom:`1px solid ${BORDER}`}}>

//           <Link to="/" className="back-lnk fu">
//             <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//               <polyline points="15 18 9 12 15 6"/>
//             </svg>
//             Home
//           </Link>

//           {/* Eyebrow */}
//           <div className="fu1" style={{
//             display:"flex",alignItems:"center",gap:14,margin:"32px 0 22px",
//           }}>
//             <div style={{
//               width:38,height:38,borderRadius:"50%",
//               border:`1px solid ${ACCENT}45`,flexShrink:0,
//               display:"flex",alignItems:"center",justifyContent:"center",
//             }}>
//               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8">
//                 <rect x="3" y="11" width="18" height="11" rx="2"/>
//                 <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
//               </svg>
//             </div>
//             <div style={{display:"flex",alignItems:"center",gap:10}}>
//               <span style={{fontSize:9,letterSpacing:".55em",color:`${ACCENT}80`,textTransform:"uppercase"}}>Legal</span>
//               <span style={{width:3,height:3,borderRadius:"50%",background:`${ACCENT}40`,display:"inline-block"}}/>
//               <span style={{fontSize:9,letterSpacing:".55em",color:"rgba(255,255,255,.25)",textTransform:"uppercase"}}>Privacy Policy</span>
//             </div>
//           </div>

//           {/* Title */}
//           <h1 className="hero-h fu1" style={{
//             fontFamily:"'Playfair Display',serif",
//             fontSize:"clamp(52px,8.5vw,104px)",fontWeight:400,
//             letterSpacing:"-.025em",lineHeight:.88,
//             color:"#f5f0e8",marginBottom:28,
//           }}>
//             Privacy
//             <br/>
//             <em style={{
//               fontStyle:"italic",
//               background:`linear-gradient(90deg,${ACCENT},${ACCENT}90,#fff8e0,${ACCENT})`,
//               backgroundSize:"300% auto",
//               WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
//               animation:"shimmer 5s linear infinite",
//             }}>Policy.</em>
//           </h1>

//           <div className="fu2" style={{display:"flex",flexWrap:"wrap",gap:10}}>
//             {["Effective January 2025","10 Sections","GDPR Aligned"].map(tag=>(
//               <span key={tag} style={{
//                 fontSize:9,letterSpacing:".3em",textTransform:"uppercase",
//                 padding:"6px 14px",border:"1px solid rgba(255,255,255,.08)",
//                 borderRadius:2,color:"rgba(255,255,255,.28)",
//               }}>{tag}</span>
//             ))}
//           </div>
//         </header>

//         {/* ── TWO-COLUMN LAYOUT ── */}
//         <div className="pp-layout" style={{
//           display:"grid",gridTemplateColumns:"200px 1fr",
//           paddingBottom:100,
//         }}>

//           {/* TOC */}
//           <aside className="pp-toc" style={{
//             paddingTop:50,paddingRight:24,
//             position:"sticky",top:76,height:"fit-content",alignSelf:"start",
//           }}>
//             <p style={{
//               fontSize:8.5,letterSpacing:".5em",textTransform:"uppercase",
//               color:"rgba(255,255,255,.18)",marginBottom:10,paddingLeft:14,
//             }}>Contents</p>
//             {SECTIONS.map(s=>(
//               <button key={s.id} className={`toc-btn${active===s.id?" on":""}`}
//                 onClick={()=>go(s.id)}>
//                 <span className="toc-num">{s.n}</span>
//                 {s.t}
//               </button>
//             ))}
//             <div style={{marginTop:32,paddingLeft:14,paddingTop:22,borderTop:`1px solid ${BORDER}`}}>
//               <p style={{fontSize:8.5,letterSpacing:".3em",textTransform:"uppercase",
//                 color:"rgba(255,255,255,.16)",marginBottom:10}}>See also</p>
//               <Link to="/terms" style={{
//                 fontFamily:"'DM Sans',sans-serif",fontSize:10.5,letterSpacing:".18em",
//                 textTransform:"uppercase",color:`${ACCENT}55`,textDecoration:"none",
//                 transition:"color .2s",
//               }}
//                 onMouseEnter={e=>e.currentTarget.style.color=ACCENT}
//                 onMouseLeave={e=>e.currentTarget.style.color=`${ACCENT}55`}>
//                 Terms of Service →
//               </Link>
//             </div>
//           </aside>

//           {/* BODY */}
//           <main className="pp-body" style={{
//             paddingTop:50,paddingLeft:56,
//             borderLeft:`1px solid ${BORDER}`,
//           }}>
//             {DATA.map((sec,si)=>(
//               <div key={sec.id} id={sec.id} className="reveal"
//                 style={{
//                   padding:"42px 0",
//                   borderBottom:`1px solid ${BORDER}`,
//                   transitionDelay:`${si*.04}s`,
//                 }}>

//                 {/* Section header row */}
//                 <div style={{display:"flex",gap:18,alignItems:"flex-start",marginBottom:28}}>
//                   <span style={{
//                     fontFamily:"'Playfair Display',serif",fontSize:11,
//                     color:`${ACCENT}38`,letterSpacing:".05em",
//                     paddingTop:5,minWidth:24,flexShrink:0,
//                   }}>{SECTIONS[si].n}</span>

//                   <div style={{flex:1}}>
//                     <h2 style={{
//                       fontFamily:"'Playfair Display',serif",fontSize:25,fontWeight:400,
//                       color:"#f5f0e8",letterSpacing:"-.01em",marginBottom:10,
//                     }}>{SECTIONS[si].t}</h2>
//                     <div style={{
//                       height:1,
//                       background:`linear-gradient(90deg,${ACCENT}65,transparent)`,
//                     }}/>
//                   </div>
//                 </div>

//                 {/* Cards grid */}
//                 <div className="item-grid" style={{
//                   paddingLeft:42,
//                   display:"grid",
//                   gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
//                   gap:12,
//                 }}>
//                   {sec.items.map((item,ii)=>(
//                     <div key={ii} className="item-card">
//                       <p style={{
//                         fontSize:9,letterSpacing:".32em",textTransform:"uppercase",
//                         color:ACCENT,fontWeight:500,marginBottom:8,
//                       }}>{item.h}</p>
//                       <p style={{
//                         fontFamily:"'Playfair Display',serif",
//                         fontSize:14.5,lineHeight:1.78,
//                         color:"rgba(255,255,255,.42)",fontStyle:"italic",
//                       }}>{item.b}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             {/* Closing stamp */}
//             <div style={{
//               marginTop:48,padding:"28px 32px",
//               background:`linear-gradient(120deg,rgba(201,168,76,.07),rgba(201,168,76,.02))`,
//               border:`1px solid ${ACCENT}22`,borderRadius:4,
//               display:"flex",gap:18,alignItems:"flex-start",
//             }}>
//               <div style={{
//                 width:38,height:38,borderRadius:"50%",flexShrink:0,
//                 border:`1px solid ${ACCENT}40`,
//                 display:"flex",alignItems:"center",justifyContent:"center",
//               }}>
//                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8">
//                   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
//                 </svg>
//               </div>
//               <p style={{
//                 fontFamily:"'Playfair Display',serif",fontSize:15,fontStyle:"italic",
//                 color:"rgba(255,255,255,.28)",lineHeight:1.85,
//               }}>
//                 By using our site you acknowledge this Privacy Policy.
//                 Questions? <a href="mailto:privacy@yourfragrancebrand.com"
//                   style={{color:ACCENT,textDecoration:"none"}}>
//                   privacy@yourfragrancebrand.com
//                 </a>
//               </p>
//             </div>
//           </main>
//         </div>
//       </div>

//       <div style={{height:1,background:`linear-gradient(90deg,transparent,${ACCENT}18,transparent)`}}/>
//     </div>
//   </>);
// }