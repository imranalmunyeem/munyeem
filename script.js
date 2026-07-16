// Nav: add shadow border when scrolled
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 8) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Fade-in sections on scroll
const sections = document.querySelectorAll('.section, .contact');
sections.forEach(s => s.classList.add('fade-in'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

sections.forEach(s => io.observe(s));

// Theme switcher: mode (dark/light) + accent colour, persisted in localStorage
(function () {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const panel = document.getElementById('themePanel');
  if (!toggleBtn || !panel) return;

  const getTheme = () => root.getAttribute('data-theme') || 'light';
  const getAccent = () => root.getAttribute('data-accent') || 'emerald';

  const syncActive = () => {
    panel.querySelectorAll('[data-mode]').forEach(b =>
      b.classList.toggle('active', b.dataset.mode === getTheme()));
    panel.querySelectorAll('[data-accent]').forEach(b =>
      b.classList.toggle('active', b.dataset.accent === getAccent()));
  };
  syncActive();

  const open = () => { panel.hidden = false; toggleBtn.setAttribute('aria-expanded', 'true'); };
  const close = () => { panel.hidden = true; toggleBtn.setAttribute('aria-expanded', 'false'); };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.hidden ? open() : close();
  });
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== toggleBtn) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  const save = (key, val) => { try { localStorage.setItem(key, val); } catch (e) {} };

  panel.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    root.setAttribute('data-theme', b.dataset.mode);
    save('theme', b.dataset.mode);
    syncActive();
  }));
  panel.querySelectorAll('[data-accent]').forEach(b => b.addEventListener('click', () => {
    root.setAttribute('data-accent', b.dataset.accent);
    save('accent', b.dataset.accent);
    syncActive();
  }));
})();

// ------------------------------------------------------------------
// Dynamic content (no backend needed — public APIs called client-side)
// ------------------------------------------------------------------

const esc = (s) => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Latest dev.to posts in the Blog section
(async function () {
  const box = document.getElementById('devtoPosts');
  if (!box) return;
  try {
    const res = await fetch('https://dev.to/api/articles?username=imranalmunyeem&per_page=4');
    if (!res.ok) return;
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return;
    box.innerHTML = posts.map(p => {
      const tags = (p.tag_list || []).slice(0, 3)
        .map(t => `<span class="tag">${esc(t)}</span>`).join('');
      const reactions = p.positive_reactions_count > 0
        ? ` · ${p.positive_reactions_count} ❤` : '';
      return `<a class="blog-card" href="${esc(p.url)}" target="_blank" rel="noopener">
        <p class="blog-card-meta">${esc(p.readable_publish_date || '')} · ${p.reading_time_minutes || 1} min read${reactions}</p>
        <h3>${esc(p.title)}</h3>
        <p class="blog-card-desc">${esc(p.description || '')}</p>
        <div class="blog-card-tags">${tags}</div>
      </a>`;
    }).join('');
    box.hidden = false;
  } catch (e) { /* API unreachable — keep section hidden */ }
})();

// Recently updated public GitHub repositories
(async function () {
  const wrap = document.getElementById('ghLive');
  const grid = document.getElementById('ghGrid');
  if (!wrap || !grid) return;
  try {
    const res = await fetch('https://api.github.com/users/imranalmunyeem/repos?sort=pushed&per_page=30');
    if (!res.ok) return;
    const repos = await res.json();
    if (!Array.isArray(repos)) return;
    const picks = repos
      .filter(r => !r.fork && r.name.toLowerCase() !== 'imranalmunyeem.github.io')
      .slice(0, 6);
    if (picks.length === 0) return;
    grid.innerHTML = picks.map(r => {
      const stars = r.stargazers_count > 0 ? `<span>★ ${r.stargazers_count}</span>` : '';
      const lang = r.language ? `<span><span class="gh-dot"></span>${esc(r.language)}</span>` : '';
      const when = new Date(r.pushed_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
      return `<a class="gh-card" href="${esc(r.html_url)}" target="_blank" rel="noopener">
        <h4>${esc(r.name)}</h4>
        <p>${esc(r.description || 'No description')}</p>
        <div class="gh-meta">${lang}${stars}<span>Updated ${esc(when)}</span></div>
      </a>`;
    }).join('');
    wrap.hidden = false;
  } catch (e) { /* API unreachable — keep section hidden */ }
})();

// Visitor counter via GoatCounter (privacy-friendly, free).
// To enable: create a free account at https://www.goatcounter.com, choose a
// site code, and put it below (e.g. 'imranalmunyeem').
const GOATCOUNTER_CODE = '';
(function () {
  if (!GOATCOUNTER_CODE) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  document.body.appendChild(s);

  fetch(`https://${GOATCOUNTER_CODE}.goatcounter.com/counter//.json`)
    .then(r => r.ok ? r.json() : null)
    .then(d => {
      const el = document.getElementById('visitCount');
      if (d && d.count && el) {
        el.textContent = `· ${d.count} visits`;
        el.hidden = false;
      }
    })
    .catch(() => {});
})();

// Mobile navigation menu (hamburger)
(function () {
  const navEl = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  if (!navEl || !toggle) return;

  const setOpen = (open) => {
    navEl.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!navEl.classList.contains('menu-open'));
  });

  // Close when a link is tapped, when clicking outside, or on Escape
  navEl.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', (e) => {
    if (navEl.classList.contains('menu-open') && !navEl.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
})();
