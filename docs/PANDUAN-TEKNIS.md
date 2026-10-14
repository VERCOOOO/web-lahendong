# Panduan Teknis

Cara situs ini bekerja dari dalam: dari sel di Google Sheet sampai kartu di layar, apa isi setiap berkas,
dan cara mengubah kode tanpa merusak yang lain. Panduan pengelolaan isi (admin) ada di [README](../README.md);
aturan desain di [DESIGN-SPEC.md](DESIGN-SPEC.md).

**Daftar isi**

1. [Gambaran besar](#1-gambaran-besar)
2. [Struktur repositori](#2-struktur-repositori)
3. [Alur data](#3-alur-data)
4. [Fungsi kunci](#4-fungsi-kunci)
5. [Grid adaptif](#5-grid-adaptif)
6. [Layanan & struktur aparat](#6-layanan--struktur-aparat)
7. [Sistem tampilan](#7-sistem-tampilan)
8. [Foto & video](#8-foto--video)
9. [Resep perubahan](#9-resep-perubahan)
10. [Mencari kesalahan](#10-mencari-kesalahan)
11. [Menerbitkan](#11-menerbitkan)

---

## 1. Gambaran besar

Situs statis yang membaca spreadsheet. Tidak ada server, database, maupun proses build. GitHub Pages hanya
mengirim berkas apa adanya: HTML, CSS, JavaScript, dan gambar. Setelah halaman terbuka, JavaScript di browser
pengunjung mengunduh isi Google Sheet dalam bentuk CSV, lalu menyusunnya menjadi HTML.

| Lapisan | Tugas |
|---|---|
| Google Sheet | Isi: angka, nama, teks, daftar |
| HTML | Kerangka halaman: judul, kalimat pengantar, wadah kosong yang nanti diisi |
| JavaScript | Mengambil data dan mengisi wadah |
| CSS (`style.css` + kelas Tailwind) | Rupa |
| `img/` | Semua foto & video (spreadsheet tidak mengatur foto) |

Pustaka luar dari CDN hanya empat: Tailwind (kelas utilitas seperti `mt-4`), Lucide (ikon), PapaParse
(membaca CSV), dan Chart.js (grafik, hanya di halaman Penduduk). Tidak ada npm, jadi tidak ada yang perlu dipasang.

## 2. Struktur repositori

```
kelurahan-lahendong.github.io/
├── index.html              Beranda
├── profil.html             ┐
├── pemerintahan.html       │
├── penduduk.html           │ satu berkas per halaman — hanya markup, tanpa data & logika.
├── layanan.html            │ Tetap di akar repo agar alamat situs (mis. layanan.html#surat-…)
├── wisata.html             │ tidak berubah.
├── wisata-detail.html      │
├── kontak.html             │
├── kkt.html                │ tidak ada di menu; ditautkan dari footer
├── cek-data.html           ┘ alat admin; tidak ada di menu
│
├── assets/
│   ├── css/style.css       sistem desain: token warna, tipografi, komponen
│   └── js/
│       ├── data.js         pengaturan (PAKAI_DUMMY, ID_SPREADSHEET), SKEMA tab, ambilData()
│       ├── data-contoh.js  DATA_DUMMY: data awal & sumber template .xlsx
│       ├── ui.js           kerangka bersama: menu, header, footer, breadcrumb, info kantor, animasi
│       ├── komponen.js     DESTINASI, FOTO_ORANG, isiDariData(), aturKolom(), potongan HTML bersama
│       └── halaman/        logika per halaman (index.html → beranda.js, lainnya bernama sama)
│
├── img/
│   ├── logo/               logo.svg, favicon-32.png, apple-touch-icon.png
│   ├── hero/               latar kop tiap halaman: <halaman>.webp + <halaman>-hp.webp
│   │                       (beranda: video beranda.mp4, beranda-hp.mp4, poster beranda.webp)
│   ├── kkt/                pas foto 3:4: <nim>.webp, dosenpemlap.webp, dosenpenglap.webp
│   ├── wisata/<kode>/      kartu.webp, latar.*, foto-1.webp, foto-2.webp, … per destinasi
│   ├── orang/              (bila ada) foto aparat & kepala lingkungan, didaftarkan di FOTO_ORANG
│   └── umum/               placeholder.webp (foto gagal dimuat), peta-wilayah.png (bila ada)
│
├── data/                   template-data-lahendong.xlsx (foto/video asli juga di sini, tidak di-commit)
├── tools/                  skrip Python pembantu (lihat tabel di bawah)
├── docs/                   PANDUAN-TEKNIS.md (berkas ini), DESIGN-SPEC.md
└── README.md               panduan admin: mengelola spreadsheet & foto
```

| Berkas | Kapan diubah |
|---|---|
| `*.html` | Mengubah judul/teks tetap, menambah seksi |
| `assets/css/style.css` | Mengubah rupa |
| `assets/js/data.js` | Ganti sheet, tambah tab/kolom. Berisi juga utilitas nilai (`keAngka`, `escapeHtml`, `urlAman`) |
| `assets/js/data-contoh.js` | Bersama perubahan `SKEMA` |
| `assets/js/ui.js` | Menambah halaman ke menu (`NAV_LINKS`), mengubah header/footer |
| `assets/js/komponen.js` | Menambah foto wisata/aparat, mengubah potongan bersama |
| `assets/js/halaman/kkt.js` | Mengubah daftar mahasiswa KKT (`DATA_KKT` — satu-satunya data yang ditulis di kode) |
| `assets/js/halaman/cek-data.js` | Menambah aturan pemeriksaan sheet (`ATURAN_TAB`) |
| `tools/buat_template.py` | Membuat ulang template `.xlsx` dari `SKEMA` & `DATA_DUMMY` (butuh LibreOffice) |
| `tools/siapkan_foto.py` | Mengolah satu foto ke WebP: `kartu`, `latar`, `galeri`, `hero`, `potret` |
| `tools/pasang_foto.py` | Memasang banyak foto sekaligus dari satu folder, menurut nama berkas |
| `tools/siapkan_video.py` | Mengolah video latar (versi layar lebar, HP, poster) |
| `tools/versi_aset.py` | Memberi penanda versi CSS/JS di semua HTML — jalankan sebelum commit |

Template `data/template-data-lahendong.xlsx`: semua sel berformat Teks biasa (termasuk 100 baris kosong siap
isi), judul kolom dibekukan dan diberi catatan arti + contoh, kolom pertama (wajib) berwarna hijau tua,
dropdown untuk `tampil`/`kategori`/`atasan` dan `nama` wisata.

**Urutan skrip penting.** Setiap halaman memuat `data.js` → `data-contoh.js` → `ui.js` → `komponen.js` →
`halaman/<nama>.js`. Berkas yang dimuat belakangan memakai fungsi dari berkas sebelumnya, tidak sebaliknya.

## 3. Alur data

Contoh: pengunjung membuka `wisata.html`.

1. **Browser memuat halaman** — HTML berisi `<div id="grid-wisata">` yang masih kosong, lalu skrip dimuat berurutan.
2. **`ui.js` menggambar kerangka** — header, footer, breadcrumb, dan info kantor (`data-profil`) diisi saat `DOMContentLoaded`.
3. **`wisata.js` memanggil `isiDariData()`** — wadah langsung menampilkan "Memuat data…", lalu `ambilData("wisata")` dipanggil.
4. **`ambilData()` mengunduh CSV** dari
   `docs.google.com/spreadsheets/d/{ID}/gviz/tq?tqx=out:csv&sheet=wisata`. Google mencari tab berdasarkan nama.
   Batas waktu 15 detik.
5. **PapaParse membaca CSV** — baris pertama menjadi nama kolom (`"Jumlah KK"` → `jumlah_kk`), setiap baris
   menjadi satu objek (`{ nama: "Danau Linow", ringkas: "…", … }`) ditambah `_baris` = nomor barisnya di sheet.
6. **Data dirapikan** — kolom diperiksa terhadap `SKEMA`, kolom yang hilang diisi kosong, setiap nilai di-escape,
   baris yang kolom pertamanya kosong atau `tampil` = Tidak dibuang (`saringBaris`), dan setiap baris diberi kode
   dari kolom pertamanya (`beriKode`). Hasilnya disimpan di memori, jadi tab yang sama tidak diunduh dua kali.
7. **Fungsi render membuat HTML** — `data.map(kartuWisata).join("")` dipasang ke wadah.
8. **Sentuhan akhir** — `aturKolom()` menyusun kolom, Lucide mengganti `<i data-lucide>` menjadi ikon, animasi muncul diaktifkan.

Bila langkah 4–6 gagal (sheet privat, tanpa internet, nama tab salah), wadah menampilkan pesan ramah seperti
"Daftar destinasi belum bisa dimuat saat ini", dan penyebab teknisnya dicatat di konsol dengan awalan `[data]`.

**Mode data contoh.** Bila `PAKAI_DUMMY = true` di `data.js`, langkah 4–5 dilewati dan data diambil dari
`DATA_DUMMY` di `data-contoh.js`. Langkah 6 tetap sama persis, jadi tampilan kedua mode identik — berguna untuk
mencoba perubahan kode tanpa internet.

## 4. Fungsi kunci

### `SKEMA` — data.js

Daftar kolom setiap tab, berurutan seperti di sheet. Kolom pertama adalah kunci baris: baris yang kuncinya
kosong diabaikan, begitu juga baris yang `tampil`-nya "Tidak". Tidak ada kolom `id` di tab mana pun: setiap baris
mendapat `id` otomatis dari kolom pertamanya lewat `kodeDari()` — "Danau Linow" → `danau-linow` (nama kembar
diberi akhiran `-2`). Tidak ada angka yang ditulis dua kali: semua total penduduk dihitung `ringkasPenduduk()` dari
tab `lingkungan`. Kolom yang hilang di sheet hanya memunculkan peringatan dan terbaca kosong; bila **kolom
pertama** hilang, tab dianggap salah dan data ditolak.

```js
const SKEMA = {
  profil:  ["kunci", "nilai", "keterangan"],        // tab kunci-nilai
  sejarah: ["judul", "isi"],                        // satu baris per bagian
  wisata:  ["nama", "tampil", "ringkas", "deskripsi", …],
  aparat:  ["jabatan", "nama", "atasan", "nomor"],   // atasan = jabatan
  …
};
```

### `ambilData(namaTab) → Promise<Array>` — data.js

Satu-satunya pintu masuk data. Mengembalikan array objek yang sudah rapi dan aman. Setiap tab diunduh sekali per
kunjungan halaman (`tembolokData`); bila gagal, simpanan dihapus agar pemanggilan berikutnya mencoba lagi.

```js
const wisata = await ambilData("wisata");
// [{ id: "danau-linow", nama: "Danau Linow", ringkas: "…", _baris: 2, … }, …]
```

### `isiDariData(wadah, tab, render, opsi)` — komponen.js

Pola baku setiap blok data, sehingga penanganan memuat, kosong, dan gagal seragam di mana-mana.

- `tab`: satu nama tab, atau array nama tab (render lalu menerima array hasil).
- `render(data)`: mengembalikan string HTML. String kosong = "tidak ada data".
- `opsi.kosong` / `opsi.gagal`: pesan. Isi `null` agar wadah dihapus diam-diam (untuk blok pelengkap).
- `opsi.setelah(data)`: dijalankan setelah HTML terpasang, mis. untuk menggambar grafik.

```js
isiDariData(document.getElementById("grid-wisata"), "wisata",
  (data) => data.map((item) => kartuWisata(item)).join(""),
  { kosong: "Belum ada destinasi wisata.", gagal: "Daftar destinasi belum bisa dimuat saat ini." }
);
```

### `aturKolom(wadah)` — komponen.js

Menghitung jumlah kolom dari jumlah kartu yang tampil, menyimpannya di variabel CSS `--kolom` dan atribut
`data-kolom`. Dipanggil otomatis oleh `isiDariData()` untuk setiap `.grid-adaptif` dan `.deret-statistik`.

### `DESTINASI`, `FOTO_ORANG` & `visualOrang()` — komponen.js

`DESTINASI` sekaligus daftar destinasi: `wisataTetap()` membuang baris tab `wisata` yang kodenya tidak terdaftar,
sehingga admin tidak bisa menambah destinasi tanpa foto (Cek Data menandainya). Rinciannya di [§8](#8-foto--video).

`visualOrang(orang, kelas)` memakai isian `foto` (mis. dari `DATA_KKT`) atau `FOTO_ORANG` menurut kode nama —
berlaku untuk aparat, kepala lingkungan, dan Kontak. Monogram inisial selalu dirender di belakang foto, jadi
bila foto tidak ada atau gagal dimuat, monogramlah yang tampil.

### `isiInfoKantor()` — ui.js

Mengisi setiap elemen bertanda `data-profil="kunci"` dari tab `profil`, di halaman mana pun. Bila nilainya
kosong, wadah terdekat `[data-wadah-profil]` dihapus. `data-profil-tautan="tel"`/`"mailto"` menjadikannya tautan;
`data-profil-format="jadwal"` menampilkan jam layanan sebagai daftar hari–jam (`jadwalDari()`), dan `"hari-ini"`
hanya jam hari ini menurut WITA (dipakai bilah atas).

```html
<p data-wadah-profil>Jam layanan: <span data-profil="jam_layanan"></span></p>
```

### Utilitas nilai

- `escapeHtml`: setiap nilai sheet di-escape saat dirapikan, jadi `<script>` di sel tampil sebagai teks. Nilai dari `ambilData()` aman disisipkan ke HTML.
- `teksPolos`: kebalikannya, untuk konteks non-HTML (judul tab browser, label grafik, URL).
- `keAngka`: membaca "2235", "2.235", "7,85", "7.85"; bukan angka → `null`. `formatAngka` menulis gaya Indonesia (2.235 · 7,85).
- `barisDari`: memecah sel per baris baru; dipakai `paragraf()`, `berbaris()`, dan `daftarAtauTeks()`.

## 5. Grid adaptif

Wisata, kolom struktur aparat, dan lingkungan memakai `.grid-adaptif`: bagi kartu ke baris sesedikit mungkin
(maks. 4 per baris), lalu bagi rata per baris.

```js
function hitungKolom(n, maks = 4) {
  const baris = Math.ceil(n / maks);   // 6 kartu → 2 baris
  return Math.ceil(n / baris);          // 6 / 2 → 3 kolom
}
```

| Jumlah kartu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Desktop (≥1024px) | 1 | 2 | 3 | 4 | 3+2 | 3×2 | 4+3 | 4×2 | 3×3 |
| Tablet (640–1023px) | 2 kolom | | | | | | | | |
| HP | 1 kolom | | | | | | | | |

CSS-nya flexbox agar baris terakhir yang tidak penuh bisa di tengah:

```css
.grid-adaptif { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--jarak); }
@media (min-width: 1024px) {
  .grid-adaptif > * { flex-basis: calc((100% - (var(--kolom) - 1) * var(--jarak)) / var(--kolom)); }
}
```

- `data-maks="3"` membatasi paling banyak 3 per baris.
- Jangan memasang kelas kolom Tailwind (`lg:grid-cols-4`) pada `.grid-adaptif`.
- Kontak memakai `.grid-kontak`: 2 kolom; bila ganjil, kartu pertama mengisi satu baris (murni CSS).
- `.deret-statistik` memakai hitungan yang sama, jadi bila satu angka dikosongkan sisanya tetap penuh.

## 6. Layanan & struktur aparat

### Layanan surat — `halaman/layanan.js`

- **Kelompok**: `kelompokkan()` mengumpulkan surat per `kategori`, urut sesuai kemunculan pertama; tanpa kategori masuk "Lainnya". Bila hanya satu kelompok, judul kelompok dan penyaring disembunyikan.
- **Sel → daftar**: `butirDari()` memecah `syarat` dan `alur` per baris. Sel satu baris tetap terbaca: syarat dipecah di koma/titik koma, alur di `→`.
- **Pencarian & penyaring**: teks dicari di atribut `data-cari`; `terapkanSaringan()` menyembunyikan yang tidak cocok. Kotak cari muncul bila surat ≥ 5.
- **Tautan langsung**: kode surat menjadi `id`; `bukaDariAlamat()` membuka `layanan.html#surat-keterangan-domisili`. Beranda memakainya (`MAKS_LAYANAN_BERANDA` = 6).

### Struktur aparat — `halaman/pemerintahan.js`

- `susunPohon()` mengubah tab `aparat` menjadi pohon: `atasan` berisi jabatan atasan, dicocokkan longgar oleh `samaJabatan()`. Baris tanpa atasan (atau atasannya tidak ditemukan) menjadi puncak; `adalahBawahan()` mencegah susunan melingkar.
- `renderStruktur()` menggambar puncak sebagai panel pimpinan, bawahan langsung sebagai kolom (`.cabang` dalam `.grid-adaptif`), dan staf mereka sebagai daftar bertingkat (`daftarStaf()`, rekursif).
- Garis penghubung murni CSS: HP/tablet berupa garis jalur di kiri; desktop berupa rel mendatar bila kelas `.tersambung` (bawahan langsung ≤ 4).
- Kartu lingkungan: "Lingkungan 3" sebagai angka besar dan batang `.porsi` = jiwa dibanding lingkungan terbesar.

Bagan KKT (`halaman/kkt.js`) memakai kelas yang sama (`.cabang-struktur`, `.cabang`).

## 7. Sistem tampilan

- **Warna**: hanya di `:root` pada awal `style.css`; semua komponen memakai token (`var(--primary)`). Warna grafik ada di `WARNA` pada `penduduk.js` (Chart.js tidak membaca variabel CSS).
- **Huruf**: Archivo (judul, angka) dan Plus Jakarta Sans (teks), dimuat di `<head>` setiap HTML, diatur di `--font-judul` / `--font-teks`.
- **Tailwind vs `style.css`**: Tailwind untuk jarak & tata letak sekali pakai (`mt-4`, `md:col-span-7`); `style.css` untuk komponen berulang (`.kartu`, `.tombol`, `.eyebrow`). Tailwind dimuat belakangan, jadi pada spesifisitas sama kelas Tailwind menang.
- **Kop halaman**: bidang gelap di bawah menu dengan siluet punggungan di tepi bawah; warnanya mengikuti seksi di bawahnya (kelas `tepi-putih` bila seksi itu putih). Kop berfoto (`.kop-berfoto` + `.latar-kop`) dipakai semua halaman utama — lihat [§8](#8-foto--video).

## 8. Foto & video

Semua foto statis di `img/` dan didaftarkan di kode; spreadsheet hanya berisi teks. Mengganti foto cukup
**menimpa berkas bernama sama** — kode tidak perlu diubah.

### Hero / kop halaman — `img/hero/`

Setiap halaman utama memakai pola markup yang sama:

```html
<section class="kop-halaman kop-berfoto">
  <div class="latar-kop">
    <img src="img/hero/profil.webp" srcset="img/hero/profil-hp.webp 960w, img/hero/profil.webp 1920w" sizes="100vw" alt="" />
  </div>
  <div class="wadah kop-isi">…judul…</div>
</section>
```

| Halaman | Berkas | Status |
|---|---|---|
| Beranda (video) | `beranda.mp4`, `beranda-hp.mp4`, poster `beranda.webp` | Asli |
| Profil | `profil.webp` + `profil-hp.webp` | Asli |
| Pemerintahan | `pemerintahan.webp` + `-hp` | Asli |
| Penduduk | `penduduk.webp` + `-hp` | Asli |
| Layanan | `layanan.webp` + `-hp` | Asli |
| Wisata | `wisata.webp` + `-hp` | Asli |
| Kontak | `kontak.webp` + `-hp` | Asli |
| KKT | `kkt.webp` + `-hp` (kop `.kop-tinggi .kop-foto-atas`, foto tim potret) | Asli |

Detail wisata memakai `latar` milik destinasinya; Cek Data (alat admin) tetap berkop polos.
Gradien `--deep-2` di `.latar-kop::after` menjaga judul putih terbaca; foto yang ramai/bertulisan diberi
`.latar-pekat`. Titik fokus foto bisa digeser dengan kelas Tailwind pada `<img>`, mis. `object-[center_40%]`
(di desktop foto selebar layar, jadi posisi mendatar seperti `object-[80%_center]` hanya berpengaruh di HP).
`.kop-tinggi` (72vh, seperti kop detail wisata) dipakai halaman KKT agar foto tim tidak tertutup judul; `.kop-foto-atas`
menaruh fotonya di atas judul (kotak 4:3) pada layar < 1024px, dengan titik fokus sendiri (`object-[center_76%] lg:object-[center_57%]`).

### Pas foto KKT — `img/kkt/`

`halaman/kkt.js` otomatis memakai `img/kkt/<nim>.webp` untuk setiap mahasiswa; dosen memakai
`img/kkt/dosenpemlap.webp` (Dosen Pembimbing Lapangan) dan `img/kkt/dosenpenglap.webp` (Dosen Pengawas Lapangan).
Rasio 3:4 (600 × 800 px), wajah di sepertiga atas. Berkas tidak ada = monogram inisial.

### Wisata — `img/wisata/<kode>/`

```js
const DESTINASI = {
  "danau-linow": { kartu: "kartu.webp", latar: "latar.webp", media: [{ berkas: "foto-1.webp" }, …] },
  "mah-watu":    { kartu: "kartu.webp", latar: { berkas: "latar.mp4", hp: "latar-hp.mp4", poster: "latar.webp" }, … },
};
```

- `kartu`: kartu di Wisata & Beranda, 3:2 (`fotoKartuWisata()`).
- `latar`: kop detail — foto, atau video berulang tanpa suara. Video tidak diputar otomatis bila `prefers-reduced-motion` atau `saveData`, dan selalu ada tombol Jeda (`pasangVideoLatar()`).
- `media`: galeri; jenis dikenali dari akhiran (`.mp4`/`.webm` = video). `susunGaleri()` (`halaman/wisata-detail.js`) membaca rasio tiap foto, membagi ke baris yang tingginya mendekati ideal, lalu meregangkan tiap baris selebar wadah — potret tidak terpotong, tidak ada sel kosong.

### Aparat — `img/orang/`

Simpan foto, lalu daftarkan di `FOTO_ORANG` (`komponen.js`) menurut kode nama:
`{ "reymon-stive-londok-s-t": "orang/reymon-londok.webp" }`.

### Mengolah berkas

Foto/video asli disimpan di `data/` (tidak di-commit); hanya hasil olahan di `img/` yang masuk repo.

```bash
# Banyak foto sekaligus dari satu folder (mis. unduhan Google Drive), menurut nama berkas:
#   hero-<halaman>.jpg → img/hero/<halaman>.webp + -hp.webp
#   <nim>.png          → img/kkt/<nim>.webp
#   dosenpemlap.jpg    → img/kkt/dosenpemlap.webp
python3 tools/pasang_foto.py data/unduhan-drive/

# Satu foto
python3 tools/siapkan_foto.py ASLI img/wisata/<kode>/kartu.webp --jenis kartu    # 3:2, 1200 × 800
python3 tools/siapkan_foto.py ASLI img/wisata/<kode>/foto-3.webp --jenis galeri  # sisi terpanjang 1600
python3 tools/siapkan_foto.py ASLI img/hero/profil.webp --jenis hero             # 1920 + -hp 960
python3 tools/siapkan_foto.py ASLI img/kkt/230211060074.webp --jenis potret      # 3:4, 600 × 800

# Video latar (versi 1920 px, HP 1280 px "-hp", poster; tanpa suara; sambungan perulangan dibaurkan)
python3 tools/siapkan_video.py ASLI.mp4 img/hero/beranda
python3 tools/siapkan_video.py ASLI.mp4 img/wisata/<kode>/latar --crf 31   # video ramai gerak (drone)
```

`pasang_foto.py` hanya menimpa berkas yang sudah ada, jadi nama yang salah ketik dilaporkan sebagai
"dilewati", bukan membuat berkas baru diam-diam. Orientasi EXIF dibetulkan; HEIC dibaca lewat ImageMagick.

Saran video: MP4 (H.264) 720p–1080p, tanpa suara, kamera diam, 10–30 detik yang menyambung saat berulang,
di bawah ±8 MB.

## 9. Resep perubahan

### Menambah kolom ke tab yang ada

Contoh: kolom `instagram` di tab `wisata`.

1. Tambahkan `"instagram"` di `SKEMA.wisata` (`data.js`).
2. Tambahkan `instagram: ""` ke setiap baris `wisata` di `data-contoh.js`.
3. Tampilkan di `tampilanDetail()` (`halaman/wisata-detail.js`), dengan syarat kosong = tidak tampil:
   ```js
   ${item.instagram ? `<p>@${item.instagram}</p>` : ""}
   ```
4. Tambahkan kolom yang sama di baris judul Google Sheet. Urutan kolom bebas; namanya yang penting.
5. `python3 tools/buat_template.py`.

### Menambah tab dan seksi baru

Contoh: tab `agenda` berisi kegiatan kelurahan, tampil di Beranda.

1. `data.js`: `agenda: ["judul", "tampil", "tanggal", "tempat"],   // kolom pertama = kunci baris`
2. `data-contoh.js`: tambahkan `agenda: [ { judul: "…", … } ]` ke `DATA_DUMMY`.
3. `index.html`: tambahkan seksi dengan wadah kosong `<div id="grid-agenda" class="grid-adaptif" data-maks="3"></div>`.
4. `halaman/beranda.js`:
   ```js
   isiDariData(document.getElementById("grid-agenda"), "agenda",
     (data) => data.map((a) => `
       <article class="kartu p-5">
         <p class="label-kecil">${a.tanggal}</p>
         <h3 class="judul-kartu mt-2">${a.judul}</h3>
       </article>`).join(""),
     { kosong: "Belum ada agenda.", gagal: "Agenda belum bisa dimuat." }
   );
   ```
5. Buat tab bernama persis `agenda` di Google Sheet, isi baris judulnya, format semua sel sebagai Teks biasa.
6. Perbarui tab `petunjuk` (lewat `buat_template.py`) dan tabel di README.

### Menambah halaman baru

1. Salin halaman yang mirip (mis. `layanan.html`) menjadi `agenda.html`; ganti `<title>`, kop, dan skrip terakhir menjadi `halaman/agenda.js`.
2. Kop: arahkan ke `img/hero/agenda.webp` (+ `-hp`), lalu buat placeholder atau olah fotonya dengan `siapkan_foto.py --jenis hero`.
3. Buat `assets/js/halaman/agenda.js` berisi panggilan `isiDariData()`.
4. Tambahkan `{ href: "agenda.html", label: "Agenda" }` ke `NAV_LINKS` di `ui.js` — menu dan breadcrumb semua halaman ikut berubah.

### Menambah destinasi wisata

Buat folder `img/wisata/<kode>/`, daftarkan di `DESTINASI`, tambahkan barisnya di `data-contoh.js`, lalu jalankan
`tools/buat_template.py` agar dropdown `nama` di tab `wisata` ikut memuatnya. Admin lalu mengisi barisnya di sheet.

### Mengganti nama destinasi

Kode destinasi berasal dari namanya di sheet, jadi nama yang diganti tidak lagi cocok dengan `DESTINASI` dan
barisnya tidak tampil (Cek Data menandainya). Ganti kunci `DESTINASI` dan nama foldernya (`git mv`) ke kode baru,
catat `"kode-lama": "kode-baru"` di `KODE_LAMA` (`komponen.js`) agar nama lama di sheet dan tautan `?id=` lama tetap
berlaku, ubah `nama` di `data-contoh.js`, lalu jalankan `tools/buat_template.py`. Dropdown di sheet live tidak ikut
berubah; perbarui validasinya bila perlu (Data → Validasi data).

> Jangan mengganti nama kolom pertama (`nama`, `jabatan`, `kunci`, …) atau nama tab tanpa mengubah `SKEMA` di
> saat yang sama. Google mengirim tab pertama bila nama tab tidak ditemukan; situs menolaknya dan bagian itu
> menampilkan pesan gagal.

## 10. Mencari kesalahan

1. Buka `cek-data.html`. Halaman ini membaca semua tab lewat `muatTab()` (data mentah, lengkap dengan nomor baris) dan menjalankan aturan di `ATURAN_TAB` (`halaman/cek-data.js`). Pemeriksaan baru = aturan baru di sana.
2. Buka konsol (F12 → Console). Pesan situs berawalan `[data]`.
3. Coba mode contoh (`PAKAI_DUMMY = true`). Bila masalah hilang, penyebabnya di sheet; bila tetap, di kode.
4. Jalankan lewat server lokal, bukan dobel-klik berkas (`file://` membatasi fitur browser):
   ```bash
   python3 -m http.server 8000   # buka http://localhost:8000
   ```
5. Periksa data mentah dari konsol:
   ```js
   await ambilData("lingkungan")                              // array objek yang dipakai situs
   await fetch(urlTab("lingkungan")).then((r) => r.text())    // CSV mentah dari Google
   ```

| Gejala | Penyebab umum |
|---|---|
| Semua bagian "belum bisa dimuat" | Sheet belum dibagikan "Siapa saja yang memiliki link", `ID_SPREADSHEET` salah, atau tidak ada internet |
| Satu bagian gagal | Nama tab atau kolom pertamanya berubah |
| Satu kolom selalu kosong | Nama kolom di sheet berbeda dari `SKEMA` (konsol: "tidak punya kolom") |
| Angka/teks hilang di beberapa baris | Sel tidak berformat Teks biasa; Google membuang nilai yang tipenya berbeda dari mayoritas kolom |
| Perubahan sheet belum tampil | Muat ulang; bila masih lama, tunggu 1–2 menit (Google menyimpan hasil ekspor sebentar) |
| Perubahan kode/foto belum tampil di situs terbit | GitHub Pages butuh 1–2 menit setelah push, lalu browser menyimpan cache ±10 menit. Coba Ctrl+Shift+R |
| Ikon tidak muncul | HTML baru disisipkan tanpa `segarkanTampilan()` (`isiDariData()` sudah memanggilnya otomatis) |

## 11. Menerbitkan

GitHub Pages menerbitkan cabang `main` apa adanya; setiap push ke `main` menjadi versi situs baru dalam 1–2 menit.

```bash
python3 tools/versi_aset.py   # penanda versi baru untuk CSS/JS yang berubah
git add -A
git commit -m "feat: tambah tab agenda"
git push
```

Tanpa penanda versi (`data.js?v=0cfb573f`), browser pengunjung bisa memakai HTML baru dengan JavaScript lama
selama cache 10 menit. `versi_aset.py` mengambil penanda dari isi berkas, jadi hanya berubah bila berkasnya berubah.

Urutan aman saat perubahan menyentuh sheet dan kode sekaligus:

- **Menambah kolom/tab**: kode dulu atau sheet dulu sama-sama aman (kolom yang belum ada terbaca kosong).
- **Mengganti nama kolom/tab**: siapkan keduanya, ubah sheet, lalu segera push kode.
- **Setelah mengubah `SKEMA` atau data contoh**: `python3 tools/buat_template.py`.

Semua path di situs **relatif** (tanpa garis miring di depan, mis. `img/logo/logo.svg`), sehingga situs jalan di
akar domain (`kelurahan-lahendong.github.io/`) maupun di sub-folder (`…github.io/web-lahendong/`, atau saat dibuka
lewat `python3 -m http.server` dari folder induk). Pertahankan kebiasaan ini untuk berkas baru: jangan menulis
`href="/profil.html"` atau `src="/img/..."`.

### Pindah alamat situs

Alamat sekarang `https://kelurahan-lahendong.github.io/` (repo `kelurahan-lahendong.github.io`); sebelumnya
`https://vercoooo.github.io/web-lahendong/`. GitHub **tidak** mengalihkan alamat GitHub Pages lama setelah repo
di-rename/dipindah, jadi tautan lama yang sudah tersebar akan 404. Untuk menjaganya tetap jalan:

1. Di akun lama, buat repo publik baru bernama `web-lahendong`.
2. Salin isi `tools/pengalihan-url-lama/` (`index.html` dan `404.html`) ke akar repo itu, lalu aktifkan Pages
   (Settings → Pages → Deploy from branch → `main` / root).
3. Setiap alamat lama diteruskan ke halaman yang sama di alamat baru, termasuk `?id=…` dan `#…`
   (mis. `…/web-lahendong/layanan.html#surat-keterangan-domisili` → `kelurahan-lahendong.github.io/layanan.html#surat-keterangan-domisili`).

Alamat situs untuk tab `petunjuk` spreadsheet ada di `ALAMAT_SITUS` (`tools/buat_template.py`).
