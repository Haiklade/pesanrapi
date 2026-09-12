/* PesanRapi — Halaman Laporan: ringkasan omzet, pesanan, pelanggan, produk terlaris */

seedIfEmpty();
renderAppShell("laporan");

function renderSummary() {
  const stats = periodStats(30);
  document.getElementById("rep-omzet").textContent = formatRupiah(stats.omzet);
  document.getElementById("rep-count").textContent = stats.orderCount;
  document.getElementById("rep-customers").textContent = stats.activeCustomers;

  const top = topProducts(1)[0];
  document.getElementById("rep-top-product").textContent = top ? top.name : "-";
}

function renderChart() {
  if (typeof Chart === "undefined") {
    document.getElementById("omzet-chart").insertAdjacentHTML(
      "afterend",
      `<p class="text-muted" style="text-align:center; padding:20px 0;">Grafik tidak dapat dimuat (koneksi ke CDN gagal).</p>`
    );
    return;
  }

  const days = last7DaysOmzet();
  const ctx = document.getElementById("omzet-chart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: days.map((d) => d.label),
      datasets: [
        {
          label: "Omzet",
          data: days.map((d) => d.total),
          borderColor: "#0d9488",
          backgroundColor: "rgba(13, 148, 136, 0.15)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: "#0d9488",
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => "Rp" + v / 1000 + "rb" },
          grid: { color: "#e2e8e6" },
        },
        x: { grid: { display: false } },
      },
    },
  });
}

function renderTopProducts() {
  const list = document.getElementById("top-products-list");
  const products = topProducts(5);

  if (products.length === 0) {
    list.innerHTML = `<div class="empty-state">${ICONS.boxEmpty}<p>Belum ada data produk.</p></div>`;
    return;
  }

  list.innerHTML = products
    .map(
      (p, i) => `
    <div class="top-product-row">
      <span class="top-product-rank">${i + 1}</span>
      <span class="top-product-name">${escapeHtml(p.name)}</span>
      <span class="top-product-qty">${p.qty} terjual</span>
    </div>`
    )
    .join("");
}

renderSummary();
renderChart();
renderTopProducts();
