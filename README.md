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
| `profil` | Profil, Kontak, Layanan, Penduduk, Beranda, header & footer | Alamat, telepon, email & jam layanan; luas, ketinggian, suhu; batas wilayah; sejarah; tahun & sumber data; foto hero |
| `lingkungan` | Penduduk, Beranda (angka ringkas), Pemerintahan (kartu lingkungan) | Satu baris per lingkungan — **semua total dihitung dari sini** |
| `aparat` | Pemerintahan (struktur), Beranda (pimpinan), Kontak | Satu baris per aparat |
| `kontak` | Kontak | Nomor darurat & layanan umum selain aparat |
| `wisata` | Wisata, detail wisata, Beranda, Galeri | Satu baris per destinasi |
| `layanan` | Layanan, Beranda (daftar surat) | Satu baris per jenis surat |
| `galeri` | Galeri | Opsional: judul & kategori foto lewat sheet |
| `foto` | Semua halaman berfoto | **Diisi otomatis** dari folder foto Drive — jangan diedit |

Tabel yang sama, beserta arti setiap kolom, ada di tab `petunjuk` pada spreadsheet.

**Tidak diatur dari spreadsheet:** judul dan kalimat pengantar tiap halaman (berkas HTML),
ilustrasi bawaan (`img/`), peta wilayah (`img/peta-wilayah.png` — tampil otomatis bila ada), dan
halaman **KKT Unsrat Angkatan 149** (`kkt.html`, ditautkan dari baris bawah footer, tidak ada di menu):
datanya ditulis di `DATA_KKT` pada awal [`assets/js/halaman/kkt.js`](assets/js/halaman/kkt.js) —
nama, NIM, fakultas, peran (opsional), foto (nama berkas di `img/` atau tautan Drive, opsional),
serta dosen lapangan (pembimbing & pengawas), periode, dan paragraf "tentang".

## Mengelola spreadsheet

Spreadsheet dirancang agar sulit salah isi:

- **Tidak ada kode/id yang perlu dikarang.** Setiap baris dikenali dari kolom pertamanya
  (nama, jabatan, judul) — kolom yang judulnya berwarna hijau tua. Situs membuat kodenya sendiri:
  "Danau Linow" → `wisata-detail.html?id=danau-linow`.
- **Tidak ada angka yang ditulis dua kali.** Jumlah penduduk, KK, laki-laki/perempuan, jumlah jiwa per
  lingkungan, dan jumlah lingkungan dihitung dari tab `lingkungan`.
- **Dropdown** untuk isian pilihan: `tampil`, `kategori`, dan `atasan` (aparat, diambil dari kolom jabatan).
- **Catatan di judul kolom**: arahkan kursor ke judul kolom untuk melihat arti dan contohnya.
- **Halaman [Cek Data](https://vercoooo.github.io/web-lahendong/cek-data.html)** memeriksa seluruh sheet
  dan menunjukkan setiap isian yang keliru: kolom salah ketik, atasan tidak ditemukan, angka tidak valid,
  foto Drive yang belum dibagikan, nama kembar, sampai deret angka yang mirip NIK. Buka setelah mengedit.

### Pekerjaan sehari-hari

- **Menambah**: isi baris kosong pertama di bawah data.
- **Menghapus**: klik kanan nomor baris → **Hapus baris**.
- **Menyembunyikan sementara**: kolom **`tampil`** = `Tidak` (tab wisata, layanan, kontak, galeri).
- **Mengurutkan**: urutan di situs = urutan baris di sheet. Pindahkan barisnya.
- **Susunan kartu** menyesuaikan jumlah baris sendiri (maks. 4 per baris di desktop).

### Foto dari Google Drive

**Cara utama: cukup kelola satu folder Google Drive.** Situs mengenali foto dari nama berkas dan
subfoldernya — tidak perlu menyalin tautan ke spreadsheet.

| Subfolder | Nama berkas | Dipakai untuk |
|---|---|---|
| `beranda/` | `hero.jpg` | Gambar besar Beranda |
| `wisata/` | nama destinasi, mis. `Danau Linow.jpg` | Kartu & halaman detail wisata, Galeri |
| `aparat/` | jabatan atau nama tanpa gelar, mis. `Lurah.jpg` | Struktur aparat, pimpinan di Beranda |
| `lingkungan/` | nama kepala/wakil, mis. `Julius Joni Rondonuwu.jpg` | Kartu lingkungan |
| `kkt/` | NIM atau nama, mis. `230211060074.jpg` | Halaman KKT |
| `galeri/<kategori>/` | judul foto, mis. `galeri/Kegiatan/Panen Raya.jpg` | Galeri — setiap foto otomatis tampil |

Huruf besar/kecil, spasi vs tanda hubung, dan ekstensi (`.jpg` `.png` `.webp`) tidak berpengaruh.
Mengganti foto: hapus berkas lama, unggah yang baru dengan nama sama (bila ada dua, yang terbaru dipakai).

**Cara kerjanya.** Skrip [`tools/sinkron-foto.gs`](tools/sinkron-foto.gs) (Apps Script di spreadsheet)
mencatat isi folder ke tab `foto` setiap 10 menit dan memastikan setiap foto dibagikan "Siapa saja yang
memiliki link". Situs membaca tab itu seperti tab lain — tanpa kunci API. Cek Data menandai nama
berkas yang tidak cocok dengan data mana pun, beserta saran nama yang benar.

**Memasang (sekali, oleh pemilik spreadsheet):** Ekstensi → Apps Script → tempel isi
`tools/sinkron-foto.gs` → Simpan → jalankan fungsi `pasang` → setujui izin. Skrip membuat folder
"Foto Situs Lahendong" beserta subfoldernya dan menu **Situs** (Sinkronkan foto sekarang, Buka folder foto).
Setelah mengimpor ulang template (Ganti spreadsheet), tab `foto` ikut hilang — jalankan
**Situs → Sinkronkan foto sekarang** untuk mengisinya lagi.

**Urutan sumber foto** untuk setiap baris: kolom `foto` di tab itu (tautan satu foto, untuk menimpa) →
foto dari folder Drive → foto cadangan di `img/` (`FOTO` di [`komponen.js`](assets/js/komponen.js)) →
gambar pengganti/monogram. Bila satu sumber gagal dimuat, sumber berikutnya dicoba otomatis.
`foto_hero` / `beranda/hero.jpg` mengganti ilustrasi Beranda dan otomatis memberi lapisan gelap agar judul terbaca.
Foto orang sebaiknya 3:4 (pas foto), foto tempat 3:2; foto orang hanya dengan izin yang bersangkutan.

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

- Tab `profil`: jam layanan, luas, ketinggian, suhu, sejarah.
- Tab `layanan`: syarat, alur, waktu, biaya, dan catatan setiap surat.
- Masih kosong: telepon & email kantor, kepala & wakil kepala Lingkungan 7, nomor aparat, galeri.

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
├── *.html               satu berkas per halaman — hanya markup, tanpa logika
├── assets/css/style.css sistem desain: palet, tipografi, komponen, struktur
├── assets/js/
│   ├── data.js          pengaturan (PAKAI_DUMMY, ID_SPREADSHEET), SKEMA tab, ambilData()
│   ├── data-contoh.js   data awal: isi template spreadsheet & data saat PAKAI_DUMMY = true
│   ├── ui.js            kerangka: header, footer, breadcrumb, info kantor, animasi, status memuat
│   ├── komponen.js      FOTO statis, isiDariData(), aturKolom(), potongan HTML bersama
│   └── halaman/         logika per halaman (index.html → beranda.js; cek-data.js = pemeriksa sheet)
├── img/                 gambar statis
├── data/                template spreadsheet
├── tools/               buat_template.py (template xlsx), versi_aset.py (penanda versi CSS/JS),
│                        sinkron-foto.gs (Apps Script: folder foto Drive → tab foto)
└── docs/                Panduan Admin & Panduan Teknis
```

Setiap halaman memuat skrip dengan urutan yang sama:
`data.js` → `data-contoh.js` → `ui.js` → `komponen.js` → `halaman/<nama>.js`.

**Menambah kolom atau tab**: tambahkan di `SKEMA` ([`data.js`](assets/js/data.js)) dan di
[`data-contoh.js`](assets/js/data-contoh.js), lalu buat ulang template dengan
`python3 tools/buat_template.py` (butuh LibreOffice). Kolom baru yang belum ada
di sheet terbaca kosong, jadi situs tetap berjalan.

**Menambah blok data** cukup satu panggilan `isiDariData()` — fungsi ini menampilkan "Memuat data…",
mengambil tab, merender, dan menangani kondisi kosong atau gagal (termasuk bila wadahnya `<tbody>`):

```js
isiDariData(document.getElementById("grid-wisata"), "wisata",
  (data) => data.map((item) => kartuWisata(item)).join(""),
  { kosong: "Belum ada destinasi wisata.", gagal: "Daftar destinasi belum bisa dimuat saat ini." }
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

**Sebelum commit perubahan CSS/JS**, jalankan `python3 tools/versi_aset.py`. Skrip ini menambah
penanda versi (`data.js?v=0cfb573f`) di semua HTML, sehingga browser pengunjung langsung mengambil
berkas baru alih-alih memakai salinan lama selama 10 menit (cache GitHub Pages).

Untuk pratinjau lokal, jalankan server sederhana di folder repo, mis. `python3 -m http.server`,
lalu buka `http://localhost:8000`.
