/* =========================================================
   PesanRapi — Data layer (localStorage sebagai "database" demo)
   ========================================================= */

const STORE_KEY = {
  orders: "pesanrapi_orders",
  customers: "pesanrapi_customers",
  seeded: "pesanrapi_seeded_v1",
  shopName: "pesanrapi_shop_name",
};

const STATUS = {
  BARU: "Baru",
  UNPAID: "Belum Bayar",
  PROCESS: "Diproses",
  READY: "Siap Dikirim",
  DONE: "Selesai",
};

const STATUS_ORDER = [STATUS.BARU, STATUS.UNPAID, STATUS.PROCESS, STATUS.READY, STATUS.DONE];

/* ---------- Utilities ---------- */

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function formatRupiah(amount) {
  return "Rp" + Math.round(amount).toLocaleString("id-ID");
}

function toISODate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
}

function formatDateID(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateShortID(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function isToday(iso) {
  return iso === toISODate(new Date());
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function badgeClass(status) {
  switch (status) {
    case STATUS.BARU: return "badge-baru";
    case STATUS.UNPAID: return "badge-unpaid";
    case STATUS.PROCESS: return "badge-process";
    case STATUS.READY: return "badge-ready";
    case STATUS.DONE: return "badge-done";
    default: return "badge-baru";
  }
}

function waLinkFromPhone(phone, message) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
  return "https://wa.me/" + normalized + "?text=" + encodeURIComponent(message);
}

/* ---------- Storage access ---------- */

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY.orders)) || [];
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORE_KEY.orders, JSON.stringify(orders));
}

function getCustomers() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY.customers)) || [];
  } catch (e) {
    return [];
  }
}

function saveCustomers(customers) {
  localStorage.setItem(STORE_KEY.customers, JSON.stringify(customers));
}

function getShopName() {
  return localStorage.getItem(STORE_KEY.shopName) || "Toko Kue Naya";
}

function nextOrderNo() {
  const orders = getOrders();
  const max = orders.reduce((m, o) => {
    const n = parseInt(String(o.orderNo).split("-").pop(), 10);
    return isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return "PR-" + String(max + 1).padStart(4, "0");
}

function findOrCreateCustomer(name, phone) {
  const customers = getCustomers();
  const cleanPhone = phone.replace(/\D/g, "");
  let existing = customers.find((c) => c.phone.replace(/\D/g, "") === cleanPhone);
  if (existing) {
    existing.name = name;
    saveCustomers(customers);
    return existing.id;
  }
  const id = "cust-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  customers.push({ id, name, phone });
  saveCustomers(customers);
  return id;
}

function getCustomerStats(customerId) {
  const orders = getOrders().filter((o) => o.customerId === customerId);
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const lastOrder = orders.reduce((latest, o) => (!latest || o.date > latest ? o.date : latest), null);
  return { totalOrders, totalSpent, lastOrder };
}

/* ---------- Aggregates ---------- */

function calcDashboardStats() {
  const orders = getOrders();
  const today = toISODate(new Date());
  const baru = orders.filter((o) => o.status === STATUS.BARU).length;
  const unpaid = orders.filter((o) => o.status === STATUS.UNPAID).length;
  const ready = orders.filter((o) => o.status === STATUS.READY).length;
  const omzetHariIni = orders
    .filter((o) => o.date === today && o.status !== STATUS.UNPAID)
    .reduce((s, o) => s + o.total, 0);
  return { baru, unpaid, ready, omzetHariIni };
}

function ordersNeedingAction() {
  return getOrders()
    .filter((o) => o.status === STATUS.BARU || o.status === STATUS.UNPAID)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function last7DaysOmzet() {
  const orders = getOrders();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const iso = daysAgoISO(i);
    const total = orders
      .filter((o) => o.date === iso && o.status !== STATUS.UNPAID)
      .reduce((s, o) => s + o.total, 0);
    days.push({ date: iso, label: formatDateShortID(iso), total });
  }
  return days;
}

function topProducts(limit = 5) {
  const orders = getOrders();
  const map = {};
  orders.forEach((o) => {
    (o.items || []).forEach((it) => {
      map[it.name] = (map[it.name] || 0) + it.qty;
    });
  });
  return Object.entries(map)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit);
}

function periodStats(days = 30) {
  const orders = getOrders();
  const cutoff = daysAgoISO(days - 1);
  const inPeriod = orders.filter((o) => o.date >= cutoff);
  const omzet = inPeriod.filter((o) => o.status !== STATUS.UNPAID).reduce((s, o) => s + o.total, 0);
  const orderCount = inPeriod.length;
  const activeCustomers = new Set(inPeriod.map((o) => o.customerId)).size;
  return { omzet, orderCount, activeCustomers };
}

/* ---------- Seed demo data ---------- */

function seedIfEmpty() {
  if (localStorage.getItem(STORE_KEY.seeded) === "v1") return;

  const customers = [
    { id: "cust-1", name: "Siti Amelia", phone: "0812-3456-7801" },
    { id: "cust-2", name: "Budi Santoso", phone: "0813-2211-4590" },
    { id: "cust-3", name: "Rina Wulandari", phone: "0857-7788-2201" },
    { id: "cust-4", name: "Dedi Kurniawan", phone: "0821-9900-1123" },
    { id: "cust-5", name: "Maya Puspitasari", phone: "0895-3321-7788" },
    { id: "cust-6", name: "Andi Prasetyo", phone: "0812-6677-8899" },
    { id: "cust-7", name: "Fitriani Lubis", phone: "0838-1122-3344" },
    { id: "cust-8", name: "Hendra Wijaya", phone: "0813-5566-7788" },
    { id: "cust-9", name: "Nadia Kusuma", phone: "0857-2233-4455" },
    { id: "cust-10", name: "Rizky Ramadhan", phone: "0812-9988-7766" },
  ];

  const item = (name, qty, price) => ({ name, qty, price });

  // [dayOffset, customerId, status, orderNoSeq, items]
  const rows = [
    [6, "cust-2", STATUS.READY, 1, [item("Nastar 500gr", 2, 65000)]],
    [6, "cust-3", STATUS.READY, 2, [item("Kastengel 500gr", 1, 95000)]],
    [6, "cust-1", STATUS.DONE, 3, [item("Kue Ulang Tahun Custom 1kg", 1, 350000)]],

    [5, "cust-9", STATUS.PROCESS, 4, [item("Brownies Kukus (loyang)", 1, 85000)]],
    [5, "cust-10", STATUS.READY, 5, [item("Donat Kentang isi 6", 1, 45000)]],
    [5, "cust-1", STATUS.DONE, 6, [item("Cheese Cake Slice", 4, 30000)]],

    [4, "cust-6", STATUS.PROCESS, 7, [item("Bolu Pandan", 1, 70000)]],
    [4, "cust-7", STATUS.READY, 8, [item("Cookies Coklat 500gr", 1, 90000)]],
    [4, "cust-8", STATUS.DONE, 9, [item("Puding Coklat (cup 6)", 1, 60000)]],

    [3, "cust-2", STATUS.UNPAID, 10, [item("Kue Lapis Legit 20x20", 1, 275000)]],
    [3, "cust-3", STATUS.PROCESS, 11, [item("Nastar 250gr", 1, 70000), item("Kastengel 250gr", 1, 55000), item("Putri Salju 250gr", 1, 85000)]],
    [3, "cust-4", STATUS.READY, 12, [item("Brownies Kukus (loyang)", 2, 80000)]],
    [3, "cust-5", STATUS.DONE, 13, [item("Donat Kentang isi 12", 1, 85000)]],

    [2, "cust-8", STATUS.BARU, 14, [item("Cheese Cake Slice", 2, 30000)]],
    [2, "cust-9", STATUS.BARU, 15, [item("Cookies Coklat 250gr", 1, 50000)]],
    [2, "cust-10", STATUS.BARU, 16, [item("Puding Coklat (cup 12)", 1, 110000)]],
    [2, "cust-1", STATUS.UNPAID, 17, [item("Kue Ulang Tahun Custom 1.5kg", 1, 425000)]],

    [1, "cust-4", STATUS.BARU, 18, [item("Bolu Pandan", 2, 65000)]],
    [1, "cust-5", STATUS.BARU, 19, [item("Brownies Kukus (loyang besar)", 1, 110000)]],
    [1, "cust-6", STATUS.BARU, 20, [item("Nastar 250gr", 1, 65000)]],
    [1, "cust-7", STATUS.UNPAID, 21, [item("Kue Lapis Legit 20x20", 1, 275000)]],

    [0, "cust-1", STATUS.BARU, 22, [item("Donat Kentang isi 6", 1, 45000), item("Cookies Coklat 250gr", 1, 55000), item("Nastar 250gr", 1, 50000)]],
    [0, "cust-2", STATUS.BARU, 23, [item("Kastengel 500gr", 1, 95000), item("Putri Salju 250gr", 1, 105000)]],
    [0, "cust-3", STATUS.PROCESS, 24, [item("Kue Ulang Tahun Custom 1kg + Dekorasi", 1, 500000)]],
  ];

  const orders = rows.map(([dayOffset, customerId, status, seq, items]) => {
    const total = items.reduce((s, it) => s + it.qty * it.price, 0);
    return {
      id: "ord-" + seq,
      orderNo: "PR-" + String(seq).padStart(4, "0"),
      customerId,
      status,
      date: daysAgoISO(dayOffset),
      items,
      total,
      note: "",
    };
  });

  saveCustomers(customers);
  saveOrders(orders);
  localStorage.setItem(STORE_KEY.shopName, "Toko Kue Naya");
  localStorage.setItem(STORE_KEY.seeded, "v1");
}
