const economicData = [
  { Year: 2022, "GDP Growth %": 2.1, "Inflation Rate %": 8.1, "Employment %": 94.5, "Trade Balance $B": 1.2 },
  { Year: 2023, "GDP Growth %": 3.24, "Inflation Rate %": 5.12, "Employment %": 96.8, "Trade Balance $B": 2.4 }
];

let isDataLoaded = false;

window.addEventListener('load', () => loadData());

function loadData() {
  if (isDataLoaded) return;
  updateMetrics();
  updateTable();
  drawCharts();
  isDataLoaded = true;
}

function switchTab(tabName) {
  document.getElementById('overview-tab').classList.add('hidden');
  document.getElementById('analysis-tab').classList.add('hidden');
  document.getElementById('data-tab').classList.add('hidden');
  document.getElementById(tabName + '-tab').classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  if (tabName === 'analysis') setTimeout(drawCharts, 100);
}

function updateMetrics() {
  const metricsGrid = document.getElementById('metricsGrid');
  metricsGrid.innerHTML = '';
  const columns = ["GDP Growth %", "Inflation Rate %", "Employment %", "Trade Balance $B"];
  const icons = ["📈", "💹", "👥", "🌍"];

  columns.forEach((col, idx) => {
    const values = economicData.map(r => r[col]);
    const current = values[values.length - 1];
    const previous = values[values.length - 2];
    const change = ((current - previous) / Math.abs(previous) * 100).toFixed(2);
    const isPositive = change >= 0;

    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML = `
      <div class="metric-header">
        <div class="metric-icon">${icons[idx]}</div>
      </div>
      <div class="metric-label">${col}</div>
      <div class="metric-value">${current.toFixed(2)}</div>
      <div class="metric-change" style="color:${isPositive ? '#10b981':'#ef4444'};">
        ${isPositive ? '📈' : '📉'} ${Math.abs(change)}%
      </div>
    `;
    metricsGrid.appendChild(card);
  });
}

function updateTable() {
  const tableHead = document.getElementById('tableHead');
  const tableBody = document.getElementById('tableBody');

  tableHead.innerHTML = '';
  tableBody.innerHTML = '';

  const columns = Object.keys(economicData[0]);
  const headerRow = document.createElement('tr');
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.appendChild(th);
  });
  tableHead.appendChild(headerRow);

  economicData.forEach(row => {
    const tr = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      const v = row[col];
      td.textContent = typeof v === 'number' ? v.toFixed(2) : v;
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}

function drawLineChart(canvasId, labels, values, color = '#a855f7') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  canvas.width = width * 2;
  canvas.height = height * 2;
  ctx.scale(2, 2);

  ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#1e293b' : '#f9fafb';
  ctx.fillRect(0, 0, width, height);

  const padding = 50;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(...values) * 1.15;
  const minValue = Math.min(...values) * 0.85;
  const range = maxValue - minValue || 1;

  ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#334155' : '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  values.forEach((val, idx) => {
    const x = padding + (chartWidth / (values.length - 1)) * idx;
    const y = height - padding - ((val - minValue) / range) * chartHeight;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawCharts() {
  const chartsGrid = document.getElementById('chartsGrid');
  chartsGrid.innerHTML = '';

  const chartConfigs = [
    { col: "GDP Growth %", icon: "📈", color: "#a855f7" },
    { col: "Inflation Rate %", icon: "💹", color: "#ec4899" },
    { col: "Employment %", icon: "👥", color: "#06b6d4" },
    { col: "Trade Balance $B", icon: "🌍", color: "#10b981" }
  ];

  chartConfigs.forEach((cfg, idx) => {
    const labels = economicData.map(r => r.Year);
    const values = economicData.map(r => r[cfg.col]);

    const card = document.createElement('div');
    card.className = 'chart-card';
    card.innerHTML = `
      <div class="chart-header">
        <div class="chart-title">${cfg.icon} ${cfg.col}</div>
      </div>
      <div class="chart-container">
        <canvas id="chart-${idx}"></canvas>
      </div>
    `;
    chartsGrid.appendChild(card);
    setTimeout(() => drawLineChart(`chart-${idx}`, labels, values, cfg.color), 50);
  });
}
