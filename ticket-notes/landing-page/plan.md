# Landing Page — perpustakaanku-landing

Plan disepakati 2026-08-18. Refer ke sini sebelum lanjut eksekusi.

## Keputusan

- **Repo**: `perpustakaanku-landing` — terpisah dari admin panel (`perpustakaanku`).
  Alasan: auth model beda (portal publik vs admin panel di-gate middleware),
  lifecycle beda (landing sering berubah, admin panel jarang), deploy target beda.
- **Stack**: Vite + React + Tailwind CSS. Bukan Next.js — landing page statis,
  tidak butuh SSR/server component/auth.
- **Animasi**: GSAP + ScrollTrigger. Dipakai secukupnya per section, bukan di semua elemen.
- **Warna**: pendekatan flat/solid seperti referensi (Loyalist College), TANPA gradient
  ala "AI slop". Palet sendiri — earthy/warm cocok tema buku-perpustakaan, bukan
  copy biru-hijau Loyalist.
- **Referensi visual**: https://loyalistcollege.com/ — dipakai untuk pola STRUKTUR
  (nav, hero, card grid, alternating text-image block, footer), bukan untuk warna
  atau di-clone 1:1.

## Struktur halaman (section by section)

1. **Navbar**
   - Logo + nama app kiri, menu flat kanan (Fitur, Cara Kerja, Tentang, CTA "Coba Sekarang")
   - Sticky, transparan di atas → solid saat scroll
   - Tidak perlu dropdown multi-level (beda dari referensi) — cukup 4-5 link flat

2. **Hero**
   - Headline besar + subheadline pendek (value prop)
   - CTA utama ("Lihat Demo"/"Mulai Sekarang") + CTA sekunder
   - Screenshot dashboard app ASLI (dari perpustakaanku) di sisi kanan — bukan stock/AI image
   - Animasi: fade-in + slide-up sekali saat load (GSAP timeline, bukan scroll-triggered)

3. **Fitur unggulan** (grid card)
   - 4-6 card sesuai fitur asli app: Manajemen Buku, Data Anggota, Pelacakan Peminjaman,
     Dashboard Real-time, dst
   - Icon flat (lucide-react), judul singkat, deskripsi 1 baris
   - Animasi: stagger fade-in per card saat masuk viewport (ScrollTrigger, stagger ~0.1)

4. **Cara kerja** (alternating text-image block)
   - 3 step: Input data buku & anggota → Catat peminjaman → Pantau dari dashboard
   - Text-kiri/gambar-kanan, lalu kebalikannya — screenshot app asli per step
   - Animasi: slide-in dari kiri/kanan bergantian saat scroll masuk viewport

5. **Kenapa pakai ini** (opsional, social-proof ringan)
   - JANGAN bikin testimonial palsu. Kalau belum ada testimonial nyata, ganti jadi
     "keunggulan teknis" (real-time sync, aman, gratis dipakai)
   - 3 card flat, tanpa foto orang fiktif

6. **CTA akhir**
   - Section full-width warna solid (accent color), headline singkat + tombol besar
   - Animasi: scale-in ringan saat masuk viewport

7. **Footer**
   - 2-3 kolom (bukan 4 seperti referensi — konten kita lebih sedikit):
     Tentang, Link cepat, Kontak/Sosial
   - Copyright line simpel

## Prinsip animasi (supaya tidak berat)

- Semua scroll-trigger pakai `once: true` — tidak re-trigger tiap scroll ulang balik
- Hindari animasi berbeda-beda di banyak elemen sekaligus — 1 pola stagger per grup
- Respect `prefers-reduced-motion` dari awal — skip animasi kalau user setting aktif
- Lazy-load GSAP hanya di section yang butuh, jangan bundle di initial load kalau bisa split

## Status

- [x] Plan disepakati dan disimpan
- [x] Setup project Vite + React + Tailwind di repo `perpustakaanku-landing`
- [x] Install & konfigurasi GSAP + ScrollTrigger
- [x] Build Navbar
- [x] Build Hero (placeholder mockup dashboard, belum screenshot asli)
- [x] Build Fitur unggulan
- [x] Build Cara kerja (placeholder gambar, belum screenshot asli)
- [x] Build Kenapa pakai ini (WhyUs — keunggulan teknis, bukan testimonial palsu)
- [x] Build CTA akhir
- [x] Build Footer
- [x] Font: Fraunces (heading, self-hosted via @fontsource) + Inter (body)
- [x] Asset visual: blob SVG abstrak earthy di Hero/Features/WhyUs/CTA (bukan image raster)
- [ ] Ambil screenshot asli dari app perpustakaanku untuk dipakai di Hero & Cara kerja
- [x] Palet warna final: earthy/warm flat (paper/ink/wood/forest tokens di index.css)

## Fase 2 — Koneksi ke Supabase (data real dari admin panel)

Disepakati 2026-08-18. Landing page akan menampilkan katalog buku publik
(search + status ketersediaan) yang datanya sama dengan admin panel `perpustakaanku`,
BUKAN cuma statistik mockup statis.

**Level realtime**: fetch-fresh on load/search — TIDAK pakai Supabase Realtime
websocket subscription. Dipilih karena lebih simpel dan cukup untuk katalog publik.

**Keamanan — WAJIB dijaga:**
- Landing page cuma boleh baca `books` dan `book_copies`, TIDAK PERNAH `members`,
  `borrowings`, `borrowings_items` (data personal peminjam)
- Role `anon` (publik, tanpa login) perlu RLS policy SELECT baru khusus 2 tabel itu
- Dari `book_copies` publik hanya expose `status` (available/borrowed) — JANGAN
  expose `copy_code` (detail internal operasional, tidak perlu publik)
- Publishable/anon key aman dipakai di frontend publik (ini bedanya dari service_role key)

**Rencana teknis:**
1. Supabase: RLS policy baru `anon` SELECT pada `books` + `book_copies` (kolom terbatas)
2. `perpustakaanku-landing`: install `@supabase/supabase-js`, tambah `.env.local`
   dengan `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (publishable key sama
   dengan yang dipakai admin panel — ini bukan secret)
3. Ganti angka statis di Hero (248/132/37/211) jadi fetch count asli dari Supabase
4. Tambah section katalog buku: search + grid, status ketersediaan per buku

**Status:**
- [x] RLS policy anon SELECT untuk `books` + `book_copies` di Supabase.
      Dibuat juga view `public.book_copies_public` (book_id, status saja —
      tanpa copy_code) supaya frontend publik tidak perlu select langsung
      dari book_copies. Diverifikasi: anon key bisa baca books/book_copies_public
      (200 + data), members/borrowings/borrowings_items tetap 200 tapi array
      kosong (RLS memfilter row, bukan block request — ini perilaku normal
      PostgREST, bukan bug).
- [x] Install `@supabase/supabase-js` + `.env.local` di perpustakaanku-landing
      (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY — publishable key sama
      dengan admin panel, aman karena ini bukan secret)
- [x] Hero: fetch count asli (total judul buku, total eksemplar, dipinjam,
      tersedia) ganti dari statis. "Total Anggota" DIHAPUS dari Hero —
      data dari tabel members tidak untuk publik.
- [x] Section katalog buku publik (Catalog.jsx): search (debounce 300ms) +
      grid + badge status ketersediaan per judul buku, link ditambahkan
      ke Navbar (#katalog)

**Catatan desain data:**
- Landing page HANYA baca `books` dan `book_copies_public` (view, kolom
  terbatas). Tidak pernah menyentuh `members`, `borrowings`, `borrowings_items`.
- `copy_code` (kode eksemplar internal) tidak pernah diexpose ke publik —
  hanya `status` (available/borrowed) dan count.

## Fase 3 — Hero jadi background image + Metrics dipisah

Disepakati 2026-08-18. Hero diganti dari layout 2-kolom (teks + mockup dashboard)
jadi full-bleed background photo perpustakaan dengan headline center-aligned di
atasnya. Data metrics (yang sebelumnya di dalam mockup dashboard Hero) dipindah
jadi section/component sendiri (`Metrics.jsx`) yang tampil sebagai strip card di
bawah Hero, overlap sedikit ke batas Hero (efek "mengambang" — pola umum di
landing page modern).

**Asset foto:**
- Sumber: Unsplash CDN (images.unsplash.com), photo ID `1463143296037-46790ff95a7e`
  — interior Strahov Library (Prague), kayu warm + lantai gelap, cocok tone
  earthy yang sudah dipakai. `source.unsplash.com` (random endpoint) sudah
  deprecated Unsplash sejak 2023 — jangan pakai itu lagi.
- Didownload ke `src/assets/images/hero-bg.jpg` (~435KB, w=2000 q=60) —
  bukan hotlink, supaya tidak ada dependency runtime ke domain eksternal.
- Overlay: `bg-ink/65` (dark overlay untuk keterbacaan teks putih) +
  gradient ke `--color-paper` di bagian bawah supaya transisi ke Metrics halus.

**Status:**
- [x] Hero.jsx: background image + overlay, headline center, hapus mockup
      dashboard 2-kolom
- [x] Metrics.jsx: component baru, strip 4 card (icon + angka + label),
      posisi `-mt-16/-mt-20` overlap ke Hero, scroll-reveal stagger
- [x] App.jsx: `<Metrics />` ditaruh setelah `<Hero />`, sebelum `<Features />`

## Fase 4 — Screenshot asli admin panel untuk HowItWorks

Disepakati 2026-08-18, dengan izin eksplisit Miko untuk kasus ini (lihat
[[feedback_no_self_frontend_check]] — default-nya Claude TIDAK screenshot
sendiri, tapi Miko mengizinkan khusus untuk task ambil screenshot admin panel
sebagai asset landing page, bukan untuk verifikasi visual landing page itu sendiri).

**Cara:** Playwright (chromium) login ke admin panel (`admin@gmail.com`),
screenshot 3 halaman dengan `clip` region (skip sidebar 256px):
- `/books/add` → step1-add-book.png (portrait, form banyak field)
- `/transactions/add` → step2-add-transaction.png
- `/dashboard` → step3-dashboard.png (landscape, 5 stat card)

Disalin ke `src/assets/images/` di perpustakaanku-landing, dipasang di
`HowItWorks.jsx` menggantikan placeholder text "Screenshot: ...".

**Catatan teknis penting:** gambar-gambar ini punya aspect ratio berbeda jauh
(step1 portrait ~500x730, step3 landscape ~1024x320). Container awal pakai
tinggi fixed (`h-64 md:h-72`) + `object-contain` — hasilnya step1 tampil sangat
kecil/sempit karena dipaksa masuk container landscape. Fix: ganti ke
`max-h-[26rem]` + `h-auto` + `object-contain` supaya tiap gambar pakai rasio
aslinya sendiri, tidak dipaksa sama semua. Kalau nanti nambah screenshot baru
dengan aspect ratio ekstrem, cek ulang apakah masih proporsional.

**Status:**
- [x] Playwright + chromium diinstall (scratchpad, bukan dependency project)
- [x] 3 screenshot admin panel diambil & di-crop (skip sidebar)
- [x] Dipasang di HowItWorks.jsx, container disesuaikan ke `object-contain`
      dengan `h-auto` (bukan tinggi fixed) agar tidak ada gambar terpotong
