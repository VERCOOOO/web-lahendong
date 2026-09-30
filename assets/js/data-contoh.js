/* ==========================================================================
   Data awal — dipakai saat PAKAI_DUMMY = true (lihat data.js), dan menjadi
   isi template spreadsheet (data/template-data-lahendong.xlsx).

   Sumber data asli: Statistik Kelurahan Lahendong 2026, Potensi Kelurahan Lahendong,
   daftar wisata, dan susunan aparat dari kelurahan. Nilai yang belum ada
   data resminya ditandai "CONTOH" di kolom keterangan dan wajib diganti.
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
    { kunci: "batas_utara", nilai: "Kelurahan Kakaskasen", keterangan: "CONTOH — ganti. Profil, tabel batas wilayah." },
    { kunci: "batas_selatan", nilai: "Kelurahan Kumelembuai", keterangan: "CONTOH — ganti." },
    { kunci: "batas_timur", nilai: "Kecamatan Tondano Selatan", keterangan: "CONTOH — ganti." },
    { kunci: "batas_barat", nilai: "Kelurahan Walian", keterangan: "CONTOH — ganti." },
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
  ],

  statistik: [
    { kunci: "tahun_data", nilai: "2026", keterangan: "Tahun data kependudukan. Halaman Penduduk." },
    { kunci: "sumber_data", nilai: "Kelurahan Lahendong", keterangan: "Sumber data kependudukan. Halaman Penduduk." },
    { kunci: "jumlah_penduduk", nilai: "2235", keterangan: "Sumber: Kelurahan Lahendong, 2026. Beranda dan Penduduk." },
    { kunci: "laki", nilai: "1123", keterangan: "Penduduk laki-laki. Halaman Penduduk." },
    { kunci: "perempuan", nilai: "1112", keterangan: "Penduduk perempuan. Halaman Penduduk." },
    { kunci: "jumlah_kk", nilai: "762", keterangan: "Kepala keluarga. Beranda dan Penduduk." },
    { kunci: "jumlah_lingkungan", nilai: "8", keterangan: "Beranda dan Profil." },
  ],

  // Sumber: Kelurahan Lahendong, 2026. Nama kepala lingkungan belum tersedia.
  // Jumlah jiwa tiap baris = laki + perempuan; total 8 lingkungan = jumlah_penduduk di tab statistik.
  lingkungan: [
    { id: "L1", nama: "Lingkungan 1", kepala: "", jumlah_kk: "124", jumlah_jiwa: "345", laki: "169", perempuan: "176", jumlah_lansia: "37", jumlah_rumah: "106" },
    { id: "L2", nama: "Lingkungan 2", kepala: "", jumlah_kk: "116", jumlah_jiwa: "328", laki: "172", perempuan: "156", jumlah_lansia: "45", jumlah_rumah: "80" },
    { id: "L3", nama: "Lingkungan 3", kepala: "", jumlah_kk: "80", jumlah_jiwa: "221", laki: "114", perempuan: "107", jumlah_lansia: "33", jumlah_rumah: "64" },
    { id: "L4", nama: "Lingkungan 4", kepala: "", jumlah_kk: "67", jumlah_jiwa: "210", laki: "111", perempuan: "99", jumlah_lansia: "29", jumlah_rumah: "51" },
    { id: "L5", nama: "Lingkungan 5", kepala: "", jumlah_kk: "113", jumlah_jiwa: "330", laki: "157", perempuan: "173", jumlah_lansia: "54", jumlah_rumah: "71" },
    { id: "L6", nama: "Lingkungan 6", kepala: "", jumlah_kk: "96", jumlah_jiwa: "271", laki: "139", perempuan: "132", jumlah_lansia: "40", jumlah_rumah: "65" },
    { id: "L7", nama: "Lingkungan 7", kepala: "", jumlah_kk: "69", jumlah_jiwa: "222", laki: "109", perempuan: "113", jumlah_lansia: "32", jumlah_rumah: "59" },
    { id: "L8", nama: "Lingkungan 8", kepala: "", jumlah_kk: "97", jumlah_jiwa: "308", laki: "152", perempuan: "156", jumlah_lansia: "42", jumlah_rumah: "75" },
  ],

  // Struktur belum final. "atasan" = id aparat di atasnya pada bagan.
  aparat: [
    { id: "A1", nama: "Reymon Stive Londok, S.T", jabatan: "Lurah", urutan: "1", atasan: "", nomor: "" },
    { id: "A2", nama: "Cicilia M. Karamoy, S.ST, M.Kes", jabatan: "Sekretaris Kelurahan", urutan: "2", atasan: "A1", nomor: "" },
    { id: "A3", nama: "Marthen J. Mende, ST", jabatan: "Kepala Seksi Pemerintahan", urutan: "3", atasan: "A1", nomor: "" },
  ],

  // Nomor darurat nasional. Tambahkan narahubung umum (puskesmas, polsek, dsb.) dengan kategori "umum".
  kontak: [
    { id: "K1", nama: "Polisi", peran: "Kepolisian", nomor: "110", kategori: "darurat" },
    { id: "K2", nama: "Pemadam Kebakaran", peran: "Kebakaran dan penyelamatan", nomor: "113", kategori: "darurat" },
    { id: "K3", nama: "Ambulans", peran: "Gawat darurat medis", nomor: "119", kategori: "darurat" },
  ],

  wisata: [
    {
      id: "W1",
      nama: "Danau Linow",
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
      id: "W2",
      nama: "Hutan Pinus Lahendong",
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
      id: "W3",
      nama: "Mah’Watu",
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
    {
      id: "W4",
      nama: "Toulangkow Hills",
      ringkas: "Puncak berpanorama Gunung Lokon dan Danau Linow, favorit untuk berkemah dan berburu matahari terbenam.",
      deskripsi:
        "Puncak Toulangkow merupakan salah satu destinasi wisata alam yang berada di Kota Tomohon, Sulawesi Utara. Tempat ini menawarkan keindahan panorama alam yang dapat dinikmati dari ketinggian, dengan udara yang sejuk dan suasana yang tenang. Dari kawasan puncak, pengunjung dapat menikmati pemandangan alam sekitar yang indah, sehingga tempat ini cocok untuk bersantai, berfoto, maupun menghabiskan waktu bersama keluarga dan teman.",
      jam: "Setiap hari, 08.30 – 18.00 WITA",
      tiket: "Rp10.000 per pengunjung\nRp50.000 per tenda (camping)",
      fasilitas: "Camping ground, spot foto",
      waktu_terbaik:
        "Pagi hari (08.30 – 10.00 WITA): pas untuk memotret panorama Gunung Lokon dan Danau Linow dengan cahaya pagi yang cerah.\n" +
        "Sore hari (16.00 – 18.00 WITA): paling populer bagi pemburu matahari terbenam.",
      cara_kesana: "",
      pengelola: "",
      maps_link: "https://maps.google.com/?q=Toulangkow+Hills+Tomohon",
    },
  ],

  // Sumber: dokumen Potensi Kelurahan Lahendong.
  potensi: [
    {
      id: "P1",
      judul: "Wisata Alam Hutan Pinus",
      deskripsi: "Salah satu potensi utama Lahendong adalah wisata alam, khususnya kawasan Hutan Pinus Lahendong. Kawasan ini memiliki hutan pinus yang cukup luas, udara pegunungan yang sejuk, serta pemandangan alam yang memberikan suasana tenang dan nyaman. Kondisi tersebut mendukung pengembangan kegiatan wisata alam, rekreasi, relaksasi, dan kegiatan luar ruangan.",
    },
    {
      id: "P2",
      judul: "Sumber Air Panas Alami",
      deskripsi: "Lahendong memiliki sumber air panas alami yang mengandung belerang. Keberadaan air panas menjadi salah satu daya tarik utama kawasan karena memberikan pengalaman relaksasi bagi pengunjung, dan dapat dikembangkan menjadi bagian dari wisata berbasis alam dan kesehatan. Kawasan ini telah dimanfaatkan masyarakat sebagai tempat pemandian air panas alami sejak tahun 1980-an.",
    },
    {
      id: "P3",
      judul: "Panas Bumi (Geotermal)",
      deskripsi: "Lahendong mempunyai potensi geotermal atau panas bumi. Potensi ini dapat dikembangkan bukan hanya sebagai daya tarik wisata, tetapi juga sebagai sarana edukasi bagi masyarakat dan wisatawan mengenai panas bumi, lingkungan, serta energi terbarukan, sehingga wisata di Lahendong memiliki nilai tambah berupa pengetahuan tentang kondisi alam dan sumber daya di wilayah ini.",
    },
    {
      id: "P4",
      judul: "Keanekaragaman Flora dan Fauna",
      deskripsi: "Kawasan Hutan Pinus Lahendong memiliki vegetasi lokal serta beberapa jenis fauna, seperti burung, landak, dan babi hutan. Keanekaragaman hayati tersebut mendukung pengembangan ekowisata sekaligus menjadi sarana edukasi mengenai pentingnya menjaga kelestarian lingkungan.",
    },
  ],

  // Belum ada data UMKM resmi.
  umkm: [],

  // CONTOH — syarat, alur, waktu, dan biaya perlu dicocokkan dengan ketentuan kantor kelurahan.
  layanan: [
    { id: "S1", nama_surat: "Surat Keterangan Domisili", syarat: "Fotokopi KTP, fotokopi KK, pengantar RT/lingkungan", alur: "Ajukan ke kantor lurah → verifikasi berkas → tanda tangan lurah → surat selesai", waktu: "1 hari kerja", biaya: "Gratis" },
    { id: "S2", nama_surat: "Surat Keterangan Tidak Mampu (SKTM)", syarat: "Fotokopi KTP, KK, surat pengantar RT, keterangan penghasilan", alur: "Ajukan ke kantor lurah → survei singkat bila perlu → tanda tangan lurah", waktu: "1–2 hari kerja", biaya: "Gratis" },
    { id: "S3", nama_surat: "Surat Pengantar Nikah", syarat: "Fotokopi KTP kedua calon, KK, surat pengantar RT, pas foto", alur: "Ajukan ke kantor lurah → verifikasi data → surat diteruskan ke KUA", waktu: "1 hari kerja", biaya: "Gratis" },
    { id: "S4", nama_surat: "Surat Keterangan Usaha", syarat: "Fotokopi KTP, KK, foto lokasi usaha, pengantar RT/lingkungan", alur: "Ajukan ke kantor lurah → verifikasi lokasi usaha → tanda tangan lurah", waktu: "1–3 hari kerja", biaya: "Gratis" },
    { id: "S5", nama_surat: "Surat Keterangan Kelahiran", syarat: "Fotokopi KTP orang tua, KK, surat keterangan bidan/rumah sakit", alur: "Ajukan ke kantor lurah → verifikasi berkas → tanda tangan lurah", waktu: "1 hari kerja", biaya: "Gratis" },
  ],
};
