/* ==========================================================================
   Lapisan data situs Kelurahan Lahendong.
   Satu saklar PAKAI_DUMMY mengendalikan sumber data untuk seluruh situs.
   ========================================================================== */

const PAKAI_DUMMY = true;

/* URL CSV publik per tab (dipakai hanya saat PAKAI_DUMMY = false).
   Format: publikasikan Google Sheet sebagai "Comma-separated values (.csv)" per tab. */
const URL_SHEET = {
  statistik: "",
  lingkungan: "",
  wisata: "",
  umkm: "",
  aparat: "",
  layanan: "",
  kontak: "",
};

/* ---------------------------------------------------------------------- */
/* Data dummy                                                              */
/* ---------------------------------------------------------------------- */

const DATA_DUMMY = {
  statistik: [
    { kunci: "jumlah_penduduk", nilai: "3241" },
    { kunci: "jumlah_kk", nilai: "912" },
    { kunci: "jumlah_lingkungan", nilai: "8" },
    { kunci: "luas_wilayah", nilai: "7.85" },
    { kunci: "laki", nilai: "1628" },
    { kunci: "perempuan", nilai: "1613" },
  ],

  lingkungan: [
    { id: "L1", nama: "Lingkungan I", kepala: "Yani Rorimpandey", jumlah_kk: "118", jumlah_jiwa: "412", laki: "207", perempuan: "205" },
    { id: "L2", nama: "Lingkungan II", kepala: "Denny Sumual", jumlah_kk: "126", jumlah_jiwa: "441", laki: "223", perempuan: "218" },
    { id: "L3", nama: "Lingkungan III", kepala: "Meike Tumbelaka", jumlah_kk: "104", jumlah_jiwa: "365", laki: "180", perempuan: "185" },
    { id: "L4", nama: "Lingkungan IV", kepala: "Frangky Mokodompit", jumlah_kk: "97", jumlah_jiwa: "338", laki: "171", perempuan: "167" },
    { id: "L5", nama: "Lingkungan V", kepala: "Selvi Kalangi", jumlah_kk: "132", jumlah_jiwa: "456", laki: "228", perempuan: "228" },
    { id: "L6", nama: "Lingkungan VI", kepala: "Oldie Wowor", jumlah_kk: "89", jumlah_jiwa: "312", laki: "158", perempuan: "154" },
    { id: "L7", nama: "Lingkungan VII", kepala: "Rina Tampi", jumlah_kk: "121", jumlah_jiwa: "428", laki: "214", perempuan: "214" },
    { id: "L8", nama: "Lingkungan VIII", kepala: "Anton Lengkong", jumlah_kk: "125", jumlah_jiwa: "489", laki: "247", perempuan: "242" },
  ],

  wisata: [
    {
      id: "W1",
      nama: "Danau Linow",
      ringkas: "Danau vulkanik tiga warna dengan uap belerang dan pemandangan matahari terbenam.",
      deskripsi:
        "Danau Linow dikenal karena permukaan airnya yang dapat berubah warna — hijau, biru kehijauan, hingga cokelat kemerahan — akibat kandungan mineral dan aktivitas vulkanik di dasarnya. Uap belerang yang terus mengepul menambah suasana khas kawasan wisata alam ini. Area sekitar danau ditata dengan jalur pejalan kaki, gazebo, dan spot foto yang menghadap langsung ke danau.",
      foto: "wisata-danau-linow.webp",
      jam: "08.00 – 18.00 WITA setiap hari",
      tiket: "Rp 30.000 per orang",
      fasilitas: "Area parkir, gazebo, warung makan, toilet umum, spot foto",
      waktu_terbaik: "Pagi hari atau menjelang matahari terbenam",
      cara_kesana: "±20 menit dari pusat Kota Tomohon melalui jalan Tomohon–Tondano, ikuti papan penunjuk Danau Linow.",
      maps_link: "https://maps.google.com/?q=Danau+Linow+Tomohon",
    },
    {
      id: "W2",
      nama: "Hutan Pinus Lahendong",
      ringkas: "Kawasan hutan pinus sejuk dengan udara segar, cocok untuk berjalan santai dan berkemah.",
      deskripsi:
        "Hutan Pinus Lahendong menawarkan suasana teduh dengan barisan pohon pinus tinggi yang menaungi jalur setapak. Kawasan ini menjadi tempat favorit warga dan pengunjung untuk berjalan kaki, berfoto, hingga berkemah di akhir pekan. Udara di sini terasa lebih sejuk dibanding pusat kota karena berada di dataran tinggi dekat kawasan panas bumi.",
      foto: "wisata-hutan-pinus.webp",
      jam: "07.00 – 17.30 WITA setiap hari",
      tiket: "Rp 10.000 per orang",
      fasilitas: "Jalur trekking, area kemah, tempat duduk, warung kopi",
      waktu_terbaik: "Pagi hari saat kabut masih turun",
      cara_kesana: "±15 menit dari kantor Kelurahan Lahendong, akses jalan beraspal hingga area parkir.",
      maps_link: "https://maps.google.com/?q=Hutan+Pinus+Lahendong",
    },
    {
      id: "W3",
      nama: "Kawah Belerang Lahendong",
      ringkas: "Titik kemunculan uap panas bumi alami yang menjadi ciri khas kawasan Lahendong.",
      deskripsi:
        "Kawah Belerang Lahendong memperlihatkan aktivitas panas bumi permukaan berupa kolam lumpur panas dan semburan uap belerang. Lokasi ini menjadi bukti nyata potensi energi panas bumi yang dimanfaatkan PLTP di sekitar kelurahan. Pengunjung dapat melihat langsung fenomena geotermal dari jarak aman yang telah dipagari.",
      foto: "wisata-kawah-belerang.webp",
      jam: "08.00 – 17.00 WITA setiap hari",
      tiket: "Rp 15.000 per orang",
      fasilitas: "Pagar pembatas aman, papan informasi, area parkir kecil",
      waktu_terbaik: "Pagi hingga siang hari, hindari saat hujan deras",
      cara_kesana: "±10 menit dari Danau Linow, mengikuti jalan menuju kawasan panas bumi Lahendong.",
      maps_link: "https://maps.google.com/?q=Kawah+Belerang+Lahendong",
    },
    {
      id: "W4",
      nama: "Pemandian Air Panas Lahendong",
      ringkas: "Kolam air panas alami hasil pemanfaatan sumber panas bumi setempat.",
      deskripsi:
        "Pemandian Air Panas Lahendong memanfaatkan aliran air panas alami dari sumber panas bumi yang dialirkan ke kolam-kolam rendam. Dipercaya membantu relaksasi otot dan meredakan pegal, tempat ini menjadi tujuan wisata kesehatan sederhana bagi warga lokal maupun pengunjung dari luar kota.",
      foto: "wisata-air-panas.webp",
      jam: "06.00 – 20.00 WITA setiap hari",
      tiket: "Rp 20.000 per orang",
      fasilitas: "Kolam rendam, ruang bilas, loker, kantin",
      waktu_terbaik: "Sore hari setelah beraktivitas",
      cara_kesana: "±5 menit dari kantor Kelurahan Lahendong, berada di tepi jalan utama.",
      maps_link: "https://maps.google.com/?q=Pemandian+Air+Panas+Lahendong",
    },
  ],

  umkm: [
    { id: "U1", nama: "Kios Klappertaart Bu Merry", produk: "Klappertaart & kue basah khas Minahasa", kontak: "0812-3456-7801", lingkungan: "Lingkungan II", foto: "umkm-1.webp" },
    { id: "U2", nama: "Sambal Roa Lahendong", produk: "Sambal roa dan abon ikan cakalang", kontak: "0813-4455-6602", lingkungan: "Lingkungan V", foto: "umkm-2.webp" },
    { id: "U3", nama: "Anyaman Bambu Pak Tolu", produk: "Kerajinan anyaman bambu dan rotan", kontak: "0821-5566-7703", lingkungan: "Lingkungan VII", foto: "umkm-3.webp" },
    { id: "U4", nama: "Kopi Gunung Lahendong", produk: "Kopi robusta lokal sangrai rumahan", kontak: "0852-6677-8804", lingkungan: "Lingkungan I", foto: "umkm-4.webp" },
    { id: "U5", nama: "Keripik Woku Sinta", produk: "Keripik pisang & singkong rasa woku", kontak: "0838-7788-9905", lingkungan: "Lingkungan VIII", foto: "umkm-5.webp" },
  ],

  aparat: [
    { id: "A1", nama: "Drs. Semuel Pangemanan", jabatan: "Lurah Lahendong", urutan: "1", foto: "" },
    { id: "A2", nama: "Fentje Rundengan, S.STP", jabatan: "Sekretaris Lurah", urutan: "2", foto: "" },
    { id: "A3", nama: "Marlin Wuwungan", jabatan: "Kepala Seksi Pemerintahan", urutan: "3", foto: "" },
    { id: "A4", nama: "Jusuf Tendean", jabatan: "Kepala Seksi Pembangunan & Kesejahteraan", urutan: "4", foto: "" },
    { id: "A5", nama: "Olga Manoppo", jabatan: "Kepala Seksi Pelayanan Umum", urutan: "5", foto: "" },
  ],

  layanan: [
    {
      id: "S1",
      nama_surat: "Surat Keterangan Domisili",
      syarat: "Fotokopi KTP, fotokopi KK, pengantar RT/lingkungan",
      alur: "Ajukan ke kantor lurah → verifikasi berkas → tanda tangan lurah → surat selesai",
      waktu: "1 hari kerja",
      biaya: "Gratis",
    },
    {
      id: "S2",
      nama_surat: "Surat Keterangan Tidak Mampu (SKTM)",
      syarat: "Fotokopi KTP, KK, surat pengantar RT, keterangan penghasilan",
      alur: "Ajukan ke kantor lurah → survei singkat bila perlu → tanda tangan lurah",
      waktu: "1–2 hari kerja",
      biaya: "Gratis",
    },
    {
      id: "S3",
      nama_surat: "Surat Pengantar Nikah",
      syarat: "Fotokopi KTP kedua calon, KK, surat pengantar RT, pas foto",
      alur: "Ajukan ke kantor lurah → verifikasi data → surat diteruskan ke KUA",
      waktu: "1 hari kerja",
      biaya: "Gratis",
    },
    {
      id: "S4",
      nama_surat: "Surat Keterangan Usaha",
      syarat: "Fotokopi KTP, KK, foto lokasi usaha, pengantar RT/lingkungan",
      alur: "Ajukan ke kantor lurah → verifikasi lokasi usaha → tanda tangan lurah",
      waktu: "1–3 hari kerja",
      biaya: "Gratis",
    },
    {
      id: "S5",
      nama_surat: "Surat Keterangan Kelahiran",
      syarat: "Fotokopi KTP orang tua, KK, surat keterangan bidan/rumah sakit",
      alur: "Ajukan ke kantor lurah → verifikasi berkas → tanda tangan lurah",
      waktu: "1 hari kerja",
      biaya: "Gratis",
    },
  ],

  kontak: [
    { id: "K1", nama: "Drs. Semuel Pangemanan", peran: "Lurah Lahendong", nomor: "0431-123456" },
    { id: "K2", nama: "Fentje Rundengan, S.STP", peran: "Sekretaris Lurah", nomor: "0812-1111-2222" },
    { id: "K3", nama: "Kantor Kelurahan Lahendong", peran: "Layanan Administrasi", nomor: "0431-654321" },
    { id: "K4", nama: "Pos Kamling Terpadu", peran: "Keamanan Lingkungan", nomor: "0813-3333-4444" },
  ],
};

/* ---------------------------------------------------------------------- */
/* Utilitas                                                                */
/* ---------------------------------------------------------------------- */

function urlFoto(nilai) {
  if (!nilai || String(nilai).trim() === "") return "img/placeholder.webp";
  const teks = String(nilai).trim();
  if (teks.startsWith("http")) return teks;
  return "img/" + teks;
}

function saringBarisKosong(baris) {
  return (baris || []).filter((row) => {
    if (!row || typeof row !== "object") return false;
    if (Object.prototype.hasOwnProperty.call(row, "id")) {
      return row.id !== undefined && row.id !== null && String(row.id).trim() !== "";
    }
    if (Object.prototype.hasOwnProperty.call(row, "kunci")) {
      return row.kunci !== undefined && row.kunci !== null && String(row.kunci).trim() !== "";
    }
    return true;
  });
}

function ambilCSV(url) {
  return new Promise((resolve, reject) => {
    if (typeof Papa === "undefined") {
      reject(new Error("PapaParse belum dimuat."));
      return;
    }
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (hasil) => resolve(hasil.data),
      error: (err) => reject(err),
    });
  });
}

/**
 * Mengambil data satu tab. Bentuk pemanggilan identik untuk mode dummy
 * maupun mode Google Sheets (CSV).
 * @param {string} namaTab salah satu: statistik, lingkungan, wisata, umkm, aparat, layanan, kontak
 * @returns {Promise<Array<Object>>}
 */
async function ambilData(namaTab) {
  try {
    if (PAKAI_DUMMY) {
      const data = DATA_DUMMY[namaTab] || [];
      return saringBarisKosong(data);
    }
    const url = URL_SHEET[namaTab];
    if (!url) throw new Error("URL sheet untuk tab '" + namaTab + "' belum diatur.");
    const baris = await ambilCSV(url);
    return saringBarisKosong(baris);
  } catch (err) {
    console.error("Gagal mengambil data tab '" + namaTab + "':", err);
    throw err;
  }
}
