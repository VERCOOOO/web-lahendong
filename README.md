# web-lahendong

Situs resmi Kelurahan Lahendong, Kecamatan Tomohon Selatan, Kota Tomohon, Sulawesi Utara.
HTML + Tailwind (CDN) + JavaScript biasa — tanpa build step. Desain mengikuti [DESIGN-SPEC.md](DESIGN-SPEC.md).

> **Admin kelurahan:** baca [**Panduan Admin**](docs/panduan-admin.html) — versi visual dari README ini,
> lengkap dengan tabel tab ↔ halaman yang bisa disorot dan langkah untuk tugas sehari-hari.
> Versi terbit: <https://vercoooo.github.io/web-lahendong/docs/panduan-admin.html>
>
> **Pengembang:** baca [**Panduan Teknis**](docs/panduan-teknis.html) — alur data dari sheet ke halaman,
> isi setiap berkas, fungsi kunci, grid adaptif, dan resep mengubah kode.

## Cara kerja: spreadsheet → situs

Semua **isi** situs (angka, nama, teks, daftar) dibaca dari satu Google Sheet setiap kali halaman
dibuka. Mengubah sel di sheet = mengubah isi situs; hasilnya tampil saat halaman dimuat ulang.
Kode hanya menentukan **tampilan**.

| Tab sheet | Tampil di halaman | Isi |
|---|---|---|
| `profil` | Profil, Legenda, Kontak, header & footer semua halaman | Alamat, telepon, email & jam layanan kantor; luas, ketinggian, suhu; batas wilayah; sejarah; legenda |
| `statistik` | Beranda (angka ringkas), Penduduk | Jumlah penduduk, laki-laki, perempuan, KK, lingkungan; tahun & sumber data |
| `lingkungan` | Penduduk (tabel & grafik), Pemerintahan (kepala lingkungan) | Satu baris per lingkungan |
| `aparat` | Pemerintahan (bagan & profil), Beranda (pimpinan), Kontak | Satu baris per aparat |
| `kontak` | Kontak | Nomor darurat & layanan umum selain aparat |
| `wisata` | Wisata, detail wisata, Beranda, Galeri | Satu baris per destinasi |
| `potensi` | Potensi, Beranda | Satu baris per potensi |
| `umkm` | Potensi (bagian UMKM), Galeri | Satu baris per usaha |
| `layanan` | Layanan | Satu baris per jenis surat |

Tabel yang sama ada di tab `petunjuk` pada spreadsheet.

**Tidak diatur dari spreadsheet** (iterasi ini):

- **Foto** — statis di folder `img/`, dipetakan ke id baris di [`assets/js/komponen.js`](assets/js/komponen.js)
  (bagian `FOTO`). Contoh: `W1: "wisata-danau-linow.webp"` = foto untuk baris W1 di tab `wisata`.
  Id tanpa foto memakai `img/placeholder.webp`; aparat tanpa foto memakai monogram inisial.
- **Peta wilayah (gambar)** — simpan sebagai `img/peta-wilayah.png`. Halaman Profil menampilkannya
  otomatis di atas peta Google; selama file belum ada, bagian itu disembunyikan.
- **Judul dan kalimat pengantar** tiap halaman — di berkas HTML.

## Mengelola spreadsheet

### Tab kunci-nilai (`profil`, `statistik`)

Satu baris = satu informasi. Kolom `kunci` adalah nama tetap yang dicari situs (jangan diubah),
`nilai` isinya, `keterangan` catatan untuk admin (tidak tampil di situs).

### Tab daftar (tab lainnya)

Satu baris = satu data, kolom `id` sebagai pengenal unik.

- **Menambah**: isi baris baru dengan id baru (mis. `W5`).
- **Menyembunyikan**: kosongkan `id`-nya — baris tidak tampil, datanya tetap tersimpan.
- **Mengurutkan**: urutan di situs = urutan baris di sheet (tab `aparat`: kolom `urutan`).
- **Susunan kartu** menyesuaikan jumlah baris sendiri (maks. 4 per baris di desktop: 3 kartu → 3 kolom,
  5 → 3 + 2, 6 → 3 × 2, 8 → 4 × 2). Tidak perlu mengubah kode saat menambah atau menghapus wisata/UMKM.

### Aparat, bagan, dan kontak

- Satu orang cukup ditulis **sekali**, di tab `aparat`.
- Kolom **`atasan`** berisi id aparat di atasnya; bagan di halaman Pemerintahan tersusun dari kolom
  ini. Kosong = puncak bagan. Contoh: Sekretaris `atasan = A1` (Lurah).
- Isi kolom **`nomor`** bila nomor aparat itu boleh tampil di halaman Kontak.
- Tab `kontak` untuk nomor **selain aparat**. Kolom `kategori`: `darurat` (polisi, pemadam
  kebakaran, ambulans) atau `umum` (puskesmas, polsek, dsb.). Kontak tanpa nomor tidak ditampilkan.

### Aturan pengisian

- **Sel kosong = bagian itu disembunyikan** di situs. Situs tidak pernah mengisi data karangan.
- **Beberapa paragraf/butir dalam satu sel**: pisahkan dengan baris baru (Ctrl+Enter atau
  Alt+Enter; Mac: Cmd+Enter). Contoh: rute wisata tampil sebagai daftar langkah.
- **Angka** tanpa pemisah ribuan (`2235`); desimal boleh koma (`7,85`).
- **Semua sel berformat Teks biasa** — jangan diubah. Tanpa itu Google bisa mengubah isian diam-diam
  (angka 0 di depan nomor telepon hilang, atau nilai di tab `profil` terbaca kosong).
- **`id` wisata** jangan diubah: id menjadi alamat halaman detail (`wisata-detail.html?id=W1`)
  sekaligus penentu fotonya.
- **`maps_link`**: tautan Google Maps lengkap berawalan `https://`.
- **Sheet dapat dibaca publik** — jangan simpan NIK, alamat rumah, atau nomor pribadi di tab mana pun.

### Data yang masih contoh

Nilai yang belum ada data resminya ditandai **CONTOH** di kolom `keterangan` dan wajib diganti
sebelum situs diumumkan:

- Tab `profil`: jam layanan, luas, ketinggian, suhu, batas wilayah, sejarah, legenda.
- Tab `layanan`: syarat, alur, waktu, dan biaya setiap surat.
- Masih kosong: telepon & email kantor, nama kepala lingkungan, nomor aparat, UMKM.

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

Situs menampilkan "… belum bisa dimuat". Buka konsol browser (F12 → Console); pesan berawalan
`[data]` menyebut penyebabnya:

| Pesan | Artinya |
|---|---|
| `permintaan gagal` / `yang diterima halaman HTML` | Akses sheet bukan "Siapa saja yang memiliki link", atau tidak ada koneksi |
| `tab "…" tidak ditemukan` | Nama tab diubah atau belum ada, atau kolom pertamanya (`id` / `kunci`) hilang |
| `tidak punya kolom: …` | Nama kolom di baris judul berubah — samakan dengan template |
| `atasan "…" tidak ditemukan` | Kolom atasan di tab `aparat` berisi id yang tidak ada |
| `jabatan "…" sudah ada di tab "aparat"` | Baris ganda di tab `kontak` — pindahkan nomornya ke tab `aparat`, lalu hapus barisnya |
| `server membalas HTTP 404` | ID spreadsheet salah ketik, atau sheet sudah dihapus |

## Struktur kode

```
├── *.html               satu berkas per halaman — hanya markup, tanpa logika
├── assets/css/style.css sistem desain: palet, tipografi, komponen, bagan
├── assets/js/
│   ├── data.js          pengaturan (PAKAI_DUMMY, ID_SPREADSHEET), SKEMA tab, ambilData()
│   ├── data-contoh.js   data awal: isi template spreadsheet & data saat PAKAI_DUMMY = true
│   ├── ui.js            kerangka: header, footer, breadcrumb, info kantor, animasi, status memuat
│   ├── komponen.js      FOTO statis, isiDariData(), aturKolom(), potongan HTML bersama
│   └── halaman/         logika per halaman (index.html → beranda.js)
├── img/                 gambar statis
├── data/                template spreadsheet
└── docs/                Panduan Admin & Panduan Teknis
```

Setiap halaman memuat skrip dengan urutan yang sama:
`data.js` → `data-contoh.js` → `ui.js` → `komponen.js` → `halaman/<nama>.js`.

**Menambah kolom atau tab**: tambahkan di `SKEMA` ([`data.js`](assets/js/data.js)) dan di
[`data-contoh.js`](assets/js/data-contoh.js), lalu buat ulang template. Kolom baru yang belum ada
di sheet terbaca kosong, jadi situs tetap berjalan.

**Menambah blok data** cukup satu panggilan `isiDariData()` — fungsi ini menampilkan "Memuat data…",
mengambil tab, merender, dan menangani kondisi kosong atau gagal (termasuk bila wadahnya `<tbody>`):

```js
isiDariData(document.getElementById("daftar-potensi"), "potensi",
  (data) => data.map(blokPotensi).join(""),
  { kosong: "Data potensi belum tersedia.", gagal: "Data potensi belum bisa dimuat saat ini." }
);
```

**Informasi kantor** di elemen mana pun cukup ditandai `data-profil="kunci"` (mis.
`<span data-profil="jam_layanan">`); `ui.js` mengisinya dari tab `profil` dan menyembunyikan
wadah `[data-wadah-profil]` bila nilainya kosong.

**Grid kartu** yang jumlahnya ditentukan admin memakai `class="grid-adaptif"` (atribut opsional
`data-maks`, `data-hp="2"`); `isiDariData()` memanggil `aturKolom()` otomatis. Jangan tambahkan kelas
kolom Tailwind (`lg:grid-cols-4`) pada wadah itu.

Nilai dari `ambilData()` sudah di-escape, jadi aman disisipkan ke HTML. Untuk konteks non-HTML
(judul tab, label grafik), pakai `teksPolos()`.

Untuk pratinjau lokal, jalankan server sederhana di folder repo, mis. `python3 -m http.server`,
lalu buka `http://localhost:8000`.
