# 🚨 SIAGA POSKO Mobile Web App

Aplikasi Web Tanggap Bencana & Distribusi Logistik Posko Darurat berbasis **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Supabase PostgreSQL**.

---

## 🎨 Tema Desain & Warna
- **Primary**: Deep Navy Blue (`#00236f` / `#1E3A8A`)
- **Secondary**: Rescue Teal (`#006a63` / `#0F766E`)
- **Design Standard**: Mobile-First SPA, Material Symbols Rounded, Smooth Animations, High Accessibility.

---

## 📱 Fitur 4 Layar Utama (SPA - Tanpa Reload)

1. **Navigasi Utama (Bottom Navigation Bar)**:
   - Sticky navigation di bawah layar: **Beranda**, **Logistik**, **Pengajuan**, dan **Profil**.
   - Berpindah antar 4 layar tanpa reload halaman.

2. **Layar 1 — Beranda (Home)**:
   - Counter statistik dinamis ter-animasi (Jumlah Posko Aktif, % Stok Logistik, Total Relawan).
   - Tombol darurat: *Hubungi Posko 112 / 119 (Bebas Pulsa)*.
   - Tombol Aksi Lapangan Cepat yang langsung mengarahkan ke tab terkait.
   - Search bar real-time untuk memfilter data posko darurat.
   - Kabar terkini bencana & banner donasi spesifik.

3. **Layar 2 — Distribusi Logistik & Peta Posko**:
   - Peta interaktif vector SVG topografi bencana dengan pin marker yang bisa diklik.
   - Filter segmented tab: *Semua Posko*, *Butuh Logistik Mendesak*, *Posko Medis*, *Dapur Umum*.
   - Kartu posko lengkap dengan progress bar stok logistik dinamis (Makanan, Obat-obatan, Selimut) dengan warna indikator (**Merah < 50%**, **Teal/Hijau ≥ 50%**).
   - Tombol cepat rute Google Maps dan kirim bantuan langsung.

4. **Layar 3 — Formulir Pengajuan Logistik & Laporan Darurat**:
   - Form validasi lengkap (state Focus `#1E3A8A`, state Error `#DC2626` dengan pesan *"Silakan isi data pendukung yang valid"*).
   - Input Nama Pelapor/Koordinator.
   - Input Geotagging Titik Lokasi + tombol simulasi **"Ambil Koordinat GPS Otomatis"**.
   - Dropdown interaktif Kategori Kebutuhan (*Pangan, Medis, Shelter, Evakuasi*).
   - Rincian kebutuhan spesifik.
   - Notifikasi Toast berhasil saat submit dan data otomatis masuk ke riwayat profil.

5. **Layar 4 — Profil Relawan & Riwayat Bantuan**:
   - Profil terverifikasi: *Budi Santoso - Relawan Terverifikasi BPBD*.
   - Statistik misi (*14 Misi Selesai, 4 Posko Diampu, 14 Hari Bertugas*).
   - Toggle kesiapan siaga (*Siap Tugas / Istirahat*).
   - Riwayat pengajuan logistik dengan status badge dinamis (*Menunggu Verifikasi, Dalam Pengiriman, Tersalurkan*).
   - Indikator status koneksi backend database.

---

## 🚀 Cara Menjalankan Aplikasi

Masuk ke folder aplikasi:
```bash
cd siaga-posko-app
```

Jalankan development server:
```bash
npm run dev
```

Buka browser di:
`http://localhost:3000`

---

## 🗄️ Setup Supabase Database

File skema PostgreSQL lengkap sudah tersedia di:
`supabase/schema.sql`

Langkah konfigurasi:
1. Buka [Supabase Dashboard](https://supabase.com).
2. Buat project baru.
3. Buka menu **SQL Editor**, salin dan tempel seluruh isi dari [`supabase/schema.sql`](./supabase/schema.sql), lalu klik **Run**.
4. Ambil **Project URL** dan **Anon Key** dari menu *Project Settings → API*.
5. Buat file `.env.local` di folder `siaga-posko-app/`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
6. Jalankan kembali aplikasi (`npm run dev`).

> **Catatan**: Jika Supabase belum dikonfigurasi, aplikasi tetap berfungsi **100% normal** menggunakan simulated mock data dan in-memory state.
