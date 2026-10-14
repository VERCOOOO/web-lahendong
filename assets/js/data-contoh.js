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
    { kunci: "telepon_kantor", nilai: "085555555", keterangan: "Header, footer, dan halaman Kontak. Kosong = tidak ditampilkan." },
    { kunci: "email", nilai: "lahendong@gmail.com", keterangan: "Halaman Kontak. Kosong = tidak ditampilkan." },
    { kunci: "jam_layanan", nilai: "Senin – Kamis, 08.00 – 16.30 WITA / Jumat, 08.00 – 13.30 WITA / Sabtu – Minggu, Hanya keadaan mendesak", keterangan: "Header, footer, halaman Kontak dan Layanan." },
    {
      kunci: "letak",
      nilai:
        "Secara geografis, Kelurahan Lahendong berada di wilayah perbukitan vulkanik dan dataran tinggi, sekitar 5,2 km dari pusat Kota Tomohon dan sekitar 30 km di sebelah selatan Kota Manado.\n" +
        "Dengan luas 6,8 km², Lahendong termasuk kelurahan terluas di Kecamatan Tomohon Selatan setelah Kelurahan Pinaras dan Kelurahan Pangolombian. Ketinggiannya yang mencapai 750–1.200 mdpl menjadikannya kawasan berhawa sejuk dan kaya akan manifestasi panas bumi.",
      keterangan: "Profil, bagian Kondisi wilayah. Satu baris dalam sel = satu paragraf.",
    },
    { kunci: "koordinat", nilai: "1°16′42″ LU, 124°48′51″ BT", keterangan: "Profil, di bawah angka kondisi wilayah." },
    { kunci: "luas_wilayah", nilai: "6,8", keterangan: "Angka saja, satuan km². Beranda dan Profil." },
    { kunci: "ketinggian", nilai: "750–1.200", keterangan: "Satuan mdpl. Profil." },
    { kunci: "suhu", nilai: "22–26", keterangan: "Satuan °C. Profil." },
    { kunci: "batas_utara", nilai: "Tumatangtang 1, Kampung Jawa", keterangan: "Profil, tabel batas wilayah." },
    { kunci: "batas_selatan", nilai: "Leilem", keterangan: "Profil, tabel batas wilayah." },
    { kunci: "batas_timur", nilai: "Pangolombian, Tondangow", keterangan: "Profil, tabel batas wilayah." },
    { kunci: "batas_barat", nilai: "Pinaras, Rambunan", keterangan: "Profil, tabel batas wilayah." },
    { kunci: "visi", nilai: "Tomohon Maju, Berdaya Saing, dan Sejahtera", keterangan: "Profil, bagian Visi & Misi." },
    {
      kunci: "misi",
      nilai:
        "Menjaga dan melestarikan Tomohon sebagai kota religius dan berbudaya\n" +
        "Mewujudkan ketahanan pangan dan pembangunan berwawasan lingkungan\n" +
        "Mewujudkan Tomohon sebagai kota wisata dunia\n" +
        "Mewujudkan pemerintahan yang berintegritas, adaptif, dan responsif\n" +
        "Meningkatkan kesejahteraan masyarakat",
      keterangan: "Profil, bagian Visi & Misi. Satu misi per baris dalam sel (Ctrl+Enter); nomor dibuat situs.",
    },
    { kunci: "tahun_data", nilai: "2026", keterangan: "Tahun data kependudukan (tab lingkungan). Halaman Penduduk." },
    { kunci: "sumber_data", nilai: "Kelurahan Lahendong", keterangan: "Sumber data kependudukan. Halaman Penduduk." },
  ],

  // Sumber: Kelurahan Lahendong, 2026. Kepala & wakil kepala lingkungan dari daftar kelurahan;
  // Lingkungan 7 belum memiliki kepala dan wakil (sel kosong → "Belum tersedia").
  // Jumlah jiwa (laki + perempuan) dan semua total dihitung situs dari tab ini.
  sejarah: [
    { judul: "Sejarah singkat", isi: "Sejarah Kelurahan Lahendong di Tomohon Selatan memiliki kaitan erat dengan kisah migrasi leluhur Minahasa, legenda alam Danau Linow, dan kekayaan ekologis wilayah tersebut." },
    { judul: "Asal usul nama", isi: "Sebutan Lahendong berasal dari nama sebatang pohon besar yang dahulu tumbuh mencolok di dekat mata air wilayah tersebut, yaitu Pohon Lumahendong (atau Lahendong). Pada zaman dahulu, kulit pohon Lahendong ditumbuk oleh penduduk setempat dan dimanfaatkan sebagai bahan pakaian tradisional yang disebut Momo’." },
    { judul: "Awal mula permukiman (abad ke-17 & 18)", isi: "- Kedatangan leluhur awal: Catatan sejarawan Belanda, Dr. J.G.F. Riedel, menyebutkan bahwa permukiman awal di kawasan Rano Lahendong dirintis oleh Penghulu Repi dari kalangan Makatelu Pitu bersama keluarganya.\n- Migrasi dari Sarongsong (tahun 1750): Pada tahun 1750, di masa kepemimpinan Mayoor Tongkotou, seorang petani bernama Mokalo Rondonuwo berjalan kaki sejauh 5 km dari Sarongsong Tulau (Wanua Ureh). Ia menemukan kawasan hutan subur yang dipenuhi hawa dingin dan aroma belerang (fumarola). Mokalo kemudian mengajak keluarga dan kerabatnya datang untuk merombak hutan dan menjadikannya lahan pertanian padi, jagung, serta area berburu." },
    { judul: "Bencana Danau Linow dan perpindahan penduduk", isi: "Pada masa-masa awal permukiman yang mulai meluas ke arah selatan, terjadi bencana alam besar. Air Danau Linow meluap hebat seperti air bah, merusak lahan pertanian yang siap panen dan menimbulkan korban jiwa.\nAkibat bencana tersebut, penduduk sepakat bermusyawarah untuk memindahkan permukiman ke arah timur, mendekati mata air tempat Pohon Lumahendong tumbuh pesat. Di lokasi baru inilah desa berkembang secara permanen." },
    { judul: "Bagian dari Walak Sarongsong", isi: "Dalam sejarah pemerintahan adat Minahasa, Lahendong dulunya merupakan bagian dari Walak atau Distrik Sarongsong. Karena wilayahnya yang berbatasan langsung dengan Leilem (Sonder) sering memicu ketegangan antarwalak, Kepala Walak Sarongsong bernama Tamboto sengaja menempatkan kerabatnya, Manopo (cucu Waworuntu I), sebagai Hukum Kedua (Kumarua) yang berkedudukan di Lahendong untuk menjaga stabilitas perbatasan." },
    { judul: "Era modern: pusat energi panas bumi (sejak 2001)", isi: "Memasuki abad ke-21, Lahendong mengukir sejarah baru sebagai tonggak pengembangan energi panas bumi di wilayah timur Indonesia. Sejak tahun 2001, Pertamina Geothermal Energy (PGE) mengoperasikan Pembangkit Listrik Tenaga Panas Bumi (PLTP) Lahendong secara komersial.\nKekayaan belerang dan manifestasi termal yang dahulu ditemukan para leluhur kini dikelola menjadi sumber listrik utama yang memasok kebutuhan energi wilayah Sulawesi Utara dan Gorontalo." },
  ],

  lingkungan: [
    { nama: "Lingkungan 1", kepala: "Julius Joni Rondonuwu", wakil_kepala: "Jetni Vinsensia Poli", jumlah_kk: "124", laki: "169", perempuan: "176", jumlah_lansia: "37", jumlah_rumah: "106" },
    { nama: "Lingkungan 2", kepala: "Jonathan Tombuku Londok", wakil_kepala: "Femmi Selvie Kowel", jumlah_kk: "116", laki: "172", perempuan: "156", jumlah_lansia: "45", jumlah_rumah: "80" },
    { nama: "Lingkungan 3", kepala: "Reynold Happy Sondakh", wakil_kepala: "Jefry Hengky Mende", jumlah_kk: "80", laki: "114", perempuan: "107", jumlah_lansia: "33", jumlah_rumah: "64" },
    { nama: "Lingkungan 4", kepala: "Djerry Andreu Legi", wakil_kepala: "Fredy Ali", jumlah_kk: "67", laki: "111", perempuan: "99", jumlah_lansia: "29", jumlah_rumah: "51" },
    { nama: "Lingkungan 5", kepala: "Tombuku Costan Sumolang", wakil_kepala: "Trully Treyse Lalawi", jumlah_kk: "113", laki: "157", perempuan: "173", jumlah_lansia: "54", jumlah_rumah: "71" },
    { nama: "Lingkungan 6", kepala: "Marho Katotje Singal", wakil_kepala: "Marten Singal", jumlah_kk: "96", laki: "139", perempuan: "132", jumlah_lansia: "40", jumlah_rumah: "65" },
    { nama: "Lingkungan 7", kepala: "", wakil_kepala: "", jumlah_kk: "69", laki: "109", perempuan: "113", jumlah_lansia: "32", jumlah_rumah: "59" },
    { nama: "Lingkungan 8", kepala: "Jon Junus Mende", wakil_kepala: "Treisye Roisye Rondonuwu", jumlah_kk: "97", laki: "152", perempuan: "156", jumlah_lansia: "42", jumlah_rumah: "75" },
  ],

  // Struktur belum final. "atasan" = jabatan atasannya; kosong = pimpinan. Urutan = urutan baris.
  aparat: [
    { jabatan: "Lurah", nama: "Reymon Stive Londok, S.T", atasan: "", nomor: "081234567890" },
    { jabatan: "Sekretaris Kelurahan", nama: "Cicilia M. Karamoy, S.ST, M.Kes", atasan: "Lurah", nomor: "081234567891" },
    { jabatan: "Kepala Seksi Pemerintahan", nama: "Marthen J. Mende, ST", atasan: "Lurah", nomor: "081234567892" },
  ],

  // Nomor darurat nasional. Tambahkan narahubung umum (puskesmas, polsek, dsb.) dengan kategori "umum".
  kontak: [
    { nama: "Polisi", tampil: "Ya", peran: "Kepolisian", nomor: "110", kategori: "darurat" },
    { nama: "Pemadam Kebakaran", tampil: "Ya", peran: "Kebakaran dan penyelamatan", nomor: "113", kategori: "darurat" },
    { nama: "Ambulans", tampil: "Ya", peran: "Gawat darurat medis", nomor: "118 / 119", kategori: "darurat" },
    { nama: "SAR/BASARNAS", tampil: "Ya", peran: "Pencarian dan pertolongan", nomor: "115", kategori: "darurat" },
  ],

  wisata: [
    {
      nama: "Danau Linow",
      tampil: "Ya",
      ringkas: "Danau vulkanik dengan warna air yang dapat berubah — hijau, biru, hingga kekuningan.",
      deskripsi:
        "Danau Linow merupakan danau vulkanik di Kelurahan Lahendong, Kecamatan Tomohon Selatan, Kota Tomohon, Sulawesi Utara. Danau ini terbentuk dari aktivitas vulkanik dan mengandung belerang, dengan aktivitas panas bumi di kawasan sekitarnya. Lingkungan danau dikelilingi vegetasi hijau dan perbukitan, sehingga suasananya sejuk dan asri.\n" +
        "Keunikan utamanya adalah warna air yang dapat berubah-ubah, seperti hijau, biru, dan kekuningan. Warna air serta suasana alamnya yang asri dan sejuk menjadi daya tarik utama bagi wisatawan.",
      jam:
        "Setiap hari, 10.00 – 20.00 WITA\n" +
        "Gerbang masuk ditutup sekitar pukul 19.00 WITA",
      tiket: "Rp40.000 per orang",
      fasilitas: "Kafe dan restoran, resort dan penginapan, area perkemahan (camping ground), area parkir, toilet, tempat ibadah, spot foto",
      waktu_terbaik: "Pagi hari atau sore menjelang matahari terbenam, untuk melihat perubahan warna air danau",
      cara_kesana:
        "Dari Manado: lewati Jalan Sam Ratulangi lalu Jalan Raya Manado – Tomohon hingga pusat Kota Tomohon (sekitar 26 km).\n" +
        "Dari pusat Kota Tomohon (sekitar Menara Alfa Omega), ikuti Jalan Raya Tomohon ke arah selatan menuju Kelurahan Lahendong.\n" +
        "Setelah melewati Objek Wisata Air Panas Belerang dan Hutan Pinus di sisi kanan jalan, lanjutkan sekitar 1,5 km, lalu belok kiri mengikuti papan petunjuk Danau Linow.\n" +
        "Total jarak dari pusat Kota Tomohon sekitar 7–8 km.",
      pengelola: "",
      maps_link: "https://maps.google.com/?q=Danau+Linow+Tomohon",
    },
    {
      nama: "Air Panas Belerang dan Hutan Pinus",
      tampil: "Ya",
      ringkas: "Hutan pinus sejuk yang berpadu dengan kolam sulfur beruap putih.",
      deskripsi:
        "Objek Wisata Air Panas Belerang dan Hutan Pinus Lahendong adalah destinasi wisata alam di Tomohon yang memadukan hutan pinus hijau nan rimbun dengan fenomena panas bumi berupa kolam sulfur beruap putih dan pemandian air panas alami yang dipercaya berkhasiat bagi kulit.\n" +
        "Uap panas bumi yang mengepul di antara deretan pohon pinus yang menjulang menciptakan suasana sejuk dan menenangkan, sehingga cocok untuk menyegarkan pikiran, berfoto, dan bersantai menikmati alam Tomohon jauh dari hiruk-pikuk perkotaan.",
      jam: "Setiap hari, 10.00 – 18.00 WITA",
      tiket:
        "Rp25.000 per orang, sudah termasuk kopi\n" +
        "Kolam air panas: Rp15.000 per orang\n" +
        "Bilik rendam air panas: Rp50.000 per ruangan (muat 3 orang)\n" +
        "Kolam dan bilik air panas sementara belum beroperasi karena air berkurang di musim kemarau",
      fasilitas: "Area parkir, toilet, spot foto, jalur penjelajahan ringan (hiking), kolam dan bilik rendam air panas (sementara belum beroperasi)",
      waktu_terbaik:
        "Pagi hari (09.00 – 11.00 WITA): uap dari kolam sulfur mengepul tebal berpadu udara pagi yang masih dingin; cocok untuk berjalan santai tanpa terik matahari.\n" +
        "Sore hari (15.00 – 17.00 WITA): cahaya matahari melembut (golden hour) untuk berfoto, dan suasana hutan pinus lebih teduh.",
      cara_kesana:
        "Berjarak sekitar 5,3 km dari pusat Kota Tomohon, kurang lebih 10–15 menit perjalanan.\n" +
        "Dari pusat Kota Tomohon (sekitar Menara Alfa Omega), ikuti Jalan Raya Tomohon ke arah selatan menuju Kelurahan Lahendong.\n" +
        "Setelah memasuki Kelurahan Lahendong, gerbang masuk berada di sisi kanan jalan dan mudah terlihat; perhatikan papan petunjuknya.",
      pengelola: "",
      maps_link: "https://maps.google.com/?q=Pemandian+Air+Panas+Belerang+Pinus+Lahendong",
    },
    {
      nama: "Mah’Watu",
      tampil: "Ya",
      ringkas: "Wisata alam asri dengan kafe terbuka, gazebo, dan aliran air belerang berwarna hijau toska.",
      deskripsi:
        "Mah’Watu merupakan destinasi wisata alam di Kelurahan Lahendong, Kecamatan Tomohon Selatan, Kota Tomohon. Tempat wisata ini menawarkan suasana asri dan sejuk dengan aliran air belerang berwarna hijau toska di antara tebing batu dan pepohonan, sehingga cocok untuk bersantai dan melepas penat.\n" +
        "Selain menikmati pemandangan, pengunjung dapat menghabiskan waktu bersama keluarga maupun teman di kafe terbuka dan gazebo sambil menikmati suasana yang tenang dan udara yang segar.",
      jam:
        "Senin – Sabtu, 10.00 – 18.00 WITA\n" +
        "Minggu, 12.00 – 18.00 WITA",
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

  // Informasi kantor kelurahan (Oktober 2026): syarat KK & KTP untuk semua surat keterangan, ditambah
  // bukti lunas pajak untuk surat yang berkaitan dengan usaha/keuangan; dapat ditunggu; tanpa biaya.
  layanan: [
    {
      nama_surat: "Surat Keterangan Domisili",
      tampil: "Ya",
      kategori: "",
      syarat: "Kartu Keluarga (KK)\nKartu Tanda Penduduk (KTP)",
      alur: "Bawa berkas persyaratan ke kantor kelurahan\nSurat diproses dan dapat ditunggu",
      waktu: "Dapat ditunggu; lama pengerjaan menyesuaikan jenis surat",
      biaya: "Gratis",
      catatan: "",
    },
    {
      nama_surat: "Surat Keterangan Orang yang Sama",
      tampil: "Ya",
      kategori: "",
      syarat: "Kartu Keluarga (KK)\nKartu Tanda Penduduk (KTP)",
      alur: "Bawa berkas persyaratan ke kantor kelurahan\nSurat diproses dan dapat ditunggu",
      waktu: "Dapat ditunggu; lama pengerjaan menyesuaikan jenis surat",
      biaya: "Gratis",
      catatan: "Untuk data yang berbeda di dokumen kependudukan, mis. nama di Kartu Keluarga berbeda dengan di KTP.",
    },
    {
      nama_surat: "Surat Keterangan Kehilangan",
      tampil: "Ya",
      kategori: "",
      syarat: "Kartu Keluarga (KK)\nKartu Tanda Penduduk (KTP)",
      alur: "Bawa berkas persyaratan ke kantor kelurahan\nSurat diproses dan dapat ditunggu",
      waktu: "Dapat ditunggu; lama pengerjaan menyesuaikan jenis surat",
      biaya: "Gratis",
      catatan: "",
    },
    {
      nama_surat: "Surat Keterangan Usaha",
      tampil: "Ya",
      kategori: "",
      syarat: "Kartu Keluarga (KK)\nKartu Tanda Penduduk (KTP)\nBukti lunas pajak",
      alur: "Bawa berkas persyaratan ke kantor kelurahan\nSurat diproses dan dapat ditunggu",
      waktu: "Dapat ditunggu; lama pengerjaan menyesuaikan jenis surat",
      biaya: "Gratis",
      catatan: "",
    },
    {
      nama_surat: "Surat Keterangan Berkelakuan Baik",
      tampil: "Ya",
      kategori: "",
      syarat: "Kartu Keluarga (KK)\nKartu Tanda Penduduk (KTP)",
      alur: "Bawa berkas persyaratan ke kantor kelurahan\nSurat diproses dan dapat ditunggu",
      waktu: "Dapat ditunggu; lama pengerjaan menyesuaikan jenis surat",
      biaya: "Gratis",
      catatan: "",
    },
    {
      nama_surat: "Surat Keterangan Belum Pernah Kawin",
      tampil: "Ya",
      kategori: "",
      syarat: "Kartu Keluarga (KK)\nKartu Tanda Penduduk (KTP)",
      alur: "Bawa berkas persyaratan ke kantor kelurahan\nSurat diproses dan dapat ditunggu",
      waktu: "Dapat ditunggu; lama pengerjaan menyesuaikan jenis surat",
      biaya: "Gratis",
      catatan: "",
    },
  ],
};
