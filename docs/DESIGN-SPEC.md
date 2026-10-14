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
| `--deep-2` | `#0A221E` | footer, bilah atas di atas header |
| `--on-deep` / `--on-deep-muted` | `#E6F0EC` / `#A7C1BA` | teks di bidang gelap |
| `--accent` | `#E0AE1E` | belerang — **penanda saja**: kotak eyebrow, garis bawah judul, garis atas papan |
| `--accent-ink` | `#8A6400` | belerang untuk **teks** di latar terang (jumlah per kelompok, salam) |
| `--belerang-muda` | `#FBF1D3` | latar catatan/pemberitahuan |
| `--danger` | `#A8382A` | peringatan, ikon darurat |

Aturan:
- `--accent` tidak pernah dipakai untuk teks di latar terang (kontrasnya 2:1). Untuk teks pakai `--accent-ink`.
- Bidang gelap hanya: kop halaman, satu seksi/panel sorotan per halaman (layanan di Beranda, pimpinan di Pemerintahan), footer.
- Tanpa gradien warna, tanpa overlay di atas ilustrasi. Pengecualian: hero Beranda dan kop berfoto
  (foto/video asli) memakai gradien `--deep-2` agar judul putih terbaca.
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
Bilah atas  : `--deep-2`, 36px, teks kecil ("Situs informasi…", bukan "situs resmi"); jam hari ini & tautan kontak (desktop).
Header      : 72px, `--surface`, menempel saat digulir. Nav aktif = garis belerang 3px di bawah.
Hero beranda: video Danau Linow berulang tanpa suara (poster saat dimuat / "kurangi gerak"), gradien
              `--deep-2` dari kiri atas, judul putih di kiri atas, tombol Jeda/Putar di kanan bawah. Dua tombol: Jelajahi wisata (utama) & Layanan surat (sekunder).
Papan info  : panel putih bergaris atas belerang yang menumpang 88px di tepi bawah hero; berisi angka ringkas.
Kop halaman : bidang `--deep` + garis kontur samar di kanan; tepi bawah berupa siluet punggungan gunung
              yang warnanya mengikuti seksi di bawahnya (kelas `tepi-putih` bila seksi itu putih).
Eyebrow     : kotak belerang 9px + label huruf besar di atas judul seksi.
Kartu       : `--surface`, border 1px, foto 3:2. Hover: naik 3px, border `--primary`, bayangan lembut.
              Kartu wisata menampilkan baris info tiket & jam (baris pertama sel, maks 2 baris).
Grid kartu  : `.grid-adaptif` — lihat §6.
Tombol      : `--primary` teks putih; sekunder bergaris; `tombol-belerang` (di bidang gelap, teks `--ink`).
Statistik   : `.deret-statistik`, pembatas garis rambut; jumlah kolom mengikuti jumlah angka.
Tabel       : garis horizontal saja, header latar `--bg`, baris total bergaris tebal.
Footer      : `--deep-2`, siluet punggungan di atasnya, 3 kolom, judul kolom `--toska`.
Orang       : foto statis bila ada; bila tidak, monogram inisial di latar `--toska-muda`. Tanpa foto stok.
Struktur    : pimpinan = panel `--deep` berpotret 4:5, nama besar, daftar jabatan yang dibawahi.
              Bawahan langsung = kolom kartu; staf mereka di dalam kolom. Garis penghubung tipis `--line`:
              HP/tablet berupa garis jalur di kiri, desktop berupa rel mendatar (bila ≤ 4 kolom).
Layanan     : daftar surat buka-tutup. Judul surat menampilkan waktu & biaya; syarat = kotak centang,
              alur = langkah bernomor bergaris (urutannya bermakna), catatan = blok `--belerang-muda`.
              Kelompok per kategori, pencarian & penyaring muncul hanya bila berguna.
Lingkungan  : nomor lingkungan sebagai angka besar `--primary`, batang porsi jiwa `--primary` di atas `--toska-muda`.
Bagan KKT   : pengurus inti di puncak (ketua di tengah, bergaris belerang, diapit sekretaris & bendahara),
              garis turun ke kolom bidang (kepala `--deep` berikon, koordinator berlatar `--toska-muda`,
              anggota dalam daftar ringkas). Panel dosen lapangan memakai bidang `--deep`.
Kop berfoto : `.kop-berfoto` — kop halaman dengan latar foto `img/hero/<halaman>.webp` + gradien `--deep-2`,
              judul putih di kiri bawah. Dipakai semua halaman utama (Profil, Pemerintahan, Penduduk, Layanan,
              Wisata, Kontak, KKT); Cek Data tetap kop polos. Foto terang/bertulisan (meja kantor Pemerintahan,
              Layanan, Kontak) memakai `.latar-pekat` agar breadcrumb & judul ≥ 4,5:1;
              KKT memakai `.kop-tinggi` (setinggi kop wisata) karena foto timnya tokoh utama halaman; di bawah
              1024px `.kop-foto-atas` menaruh foto (4:3) di atas judul yang memudar ke `--deep`.
Kop wisata  : latar foto atau video (berulang, tanpa suara) selebar layar, tinggi 72vh (440–760px), judul di
              kiri bawah + jam & tiket berikon belerang. Video: tombol Jeda/Putar bulat di kanan bawah;
              "kurangi gerak"/hemat data = poster saja. Tepi bawah tetap siluet punggungan.
Galeri wisata: baris rata kiri-kanan (justified) — lebar kotak sebanding rasio fotonya, jadi potret & lanskap
              tidak terpotong dan setiap baris penuh; tinggi baris ideal 110 / 200 / 240px (HP / tablet /
              desktop). Video bertanda lingkaran putar. Klik = diperbesar di `<dialog>` berlatar `--deep-2`
              92% (video diputar dengan kendali), panah kiri/kanan & Esc.
Kontak      : HP 1 kolom, tablet & desktop 2 kolom; jumlah ganjil → kartu pertama (mis. Lurah) satu baris
              penuh, sehingga tidak ada sel kosong.
Sejarah     : bagian bersambung garis waktu tipis `--line` dengan penanda kotak belerang; judul tiap bagian
              `.judul-kartu`, butir "Label: isi" ditebalkan labelnya.
Visi & misi : bidang `--deep` (sorotan Profil); visi huruf judul besar putih, misi bernomor belerang bergaris rambut.
Cek Data    : satu kartu per tab; temuan bergaris kiri `--danger` (perlu diperbaiki), `--accent` (periksa),
              `--toska` (info). Alat admin, tidak ada di menu.

## 6. GRID ADAPTIF
Kartu yang jumlahnya ditentukan admin (wisata, kolom struktur aparat, lingkungan) memakai
`.grid-adaptif`. `aturKolom()` di `komponen.js` menghitung:

    baris = ceil(n / maks)      kolom = ceil(n / baris)      (maks bawaan 4, atribut data-maks)

| Jumlah kartu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Susunan desktop | 1 | 2 | 3 | 4 | 3+2 | 3×2 | 4+3 | 4×2 |

Baris terakhir yang tidak penuh diletakkan di tengah. Tablet (640–1023px) 2 kolom; HP 1 kolom.
Kontak memakai `.grid-kontak` dan galeri wisata `.galeri-media` (lihat §5).
Satu kartu dibatasi lebar 560px agar tidak melebar sepanjang layar.

## 7. IKON & GAMBAR
- Ikon garis Lucide. DILARANG emoji sebagai ikon UI.
- Ilustrasi bawaan bergaya poster (bidang datar, palet di atas). Semua foto statis di `img/`, didaftarkan
  di kode (lihat README › Foto); spreadsheet tidak mengatur foto. Wajib alt.
- Rasio: kartu 3:2, pas foto 3:4, hero penuh layar. Foto gagal dimuat → `img/umum/placeholder.webp`.

## 8. GERAK
- Hanya fade & translate halus, 200–500ms, ease-out; animasi muncul saat digulir, sekali jalan.
- Animasikan hanya transform & opacity. Wajib menghormati `prefers-reduced-motion`.
- Tanpa parallax, tanpa library animasi, tanpa animasi berulang (kecuali ikon memuat).

## 9. ATURAN MUTLAK
1. Mode terang saja. Tidak ada dark mode / toggle tema.
2. Mobile first. Uji di lebar 360px; tanpa gulir horizontal.
3. Tanpa glassmorphism, blur, neon, efek 3D, gradien warna-warni.
4. Warna di luar palet = ditolak. Kontras teks minimal 4,5:1.
5. Tidak ada data di HTML — semua isi teks dari spreadsheet, foto dari `img/` (lihat README).
