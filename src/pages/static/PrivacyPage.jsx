import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStaticPageScript } from './useStaticPageScript';

const PAGE_SCRIPTS = "";

const PrivacyPage = () => {
  const containerRef = useRef(null);
  useStaticPageScript({
    title: "Privacy Policy — Empire HomePath",
    scripts: PAGE_SCRIPTS,
    containerRef,
  });

  return (
    <div
      ref={containerRef}
      className="static-page-wrapper"
      style={{ minHeight: '100vh', background: '#0A1628' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#0A1628;--ink-deep:#060E1C;--ink-mid:#102038;--ink-lift:#16284A;
  --gold:#C9A84C;--gold-warm:#DDB85C;--gold-dim:rgba(201,168,76,0.12);
  --white:#FFFFFF;--body:rgba(255,255,255,0.65);--muted:rgba(255,255,255,0.35);
  --border:rgba(201,168,76,0.16);--border-mid:rgba(201,168,76,0.28);
}
html{scroll-behavior:smooth;}
body{font-family:'Inter',sans-serif;background:var(--ink);color:var(--white);-webkit-font-smoothing:antialiased;}

nav{
  position:fixed;top:0;left:0;right:0;z-index:100;height:72px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 64px;background:rgba(6,14,28,0.97);
  backdrop-filter:blur(20px);border-bottom:1px solid var(--border);
}
.nav-logo{text-decoration:none;font-size:20px;font-weight:700;color:var(--white);}
.nav-logo span{color:var(--gold);}
.btn-home{
  font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
  color:var(--body);text-decoration:none;padding:9px 22px;border-radius:5px;
  border:1px solid var(--border-mid);transition:all 0.2s;
}
.btn-home:hover{color:var(--white);border-color:var(--gold);}

.page{max-width:780px;margin:0 auto;padding:120px 40px 80px;}

.page-eyebrow{
  font-family:'DM Mono',monospace;font-size:10px;font-weight:500;
  letter-spacing:0.18em;text-transform:uppercase;color:var(--gold);opacity:0.8;
  margin-bottom:12px;display:flex;align-items:center;gap:12px;
}
.page-eyebrow::before{content:'';display:block;width:24px;height:1px;background:var(--gold);}
.page-title{font-size:clamp(28px,4vw,44px);font-weight:800;letter-spacing:-0.02em;margin-bottom:8px;}
.page-title span{color:var(--gold);}
.page-date{
  font-family:'DM Mono',monospace;font-size:11px;font-weight:500;
  letter-spacing:0.1em;color:var(--muted);margin-bottom:48px;
}

.section{margin-bottom:48px;}
.section-title{
  font-size:18px;font-weight:700;color:var(--white);
  margin-bottom:16px;padding-bottom:12px;
  border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:10px;
}
.section-title::before{content:'';display:block;width:3px;height:18px;background:var(--gold);border-radius:2px;}
.section p{font-size:14px;font-weight:400;line-height:1.85;color:var(--body);margin-bottom:14px;}
.section p:last-child{margin-bottom:0;}
.section ul{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:14px;}
.section ul li{
  font-size:14px;font-weight:400;line-height:1.75;color:var(--body);
  display:flex;align-items:flex-start;gap:10px;
}
.section ul li::before{content:'—';color:var(--gold);flex-shrink:0;font-weight:700;}
.section a{color:var(--gold);text-decoration:none;}
.section a:hover{text-decoration:underline;}

.highlight-box{
  background:var(--ink-mid);border:1px solid var(--border-mid);
  border-left:3px solid var(--gold);border-radius:0 6px 6px 0;
  padding:18px 22px;margin-bottom:20px;
}
.highlight-box p{color:var(--body);font-size:13px;line-height:1.75;margin:0;}

footer{
  background:var(--ink-deep);border-top:1px solid var(--border);
  padding:32px 64px;display:flex;align-items:center;
  justify-content:space-between;flex-wrap:wrap;gap:16px;
}
.footer-logo{font-size:16px;font-weight:700;color:var(--white);text-decoration:none;}
.footer-logo span{color:var(--gold);}
.footer-links{display:flex;gap:24px;list-style:none;flex-wrap:wrap;}
.footer-links a{font-size:12px;color:var(--muted);text-decoration:none;transition:color 0.2s;}
.footer-links a:hover{color:var(--gold);}
.footer-copy{font-size:11px;color:rgba(255,255,255,0.18);width:100%;padding-top:16px;border-top:1px solid rgba(255,255,255,0.04);}

@media(max-width:768px){
  nav{padding:0 24px;}
  .page{padding:100px 24px 60px;}
  footer{padding:28px 24px;}
}` }} />
      <div><nav>
        <Link to="/" className="nav-logo">Empire<span>Home</span>Path</Link>
        <Link to="/" className="btn-home">← Back to Home</Link>
      </nav>
      
      <div className="page">
      
        <div className="page-eyebrow">Legal</div>
        <h1 className="page-title">Privacy <span>Policy</span></h1>
        <div className="page-date">Effective Date: June 1, 2026 &nbsp;·&nbsp; Empire HomePath LLC</div>
      
        <div className="highlight-box">
          <p>This Privacy Policy describes how Empire HomePath LLC ("Empire HomePath," "we," "our," or "us") collects, uses, and protects information when you use our website and subscription platform at empirehomepath.com. By using our services, you agree to the practices described in this policy.</p>
        </div>
      
        <div className="section">
          <div className="section-title">1. Information We Collect</div>
          <p>We collect information you provide directly to us when you create an account, subscribe to a plan, or contact us. This may include:</p>
          <ul>
            <li>Name, email address, and professional title</li>
            <li>Business name, license number, and professional credentials</li>
            <li>Billing and payment information (processed securely through Stripe — we do not store full card numbers)</li>
            <li>Communications you send us via email or contact forms</li>
          </ul>
          <p>We also automatically collect certain technical information when you use our platform, including IP address, browser type, device information, pages visited, and time spent on the platform. This is used solely to improve the platform experience and ensure security.</p>
        </div>
      
        <div className="section">
          <div className="section-title">2. How We Use Your Information</div>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our platform and services</li>
            <li>Process your subscription payments and send billing receipts</li>
            <li>Send you service-related communications including account updates, data alerts, and program notifications</li>
            <li>Respond to your questions and support requests</li>
            <li>Monitor and analyze usage to improve platform performance</li>
            <li>Comply with legal obligations and enforce our Terms of Service</li>
          </ul>
          <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
        </div>
      
        <div className="section">
          <div className="section-title">3. Payment Processing</div>
          <p>All payment processing is handled by <strong style={{color: 'var(--white)'}}>Stripe, Inc.</strong>, a third-party payment processor. When you subscribe to Empire HomePath, your payment information is transmitted directly to Stripe and is subject to Stripe's own privacy policy, available at <a href="https://stripe.com/privacy" target="_blank">stripe.com/privacy</a>. Empire HomePath LLC does not store full credit card numbers or sensitive payment data on our servers.</p>
        </div>
      
        <div className="section">
          <div className="section-title">4. Data Sharing and Third Parties</div>
          <p>We may share your information with trusted third-party service providers who assist us in operating the platform, including:</p>
          <ul>
            <li><strong style={{color: 'var(--white)'}}>Stripe</strong> — payment processing and subscription management</li>
            <li><strong style={{color: 'var(--white)'}}>Vercel</strong> — website hosting and deployment</li>
            <li><strong style={{color: 'var(--white)'}}>Render</strong> — backend API hosting</li>
          </ul>
          <p>These providers are contractually obligated to protect your information and may only use it for the purposes we specify. We may also disclose your information if required by law, court order, or governmental authority.</p>
        </div>
      
        <div className="section">
          <div className="section-title">5. Data Retention</div>
          <p>We retain your account information for as long as your subscription is active and for a reasonable period thereafter for legal and business purposes. If you request deletion of your account, we will remove your personal information within 30 days, except where retention is required by law or for legitimate business purposes such as resolving disputes or enforcing our agreements.</p>
        </div>
      
        <div className="section">
          <div className="section-title">6. Security</div>
          <p>We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
        </div>
      
        <div className="section">
          <div className="section-title">7. Your Rights</div>
          <p>You have the right to access, correct, or request deletion of your personal information at any time. To exercise these rights, contact us at <a href="mailto:empirehomepath@gmail.com">empirehomepath@gmail.com</a>. We will respond to all requests within 30 days.</p>
        </div>
      
        <div className="section">
          <div className="section-title">8. Cookies</div>
          <p>Our platform uses cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze platform usage. You may disable cookies through your browser settings, but doing so may affect certain platform functionality.</p>
        </div>
      
        <div className="section">
          <div className="section-title">9. Changes to This Policy</div>
          <p>We may update this Privacy Policy from time to time. We will notify active subscribers of any material changes via email. Your continued use of the platform after changes take effect constitutes your acceptance of the revised policy.</p>
        </div>
      
        <div className="section">
          <div className="section-title">10. Contact Us</div>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p><strong style={{color: 'var(--white)'}}>Empire HomePath LLC</strong><br/>
          Email: <a href="mailto:empirehomepath@gmail.com">empirehomepath@gmail.com</a><br/>
          Website: <a href="https://empirehomepath.com">empirehomepath.com</a><br/>
          State of Formation: New York</p>
        </div>
      
      </div>
      
      <footer>
        <Link to="/" className="footer-logo">Empire<span>Home</span>Path</Link>
        <ul className="footer-links">
          <li><Link to="/terms">Terms of Service</Link></li>
          <li><Link to="/disclaimer">Disclaimer</Link></li>
          <li><Link to="/#pricing">Pricing</Link></li>
          <li><a href="mailto:empirehomepath@gmail.com">Contact</a></li>
        </ul>
        <div className="footer-copy">2026 Empire HomePath LLC · All rights reserved · empirehomepath.com · New York State</div>
      </footer></div>
    </div>
  );
};

export default PrivacyPage;
