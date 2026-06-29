// ============================================================
// AI Dashboard — script.js
// Skeleton inicial con datos demo + insights IA (placeholder)
// Reemplazar fetchMetrics() con la API real cuando esté lista.
// ============================================================

const palette = {
  accent: '#0866FF',
  accentSoft: 'rgba(8, 102, 255, 0.15)',
  accentSofter: 'rgba(8, 102, 255, 0.05)',
  positive: '#16A34A',
  warning: '#F59E0B',
  neutral: '#94A3B8',
  text: '#1C1E21',
  muted: '#8A8D91',
  grid: '#E4E6EB',
};

const charts = {};

// ----- Mock data (sustituir con fetch real) -----
function fetchMetrics(rangeDays = 30) {
  const days = Array.from({ length: rangeDays }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (rangeDays - 1 - i));
    return d.toISOString().slice(5, 10);
  });

  // pseudo-random determinístico para que no salte entre regeneraciones
  const seed = (n) => Math.sin(n) * 10000;
  const noise = (n) => Math.abs(seed(n) - Math.floor(seed(n)));

  const organic   = days.map((_, i) => 800 + Math.round(noise(i + 1) * 400));
  const paid      = days.map((_, i) => 500 + Math.round(noise(i + 7) * 350));
  const referral  = days.map((_, i) => 180 + Math.round(noise(i + 13) * 180));
  const direct    = days.map((_, i) => 300 + Math.round(noise(i + 19) * 220));

  const revenue   = days.map((_, i) => 3200 + Math.round(noise(i + 23) * 2400));
  const adSpend   = days.map((_, i) => 1100 + Math.round(noise(i + 29) * 900));

  return {
    days,
    traffic: { organic, paid, referral, direct },
    revenue,
    adSpend,
    kpis: {
      visitors: 48720,
      conversion: 3.42,
      cac: 12.6,
      revenueTotal: 96400,
    },
    funnel: {
      stages: ['Visitas', 'Sesiones con engagement', 'Leads', 'MQL', 'Clientes'],
      values: [48720, 22310, 4180, 1620, 412],
    },
  };
}

// ----- KPIs -----
const fmtNumber = (n) => new Intl.NumberFormat('es-PE').format(n);
const fmtCurrency = (n) => '$ ' + fmtNumber(Math.round(n));
const fmtPct = (n) => n.toFixed(2) + '%';

function renderKpis(kpis) {
  document.getElementById('kpi-visitors').textContent = fmtNumber(kpis.visitors);
  document.getElementById('kpi-conversion').textContent = fmtPct(kpis.conversion);
  document.getElementById('kpi-cac').textContent = fmtCurrency(kpis.cac);
  document.getElementById('kpi-revenue').textContent = fmtCurrency(kpis.revenueTotal);
}

// ----- Charts -----
const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: palette.muted, font: { size: 11 }, boxWidth: 10, boxHeight: 10 },
    },
    tooltip: {
      backgroundColor: '#0A0A0A',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleFont: { size: 12, weight: '600' },
      bodyFont: { size: 12 },
      padding: 10,
      cornerRadius: 6,
    },
  },
  scales: {
    x: { ticks: { color: palette.muted, font: { size: 11 } }, grid: { display: false } },
    y: { ticks: { color: palette.muted, font: { size: 11 } }, grid: { color: palette.grid, drawBorder: false } },
  },
};

function buildTrafficChart(data) {
  const ctx = document.getElementById('trafficChart');
  if (charts.traffic) charts.traffic.destroy();
  charts.traffic = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.days,
      datasets: [
        { label: 'Orgánico',  data: data.traffic.organic,  borderColor: palette.accent,   backgroundColor: palette.accentSofter, tension: 0.35, fill: true, borderWidth: 2, pointRadius: 0 },
        { label: 'Pagado',    data: data.traffic.paid,     borderColor: palette.positive, backgroundColor: 'transparent', tension: 0.35, borderWidth: 2, pointRadius: 0 },
        { label: 'Directo',   data: data.traffic.direct,   borderColor: palette.warning,  backgroundColor: 'transparent', tension: 0.35, borderWidth: 2, pointRadius: 0 },
        { label: 'Referido',  data: data.traffic.referral, borderColor: palette.neutral,  backgroundColor: 'transparent', tension: 0.35, borderWidth: 2, pointRadius: 0 },
      ],
    },
    options: defaultChartOptions,
  });
}

function buildChannelMixChart(data) {
  const ctx = document.getElementById('channelMixChart');
  if (charts.mix) charts.mix.destroy();
  const sum = (arr) => arr.reduce((a, b) => a + b, 0);
  charts.mix = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Orgánico', 'Pagado', 'Directo', 'Referido'],
      datasets: [{
        data: [sum(data.traffic.organic), sum(data.traffic.paid), sum(data.traffic.direct), sum(data.traffic.referral)],
        backgroundColor: [palette.accent, palette.positive, palette.warning, palette.neutral],
        borderWidth: 0,
      }],
    },
    options: {
      ...defaultChartOptions,
      cutout: '65%',
      scales: {},
    },
  });
}

function buildFunnelChart(data) {
  const ctx = document.getElementById('funnelChart');
  if (charts.funnel) charts.funnel.destroy();
  charts.funnel = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.funnel.stages,
      datasets: [{
        label: 'Usuarios',
        data: data.funnel.values,
        backgroundColor: palette.accent,
        borderRadius: 6,
        barThickness: 22,
      }],
    },
    options: {
      ...defaultChartOptions,
      indexAxis: 'y',
      plugins: { ...defaultChartOptions.plugins, legend: { display: false } },
    },
  });
}

function buildRevenueChart(data) {
  const ctx = document.getElementById('revenueChart');
  if (charts.revenue) charts.revenue.destroy();
  charts.revenue = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.days,
      datasets: [
        { label: 'Ingresos',  data: data.revenue, backgroundColor: palette.accent,    borderRadius: 4, barThickness: 8 },
        { label: 'Ad spend', data: data.adSpend, backgroundColor: palette.neutral,   borderRadius: 4, barThickness: 8 },
      ],
    },
    options: defaultChartOptions,
  });
}

// ----- AI insights (placeholder local) -----
// Reemplazar generateInsights() con una llamada a la API de Claude.
async function generateInsights(data) {
  await new Promise(r => setTimeout(r, 600));

  const sum = (arr) => arr.reduce((a, b) => a + b, 0);
  const totalTraffic = sum(data.traffic.organic) + sum(data.traffic.paid) + sum(data.traffic.direct) + sum(data.traffic.referral);
  const organicShare = (sum(data.traffic.organic) / totalTraffic) * 100;
  const roas = sum(data.revenue) / sum(data.adSpend);

  return [
    `<p><strong>Tu motor principal es orgánico</strong>: representa ${organicShare.toFixed(0)}% del tráfico total. Esto es saludable, pero te hace dependiente de Google. Diversificar con un canal pagado optimizado debería ser prioridad del próximo trimestre.</p>`,
    `<p><strong>ROAS de ${roas.toFixed(2)}x</strong>: por cada dólar invertido en ads recuperas $${roas.toFixed(2)}. Está por encima del benchmark de 3x para B2B services, pero la varianza diaria sugiere que hay campañas mal optimizadas que estás compensando con otras buenas.</p>`,
    `<p><strong>Cuello de botella</strong>: el embudo pierde 54% entre Visitas y Sesiones con engagement. Antes de invertir más en adquisición, vale revisar landing pages y primer scroll — ahí está el mayor leverage.</p>`,
    `<p><strong>Sugerencia accionable</strong>: corre un A/B test sobre el hero de la landing de mayor tráfico durante 2 semanas. Con tu volumen actual deberías alcanzar significancia estadística sin sacrificar conversiones.</p>`,
  ].join('');
}

async function renderInsights(data) {
  const el = document.getElementById('aiContent');
  el.innerHTML = '<div class="ai-loading">Generando análisis con IA…</div>';
  const html = await generateInsights(data);
  el.innerHTML = html;
}

// ----- Bootstrap -----
async function render(rangeDays = 30) {
  const data = fetchMetrics(rangeDays);
  renderKpis(data.kpis);
  buildTrafficChart(data);
  buildChannelMixChart(data);
  buildFunnelChart(data);
  buildRevenueChart(data);
  await renderInsights(data);
}

document.addEventListener('DOMContentLoaded', () => {
  const rangeSelect = document.getElementById('rangeSelect');
  const refreshBtn = document.getElementById('refreshBtn');
  const regenerateBtn = document.getElementById('regenerateBtn');

  render(parseInt(rangeSelect.value, 10));

  rangeSelect.addEventListener('change', (e) => render(parseInt(e.target.value, 10)));
  refreshBtn.addEventListener('click', () => render(parseInt(rangeSelect.value, 10)));
  regenerateBtn.addEventListener('click', () => renderInsights(fetchMetrics(parseInt(rangeSelect.value, 10))));
});
