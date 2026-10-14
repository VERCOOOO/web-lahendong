# web-lahendong

Situs informasi Kelurahan Lahendong, Kecamatan Tomohon Selatan, Kota Tomohon, Sulawesi Utara —
disusun oleh Mahasiswa KKT Unsrat Angkatan 149. Sengaja tidak menyebut diri situs resmi pemerintah;
footer mengingatkan pengunjung untuk memastikan keperluan administrasi ke kantor kelurahan.
HTML + Tailwind (CDN) + JavaScript biasa — tanpa build step.

| Dokumen | Untuk |
|---|---|
| **README** (berkas ini) | Admin: mengelola isi lewat spreadsheet & mengganti foto |
| [**docs/PANDUAN-TEKNIS.md**](docs/PANDUAN-TEKNIS.md) | Pengembang: struktur repo, alur data, fungsi kunci, resep mengubah kode |
| [**docs/DESIGN-SPEC.md**](docs/DESIGN-SPEC.md) | Aturan desain: warna, tipografi, komponen |

Situs terbit: <https://vercoooo.github.io/web-lahendong/>

## Cara kerja: spreadsheet → situs

Semua **isi** situs (angka, nama, teks, daftar) dibaca dari satu Google Sheet setiap kali halaman
dibuka. Mengubah sel di sheet = mengubah isi situs; hasilnya tampil saat halaman dimuat ulang.
Kode hanya menentukan **tampilan**.

| Tab sheet | Tampil di halaman | Isi |
|---|---|---|
| `profil` | Profil, Kontak, Layanan, Penduduk, Beranda, header & footer | Alamat, telepon, email & jam layanan; letak, koordinat, luas, ketinggian, suhu; batas wilayah; visi & misi; tahun & sumber data |
| `sejarah` | Profil (bagian Sejarah) | Satu baris per bagian: `judul` & `isi` (baris berawalan `- ` menjadi butir) |
| `lingkungan` | Penduduk, Beranda (angka ringkas), Pemerintahan (kartu lingkungan) | Satu baris per lingkungan — **semua total dihitung dari sini** |
| `aparat` | Pemerintahan (struktur), Beranda (pimpinan), Kontak | Satu baris per aparat |
| `kontak` | Kontak | Nomor darurat & layanan umum selain aparat |
| `wisata` | Wisata, detail wisata, Beranda | Satu baris per destinasi — **daftar destinasi tetap**, hanya keterangannya yang diubah |
| `layanan` | Layanan, Beranda (daftar surat) | Satu baris per jenis surat |

Tabel yang sama, beserta arti setiap kolom, ada di tab `petunjuk` pada spreadsheet.

**Tidak diatur dari spreadsheet:** judul dan kalimat pengantar tiap halaman (berkas HTML),
**semua foto** (lihat [Foto](#foto-statis-diatur-pengembang)), peta wilayah (`img/umum/peta-wilayah.png` — tampil otomatis bila ada), dan
halaman **KKT Unsrat Angkatan 149** (`kkt.html`, ditautkan dari baris bawah footer, tidak ada di menu):
datanya ditulis di `DATA_KKT` pada awal [`assets/js/halaman/kkt.js`](assets/js/halaman/kkt.js) —
nama, NIM, fakultas, peran (opsional), serta dosen lapangan (pembimbing & pengawas), periode, dan
paragraf "tentang". Foto mahasiswa otomatis `img/kkt/<nim>.webp`.

## Mengelola spreadsheet

Spreadsheet dirancang agar sulit salah isi:

- **Tidak ada kode/id yang perlu dikarang.** Setiap baris dikenali dari kolom pertamanya
  (nama, jabatan, judul) — kolom yang judulnya berwarna hijau tua. Situs membuat kodenya sendiri:
  "Danau Linow" → `wisata-detail.html?id=danau-linow`.
- **Tidak ada angka yang ditulis dua kali.** Jumlah penduduk, KK, laki-laki/perempuan, jumlah jiwa per
  lingkungan, dan jumlah lingkungan dihitung dari tab `lingkungan`.
- **Dropdown** untuk isian pilihan: `tampil`, `kategori`, `atasan` (aparat, diambil dari kolom jabatan), dan
  `nama` di tab `wisata` (daftar destinasi tetap).
- **Catatan di judul kolom**: arahkan kursor ke judul kolom untuk melihat arti dan contohnya.
- **Halaman [Cek Data](https://vercoooo.github.io/web-lahendong/cek-data.html)** memeriksa seluruh sheet
  dan menunjukkan setiap isian yang keliru: kolom salah ketik, atasan tidak ditemukan, angka tidak valid,
  destinasi wisata yang tidak terdaftar, nama kembar, sampai deret angka yang mirip NIK. Buka setelah mengedit.

### Pekerjaan sehari-hari

- **Menambah**: isi baris kosong pertama di bawah data.
- **Menghapus**: klik kanan nomor baris → **Hapus baris**.
- **Menyembunyikan sementara**: kolom **`tampil`** = `Tidak` (tab wisata, layanan, kontak).
- **Mengurutkan**: urutan di situs = urutan baris di sheet. Pindahkan barisnya.
- **Susunan kartu** menyesuaikan jumlah baris sendiri (maks. 4 per baris di desktop).

### Foto (statis, diatur pengembang)

Spreadsheet hanya berisi teks. Semua foto disimpan di folder `img/` dengan **nama berkas tetap**, jadi
mengganti foto = menimpa berkas bernama sama; kode tidak perlu diubah. Tempat yang fotonya belum ada sudah
diisi **placeholder** (kop bertuliskan "FOTO HERO · …" dan siluet abu-hijau untuk pas foto).

| Foto | Berkas | Status |
|---|---|---|
| Hero Beranda — video berulang tanpa suara | `img/hero/beranda.mp4`, `beranda-hp.mp4`, `beranda.webp` (poster) | Asli |
| Kop Profil · Pemerintahan · Penduduk · Kontak · KKT | `img/hero/<halaman>.webp` (+ `<halaman>-hp.webp` untuk HP) | Placeholder |
| Kop Layanan · Wisata | `img/hero/layanan.webp`, `img/hero/wisata.webp` (+ `-hp`) | Asli |
| Pas foto mahasiswa KKT (3:4) | `img/kkt/<nim>.webp`, mis. `img/kkt/230211060074.webp` | Placeholder |
| Dosen Pembimbing / Pengawas Lapangan | `img/kkt/dosenpemlap.webp` / `img/kkt/dosenpenglap.webp` | Placeholder |
| Kartu, latar kop & galeri tiap destinasi | `img/wisata/<kode>/` — didaftarkan di `DESTINASI` ([`komponen.js`](assets/js/komponen.js)) | Asli |
| Aparat & kepala lingkungan (opsional; tanpa foto = monogram) | `img/orang/` — didaftarkan di `FOTO_ORANG` | — |
| Logo & favicon | `img/logo/` | Asli |

**Mengirim foto lewat Google Drive.** Taruh foto dalam satu folder Drive dengan nama berkas berikut
(format bebas: JPG, PNG, HEIC, WebP; ukuran asli kamera tidak masalah), lalu berikan tautan foldernya:

| Nama berkas di Drive | Dipasang sebagai |
|---|---|
| `hero-profil.jpg`, `hero-pemerintahan.jpg`, `hero-penduduk.jpg`, `hero-layanan.jpg`, `hero-wisata.jpg`, `hero-kontak.jpg`, `hero-kkt.jpg` | Kop halaman itu (lanskap, minimal 1920 px lebar) |
| `230211060074.png` (NIM) | Pas foto mahasiswa ber-NIM itu (wajah di sepertiga atas) |
| `dosenpemlap.jpg` / `dosenpenglap.jpg` | Dosen Pembimbing / Pengawas Lapangan |

Pengembang mengunduhnya ke `data/` lalu menjalankan `python3 tools/pasang_foto.py data/<folder>`: setiap foto
dipotong, diperkecil, dan diubah ke WebP sesuai tempatnya. Nama yang salah ketik dilaporkan, tidak dipasang.

**Foto wisata:** simpan foto asli di `data/<destinasi>/` (folder ini tidak ikut di-commit), lalu proses ke
`img/wisata/<kode>/` dengan `python3 tools/siapkan_foto.py ASLI TUJUAN.webp --jenis kartu|latar|galeri`
(kartu dipotong 3:2, latar & galeri rasio asli). Pola nama: `kartu.webp`, `latar.webp`/video, `foto-1.webp`,
`foto-2.webp`, … berurutan. Foto galeri boleh lanskap maupun potret — galeri menyusun baris yang rata
kiri-kanan, jadi tidak ada yang terpotong.

**Video** (hero Beranda maupun latar wisata): `python3 tools/siapkan_video.py ASLI.mp4 img/hero/beranda`
membuat versi layar lebar, versi HP, dan poster sekaligus, tanpa suara, dengan sambungan perulangan yang
dibaurkan. Saran: MP4 720p–1080p, kamera diam, 10–30 detik, di bawah ±8 MB. Latar wisata berupa video ditulis
`{ berkas: "latar.mp4", hp: "latar-hp.mp4", poster: "latar.webp" }` di `DESTINASI`.

**Daftar destinasi wisata tetap.** `DESTINASI` sekaligus daftar destinasinya: baris di tab `wisata`
yang namanya tidak terdaftar tidak tampil (Cek Data memberi tahu). Menambah destinasi = buat folder
`img/wisata/<kode>/`, daftarkan di `DESTINASI`, tambahkan barisnya di `data-contoh.js`, lalu buat ulang
template (dropdown `nama` mengikuti `data-contoh.js`).

### Tab `profil`

Satu baris = satu informasi. Kolom `kunci` adalah nama tetap yang dicari situs, `nilai` isinya,
`keterangan` catatan untuk admin. Daftar kunci ada di tab `petunjuk`; kunci yang salah ketik
ditandai halaman Cek Data beserta saran ejaan yang benar.

### Layanan surat

- Satu baris = satu jenis surat. **`syarat`** dan **`alur`**: satu butir per baris di dalam sel
  (Ctrl+Enter) — tampil sebagai daftar periksa dan langkah bernomor.
- **`kategori`** (opsional) mengelompokkan surat dan memunculkan tombol penyaring; **`catatan`**
  (opsional) tampil sebagai pemberitahuan. Kotak pencarian muncul otomatis bila surat ≥ 5.
- Tautan langsung ke satu surat: `layanan.html#surat-keterangan-domisili`.

### Aparat, struktur, dan kontak

- Satu orang cukup ditulis **sekali**, di tab `aparat`. Kolom pertama `jabatan`.
- Kolom **`atasan`** berisi **jabatan** atasannya (pilih dari dropdown). Kosong = pimpinan (Lurah).
  Bawahan langsung Lurah tampil sebagai kolom; staf yang atasannya Sekretaris/Kasi tampil di dalam kolom itu.
  Pergantian pejabat cukup mengubah kolom `nama`; bila nama jabatan diganti, ubah juga isian `atasan`
  bawahannya (Cek Data menandainya).
- Isi kolom **`nomor`** bila nomor aparat itu boleh tampil di halaman Kontak.
- Tab `kontak` untuk nomor **selain aparat**. `kategori`: `darurat` atau `umum`.

### Aturan pengisian

- **Sel kosong = bagian itu disembunyikan** di situs. Situs tidak pernah mengisi data karangan.
- **Beberapa paragraf/butir dalam satu sel**: pisahkan dengan baris baru (Ctrl+Enter atau
  Alt+Enter; Mac: Cmd+Enter).
- **Angka** tanpa pemisah ribuan (`2235`); desimal boleh koma (`7,85`).
- **Semua sel berformat Teks biasa** — jangan diubah. Tanpa itu Google bisa mengubah isian diam-diam.
- **`maps_link`**: tautan Google Maps lengkap berawalan `https://`.
- **Sheet dapat dibaca publik** — jangan simpan NIK, alamat rumah, atau nomor pribadi di tab mana pun.

### Data yang masih contoh

Nilai yang belum ada data resminya ditandai **CONTOH** di kolom `keterangan` dan wajib diganti
sebelum situs diumumkan:

- Masih kosong: kepala & wakil kepala Lingkungan 7, cara menuju lokasi Mah’Watu, dan pengelola tiap destinasi
  (diisi hanya bila sudah pasti; kolom kosong tidak ditampilkan).

### Menyambungkan sheet ke situs

1. Buat spreadsheet dari [`data/template-data-lahendong.xlsx`](data/template-data-lahendong.xlsx):
   **File → Impor → Upload → Ganti spreadsheet**. (Mengimpor ke spreadsheet yang sudah ada
   mempertahankan ID dan tautannya.)
2. **Bagikan → Akses umum → Siapa saja yang memiliki link → Pelihat**.
3. Salin ID dari tautan sheet — bagian di antara `/d/` dan `/edit` — ke
   [`assets/js/data.js`](assets/js/data.js):

   ```js
   const PAKAI_DUMMY = false;
   const ID_SPREADSHEET = "11f8D-qzWt…";
   ```

Situs mencari setiap tab berdasarkan namanya, jadi hanya ID ini yang perlu diisi.
Untuk kembali memakai data contoh (tanpa sheet), ubah `PAKAI_DUMMY` menjadi `true`.

### Jika data tidak muncul

Buka halaman **Cek Data** (`cek-data.html`) lebih dulu — hampir semua penyebab ditunjukkan di sana
dalam bahasa biasa. Untuk detail teknis, buka konsol browser (F12 → Console); pesan berawalan
`[data]` menyebut penyebabnya:

| Pesan | Artinya |
|---|---|
| `permintaan gagal` / `yang diterima halaman HTML` | Akses sheet bukan "Siapa saja yang memiliki link", atau tidak ada koneksi |
| `tab "…" tidak ditemukan` | Nama tab diubah atau belum ada, atau judul kolom pertamanya hilang |
| `tidak punya kolom: …` | Nama kolom di baris judul berubah — samakan dengan template |
| `atasan "…" tidak ditemukan atau melingkar` | Kolom atasan di tab `aparat` berisi jabatan yang tidak ada |
| `jabatan "…" sudah ada di tab "aparat"` | Baris ganda di tab `kontak` — pindahkan nomornya ke tab `aparat`, lalu hapus barisnya |
| `server membalas HTTP 404` | ID spreadsheet salah ketik, atau sheet sudah dihapus |

## Struktur kode

```
├── *.html          satu berkas per halaman (di akar repo agar alamat situs tetap)
├── assets/
│   ├── css/        style.css — sistem desain
│   └── js/         data.js, data-contoh.js, ui.js, komponen.js, halaman/<halaman>.js
├── img/
│   ├── logo/       logo & favicon
│   ├── hero/       kop tiap halaman
│   ├── kkt/        pas foto mahasiswa (<nim>.webp) & dosen
│   ├── wisata/     foto & video tiap destinasi
│   └── umum/       placeholder & peta wilayah
├── data/           template spreadsheet
├── tools/          skrip Python: template, foto, video, penanda versi
└── docs/           PANDUAN-TEKNIS.md, DESIGN-SPEC.md
```

Rincian setiap berkas, alur data, dan resep mengubah kode ada di [**Panduan Teknis**](docs/PANDUAN-TEKNIS.md).

**Sebelum commit perubahan CSS/JS**, jalankan `python3 tools/versi_aset.py` agar browser pengunjung langsung
mengambil berkas baru. Pratinjau lokal: `python3 -m http.server`, lalu buka `http://localhost:8000`.
