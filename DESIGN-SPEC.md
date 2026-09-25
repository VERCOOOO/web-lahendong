# Design Spec — Website Kelurahan Lahendong
Versi 1.0 · Sumber kebenaran tunggal untuk desain & kode.

## 1. KARAKTER
Tenang, resmi tapi hangat, informatif, berakar pada tempat.
Referensi rasa: situs taman nasional atau museum daerah.
BUKAN: startup SaaS, futuristik, korporat, playful.

Tiga kata kunci: Membumi · Jernih · Berwibawa.

## 2. WARNA
Definisikan di :root sebagai CSS custom property.

--ink:       #1B2420   teks utama
--muted:     #5C6862   teks sekunder, caption
--line:      #DDE2DC   garis, pembatas
--bg:        #F7F6F1   latar halaman (putih hangat, bukan abu biru)
--surface:   #FFFFFF   kartu, panel
--primary:   #2D5A4A   hijau pinus — header, tombol, tautan
--primary-d: #1F4034   hover tombol
--accent:    #C07A1E   kuning belerang — aksen, hemat (<5% area)
--danger:    #A33B2A   peringatan

Aturan:
- Maksimal 1 warna utama + 1 aksen. Tidak ada warna lain.
- Aksen hanya untuk: angka statistik, label penting, garis bawah judul seksi.
- DILARANG: ungu, indigo, violet, gradien warna-warni, neon, glow.
- Gradien hanya boleh berupa overlay gelap transparan di atas foto hero.

## 3. TIPOGRAFI
Judul : "Fraunces", Georgia, serif        (bobot 600)
Teks  : "Source Sans 3", system-ui, sans-serif  (400 / 600)
Google Fonts. Selalu sertakan fallback.

Skala (desktop → mobile):
h1  48 → 32px   line-height 1.15
h2  32 → 26px   line-height 1.25
h3  22 → 20px
body 17 → 16px  line-height 1.65
small 14px

- Panjang baris teks maksimal 70 karakter (~680px).
- Judul rata kiri. Tidak ada teks bergradien, tidak ada all-caps kecuali label kecil (letter-spacing 0.08em, 12px).

## 4. BENTUK & RUANG
Radius   : 6px kartu & gambar · 4px tombol & input · 0 untuk tabel
Bayangan : maksimal 0 1px 2px rgba(0,0,0,.06). TIDAK ADA shadow tebal.
           Utamakan border 1px solid var(--line) daripada bayangan.
Spasi    : kelipatan 8px (8/16/24/32/48/64/96)
Jarak antar seksi: 96px desktop · 56px mobile
Lebar konten: maks 1120px · teks panjang maks 680px
Padding tepi layar: 24px desktop · 16px mobile

## 5. KOMPONEN
Header    : tinggi 72px, latar --surface, border-bottom 1px --line.
            Logo + nama kelurahan di kiri, nav di kanan.
            Nav aktif ditandai garis bawah 2px --primary.
            Mobile: tombol hamburger, menu turun vertikal.
Hero      : foto asli, tinggi 60vh (maks 520px), overlay gelap 35%,
            h1 putih + satu kalimat pengantar. Tanpa tombol mengambang.
Kartu     : --surface, border 1px --line, radius 6px,
            foto rasio 4:3 object-cover, padding 20px.
            Hover: translateY(-2px) + border menjadi --primary.
Tombol    : solid --primary, teks putih, padding 12px 24px, radius 4px.
            Sekunder: transparan, border 1px --primary, teks --primary.
Statistik : angka 40px Fraunces warna --primary, label 14px --muted.
Tabel     : garis horizontal saja, header latar --bg, padding 12px 16px.
            Mobile: bungkus dalam overflow-x auto.
Footer    : latar --primary, teks putih, 3 kolom, padding 56px 0.

## 6. IKON & GAMBAR
- Ikon garis dari Lucide (via CDN), stroke 1.5px, ukuran 20–24px.
  DILARANG memakai emoji sebagai ikon UI.
- Foto: format WebP, lebar maks 1600px, wajib punya alt.
- Semua gambar object-cover dengan rasio tetap (4:3 kartu, 16:9 banner).
- Foto gagal dimuat → fallback ke img/placeholder.webp.

## 7. GERAK
- Hanya fade dan translate halus. Durasi 200–400ms, ease-out.
- Animasi muncul saat scroll memakai IntersectionObserver, sekali jalan.
- Animasikan hanya transform & opacity.
- Wajib menghormati @media (prefers-reduced-motion: reduce).
- Tanpa parallax, tanpa smooth-scroll library, tanpa animasi loop.

## 8. ATURAN MUTLAK
1. Mode terang saja. Tidak ada dark mode, tidak ada toggle tema.
2. Mobile first. Uji di lebar 360px.
3. Tanpa glassmorphism, blur, neon, atau efek 3D.
4. Tanpa foto stok orang tersenyum. Hanya foto Lahendong.
5. Warna di luar palet di atas = ditolak.
6. Kontras teks minimal 4.5:1.
