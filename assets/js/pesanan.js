/* PesanRapi — Halaman Pesanan: filter, search, CRUD, ubah status */

seedIfEmpty();
renderAppShell("pesanan");

const FILTERS = ["Semua", ...STATUS_ORDER];
let state = { filter: "Semua", search: "" };

/* ---------- Tabs ---------- */

function renderTabs() {
  const wrap = document.getElementById("status-tabs");
  wrap.innerHTML = FILTERS.map(
    (f) => `<button type="button" class="tab-chip ${f === state.filter ? "active" : ""}" data-filter="${f}">${f}</button>`
  ).join("");
}

document.getElementById("status-tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-chip");
  if (!btn) return;
  state.filter = btn.dataset.filter;
  renderTabs();
  renderList();
});

document.getElementById("search-input").addEventListener("input", (e) => {
  state.search = e.target.value.trim().toLowerCase();
  renderList();
});

/* ---------- List rendering ---------- */

function customerById(id) {
  return getCustomers().find((c) => c.id === id) || { name: "Pelanggan", phone: "" };
}

function orderProductSummary(order) {
  const items = order.items || [];
  if (items.length === 0) return "-";
  if (items.length === 1) return escapeHtml(items[0].name) + " x" + items[0].qty;
  return escapeHtml(items[0].name) + " +" + (items.length - 1) + " item lain";
}

function nextStatusActions(status) {
  switch (status) {
    case STATUS.BARU:
      return [
        { label: "Tandai Diproses (Sudah Bayar)", next: STATUS.PROCESS },
        { label: "Tandai Belum Bayar", next: STATUS.UNPAID },
      ];
    case STATUS.UNPAID:
      return [{ label: "Tandai Sudah Bayar", next: STATUS.PROCESS }];
    case STATUS.PROCESS:
      return [{ label: "Tandai Siap Dikirim", next: STATUS.READY }];
    case STATUS.READY:
      return [{ label: "Tandai Selesai", next: STATUS.DONE }];
    default:
      return [];
  }
}

function renderList() {
  const list = document.getElementById("order-list");
  let orders = getOrders().slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  if (state.filter !== "Semua") orders = orders.filter((o) => o.status === state.filter);

  if (state.search) {
    orders = orders.filter((o) => {
      const cust = customerById(o.customerId);
      return cust.name.toLowerCase().includes(state.search) || o.orderNo.toLowerCase().includes(state.search);
    });
  }

  if (orders.length === 0) {
    list.innerHTML = `<div class="empty-state card">${ICONS.boxEmpty}<p>Tidak ada pesanan yang cocok.</p></div>`;
    return;
  }

  list.innerHTML = orders
    .map((o) => {
      const cust = customerById(o.customerId);
      const actions = nextStatusActions(o.status);
      const waMsg = "Halo " + cust.name + ", ini update pesanan " + o.orderNo + " dari " + getShopName() + ": status sekarang *" + o.status + "*. Terima kasih ya! 🙏";
      return `
      <div class="order-row" data-id="${o.id}">
        <div><span class="order-cell-label">No. </span><span class="order-no">${o.orderNo}</span></div>
        <div>
          <div class="order-customer">${escapeHtml(cust.name)}</div>
          <div class="order-customer-phone">${escapeHtml(cust.phone)}</div>
        </div>
        <div><span class="order-cell-label">Produk: </span><span class="order-product">${orderProductSummary(o)}</span></div>
        <div><span class="order-cell-label">Total: </span><span class="order-total">${formatRupiah(o.total)}</span></div>
        <div><span class="order-cell-label">Tanggal: </span><span class="order-date">${formatDateShortID(o.date)}</span></div>
        <div class="order-status-cell"><span class="badge ${badgeClass(o.status)}">${o.status}</span></div>
        <div class="order-actions">
          <button class="icon-btn" data-menu-toggle="${o.id}" aria-label="Menu aksi pesanan ${o.orderNo}">${ICONS.dots}</button>
          <div class="order-menu" id="menu-${o.id}">
            ${actions.map((a) => `<button data-action="status" data-id="${o.id}" data-next="${a.next}">${ICONS.check} ${a.label}</button>`).join("")}
            ${actions.length ? "<hr>" : ""}
            <button data-action="edit" data-id="${o.id}">${ICONS.pencil} Edit Pesanan</button>
            <a href="${waLinkFromPhone(cust.phone, waMsg)}" target="_blank" rel="noopener" data-action="wa">${ICONS.chat} Chat WhatsApp</a>
            <hr>
            <button class="danger" data-action="delete" data-id="${o.id}">${ICONS.trash} Hapus Pesanan</button>
          </div>
        </div>
      </div>`;
    })
    .join("");
}

/* ---------- Menu toggle & row actions ---------- */

function closeAllMenus() {
  document.querySelectorAll(".order-menu.open").forEach((m) => m.classList.remove("open"));
}

document.getElementById("order-list").addEventListener("click", (e) => {
  const toggleBtn = e.target.closest("[data-menu-toggle]");
  if (toggleBtn) {
    const id = toggleBtn.dataset.menuToggle;
    const menu = document.getElementById("menu-" + id);
    const wasOpen = menu.classList.contains("open");
    closeAllMenus();
    if (!wasOpen) menu.classList.add("open");
    return;
  }

  const actionBtn = e.target.closest("[data-action]");
  if (!actionBtn) return;
  const action = actionBtn.dataset.action;
  const id = actionBtn.dataset.id;

  if (action === "status") {
    const next = actionBtn.dataset.next;
    const orders = getOrders();
    const order = orders.find((o) => o.id === id);
    if (order) {
      order.status = next;
      saveOrders(orders);
      showToast("Status pesanan " + order.orderNo + " diubah ke " + next);
    }
    closeAllMenus();
    renderList();
  } else if (action === "wa") {
    closeAllMenus();
  } else if (action === "edit") {
    closeAllMenus();
    openEditModal(id);
  } else if (action === "delete") {
    const orders = getOrders();
    const order = orders.find((o) => o.id === id);
    if (order && confirm("Hapus pesanan " + order.orderNo + "? Tindakan ini tidak bisa dibatalkan.")) {
      saveOrders(orders.filter((o) => o.id !== id));
      showToast("Pesanan " + order.orderNo + " dihapus");
      renderList();
    }
    closeAllMenus();
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".order-actions")) closeAllMenus();
});

/* ---------- Modal: item rows ---------- */

function itemRowTemplate(item) {
  item = item || { name: "", qty: 1, price: 0 };
  return `
    <div class="item-row">
      <input type="text" class="item-name" placeholder="Nama produk" value="${escapeHtml(item.name)}">
      <input type="number" class="item-qty" min="1" value="${item.qty}">
      <input type="number" class="item-price" min="0" step="1000" placeholder="Harga" value="${item.price || ""}">
      <button type="button" class="item-remove" aria-label="Hapus item">${ICONS.trash}</button>
    </div>`;
}

function addItemRow(item) {
  document.getElementById("item-rows").insertAdjacentHTML("beforeend", itemRowTemplate(item));
}

document.getElementById("item-rows").addEventListener("input", recalcTotal);

document.getElementById("item-rows").addEventListener("click", (e) => {
  if (e.target.closest(".item-remove")) {
    const rows = document.querySelectorAll("#item-rows .item-row");
    if (rows.length > 1) e.target.closest(".item-row").remove();
    recalcTotal();
  }
});

document.getElementById("add-item-btn").addEventListener("click", () => addItemRow());

function recalcTotal() {
  let total = 0;
  document.querySelectorAll("#item-rows .item-row").forEach((row) => {
    const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
    const price = parseFloat(row.querySelector(".item-price").value) || 0;
    total += qty * price;
  });
  document.getElementById("f-total-display").value = formatRupiah(total);
  return total;
}

/* ---------- Modal: open/save ---------- */

function resetForm() {
  document.getElementById("order-form").reset();
  document.getElementById("f-order-id").value = "";
  document.getElementById("item-rows").innerHTML = "";
  addItemRow();
  document.getElementById("f-date").value = toISODate(new Date());
  document.getElementById("f-status").value = STATUS.BARU;
  recalcTotal();
}

function openAddModal() {
  resetForm();
  document.getElementById("modal-title").textContent = "Tambah Pesanan";
  openModal("order-modal");
}

function openEditModal(id) {
  const order = getOrders().find((o) => o.id === id);
  if (!order) return;
  const cust = customerById(order.customerId);

  resetForm();
  document.getElementById("modal-title").textContent = "Edit Pesanan";
  document.getElementById("f-order-id").value = order.id;
  document.getElementById("f-customer-name").value = cust.name;
  document.getElementById("f-customer-phone").value = cust.phone;
  document.getElementById("f-date").value = order.date;
  document.getElementById("f-status").value = order.status;

  document.getElementById("item-rows").innerHTML = "";
  (order.items.length ? order.items : [{ name: "", qty: 1, price: 0 }]).forEach(addItemRow);
  recalcTotal();

  openModal("order-modal");
}

document.getElementById("open-add-btn").addEventListener("click", openAddModal);

document.getElementById("order-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("f-customer-name").value.trim();
  const phone = document.getElementById("f-customer-phone").value.trim();
  const date = document.getElementById("f-date").value;
  const status = document.getElementById("f-status").value;
  const orderId = document.getElementById("f-order-id").value;

  const items = Array.from(document.querySelectorAll("#item-rows .item-row"))
    .map((row) => ({
      name: row.querySelector(".item-name").value.trim(),
      qty: parseFloat(row.querySelector(".item-qty").value) || 0,
      price: parseFloat(row.querySelector(".item-price").value) || 0,
    }))
    .filter((it) => it.name && it.qty > 0);

  if (items.length === 0) {
    showToast("Isi minimal satu item produk ya");
    return;
  }

  const total = items.reduce((s, it) => s + it.qty * it.price, 0);
  const customerId = findOrCreateCustomer(name, phone);
  const orders = getOrders();

  if (orderId) {
    const order = orders.find((o) => o.id === orderId);
    Object.assign(order, { customerId, date, status, items, total });
    showToast("Pesanan " + order.orderNo + " diperbarui");
  } else {
    const orderNo = nextOrderNo();
    orders.push({
      id: "ord-" + Date.now(),
      orderNo,
      customerId,
      date,
      status,
      items,
      total,
      note: "",
    });
    showToast("Pesanan " + orderNo + " ditambahkan");
  }

  saveOrders(orders);
  closeModal("order-modal");
  renderTabs();
  renderList();
});

/* ---------- Init ---------- */

renderTabs();
renderList();

const urlParams = new URLSearchParams(location.search);
if (urlParams.get("new") === "1") {
  openAddModal();
  history.replaceState(null, "", "pesanan.html");
}
