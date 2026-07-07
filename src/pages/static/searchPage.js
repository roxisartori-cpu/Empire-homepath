const searchPage = {
  title: "Empire HomePath — Find Your Programs",
  css: `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:        #0A1628;
  --ink-deep:   #060E1C;
  --ink-mid:    #102038;
  --ink-lift:   #16284A;
  --ink-hover:  #1C3158;
  --gold:       #C9A84C;
  --gold-warm:  #DDB85C;
  --gold-dim:   rgba(201,168,76,0.12);
  --gold-rule:  rgba(201,168,76,0.22);
  --white:      #FFFFFF;
  --body:       rgba(255,255,255,0.62);
  --muted:      rgba(255,255,255,0.32);
  --border:     rgba(201,168,76,0.16);
  --border-mid: rgba(201,168,76,0.28);
  --success:    #4ADE80;
  --warning:    #FBB924;
  --danger:     #FF5C5C;
}

html{scroll-behavior:smooth;}
body{
  font-family:'Inter',sans-serif;
  background:var(--ink);
  color:var(--white);
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}

/* ══ NAV ══ */
nav{
  position:fixed;top:0;left:0;right:0;z-index:100;
  height:72px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 64px;
  background:rgba(6,14,28,0.97);
  backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
}
.nav-logo{
  text-decoration:none;
  font-size:20px;font-weight:700;
  letter-spacing:0.01em;
  color:var(--white);
}
.nav-logo span{color:var(--gold);}
.nav-links{display:flex;align-items:center;gap:32px;list-style:none;}
.nav-links a{
  font-size:12px;font-weight:500;
  letter-spacing:0.1em;text-transform:uppercase;
  color:var(--muted);text-decoration:none;
  transition:color 0.2s;
}
.nav-links a:hover{color:var(--white);}
.nav-right{display:flex;align-items:center;gap:12px;}
.btn-signin{
  font-size:12px;font-weight:500;letter-spacing:0.06em;
  color:var(--body);text-decoration:none;
  padding:8px 20px;border-radius:5px;
  border:1px solid rgba(255,255,255,0.08);
  transition:all 0.2s;
}
.btn-signin:hover{color:var(--white);border-color:var(--border-mid);}
.btn-demo{
  font-size:12px;font-weight:700;
  letter-spacing:0.1em;text-transform:uppercase;
  color:var(--ink-deep);text-decoration:none;
  padding:10px 26px;border-radius:5px;
  background:var(--gold);
  transition:all 0.2s;
}
.btn-demo:hover{background:var(--gold-warm);}

/* ══ PAGE LAYOUT ══ */
.page-wrap{
  padding-top:72px;
  min-height:100vh;
  display:grid;
  grid-template-columns:420px 1fr;
  grid-template-rows:auto 1fr;
}

/* ══ PAGE HEADER ══ */
.page-header{
  grid-column:1/-1;
  padding:44px 64px 36px;
  background:var(--ink-deep);
  border-bottom:1px solid var(--border);
  position:relative;
  overflow:hidden;
}
.page-header::before{
  content:'';position:absolute;
  top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--gold) 30%,var(--gold) 70%,transparent);
  opacity:0.4;
}
.page-header::after{
  content:'';position:absolute;
  bottom:-1px;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
  opacity:0.15;
}
.header-eyebrow{
  font-family:'DM Mono',monospace;
  font-size:10px;font-weight:500;
  letter-spacing:0.18em;text-transform:uppercase;
  color:var(--gold);opacity:0.8;
  margin-bottom:10px;
  display:flex;align-items:center;gap:12px;
}
.header-eyebrow::before{content:'';display:block;width:24px;height:1px;background:var(--gold);}
.page-title{
  font-size:clamp(26px,3vw,38px);
  font-weight:800;letter-spacing:-0.02em;
  color:var(--white);margin-bottom:6px;
}
.page-title span{color:var(--gold);}
.page-subtitle{
  font-size:14px;font-weight:400;
  color:var(--body);line-height:1.65;
  max-width:560px;
}
.header-note{
  margin-top:14px;
  display:inline-flex;align-items:center;gap:8px;
  padding:7px 16px;
  background:var(--gold-dim);
  border:1px solid var(--border-mid);
  border-radius:20px;
  font-size:11px;font-weight:500;
  color:var(--gold);
}

/* ══ LEFT PANEL — FORM ══ */
.form-panel{
  background:var(--ink-deep);
  border-right:1px solid var(--border);
  padding:32px;
  overflow-y:auto;
  position:sticky;
  top:72px;
  max-height:calc(100vh - 72px);
}
.form-section-title{
  font-size:15px;font-weight:700;
  color:var(--white);
  margin-bottom:20px;
  padding-bottom:12px;
  border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:10px;
}
.form-section-title::before{
  content:'';display:block;
  width:3px;height:16px;
  background:var(--gold);border-radius:2px;
}

.field-group{
  display:flex;flex-direction:column;gap:6px;
  margin-bottom:16px;
}
.field-label{
  font-family:'DM Mono',monospace;
  font-size:10px;font-weight:500;
  letter-spacing:0.14em;text-transform:uppercase;
  color:var(--gold);opacity:0.8;
}
.field-hint{
  font-size:11px;font-weight:400;
  color:var(--muted);margin-top:2px;
}
.select-wrap{position:relative;}
.select-wrap::after{
  content:'▾';position:absolute;
  right:14px;top:50%;transform:translateY(-50%);
  color:var(--gold);font-size:13px;pointer-events:none;
}
.field-select,.field-input{
  width:100%;
  background:var(--ink-mid);
  border:1px solid var(--border-mid);
  color:var(--white);
  padding:12px 16px;border-radius:6px;
  font-size:13px;font-weight:400;
  font-family:'Inter',sans-serif;
  transition:border-color 0.2s,box-shadow 0.2s;
  appearance:none;-webkit-appearance:none;
}
.field-select:focus,.field-input:focus{
  outline:none;
  border-color:var(--gold);
  box-shadow:0 0 0 3px rgba(201,168,76,0.12);
}
.field-select option{background:var(--ink-mid);color:var(--white);}
.field-input::placeholder{color:var(--muted);}

/* Toggle group */
.toggle-group{
  display:flex;gap:8px;flex-wrap:wrap;
}
.toggle-btn{
  padding:8px 16px;
  border:1px solid var(--border-mid);
  background:transparent;
  color:var(--muted);
  font-size:12px;font-weight:500;
  border-radius:5px;cursor:pointer;
  font-family:'Inter',sans-serif;
  transition:all 0.2s;
  white-space:nowrap;
}
.toggle-btn:hover{border-color:var(--gold);color:var(--body);}
.toggle-btn.active{
  background:var(--gold-dim);
  border-color:var(--gold);
  color:var(--gold);
  font-weight:600;
}

.form-divider{
  height:1px;background:var(--border);
  margin:20px 0;
}

.btn-search{
  width:100%;
  padding:15px;
  background:var(--gold);color:var(--ink-deep);
  font-size:13px;font-weight:700;
  letter-spacing:0.1em;text-transform:uppercase;
  border:none;border-radius:6px;cursor:pointer;
  font-family:'Inter',sans-serif;
  transition:all 0.25s;
  display:flex;align-items:center;justify-content:center;gap:10px;
  margin-top:8px;
}
.btn-search:hover{background:var(--gold-warm);transform:translateY(-1px);}
.btn-search svg{transition:transform 0.2s;}
.btn-search:hover svg{transform:translateX(3px);}

.btn-reset{
  width:100%;
  padding:10px;
  background:transparent;
  border:1px solid var(--border);
  color:var(--muted);
  font-size:11px;font-weight:500;
  letter-spacing:0.06em;text-transform:uppercase;
  border-radius:6px;cursor:pointer;
  font-family:'Inter',sans-serif;
  transition:all 0.2s;
  margin-top:8px;
}
.btn-reset:hover{border-color:var(--border-mid);color:var(--body);}

/* ══ RIGHT PANEL — RESULTS ══ */
.results-panel{
  padding:32px;
  overflow-y:auto;
}

/* Empty / loading states */
.results-empty{
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:80px 40px;
  text-align:center;
  gap:16px;
}
.empty-icon{
  width:72px;height:72px;
  border-radius:50%;
  background:var(--gold-dim);
  border:1px solid var(--border-mid);
  display:flex;align-items:center;justify-content:center;
  font-size:28px;
}
.empty-title{
  font-size:18px;font-weight:700;
  color:var(--white);
}
.empty-sub{
  font-size:13px;font-weight:400;
  color:var(--muted);line-height:1.65;
  max-width:320px;
}

.results-loading{
  display:none;
  flex-direction:column;
  align-items:center;justify-content:center;
  padding:80px 40px;gap:20px;
}
.loading-spinner{
  width:40px;height:40px;
  border:3px solid var(--border-mid);
  border-top-color:var(--gold);
  border-radius:50%;
  animation:spin 0.8s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg);}}
.loading-text{
  font-size:14px;font-weight:500;
  color:var(--body);
  font-family:'DM Mono',monospace;
  letter-spacing:0.06em;
}

/* Results header */
.results-header{
  display:none;
  align-items:flex-start;justify-content:space-between;
  gap:16px;margin-bottom:20px;
  padding-bottom:20px;
  border-bottom:1px solid var(--border);
  flex-wrap:wrap;
}
.results-summary{
  flex:1;
}
.results-count-big{
  font-size:28px;font-weight:900;
  color:var(--gold);letter-spacing:-0.02em;
  line-height:1;margin-bottom:4px;
}
.results-count-label{
  font-size:13px;font-weight:400;
  color:var(--body);
}
.results-county-tag{
  display:flex;align-items:center;gap:8px;
  padding:8px 16px;
  background:var(--gold-dim);
  border:1px solid var(--border-mid);
  border-radius:20px;
  font-size:12px;font-weight:600;
  color:var(--gold);
  white-space:nowrap;
}

/* Filter pills */
.results-filters{
  display:none;
  align-items:center;gap:8px;
  margin-bottom:20px;
  flex-wrap:wrap;
}
.results-filter-label{
  font-family:'DM Mono',monospace;
  font-size:9px;font-weight:500;
  letter-spacing:0.14em;text-transform:uppercase;
  color:var(--muted);margin-right:4px;
}
.filter-pill{
  padding:6px 14px;border-radius:20px;
  border:1px solid var(--border-mid);
  color:var(--muted);background:transparent;
  font-size:11px;font-weight:500;
  cursor:pointer;transition:all 0.2s;
  font-family:'Inter',sans-serif;
}
.filter-pill:hover{border-color:var(--gold);color:var(--body);}
.filter-pill.active{
  background:var(--gold-dim);
  border-color:var(--gold);
  color:var(--gold);font-weight:600;
}

/* Program cards */
.program-list{
  display:flex;flex-direction:column;gap:12px;
}
.prog-card{
  background:var(--ink-mid);
  border:1px solid var(--border);
  border-radius:8px;
  padding:22px 24px;
  position:relative;
  overflow:hidden;
  transition:all 0.2s;
  cursor:pointer;
}
.prog-card::before{
  content:'';
  position:absolute;left:0;top:0;bottom:0;
  width:3px;background:var(--gold);
  transform:scaleY(0);transform-origin:top;
  transition:transform 0.25s;
}
.prog-card:hover{background:var(--ink-lift);border-color:var(--border-mid);}
.prog-card:hover::before{transform:scaleY(1);}
.prog-card.expanded{border-color:var(--gold);background:var(--ink-lift);}
.prog-card.expanded::before{transform:scaleY(1);}

.prog-top{
  display:grid;
  grid-template-columns:1fr auto;
  gap:16px;align-items:start;
}
.prog-name{
  font-size:15px;font-weight:700;
  color:var(--white);margin-bottom:6px;
  line-height:1.3;
}
.prog-tags{
  display:flex;align-items:center;gap:10px;
  flex-wrap:wrap;
}
.prog-type-tag{
  font-family:'DM Mono',monospace;
  font-size:9px;font-weight:500;
  letter-spacing:0.1em;text-transform:uppercase;
  color:var(--gold);opacity:0.7;
}
.prog-income{
  font-size:12px;font-weight:400;
  color:var(--muted);
}
.prog-forgivable{
  font-size:11px;font-weight:600;
  color:var(--success);
}
.prog-right{
  display:flex;flex-direction:column;
  align-items:flex-end;gap:8px;
}
.prog-amount{
  font-size:20px;font-weight:900;
  color:var(--gold);letter-spacing:-0.02em;
  white-space:nowrap;
}
.prog-status{
  display:flex;align-items:center;gap:5px;
  font-size:10px;font-weight:600;
  letter-spacing:0.04em;
  padding:4px 10px;border-radius:20px;
  white-space:nowrap;
}
.prog-status.open{
  background:rgba(74,222,128,0.12);
  color:var(--success);
  border:1px solid rgba(74,222,128,0.25);
}
.prog-status.limited{
  background:rgba(251,185,36,0.12);
  color:var(--warning);
  border:1px solid rgba(251,185,36,0.25);
}
.status-dot{width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;}

/* Expanded detail */
.prog-detail{
  display:none;
  border-top:1px solid var(--border);
  margin-top:18px;
  padding-top:18px;
  animation:fadeIn 0.25s ease;
}
.prog-card.expanded .prog-detail{display:block;}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}

.detail-cols{
  display:grid;grid-template-columns:1fr 1fr;
  gap:20px;
}
.detail-section-label{
  font-family:'DM Mono',monospace;
  font-size:9px;font-weight:500;
  letter-spacing:0.14em;text-transform:uppercase;
  color:var(--gold);opacity:0.65;
  margin-bottom:10px;
}
.detail-facts{display:flex;flex-direction:column;gap:0;}
.detail-fact{
  display:flex;justify-content:space-between;
  align-items:flex-start;gap:12px;
  padding:8px 0;
  border-bottom:1px solid rgba(201,168,76,0.08);
  font-size:12px;
}
.detail-fact:last-child{border-bottom:none;}
.fact-key{color:var(--muted);flex-shrink:0;}
.fact-val{color:var(--white);font-weight:600;text-align:right;}
.fact-val.green{color:var(--success);}
.fact-val.gold{color:var(--gold);}

.elig-list{display:flex;flex-direction:column;gap:7px;}
.elig-item{
  display:flex;align-items:flex-start;gap:8px;
  font-size:12px;font-weight:400;
  color:var(--body);line-height:1.5;
}
.elig-check{color:var(--success);font-weight:700;flex-shrink:0;}

.prog-cta{
  margin-top:16px;
  display:flex;align-items:center;gap:12px;
  flex-wrap:wrap;
}
.btn-contact{
  padding:10px 24px;
  background:var(--gold);color:var(--ink-deep);
  font-size:11px;font-weight:700;
  letter-spacing:0.1em;text-transform:uppercase;
  border:none;border-radius:5px;cursor:pointer;
  font-family:'Inter',sans-serif;
  transition:all 0.2s;text-decoration:none;
  display:inline-block;
}
.btn-contact:hover{background:var(--gold-warm);}
.btn-save{
  padding:10px 20px;
  background:transparent;
  border:1px solid var(--border-mid);
  color:var(--body);
  font-size:11px;font-weight:600;
  letter-spacing:0.08em;text-transform:uppercase;
  border-radius:5px;cursor:pointer;
  font-family:'Inter',sans-serif;
  transition:all 0.2s;
}
.btn-save:hover{border-color:var(--gold);color:var(--gold);}
.prog-agency{
  font-size:11px;font-weight:400;
  color:var(--muted);
  font-style:italic;
}

/* Match score badge */
.match-badge{
  position:absolute;top:14px;right:14px;
  width:36px;height:36px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-family:'DM Mono',monospace;
  font-size:10px;font-weight:700;
  border:1.5px solid;
}
.match-high{background:rgba(74,222,128,0.1);color:var(--success);border-color:rgba(74,222,128,0.3);}
.match-med{background:rgba(201,168,76,0.1);color:var(--gold);border-color:var(--border-mid);}

/* HUD note */
.hud-note{
  margin-top:20px;
  padding:16px 20px;
  background:var(--ink-mid);
  border:1px solid var(--border);
  border-left:3px solid var(--gold);
  border-radius:0 6px 6px 0;
  display:none;
}
.hud-note-label{
  font-family:'DM Mono',monospace;
  font-size:9px;font-weight:500;
  letter-spacing:0.14em;text-transform:uppercase;
  color:var(--gold);opacity:0.7;margin-bottom:6px;
}
.hud-note-text{
  font-size:12px;font-weight:400;
  color:var(--body);line-height:1.65;
}
.hud-note-text strong{color:var(--white);}

/* Pro gate */
.pro-gate{
  display:none;
  margin-top:20px;
  background:var(--ink-mid);
  border:1px solid var(--border-mid);
  border-radius:8px;
  padding:24px;
  text-align:center;
}
.pro-gate-title{
  font-size:16px;font-weight:700;
  color:var(--white);margin-bottom:8px;
}
.pro-gate-sub{
  font-size:13px;font-weight:400;
  color:var(--body);line-height:1.65;
  margin-bottom:20px;
  max-width:360px;margin-left:auto;margin-right:auto;
}
.btn-subscribe{
  padding:12px 32px;
  background:var(--gold);color:var(--ink-deep);
  font-size:12px;font-weight:700;
  letter-spacing:0.1em;text-transform:uppercase;
  border:none;border-radius:5px;cursor:pointer;
  font-family:'Inter',sans-serif;
  transition:all 0.2s;
}
.btn-subscribe:hover{background:var(--gold-warm);}

/* ══ RESPONSIVE ══ */
@media(max-width:1024px){
  nav{padding:0 24px;}
  .page-wrap{grid-template-columns:1fr;}
  .page-header{padding:28px 24px 24px;}
  .form-panel{
    position:static;max-height:none;
    border-right:none;
    border-bottom:1px solid var(--border);
    padding:24px;
  }
  .results-panel{padding:24px;}
}
@media(max-width:600px){
  .nav-links{display:none;}
  .prog-top{grid-template-columns:1fr;}
  .prog-right{flex-direction:row;align-items:center;margin-top:8px;}
  .detail-cols{grid-template-columns:1fr;}
  .toggle-group{gap:6px;}
  .toggle-btn{padding:7px 12px;font-size:11px;}
}`,
  html: `<!-- NAV -->
<nav>
  <a href="/" class="nav-logo">Empire<span>Home</span>Path</a>
  <ul class="nav-links"><li><a href="/#why">Why It Works</a></li><li><a href="/#features">Features</a></li><li><a href="/#who">Who It's For</a></li><li><a href="/#pricing">Pricing</a></li></ul>
  <div class="nav-right">
    <a href="#" class="btn-signin">Sign In</a>
    <a href="/demo" class="btn-demo">Live Demo</a>
  </div>
</nav>

<!-- PAGE WRAP -->
<div class="page-wrap">

  <!-- PAGE HEADER -->
  <div class="page-header">
    <div class="header-eyebrow">Program Search</div>
    <h1 class="page-title">Find Programs for <span>Your Buyer</span></h1>
    <p class="page-subtitle">Answer a few quick questions to match your client to every verified homebuyer assistance program available in their county. No jargon, no fine print.</p>
    <div class="header-note">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#C9A84C" stroke-width="1.2"/><path d="M6 5v4M6 3.5v.5" stroke="#C9A84C" stroke-width="1.2" stroke-linecap="round"/></svg>
      Powered by Empire HomePath data across all 62 NY counties · Updated June 2026
    </div>
  </div>

  <!-- FORM PANEL -->
  <div class="form-panel">
    <div class="form-section-title">Tell Us About Your Buyer</div>

    <!-- County -->
    <div class="field-group">
      <div class="field-label">County They're Buying In</div>
      <div class="select-wrap">
        <select class="field-select" id="f-county">
          <option value="">— Select a county —</option>
          <option value="albany">Albany County</option>
          <option value="allegany">Allegany County</option>
          <option value="bronx">Bronx County</option>
          <option value="broome">Broome County</option>
          <option value="cattaraugus">Cattaraugus County</option>
          <option value="cayuga">Cayuga County</option>
          <option value="chautauqua">Chautauqua County</option>
          <option value="chemung">Chemung County</option>
          <option value="chenango">Chenango County</option>
          <option value="clinton">Clinton County</option>
          <option value="columbia">Columbia County</option>
          <option value="cortland">Cortland County</option>
          <option value="delaware">Delaware County</option>
          <option value="dutchess">Dutchess County</option>
          <option value="erie">Erie County</option>
          <option value="essex">Essex County</option>
          <option value="franklin">Franklin County</option>
          <option value="fulton">Fulton County</option>
          <option value="genesee">Genesee County</option>
          <option value="greene">Greene County</option>
          <option value="hamilton">Hamilton County</option>
          <option value="herkimer">Herkimer County</option>
          <option value="jefferson">Jefferson County</option>
          <option value="kings">Kings County (Brooklyn)</option>
          <option value="lewis">Lewis County</option>
          <option value="livingston">Livingston County</option>
          <option value="madison">Madison County</option>
          <option value="monroe">Monroe County</option>
          <option value="montgomery">Montgomery County</option>
          <option value="nassau">Nassau County</option>
          <option value="new_york">New York County (Manhattan)</option>
          <option value="niagara">Niagara County</option>
          <option value="oneida">Oneida County</option>
          <option value="onondaga">Onondaga County</option>
          <option value="ontario">Ontario County</option>
          <option value="orange">Orange County</option>
          <option value="orleans">Orleans County</option>
          <option value="oswego">Oswego County</option>
          <option value="otsego">Otsego County</option>
          <option value="putnam">Putnam County</option>
          <option value="queens">Queens County</option>
          <option value="rensselaer">Rensselaer County</option>
          <option value="richmond">Richmond County (Staten Island)</option>
          <option value="rockland">Rockland County</option>
          <option value="st_lawrence">St. Lawrence County</option>
          <option value="saratoga">Saratoga County</option>
          <option value="schenectady">Schenectady County</option>
          <option value="schoharie">Schoharie County</option>
          <option value="schuyler">Schuyler County</option>
          <option value="seneca">Seneca County</option>
          <option value="steuben">Steuben County</option>
          <option value="suffolk">Suffolk County</option>
          <option value="sullivan">Sullivan County</option>
          <option value="tioga">Tioga County</option>
          <option value="tompkins">Tompkins County</option>
          <option value="ulster">Ulster County</option>
          <option value="warren">Warren County</option>
          <option value="washington">Washington County</option>
          <option value="wayne">Wayne County</option>
          <option value="westchester">Westchester County</option>
          <option value="wyoming">Wyoming County</option>
          <option value="yates">Yates County</option>
        </select>
      </div>
    </div>

    <!-- City / Town -->
    <div class="field-group">
      <div class="field-label">City or Town (Optional)</div>
      <input type="text" class="field-input" id="f-city" placeholder="e.g. Newburgh, White Plains…"/>
      <div class="field-hint">Helps match city-specific programs</div>
    </div>

    <div class="form-divider"></div>

    <!-- Household Income -->
    <div class="field-group">
      <div class="field-label">Household Income</div>
      <div class="select-wrap">
        <select class="field-select" id="f-income">
          <option value="">— Select income range —</option>
          <option value="under40">Under $40,000</option>
          <option value="40to60">$40,000 – $60,000</option>
          <option value="60to80">$60,000 – $80,000</option>
          <option value="80to100">$80,000 – $100,000</option>
          <option value="100to120">$100,000 – $120,000</option>
          <option value="120to150">$120,000 – $150,000</option>
          <option value="over150">Over $150,000</option>
        </select>
      </div>
    </div>

    <!-- Purchase Price -->
    <div class="field-group">
      <div class="field-label">Estimated Purchase Price</div>
      <div class="select-wrap">
        <select class="field-select" id="f-price">
          <option value="">— Select price range —</option>
          <option value="under150">Under $150,000</option>
          <option value="150to250">$150,000 – $250,000</option>
          <option value="250to350">$250,000 – $350,000</option>
          <option value="350to500">$350,000 – $500,000</option>
          <option value="500to750">$500,000 – $750,000</option>
          <option value="over750">Over $750,000</option>
        </select>
      </div>
    </div>

    <div class="form-divider"></div>

    <!-- Buyer Type -->
    <div class="field-group">
      <div class="field-label">Buyer Status</div>
      <div class="field-hint" style="margin-bottom:8px;">Select all that apply</div>
      <div class="toggle-group" id="buyerTypeGroup">
        <button class="toggle-btn" data-val="firsttime" onclick="toggleBtn(this,'buyerTypeGroup')">First-Time Buyer</button>
        <button class="toggle-btn" data-val="veteran" onclick="toggleBtn(this,'buyerTypeGroup')">Veteran</button>
        <button class="toggle-btn" data-val="teacher" onclick="toggleBtn(this,'buyerTypeGroup')">Educator</button>
        <button class="toggle-btn" data-val="lowmod" onclick="toggleBtn(this,'buyerTypeGroup')">Low-Mod Income</button>
        <button class="toggle-btn" data-val="disability" onclick="toggleBtn(this,'buyerTypeGroup')">Disability</button>
      </div>
    </div>

    <!-- Household size -->
    <div class="field-group">
      <div class="field-label">Household Size</div>
      <div class="select-wrap">
        <select class="field-select" id="f-hhsize">
          <option value="">— Number of people —</option>
          <option value="1">1 person</option>
          <option value="2">2 people</option>
          <option value="3">3 people</option>
          <option value="4">4 people</option>
          <option value="5">5 people</option>
          <option value="6">6+ people</option>
        </select>
      </div>
    </div>

    <!-- Program types wanted -->
    <div class="field-group">
      <div class="field-label">Program Types Interested In</div>
      <div class="field-hint" style="margin-bottom:8px;">Leave blank to show all</div>
      <div class="toggle-group" id="progTypeGroup">
        <button class="toggle-btn" data-val="grant" onclick="toggleBtn(this,'progTypeGroup')">Grants</button>
        <button class="toggle-btn" data-val="dpa" onclick="toggleBtn(this,'progTypeGroup')">Down Payment</button>
        <button class="toggle-btn" data-val="forgivable" onclick="toggleBtn(this,'progTypeGroup')">Forgivable</button>
        <button class="toggle-btn" data-val="rate" onclick="toggleBtn(this,'progTypeGroup')">Rate Buydown</button>
      </div>
    </div>

    <div class="form-divider"></div>

    <button class="btn-search" onclick="runSearch()">
      Find Matching Programs
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button class="btn-reset" onclick="resetSearch()">Clear All Filters</button>
  </div>

  <!-- RESULTS PANEL -->
  <div class="results-panel" id="resultsPanel">

    <!-- Empty state -->
    <div class="results-empty" id="stateEmpty">
      <div class="empty-icon">🔑</div>
      <div class="empty-title">Ready to search</div>
      <div class="empty-sub">Select a county and household income to find every matching homebuyer assistance program in seconds.</div>
    </div>

    <!-- Loading state -->
    <div class="results-loading" id="stateLoading">
      <div class="loading-spinner"></div>
      <div class="loading-text">Searching programs…</div>
    </div>

    <!-- Results header -->
    <div class="results-header" id="resultsHeader">
      <div class="results-summary">
        <div class="results-count-big" id="rCountBig">0</div>
        <div class="results-count-label" id="rCountLabel">Programs found</div>
      </div>
      <div class="results-county-tag" id="rCountyTag">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1Z" stroke="#C9A84C" stroke-width="1.2"/><circle cx="6" cy="4.5" r="1.2" stroke="#C9A84C" stroke-width="1.2"/></svg>
        <span id="rCountyName">—</span>
      </div>
    </div>

    <!-- Filter pills -->
    <div class="results-filters" id="resultsFilters">
      <span class="results-filter-label">Filter:</span>
      <div class="filter-pill active" onclick="filterResults('all',this)">All</div>
      <div class="filter-pill" onclick="filterResults('grant',this)">Grants</div>
      <div class="filter-pill" onclick="filterResults('dpa',this)">Down Payment</div>
      <div class="filter-pill" onclick="filterResults('forgivable',this)">Forgivable</div>
      <div class="filter-pill" onclick="filterResults('rate',this)">Rate Programs</div>
    </div>

    <!-- HUD note -->
    <div class="hud-note" id="hudNote">
      <div class="hud-note-label">Important — HUD First-Time Buyer Definition</div>
      <div class="hud-note-text">Your buyer may qualify as a <strong>first-time homebuyer</strong> even if they've owned before — the HUD definition includes anyone who has <strong>not owned a primary residence in the past 3 years.</strong> This opens eligibility to many more programs.</div>
    </div>

    <!-- Program list -->
    <div class="program-list" id="programList"></div>

    <!-- Pro gate (shown after 3 results) -->
    <div class="pro-gate" id="proGate">
      <div class="pro-gate-title">🔒 Unlock All <span id="gateCount">0</span> Programs</div>
      <div class="pro-gate-sub">You're seeing a preview. Subscribe to Empire HomePath to access every verified program with full eligibility details, contact information, and PDF export.</div>
      <button class="btn-subscribe" onclick="__spaNavigate('/#pricing'">View Subscription Plans</button>
    </div>

  </div>
</div>`,
  scripts: `// ══ DATA ══
const countyNames = {
  albany:'Albany',allegany:'Allegany',bronx:'Bronx',broome:'Broome',cattaraugus:'Cattaraugus',cayuga:'Cayuga',chautauqua:'Chautauqua',chemung:'Chemung',chenango:'Chenango',clinton:'Clinton',columbia:'Columbia',cortland:'Cortland',delaware:'Delaware',dutchess:'Dutchess',erie:'Erie',essex:'Essex',franklin:'Franklin',fulton:'Fulton',genesee:'Genesee',greene:'Greene',hamilton:'Hamilton',herkimer:'Herkimer',jefferson:'Jefferson',kings:'Kings (Brooklyn)',lewis:'Lewis',livingston:'Livingston',madison:'Madison',monroe:'Monroe',montgomery:'Montgomery',nassau:'Nassau',new_york:'New York (Manhattan)',niagara:'Niagara',oneida:'Oneida',onondaga:'Onondaga',ontario:'Ontario',orange:'Orange',orleans:'Orleans',oswego:'Oswego',otsego:'Otsego',putnam:'Putnam',queens:'Queens',rensselaer:'Rensselaer',richmond:'Richmond (Staten Island)',rockland:'Rockland',st_lawrence:'St. Lawrence',saratoga:'Saratoga',schenectady:'Schenectady',schoharie:'Schoharie',schuyler:'Schuyler',seneca:'Seneca',steuben:'Steuben',suffolk:'Suffolk',sullivan:'Sullivan',tioga:'Tioga',tompkins:'Tompkins',ulster:'Ulster',warren:'Warren',washington:'Washington',wayne:'Wayne',westchester:'Westchester',wyoming:'Wyoming',yates:'Yates'
};

// AMI income bands mapped to program eligibility thresholds
const incomeAMIMap = {
  under40:'50ami', 40to60:'80ami', 60to80:'80ami',
  80to100:'100ami', 100to120:'120ami', 120to150:'120ami', over150:'over120'
};

// Program database — keyed by county group, with statewide programs always added
const statewidePrograms = [
  { id:'s1', name:'SONYMA Low Interest Rate Mortgage', type:'rate', amount:'Below-market rate', incomeLimit:'115ami', status:'open', agency:'NYS Homes & Community Renewal', forgivable:false, eligibility:['Primary residence purchase only','Income at or below SONYMA county limits','Purchase price within SONYMA limits','Must use SONYMA-approved lender','Available in all 62 NY counties'], keyFacts:[{k:'Program Type',v:'Below-Market Mortgage'},{k:'Term',v:'30-year fixed'},{k:'Points',v:'Zero origination points'},{k:'Combined w/ DPA',v:'Yes — compatible'}], firsttime:false, veteran:false },
  { id:'s2', name:'SONYMA Achieving the Dream', type:'rate', amount:'Lowest available rate', incomeLimit:'115ami', status:'open', agency:'NYS Homes & Community Renewal', forgivable:false, eligibility:['Income at or below 80% AMI for county','First-time homebuyer required','Must complete homebuyer education','Minimum 640 credit score','Statewide availability'], keyFacts:[{k:'Program Type',v:'Low-Rate Mortgage'},{k:'Income Limit',v:'80% AMI'},{k:'First-Time Required',v:'Yes'},{k:'Paired DPA',v:'DPAL compatible'}], firsttime:true, veteran:false },
  { id:'s3', name:'SONYMA Down Payment Assistance Loan (DPAL)', type:'dpa', amount:'3% of mortgage (min $3,000)', incomeLimit:'115ami', status:'open', agency:'NYS Homes & Community Renewal', forgivable:false, eligibility:['Must be used with SONYMA first mortgage','No monthly payment while first mortgage is active','Repaid when first mortgage matures or property is sold','Income within SONYMA limits','Available in all 62 NY counties'], keyFacts:[{k:'Program Type',v:'Deferred DPA Loan'},{k:'Repayment',v:'Deferred — no monthly payment'},{k:'Amount',v:'3% of mortgage'},{k:'Paired With',v:'SONYMA first mortgage'}], firsttime:false, veteran:false },
  { id:'s4', name:'First Home Club (FHC) Grant', type:'grant', amount:'Up to $7,500', incomeLimit:'80ami', status:'open', agency:'Federal Home Loan Bank of NY', forgivable:false, eligibility:['Must open a First Home Club savings account','Earn 4:1 match on savings up to $1,875 saved','Income at or below 80% AMI','First-time homebuyer required','Available statewide via participating lenders'], keyFacts:[{k:'Program Type',v:'Matched Savings Grant'},{k:'Match Ratio',v:'4:1 on savings'},{k:'Max Award',v:'$7,500'},{k:'Required',v:'Participating lender enrollment'}], firsttime:true, veteran:false },
  { id:'s5', name:'USDA Rural Development Direct Loan', type:'dpa', amount:'100% financing — no down payment', incomeLimit:'80ami', status:'open', agency:'USDA Rural Development', forgivable:false, eligibility:['Must be purchasing in USDA-eligible rural area','Income at or below 80% AMI','No other adequate housing available','U.S. citizenship or permanent residency','Must intend to occupy as primary residence'], keyFacts:[{k:'Program Type',v:'Direct Mortgage Loan'},{k:'Down Payment',v:'None required'},{k:'Income Limit',v:'80% AMI'},{k:'Area Requirement',v:'USDA-eligible rural zones'}], firsttime:false, veteran:false },
  { id:'s6', name:'AccessAbility NY', type:'dpa', amount:'$4,000', incomeLimit:'none', status:'open', agency:'SONYMA', forgivable:false, eligibility:['Buyer or household member must have a disability','No income limit for this program','Must use SONYMA first mortgage','Primary residence purchase','Available statewide'], keyFacts:[{k:'Program Type',v:'DPA for Buyers w/ Disabilities'},{k:'Income Limit',v:'None'},{k:'Amount',v:'$4,000'},{k:'Requirement',v:'Disability documentation'}], firsttime:false, veteran:false, disability:true },
  { id:'s7', name:'Homes for Veterans Program', type:'rate', amount:'Below-market rate + DPA', incomeLimit:'115ami', status:'open', agency:'NYS Homes & Community Renewal', forgivable:false, eligibility:['Must be a U.S. military veteran','Honorable or general discharge required','Income within SONYMA limits','Primary residence purchase','Competitive interest rate below standard SONYMA rate'], keyFacts:[{k:'Program Type',v:'Veteran Mortgage + DPA'},{k:'Rate',v:'Below SONYMA standard rate'},{k:'Eligibility',v:'Honorable discharge veterans'},{k:'DPA Included',v:'Yes — DPAL compatible'}], firsttime:false, veteran:true },
];

const countyPrograms = {
  orange:[
    { id:'o1', name:'Orange County DPA Program', type:'dpa', amount:'$10,000', incomeLimit:'120ami', status:'open', agency:'Orange County Community Development', forgivable:true, eligibility:['Orange County purchase only','Income at or below 120% AMI','Complete HUD-approved counseling','Minimum 620 credit score','Not owned a primary residence in past 3 years'], keyFacts:[{k:'Program Type',v:'Deferred DPA Loan'},{k:'Forgiveness',v:'After 10 years occupancy'},{k:'Income Limit',v:'120% AMI'},{k:'Counseling',v:'Required before closing'}], firsttime:true, veteran:false },
    { id:'o2', name:'Orange County HOME DPA Grant', type:'grant', amount:'$15,000', incomeLimit:'80ami', status:'open', agency:'Orange County HOME Program', forgivable:false, eligibility:['Income at or below 80% AMI','First-time homebuyer required','Orange County purchase only','Property must pass inspection','Must complete pre-purchase counseling'], keyFacts:[{k:'Program Type',v:'Non-Repayable Grant'},{k:'Repayment',v:'None required'},{k:'Income Limit',v:'80% AMI'},{k:'Property Req.',v:'Inspection required'}], firsttime:true, veteran:false },
    { id:'o3', name:'City of Newburgh First Home Program', type:'forgivable', amount:'$20,000', incomeLimit:'100ami', status:'limited', agency:'City of Newburgh Housing Division', forgivable:true, eligibility:['Must purchase within City of Newburgh','Income at or below 100% AMI','Must remain primary residence 5 years for forgiveness','Minimum credit score 620','HUD-approved counseling required'], keyFacts:[{k:'Program Type',v:'Forgivable Loan'},{k:'Forgiveness',v:'100% after 5 years'},{k:'Income Limit',v:'100% AMI'},{k:'Contact',v:'City of Newburgh, (845) 569-7300'}], firsttime:false, veteran:false },
    { id:'o4', name:'City of Middletown Housing Grant', type:'grant', amount:'$5,000', incomeLimit:'80ami', status:'open', agency:'City of Middletown', forgivable:false, eligibility:['Must purchase within City of Middletown','Income at or below 80% AMI','Owner-occupied primary residence','Attend homebuyer education workshop','Purchase price within program limits'], keyFacts:[{k:'Program Type',v:'Direct Grant'},{k:'Repayment',v:'None'},{k:'Location',v:'Middletown city limits only'},{k:'Education',v:'Workshop required'}], firsttime:true, veteran:false },
  ],
  westchester:[
    { id:'w1', name:'Westchester HOMEownership Program', type:'dpa', amount:'$25,000', incomeLimit:'80ami', status:'open', agency:'Westchester County Dept. of Planning', forgivable:true, eligibility:['Westchester County purchase','Income at or below 80% AMI','First-time homebuyer or 3-year rule','Complete homebuyer counseling','Purchase price at or below program cap'], keyFacts:[{k:'Program Type',v:'Forgivable DPA Loan'},{k:'Forgiveness',v:'After 10 years occupancy'},{k:'Income Limit',v:'80% AMI'},{k:'Contact',v:'914-995-2444'}], firsttime:true, veteran:false },
    { id:'w2', name:'City of Yonkers Homebuyer Assistance', type:'forgivable', amount:'$20,000', incomeLimit:'80ami', status:'open', agency:'City of Yonkers Office of Housing', forgivable:true, eligibility:['Must purchase within City of Yonkers','Income at or below 80% AMI','Must remain as primary residence','HUD-approved counseling required','Property must meet habitability standards'], keyFacts:[{k:'Program Type',v:'Forgivable Loan'},{k:'Forgiveness',v:'5-year occupancy period'},{k:'Location',v:'Yonkers city limits'},{k:'Counseling',v:'Required'}], firsttime:false, veteran:false },
  ],
  nassau:[
    { id:'n1', name:'Nassau County First Home Club', type:'grant', amount:'$7,500', incomeLimit:'80ami', status:'open', agency:'Nassau County', forgivable:false, eligibility:['Must purchase in Nassau County','Income at or below 80% AMI','First-time homebuyer required','Participate in savings match program','Complete homebuyer education'], keyFacts:[{k:'Program Type',v:'Matched Savings Grant'},{k:'Income Limit',v:'80% AMI'},{k:'Match',v:'4:1 savings match'},{k:'Contact',v:'Nassau County Housing Authority'}], firsttime:true, veteran:false },
    { id:'n2', name:'Long Island Housing Partnership DPA', type:'dpa', amount:'$20,000', incomeLimit:'120ami', status:'open', agency:'Long Island Housing Partnership', forgivable:false, eligibility:['Long Island purchase (Nassau or Suffolk)','Income at or below 120% AMI','Must use LIHP-approved lender','Owner-occupied primary residence','Application via LIHP office'], keyFacts:[{k:'Program Type',v:'Deferred DPA Loan'},{k:'Income Limit',v:'120% AMI'},{k:'Repayment',v:'On sale or refinance'},{k:'Contact',v:'(631) 435-4710'}], firsttime:false, veteran:false },
  ],
  suffolk:[
    { id:'su1', name:'Suffolk County HOME DPA', type:'dpa', amount:'$14,000', incomeLimit:'80ami', status:'open', agency:'Suffolk County Community Development', forgivable:true, eligibility:['Must purchase in Suffolk County','Income at or below 80% AMI','First-time buyer or 3-year rule','HUD counseling required','Purchase price within limits'], keyFacts:[{k:'Program Type',v:'Forgivable DPA Loan'},{k:'Forgiveness',v:'After 5 years'},{k:'Income Limit',v:'80% AMI'},{k:'Contact',v:'Suffolk County Community Development'}], firsttime:true, veteran:false },
    { id:'su2', name:'Long Island Housing Partnership DPA', type:'dpa', amount:'$20,000', incomeLimit:'120ami', status:'open', agency:'Long Island Housing Partnership', forgivable:false, eligibility:['Long Island purchase (Nassau or Suffolk)','Income at or below 120% AMI','Must use LIHP-approved lender','Owner-occupied primary residence'], keyFacts:[{k:'Program Type',v:'Deferred DPA Loan'},{k:'Income Limit',v:'120% AMI'},{k:'Repayment',v:'On sale or refinance'},{k:'Contact',v:'(631) 435-4710'}], firsttime:false, veteran:false },
  ],
  albany:[
    { id:'a1', name:'City of Albany Community Dev. DPA', type:'dpa', amount:'$12,000', incomeLimit:'80ami', status:'open', agency:'City of Albany Community Development', forgivable:true, eligibility:['Purchase within City of Albany limits','Income at or below 80% AMI','Complete pre-purchase counseling','Minimum 620 credit score','Must remain as primary residence'], keyFacts:[{k:'Program Type',v:'Forgivable DPA'},{k:'Forgiveness',v:'After 5 years'},{k:'Income Limit',v:'80% AMI'},{k:'Contact',v:'Albany Community Development'}], firsttime:true, veteran:false },
    { id:'a2', name:'Albany County Housing HOME Program', type:'grant', amount:'$8,000', incomeLimit:'80ami', status:'open', agency:'Albany County', forgivable:false, eligibility:['Albany County purchase','Income at or below 80% AMI','First-time buyer or 3-year rule','Homebuyer education required','Property inspection required'], keyFacts:[{k:'Program Type',v:'Non-Repayable Grant'},{k:'Income Limit',v:'80% AMI'},{k:'Location',v:'Albany County'},{k:'Education',v:'Required'}], firsttime:true, veteran:false },
  ],
};

// Statewide fallback for counties without specific data
function getPrograms(county){ return countyPrograms[county] || []; }

// Income eligibility check
function incomeEligible(program, incomeBand){
  if(!incomeBand) return true;
  const ami = incomeAMIMap[incomeBand];
  if(program.incomeLimit === 'none') return true;
  const order = ['50ami','80ami','100ami','115ami','120ami','over120'];
  const buyerIdx = order.indexOf(ami);
  const progIdx = order.indexOf(program.incomeLimit);
  return buyerIdx <= progIdx;
}

// ══ STATE ══
let allResults = [];
let activeResultFilter = 'all';

// ══ TOGGLE BUTTONS ══
function toggleBtn(btn, groupId){
  btn.classList.toggle('active');
}

function getActiveToggles(groupId){
  return Array.from(document.querySelectorAll('#'+groupId+' .toggle-btn.active'))
    .map(b=>b.dataset.val);
}

// ══ SEARCH ══
function runSearch(){
  const county = document.getElementById('f-county').value;
  const income = document.getElementById('f-income').value;
  const price  = document.getElementById('f-price').value;
  const hhsize = document.getElementById('f-hhsize').value;
  const buyerTypes = getActiveToggles('buyerTypeGroup');
  const progTypes  = getActiveToggles('progTypeGroup');

  if(!county){
    document.getElementById('f-county').focus();
    document.getElementById('f-county').style.borderColor='var(--danger)';
    setTimeout(()=>document.getElementById('f-county').style.borderColor='',1500);
    return;
  }

  // Show loading
  showState('loading');
  document.getElementById('resultsPanel').scrollTop = 0;

  setTimeout(()=>{
    // Gather programs
    const specific = getPrograms(county);
    const all = [...specific, ...statewidePrograms];

    // Filter by income
    let filtered = income ? all.filter(p=>incomeEligible(p, income)) : all;

    // Filter by buyer type (additive — show if matches ANY selected)
    if(buyerTypes.length > 0){
      filtered = filtered.filter(p=>{
        if(buyerTypes.includes('veteran') && p.veteran) return true;
        if(buyerTypes.includes('disability') && p.disability) return true;
        if(buyerTypes.includes('firsttime') && (p.firsttime || !p.firsttime)) return true; // firsttime flag = preferred, but others still show
        return true; // always show statewide programs unless specifically restricted
      });
    }

    // Filter by program type
    if(progTypes.length > 0){
      filtered = filtered.filter(p=>progTypes.includes(p.type));
    }

    // Deduplicate by id
    const seen = new Set();
    filtered = filtered.filter(p=>{ if(seen.has(p.id))return false; seen.add(p.id); return true; });

    // Score for relevance — county-specific programs go first
    const specific_ids = new Set(specific.map(p=>p.id));
    filtered.sort((a,b)=>{
      const aSpec = specific_ids.has(a.id) ? 0 : 1;
      const bSpec = specific_ids.has(b.id) ? 0 : 1;
      return aSpec - bSpec;
    });

    allResults = filtered;
    activeResultFilter = 'all';
    renderResults(county, filtered, buyerTypes);
  }, 900);
}

function renderResults(county, results, buyerTypes){
  const countyName = countyNames[county] || county;
  const specific_ids = new Set((countyPrograms[county]||[]).map(p=>p.id));

  document.getElementById('rCountBig').textContent = results.length;
  document.getElementById('rCountLabel').textContent = results.length === 1 ? 'Program found' : 'Programs found';
  document.getElementById('rCountyName').textContent = countyName + ' County';

  // HUD note — show if firsttime selected or income is moderate
  const hudNote = document.getElementById('hudNote');
  if(buyerTypes && !buyerTypes.includes('firsttime')){
    hudNote.style.display = 'block';
  } else {
    hudNote.style.display = 'none';
  }

  // Build cards
  const container = document.getElementById('programList');
  const PREVIEW_LIMIT = 3;
  const preview = results.slice(0, PREVIEW_LIMIT);
  const hidden = results.slice(PREVIEW_LIMIT);

  container.innerHTML = preview.map((p,i)=>buildCard(p, specific_ids.has(p.id), true)).join('') +
    hidden.map(p=>buildCard(p, specific_ids.has(p.id), false)).join('');

  // Pro gate
  const gate = document.getElementById('proGate');
  if(hidden.length > 0){
    document.getElementById('gateCount').textContent = results.length;
    gate.style.display = 'block';
  } else {
    gate.style.display = 'none';
  }

  showState('results');

  // Reset filter pills
  document.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active'));
  document.querySelector('.filter-pill').classList.add('active');
}

function buildCard(p, isSpecific, isVisible){
  const typeLabel = {dpa:'Down Payment Assistance',grant:'Grant',forgivable:'Forgivable Loan',rate:'Rate Program'}[p.type]||p.type;
  const matchClass = isSpecific ? 'match-high' : 'match-med';
  const matchText  = isSpecific ? '✓' : '~';

  const factsHtml = p.keyFacts.map(f=>\`
    <div class="detail-fact">
      <span class="fact-key">\${f.k}</span>
      <span class="fact-val \${f.v.includes('None')||f.v.includes('No ')?"green":f.k==='Amount'||f.k==='Max Award'?"gold":""}">\${f.v}</span>
    </div>\`).join('');

  const eligHtml = p.eligibility.map(e=>\`
    <div class="elig-item"><span class="elig-check">✓</span>\${e}</div>\`).join('');

  const visibility = isVisible ? '' : 'style="filter:blur(4px);pointer-events:none;user-select:none;"';

  return \`
    <div class="prog-card" id="card-\${p.id}" onclick="toggleCard('\${p.id}')" \${visibility}>
      <div class="prog-top">
        <div>
          <div class="prog-name">\${p.name}</div>
          <div class="prog-tags">
            <span class="prog-type-tag">\${typeLabel}</span>
            <span class="prog-income">Income: \${p.incomeLimit === 'none' ? 'No limit' : '≤ '+p.incomeLimit.replace('ami',' AMI')}</span>
            \${p.forgivable ? '<span class="prog-forgivable">✓ Forgivable</span>' : ''}
          </div>
        </div>
        <div class="prog-right">
          <div class="prog-amount">\${p.amount}</div>
          <div class="prog-status \${p.status}">
            <span class="status-dot"></span>
            \${p.status==='open'?'Open':'Limited Funds'}
          </div>
        </div>
      </div>
      <div class="prog-detail">
        <div class="detail-cols">
          <div>
            <div class="detail-section-label">Program Facts</div>
            <div class="detail-facts">\${factsHtml}</div>
            <div class="detail-fact"><span class="fact-key">Administering Agency</span><span class="fact-val">\${p.agency}</span></div>
          </div>
          <div>
            <div class="detail-section-label">Eligibility Requirements</div>
            <div class="elig-list">\${eligHtml}</div>
          </div>
        </div>
        <div class="prog-cta">
          <a href="mailto:empirehomepath@gmail.com?subject=Program Inquiry: \${encodeURIComponent(p.name)}" class="btn-contact">Get Full Details</a>
          <button class="btn-save" onclick="event.stopPropagation()">Save to Report</button>
          <span class="prog-agency">Via \${p.agency}</span>
        </div>
      </div>
    </div>\`;
}

function toggleCard(id){
  const card = document.getElementById('card-'+id);
  const wasExpanded = card.classList.contains('expanded');
  document.querySelectorAll('.prog-card.expanded').forEach(c=>c.classList.remove('expanded'));
  if(!wasExpanded) card.classList.add('expanded');
}

// ══ FILTER RESULTS ══
function filterResults(type, el){
  document.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  activeResultFilter = type;
  const filtered = type==='all' ? allResults : allResults.filter(p=>p.type===type);
  const specific_ids = new Set((countyPrograms[document.getElementById('f-county').value]||[]).map(p=>p.id));
  document.getElementById('rCountBig').textContent = filtered.length;
  document.getElementById('rCountLabel').textContent = filtered.length===1?'Program found':'Programs found';
  const PREVIEW_LIMIT = 3;
  const container = document.getElementById('programList');
  container.innerHTML = filtered.slice(0,PREVIEW_LIMIT).map(p=>buildCard(p, specific_ids.has(p.id), true)).join('') +
    filtered.slice(PREVIEW_LIMIT).map(p=>buildCard(p, specific_ids.has(p.id), false)).join('');
  const gate = document.getElementById('proGate');
  if(filtered.length > PREVIEW_LIMIT){ document.getElementById('gateCount').textContent=filtered.length; gate.style.display='block'; }
  else gate.style.display='none';
}

// ══ STATE HELPERS ══
function showState(state){
  document.getElementById('stateEmpty').style.display   = state==='empty'   ? 'flex' : 'none';
  document.getElementById('stateLoading').style.display = state==='loading' ? 'flex' : 'none';
  document.getElementById('resultsHeader').style.display= state==='results' ? 'flex' : 'none';
  document.getElementById('resultsFilters').style.display=state==='results' ? 'flex' : 'none';
}

function resetSearch(){
  document.getElementById('f-county').value='';
  document.getElementById('f-city').value='';
  document.getElementById('f-income').value='';
  document.getElementById('f-price').value='';
  document.getElementById('f-hhsize').value='';
  document.querySelectorAll('.toggle-btn.active').forEach(b=>b.classList.remove('active'));
  document.getElementById('programList').innerHTML='';
  document.getElementById('proGate').style.display='none';
  document.getElementById('hudNote').style.display='none';
  allResults=[];
  showState('empty');
}

showState('empty');`,
};

export default searchPage;
