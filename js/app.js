/* Phoenix Financial Services: site behaviour (no dependencies) */
(function () {
  'use strict';
  var cfg = window.PHOENIX_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------------- Formatting ---------------- */
  function inr(n) { return '₹' + Math.round(n || 0).toLocaleString('en-IN'); }
  function words(n) {
    if (n >= 1e7) return '₹' + trim(n / 1e7, 2) + ' Crore';
    if (n >= 1e5) return '₹' + trim(n / 1e5, 2) + ' Lakh';
    return '';
  }
  function short(n) {
    if (n >= 1e7) return '₹' + trim(n / 1e7, n >= 1e9 ? 0 : 1) + 'Cr';
    if (n >= 1e5) return '₹' + trim(n / 1e5, 1) + 'L';
    if (n >= 1e3) return '₹' + Math.round(n / 1e3) + 'K';
    return '₹' + Math.round(n);
  }
  function trim(x, d) { return String(parseFloat(x.toFixed(d))); }
  function fmtPhone(p) { return '+91 ' + p.slice(0, 5) + ' ' + p.slice(5); }

  /* ---------------- Contact details from config ---------------- */
  var waText = encodeURIComponent('Hello Phoenix Financial Services, I would like to know more about your services.');
  var waHref = 'https://wa.me/91' + cfg.whatsappNumber + '?text=' + waText;
  $$('.js-address').forEach(function (el) { el.textContent = cfg.address; });
  $$('.js-hours').forEach(function (el) { el.textContent = cfg.businessHours; });
  $$('.js-general-phone').forEach(function (el) { el.textContent = fmtPhone(cfg.generalPhone); el.href = 'tel:+91' + cfg.generalPhone; });
  $$('.js-general-phone-href').forEach(function (el) { el.href = 'tel:+91' + cfg.generalPhone; });
  $$('.js-grievance-phone').forEach(function (el) { el.textContent = fmtPhone(cfg.grievancePhone); el.href = 'tel:+91' + cfg.grievancePhone; });
  $$('.js-wa-link').forEach(function (el) { el.href = waHref; });
  $$('.js-wa-number').forEach(function (el) { el.textContent = fmtPhone(cfg.whatsappNumber); });
  $$('.js-email').forEach(function (el) { el.textContent = cfg.email; el.href = 'mailto:' + cfg.email; });
  $$('.js-email-grievance').forEach(function (el) { el.textContent = cfg.email; el.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent('Grievance'); });
  $('#year').textContent = new Date().getFullYear();

  /* ---------------- Theme ---------------- */
  var root = document.documentElement;
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    $$('.theme-toggle').forEach(function (b) { b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); });
    var m = $('meta[name="theme-color"]'); if (m) m.content = t === 'dark' ? '#120D0B' : '#FF8C42';
  }
  setTheme(root.getAttribute('data-theme') || 'light');
  $$('.theme-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(t); store('phoenix_theme', t);
    });
  });

  /* ---------------- Header, menu, nav ---------------- */
  var header = $('.site-header');
  var toTop = $('#to-top');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    toTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  var menuBtn = $('.menu-toggle'), menu = $('#mobile-menu');
  function setMenu(open) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  $$('#mobile-menu a, #mobile-menu button').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1180) setMenu(false); });

  var navLinks = $$('.main-nav a');
  if ('IntersectionObserver' in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        var map = { how: 'partners', why: 'services', faq: 'services' };
        var target = map[id] || id;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + target); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach(function (s) { navIO.observe(s); });

    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { revealIO.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- Loans ---------------- */
  var LOANS = [
    { name: 'Personal Loan', icon: 'user', cat: 'retail', tag: 'Minimal documentation', desc: 'Quick funds for weddings, travel, medical needs, education or debt consolidation.', limit: 'Up to ₹40 Lakh', tenure: 'Up to 5 years' },
    { name: 'Business Loan', icon: 'briefcase', cat: 'business', tag: 'Collateral-free options', desc: 'Capital to expand your business, buy machinery, manage vendors or grow your MSME.', limit: 'Up to ₹2 Crore', tenure: 'Up to 7 years' },
    { name: 'Home Loan', icon: 'home', cat: 'property', tag: 'Long repayment tenure', desc: 'Buy a flat, plot or house, build your own home or renovate at competitive rates.', limit: 'Up to ₹10 Crore', tenure: 'Up to 30 years' },
    { name: 'Loan Against Property (LAP)', icon: 'key', cat: 'property', tag: 'High loan value', desc: 'Unlock the value of your residential or commercial property at lower interest rates.', limit: 'Up to ₹15 Crore', tenure: 'Up to 15 years' },
    { name: 'Mortgage Loan', icon: 'landmark', cat: 'property', tag: 'Lower interest burden', desc: 'High-value secured funding against your property with flexible repayment.', limit: 'Based on property value', tenure: 'Up to 15 years' },
    { name: 'Pension Loan', icon: 'heart', cat: 'retail', tag: 'For pensioners', desc: 'Easy, hassle-free loans for Central, State and Defence pensioners.', limit: 'Based on pension credit', tenure: 'Up to 5 years' },
    { name: 'Working Capital Loan', icon: 'refresh', cat: 'business', tag: 'Smooth cash flow', desc: 'Keep daily operations running: inventory, salaries and seasonal demand.', limit: 'Based on turnover', tenure: '12 to 36 months' },
    { name: 'OD / CC Limit', icon: 'card', cat: 'business', tag: 'Pay interest on use', desc: 'Flexible overdraft and cash-credit limits. Interest only on the amount you use.', limit: 'Linked to stock & receivables', tenure: 'Annual renewal' },
    { name: 'Balance Transfer', icon: 'trending', cat: 'retail', tag: 'Save on interest', desc: 'Move your existing loan to a lower interest rate, with optional top-up.', limit: 'Outstanding + top-up', tenure: 'As per new lender' }
  ];
  var OTHER_SERVICES = ['Insurance Solutions', 'Mutual Funds & SIP', 'Retirement Planning', 'Financial Advisory', 'Business Advisory', 'Other Query'];

  var loanGrid = $('#loan-grid');
  loanGrid.innerHTML = LOANS.map(function (l) {
    return '<article class="card loan-card reveal" data-cat="' + l.cat + '">' +
      '<div class="loan-top"><span class="f-icon"><svg class="i"><use href="#i-' + l.icon + '"/></svg></span><span class="loan-tag">' + l.tag + '</span></div>' +
      '<h3>' + l.name + '</h3><p>' + l.desc + '</p>' +
      '<dl class="loan-meta"><div><dt>Indicative amount*</dt><dd>' + l.limit + '</dd></div><div><dt>Tenure</dt><dd>' + l.tenure + '</dd></div></dl>' +
      '<button type="button" class="btn btn-ghost btn-block js-enquire" data-product="' + l.name + '">Enquire Now <svg class="i"><use href="#i-arrow"/></svg></button>' +
      '</article>';
  }).join('');
  $$('#loan-grid .reveal').forEach(function (el) { if (window.IntersectionObserver) { revealIO.observe(el); } else el.classList.add('in'); });

  $$('#loan-filters .pill').forEach(function (p) {
    p.addEventListener('click', function () {
      $$('#loan-filters .pill').forEach(function (x) { x.classList.toggle('is-active', x === p); x.setAttribute('aria-selected', String(x === p)); });
      var f = p.dataset.filter;
      $$('.loan-card').forEach(function (c) { c.classList.toggle('is-hidden', f !== 'all' && c.dataset.cat !== f); c.classList.add('in'); });
    });
  });

  var opts = function (list) { return list.map(function (n) { return '<option>' + n.replace(/&/g, '&amp;') + '</option>'; }).join(''); };
  $('#emi-type').innerHTML = opts(LOANS.map(function (l) { return l.name; }));
  $('#c-product').innerHTML = '<option value="">Select a loan or service</option><optgroup label="Loans">' + opts(LOANS.map(function (l) { return l.name; })) + '</optgroup><optgroup label="Other services">' + opts(OTHER_SERVICES) + '</optgroup>';
  $('#footer-loans').innerHTML = LOANS.map(function (l) { return '<li><button type="button" class="link-plain js-enquire" data-product="' + l.name + '">' + l.name + '</button></li>'; }).join('');

  /* ---------------- Partners ---------------- */
  var CATS = { bank: 'Bank', hfc: 'Housing Finance', nbfc: 'NBFC & Fintech', mf: 'Mutual Fund', life: 'Life Insurance', general: 'General Insurance' };
  var PARTNERS = [
    ['State Bank of India', 'sbi', 'bank'], ['Punjab National Bank', 'pnb', 'bank'], ['Bank of India', 'bank-of-india', 'bank'],
    ['HDFC Bank', 'hdfc-bank', 'bank'], ['IDFC FIRST Bank', 'idfc-first-bank', 'bank'],
    ['GIC Housing Finance', 'gic-housing-finance', 'hfc'], ['Grihum Housing Finance', 'grihum-housing-finance', 'hfc'],
    ['Tata Capital Housing Finance', 'tata-capital-housing-finance', 'hfc'], ['Sammaan Capital', 'sammaan-capital', 'hfc'],
    ['Aditya Birla Capital', 'aditya-birla-capital', 'nbfc'], ['Cholamandalam Finance', 'cholamandalam-finance', 'nbfc'],
    ['FlexiLoans', 'flexiloans', 'nbfc'], ['FatakPay', 'fatakpay', 'nbfc'], ['WeRize', 'werize', 'nbfc'],
    ['SBI Mutual Fund', 'sbi-mutual-fund', 'mf'], ['HDFC Mutual Fund', 'hdfc-mutual-fund', 'mf'],
    ['ICICI Prudential Mutual Fund', 'icici-prudential-mutual-fund', 'mf'], ['Aditya Birla Sun Life Mutual Fund', 'aditya-birla-sun-life-mutual-fund', 'mf'],
    ['ICICI Prudential Life Insurance', 'icici-prudential-life', 'life'], ['Generali Central Life Insurance', 'generali-central-life', 'life'],
    ['IndusInd Nippon Life Insurance', 'indusind-nippon-life', 'life'],
    ['ICICI Lombard General Insurance', 'icici-lombard', 'general'], ['IndusInd General Insurance', 'indusind-general-insurance', 'general']
  ].map(function (p) { return { name: p[0], slug: p[1], cat: p[2] }; });

  function logoImg(p, lazy) {
    return '<img src="logos/' + p.slug + '.png" alt="' + p.name + ' logo" width="480" height="240"' + (lazy ? ' loading="lazy"' : '') + ' data-name="' + p.name + '">';
  }
  $('#marquee-track').innerHTML = PARTNERS.concat(PARTNERS).map(function (p) { return '<div class="marquee-item">' + logoImg(p, true) + '</div>'; }).join('');
  $('#partner-grid').innerHTML = PARTNERS.map(function (p) {
    return '<figure class="partner" data-cat="' + p.cat + '" style="margin:0"><div class="partner-logo">' + logoImg(p, true) + '</div><figcaption class="partner-name">' + p.name + '</figcaption></figure>';
  }).join('');
  // graceful fallback if a logo file is missing
  $$('.partner-logo img, .marquee-item img').forEach(function (img) {
    img.addEventListener('error', function () {
      var s = document.createElement('span'); s.className = 'partner-fallback'; s.textContent = img.dataset.name;
      img.replaceWith(s);
    }, { once: true });
  });
  var PF = [['all', 'All Partners (' + PARTNERS.length + ')'], ['bank', 'Banks'], ['hfc', 'Housing Finance'], ['nbfc', 'NBFCs & Fintech'], ['mf', 'Mutual Funds'], ['ins', 'Insurance']];
  $('#partner-filters').innerHTML = PF.map(function (f, i) { return '<button class="pill' + (i ? '' : ' is-active') + '" role="tab" aria-selected="' + (i ? 'false' : 'true') + '" data-filter="' + f[0] + '">' + f[1].replace('&', '&amp;') + '</button>'; }).join('');
  $$('#partner-filters .pill').forEach(function (p) {
    p.addEventListener('click', function () {
      $$('#partner-filters .pill').forEach(function (x) { x.classList.toggle('is-active', x === p); x.setAttribute('aria-selected', String(x === p)); });
      var f = p.dataset.filter;
      $$('.partner').forEach(function (c) {
        var cat = c.dataset.cat, show = f === 'all' || f === cat || (f === 'ins' && (cat === 'life' || cat === 'general'));
        c.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------------- Calculators ---------------- */
  // tabs
  var tabs = $$('#calculators .tab');
  function selectTab(t) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.classList.toggle('is-active', on); x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      $('#' + x.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; selectTab(n); n.focus();
    });
  });

  function fillRange(r) { var p = (r.value - r.min) / (r.max - r.min) * 100; r.style.setProperty('--p', p + '%'); }

  // Links a slider and its number box. isMoney → Indian comma formatting.
  function bind(rangeId, numId, isMoney, onChange) {
    var r = $('#' + rangeId), n = $('#' + numId);
    var show = function (v) { n.value = isMoney ? Math.round(v).toLocaleString('en-IN') : String(v); };
    var api = {
      get: function () { return parseFloat(r.value); },
      set: function (v) { r.value = v; fillRange(r); show(parseFloat(r.value)); },
      range: r
    };
    r.addEventListener('input', function () { fillRange(r); show(parseFloat(r.value)); onChange(); });
    n.addEventListener('input', function () {
      var raw = n.value.replace(isMoney ? /[^\d]/g : /[^\d.]/g, '');
      if (isMoney && raw) n.value = parseInt(raw, 10).toLocaleString('en-IN');
      var v = parseFloat(raw);
      if (!isNaN(v) && v >= +r.min && v <= +r.max) { r.value = v; fillRange(r); onChange(v); }
    });
    n.addEventListener('change', function () {
      var v = parseFloat(n.value.replace(/[^\d.]/g, ''));
      if (isNaN(v)) v = parseFloat(r.value);
      v = Math.min(+r.max, Math.max(+r.min, v));
      r.value = v; fillRange(r); show(parseFloat(r.value)); onChange(v);
    });
    n.addEventListener('keydown', function (e) { if (e.key === 'Enter') n.blur(); });
    fillRange(r); show(parseFloat(r.value));
    return api;
  }

  var NS = 'http://www.w3.org/2000/svg';
  function donut(svg, a, b, colorB, label) {
    var total = a + b, C = 2 * Math.PI * 46, pa = total ? a / total : 1;
    var pb = 1 - pa;
    svg.innerHTML =
      '<circle cx="60" cy="60" r="46" fill="none" stroke="var(--chart-track)" stroke-width="16"/>' +
      '<circle cx="60" cy="60" r="46" fill="none" stroke="var(--chart-a)" stroke-width="16" stroke-dasharray="' + (pa * C) + ' ' + C + '" transform="rotate(-90 60 60)"/>' +
      (pb > 0.0005 ? '<circle cx="60" cy="60" r="46" fill="none" stroke="' + colorB + '" stroke-width="16" stroke-dasharray="' + (pb * C) + ' ' + C + '" stroke-dashoffset="' + (-pa * C) + '" transform="rotate(-90 60 60)"/>' : '') +
      '<text x="60" y="57" text-anchor="middle" font-size="10" style="fill:var(--muted)">' + label + '</text>' +
      '<text x="60" y="73" text-anchor="middle" font-size="15" font-weight="800">' + Math.round(pb * 100) + '%</text>';
  }

  function growthChart(svg, rows) {
    // rows: [{year, invested, total}] starting at year 0
    var W = 320, H = 150, L = 40, R = 8, T = 10, B = 20;
    var maxY = Math.max.apply(null, rows.map(function (r) { return r.total; })) || 1;
    var n = rows.length - 1 || 1;
    var x = function (i) { return L + (W - L - R) * i / n; };
    var y = function (v) { return T + (H - T - B) * (1 - v / maxY); };
    var line = function (key) { return rows.map(function (r, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(r[key]).toFixed(1); }).join(' '); };
    var area = line('total') + ' L' + x(n) + ' ' + y(0) + ' L' + x(0) + ' ' + y(0) + ' Z';
    var grid = '', ticks = [0, 0.5, 1];
    ticks.forEach(function (t) {
      var v = maxY * t, yy = y(v);
      grid += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + yy + '" y2="' + yy + '" stroke="var(--border)" stroke-dasharray="3 3"/>' +
        '<text x="' + (L - 5) + '" y="' + (yy + 3) + '" text-anchor="end">' + (t ? short(v) : '0') + '</text>';
    });
    var last = rows[rows.length - 1].year, mid = Math.round(last / 2);
    var xl = [0, mid, last].filter(function (v, i, a) { return a.indexOf(v) === i; }).map(function (yr) {
      var i = rows.findIndex(function (r) { return r.year === yr; });
      return '<text x="' + x(i) + '" y="' + (H - 5) + '" text-anchor="' + (i === 0 ? 'start' : i === n ? 'end' : 'middle') + '">' + (yr === 0 ? 'Start' : 'Yr ' + yr) + '</text>';
    }).join('');
    var gid = svg.id + '-g';
    svg.innerHTML = '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--chart-c)" stop-opacity=".35"/><stop offset="1" stop-color="var(--chart-c)" stop-opacity="0"/></linearGradient></defs>' +
      grid + '<path d="' + area + '" fill="url(#' + gid + ')"/>' +
      '<path d="' + line('total') + '" fill="none" stroke="var(--chart-c)" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="' + line('invested') + '" fill="none" stroke="var(--chart-a)" stroke-width="2.5" stroke-dasharray="5 4" stroke-linejoin="round"/>' + xl;
  }

  // ---- EMI ----
  var emiUnit = 'years';
  var emi = {};
  emi.amount = bind('emi-amount', 'emi-amount-n', true, calcEMI);
  emi.rate = bind('emi-rate', 'emi-rate-n', false, calcEMI);
  emi.tenure = bind('emi-tenure', 'emi-tenure-n', false, calcEMI);
  var lastEmi = {};
  function calcEMI() {
    var P = emi.amount.get(), rate = emi.rate.get(), t = emi.tenure.get();
    var n = Math.round(emiUnit === 'years' ? t * 12 : t), r = rate / 1200;
    var E = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    var total = E * n, interest = total - P;
    $('#emi-out').textContent = inr(E);
    $('#emi-out-sub').textContent = 'per month for ' + n + ' months';
    $('#emi-principal').textContent = inr(P);
    $('#emi-interest').textContent = inr(interest);
    $('#emi-total').textContent = inr(total);
    $('#emi-amount-w').textContent = words(P);
    donut($('#emi-donut'), P, interest, 'var(--chart-b)', 'Interest');
    // yearly schedule
    var bal = P, rows = '', yp = 0, yi = 0;
    for (var m = 1; m <= n; m++) {
      var im = bal * r, pm = E - im; bal = Math.max(0, bal - pm); yp += pm; yi += im;
      if (m % 12 === 0 || m === n) {
        rows += '<tr><td>Year ' + Math.ceil(m / 12) + '</td><td>' + inr(yp) + '</td><td>' + inr(yi) + '</td><td>' + inr(bal) + '</td></tr>';
        yp = 0; yi = 0;
      }
    }
    $('#emi-table').innerHTML = rows;
    lastEmi = { P: P, rate: rate, n: n, E: E };
  }
  $$('.seg-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.unit === emiUnit) return;
      var cur = emi.tenure.get();
      emiUnit = b.dataset.unit;
      $$('.seg-btn').forEach(function (x) { var on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
      var r = emi.tenure.range;
      if (emiUnit === 'months') { r.min = 3; r.max = 360; r.step = 1; emi.tenure.set(Math.round(cur * 12)); $('#emi-tenure-unit').textContent = 'Mo'; $('#emi-tenure-min').textContent = '3 Mo'; $('#emi-tenure-max').textContent = '360 Mo'; }
      else { r.min = 1; r.max = 30; r.step = 1; emi.tenure.set(Math.min(30, Math.max(1, Math.round(cur / 12)))); $('#emi-tenure-unit').textContent = 'Yr'; $('#emi-tenure-min').textContent = '1 Yr'; $('#emi-tenure-max').textContent = '30 Yr'; }
      calcEMI();
    });
  });
  calcEMI();

  // ---- SIP ----
  var sip = {};
  sip.amount = bind('sip-amount', 'sip-amount-n', true, calcSIP);
  sip.rate = bind('sip-rate', 'sip-rate-n', false, calcSIP);
  sip.years = bind('sip-years', 'sip-years-n', false, calcSIP);
  sip.step = bind('sip-step', 'sip-step-n', false, calcSIP);
  function calcSIP() {
    var P = sip.amount.get(), i = sip.rate.get() / 1200, years = Math.round(sip.years.get()), s = sip.step.get() / 100;
    var bal = 0, inv = 0, rows = [{ year: 0, invested: 0, total: 0 }];
    for (var m = 1; m <= years * 12; m++) {
      var amt = P * Math.pow(1 + s, Math.floor((m - 1) / 12));
      inv += amt; bal = (bal + amt) * (1 + i);
      if (m % 12 === 0) rows.push({ year: m / 12, invested: inv, total: bal });
    }
    $('#sip-out').textContent = inr(bal);
    $('#sip-out-sub').textContent = (words(bal) ? words(bal) + ' · ' : '') + 'after ' + years + (years === 1 ? ' year' : ' years');
    $('#sip-invested').textContent = inr(inv);
    $('#sip-returns').textContent = inr(bal - inv);
    $('#sip-total').textContent = inr(bal);
    $('#sip-amount-w').textContent = words(P);
    donut($('#sip-donut'), inv, bal - inv, 'var(--chart-c)', 'Returns');
    growthChart($('#sip-chart'), rows);
  }
  calcSIP();

  // ---- Mutual fund (lumpsum) ----
  var mf = {};
  mf.amount = bind('mf-amount', 'mf-amount-n', true, calcMF);
  mf.rate = bind('mf-rate', 'mf-rate-n', false, calcMF);
  mf.years = bind('mf-years', 'mf-years-n', false, calcMF);
  function calcMF() {
    var P = mf.amount.get(), r = mf.rate.get() / 100, years = Math.round(mf.years.get());
    var rows = [];
    for (var y = 0; y <= years; y++) rows.push({ year: y, invested: P, total: P * Math.pow(1 + r, y) });
    var fv = rows[rows.length - 1].total;
    $('#mf-out').textContent = inr(fv);
    $('#mf-out-sub').textContent = (words(fv) ? words(fv) + ' · ' : '') + 'after ' + years + (years === 1 ? ' year' : ' years');
    $('#mf-invested').textContent = inr(P);
    $('#mf-returns').textContent = inr(fv - P);
    $('#mf-total').textContent = inr(fv);
    $('#mf-amount-w').textContent = words(P);
    donut($('#mf-donut'), P, fv - P, 'var(--chart-c)', 'Returns');
    growthChart($('#mf-chart'), rows);
  }
  calcMF();

  /* ---------------- Enquiry helpers ---------------- */
  var contactForm = $('#contact-form');
  function goToForm(product, extra) {
    var sel = $('#c-product');
    if (product) {
      var has = $$('option', sel).some(function (o) { return o.value === product || o.textContent === product; });
      if (has) sel.value = product;
    }
    contactForm.dataset.source = extra && extra.source ? extra.source : 'contact-form';
    if (extra && extra.amount) $('#c-amount').value = Math.round(extra.amount).toLocaleString('en-IN');
    if (extra && extra.message) $('#c-msg').value = extra.message;
    $('#contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(function () { $('#c-name').focus({ preventScroll: true }); }, reduceMotion ? 0 : 700);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.js-enquire');
    if (b) { e.preventDefault(); goToForm(b.dataset.product); }
  });
  $('#emi-cta').addEventListener('click', function () {
    goToForm($('#emi-type').value, {
      source: 'calculator', amount: lastEmi.P,
      message: 'EMI calculator: ' + inr(lastEmi.P) + ' at ' + lastEmi.rate + '% for ' + lastEmi.n + ' months (EMI approx. ' + inr(lastEmi.E) + '). Please share the best rate.'
    });
  });
  $$('.js-invest-cta').forEach(function (b) { b.addEventListener('click', function () { goToForm('Mutual Funds & SIP', { source: 'calculator' }); }); });

  /* ---------------- Validation ---------------- */
  var RX = {
    name: /^[\p{L}][\p{L}\p{M} .'-]{1,99}$/u,
    phone: /^[6-9]\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  };
  var MSG = {
    name: 'Please enter your full name (letters only).',
    phone: 'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.',
    email: 'Please enter a valid email address.',
    consent: 'Please tick the box to agree to be contacted.'
  };
  function fieldErr(input, msg) {
    var f = input.closest('.field'), p = f && f.querySelector('.err');
    input.classList.toggle('invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (p) p.textContent = msg || '';
  }
  function checkField(input) {
    var k = input.name, v = (input.type === 'checkbox') ? input.checked : input.value.trim();
    var bad = '';
    if (k === 'consent') bad = v ? '' : MSG.consent;
    else if (RX[k]) bad = RX[k].test(v) ? '' : MSG[k];
    fieldErr(input, bad);
    return !bad;
  }
  function wireForm(form) {
    $$('input[name="phone"]', form).forEach(function (p) { p.addEventListener('input', function () { var d = p.value.replace(/\D/g, ''); if (d.length > 10 && /^(91|0)/.test(d)) d = d.slice(-10); p.value = d.slice(0, 10); }); });
    var amt = $('input[name="loanAmount"]', form);
    if (amt) amt.addEventListener('input', function () { var d = amt.value.replace(/\D/g, '').slice(0, 11); amt.value = d ? parseInt(d, 10).toLocaleString('en-IN') : ''; });
    $$('input[name="name"],input[name="phone"],input[name="email"],input[name="consent"]', form).forEach(function (i) {
      i.addEventListener('blur', function () { if (i.value || i.type === 'checkbox') checkField(i); });
      i.addEventListener('input', function () { if (i.classList.contains('invalid')) checkField(i); });
      i.addEventListener('change', function () { if (i.type === 'checkbox') checkField(i); });
    });
  }
  function validate(form) {
    var ok = true, first = null;
    $$('input[name="name"],input[name="phone"],input[name="email"],input[name="consent"]', form).forEach(function (i) {
      if (!checkField(i)) { ok = false; if (!first) first = i; }
    });
    if (first) first.focus();
    return ok;
  }
  function formData(form) {
    var d = {};
    $$('input,select,textarea', form).forEach(function (el) {
      if (!el.name || el.type === 'checkbox') return;
      d[el.name] = el.value.trim();
    });
    d.name = (d.name || '').replace(/\s+/g, ' ');
    return d;
  }

  /* ---------------- Sending ---------------- */
  var SOURCE_LABEL = { 'entry-popup': 'Website entry popup', 'contact-form': 'Callback request', 'calculator': 'Calculator enquiry', 'join-us': 'Join Us application' };
  function sendLead(source, d) {
    if (d.website) return Promise.resolve(true); // spam trap
    var payload = {
      source: source, name: d.name, phone: d.phone, email: d.email,
      product: d.product || '', loanAmount: d.loanAmount || '', city: d.city || '', message: d.message || '',
      pageUrl: location.href.split('#')[0], timestamp: new Date().toISOString()
    };
    var timeout = function (p) { return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, 15000); })]); };

    if (cfg.googleSheetUrl) {
      return timeout(fetch(cfg.googleSheetUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) }))
        .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
        .then(function (j) { if (!j.ok) throw new Error(j.error || 'Not saved'); return true; });
    }
    if (cfg.emailForwardTo) {
      var body = {
        _subject: 'New ' + SOURCE_LABEL[source] + ': ' + payload.name,
        _template: 'table', _captcha: 'false',
        'Form': SOURCE_LABEL[source], 'Full Name': payload.name, 'Phone': '+91 ' + payload.phone, 'Email': payload.email
      };
      if (payload.product) body['Loan / Service'] = payload.product;
      if (payload.loanAmount) body['Loan Amount'] = '₹' + payload.loanAmount;
      if (payload.city) body['City'] = payload.city;
      if (payload.message) body['Message'] = payload.message;
      body['Submitted'] = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      body['_replyto'] = payload.email;
      return timeout(fetch('https://formsubmit.co/ajax/' + encodeURIComponent(cfg.emailForwardTo), {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(body)
      })).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || String(j.success) === 'false') { if (j.message) console.warn('[Phoenix forms]', j.message); throw new Error(j.message || 'Not sent'); }
        return true;
      }); });
    }
    return Promise.reject(new Error('No form destination configured in js/config.js'));
  }
  function busy(form, on) {
    var b = $('button[type="submit"]', form);
    b.disabled = on; b.classList.toggle('is-loading', on); b.setAttribute('aria-busy', String(on));
  }
  var failHTML = 'Something went wrong. Please try again, or WhatsApp us at <a href="' + waHref + '" target="_blank" rel="noopener">' + fmtPhone(cfg.whatsappNumber) + '</a>.';

  /* ---------------- Modals ---------------- */
  var openModals = [];
  var FOCUSABLE = 'a[href],button:not([disabled]):not([hidden]),input:not([type=hidden]):not(.hp),select,textarea,[tabindex]:not([tabindex="-1"])';
  function visibleFocusables(m) { return $$(FOCUSABLE, m).filter(function (el) { return el.offsetParent !== null; }); }
  function openModal(m, opts) {
    if (!m.hidden) return;
    m._last = document.activeElement; m._opts = opts || {};
    m.hidden = false; openModals.push(m);
    document.body.classList.add('no-scroll');
    var f = visibleFocusables(m).filter(function (el) { return !el.classList.contains('modal-close'); })[0] || visibleFocusables(m)[0];
    setTimeout(function () { if (f) f.focus(); }, 30);
  }
  function closeModal(m) {
    if (m.hidden) return;
    if (m._opts && m._opts.locked) return;
    m.hidden = true; openModals = openModals.filter(function (x) { return x !== m; });
    if (!openModals.length) document.body.classList.remove('no-scroll');
    if (m._opts && m._opts.onClose) m._opts.onClose();
    if (m._last && m._last.focus) m._last.focus({ preventScroll: true });
  }
  document.addEventListener('keydown', function (e) {
    var m = openModals[openModals.length - 1]; if (!m) return;
    if (e.key === 'Escape') { closeModal(m); return; }
    if (e.key === 'Tab') {
      var f = visibleFocusables(m); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $$('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeModal(m); });
  });

  // ---- Entry lead popup ----
  var leadModal = $('#lead-modal'), leadForm = $('#lead-form');
  wireForm(leadForm);
  var skippable = !!cfg.entryPopupSkippable;
  if (skippable) { $$('[data-close]', leadModal).forEach(function (b) { b.hidden = false; }); $('[data-backdrop="lead"]', leadModal).setAttribute('data-close', ''); }
  var wantsJoin = location.hash === '#join-us';
  if (cfg.showEntryPopup !== false && !store('phoenix_lead_done') && !wantsJoin) {
    setTimeout(function () { if (!openModals.length) openModal(leadModal, { locked: !skippable }); }, 1000);
  }
  leadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate(leadForm)) return;
    var d = formData(leadForm);
    busy(leadForm, true);
    sendLead('entry-popup', d).catch(function (err) { console.warn('[Phoenix forms] lead not delivered:', err && err.message); })
      .then(function () {
        busy(leadForm, false);
        store('phoenix_lead_done', '1');
        $('[data-pane="form"]', leadModal).hidden = true;
        var s = $('[data-pane="success"]', leadModal); s.hidden = false;
        $('.success-title', s).textContent = 'Thank you, ' + d.name.split(' ')[0] + '!';
        // prefill contact form for convenience
        $('#c-name').value = d.name; $('#c-phone').value = d.phone; $('#c-email').value = d.email;
        setTimeout(function () { leadModal._opts.locked = false; closeModal(leadModal); }, 2200);
      });
  });

  // ---- Join Us ----
  var joinModal = $('#join-modal'), joinForm = $('#join-form');
  wireForm(joinForm);
  function openJoin() {
    if (!leadModal.hidden && leadModal._opts) { leadModal._opts.locked = false; closeModal(leadModal); }
    $('[data-pane="form"]', joinModal).hidden = false; $('[data-pane="success"]', joinModal).hidden = true;
    $('.form-status', joinForm).textContent = '';
    openModal(joinModal, { onClose: function () { if (location.hash === '#join-us') history.replaceState(null, '', location.pathname + location.search); } });
  }
  $$('.js-open-join').forEach(function (b) { b.addEventListener('click', openJoin); });
  if (wantsJoin) setTimeout(openJoin, 300);
  window.addEventListener('hashchange', function () { if (location.hash === '#join-us') openJoin(); });
  joinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var st = $('.form-status', joinForm); st.className = 'form-status'; st.textContent = '';
    if (!validate(joinForm)) return;
    var d = formData(joinForm);
    busy(joinForm, true);
    sendLead('join-us', d).then(function () {
      busy(joinForm, false); joinForm.reset();
      $('[data-pane="form"]', joinModal).hidden = true;
      var s = $('[data-pane="success"]', joinModal); s.hidden = false;
      $('.success-title', s).textContent = 'Thank you, ' + d.name.split(' ')[0] + '!';
      $('button', s).focus();
    }).catch(function (err) {
      console.warn('[Phoenix forms]', err && err.message);
      busy(joinForm, false); st.classList.add('bad'); st.innerHTML = failHTML;
    });
  });

  // ---- Contact form ----
  wireForm(contactForm);
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var st = $('.form-status', contactForm); st.className = 'form-status'; st.textContent = '';
    if (!validate(contactForm)) return;
    var d = formData(contactForm);
    busy(contactForm, true);
    sendLead(contactForm.dataset.source || 'contact-form', d).then(function () {
      busy(contactForm, false); contactForm.reset(); contactForm.dataset.source = 'contact-form';
      st.classList.add('ok'); st.textContent = 'Thank you, ' + d.name.split(' ')[0] + '! Your request has been received. Our team will call you shortly.';
    }).catch(function (err) {
      console.warn('[Phoenix forms]', err && err.message);
      busy(contactForm, false); st.classList.add('bad'); st.innerHTML = failHTML;
    });
  });

  // ---- Certificate lightbox ----
  var certModal = $('#cert-modal');
  $$('.js-open-cert').forEach(function (b) {
    b.addEventListener('click', function () {
      var img = $('img[data-src]', certModal);
      if (img && !img.src) img.src = img.dataset.src;
      openModal(certModal);
    });
  });

  // ---- Privacy ----
  $$('.js-open-privacy').forEach(function (b) { b.addEventListener('click', function () { openModal($('#privacy-modal')); }); });

  /* ---------------- FAQ: one open at a time ---------------- */
  var faqs = $$('#faq-list details');
  faqs.forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; }); }); });
})();
