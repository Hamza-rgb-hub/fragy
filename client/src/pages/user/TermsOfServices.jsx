import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ACCENT = "#c9a84c";

import "../../Style/tos.css";

// ── Particles ─────────────────────────────────────────────────────────────────
const Particles = () => (
  <>
    {[...Array(5)].map((_,i) => (
      <div key={i} style={{
        position:"absolute", width:i%2===0?3:2, height:i%2===0?3:2,
        borderRadius:"50%", background:ACCENT, opacity:0.18+(i%3)*0.07,
        top:`${8+i*16}%`, left:`${6+(i%3)*28}%`,
        animation:`floatP${i%3} ${2.5+i*0.4}s ease-in-out infinite`,
        animationDelay:`${i*0.4}s`, pointerEvents:"none",
      }}/>
    ))}
  </>
);

// ── Scroll spy ────────────────────────────────────────────────────────────────
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const handler = () => {
      for (let i=ids.length-1; i>=0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 140) { setActive(ids[i]); return; }
      }
      setActive(ids[0]);
    };
    window.addEventListener("scroll", handler, { passive:true });
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);
  return active;
}

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

function RichText({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <p style={{
      fontFamily:"'Cormorant Garamond',serif",
      fontSize:17, lineHeight:1.85,
      color:"rgba(255,255,255,0.42)", marginBottom:16,
    }}>
      {parts.map((p,i) =>
        i%2===1
          ? <span key={i} style={{ color:"rgba(255,255,255,0.7)", fontWeight:500 }}>{p}</span>
          : <span key={i}>{p}</span>
      )}
    </p>
  );
}

// ── TOC sections ──────────────────────────────────────────────────────────────
const SECTIONS = [
  { id:"t1",  num:"01", title:"Acceptance of Terms" },
  { id:"t2",  num:"02", title:"Eligibility" },
  { id:"t3",  num:"03", title:"Products & Descriptions" },
  { id:"t4",  num:"04", title:"Ordering & Payment" },
  { id:"t5",  num:"05", title:"Shipping & Delivery" },
  { id:"t6",  num:"06", title:"Returns & Exchanges" },
  { id:"t7",  num:"07", title:"Intellectual Property" },
  { id:"t8",  num:"08", title:"Prohibited Conduct" },
  { id:"t9",  num:"09", title:"Disclaimer of Warranties" },
  { id:"t10", num:"10", title:"Limitation of Liability" },
  { id:"t11", num:"11", title:"Governing Law" },
  { id:"t12", num:"12", title:"Contact" },
];

const CONTENT = [
  {
    id:"t1", title:"Acceptance of Terms",
    body:[
      `By accessing or using this website, placing an order, or creating an account, you confirm that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.`,
      `These Terms form a legally binding agreement between you and [Your Brand Name] ("we", "our", or "the Boutique"). If you do not agree to these Terms, you must cease using our site immediately.`,
      `We reserve the right to update these Terms at any time. Material changes will be communicated by email and/or a prominent site notice. Continued use following notification constitutes acceptance of the revised Terms.`,
    ]
  },
  {
    id:"t2", title:"Eligibility",
    body:[
      `Our site and services are available exclusively to individuals aged 18 years or older. By using our site, you represent and warrant that you meet this age requirement.`,
      `You also represent that you are not prohibited from receiving our products under any applicable law — including import/export regulations in your country of residence.`,
      `We reserve the right to refuse service, cancel orders, or close accounts at our discretion if we have reason to believe eligibility requirements are not met.`,
    ]
  },
  {
    id:"t3", title:"Products & Descriptions",
    body:[
      `We endeavour to present our fragrances with the utmost accuracy — including names, notes, concentrations, bottle sizes, and imagery. However, minor variations in colour, packaging design, or bottle shape may occur between different production batches.`,
      `**Product Availability:** All products are subject to availability. We reserve the right to limit quantities, discontinue products, or update listings without prior notice.`,
      `**Pricing:** All prices are displayed in the currency shown on site. Prices are subject to change. The price charged will be the price displayed at the time your order is confirmed, except in the case of obvious pricing errors, in which case we will contact you before processing.`,
      `**Fragrance Notes:** Scent descriptions are provided as guidance. Individual perception of fragrance varies — notes may present differently on different skin types. We are unable to accept returns solely on the basis of scent preference unless the product is demonstrably faulty.`,
    ]
  },
  {
    id:"t4", title:"Ordering & Payment",
    body:[
      `Placing an order constitutes an offer to purchase. A binding contract is formed only when you receive an order confirmation email from us.`,
      `We reserve the right to decline any order for reasons including but not limited to: product unavailability, suspected fraud, pricing errors, or shipping restrictions to your location.`,
      `**Accepted Payment Methods:** We accept major credit/debit cards, JazzCash, EasyPaisa, and cash on delivery (where available). All card transactions are processed via PCI DSS-compliant payment gateways — we do not store your card details.`,
      `**Order Modifications:** Once an order has been confirmed and passed to fulfilment, we cannot guarantee modifications. Contact us immediately at orders@yourfragrancebrand.com and we will make every reasonable effort to assist.`,
    ]
  },
  {
    id:"t5", title:"Shipping & Delivery",
    body:[
      `We ship to addresses within Pakistan and internationally to select destinations. Shipping costs and estimated delivery windows are displayed at checkout before payment is taken.`,
      `**Delivery Estimates:** Timeframes are estimates and not guarantees. Delays may occur due to courier operations, customs clearance, weather, or other factors outside our control. We are not liable for delays beyond our reasonable control.`,
      `**Risk of Loss:** Risk of loss or damage passes to you upon delivery to the address provided at checkout. If a delivery is marked as completed but you have not received your order, please contact us within 48 hours.`,
      `**Customs & Import Duties:** For international orders, you are responsible for all customs duties, import taxes, and brokerage fees imposed by your country. We have no control over these charges.`,
      `**Incorrect Addresses:** We are not responsible for orders delivered to an incorrect address provided by the customer. Re-delivery costs will be borne by the customer.`,
    ]
  },
  {
    id:"t6", title:"Returns & Exchanges",
    body:[
      `We want you to love every fragrance you receive. If something is not right, we are here to help.`,
      `**Damaged or Faulty Items:** If you receive a damaged, defective, or incorrect item, contact us within 7 days of delivery with photographic evidence. We will arrange a replacement or full refund at no cost to you.`,
      `**Sealed Products:** For hygiene and quality assurance, we cannot accept returns of fragrances whose original seals have been broken or that have been opened, unless the product is faulty.`,
      `**Unopened Items:** Unopened, sealed products in original packaging may be returned within 14 days of delivery for a full refund, excluding original shipping costs. Return shipping is at the customer's expense unless the return is due to our error.`,
      `**Refund Processing:** Approved refunds are processed within 7 business days of receiving the returned item. Refunds are issued to the original payment method.`,
      `To initiate a return, email returns@yourfragrancebrand.com with your order number and reason for return.`,
    ]
  },
  {
    id:"t7", title:"Intellectual Property",
    body:[
      `All content on this site — including but not limited to text, fragrance descriptions, photography, graphics, logos, the site's design and layout, and software — is the exclusive property of [Your Brand Name] or its licensors and is protected by applicable intellectual property laws.`,
      `You may not reproduce, distribute, modify, publicly display, or create derivative works from any site content without our prior written consent.`,
      `**User Content:** If you submit reviews, photographs, or other content, you grant us a non-exclusive, royalty-free, worldwide licence to use, reproduce, and display that content in connection with our products and services.`,
    ]
  },
  {
    id:"t8", title:"Prohibited Conduct",
    body:[
      `You agree not to use our site or services in any manner that:`,
      `**Violates Laws:** Breaches any applicable local, national, or international law or regulation.`,
      `**Is Fraudulent:** Involves false identity, payment fraud, chargeback abuse, or unauthorised use of another person's account or payment method.`,
      `**Disrupts Services:** Attempts to interfere with, hack, probe, or damage our systems, servers, or networks.`,
      `**Infringes Rights:** Infringes the intellectual property, privacy, or other rights of any person.`,
      `**Is Abusive:** Sends unsolicited communications, spam, or engages in conduct that is harassing, threatening, or harmful to our team or other customers.`,
      `Violation of these prohibitions may result in immediate account suspension, order cancellation, and, where appropriate, referral to law enforcement.`,
    ]
  },
  {
    id:"t9", title:"Disclaimer of Warranties",
    body:[
      `Our site and its contents are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, to the fullest extent permitted by law.`,
      `We do not warrant that the site will be uninterrupted, error-free, or free of viruses or other harmful components. We do not warrant the accuracy, completeness, or fitness for a particular purpose of any content on the site.`,
      `Nothing in these Terms limits statutory rights you may hold as a consumer under applicable law.`,
    ]
  },
  {
    id:"t10", title:"Limitation of Liability",
    body:[
      `To the maximum extent permitted by applicable law, [Your Brand Name] and its directors, employees, and agents shall not be liable for any indirect, incidental, consequential, punitive, or special damages arising out of or in connection with your use of our site or products.`,
      `Our total aggregate liability to you for any claim arising under these Terms shall not exceed the amount you paid for the specific order giving rise to the claim.`,
      `Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions, our liability is limited to the fullest extent permitted by law.`,
    ]
  },
  {
    id:"t11", title:"Governing Law",
    body:[
      `These Terms of Service are governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.`,
      `Any dispute arising from or relating to these Terms or your use of our site shall first be subject to good-faith negotiation. If unresolved, disputes shall be submitted to the exclusive jurisdiction of the courts of [Your City], Pakistan.`,
      `If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.`,
    ]
  },
  {
    id:"t12", title:"Contact",
    body:[
      `For questions about these Terms of Service, please contact us:`,
      `**Email:** legal@yourfragrancebrand.com`,
      `**Customer Service:** support@yourfragrancebrand.com`,
      `**Post:** Legal Department, [Your Brand Name], [Your Address], Pakistan`,
      `We aim to respond to all legal enquiries within 5 business days.`,
    ]
  },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function TermsOfService() {
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
        background:"linear-gradient(160deg, #070507 0%, #0e0c0e 40%, #150f12 100%)",
        color:"#f5f0e8", fontFamily:"'Jost',sans-serif",
        position:"relative", overflowX:"hidden",
      }}>
        <Particles />

        {/* Ambient glows — slightly different position for visual variety */}
        <div style={{
          position:"absolute", top:"12%", left:"12%",
          width:500, height:500, borderRadius:"50%",
          background:ACCENT, opacity:0.06, filter:"blur(130px)",
          pointerEvents:"none", animation:"pulse 6s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute", bottom:"15%", right:"8%",
          width:300, height:300, borderRadius:"50%",
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
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"clamp(48px,8vw,96px)", fontWeight:300,
              letterSpacing:"-0.02em", lineHeight:0.93,
              color:"#f5f0e8", marginBottom:22,
            }}>
              Terms of<br/>
              <em style={{ fontStyle:"italic", color:ACCENT }}>Service</em>
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
                fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
              }}>
                The art of the accord — between us and you.
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
                <Link to="/privacy" style={{
                  fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase",
                  color:`${ACCENT}70`, textDecoration:"none", transition:"color 0.2s",
                  display:"flex", alignItems:"center", gap:8,
                }}
                  onMouseEnter={e=>e.currentTarget.style.color=ACCENT}
                  onMouseLeave={e=>e.currentTarget.style.color=`${ACCENT}70`}
                >
                  Privacy Policy →
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
                  <div style={{ display:"flex", alignItems:"flex-start", gap:18, marginBottom:24 }}>
                    <span style={{
                      fontFamily:"'Cormorant Garamond',serif",
                      fontSize:13, fontWeight:400, color:`${ACCENT}50`,
                      letterSpacing:"0.1em", paddingTop:6, minWidth:28,
                    }}>
                      {SECTIONS[si].num}
                    </span>
                    <div style={{ flex:1 }}>
                      <h2 style={{
                        fontFamily:"'Cormorant Garamond',serif",
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

                  <div style={{ paddingLeft:46 }}>
                    {sec.body.map((para, pi) => <RichText key={pi} text={para} />)}
                  </div>
                </div>
              ))}

              {/* Bottom agreement stamp */}
              <div style={{
                marginTop:52, padding:"28px 32px",
                background:"rgba(201,168,76,0.04)",
                border:`1px solid ${ACCENT}20`,
                clipPath:"polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))",
              }}>
                <p style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:15, fontStyle:"italic",
                  color:"rgba(255,255,255,0.3)", lineHeight:1.8,
                }}>
                  By placing an order or using our site, you confirm your acceptance of these Terms. For questions, contact us at{" "}
                  <a href="mailto:legal@yourfragrancebrand.com"
                    style={{ color:ACCENT, textDecoration:"none" }}>
                    legal@yourfragrancebrand.com
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
