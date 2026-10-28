/* =========================================================================
   ECAP — interactions
   Vanilla JS, no dependencies. Every feature degrades to a readable page.
   ========================================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------------------
     Site settings: edit contact details here. Everything marked with
     data-site / data-site-href in the HTML is filled from this object.
     --------------------------------------------------------------------- */
  const SITE = {
    email: 'ecap@yourschool.ac.th',
    phone: '02-000-0000',
    lineId: '@ecap.official',
    lineUrl: 'https://line.me/R/ti/p/@ecap.official',
    facebookName: 'ECAP Official',
    facebookUrl: 'https://www.facebook.com/',
    instagramHandle: '@ecap.official',
    instagramUrl: 'https://www.instagram.com/',
    address: 'ฝ่ายวิชาการ อาคาร 1 ชั้น 2',
    mapUrl: 'https://maps.google.com/?q=Bangkok',
    // Optional form backend (e.g. https://formspree.io/f/xxxxxxx).
    // Leave empty and the form opens the visitor's email app instead.
    formEndpoint: ''
  };

  const QUIZ = [
    { tokens: ['She', "don't", 'like', 'coffee', 'in', 'the', 'morning.'], wrong: 1, fix: "doesn't",
      rule: 'Subject–verb agreement', en: '“She” is third-person singular, so the negative is “doesn’t”.',
      th: 'ประธานเอกพจน์บุรุษที่ 3 (She) ใช้ does not / doesn’t' },
    { tokens: ['I', 'have visited', 'London', 'last', 'year.'], wrong: 1, fix: 'visited',
      rule: 'Past simple', en: '“Last year” is finished time, so we use the past simple: “visited”.',
      th: 'มีคำบอกเวลาในอดีตที่จบไปแล้ว (last year) จึงใช้ Past Simple' },
    { tokens: ['Each', 'of', 'the', 'students', 'have', 'a', 'laptop.'], wrong: 4, fix: 'has',
      rule: 'Each + singular verb', en: '“Each” is singular, so the verb is “has”.',
      th: 'Each of … ถือเป็นเอกพจน์ จึงใช้ has' },
    { tokens: ['My', 'brother', 'is', 'more', 'taller', 'than', 'me.'], wrong: 3, fix: '',
      rule: 'Double comparatives', en: '“Taller” is already comparative, so “more” has to go.',
      th: 'taller เป็นขั้นกว่าอยู่แล้ว ไม่ต้องมี more ซ้ำ' },
    { tokens: ['If', 'I', 'would have known,', 'I', 'would', 'have', 'come.'], wrong: 2, fix: 'had known,',
      rule: 'Third conditional', en: 'The “if” clause of a third conditional takes the past perfect: “had known”.',
      th: 'Conditional แบบที่ 3 ใช้ If + had + V3' },
    { tokens: ['She', 'gave', 'me', 'some', 'useful', 'informations.'], wrong: 5, fix: 'information.',
      rule: 'Uncountable nouns', en: '“Information” is uncountable, so it never takes a plural “s”.',
      th: 'information เป็นนามนับไม่ได้ จึงไม่เติม s' }
  ];

  const WORDS = [
    { word: 'Eloquent', ipa: '/ˈel.ə.kwənt/', pos: 'adj.', def: 'Fluent and persuasive in speaking or writing.', th: 'พูดหรือเขียนได้อย่างคล่องแคล่วและโน้มน้าวใจ', ex: 'Her eloquent speech won the debate.' },
    { word: 'Serendipity', ipa: '/ˌser.ənˈdɪp.ə.ti/', pos: 'n.', def: 'The happy chance of finding something good without looking for it.', th: 'ความบังเอิญที่นำมาซึ่งสิ่งดี ๆ', ex: 'Meeting my exchange partner was pure serendipity.' },
    { word: 'Ephemeral', ipa: '/ɪˈfem.ər.əl/', pos: 'adj.', def: 'Lasting for only a short time.', th: 'ชั่วครู่ ไม่จีรัง', ex: 'Trends are ephemeral; fluency lasts.' },
    { word: 'Mellifluous', ipa: '/məˈlɪf.lu.əs/', pos: 'adj.', def: 'Sweet and pleasant to hear.', th: '(เสียง) ไพเราะ นุ่มนวลน่าฟัง', ex: 'He read the poem in a mellifluous voice.' },
    { word: 'Resilience', ipa: '/rɪˈzɪl.jəns/', pos: 'n.', def: 'The ability to recover quickly from difficulties.', th: 'ความสามารถในการฟื้นตัว ล้มแล้วลุกได้เร็ว', ex: 'Learning a language takes resilience.' },
    { word: 'Articulate', ipa: '/ɑːˈtɪk.jə.lət/', pos: 'adj.', def: 'Able to express ideas clearly and well.', th: 'สามารถสื่อสารความคิดได้ชัดเจน', ex: 'ECAP students are confident and articulate.' },
    { word: 'Petrichor', ipa: '/ˈpet.rɪ.kɔːr/', pos: 'n.', def: 'The pleasant smell of earth after rain.', th: 'กลิ่นดินหลังฝนตก', ex: 'The petrichor reminded her of home.' },
    { word: 'Wanderlust', ipa: '/ˈwɒn.də.lʌst/', pos: 'n.', def: 'A strong desire to travel.', th: 'ความปรารถนาที่จะออกเดินทางไปที่ต่าง ๆ', ex: 'English feeds my wanderlust.' }
  ];

  /* ---------- Helpers ---------- */
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const media = (q) => window.matchMedia(q);
  const reduced = media('(prefers-reduced-motion: reduce)').matches;
  const finePointer = media('(hover: hover) and (pointer: fine)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  const safe = (fn) => { try { fn(); } catch (err) { console.error('[ECAP]', err); } };

  /* One rAF loop drives everything that animates per frame. */
  const tickers = new Set();
  const scrollers = new Set();
  const resizers = new Set();
  const themeWatchers = new Set();
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, moved: false };
  let scrollY = window.scrollY;
  let lastScrollY = -1;
  let velocity = 0;
  let scrollDir = 1;
  let lastFrame = performance.now();

  function frame(now) {
    const dt = Math.min(4, (now - lastFrame) / 16.667);
    lastFrame = now;
    tickers.forEach((fn) => fn(dt, now));
    scrollY = window.scrollY;
    const delta = lastScrollY < 0 ? 0 : scrollY - lastScrollY;
    velocity = lerp(velocity, delta, 0.2);
    if (Math.abs(delta) > 0.5) scrollDir = delta > 0 ? 1 : -1;
    if (scrollY !== lastScrollY) {
      scrollers.forEach((fn) => fn(scrollY));
      lastScrollY = scrollY;
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener('pointermove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.moved = true;
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizers.forEach((fn) => fn());
      lastScrollY = -1;
    }, 150);
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('.toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 3600);
  }

  /* ---------- Letter confetti ---------- */
  function confetti(x, y, count = 40, spread = 1) {
    if (reduced) return;
    const chars = 'ECAPecap&?!;:';
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'confetti';
      s.textContent = chars[(Math.random() * chars.length) | 0];
      s.style.fontSize = (12 + Math.random() * 24) + 'px';
      s.style.fontStyle = Math.random() > 0.5 ? 'italic' : 'normal';
      document.body.appendChild(s);
      const ang = Math.random() * Math.PI * 2;
      const dist = (60 + Math.random() * 220) * spread;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist - 100 * spread;
      const rot = (Math.random() - 0.5) * 720;
      const anim = s.animate([
        { transform: `translate(${x}px, ${y}px) scale(0.3)`, opacity: 1 },
        { transform: `translate(${x + dx}px, ${y + dy}px) rotate(${rot / 2}deg) scale(1)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${x + dx * 1.2}px, ${y + dy + 280 * spread}px) rotate(${rot}deg) scale(0.8)`, opacity: 0 }
      ], { duration: 1400 + Math.random() * 1000, easing: 'cubic-bezier(.2,.7,.3,1)' });
      anim.onfinish = () => s.remove();
    }
  }

  /* ---------- Text scramble ---------- */
  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  function scramble(el, to, duration = 650) {
    const len = Math.max(el.textContent.length, to.length);
    const offsets = Array.from({ length: len }, (_, i) => (i / len) * 0.55 + Math.random() * 0.45);
    const start = performance.now();
    cancelAnimationFrame(el._scr);
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      let out = '';
      for (let i = 0; i < len; i++) {
        const ch = to[i] || '';
        if (p >= offsets[i] || ch === ' ' || !/[a-z]/i.test(ch)) out += ch;
        else {
          const set = ch === ch.toUpperCase() ? UPPER : LOWER;
          out += set[(Math.random() * set.length) | 0];
        }
      }
      el.textContent = out;
      if (p < 1) el._scr = requestAnimationFrame(step);
      else el.textContent = to;
    };
    el._scr = requestAnimationFrame(step);
  }

  /* ---------- Speech ---------- */
  function speak(text) {
    if (!('speechSynthesis' in window)) {
      toast('เบราว์เซอร์นี้ยังไม่รองรับการออกเสียง');
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find((x) => /en[-_]GB/i.test(x.lang)) || voices.find((x) => /^en/i.test(x.lang));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }

  /* =====================================================================
     Features
     ===================================================================== */

  function bindSite() {
    const hrefs = {
      email: 'mailto:' + SITE.email,
      phone: 'tel:' + SITE.phone.replace(/[^\d+]/g, ''),
      line: SITE.lineUrl,
      facebook: SITE.facebookUrl,
      instagram: SITE.instagramUrl,
      map: SITE.mapUrl
    };
    $$('[data-site]').forEach((el) => { if (SITE[el.dataset.site]) el.textContent = SITE[el.dataset.site]; });
    $$('[data-site-href]').forEach((el) => { if (hrefs[el.dataset.siteHref]) el.href = hrefs[el.dataset.siteHref]; });
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  /* Smooth wheel scrolling (desktop only). Native scrolling stays in charge
     of keyboard, scrollbar and touch, so sticky elements keep working. */
  const smooth = (() => {
    const enabled = finePointer && !reduced;
    let target = window.scrollY;
    let current = target;
    let lastSet = target;
    let active = false;
    let ease = 0.1;
    const maxY = () => document.documentElement.scrollHeight - window.innerHeight;

    function canScrollInside(el, dy) {
      while (el && el.nodeType === 1 && el !== document.body) {
        const s = getComputedStyle(el);
        if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1) {
          if ((dy < 0 && el.scrollTop > 0) || (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1)) return true;
        }
        el = el.parentElement;
      }
      return false;
    }

    if (enabled) {
      window.addEventListener('wheel', (e) => {
        if (e.ctrlKey || root.classList.contains('menu-open')) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        if (canScrollInside(e.target, e.deltaY)) return;
        e.preventDefault();
        let d = e.deltaY;
        if (e.deltaMode === 1) d *= 32;
        else if (e.deltaMode === 2) d *= window.innerHeight;
        if (!active) { current = window.scrollY; target = current; lastSet = current; }
        target = clamp(target + d, 0, maxY());
        ease = 0.1;
        active = true;
      }, { passive: false });

      tickers.add((dt) => {
        if (!active) return;
        if (Math.abs(window.scrollY - lastSet) > 3) {
          active = false;
          return;
        }
        current = lerp(current, target, 1 - Math.pow(1 - ease, dt));
        if (Math.abs(target - current) < 0.5) { current = target; active = false; }
        window.scrollTo(0, current);
        lastSet = window.scrollY;
      });
    }

    function to(y) {
      y = clamp(y, 0, maxY());
      if (enabled) {
        current = window.scrollY;
        lastSet = current;
        target = y;
        ease = 0.075;
        active = true;
      } else {
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      }
    }
    return { to };
  })();

  function initAnchors() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) { e.preventDefault(); return; }
      const el = id === 'top' ? null : document.getElementById(id);
      if (id !== 'top' && !el) return;
      e.preventDefault();
      if (root.classList.contains('menu-open')) toggleMenu(false);
      const y = el ? el.getBoundingClientRect().top + window.scrollY : 0;
      smooth.to(y);
      if (el && id === 'main') el.focus({ preventScroll: true });
    });
    $$('.to-top').forEach((b) => b.addEventListener('click', () => smooth.to(0)));
  }

  /* ---------- Theme ---------- */
  function currentTheme() {
    const t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return media('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function syncThemeColor() {
    const m = $('meta[name="theme-color"]');
    if (m) m.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
  }
  function initTheme() {
    const btn = $('.theme-toggle');
    syncThemeColor();
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      const apply = () => {
        root.setAttribute('data-theme', next);
        store.set('ecap-theme', next);
        syncThemeColor();
        themeWatchers.forEach((fn) => fn());
      };
      if (!document.startViewTransition || reduced) { apply(); return; }
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const vt = document.startViewTransition(apply);
      vt.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 900, easing: 'cubic-bezier(.77,0,.18,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => {});
    });
  }

  /* ---------- Preloader ---------- */
  function runPreloader(done) {
    const pre = $('.preloader');
    if (!pre || reduced) {
      if (pre) pre.hidden = true;
      done();
      return;
    }
    const count = $('.preloader__count', pre);
    const bar = $('.preloader__bar', pre);
    const start = performance.now();
    const duration = 1250;
    let fontsReady = !document.fonts;
    if (document.fonts) document.fonts.ready.then(() => { fontsReady = true; });
    const step = (now) => {
      let p = Math.min(1, (now - start) / duration);
      if (!fontsReady && now - start < 2400) p = Math.min(p, 0.92);
      const e = 1 - Math.pow(1 - p, 3);
      count.textContent = String(Math.round(e * 100)).padStart(3, '0');
      bar.style.setProperty('--p', e.toFixed(3));
      if (p < 1) { requestAnimationFrame(step); return; }
      setTimeout(() => {
        pre.classList.add('is-done');
        done();
        setTimeout(() => { pre.hidden = true; }, 1200);
      }, 180);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (!finePointer || reduced) return;
    const c = $('.cursor');
    if (!c) return;
    const dot = $('.cursor__dot', c);
    const ring = $('.cursor__ring', c);
    const label = $('.cursor__label', c);
    root.classList.add('has-cursor');
    c.classList.add('is-hidden');
    let rx = pointer.x;
    let ry = pointer.y;
    let shown = false;

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) { shown = true; rx = e.clientX; ry = e.clientY; }
      c.classList.remove('is-hidden');
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => c.classList.add('is-hidden'));
    window.addEventListener('pointerdown', () => c.classList.add('is-down'));
    window.addEventListener('pointerup', () => c.classList.remove('is-down'));

    const interactive = 'a, button, summary, label, select, .tok, .course, [role="tab"]';
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t && !e.target.closest('input, textarea')) {
        label.textContent = t.dataset.cursor;
        c.classList.add('is-label');
        c.classList.remove('is-hover');
        return;
      }
      c.classList.remove('is-label');
      c.classList.toggle('is-hover', !!e.target.closest(interactive));
    });

    tickers.add((dt) => {
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      const t = 1 - Math.pow(1 - 0.2, dt);
      rx = lerp(rx, pointer.x, t);
      ry = lerp(ry, pointer.y, t);
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (!finePointer || reduced) return;
    $$('.magnetic').forEach((el) => {
      const inner = el.querySelector('span');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * 0.22}px, ${my * 0.32}px)`;
        if (inner) inner.style.transform = `translate(${mx * 0.1}px, ${my * 0.14}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
        if (inner) inner.style.transform = '';
      });
    });
  }

  /* ---------- Navigation ---------- */
  let toggleMenu = () => {};
  function initNav() {
    const nav = $('#nav');
    const burger = $('.burger');
    const menu = $('#menu');
    const progress = $('.progress');
    let lastY = window.scrollY;

    scrollers.add((y) => {
      nav.classList.toggle('is-scrolled', y > 30);
      if (!root.classList.contains('menu-open')) {
        if (y > 260 && y > lastY + 3) nav.classList.add('is-hidden');
        else if (y < lastY - 3 || y < 260) nav.classList.remove('is-hidden');
      }
      lastY = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    });

    // Nav hover scramble
    if (!reduced) {
      $$('[data-scramble]').forEach((a) => {
        const text = a.textContent;
        a.addEventListener('mouseenter', () => scramble(a, text, 450));
      });
    }

    // Active link
    const links = $$('.nav__links a');
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) => a.classList.remove('is-active'));
          const a = map.get(en.target.id);
          if (a) a.classList.add('is-active');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    }

    // Mobile menu
    toggleMenu = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
      if (open) {
        menu.hidden = false;
        root.classList.add('menu-open');
        nav.classList.remove('is-hidden');
        requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
      } else {
        menu.classList.remove('is-open');
        root.classList.remove('menu-open');
        setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 900);
      }
    };
    burger.addEventListener('click', () => toggleMenu(burger.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { toggleMenu(false); burger.focus(); }
    });
  }

  /* ---------- Clocks ---------- */
  function initClock() {
    const els = $$('[data-clock]');
    if (!els.length) return;
    let fmtLong;
    let fmtShort;
    try {
      fmtLong = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      fmtShort = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (e) { return; }
    const tick = () => {
      const now = new Date();
      els.forEach((el) => { el.textContent = (el.closest('.footer') ? fmtLong : fmtShort).format(now); });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Split headings + reveal ---------- */
  function splitWords(el) {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'w';
            const s = document.createElement('span');
            s.textContent = part;
            s.style.setProperty('--i', i++);
            w.appendChild(s);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    };
    walk(el);
    el.classList.add('is-split');
    return $$('.w', el);
  }

  const revealHooks = [];
  function initReveal() {
    $$('[data-split]').forEach(splitWords);
    const els = $$('[data-reveal], [data-split]');
    const counts = new Map();
    els.forEach((el) => {
      if (el.style.getPropertyValue('--d')) return;
      const n = counts.get(el.parentElement) || 0;
      counts.set(el.parentElement, n + 1);
      el.style.setProperty('--d', Math.min(n * 0.07, 0.5) + 's');
    });
    const show = (el) => {
      el.classList.add('is-in');
      revealHooks.forEach((fn) => fn(el));
    };
    if (reduced || !('IntersectionObserver' in window)) { els.forEach(show); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.04 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Hero: letter field canvas ---------- */
  function initField() {
    const canvas = $('.hero__canvas');
    const hero = $('.hero');
    if (!canvas || !hero || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz&?!;:';
    let w = 0;
    let h = 0;
    let cell = 30;
    let cols = 0;
    let rows = 0;
    let cells = [];
    let color = '#d6b46a';
    let base = 0.075;
    let visible = true;
    const p = { x: -1, y: -1, tx: 0, ty: 0, last: -1e9 };

    const readColors = () => {
      const cs = getComputedStyle(root);
      color = cs.getPropertyValue('--gold').trim() || color;
      base = parseFloat(cs.getPropertyValue('--field-alpha')) || base;
    };
    const resize = () => {
      const r = hero.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = clamp(w / 48, 22, 40);
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      cells = Array.from({ length: cols * rows }, () => ({ c: CHARS[(Math.random() * CHARS.length) | 0], g: 0 }));
      ctx.font = `300 ${Math.round(cell * 0.46)}px Kanit, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    };
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      if (t - p.last > 2200) {
        p.tx = w * (0.5 + 0.38 * Math.sin(t * 0.00027));
        p.ty = h * (0.42 + 0.28 * Math.sin(t * 0.00041 + 1.3));
      }
      if (p.x < 0) { p.x = p.tx; p.y = p.ty; }
      p.x = lerp(p.x, p.tx, 0.08);
      p.y = lerp(p.y, p.ty, 0.08);
      const R = clamp(w * 0.2, 140, 280);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const cl = cells[j * cols + i];
          const x = i * cell + cell / 2;
          const y = j * cell + cell / 2;
          const dx = x - p.x;
          const dy = y - p.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const inf = d < R ? 1 - d / R : 0;
          cl.g = inf > cl.g ? inf : cl.g * 0.955;
          if (inf > 0.3 && Math.random() < 0.05) cl.c = CHARS[(Math.random() * CHARS.length) | 0];
          const wave = 0.5 + 0.5 * Math.sin(t * 0.0011 + i * 0.33 + j * 0.21);
          const a = base * (0.35 + wave * 0.8) + cl.g * cl.g * 0.6;
          if (a < 0.012) continue;
          ctx.globalAlpha = a > 1 ? 1 : a;
          ctx.fillText(cl.c, x, y);
        }
      }
      ctx.globalAlpha = 1;
    };

    readColors();
    resize();
    themeWatchers.add(() => { readColors(); if (reduced) draw(0); });
    resizers.add(() => { resize(); if (reduced) draw(0); });
    if (document.fonts) document.fonts.ready.then(() => { resize(); if (reduced) draw(0); });

    if (reduced) { draw(0); return; }

    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      p.tx = e.clientX - r.left;
      p.ty = e.clientY - r.top;
      p.last = performance.now();
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(hero);
    }
    tickers.add((dt, t) => {
      if (!visible || document.hidden) return;
      draw(t);
    });
  }

  /* ---------- Hero: letters, rotator, parallax ---------- */
  function initHero() {
    const hero = $('.hero');
    const inner = $('.hero__inner');
    const letters = $$('.hero__letter');
    const rot = $('.rotator');

    if (rot && !reduced) {
      const words = rot.dataset.words.split(',');
      let i = 0;
      setInterval(() => {
        if (document.hidden) return;
        i = (i + 1) % words.length;
        scramble(rot, words[i], 700);
      }, 2800);
    }

    $$('[data-speak]').forEach((b) => b.addEventListener('click', () => speak(b.dataset.speak)));

    if (reduced) return;
    let cx = 0;
    let cy = 0;
    tickers.add((dt) => {
      if (scrollY > window.innerHeight * 1.2) return;
      const mx = finePointer && pointer.moved ? (pointer.x / window.innerWidth - 0.5) * 2 : 0;
      const my = finePointer && pointer.moved ? (pointer.y / window.innerHeight - 0.5) * 2 : 0;
      const t = 1 - Math.pow(1 - 0.06, dt);
      cx = lerp(cx, mx, t);
      cy = lerp(cy, my, t);
      const s = scrollY;
      letters.forEach((l, k) => {
        const d = +l.dataset.depth || 20;
        const spread = (k - 1.5) * s * 0.04;
        l.style.transform = `translate3d(${cx * d + spread}px, ${cy * d * 0.5 - s * d * 0.012}px, 0)`;
      });
      const hp = clamp(s / (hero.offsetHeight || 1), 0, 1);
      inner.style.transform = `translate3d(0, ${s * 0.18}px, 0)`;
      inner.style.opacity = String(1 - hp * 0.9);
    });
  }

  /* ---------- Marquee ---------- */
  function initMarquee() {
    const rows = $$('.marquee__row');
    if (!rows.length) return;
    const state = rows.map((row) => {
      const track = $('.marquee__track', row);
      const original = track.innerHTML;
      return { row, track, original, half: 0, x: 0, dir: +row.dataset.dir || -1 };
    });
    const build = () => {
      state.forEach((s) => {
        s.track.innerHTML = s.original;
        let guard = 0;
        while (s.track.scrollWidth < window.innerWidth * 1.2 && guard++ < 10) s.track.insertAdjacentHTML('beforeend', s.original);
        const set = s.track.innerHTML;
        s.track.insertAdjacentHTML('beforeend', set);
        Array.from(s.track.children).forEach((c, i) => { if (i >= s.track.children.length / 2) c.setAttribute('aria-hidden', 'true'); });
        s.half = s.track.scrollWidth / 2;
        s.x = s.dir > 0 ? -s.half : 0;
      });
    };
    build();
    resizers.add(build);
    if (document.fonts) document.fonts.ready.then(build);
    if (reduced) return;
    let skew = 0;
    tickers.add((dt) => {
      const boost = Math.min(14, Math.abs(velocity));
      skew = lerp(skew, clamp(velocity * 0.25, -7, 7), 0.12);
      state.forEach((s) => {
        if (!s.half) return;
        s.x += s.dir * scrollDir * (0.7 + boost * 0.55) * dt;
        if (s.x <= -s.half) s.x += s.half;
        if (s.x > 0) s.x -= s.half;
        s.track.style.transform = `translate3d(${s.x}px, 0, 0) skewX(${-skew}deg)`;
      });
    });
  }

  /* ---------- About: manifesto scrub, counters ---------- */
  function initAbout() {
    const man = $('[data-manifesto]');
    if (man) {
      const words = splitWords(man);
      if (reduced) words.forEach((w) => w.classList.add('is-lit'));
      else {
        scrollers.add(() => {
          const r = man.getBoundingClientRect();
          const vh = window.innerHeight;
          const p = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3), 0, 1);
          const n = Math.round(p * words.length * 1.08);
          words.forEach((w, i) => w.classList.toggle('is-lit', i < n));
        });
      }
    }

    revealHooks.push((el) => {
      const num = el.querySelector && el.querySelector('[data-count]');
      if (num && !reduced) {
        const to = +num.dataset.count;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / 1600);
          num.textContent = Math.round((1 - Math.pow(1 - p, 4)) * to);
          if (p < 1) requestAnimationFrame(step);
        };
        num.textContent = '0';
        requestAnimationFrame(step);
      }
      const sc = el.querySelector && el.querySelector('[data-scramble-in]');
      if (sc && !reduced) {
        const text = sc.textContent;
        sc.textContent = 'A1';
        setTimeout(() => scramble(sc, text, 1200), 150);
      }
    });
  }

  /* ---------- Pillars: tilt + spotlight ---------- */
  function initTilt() {
    if (!finePointer || reduced) return;
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        card.style.transform = `perspective(1000px) rotateX(${((0.5 - py) * 9).toFixed(2)}deg) rotateY(${((px - 0.5) * 11).toFixed(2)}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Journey: pinned horizontal scroll ---------- */
  function initJourney() {
    const sec = $('.journey');
    if (!sec) return;
    const viewport = $('.journey__viewport', sec);
    const track = $('.journey__track', sec);
    const bar = $('.journey__progress', sec);
    const cards = $$('.tense', sec);
    let pinned = false;
    let dist = 0;

    const setCurrent = (p) => {
      const idx = Math.round(p * (cards.length - 1));
      cards.forEach((c, i) => c.classList.toggle('is-current', i === idx));
    };
    const layout = () => {
      pinned = !reduced && window.innerWidth >= 960 && window.innerHeight >= 620;
      sec.classList.toggle('is-pinned', pinned);
      if (!pinned) {
        sec.style.height = '';
        track.style.transform = '';
        return;
      }
      const pad = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
      dist = Math.max(0, track.scrollWidth + pad - document.documentElement.clientWidth);
      sec.style.height = (window.innerHeight + dist) + 'px';
    };
    const update = () => {
      if (pinned) {
        const top = sec.getBoundingClientRect().top;
        const p = dist ? clamp(-top / dist, 0, 1) : 0;
        track.style.transform = `translate3d(${(-p * dist).toFixed(2)}px, 0, 0)`;
        bar.style.setProperty('--p', p.toFixed(4));
        setCurrent(p);
      }
    };
    viewport.addEventListener('scroll', () => {
      if (pinned) return;
      const max = viewport.scrollWidth - viewport.clientWidth;
      const p = max > 0 ? viewport.scrollLeft / max : 0;
      bar.style.setProperty('--p', p.toFixed(4));
    }, { passive: true });

    layout();
    resizers.add(() => { layout(); update(); });
    if (document.fonts) document.fonts.ready.then(() => { layout(); update(); });
    window.addEventListener('load', () => { layout(); update(); });
    scrollers.add(update);
    update();
  }

  /* ---------- Courses: floating preview ---------- */
  function initCourses() {
    const preview = $('.course-preview');
    if (!preview || !finePointer || reduced) return;
    const glyph = $('.course-preview__glyph', preview);
    const tag = $('.course-preview__tag', preview);
    let on = false;
    let px = 0;
    let py = 0;
    let rot = 0;
    $$('.course').forEach((c) => {
      c.addEventListener('pointerenter', () => {
        if (!preview.classList.contains('is-visible')) { px = pointer.x; py = pointer.y; }
        glyph.textContent = c.dataset.glyph;
        tag.textContent = $('.course__tag', c).textContent;
        preview.classList.add('is-visible');
        on = true;
      });
      c.addEventListener('pointerleave', () => {
        preview.classList.remove('is-visible');
        on = false;
      });
    });
    let idle = 0;
    tickers.add((dt) => {
      idle = on ? 0 : idle + dt;
      if (idle > 60) return;
      const t = 1 - Math.pow(1 - 0.14, dt);
      const nx = lerp(px, pointer.x, t);
      rot = lerp(rot, clamp((nx - px) * 0.9, -14, 14), 0.15);
      px = nx;
      py = lerp(py, pointer.y, t);
      preview.style.transform = `translate3d(${px + 40}px, ${py}px, 0) rotate(${rot}deg)`;
    });
  }

  /* ---------- Grammar lab quiz ---------- */
  function initQuiz() {
    const box = $('.quiz');
    if (!box) return;
    const sentence = $('.quiz__sentence', box);
    const feedback = $('.quiz__feedback', box);
    const next = $('.quiz__next', box);
    const nextLabel = $('span', next);
    const num = $('.quiz__num', box);
    const scoreEl = $('.quiz__score', box);
    const bar = $('.quiz__bar', box);
    const label = $('.quiz__label', box);
    $('.quiz__total', box).textContent = QUIZ.length;
    let qi = 0;
    let score = 0;
    let missed = false;
    let solved = false;
    let finished = false;

    const render = () => {
      const q = QUIZ[qi];
      missed = false;
      solved = false;
      finished = false;
      num.textContent = qi + 1;
      scoreEl.textContent = score;
      bar.style.setProperty('--p', ((qi + 1) / QUIZ.length).toFixed(4));
      sentence.innerHTML = '';
      q.tokens.forEach((t, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'tok';
        b.textContent = t;
        b.dataset.i = i;
        sentence.appendChild(b);
        if (!reduced && b.animate) {
          b.animate([{ opacity: 0, transform: 'translateY(16px)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
            { duration: 700, delay: i * 50, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
        }
      });
      feedback.innerHTML = '';
      label.hidden = false;
      next.disabled = true;
      nextLabel.textContent = qi === QUIZ.length - 1 ? 'See my result' : 'Next sentence';
    };

    const result = () => {
      finished = true;
      const n = QUIZ.length;
      let rank = { word: 'Curious', th: 'ทุกคนเริ่มจากตรงนี้ มาเรียนรู้ไปด้วยกันที่ ECAP' };
      if (score === n) rank = { word: 'Eloquent', th: 'สุดยอด! สายตานักไวยากรณ์ระดับ ECAP ตัวจริง' };
      else if (score >= n - 2) rank = { word: 'Articulate', th: 'เก่งมาก อีกนิดเดียวก็เพอร์เฟกต์' };
      else if (score >= n / 2) rank = { word: 'Promising', th: 'มาถูกทางแล้ว ECAP จะช่วยให้คุณคมขึ้นอีก' };
      sentence.innerHTML = `<div class="quiz__result"><p class="quiz__rank">${rank.word}</p><p>${score} / ${n} correct on the first try.</p><p class="fb-th">${rank.th}</p></div>`;
      feedback.innerHTML = '';
      label.hidden = true;
      bar.style.setProperty('--p', 1);
      nextLabel.textContent = 'Play again';
      next.disabled = false;
      if (score >= n - 1) {
        const r = sentence.getBoundingClientRect();
        confetti(r.left + r.width / 2, r.top + 40, 70, 1.3);
      }
    };

    sentence.addEventListener('click', (e) => {
      const b = e.target.closest('.tok');
      if (!b || solved || finished) return;
      const q = QUIZ[qi];
      const i = +b.dataset.i;
      if (i === q.wrong) {
        solved = true;
        if (!missed) score++;
        scoreEl.textContent = score;
        b.classList.remove('is-wrong');
        b.classList.add('is-right');
        b.innerHTML = `<s>${esc(q.tokens[i])}</s>${q.fix ? `<ins>${esc(q.fix)}</ins>` : ''}`;
        $$('.tok', sentence).forEach((t) => { t.disabled = true; });
        feedback.innerHTML = `<span class="fb-rule">${esc(q.rule)}</span><span>${missed ? 'Got it. ' : 'Correct! '}${esc(q.en)}</span><span class="fb-th">${esc(q.th)}</span>`;
        const r = b.getBoundingClientRect();
        confetti(r.left + r.width / 2, r.top, missed ? 10 : 22, 0.6);
        next.disabled = false;
      } else {
        missed = true;
        b.classList.remove('is-wrong');
        void b.offsetWidth;
        b.classList.add('is-wrong');
        feedback.innerHTML = `<span class="fb-bad">Not quite. “${esc(b.textContent)}” is fine here. Try another word.</span><span class="fb-th">ยังไม่ใช่ ลองหาคำอื่นดูอีกครั้ง</span>`;
      }
    });

    next.addEventListener('click', () => {
      if (finished) { qi = 0; score = 0; render(); return; }
      if (qi < QUIZ.length - 1) { qi++; render(); } else result();
    });

    render();
  }

  /* ---------- Word of the day ---------- */
  function initWotd() {
    const card = $('.wotd');
    if (!card) return;
    const f = {
      word: $('.wotd__word', card), ipa: $('.wotd__ipa', card), pos: $('.wotd__pos', card),
      def: $('.wotd__def', card), th: $('.wotd__th', card), ex: $('.wotd__ex', card)
    };
    const start = new Date(new Date().getFullYear(), 0, 0);
    let i = Math.floor((Date.now() - start) / 864e5) % WORDS.length;
    const fill = () => {
      const w = WORDS[i];
      f.word.textContent = w.word;
      f.ipa.textContent = w.ipa;
      f.pos.textContent = w.pos;
      f.def.textContent = w.def;
      f.th.textContent = w.th;
      f.ex.textContent = `“${w.ex}”`;
    };
    fill();
    $('.wotd__next', card).addEventListener('click', () => {
      i = (i + 1) % WORDS.length;
      if (reduced) { fill(); return; }
      card.classList.add('is-swapping');
      setTimeout(() => { fill(); card.classList.remove('is-swapping'); }, 320);
    });
    $('.wotd__speak', card).addEventListener('click', () => speak(WORDS[i].word));
  }

  /* ---------- Activities rail: drag with inertia ---------- */
  function initRail() {
    const rail = $('.rail');
    if (!rail) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let v = 0;
    let raf = 0;
    rail.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true;
      startX = lastX = e.clientX;
      startLeft = rail.scrollLeft;
      lastT = performance.now();
      v = 0;
      cancelAnimationFrame(raf);
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) rail.classList.add('is-dragging');
      rail.scrollLeft = startLeft - dx;
      const now = performance.now();
      v = ((e.clientX - lastX) / Math.max(1, now - lastT)) * 16;
      lastX = e.clientX;
      lastT = now;
    });
    const up = () => {
      if (!down) return;
      down = false;
      rail.classList.remove('is-dragging');
      if (reduced) return;
      const glide = () => {
        v *= 0.94;
        rail.scrollLeft -= v;
        if (Math.abs(v) > 0.3) raf = requestAnimationFrame(glide);
      };
      raf = requestAnimationFrame(glide);
    };
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    rail.addEventListener('dragstart', (e) => e.preventDefault());

    const stepBy = (dir) => {
      const card = $('.exp', rail);
      const amount = card ? card.getBoundingClientRect().width + 19 : 320;
      rail.scrollBy({ left: dir * amount * (window.innerWidth > 700 ? 2 : 1), behavior: reduced ? 'auto' : 'smooth' });
    };
    const prev = $('.rail-prev');
    const next = $('.rail-next');
    if (prev) prev.addEventListener('click', () => stepBy(-1));
    if (next) next.addEventListener('click', () => stepBy(1));
  }

  /* ---------- Quotes ---------- */
  function initQuotes() {
    const sec = $('.quotes');
    if (!sec) return;
    const quotes = $$('.quote', sec);
    const dots = $$('.quotes__dots button', sec);
    const D = 7000;
    let i = 0;
    let timer = 0;
    sec.style.setProperty('--qd', D + 'ms');
    const go = (n) => {
      quotes[i].classList.remove('is-active');
      dots[i].setAttribute('aria-selected', 'false');
      i = (n + quotes.length) % quotes.length;
      quotes[i].classList.add('is-active');
      dots[i].setAttribute('aria-selected', 'true');
      schedule();
    };
    const schedule = () => {
      clearTimeout(timer);
      if (!reduced) timer = setTimeout(() => go(i + 1), D);
    };
    dots.forEach((d, n) => d.addEventListener('click', () => go(n)));
    schedule();
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    $$('.faq__item').forEach((d) => {
      const summary = $('summary', d);
      const body = $('.faq__a', d);
      summary.addEventListener('click', (e) => {
        if (reduced || !body.animate) return;
        e.preventDefault();
        const opts = { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' };
        if (d.open) {
          const h = body.offsetHeight;
          body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], opts).onfinish = () => { d.open = false; };
        } else {
          d.open = true;
          const h = body.offsetHeight;
          body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], opts);
        }
      });
    });
  }

  /* ---------- Contact: copy + form ---------- */
  function initContact() {
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-copy-key]');
      if (!b) return;
      const text = SITE[b.dataset.copyKey];
      const fallback = () => {
        const el = b.closest('.channel') && $('.channel__value', b.closest('.channel'));
        if (el) {
          const range = document.createRange();
          range.selectNodeContents(el);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        toast('เลือกข้อความไว้แล้ว กด Ctrl/⌘ + C เพื่อคัดลอก');
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => toast('คัดลอกแล้ว: ' + text), fallback);
      } else fallback();
    });

    const form = $('#contact-form');
    if (!form) return;
    const err = $('.form__error', form);
    const submit = $('.form__submit', form);
    const submitLabel = $('span', submit);
    const isContact = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^[0-9+\-\s()]{8,}$/.test(v);

    form.addEventListener('input', (e) => {
      const field = e.target.closest('.field');
      if (field) field.classList.remove('is-invalid');
      err.textContent = '';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      Object.keys(data).forEach((k) => { data[k] = String(data[k]).trim(); });
      const checks = [
        ['f-name', !!data.name, 'กรุณากรอกชื่อ'],
        ['f-contact', isContact(data.contact || ''), 'กรุณากรอกอีเมลหรือเบอร์โทรศัพท์ที่ถูกต้อง'],
        ['f-message', !!data.message, 'กรุณาพิมพ์ข้อความที่ต้องการสอบถาม']
      ];
      const bad = checks.filter((c) => !c[1]);
      checks.forEach(([id, ok]) => document.getElementById(id).closest('.field').classList.toggle('is-invalid', !ok));
      if (bad.length) {
        err.textContent = bad[0][2];
        document.getElementById(bad[0][0]).focus();
        return;
      }

      if (SITE.formEndpoint) {
        submit.disabled = true;
        submitLabel.textContent = 'Sending…';
        try {
          const res = await fetch(SITE.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          toast('ส่งข้อความเรียบร้อยแล้ว ขอบคุณที่ติดต่อ ECAP');
          const r = submit.getBoundingClientRect();
          confetti(r.left + r.width / 2, r.top, 40, 0.9);
        } catch (ex) {
          err.textContent = 'ส่งข้อความไม่สำเร็จ ลองอีกครั้ง หรือส่งอีเมลถึง ' + SITE.email + ' โดยตรง';
        } finally {
          submit.disabled = false;
          submitLabel.textContent = 'Send message';
        }
        return;
      }

      const subject = `[ECAP] ข้อความจาก ${data.name} (${data.role || '-'})`;
      const body = `ชื่อ: ${data.name}\nช่องทางติดต่อกลับ: ${data.contact}\nสถานะ: ${data.role || '-'}\n\n${data.message}`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast('กำลังเปิดแอปอีเมล หากไม่เปิดขึ้น ส่งถึง ' + SITE.email + ' ได้โดยตรง');
    });
  }

  /* ---------- Footer liquid fill + easter egg ---------- */
  function initFooter() {
    const giant = $('.footer__giant');
    if (giant) {
      if (reduced) giant.style.setProperty('--fill', '100%');
      else {
        scrollers.add(() => {
          const r = giant.getBoundingClientRect();
          const vh = window.innerHeight;
          const p = clamp((vh - r.top) / (r.height + vh * 0.25), 0, 1);
          giant.style.setProperty('--fill', (p * 100).toFixed(1) + '%');
        });
      }
    }

    let buf = '';
    document.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('input, textarea, [contenteditable]')) return;
      if (!e.key || e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-4);
      if (buf === 'ecap') {
        buf = '';
        confetti(window.innerWidth / 2, window.innerHeight / 2, 110, 1.7);
        toast('Eloquent · Confident · Articulate · Polished. That’s ECAP.');
      }
    });
  }

  /* =====================================================================
     Boot
     ===================================================================== */
  safe(bindSite);
  safe(initTheme);
  safe(initAnchors);
  safe(initNav);
  safe(initClock);
  safe(initAbout);
  safe(initReveal);
  safe(initField);
  safe(initHero);
  safe(initMarquee);
  safe(initTilt);
  safe(initJourney);
  safe(initCourses);
  safe(initQuiz);
  safe(initWotd);
  safe(initRail);
  safe(initQuotes);
  safe(initFaq);
  safe(initContact);
  safe(initFooter);
  safe(initCursor);
  safe(initMagnetic);

  requestAnimationFrame(frame);
  window.ECAP_READY = true;
  runPreloader(() => {
    root.classList.remove('is-loading');
    root.classList.add('is-loaded');
  });
})();
