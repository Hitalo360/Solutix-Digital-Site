/* ════════════════════════════════════════════════
   SoluTIx Digital — main.js
   Scroll reveal, menu mobile e utilitários gerais
   ════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── SCROLL REVEAL ─────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');

          /* Se o mapa Leaflet estiver dentro deste elemento, invalidar o tamanho
             para que ele recalcule as dimensões corretamente após o reveal */
          const mapaEl = entry.target.querySelector('#mapa-leaflet');
          if (mapaEl && window._leafletMap) {
            setTimeout(() => window._leafletMap.invalidateSize(), 100);
          }
        }, i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ── HEADER SCROLL ─────────────────────────────── */
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 60
      ? 'rgba(0,32,92,0.98)'
      : 'rgba(0,32,92,0.93)';
  });

  /* ── MENU HAMBÚRGUER ───────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const aberto = toggle.classList.toggle('aberto');
      nav.classList.toggle('aberta', aberto);
      toggle.setAttribute('aria-expanded', aberto);
      document.body.style.overflow = aberto ? 'hidden' : '';
    });

    /* Fechar ao clicar em qualquer link do menu */
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('aberto');
        nav.classList.remove('aberta');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Fechar com ESC */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('aberta')) {
        toggle.classList.remove('aberto');
        nav.classList.remove('aberta');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── TABS DE SERVIÇOS (servicos.html) ──────────── */
  const tabs  = document.querySelectorAll('.srv-tab');
  const cards = document.querySelectorAll('.srv-card');

  if (tabs.length && cards.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('ativo'));
        tab.classList.add('ativo');

        const filtro = tab.dataset.filtro;
        cards.forEach(card => {
          if (filtro === 'todos' || card.dataset.area === filtro) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    /* Ativar "Todos" por padrão */
    const tabTodos = document.querySelector('.srv-tab[data-filtro="todos"]');
    if (tabTodos) tabTodos.classList.add('ativo');
  }

});
