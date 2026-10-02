/* ==========================================================================
   Data awal — dipakai saat PAKAI_DUMMY = true (lihat data.js), dan menjadi
   isi template spreadsheet (data/template-data-lahendong.xlsx).

   Sumber data asli: Statistik Kelurahan Lahendong 2026, daftar wisata, dan
   susunan aparat dari kelurahan. Nilai yang belum ada data resminya ditandai
   "CONTOH" di kolom keterangan dan wajib diganti.
   Baris baru dalam satu sel ("\n") ditampilkan sebagai paragraf/daftar.
   ========================================================================== */

const DATA_DUMMY = {
  profil: [
    { kunci: "alamat_kantor", nilai: "Kelurahan Lahendong, Kecamatan Tomohon Selatan, Kota Tomohon, Sulawesi Utara", keterangan: "Footer dan halaman Kontak." },
    { kunci: "telepon_kantor", nilai: "", keterangan: "Header, footer, dan halaman Kontak. Kosong = tidak ditampilkan." },
    { kunci: "email", nilai: "", keterangan: "Halaman Kontak. Kosong = tidak ditampilkan." },
    { kunci: "jam_layanan", nilai: "Senin – Jumat, 08.00 – 15.00 WITA", keterangan: "CONTOH — ganti. Header, footer, halaman Kontak dan Layanan." },
    { kunci: "luas_wilayah", nilai: "7,85", keterangan: "CONTOH — ganti. Angka saja, satuan km². Beranda dan Profil." },
    { kunci: "ketinggian", nilai: "800–950", keterangan: "CONTOH — ganti. Satuan mdpl. Profil." },
    { kunci: "suhu", nilai: "22–26", keterangan: "CONTOH — ganti. Satuan °C. Profil." },
    { kunci: "batas_utara", nilai: "Kelurahan Kampung Jawa", keterangan: "Profil, tabel batas wilayah." },
    { kunci: "batas_selatan", nilai: "Kabupaten Minahasa", keterangan: "Profil, tabel batas wilayah." },
    { kunci: "batas_timur", nilai: "Kecamatan Pangolombian", keterangan: "Profil, tabel batas wilayah." },
    { kunci: "batas_barat", nilai: "Kelurahan Pinaras", keterangan: "Profil, tabel batas wilayah." },
    {
      kunci: "sejarah",
      nilai:
        "Lahendong tumbuh dari perkampungan kecil di sekitar sumber panas bumi alami di kaki pegunungan Tomohon.\n" +
        "Nama \"Lahendong\" dipercaya masyarakat setempat berkaitan dengan uap panas bumi yang kerap muncul di kawasan ini sejak lama.\n" +
        "Seiring waktu, wilayah ini berkembang menjadi salah satu kelurahan definitif di Kecamatan Tomohon Selatan, dengan warga yang bertumpu pada pertanian, usaha rumahan, serta pariwisata di sekitar Danau Linow dan kawasan panas bumi.",
      keterangan: "CONTOH — ganti. Profil. Satu baris dalam sel = satu paragraf; paragraf pertama ditampilkan lebih besar.",
    },
    {
      kunci: "legenda",
      nilai:
        "Warga percaya kawasan Danau Linow adalah tempat bersemayamnya roh penjaga alam, dan uap belerang yang terus mengepul adalah napasnya.\n" +
        "Cerita turun-temurun menyebutkan bahwa warna air danau yang berubah-ubah adalah pertanda suasana hati sang penjaga. Saat air berwarna cerah, warga meyakini alam sedang tenang dan hasil panen akan melimpah.\n" +
        "Secara ilmiah, perubahan warna air danau dipengaruhi kandungan mineral dan aktivitas vulkanik di dasar danau. Namun kisah rakyat ini tetap diwariskan sebagai bagian dari kekayaan budaya setempat.",
      keterangan: "CONTOH — ganti dengan cerita yang dituturkan warga. Halaman Legenda. Satu baris dalam sel = satu paragraf.",
    },
    { kunci: "tahun_data", nilai: "2026", keterangan: "Tahun data kependudukan (tab lingkungan). Halaman Penduduk." },
    { kunci: "sumber_data", nilai: "Kelurahan Lahendong", keterangan: "Sumber data kependudukan. Halaman Penduduk." },
    { kunci: "foto_hero", nilai: "", keterangan: "Opsional. Tautan Google Drive foto lanskap untuk gambar besar di Beranda. Kosong = ilustrasi bawaan." },
  ],

  // Sumber: Kelurahan Lahendong, 2026. Nama kepala lingkungan belum tersedia.
  // Jumlah jiwa (laki + perempuan) dan semua total dihitung situs dari tab ini.
  lingkungan: [
    { nama: "Lingkungan 1", kepala: "", jumlah_kk: "124", laki: "169", perempuan: "176", jumlah_lansia: "37", jumlah_rumah: "106" },
    { nama: "Lingkungan 2", kepala: "", jumlah_kk: "116", laki: "172", perempuan: "156", jumlah_lansia: "45", jumlah_rumah: "80" },
    { nama: "Lingkungan 3", kepala: "", jumlah_kk: "80", laki: "114", perempuan: "107", jumlah_lansia: "33", jumlah_rumah: "64" },
    { nama: "Lingkungan 4", kepala: "", jumlah_kk: "67", laki: "111", perempuan: "99", jumlah_lansia: "29", jumlah_rumah: "51" },
    { nama: "Lingkungan 5", kepala: "", jumlah_kk: "113", laki: "157", perempuan: "173", jumlah_lansia: "54", jumlah_rumah: "71" },
    { nama: "Lingkungan 6", kepala: "", jumlah_kk: "96", laki: "139", perempuan: "132", jumlah_lansia: "40", jumlah_rumah: "65" },
    { nama: "Lingkungan 7", kepala: "", jumlah_kk: "69", laki: "109", perempuan: "113", jumlah_lansia: "32", jumlah_rumah: "59" },
    { nama: "Lingkungan 8", kepala: "", jumlah_kk: "97", laki: "152", perempuan: "156", jumlah_lansia: "42", jumlah_rumah: "75" },
  ],

  // Struktur belum final. "atasan" = jabatan atasannya; kosong = pimpinan. Urutan = urutan baris.
  aparat: [
    { jabatan: "Lurah", nama: "Reymon Stive Londok, S.T", atasan: "", nomor: "", foto: "" },
    { jabatan: "Sekretaris Kelurahan", nama: "Cicilia M. Karamoy, S.ST, M.Kes", atasan: "Lurah", nomor: "", foto: "" },
    { jabatan: "Kepala Seksi Pemerintahan", nama: "Marthen J. Mende, ST", atasan: "Lurah", nomor: "", foto: "" },
  ],

  // Nomor darurat nasional. Tambahkan narahubung umum (puskesmas, polsek, dsb.) dengan kategori "umum".
  kontak: [
    { nama: "Polisi", tampil: "Ya", peran: "Kepolisian", nomor: "110", kategori: "darurat" },
    { nama: "Pemadam Kebakaran", tampil: "Ya", peran: "Kebakaran dan penyelamatan", nomor: "113", kategori: "darurat" },
    { nama: "Ambulans", tampil: "Ya", peran: "Gawat darurat medis", nomor: "2005", kategori: "darurat" },
  ],

  wisata: [
    {
      nama: "Danau Linow",
      tampil: "Ya",
      foto: "",
      ringkas: "Danau vulkanik dengan warna air yang dapat berubah — hijau, biru, hingga kekuningan.",
      deskripsi:
        "Danau Linow Lahendong merupakan danau vulkanik yang berada di wilayah Lahendong, Kota Tomohon, Sulawesi Utara. Danau ini terbentuk dari aktivitas vulkanik dan memiliki kandungan belerang serta aktivitas panas bumi di kawasan sekitarnya. Lingkungan danau dikelilingi vegetasi hijau dan perbukitan, sehingga memiliki kondisi alam yang sejuk dan asri. Selain sebagai kawasan wisata, Danau Linow juga memiliki nilai ekologis dan geologis yang berkaitan dengan karakteristik kawasan vulkanik Lahendong.\n" +
        "Keunikan utamanya adalah warna air yang dapat berubah-ubah, seperti hijau, biru, dan kekuningan. Keunikan warna air serta suasana alamnya yang asri dan sejuk menjadi daya tarik utama bagi wisatawan.",
      jam: "Setiap hari, 10.00 – 20.00 WITA\nGerbang masuk ditutup sekitar pukul 19.00 WITA",
      tiket: "Rp40.000 per orang",
      fasilitas: "Kafe dan restoran, resort dan penginapan, area perkemahan (camping ground), area parkir, toilet, tempat ibadah, spot foto",
      waktu_terbaik: "Pagi hari atau sore menjelang matahari terbenam, untuk melihat perubahan warna air danau",
      cara_kesana:
        "Dari pusat Kota Manado, menuju Pineleng melalui Jl. Sam Ratulangi atau Jl. Winangun, lalu masuk ke jalur utama Jl. Raya Manado – Tomohon.\n" +
        "Ikuti jalan menanjak melewati Tinoor hingga memasuki Kota Tomohon, lalu tetap lurus melewati pusat kota dan kawasan Pasar Beriman Tomohon.\n" +
        "Lanjutkan ke arah selatan menuju Kelurahan Lahendong melalui Jl. Kawangkoan – Tomohon.\n" +
        "Setelah melewati area pemandian air panas Lahendong, ikuti papan petunjuk di sebelah kanan menuju Danau Linow Resort hingga tiba di gerbang utama.",
      pengelola: "PT Karyadeka Alam Asri\nDirektur Utama: Pengky Wewengkang\nDirektur Operasional: James Pengky Wewengkang\nManajer Resort: Andreas Dengen",
      maps_link: "https://maps.google.com/?q=Danau+Linow+Tomohon",
    },
    {
      nama: "Hutan Pinus Lahendong",
      tampil: "Ya",
      foto: "",
      ringkas: "Hutan pinus sejuk yang berpadu dengan kolam sulfur beruap dan pemandian air panas alami.",
      deskripsi:
        "Hutan Pinus Lahendong adalah destinasi wisata alam unik di Tomohon yang memadukan keindahan hutan pinus hijau nan rimbun dengan fenomena geotermal berupa kolam sulfur beruap putih dan pemandian air panas alami yang kaya khasiat bagi kulit. Perpaduan uap panas bumi yang mengepul di antara deretan pepohonan pinus yang menjulang tinggi menciptakan suasana yang sejuk dan menenangkan, menjadikannya tempat ideal untuk menyegarkan pikiran, berburu spot foto, serta bersantai menikmati kedamaian alam Tomohon jauh dari hiruk-pikuk perkotaan.",
      jam: "13.00 – 18.00 WITA",
      tiket: "Rp35.000 per orang, umumnya sudah termasuk kuliner ringan (kopi, teh, pisang goreng, atau jagung rebus)\nKolam air panas: sekitar Rp5.000 – Rp10.000",
      fasilitas: "Area parkir, toilet, warung dan rumah makan sederhana, spot foto, jalur penjelajahan ringan (hiking), bilik rendam air panas",
      waktu_terbaik:
        "Pagi hari (09.00 – 11.00 WITA): uap dari kolam sulfur mengepul tebal berpadu udara pagi yang masih dingin; cocok untuk berjalan santai tanpa terik matahari.\n" +
        "Sore hari (15.00 – 17.00 WITA): cahaya matahari melembut (golden hour) untuk berfoto, lalu ditutup dengan berendam air panas belerang menjelang malam.",
      cara_kesana:
        "Berjarak sekitar 5,3 km dari pusat Kota Tomohon, kurang lebih 13–15 menit perjalanan.\n" +
        "Dari pusat kota (sekitar Menara Alfa Omega atau Pasar Beriman), arahkan kendaraan ke selatan menuju jalur utama arah Kawangkoan/Sonder melalui Jalan Raya Tomohon.\n" +
        "Lewati wilayah Walian. Setelah memasuki Kelurahan Lahendong, berbelok ke kanan masuk ke Jalan Lahendong; gerbang masuk mudah terlihat dari tepi jalan.",
      pengelola:
        "Pengelolaan bersama antara Pemerintah Kota Tomohon dan pihak swasta/masyarakat lokal.\n" +
        "Dinas Pariwisata Kota Tomohon: regulasi kepariwisataan, promosi daerah, pemantauan dampak lingkungan kawasan resapan air, dan koordinasi investasi ekowisata.\n" +
        "Pengelola lokal: operasional harian, pemeliharaan fasilitas (kafe, pemandian air panas, spot foto), dan penyediaan lapangan kerja bagi warga Lahendong.",
      maps_link: "https://maps.google.com/?q=Hutan+Pinus+Lahendong",
    },
    {
      nama: "Mah’Watu",
      tampil: "Ya",
      foto: "",
      ringkas: "Wisata alam asri dengan kafe terbuka, gazebo, dan aliran air belerang berwarna hijau toska.",
      deskripsi:
        "Mah’Watu merupakan salah satu destinasi wisata alam yang berada di Kota Tomohon, Sulawesi Utara. Tempat wisata ini menawarkan suasana yang asri dan sejuk dengan pemandangan alam yang indah, sehingga cocok dijadikan tempat untuk bersantai dan melepas penat. Keindahan lingkungan sekitar yang masih alami menjadi daya tarik tersendiri bagi pengunjung. Selain menikmati pemandangan, wisatawan juga dapat menghabiskan waktu bersama keluarga maupun teman sambil menikmati suasana yang tenang dan udara yang segar.",
      jam: "Senin – Sabtu, 10.00 – 18.00 WITA\nMinggu, 12.00 – 18.00 WITA",
      tiket: "Rp20.000 – Rp25.000",
      fasilitas: "Kafe outdoor, gazebo, ruang terbuka hijau, spot foto, toilet",
      waktu_terbaik:
        "Sore hari (15.00 – 17.30 WITA): paling direkomendasikan — matahari sudah tidak terik dan bertepatan dengan golden hour.\n" +
        "Pagi ke siang hari (10.00 – 13.00 WITA): waktu terbaik memotret air belerang; sinar matahari membuat warna hijau toska sungai belerang tampak kontras dan hidup.",
      cara_kesana: "",
      pengelola: "",
      maps_link: "https://maps.google.com/?q=Mahwatu+Tomohon",
    },
  ],

  // Belum ada data UMKM resmi.
  umkm: [],

  // Foto tambahan untuk Galeri (kegiatan, alam, budaya). Belum ada.
  galeri: [],

  // CONTOH — syarat, alur, waktu, dan biaya perlu dicocokkan dengan ketentuan kantor kelurahan.
  // Satu syarat / satu langkah per baris di dalam sel. Tambah atau hapus baris surat sesuka hati.
  layanan: [
    {
      nama_surat: "Surat Keterangan Domisili",
      tampil: "Ya",
      kategori: "Kependudukan",
      syarat: "Fotokopi KTP\nFotokopi Kartu Keluarga\nSurat pengantar RT/lingkungan",
      alur: "Bawa berkas ke kantor kelurahan\nPetugas memeriksa berkas\nSurat ditandatangani lurah\nSurat diambil pemohon",
      waktu: "1 hari kerja",
      biaya: "Gratis",
      catatan: "",
    },
    {
      nama_surat: "Surat Keterangan Tidak Mampu (SKTM)",
      tampil: "Ya",
      kategori: "Sosial",
      syarat: "Fotokopi KTP\nFotokopi Kartu Keluarga\nSurat pengantar RT/lingkungan\nKeterangan penghasilan",
      alur: "Bawa berkas ke kantor kelurahan\nPetugas memeriksa berkas dan, bila perlu, melakukan survei singkat\nSurat ditandatangani lurah",
      waktu: "1–2 hari kerja",
      biaya: "Gratis",
      catatan: "Sebutkan keperluan SKTM (sekolah, kesehatan, atau bantuan sosial) saat mengajukan.",
    },
    {
      nama_surat: "Surat Pengantar Nikah",
      tampil: "Ya",
      kategori: "Kependudukan",
      syarat: "Fotokopi KTP kedua calon mempelai\nFotokopi Kartu Keluarga\nSurat pengantar RT/lingkungan\nPas foto",
      alur: "Bawa berkas ke kantor kelurahan\nPetugas memeriksa data\nSurat diteruskan ke KUA atau Dinas Kependudukan",
      waktu: "1 hari kerja",
      biaya: "Gratis",
      catatan: "",
    },
    {
      nama_surat: "Surat Keterangan Usaha",
      tampil: "Ya",
      kategori: "Usaha",
      syarat: "Fotokopi KTP\nFotokopi Kartu Keluarga\nFoto lokasi usaha\nSurat pengantar RT/lingkungan",
      alur: "Bawa berkas ke kantor kelurahan\nPetugas memeriksa lokasi usaha\nSurat ditandatangani lurah",
      waktu: "1–3 hari kerja",
      biaya: "Gratis",
      catatan: "",
    },
    {
      nama_surat: "Surat Keterangan Kelahiran",
      tampil: "Ya",
      kategori: "Kependudukan",
      syarat: "Fotokopi KTP kedua orang tua\nFotokopi Kartu Keluarga\nSurat keterangan lahir dari bidan atau rumah sakit",
      alur: "Bawa berkas ke kantor kelurahan\nPetugas memeriksa berkas\nSurat ditandatangani lurah",
      waktu: "1 hari kerja",
      biaya: "Gratis",
      catatan: "",
    },
  ],
};
