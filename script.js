/* ═══════════════════════════════════════
   Portfolio v2 — Enhanced Animation Engine
   ═══════════════════════════════════════ */

/* ── Section loader ── */
async function loadSections() {
  const mounts = document.querySelectorAll('[data-section]');
  const loads = Array.from(mounts).map(async el => {
    const name = el.dataset.section;
    try {
      const res = await fetch(`sections/${name}.html`);
      if (!res.ok) throw new Error(`${res.status}`);
      el.innerHTML = await res.text();
    } catch (e) {
      console.warn(`Section "${name}" failed:`, e);
    }
  });
  await Promise.all(loads);
  initAll();
  /* Trigger creamy page fade-in once everything is wired */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add('loaded'));
  });
}

/* ── CSS scroll-driven support check ── */
const CSS_SCROLL_DRIVEN = CSS.supports('animation-timeline', 'view()');

/* ── Exempt hero elements from CSS view() reveal on first paint ── */
function exemptHeroFromScrollReveal() {
  const heroSelectors = [
    '.hero-first', '.hero-last', '.hero-name', '.hero-terminal',
    '.status-badge', '.hero-sub', '.hero-tagline', '.hero-stats',
    '.hero-btns', '.hero-socials', '.hero-layout', '.hero-text'
  ];
  heroSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.remove('reveal', 'reveal-left', 'reveal-right', 'reveal-scale');
    });
  });
}

/* ── Master init (order matters) ── */
function initAll() {
  exemptHeroFromScrollReveal();
  initSmoothScroll();
  initScrollBar();       /* JS fallback — skipped if CSS scroll-driven active */
  initNavbar();
  initWordSplit();
  initScrollReveal();    /* JS fallback — skipped if CSS scroll-driven active */
  initParallax();        /* JS fallback — skipped if CSS scroll-driven active */
  initScrollDots();
  initSectionCounter();
  initTyping();
  initCounters();
  initMagneticButtons();
  init3DTilt();
  initMarquee();
  initProjectFilter();
  initContactForm();
  initMobileMenu();
  initHeroCanvas();
  initAvatarFallback();
  initHero3D();
  initCodeGlow();
}

/* ═══════════════════════════════════════
   SMOOTH LERP SCROLL
   ═══════════════════════════════════════ */
function initSmoothScroll() {
  /* Intercept anchor clicks and use smooth-scroll with lerp feel */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80; /* navbar height + breathing room */
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      smoothScrollTo(y, 900);
    });
  });
}

function smoothScrollTo(targetY, duration = 900) {
  const startY   = window.scrollY;
  const diff     = targetY - startY;
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    /* Expo ease-out — feels physical */
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    window.scrollTo(0, startY + diff * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════
   SCROLL PROGRESS BAR — JS fallback only
   CSS scroll-driven handles it natively when supported
   ═══════════════════════════════════════ */
function initScrollBar() {
  if (CSS_SCROLL_DRIVEN) return; /* CSS handles it */
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  bar.style.width = '0%';
  bar.style.transform = 'none';
  const update = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ═══════════════════════════════════════
   NAVBAR SCROLL + ACTIVE LINK
   ═══════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  const links    = document.querySelectorAll('.nav-link, .nav-mobile a');
  const sections = ['about', 'projects', 'experience', 'contact'];

  function updateActive() {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 130) current = id;
    });
    links.forEach(a => {
      const href = a.getAttribute('href')?.replace('#', '');
      a.classList.toggle('active', href === current);
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}


/* ═══════════════════════════════════════
   WORD SPLIT — section headings animate word-by-word
   ═══════════════════════════════════════ */
function initWordSplit() {
  document.querySelectorAll('.section-h').forEach(el => {
    /* Skip headings that opt out (custom inner markup) */
    if (el.hasAttribute('data-no-split')) return;
    const html = el.innerHTML;
    /* Wrap each word in a split container */
    el.innerHTML = html.replace(/(\S+)/g, (word) =>
      `<span class="split-word"><span class="inner">${word}</span></span>`
    ).replace(/(\s+)/g, '$1');
    el.dataset.split = 'true';
  });
}

/* ═══════════════════════════════════════
   SCROLL REVEAL — JS fallback (IntersectionObserver)
   Skipped when CSS animation-timeline: view() is supported
   ═══════════════════════════════════════ */
function initScrollReveal() {
  if (CSS_SCROLL_DRIVEN) {
    /* CSS handles reveals — still need to show avatar col and split words */
    document.querySelectorAll('.hero-avatar-col').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    /* Make split-word inners visible immediately (CSS view() handles headings) */
    document.querySelectorAll('[data-split] .split-word').forEach((w, i) => {
      w.style.transitionDelay = `${i * 60}ms`;
      w.classList.add('visible');
    });
    return;
  }

  /* JS fallback for older browsers */
  const targets = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .tl-item, .hero-avatar-col, .split-word'
  );
  if (!targets.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('visible');
      if (el.dataset.split) {
        el.querySelectorAll('.split-word').forEach((w, i) => {
          w.style.transitionDelay = `${i * 60}ms`;
          w.classList.add('visible');
        });
      }
      obs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════
   PARALLAX — JS fallback only
   CSS animation-timeline: scroll() handles it when supported
   ═══════════════════════════════════════ */
function initParallax() {
  if (CSS_SCROLL_DRIVEN) return;

  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  const orb3 = document.querySelector('.hero-orb-3');
  const grid = document.querySelector('.hero-grid');
  const hero = document.getElementById('hero-section');
  if (!hero) return;

  let ticking = false;
  function update() {
    const p = Math.min(window.scrollY / hero.offsetHeight, 1);
    if (orb1) orb1.style.transform = `translate(-50%,-50%) translateY(${p * -60}px)`;
    if (orb2) orb2.style.transform = `translate(-50%,-50%) translateY(${p * -40}px)`;
    if (orb3) orb3.style.transform = `translate(-50%,-50%) translateY(${p * -20}px)`;
    if (grid) grid.style.transform  = `translateY(${p * 30}px)`;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

/* ═══════════════════════════════════════
   SECTION PROGRESS DOTS
   ═══════════════════════════════════════ */
function initScrollDots() {
  const dots    = document.querySelectorAll('.sdot');
  const sections = ['about', 'projects', 'experience', 'contact'];
  if (!dots.length) return;

  /* Wire smooth-scroll on dot click */
  dots.forEach(dot => {
    dot.addEventListener('click', e => {
      e.preventDefault();
      const id = dot.getAttribute('href')?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - 80, 900);
    });
  });

  function updateDots() {
    const scrollMid = window.scrollY + window.innerHeight * 0.45;
    let active = '';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && scrollMid >= el.offsetTop) active = id;
    });

    dots.forEach(dot => {
      const href = dot.getAttribute('href')?.slice(1);
      dot.classList.toggle('active', href === active);
    });
  }

  window.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
}

/* ═══════════════════════════════════════
   SECTION COUNTER  (01 / 05 … 05 / 05)
   ═══════════════════════════════════════ */
function initSectionCounter() {
  const numEl   = document.getElementById('sec-num');
  if (!numEl) return;

  const stops = [
    { id: null,         num: '00' }, /* Hero */
    { id: 'about',      num: '01' },
    { id: 'projects',   num: '02' },
    { id: 'experience', num: '03' },
    { id: 'contact',    num: '04' },
  ];

  let prev = '00';

  function update() {
    const scrollMid = window.scrollY + window.innerHeight * 0.45;
    let current = '00';

    stops.forEach(({ id, num }) => {
      if (!id) { current = num; return; }
      const el = document.getElementById(id);
      if (el && scrollMid >= el.offsetTop) current = num;
    });

    if (current !== prev) {
      numEl.style.opacity   = '0';
      numEl.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        numEl.textContent     = current;
        numEl.style.opacity   = '1';
        numEl.style.transform = 'translateY(0)';
      }, 150);
      prev = current;
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ═══════════════════════════════════════
   TYPING EFFECT
   ═══════════════════════════════════════ */
function initTyping() {
  const el = document.getElementById('typing');
  if (!el) return;
  const roles = [
    'Technical Lead',
    'Backend Architect',
    'Laravel Specialist',
    'Systems Designer',
    'Team Lead · 9+ Years',
  ];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const role = roles[ri];
    if (deleting) {
      el.textContent = role.slice(0, ci--);
      if (ci < 0) { deleting=false; ri=(ri+1)%roles.length; ci=0; setTimeout(tick, 480); return; }
      setTimeout(tick, 38);
    } else {
      el.textContent = role.slice(0, ci++);
      if (ci > role.length) { deleting=true; setTimeout(tick, 2200); return; }
      setTimeout(tick, 65);
    }
  }
  setTimeout(tick, 900);
}

/* ═══════════════════════════════════════
   NUMBER COUNTER
   ═══════════════════════════════════════ */
function initCounters() {
  const els = document.querySelectorAll('.counter');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target   = parseInt(el.dataset.target || '0');
      const suffix   = el.dataset.suffix || '';
      const duration = 1600;
      const start    = performance.now();
      (function step(now) {
        const p      = Math.min((now - start) / duration, 1);
        const eased  = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target) + (p>=1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step);
      })(start);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════
   MAGNETIC BUTTONS
   ═══════════════════════════════════════ */
function initMagneticButtons() {
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    let raf;
    btn.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r  = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width/2))  * 0.32;
        const dy = (e.clientY - (r.top  + r.height/2)) * 0.32;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    });
    btn.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      btn.style.transform = '';
    });
  });
}

/* ═══════════════════════════════════════
   3D CARD TILT
   ═══════════════════════════════════════ */
function init3DTilt() {
  document.querySelectorAll('.project-card, [data-tilt]').forEach(card => {
    let raf;
    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x*9}deg) rotateX(${-y*9}deg) translateZ(6px)`;
        card.style.boxShadow = `${-x*20}px ${-y*20}px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(56,189,248,0.15)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* ═══════════════════════════════════════
   MARQUEE — duplicate for seamless loop
   ═══════════════════════════════════════ */
function initMarquee() {
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });
}

/* ═══════════════════════════════════════
   PROJECT FILTER
   ═══════════════════════════════════════ */
function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-domain]');
  if (!btns.length || !cards.length) return;

  /* Group map: filter label → what data-domain or data-group to match */
  const groupMap = {
    all:          null,
    Fintech:      { field: 'domain',  val: 'Fintech'     },
    Healthcare:   { field: 'domain',  val: 'Healthcare'  },
    IoT:          { field: 'domain',  val: 'IoT'         },
    'E-Commerce': { field: 'domain',  val: 'E-Commerce'  },
    Platform:     { field: 'group',   val: 'Platform'    },
  };

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;

      /* Update active state */
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const rule   = groupMap[filter];

      cards.forEach((card, i) => {
        const match = !rule
          || card.dataset[rule.field] === rule.val;

        if (match) {
          /* Already visible or becoming visible */
          card.style.transition = `opacity 350ms ease ${i * 40}ms, transform 400ms cubic-bezier(0.22,1,0.36,1) ${i * 40}ms`;
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.94) translateY(12px)';
          card.style.display    = '';
          /* Force reflow, then animate in */
          void card.offsetHeight;
          card.style.opacity   = '1';
          card.style.transform = '';
        } else {
          card.style.transition = 'opacity 220ms ease, transform 220ms ease';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.92)';
          /* Hide after fade */
          const t = setTimeout(() => {
            card.style.display = 'none';
          }, 230);
          card._filterTimer = t;
        }
      });

      /* Update count badge on All button */
      const allBtn = document.querySelector('.filter-btn[data-filter="all"] .filter-count');
      if (allBtn) {
        const visible = [...cards].filter(c =>
          !rule || c.dataset[rule.field] === rule.val
        ).length;
        allBtn.textContent = visible;
      }
    });
  });

  /* Re-init tilt on filtered cards */
  document.querySelector('.projects-grid')?.addEventListener('click', () => {
    /* Refresh 3D tilt for newly-shown cards */
    setTimeout(init3DTilt, 300);
  });
}

/* ═══════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = document.getElementById('submit-btn');
    const txt  = document.getElementById('btn-text');
    const succ = document.getElementById('form-success');
    const err  = document.getElementById('form-error');
    err.classList.remove('show');
    btn.disabled = true;
    txt.textContent = 'Sending…';
    try {
      const res  = await fetch('https://api.web3forms.com/submit', { method:'POST', body: new FormData(form) });
      const json = await res.json();
      if (json.success) {
        document.getElementById('form-fields').style.display = 'none';
        succ.classList.add('show');
      } else throw new Error();
    } catch {
      err.classList.add('show');
      btn.disabled = false;
      txt.textContent = 'Send Message';
    }
  });
}

/* ═══════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════ */
function initMobileMenu() {
  const btn    = document.getElementById('hamburger');
  const mobile = document.getElementById('nav-mobile');
  if (!btn || !mobile) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    mobile.setAttribute('aria-hidden', String(open));
  });
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    btn.setAttribute('aria-expanded', 'false');
    mobile.setAttribute('aria-hidden', 'true');
  }));
}

/* ═══════════════════════════════════════
   HERO CANVAS — particles + connections + meteors
   ═══════════════════════════════════════ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  /* ── Resize ── */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Particles (network nodes) ── */
  const PCOUNT  = 60;
  const MAXDIST = 130;

  class Dot {
    constructor() { this.reset(); this.y = Math.random() * H; }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.vx    = (Math.random() - 0.5) * 0.4;
      this.vy    = (Math.random() - 0.5) * 0.4;
      this.r     = Math.random() * 1.6 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.15;
      this.color = Math.random() < 0.7 ? '56,189,248' : Math.random() < 0.5 ? '129,140,248' : '192,132,252';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -10) this.x = W + 10;
      if (this.x > W+10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H+10) this.y = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  const dots = Array.from({ length: PCOUNT }, () => new Dot());

  function drawConnections() {
    for (let i = 0; i < dots.length; i++) {
      for (let j = i+1; j < dots.length; j++) {
        const dx   = dots[i].x - dots[j].x;
        const dy   = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAXDIST) {
          const alpha = (1 - dist/MAXDIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  /* ── Meteors / shooting stars ── */
  class Meteor {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x     = Math.random() * W * 1.5;
      this.y     = init ? Math.random() * -H : Math.random() * -200;
      this.len   = Math.random() * 120 + 60;
      this.speed = Math.random() * 6 + 4;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.7 + 0.3;
      this.width = Math.random() * 1.2 + 0.5;
      this.fade  = 0;
    }
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.fade += 0.04;
      if (this.fade < 0.3) {
        this.alpha = (this.fade / 0.3) * this.maxAlpha;
      } else if (this.fade < 0.7) {
        this.alpha = this.maxAlpha;
      } else {
        this.alpha = ((1 - this.fade) / 0.3) * this.maxAlpha;
      }
      if (this.y > H + 20 || this.x > W + 20 || this.fade >= 1) this.reset();
    }
    draw() {
      const grad = ctx.createLinearGradient(
        this.x, this.y,
        this.x - Math.cos(this.angle) * this.len,
        this.y - Math.sin(this.angle) * this.len
      );
      grad.addColorStop(0, `rgba(255,255,255,${this.alpha})`);
      grad.addColorStop(0.3, `rgba(56,189,248,${this.alpha * 0.7})`);
      grad.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - Math.cos(this.angle) * this.len,
        this.y - Math.sin(this.angle) * this.len
      );
      ctx.strokeStyle = grad;
      ctx.lineWidth   = this.width;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }
  }

  /* Spawn meteors every 2-5s */
  const meteors = [];
  function spawnMeteor() {
    meteors.push(new Meteor());
    if (meteors.length > 6) meteors.shift();
    setTimeout(spawnMeteor, Math.random() * 3000 + 1500);
  }
  setTimeout(spawnMeteor, 1000);

  /* ── Render loop ── */
  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    dots.forEach(d => { d.update(); d.draw(); });
    meteors.forEach(m => { m.update(); m.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ═══════════════════════════════════════
   AVATAR FALLBACK — show monogram if no image
   ═══════════════════════════════════════ */
function initAvatarFallback() {
  const img = document.querySelector('.avatar-img');
  const fallback = document.getElementById('avatar-fallback');
  if (!img || !fallback) return;

  /* If image already failed to load (onerror fires before JS) */
  if (!img.complete || img.naturalWidth === 0) {
    img.style.display = 'none';
    fallback.style.display = 'flex';
  }
}

/* ═══════════════════════════════════════
   HERO 3D — mouse-tracked tilt, spotlight, parallax depth
   ═══════════════════════════════════════ */
function initHero3D() {
  const hero = document.getElementById('hero-section');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tilt = hero.querySelector('[data-tilt-3d]');

  /* Target (raw mouse) and current (lerped) values for buttery follow */
  const target = { mx: 50, my: 50, px: 0, py: 0 };
  const current = { mx: 50, my: 50, px: 0, py: 0 };
  let active = false;
  let rafId = null;

  const LERP = 0.12;  /* lower = creamier, higher = snappier */

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    current.mx = lerp(current.mx, target.mx, LERP);
    current.my = lerp(current.my, target.my, LERP);
    current.px = lerp(current.px, target.px, LERP);
    current.py = lerp(current.py, target.py, LERP);

    hero.style.setProperty('--mx', `${current.mx.toFixed(2)}%`);
    hero.style.setProperty('--my', `${current.my.toFixed(2)}%`);
    hero.style.setProperty('--px', current.px.toFixed(3));
    hero.style.setProperty('--py', current.py.toFixed(3));

    if (tilt) {
      const rotY = current.px *  10;
      const rotX = current.py * -10;
      tilt.style.transform =
        `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translateZ(0)`;
    }

    /* Continue animating until close to rest */
    const dx = Math.abs(current.px - target.px);
    const dy = Math.abs(current.py - target.py);
    const dmx = Math.abs(current.mx - target.mx);
    const dmy = Math.abs(current.my - target.my);
    if (dx + dy + dmx + dmy > 0.05) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function kick() {
    if (rafId == null) rafId = requestAnimationFrame(tick);
  }

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    target.mx = (x / r.width)  * 100;
    target.my = (y / r.height) * 100;
    target.px = (x / r.width)  * 2 - 1;
    target.py = (y / r.height) * 2 - 1;
    if (!active) { hero.classList.add('hero-active'); active = true; }
    kick();
  });

  hero.addEventListener('mouseleave', () => {
    target.px = 0;
    target.py = 0;
    hero.classList.remove('hero-active');
    active = false;
    kick();
  });

  /* Device-orientation fallback for touch — subtle tilt from device gyroscope */
  if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
    window.addEventListener('deviceorientation', e => {
      target.px = Math.max(-1, Math.min(1, (e.gamma || 0) / 45));
      target.py = Math.max(-1, Math.min(1, (e.beta  || 0) / 90));
      hero.classList.add('hero-active');
      kick();
    }, { passive: true });
  }
}

/* ═══════════════════════════════════════
   CODE WINDOW — radial glow follows cursor
   ═══════════════════════════════════════ */
function initCodeGlow() {
  document.querySelectorAll('.code-window').forEach(win => {
    let raf;
    win.addEventListener('mousemove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = win.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width)  * 100;
        const y = ((e.clientY - r.top)  / r.height) * 100;
        win.style.setProperty('--cgx', `${x}%`);
        win.style.setProperty('--cgy', `${y}%`);
      });
    });
  });
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', loadSections);
