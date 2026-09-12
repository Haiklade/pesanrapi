/* PesanRapi — Dashboard logic */

seedIfEmpty();
renderAppShell("dashboard");

document.getElementById("greeting").textContent = "Halo, " + getShopName() + " 👋";

function renderStats() {
  const stats = calcDashboardStats();
  document.getElementById("stat-baru").textContent = stats.baru;
  document.getElementById("stat-unpaid").textContent = stats.unpaid;
  document.getElementById("stat-ready").textContent = stats.ready;
  document.getElementById("stat-omzet").textContent = formatRupiah(stats.omzetHariIni);
}

function customerName(customerId) {
  const c = getCustomers().find((x) => x.id === customerId);
  return escapeHtml(c ? c.name : "Pelanggan");
}

function orderProductSummary(order) {
  const items = order.items || [];
  if (items.length === 0) return "-";
  if (items.length === 1) return escapeHtml(items[0].name) + " x" + items[0].qty;
  return escapeHtml(items[0].name) + " +" + (items.length - 1) + " item lain";
}

function renderActionList() {
  const list = document.getElementById("action-order-list");
  const orders = ordersNeedingAction().slice(0, 6);

  if (orders.length === 0) {
    list.innerHTML = `<div class="empty-state card">${ICONS.boxEmpty}<p>Semua pesanan sudah diproses 🎉</p></div>`;
    return;
  }

  list.innerHTML = orders
    .map(
      (o) => `
    <div class="order-row-simple">
      <div>
        <div class="order-no">${o.orderNo}</div>
        <div class="order-customer">${customerName(o.customerId)}</div>
        <div class="order-product">${orderProductSummary(o)}</div>
      </div>
      <div class="order-right">
        <div class="order-total">${formatRupiah(o.total)}</div>
        <div class="order-date">${formatDateShortID(o.date)}</div>
        <span class="badge ${badgeClass(o.status)}">${o.status}</span>
      </div>
    </div>`
    )
    .join("");
}

renderStats();
renderActionList();
