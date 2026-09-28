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
| `aparat` | id, nama, jabatan, urutan, foto |
| `layanan` | id, nama_surat, syarat, alur, waktu, biaya |
| `kontak` | id, nama, peran, nomor |

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

Untuk kembali memakai data contoh, ubah `PAKAI_DUMMY` menjadi `true`.
