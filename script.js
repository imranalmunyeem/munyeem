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

  const getTheme = () => root.getAttribute('data-theme') || 'dark';
  const getAccent = () => root.getAttribute('data-accent') || 'amber';

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
