# Design Spec — Website Kelurahan Lahendong
Versi 2.0 · Sumber kebenaran tunggal untuk desain & kode. Implementasinya di `assets/css/style.css`.

## 1. KARAKTER
Konsep: **poster taman nasional**. Bidang warna datar yang berlapis seperti cetak saring,
huruf tegak ala papan penunjuk jalur, palet mineral dari lanskap Lahendong sendiri
(kabut pagi, air Danau Linow, hutan malam, belerang).

Tiga kata kunci: Membumi · Jernih · Berwibawa.
BUKAN: startup SaaS, futuristik, korporat, playful, "template AI" (gradien ungu, kaca buram,
ikon di dalam lingkaran berwarna, angka seksi 01/02/03 di setiap judul).

## 2. WARNA
Semua warna didefinisikan di `:root`. Warna di luar daftar ini ditolak.

| Token | Nilai | Peran |
|---|---|---|
| `--bg` | `#EEF3F0` | latar halaman — kabut pagi |
| `--surface` | `#FFFFFF` | kartu, panel, seksi selang-seling |
| `--line` | `#D3DDD8` | garis, pembatas |
| `--ink` | `#10201C` | teks utama — basal |
| `--muted` | `#4E605A` | teks sekunder (kontras 6:1 di `--bg`) |
| `--primary` | `#0B6B63` | air Danau Linow — tombol, tautan, angka |
| `--primary-d` | `#07524C` | hover tombol |
| `--toska` | `#6FD0BF` | aksen di bidang gelap (label, tautan) |
| `--toska-muda` | `#DDF1EC` | latar monogram & bingkai foto |
| `--deep` | `#0E2E29` | hutan malam — kop halaman, seksi sorotan |
| `--deep-2` | `#0A221E` | footer, bilah resmi di atas header |
| `--on-deep` / `--on-deep-muted` | `#E6F0EC` / `#A7C1BA` | teks di bidang gelap |
| `--accent` | `#E0AE1E` | belerang — **penanda saja**: kotak eyebrow, garis bawah judul, garis atas papan |
| `--accent-ink` | `#8A6400` | belerang untuk **teks** di latar terang (nomor urut, salam) |
| `--danger` | `#A8382A` | peringatan, ikon darurat |

Aturan:
- `--accent` tidak pernah dipakai untuk teks di latar terang (kontrasnya 2:1). Untuk teks pakai `--accent-ink`.
- Bidang gelap hanya tiga: kop halaman, satu seksi sorotan per halaman, footer.
- Tanpa gradien warna, tanpa overlay hitam di atas ilustrasi.
- Kontras teks minimal 4,5:1 (semua pasangan di atas sudah diperiksa).

## 3. TIPOGRAFI
Judul & angka : **Archivo** (sumbu lebar 62–125, bobot 500–800), dipakai menyempit (`font-stretch` 72–80%).
Teks          : **Plus Jakarta Sans** 400 / 500 / 600 / 700.
Keduanya dari Google Fonts, dengan fallback `"Arial Narrow"` / `system-ui`.

| Peran | Kelas | Ukuran | Catatan |
|---|---|---|---|
| Judul hero | `.judul-hero` | 56 → 128px | huruf besar, lebar 72%, bobot 800 |
| Judul halaman | `.judul-halaman` | 40 → 76px | huruf besar, di kop gelap |
| Judul seksi | `.judul-seksi` | 30 → 46px | huruf biasa, bobot 700 |
| Judul kartu | `.judul-kartu` | 23 → 25px | |
| Angka statistik | `.angka` | 36 → 58px | lebar 72%, `--primary`, angka tabular |
| Teks | body | 16 → 17px | line-height 1.7 |
| Label | `.label-kecil`, `.eyebrow` | 11–12px | huruf besar, spasi 0.1em |

- Huruf besar hanya untuk judul hero/halaman dan label kecil.
- Panjang baris teks maksimal ~680px.

## 4. BENTUK & RUANG
Radius   : 4px untuk semua (kartu, tombol, gambar); 999px hanya untuk tombol filter.
Bayangan : hanya saat kartu di-hover dan pada papan informasi beranda (`--bayang-angkat`).
Spasi    : kelipatan 8px. Jarak antarseksi 96px desktop · 56px HP.
Lebar konten: maks 1160px. Padding tepi layar: 24px desktop · 16px HP.

## 5. KOMPONEN
Bilah resmi : `--deep-2`, 36px, teks kecil; jam layanan & tautan kontak (desktop).
Header      : 72px, `--surface`, menempel saat digulir. Nav aktif = garis belerang 3px di bawah.
Hero beranda: ilustrasi poster penuh; judul di bidang langit kiri atas, teks `--ink` (tanpa overlay).
              Dua tombol: Jelajahi wisata (utama) & Layanan surat (sekunder).
Papan info  : panel putih bergaris atas belerang yang menumpang 88px di tepi bawah hero; berisi angka ringkas.
Kop halaman : bidang `--deep` + garis kontur samar di kanan; tepi bawah berupa siluet punggungan gunung
              yang warnanya mengikuti seksi di bawahnya (kelas `tepi-putih` bila seksi itu putih).
Eyebrow     : kotak belerang 9px + label huruf besar di atas judul seksi.
Kartu       : `--surface`, border 1px, foto 3:2. Hover: naik 3px, border `--primary`, bayangan lembut.
              Kartu wisata menampilkan baris info tiket & jam (baris pertama sel, maks 2 baris).
Grid kartu  : `.grid-adaptif` — lihat §6.
Tombol      : `--primary` teks putih; sekunder bergaris; `tombol-terang` (di panel hijau);
              `tombol-belerang` (di bidang gelap, teks `--ink`).
Statistik   : `.deret-statistik`, pembatas garis rambut; jumlah kolom mengikuti jumlah angka.
Tabel       : garis horizontal saja, header latar `--bg`, baris total bergaris tebal.
Footer      : `--deep-2`, siluet punggungan di atasnya, 3 kolom, judul kolom `--toska`.
Orang       : foto statis bila ada; bila tidak, monogram inisial di latar `--toska-muda`. Tanpa foto stok.

## 6. GRID ADAPTIF
Kartu yang jumlahnya ditentukan admin (wisata, UMKM, galeri, aparat, lingkungan, kontak) memakai
`.grid-adaptif`. `aturKolom()` di `komponen.js` menghitung:

    baris = ceil(n / maks)      kolom = ceil(n / baris)      (maks bawaan 4, atribut data-maks)

| Jumlah kartu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Susunan desktop | 1 | 2 | 3 | 4 | 3+2 | 3×2 | 4+3 | 4×2 |

Baris terakhir yang tidak penuh diletakkan di tengah (`rata-kiri` untuk pengecualian di Kontak).
Tablet (640–1023px) 2 kolom; HP 1 kolom, atau 2 kolom untuk kartu kecil (`data-hp="2"`).
Satu kartu dibatasi lebar 560px agar tidak melebar sepanjang layar.

## 7. IKON & GAMBAR
- Ikon garis Lucide. DILARANG emoji sebagai ikon UI.
- Ilustrasi saat ini bergaya poster (bidang datar, palet di atas). Foto asli boleh menggantikannya
  dengan nama berkas yang sama; format WebP, lebar maks 1600px, wajib alt.
- Rasio: kartu 3:2, hero penuh layar. Foto gagal dimuat → `img/placeholder.webp`.

## 8. GERAK
- Hanya fade & translate halus, 200–500ms, ease-out; animasi muncul saat digulir, sekali jalan.
- Animasikan hanya transform & opacity. Wajib menghormati `prefers-reduced-motion`.
- Tanpa parallax, tanpa library animasi, tanpa animasi berulang (kecuali ikon memuat).

## 9. ATURAN MUTLAK
1. Mode terang saja. Tidak ada dark mode / toggle tema.
2. Mobile first. Uji di lebar 360px; tanpa gulir horizontal.
3. Tanpa glassmorphism, blur, neon, efek 3D, gradien warna-warni.
4. Warna di luar palet = ditolak. Kontras teks minimal 4,5:1.
5. Tidak ada data di HTML — semua isi dari spreadsheet (lihat README).
