/* ── Motion-Driven Portfolio ── */

const pRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'; // spring easeOutExpo

/* ── SCROLL PROGRESS ── */
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('scroll-progress').style.width = pct + '%';
}, { passive: true });

/* ── NAVBAR SCROLL CLASS ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── ACTIVE NAV LINK ── */
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.classList.remove('active'));
    const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
    if (match) match.classList.add('active');
  });
}, { threshold: 0.3, rootMargin: '-68px 0px 0px 0px' });
document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

/* ── CURSOR GLOW ── */
if (!pRM && window.innerWidth > 900) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let mx = 0, my = 0, gx = 0, gy = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function tick() {
    gx += (mx - gx) * 0.065;
    gy += (my - gy) * 0.065;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(tick);
  })();
}

/* ── HERO GLOW PARALLAX ── */
const hg1 = document.getElementById('hero-glow-1');
const hg2 = document.getElementById('hero-glow-2');
if (!pRM && hg1) {
  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 45;
    const y = (e.clientY / window.innerHeight - 0.5) * 45;
    hg1.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    if (hg2) hg2.style.transform = `translate(calc(-50% + ${-x * 0.7}px), calc(-50% + ${-y * 0.7}px))`;
  }, { passive: true });
}

/* ────────────────────────────────────────────────────────
   SCROLL ANIMATIONS
   Inline styles always beat Tailwind CDN's injected CSS.
   This is intentional — it fixes the Tailwind conflict.
──────────────────────────────────────────────────────── */

function setHidden(el, axis, delay) {
  el.style.opacity    = '0';
  el.style.transform  = axis === 'x' ? 'translateX(-22px)' : 'translateY(30px)';
  el.style.willChange = 'opacity, transform';
  el.style.transition = `opacity 0.7s ${EASE} ${delay}ms, transform 0.7s ${EASE} ${delay}ms`;
}

function setVisible(el) {
  el.style.opacity   = '1';
  el.style.transform = 'none';
  setTimeout(() => { el.style.willChange = 'auto'; }, 900);
}

/* Fade sections */
if (!pRM) {
  document.querySelectorAll('.fade').forEach(el => setHidden(el, 'y', 0));
}
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    setVisible(e.target);
    fadeObs.unobserve(e.target);
  });
}, { threshold: 0.07, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('.fade').forEach(el => fadeObs.observe(el));

/* Staggered cards — set hidden state per-card with delay baked in */
if (!pRM) {
  document.querySelectorAll('.grid').forEach(grid => {
    grid.querySelectorAll('.card').forEach((card, i) => setHidden(card, 'y', i * 70));
  });
}
const gridObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.card').forEach(card => setVisible(card));
    gridObs.unobserve(entry.target);
  });
}, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.grid').forEach(grid => gridObs.observe(grid));

/* Timeline items */
const tlItems = document.querySelectorAll('.tl-item');
if (!pRM) {
  tlItems.forEach(el => setHidden(el, 'x', 0));
}
const tlContainer = document.querySelector('.tl-line');
if (tlContainer) {
  const tlObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      tlItems.forEach((el, i) => setTimeout(() => setVisible(el), i * 150));
      tlObs.unobserve(entry.target);
    });
  }, { threshold: 0.05 });
  tlObs.observe(tlContainer);
}

/* ── ANIMATED COUNTERS (easeOutCubic) ── */
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    counterObs.unobserve(el);
    if (pRM) { el.textContent = target + suffix; return; }
    const t0  = performance.now();
    const dur = 1800;
    const ease = t => 1 - Math.pow(1 - t, 3);
    (function frame(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(ease(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    })(t0);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ── TYPING EFFECT ── */
const roles = ['Backend Architect', 'Technical Lead', 'System Design Expert', 'API Engineer'];
let rIdx = 0, cIdx = 0, deleting = false;
function type() {
  const cur = roles[rIdx];
  document.getElementById('typing').textContent = cur.substring(0, cIdx);
  if (!deleting && cIdx === cur.length) { deleting = true; setTimeout(type, 1500); return; }
  if (deleting && cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
  cIdx += deleting ? -1 : 1;
  setTimeout(type, deleting ? 42 : 90);
}
type();

/* ── PARTICLES ── */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let particles = [];
const mouse = { x: null, y: null };

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.sz = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.a  = Math.random() * 0.45 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    if (mouse.x) {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      if (dx * dx + dy * dy < 7000) { this.x += dx * 0.028; this.y += dy * 0.028; }
    }
  }
  draw() {
    ctx.fillStyle = `rgba(56,189,248,${this.a})`;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2); ctx.fill();
  }
}

function initParticles() {
  if (pRM) { particles = []; return; }
  const n = Math.min(Math.floor(canvas.width * canvas.height / 11000), 100);
  particles = Array.from({ length: n }, () => new Particle());
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 9000) {
        ctx.strokeStyle = `rgba(56,189,248,${0.07 * (1 - d2 / 9000)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  if (!pRM) connectParticles();
  requestAnimationFrame(animate);
}
initParticles();
animate();

/* ── CONTACT FORM (Web3Forms) ── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn      = document.getElementById('submit-btn');
    const btnText  = document.getElementById('btn-text');
    const btnIcon  = document.getElementById('btn-icon');
    const fields   = document.getElementById('form-fields');
    const success  = document.getElementById('form-success');
    const errorBox = document.getElementById('form-error');

    btn.disabled = true;
    btnIcon.innerHTML = '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>';
    btnIcon.style.animation = 'spin .8s linear infinite';
    btnText.textContent = 'Sending…';
    errorBox.classList.add('hidden');

    const key = contactForm.querySelector('[name="access_key"]')?.value;
    if (!key || key === 'YOUR_WEB3FORMS_KEY') {
      const name    = contactForm.querySelector('[name="name"]').value;
      const email   = contactForm.querySelector('[name="email"]').value;
      const subject = contactForm.querySelector('[name="subject"]').value || 'Portfolio Contact';
      const message = contactForm.querySelector('[name="message"]').value;
      window.location.href = `mailto:jadejaaniruddhsinh5456@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`)}`;
      btn.disabled = false;
      btnIcon.innerHTML = '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>';
      btnIcon.style.animation = '';
      btnText.textContent = 'Send Message';
      return;
    }

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        fields.classList.add('hidden');
        success.classList.remove('hidden');
      } else throw new Error();
    } catch {
      errorBox.classList.remove('hidden');
      btn.disabled = false;
      btnIcon.innerHTML = '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>';
      btnIcon.style.animation = '';
      btnText.textContent = 'Send Message';
    }
  });
}

document.head.insertAdjacentHTML('beforeend', '<style>@keyframes spin{to{transform:rotate(360deg)}}</style>');
