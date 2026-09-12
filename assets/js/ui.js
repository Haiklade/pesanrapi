/* =========================================================
   PesanRapi — Shared UI helpers (icons, nav, modal, toast)
   ========================================================= */

const BRAND_MARK_SVG = '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">' +
  '<rect x="4" y="4" width="40" height="34" rx="12" fill="#0a0f0e"/>' +
  '<path d="M10 36 L8 45 L19 36 Z" fill="#0a0f0e"/>' +
  '<path d="M32 4a12 12 0 0 1 12 12v3L29 5.3A11.9 11.9 0 0 1 32 4Z" fill="#2dd4bf"/>' +
  '<rect x="13.5" y="11" width="21" height="21" rx="4" fill="#fff"/>' +
  '<rect x="17.5" y="16" width="13" height="3" rx="1.5" fill="#14b8a6"/>' +
  '<rect x="17.5" y="21.5" width="13" height="3" rx="1.5" fill="#14b8a6"/>' +
  '<rect x="17.5" y="27" width="5.5" height="3" rx="1.5" fill="#14b8a6"/>' +
  '<path d="M25.5 28.2l1.8 1.8 3.6-3.9" stroke="#14b8a6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>';

const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 11.5 12 4l9 7.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>',
  orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 9h6M9 13h6M9 17h4"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path stroke-linecap="round" stroke-linejoin="round" d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><path stroke-linecap="round" stroke-linejoin="round" d="M15.5 5.2A3.2 3.2 0 0 1 16 11.6M17 14c2.5.3 4 2 4.3 4.6"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4 20V10M10 20V4M16 20v-7M4 20h16"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.5" cy="10.5" r="6.5"/><path stroke-linecap="round" d="m20 20-4.3-4.3"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.5a8.4 8.4 0 0 1-11.7 7.7L4 20l1-4.8A8.4 8.4 0 1 1 21 11.5Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5V12l3 2"/></svg>',
  banknote: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6.5" width="18" height="11" rx="1.6"/><circle cx="12" cy="12" r="2.4"/><path stroke-linecap="round" d="M6.5 9v0M17.5 15v0"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h11v9H3zM14 11h4l3 3v2h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path stroke-linecap="round" stroke-linejoin="round" d="m8.5 12.3 2.3 2.3 4.7-5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4 20l.9-3.6L15.6 5.7a1.6 1.6 0 0 1 2.3 0l.4.4a1.6 1.6 0 0 1 0 2.3L7.6 19.1 4 20Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m1 0-.7 12a1.6 1.6 0 0 1-1.6 1.5H9.3a1.6 1.6 0 0 1-1.6-1.5L7 7"/></svg>',
  dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
  boxEmpty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M3 8.5V16l9 4.5 9-4.5V8.5"/></svg>',
};

function qs(sel, root) { return (root || document).querySelector(sel); }
function qsa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

function setActiveNav() {
  const page = document.body.dataset.page;
  qsa("[data-nav]").forEach((el) => {
    if (el.dataset.nav === page) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
}

function showToast(message) {
  let toast = qs(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  if (e.target.matches("[data-close-modal]") || e.target.closest("[data-close-modal]")) {
    const btn = e.target.closest("[data-close-modal]");
    closeModal(btn.dataset.closeModal);
  }
  if (e.target.classList && e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("open");
    document.body.style.overflow = "";
  }
});

const NAV_ITEMS = [
  { page: "dashboard", href: "dashboard.html", label: "Beranda", icon: ICONS.home },
  { page: "pesanan", href: "pesanan.html", label: "Pesanan", icon: ICONS.orders },
  { page: "pelanggan", href: "pelanggan.html", label: "Pelanggan", icon: ICONS.users },
  { page: "laporan", href: "laporan.html", label: "Laporan", icon: ICONS.chart },
];

function renderAppShell(activePage) {
  const headerMount = document.getElementById("app-header");
  const navMount = document.getElementById("app-bottomnav");
  if (!headerMount || !navMount) return;

  headerMount.outerHTML = `
    <header class="app-header">
      <div class="app-header-inner">
        <a href="dashboard.html" class="brand"><span class="brand-mark">${BRAND_MARK_SVG}</span>PesanRapi</a>
        <nav class="desktop-nav" aria-label="Navigasi utama">
          ${NAV_ITEMS.map((n) => `<a href="${n.href}" data-nav="${n.page}">${n.label}</a>`).join("")}
        </nav>
        <div class="header-actions">
          <button class="btn btn-primary btn-sm" aria-label="Tambah Pesanan" onclick="location.href='pesanan.html?new=1'">${ICONS.plus} <span class="add-btn-label">Tambah Pesanan</span></button>
        </div>
      </div>
    </header>`;

  navMount.outerHTML = `
    <nav class="bottom-nav" aria-label="Navigasi bawah">
      ${NAV_ITEMS.map((n) => `<a href="${n.href}" data-nav="${n.page}">${n.icon}<span>${n.label}</span></a>`).join("")}
    </nav>`;

  document.body.dataset.page = activePage;
  setActiveNav();
}

document.addEventListener("DOMContentLoaded", setActiveNav);
