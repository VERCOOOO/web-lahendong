/* ==========================================================================
   Lapisan data — satu-satunya pintu masuk data situs: ambilData(namaTab).
   Panduan mengelola Google Sheet ada di README.md.
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Pengaturan — hanya bagian ini yang perlu diubah admin                  */
/* ---------------------------------------------------------------------- */

/** true = pakai data contoh (data-contoh.js); false = baca Google Sheet. */
const PAKAI_DUMMY = false;

/* ID Google Sheet: bagian di antara "/d/" dan "/edit" pada tautan sheet.
   Sheet harus dibagikan "Siapa saja yang memiliki link" sebagai Pelihat. */
const ID_SPREADSHEET = "11f8D-qzWt1rdkin7uBMmrbrEkZmc4dih39ruUwTh1gQ";

/* ---------------------------------------------------------------------- */
/* Struktur sheet                                                          */
/* ---------------------------------------------------------------------- */

/* Kolom tiap tab, berurutan seperti di sheet. Baris judul di sheet harus memakai
   nama-nama ini; huruf besar/kecil dan spasi diabaikan ("Jumlah KK" → "jumlah_kk").

   Prinsip agar admin sulit salah:
   - Kolom pertama = kunci baris (nama, jabatan, …). Tidak ada kolom id yang harus dikarang:
     setiap baris mendapat kode otomatis dari kolom pertamanya (lihat beriKode).
   - Tidak ada angka yang ditulis dua kali. Total penduduk, KK, dan jiwa per lingkungan
     dihitung dari tab lingkungan (lihat ringkasPenduduk di komponen.js).
   - Kolom "tampil" (Ya/Tidak): "Tidak" menyembunyikan baris tanpa menghapusnya; kosong = Ya.
   - Tidak ada kolom foto: semua foto statis di folder img/, didaftarkan di komponen.js.
   - Daftar destinasi wisata tetap (DESTINASI di komponen.js); sheet hanya mengubah teksnya.
   - Kolom "keterangan" (tab profil) hanya catatan untuk admin dan tidak dibaca situs.
   Peta tab → halaman ada di tab "petunjuk" pada sheet dan di README.md.
   Halaman cek-data.html memeriksa semua aturan ini dan melaporkan kesalahan isian. */
const SKEMA = {
  // Informasi umum: kantor, letak & wilayah, visi-misi, tahun & sumber data penduduk.
  profil: ["kunci", "nilai", "keterangan"],
  // Sejarah kelurahan, satu baris per bagian (judul + isi), urut seperti di sheet.
  // isi: satu paragraf per baris; baris berawalan "- " menjadi butir daftar.
  sejarah: ["judul", "isi"],
  // Satu baris per lingkungan. Jabatan ditentukan kolomnya (kepala / wakil_kepala), jadi tidak bisa tertukar;
  // sel kosong tampil "Belum tersedia". Jiwa = laki + perempuan; semua total dihitung dari tab ini.
  lingkungan: ["nama", "kepala", "wakil_kepala", "jumlah_kk", "laki", "perempuan", "jumlah_lansia", "jumlah_rumah"],
  // Sumber tunggal identitas aparat. "atasan" berisi jabatan atasannya; kosong = pimpinan.
  // Urutan tampil = urutan baris. Aparat yang nomornya diisi tampil di halaman Kontak.
  aparat: ["jabatan", "nama", "atasan", "nomor"],
  // Narahubung non-aparat. kategori: "darurat" atau "umum".
  kontak: ["nama", "tampil", "peran", "nomor", "kategori"],
  // Daftar destinasi TETAP: hanya baris yang namanya terdaftar di DESTINASI (komponen.js) yang tampil,
  // karena tiap destinasi butuh foto. Menambah destinasi = pekerjaan pengembang (foto + daftar).
  wisata: ["nama", "tampil", "ringkas", "deskripsi", "jam", "tiket", "fasilitas", "waktu_terbaik", "cara_kesana", "pengelola", "maps_link"],
  // Satu baris per jenis surat. syarat & alur: satu butir per baris di dalam sel.
  // kategori (opsional) mengelompokkan surat; catatan (opsional) tampil sebagai pemberitahuan.
  layanan: ["nama_surat", "tampil", "kategori", "syarat", "alur", "waktu", "biaya", "catatan"],
};

/* Kunci yang dikenal di tab profil — dipakai halaman Cek Data untuk menangkap salah ketik. */
const KUNCI_PROFIL = [
  "alamat_kantor", "telepon_kantor", "email", "jam_layanan",
  "letak", "koordinat", "luas_wilayah", "ketinggian", "suhu",
  "batas_utara", "batas_selatan", "batas_timur", "batas_barat",
  "visi", "misi", "tahun_data", "sumber_data",
];

/** URL CSV satu tab, dicari berdasarkan nama tab. */
function urlTab(namaTab) {
  return "https://docs.google.com/spreadsheets/d/" + ID_SPREADSHEET +
    "/gviz/tq?tqx=out:csv&headers=1&sheet=" + encodeURIComponent(namaTab);
}

const BATAS_WAKTU_MS = 15000;

/* ---------------------------------------------------------------------- */
/* Titik masuk                                                             */
/* ---------------------------------------------------------------------- */

/* Satu halaman bisa meminta tab yang sama lebih dari sekali (mis. penduduk.html).
   Hasilnya disimpan di memori agar tiap CSV hanya diunduh sekali per kunjungan. */
const tembolokData = {};

/**
 * Mengambil data satu tab. Bentuk pemanggilan identik untuk mode dummy
 * maupun mode Google Sheets (CSV).
 * @param {string} namaTab salah satu kunci SKEMA
 * @returns {Promise<Array<Object>>}
 */
async function ambilData(namaTab) {
  if (!tembolokData[namaTab]) {
    tembolokData[namaTab] = muatTab(namaTab).then(({ baris }) => beriKode(namaTab, saringBaris(namaTab, baris)));
  }
  try {
    return (await tembolokData[namaTab]).slice();
  } catch (err) {
    delete tembolokData[namaTab];
    console.error('[data] Gagal mengambil tab "' + namaTab + '": ' + err.message);
    throw err;
  }
}

/**
 * Isi tab apa adanya (sudah dirapikan, belum disaring) beserta daftar kolom di sheet.
 * Setiap baris membawa _baris = nomor barisnya di spreadsheet, untuk laporan Cek Data.
 * @returns {Promise<{kolom: string[], baris: Array<Object>}>}
 */
async function muatTab(namaTab) {
  const { kolom, mentah } = PAKAI_DUMMY
    ? { kolom: SKEMA[namaTab] || [], mentah: DATA_DUMMY[namaTab] || [] }
    : await ambilDariSheet(namaTab);
  return { kolom, baris: rapikanBaris(namaTab, mentah) };
}

/* ---------------------------------------------------------------------- */
/* Pengambilan dari Google Sheets                                          */
/* ---------------------------------------------------------------------- */

async function ambilDariSheet(namaTab) {
  if (typeof Papa === "undefined") throw new Error("PapaParse belum dimuat");

  // Baris kosong tidak dilewati di sini agar nomor baris tetap sama dengan di spreadsheet;
  // baris kosong dibuang belakangan oleh saringBaris.
  const hasil = Papa.parse((await unduhCSV(urlTab(namaTab))).replace(/\r?\n$/, ""), {
    header: true,
    skipEmptyLines: false,
    transformHeader: normalisasiKunci,
  });
  const kolom = hasil.meta.fields || [];
  periksaKolom(namaTab, kolom);
  const galat = hasil.errors.filter((e) => e.code !== "TooFewFields");
  if (galat.length) {
    console.warn('[data] Tab "' + namaTab + '": ' + galat.length + " baris CSV tidak rapi.", galat.slice(0, 3));
  }
  return { kolom, mentah: hasil.data };
}

async function unduhCSV(url) {
  const kontrol = new AbortController();
  const timer = setTimeout(() => kontrol.abort(), BATAS_WAKTU_MS);
  try {
    const res = await fetch(url, { signal: kontrol.signal, cache: "no-store" });
    if (!res.ok) throw new Error("server membalas HTTP " + res.status);
    const teks = await res.text();
    if (/^\s*</.test(teks)) {
      throw new Error("yang diterima halaman HTML, bukan CSV — sheet belum dibagikan ke \"Siapa saja yang memiliki link\"");
    }
    return teks;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("tidak ada respons dalam " + BATAS_WAKTU_MS / 1000 + " detik");
    }
    if (err instanceof TypeError) {
      // Sheet privat dialihkan ke halaman login Google dan diblokir CORS.
      throw new Error("permintaan gagal — periksa koneksi internet dan pastikan sheet dibagikan ke \"Siapa saja yang memiliki link\"");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function periksaKolom(namaTab, kolomAda) {
  const kolom = SKEMA[namaTab] || [];
  if (kolom.length && !kolomAda.includes(kolom[0])) {
    // Google mengirim tab pertama bila nama tab tidak ditemukan, jadi tanpa kolom kunci datanya pasti salah tab.
    throw new Error('tab "' + namaTab + '" tidak ditemukan, atau kolom "' + kolom[0] + '" di baris judulnya hilang');
  }
  const hilang = kolom.filter((k) => !kolomAda.includes(k));
  if (hilang.length) {
    console.warn('[data] Tab "' + namaTab + '" tidak punya kolom: ' + hilang.join(", ") + ". Periksa baris judul di Google Sheet.");
  }
}

/* ---------------------------------------------------------------------- */
/* Normalisasi baris — dijalankan sama persis untuk mode dummy dan sheet  */
/* ---------------------------------------------------------------------- */

/** "Jumlah KK " → "jumlah_kk". Juga membuang BOM di awal file CSV. */
function normalisasiKunci(teks) {
  return String(teks ?? "").replace(/^\uFEFF/, "").trim().toLowerCase().replace(/\s+/g, "_");
}

function rapikanBaris(namaTab, baris) {
  const kolom = SKEMA[namaTab] || [];
  return (baris || []).map((row, i) => {
    const bersih = {};
    Object.keys(row || {}).forEach((k) => {
      const kunci = normalisasiKunci(k);
      if (kunci) bersih[kunci] = escapeHtml(String(row[k] ?? "").trim());
    });
    // Kolom yang tidak ada di sheet diisi kosong agar halaman tidak menampilkan "undefined".
    kolom.forEach((k) => {
      if (!(k in bersih)) bersih[k] = "";
    });
    // Tab kunci-nilai (profil): "Luas Wilayah" dibaca "luas_wilayah".
    if (kolom[0] === "kunci") bersih.kunci = normalisasiKunci(bersih.kunci);
    bersih._baris = i + 2; // baris 1 = judul kolom
    return bersih;
  });
}

/** Buang baris yang kuncinya kosong (baris kosong / sengaja dikosongkan) dan baris bertanda tampil = Tidak. */
function saringBaris(namaTab, baris) {
  const kunciBaris = (SKEMA[namaTab] || ["id"])[0];
  return baris.filter((row) =>
    String(row[kunciBaris] || "").trim() !== "" && !/^\s*(tidak|no|sembunyi)/i.test(teksPolos(row.tampil)));
}

/**
 * Setiap baris mendapat kode dari kolom pertamanya, mis. "Surat Keterangan Domisili" →
 * "surat-keterangan-domisili". Kode dipakai sebagai alamat tautan (wisata-detail.html?id=danau-linow,
 * layanan.html#surat-keterangan-domisili) dan kunci DESTINASI di komponen.js.
 * Nama kembar mendapat akhiran -2, -3, … (halaman Cek Data memperingatkannya).
 */
function beriKode(namaTab, baris) {
  const kolom = SKEMA[namaTab] || [];
  if (kolom[0] === "kunci") return baris;
  const terpakai = new Map();
  return baris.map((row) => {
    const dasar = kodeDari(row[kolom[0]]) || namaTab;
    const ke = (terpakai.get(dasar) || 0) + 1;
    terpakai.set(dasar, ke);
    return { ...row, id: ke === 1 ? dasar : dasar + "-" + ke };
  });
}

/** "Surat Keterangan Usaha (SKU)" → "surat-keterangan-usaha-sku". */
function kodeDari(teks) {
  return teksPolos(teks)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------------------------------------------------------------------- */
/* Utilitas nilai                                                          */
/* ---------------------------------------------------------------------- */

/** Hanya tautan http(s) yang diterima; nilai lain (mis. "javascript:") dikosongkan. */
function urlAman(nilai) {
  const teks = String(nilai || "").trim();
  return /^https?:\/\//i.test(teks) ? teks : "";
}

/**
 * Isi sel → Number. Menerima format Indonesia maupun internasional:
 * "3241", "3.241", "7,85", "7.85", "3.241,5". Kosong/bukan angka → null.
 */
function keAngka(nilai) {
  let s = String(nilai ?? "").replace(/\s/g, "");
  if (s === "") return null;

  const adaTitik = s.includes(".");
  const adaKoma = s.includes(",");
  if (adaTitik && adaKoma) {
    // Pemisah yang muncul terakhir adalah pemisah desimal.
    s = s.lastIndexOf(",") > s.lastIndexOf(".")
      ? s.replace(/\./g, "").replace(",", ".")
      : s.replace(/,/g, "");
  } else if (adaKoma) {
    s = /^-?\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, "") : s.replace(",", ".");
  } else if (adaTitik && /^-?\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, "");
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const ENTITAS_HTML = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Isi sheet dirender lewat innerHTML, jadi setiap nilai di-escape saat dinormalisasi. */
function escapeHtml(teks) {
  return String(teks).replace(/[&<>"']/g, (c) => ENTITAS_HTML[c]);
}

/** Kebalikan escapeHtml — untuk konteks non-HTML seperti judul tab dan label grafik. */
function teksPolos(teks) {
  return String(teks ?? "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}
