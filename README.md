# web-lahendong

Situs resmi Kelurahan Lahendong, Kecamatan Tomohon Selatan, Kota Tomohon, Sulawesi Utara.
HTML + Tailwind (CDN) + JavaScript biasa — tanpa build step. Desain mengikuti [DESIGN-SPEC.md](DESIGN-SPEC.md).

## Mengelola data dengan Google Sheets

Seluruh isi situs (statistik, lingkungan, wisata, UMKM, aparat, layanan surat, kontak) dibaca dari
satu Google Sheet. Mengubah isi sheet = mengubah isi situs, tanpa menyentuh kode. Perubahan tampil
begitu halaman situs dimuat ulang.

> **Penting:** sheet ini dapat dibaca publik. Jangan menyimpan data pribadi yang tidak untuk
> diumumkan (NIK, alamat rumah, nomor pribadi) di tab mana pun dalam spreadsheet ini.

### Susunan sheet

Delapan tab: `petunjuk` (catatan) dan tujuh tab data. **Jangan ganti nama tab maupun baris judul.**

| Tab | Kolom |
|---|---|
| `statistik` | kunci, nilai |
| `lingkungan` | id, nama, kepala, jumlah_kk, jumlah_jiwa, laki, perempuan |
| `wisata` | id, nama, ringkas, deskripsi, foto, jam, tiket, fasilitas, waktu_terbaik, cara_kesana, maps_link |
| `umkm` | id, nama, produk, kontak, lingkungan, foto |
| `aparat` | id, nama, jabatan, urutan, foto, nomor |
| `layanan` | id, nama_surat, syarat, alur, waktu, biaya |
| `kontak` | id, nama, peran, nomor |

### Aparat dan kontak

**Satu orang cukup ditulis sekali, di tab `aparat`.** Nama dan jabatannya dipakai di halaman
Pemerintahan, beranda (urutan 1 tampil sebagai pimpinan), dan halaman Kontak. Mengganti Lurah
cukup dengan mengubah satu baris.

- Isi kolom `nomor` di tab `aparat` bila nomor orang itu boleh tampil di halaman Kontak.
  Kosongkan bila tidak.
- Tab `kontak` **hanya** untuk narahubung yang bukan aparat: kantor kelurahan, pos kamling,
  puskesmas, dan sebagainya.
- Nama aparat yang belum diketahui: kosongkan selnya. Situs menampilkan "Nama belum tersedia".

Bila tab `kontak` masih memuat baris untuk jabatan yang sudah ada di `aparat` (misalnya
"Lurah Lahendong"), situs tetap memakai nama dari `aparat` dan tidak menampilkannya dua kali.
Konsol browser akan mengingatkan untuk memindahkan nomornya ke tab `aparat` lalu menghapus baris itu.

### Menyambungkan sheet ke situs

1. Di Google Sheets: **Bagikan → Akses umum → Siapa saja yang memiliki link → Pelihat**.
2. Salin ID dari tautan sheet — bagian di antara `/d/` dan `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`11f8D-qzWt…`**`/edit`
3. Tempel ke [`assets/js/data.js`](assets/js/data.js):

   ```js
   const PAKAI_DUMMY = false;
   const ID_SPREADSHEET = "11f8D-qzWt…";
   ```

Situs mencari setiap tab berdasarkan namanya, jadi hanya ID ini yang perlu diisi.

Membuat sheet baru dari nol? Impor [`data/template-data-lahendong.xlsx`](data/template-data-lahendong.xlsx)
lewat **File → Impor → Upload → Ganti spreadsheet**.

### Aturan pengisian

- **Baris tanpa `id`** (tab `statistik`: tanpa `kunci`) tidak ditampilkan. Kosongkan id untuk
  menyembunyikan data sementara tanpa menghapusnya.
- **Satu kolom, satu jenis isi.** Kolom angka jangan diisi teks seperti `-` atau `belum ada` —
  kosongkan saja. Google menentukan jenis kolom dari mayoritas isinya, dan sel yang berbeda jenis
  terbaca kosong.
- **Angka** ditulis tanpa pemisah ribuan: `3241`, bukan `3.241`. Desimal boleh pakai koma: `7,85`.
- **Nomor telepon** ditulis dengan tanda hubung (`0812-3456-7801`) agar angka 0 di depan tidak hilang.
- **`foto`**: nama file di folder `img/` (mis. `danau-linow.webp`) atau URL gambar lengkap
  berawalan `https://`. Kosong = gambar pengganti.
- **`maps_link`**: tautan Google Maps lengkap berawalan `https://`; tautan lain diabaikan.
- **`id` wisata** menjadi alamat halaman detail (`wisata-detail.html?id=W1`) — jangan diubah setelah
  tautannya dibagikan.

### Jika data tidak muncul

Situs akan menampilkan "Data … belum bisa dimuat". Buka konsol browser (F12 → Console); pesan
berawalan `[data]` menyebut penyebabnya:

| Pesan | Artinya |
|---|---|
| `permintaan gagal` / `yang diterima halaman HTML` | Akses sheet bukan "Siapa saja yang memiliki link", atau tidak ada koneksi |
| `tab "…" tidak ditemukan` | Nama tab diubah, atau kolom pertamanya (`id` / `kunci`) hilang |
| `tidak punya kolom: …` | Nama kolom di baris judul berubah — samakan dengan tabel di atas |
| `server membalas HTTP 404` | ID spreadsheet salah ketik, atau sheet sudah dihapus |
| `jabatan "…" sudah ada di tab "aparat"` | Baris ganda di tab `kontak` — pindahkan nomornya ke tab `aparat`, lalu hapus barisnya |

Untuk kembali memakai data contoh, ubah `PAKAI_DUMMY` menjadi `true`.

## Struktur kode

```
├── *.html               satu berkas per halaman — hanya markup, tanpa logika
├── assets/css/style.css sistem desain: palet, tipografi, komponen
├── assets/js/
│   ├── data.js          pengaturan (PAKAI_DUMMY, ID_SPREADSHEET) + ambilData()
│   ├── data-contoh.js   data contoh untuk PAKAI_DUMMY = true
│   ├── ui.js            kerangka situs: header, footer, breadcrumb, animasi, status memuat
│   ├── komponen.js      potongan yang dipakai lebih dari satu halaman + isiDariData()
│   └── halaman/         logika per halaman (index.html → beranda.js)
├── img/                 gambar (placeholder.webp dipakai bila foto kosong/gagal dimuat)
└── data/                template spreadsheet
```

Setiap halaman memuat skrip dengan urutan yang sama:
`data.js` → `data-contoh.js` → `ui.js` → `komponen.js` → `halaman/<nama>.js`.

**Menambah blok data baru** cukup satu panggilan `isiDariData()`. Fungsi ini menampilkan
"Memuat data…", mengambil tab, merender, lalu menangani kondisi kosong atau gagal, termasuk bila
wadahnya `<tbody>`:

```js
isiDariData(document.getElementById("grid-umkm"), "umkm",
  (data) => data.map(kartuUmkm).join(""),
  { kosong: "Belum ada data UMKM.", gagal: "Data UMKM belum bisa dimuat saat ini." }
);
```

Nilai dari `ambilData()` sudah di-escape, jadi aman disisipkan ke HTML. Untuk konteks non-HTML
(judul tab, label grafik), pakai `teksPolos()`.

**Kelas CSS bersama:** `.wadah` (lebar konten + tepi layar), `.seksi` (jarak antarseksi),
`.label-kecil` (label huruf besar kecil), `.kartu`, `.tabel`, `.angka`, `.eyebrow`, `.judul-*`.
Untuk pratinjau lokal, jalankan server sederhana di folder repo, mis. `python3 -m http.server`,
lalu buka `http://localhost:8000`.
