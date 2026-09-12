/* PesanRapi — Halaman Pelanggan: daftar, label loyal, tombol WhatsApp */

seedIfEmpty();
renderAppShell("pelanggan");

const LOYAL_MIN_ORDERS = 3;
const CUSTOMER_FILTERS = ["Semua", "Pelanggan Loyal"];
let custState = { filter: "Semua", search: "" };

function renderCustomerTabs() {
  const wrap = document.getElementById("customer-tabs");
  wrap.innerHTML = CUSTOMER_FILTERS.map(
    (f) => `<button type="button" class="tab-chip ${f === custState.filter ? "active" : ""}" data-filter="${f}">${f}</button>`
  ).join("");
}

document.getElementById("customer-tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-chip");
  if (!btn) return;
  custState.filter = btn.dataset.filter;
  renderCustomerTabs();
  renderCustomers();
});

document.getElementById("search-input").addEventListener("input", (e) => {
  custState.search = e.target.value.trim().toLowerCase();
  renderCustomers();
});

function renderCustomers() {
  const list = document.getElementById("customer-list");
  let customers = getCustomers().map((c) => ({ ...c, ...getCustomerStats(c.id) }));

  customers = customers.filter((c) => c.totalOrders > 0);

  if (custState.filter === "Pelanggan Loyal") {
    customers = customers.filter((c) => c.totalOrders >= LOYAL_MIN_ORDERS);
  }

  if (custState.search) {
    customers = customers.filter(
      (c) => c.name.toLowerCase().includes(custState.search) || c.phone.replace(/\D/g, "").includes(custState.search.replace(/\D/g, ""))
    );
  }

  customers.sort((a, b) => b.totalSpent - a.totalSpent);

  if (customers.length === 0) {
    list.innerHTML = `<div class="empty-state card">${ICONS.users}<p>Belum ada pelanggan yang cocok.</p></div>`;
    return;
  }

  list.innerHTML = customers
    .map((c) => {
      const isLoyal = c.totalOrders >= LOYAL_MIN_ORDERS;
      const waMsg = "Halo " + c.name + ", terima kasih sudah jadi pelanggan " + getShopName() + "! 🙏 Ada pesanan baru yang ingin dibuat?";
      return `
      <div class="customer-card">
        <div class="customer-top">
          <div style="display:flex; gap:10px;">
            <div class="customer-avatar">${escapeHtml(initials(c.name))}</div>
            <div class="customer-name-wrap">
              <span class="customer-name">${escapeHtml(c.name)}</span>
              <span class="customer-phone">${escapeHtml(c.phone)}</span>
              ${isLoyal ? `<span class="badge badge-loyal" style="margin-top:4px;">Pelanggan Loyal</span>` : ""}
            </div>
          </div>
        </div>
        <div class="customer-stats">
          <div class="customer-stat-item">
            <span class="customer-stat-value">${c.totalOrders}</span>
            <span class="customer-stat-label">Total Pesanan</span>
          </div>
          <div class="customer-stat-item">
            <span class="customer-stat-value">${formatRupiah(c.totalSpent)}</span>
            <span class="customer-stat-label">Total Belanja</span>
          </div>
          <div class="customer-stat-item">
            <span class="customer-stat-value">${c.lastOrder ? formatDateShortID(c.lastOrder) : "-"}</span>
            <span class="customer-stat-label">Terakhir Belanja</span>
          </div>
        </div>
        <a class="btn btn-outline btn-sm btn-block" href="${waLinkFromPhone(c.phone, waMsg)}" target="_blank" rel="noopener">
          ${ICONS.chat} Chat WhatsApp
        </a>
      </div>`;
    })
    .join("");
}

renderCustomerTabs();
renderCustomers();
