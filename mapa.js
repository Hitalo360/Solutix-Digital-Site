/* ════════════════════════════════════════════════
   SoluTIx Digital — mapa.js
   Mapa interativo de rotas de atendimento
   ════════════════════════════════════════════════ */

/* ── SEDE ──────────────────────────────────────── */
const SEDE = { lat: -15.7942, lng: -47.8825 };

/* ── DADOS DOS ÓRGÃOS ──────────────────────────── */
const ORGAOS = [
  { id: 1,  nome: 'SEPLAG-AM',  sigla: 'SEPLAG', uf: 'AM', lat: -3.1019,  lng: -60.0250, area: 'Gestão',       cor: '#00a3e0' },
  { id: 2,  nome: 'SEFAZ-PA',   sigla: 'SEFAZ',  uf: 'PA', lat: -1.4558,  lng: -48.5044, area: 'Fazenda',      cor: '#00b894' },
  { id: 3,  nome: 'SEFAZ-CE',   sigla: 'SEFAZ',  uf: 'CE', lat: -3.7172,  lng: -38.5433, area: 'Fazenda',      cor: '#00b894' },
  { id: 4,  nome: 'TCE-PE',     sigla: 'TCE',    uf: 'PE', lat: -8.0476,  lng: -34.8770, area: 'Controle',     cor: '#a78bfa' },
  { id: 5,  nome: 'SEGES-BA',   sigla: 'SEGES',  uf: 'BA', lat: -12.9714, lng: -38.5014, area: 'Gestão',       cor: '#00a3e0' },
  { id: 6,  nome: 'SEFAZ-MG',   sigla: 'SEFAZ',  uf: 'MG', lat: -19.9167, lng: -43.9345, area: 'Fazenda',      cor: '#00b894' },
  { id: 7,  nome: 'TCE-RJ',     sigla: 'TCE',    uf: 'RJ', lat: -22.9068, lng: -43.1729, area: 'Controle',     cor: '#a78bfa' },
  { id: 8,  nome: 'PROCON-SP',  sigla: 'PROCON', uf: 'SP', lat: -23.5505, lng: -46.6333, area: 'Defesa',       cor: '#f59e0b' },
  { id: 9,  nome: 'DETRAN-PR',  sigla: 'DETRAN', uf: 'PR', lat: -25.4290, lng: -49.2671, area: 'Trânsito',     cor: '#f472b6' },
  { id: 10, nome: 'SEFAZ-RS',   sigla: 'SEFAZ',  uf: 'RS', lat: -30.0346, lng: -51.2177, area: 'Fazenda',      cor: '#00b894' },
  { id: 11, nome: 'SEPLAN-MT',  sigla: 'SEPLAN', uf: 'MT', lat: -15.5961, lng: -56.0969, area: 'Planejamento',  cor: '#60a5fa' },
  { id: 12, nome: 'SEGOV-MS',   sigla: 'SEGOV',  uf: 'MS', lat: -20.4697, lng: -54.6201, area: 'Governo',      cor: '#34d399' },
  { id: 13, nome: 'SEFAZ-GO',   sigla: 'SEFAZ',  uf: 'GO', lat: -16.6864, lng: -49.2643, area: 'Fazenda',      cor: '#00b894' },
  { id: 14, nome: 'TCE-TO',     sigla: 'TCE',    uf: 'TO', lat: -10.1689, lng: -48.3336, area: 'Controle',     cor: '#a78bfa' },
  { id: 15, nome: 'SEGER-ES',   sigla: 'SEGER',  uf: 'ES', lat: -20.3155, lng: -40.3128, area: 'Gestão',       cor: '#00a3e0' },
];

/* ── HAVERSINE (km real) ───────────────────────── */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

/* ── CURVA (arco geodésico suave) ──────────────── */
function curva(lat1, lng1, lat2, lng2, passos = 40) {
  const pts = [];
  for (let i = 0; i <= passos; i++) {
    const t = i / passos;
    const lat = lat1 + (lat2 - lat1) * t;
    const lng = lng1 + (lng2 - lng1) * t;
    /* afasta levemente para fora do centro da linha */
    const arco = Math.sin(Math.PI * t) * 1.4;
    const sentido = (lng2 > lng1) ? 1 : -1;
    pts.push([lat + arco * sentido * 0.3, lng]);
  }
  return pts;
}

/* ── ÍCONE SEDE ────────────────────────────────── */
function iconeHQ() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:22px;height:22px;
      background:#f59e0b;
      border:3px solid #fff;
      border-radius:50%;
      box-shadow:0 0 0 6px rgba(245,158,11,0.25),0 0 18px rgba(245,158,11,0.5);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

/* ── ÍCONE ÓRGÃO ───────────────────────────────── */
function iconeOrgao(cor) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;
      background:${cor};
      border:2px solid rgba(255,255,255,0.8);
      border-radius:50%;
      box-shadow:0 0 0 4px ${cor}44;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

/* ── INIT ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* mapa */
  const mapa = L.map('mapa-leaflet', {
    center: [-14.5, -52.0],
    zoom: 4,
    zoomControl: true,
    attributionControl: false,
  });

  /* Expõe globalmente para que main.js possa chamar invalidateSize() */
  window._leafletMap = mapa;

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 14,
  }).addTo(mapa);

  L.control.attribution({ prefix: false })
    .addAttribution('© <a href="https://carto.com" style="color:#00a3e0">CARTO</a> · OSM')
    .addTo(mapa);

  /* marcador sede */
  L.marker([SEDE.lat, SEDE.lng], { icon: iconeHQ(), zIndexOffset: 1000 })
    .addTo(mapa)
    .bindPopup(`
      <div class="popup-titulo">⭐ SoluTIx Digital</div>
      <div class="popup-subtitulo">Brasília · Distrito Federal</div>
      <span class="popup-tag">Sede</span>
    `, { maxWidth: 220 });

  /* estado de seleção */
  let selecionado = null;
  let itemAtivo   = null;
  const cache = {}; /* id → { marker, rota, km } */

  const lista = document.getElementById('lista-orgaos');
  const statKm = document.getElementById('stat-km');

  /* ── CONSTRÓI MARCADORES + ROTAS + LISTA ─────── */
  ORGAOS.forEach(org => {
    const km  = haversine(SEDE.lat, SEDE.lng, org.lat, org.lng);
    const pts = curva(SEDE.lat, SEDE.lng, org.lat, org.lng);

    const rota = L.polyline(pts, {
      color: org.cor,
      weight: 1.8,
      opacity: 0.3,
      dashArray: '6 5',
      smoothFactor: 1,
    }).addTo(mapa);

    const marker = L.marker([org.lat, org.lng], { icon: iconeOrgao(org.cor) })
      .addTo(mapa)
      .bindPopup(`
        <div class="popup-titulo">${org.nome}</div>
        <div class="popup-subtitulo">${org.sigla} · ${org.uf}</div>
        <span class="popup-tag">${org.area}</span>
        <div class="popup-dist">📍 ${km.toLocaleString('pt-BR')} km de Brasília</div>
      `, { maxWidth: 220 });

    marker.on('click', () => selecionar(org.id));
    cache[org.id] = { marker, rota, km, org };

    /* item na lista lateral */
    const item = document.createElement('div');
    item.className = 'orgao-item';
    item.id = `item-${org.id}`;
    item.innerHTML = `
      <div class="orgao-item-dot" style="background:${org.cor}"></div>
      <div class="orgao-item-info">
        <div class="orgao-item-nome">${org.nome}</div>
        <div class="orgao-item-uf">${org.uf} · ${km.toLocaleString('pt-BR')} km</div>
      </div>
    `;
    item.addEventListener('click', () => selecionar(org.id));
    lista.appendChild(item);
  });

  /* ── SELECIONAR ────────────────────────────────── */
  function selecionar(id) {
    /* reset anterior */
    if (selecionado !== null) {
      const prev = cache[selecionado];
      prev.rota.setStyle({ color: prev.org.cor, weight: 1.8, opacity: 0.3, dashArray: '6 5' });
      document.getElementById(`item-${selecionado}`)?.classList.remove('ativo');
    }

    if (selecionado === id) {
      /* clique duplo → deseleciona */
      selecionado = null;
      itemAtivo   = null;
      statKm.textContent = '—';
      return;
    }

    const sel = cache[id];
    if (!sel) return;

    /* destaca rota */
    sel.rota.setStyle({ color: '#f59e0b', weight: 3.5, opacity: 1, dashArray: null });
    sel.rota.bringToFront();

    /* popup + zoom */
    sel.marker.openPopup();
    mapa.fitBounds(
      L.latLngBounds([SEDE.lat, SEDE.lng], [sel.org.lat, sel.org.lng]),
      { padding: [60, 60], maxZoom: 8 }
    );

    /* atualiza UI */
    statKm.textContent = sel.km.toLocaleString('pt-BR');
    document.getElementById(`item-${id}`)?.classList.add('ativo');
    if (itemAtivo) document.getElementById(`item-${itemAtivo}`)?.classList.remove('ativo');

    selecionado = id;
    itemAtivo   = id;
  }

  /* ── ANIMAÇÃO DE ENTRADA ───────────────────────── */
  ORGAOS.forEach((org, i) => {
    setTimeout(() => {
      cache[org.id].rota.setStyle({ opacity: 0.55 });
      setTimeout(() => cache[org.id].rota.setStyle({ opacity: 0.3 }), 350);
    }, 200 + i * 100);
  });
});
