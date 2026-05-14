/* ── SKILL: Motion-Driven · GPU-accelerated · prefers-reduced-motion safe ── */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── SCROLL PROGRESS ─────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  document.getElementById('scroll-progress').style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

/* ── NAVBAR ──────────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── ACTIVE NAV LINK ─────────────────────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.remove('active'));
    const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
    if (match) match.classList.add('active');
  });
}, { threshold: 0.3, rootMargin: '-68px 0px 0px 0px' }).observe.bind(
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    });
  }, { threshold: 0.3, rootMargin: '-68px 0px 0px 0px' })
);

/* simplified active nav */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.remove('active'));
    const m = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
    if (m) m.classList.add('active');
  });
}, { threshold: 0.3, rootMargin: '-68px 0px 0px 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* ── FADE SECTIONS ───────────────────────────────────────────────────────── */
if (!prefersReducedMotion) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.07 }).observe.bind(
    new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.07 })
  );
}

/* simplified fade */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.07 });
document.querySelectorAll('.fade').forEach(el => {
  if (prefersReducedMotion) el.classList.add('visible');
  else fadeObserver.observe(el);
});

/* ── STAGGERED PROJECT CARDS ─────────────────────────────────────────────── */
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const grid = entry.target;
    grid.querySelectorAll('.card').forEach((card, i) => {
      card.style.setProperty('--stagger', i);
      card.classList.add('visible');
    });
    cardObserver.unobserve(grid);
  });
}, { threshold: 0.05 });

document.querySelectorAll('.grid').forEach(grid => {
  if (prefersReducedMotion) {
    grid.querySelectorAll('.card').forEach(c => c.classList.add('visible'));
  } else {
    cardObserver.observe(grid);
  }
});

/* ── ANIMATED COUNTERS ───────────────────────────────────────────────────── */
new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }
    let current = 0;
    const step = target / 60;
    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) { el.textContent = target + suffix; counterObs.unobserve(el); return; }
    let current = 0;
    const step = target / 60;
    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current < target) requestAnimationFrame(tick);
      else counterObs.unobserve(el);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ── TIMELINE STAGGER ────────────────────────────────────────────────────── */
const timelineObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    const delay = prefersReducedMotion ? 0 : i * 130;
    setTimeout(() => entry.target.classList.add('visible'), delay);
    timelineObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.tl-item').forEach(el => timelineObs.observe(el));

/* ── TYPING EFFECT ───────────────────────────────────────────────────────── */
const roles = [
  'Backend Architect',
  'Technical Lead',
  'System Design Expert',
  'API Engineer',
];
let roleIdx = 0, charIdx = 0, deleting = false;

function type() {
  const current = roles[roleIdx];
  document.getElementById('typing').textContent = current.substring(0, charIdx);
  if (!deleting && charIdx === current.length) {
    deleting = true; setTimeout(type, 1500); return;
  }
  if (deleting && charIdx === 0) {
    deleting = false; roleIdx = (roleIdx + 1) % roles.length;
  }
  charIdx += deleting ? -1 : 1;
  setTimeout(type, deleting ? 42 : 90);
}
type();

/* ── PARTICLES ───────────────────────────────────────────────────────────── */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let particles = [];
const mouse = { x: null, y: null };

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
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
    this.a  = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    if (mouse.x) {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 80) { this.x += dx / 18; this.y += dy / 18; }
    }
  }
  draw() {
    ctx.fillStyle = `rgba(56,189,248,${this.a})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  const count = prefersReducedMotion ? 0 : Math.min(Math.floor(canvas.width * canvas.height / 14000), 90);
  particles = Array.from({ length: count }, () => new Particle());
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 8500) {
        ctx.strokeStyle = `rgba(56,189,248,${0.055 * (1 - d2 / 8500)})`;
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
  if (!prefersReducedMotion) connectParticles();
  requestAnimationFrame(animate);
}
initParticles();
animate();

/* ── CONTACT FORM (Web3Forms) ────────────────────────────────────────────── */
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

    /* loading state */
    btn.disabled = true;
    btnIcon.innerHTML = '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>';
    btnIcon.style.animation = 'spin .8s linear infinite';
    btnText.textContent = 'Sending…';
    errorBox.classList.add('hidden');

    const key = contactForm.querySelector('[name="access_key"]').value;

    /* if key is placeholder, fall back to mailto */
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
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();

      if (data.success) {
        fields.classList.add('hidden');
        success.classList.remove('hidden');
      } else {
        throw new Error(data.message || 'Failed');
      }
    } catch {
      errorBox.classList.remove('hidden');
      btn.disabled = false;
      btnIcon.innerHTML = '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>';
      btnIcon.style.animation = '';
      btnText.textContent = 'Send Message';
    }
  });
}

/* spin keyframe for submit button */
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(spinStyle);
