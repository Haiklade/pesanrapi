# PesanRapi

Dashboard SaaS untuk UMKM Indonesia (penjual makanan rumahan, toko kue, reseller, thrift) yang menerima pesanan lewat WhatsApp. Membantu pemilik usaha mencatat pesanan, memantau pembayaran, dan melihat pesanan siap kirim — tanpa chat WhatsApp yang berantakan.

Status: **demo/prototipe frontend**. Semua data tersimpan di `localStorage` browser, belum terhubung ke backend/database sungguhan.

## Cara Menjalankan

Situs ini murni HTML/CSS/JS (tanpa proses build), tapi karena data dimuat lewat `fetch`/module pattern browser modern, disarankan dibuka lewat server lokal, bukan `file://` langsung.

**Opsi 1 — Python (paling mudah, sudah ada di komputer ini):**
```bash
cd pesanrapi
python -m http.server 8080
```
Lalu buka `http://localhost:8080/index.html` di browser.

**Opsi 2 — VSCode Live Server:** klik kanan `index.html` → "Open with Live Server".

## Struktur File

```
pesanrapi/
├── index.html          Landing page (hero, masalah, manfaat, testimoni, CTA)
├── dashboard.html       Ringkasan harian + "Pesanan perlu diproses"
├── pesanan.html          Kelola pesanan: filter, cari, tambah/edit, ubah status
├── pelanggan.html        Daftar pelanggan, label "Pelanggan Loyal", tombol WhatsApp
├── laporan.html           Ringkasan omzet, grafik 7 hari, produk terlaris
├── assets/
│   ├── css/style.css      Design system (warna, tipografi, komponen)
│   └── js/
│       ├── data.js         Layer data: seed demo + akses localStorage
│       ├── ui.js            Komponen bersama: ikon, header/nav, modal, toast
│       ├── dashboard.js
│       ├── pesanan.js
│       ├── pelanggan.js
│       └── laporan.js
└── README.md
```

## Data Demo

Saat pertama kali dibuka, `data.js` otomatis mengisi `localStorage` dengan data contoh milik **"Toko Kue Naya"**: 10 pelanggan dan 24 pesanan tersebar dalam 7 hari terakhir, sudah dihitung agar dashboard menampilkan **8 Pesanan Baru, 3 Belum Bayar, 5 Siap Dikirim, Rp850.000 Omzet Hari Ini** persis seperti brief.

Untuk mengulang dari awal (reset data demo), jalankan di console browser:
```js
localStorage.clear(); location.reload();
```

## Fitur per Halaman

- **Landing** — hero + CTA "Coba Gratis" / "Lihat Demo", 3 masalah UMKM, 4 manfaat produk, 3 testimoni (ditandai jelas sebagai contoh).
- **Dashboard** — sapaan toko, 4 kartu ringkasan, daftar pesanan yang perlu diproses, tombol besar tambah pesanan.
- **Pesanan** — filter status (Semua/Baru/Belum Bayar/Diproses/Siap Dikirim/Selesai), pencarian nama/no. pesanan, form tambah/edit dengan item produk dinamis (total dihitung otomatis), aksi cepat ubah status lewat menu titik tiga, chat WhatsApp langsung dari baris pesanan.
- **Pelanggan** — kartu pelanggan dengan total pesanan/belanja/terakhir belanja, label otomatis "Pelanggan Loyal" (≥3 pesanan), tombol WhatsApp dengan pesan siap kirim.
- **Laporan** — omzet 30 hari, jumlah pesanan, pelanggan aktif, produk terlaris, grafik area omzet 7 hari terakhir (Chart.js, ukuran ditahan agar tidak mendominasi halaman).

## Catatan Teknis

- Grafik memakai **Chart.js** dari CDN (`cdnjs.cloudflare.com`) — butuh koneksi internet saat memuat `laporan.html`. Jika CDN gagal dimuat, halaman tetap jalan (tidak crash) dan menampilkan pesan fallback di posisi grafik.
- Nomor WhatsApp pelanggan disimpan format lokal (`0812-xxxx-xxxx`); tombol WhatsApp otomatis mengonversinya ke format internasional (`62...`) untuk link `wa.me`.
- Font: **Plus Jakarta Sans** (Google Fonts) — direkomendasikan skill `ui-ux-pro-max` untuk kategori produktivitas/SaaS.
- Palet warna: teal/hijau tua (`#0d9488`) sebagai warna utama, badge status sesuai brief (kuning=Belum Bayar, biru=Diproses, ungu=Siap Dikirim, hijau=Selesai).

## Belum Termasuk (di luar scope demo ini)

- Backend/API dan database sungguhan (semua CRUD hanya di `localStorage`, per-browser, tidak sinkron antar perangkat).
- Integrasi WhatsApp Business API nyata (tombol WA hanya membuka `wa.me` dengan pesan siap kirim, bukan otomatisasi penuh).
- Autentikasi/login multi-toko.
