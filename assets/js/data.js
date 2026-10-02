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
   - Kolom "foto": tautan berbagi Google Drive, tautan gambar https, atau nama berkas di img/.
   - Kolom "keterangan" (tab profil) hanya catatan untuk admin dan tidak dibaca situs.
   Peta tab → halaman ada di tab "petunjuk" pada sheet dan di README.md.
   Halaman cek-data.html memeriksa semua aturan ini dan melaporkan kesalahan isian. */
const SKEMA = {
  // Informasi umum: kantor, wilayah, sejarah, legenda, tahun & sumber data penduduk, foto hero.
  profil: ["kunci", "nilai", "keterangan"],
  // Satu baris per lingkungan. Jiwa = laki + perempuan; semua total dihitung dari tab ini.
  lingkungan: ["nama", "kepala", "jumlah_kk", "laki", "perempuan", "jumlah_lansia", "jumlah_rumah"],
  // Sumber tunggal identitas aparat. "atasan" berisi jabatan atasannya; kosong = pimpinan.
  // Urutan tampil = urutan baris. Aparat yang nomornya diisi tampil di halaman Kontak.
  aparat: ["jabatan", "nama", "atasan", "nomor", "foto"],
  // Narahubung non-aparat. kategori: "darurat" atau "umum".
  kontak: ["nama", "tampil", "peran", "nomor", "kategori"],
  wisata: ["nama", "tampil", "foto", "ringkas", "deskripsi", "jam", "tiket", "fasilitas", "waktu_terbaik", "cara_kesana", "pengelola", "maps_link"],
  umkm: ["nama", "tampil", "foto", "produk", "kontak", "lingkungan"],
  // Satu baris per jenis surat. syarat & alur: satu butir per baris di dalam sel.
  // kategori (opsional) mengelompokkan surat; catatan (opsional) tampil sebagai pemberitahuan.
  layanan: ["nama_surat", "tampil", "kategori", "syarat", "alur", "waktu", "biaya", "catatan"],
  // Foto tambahan untuk halaman Galeri (selain foto wisata & UMKM).
  galeri: ["judul", "tampil", "foto", "kategori"],
};

/* Kunci yang dikenal di tab profil — dipakai halaman Cek Data untuk menangkap salah ketik. */
const KUNCI_PROFIL = [
  "alamat_kantor", "telepon_kantor", "email", "jam_layanan",
  "luas_wilayah", "ketinggian", "suhu", "batas_utara", "batas_selatan", "batas_timur", "batas_barat",
  "sejarah", "legenda", "tahun_data", "sumber_data", "foto_hero",
];

/** URL CSV satu tab, dicari berdasarkan nama tab. */
function urlTab(namaTab) {
  return "https://docs.google.com/spreadsheets/d/" + ID_SPREADSHEET +
    "/gviz/tq?tqx=out:csv&headers=1&sheet=" + encodeURIComponent(namaTab);
}

/* URL CSV per tab (dipakai hanya saat PAKAI_DUMMY = false). Tiap entri boleh
   diganti URL CSV lain, mis. tautan dari menu "Publikasikan ke web". */
const URL_SHEET = Object.fromEntries(Object.keys(SKEMA).map((tab) => [tab, urlTab(tab)]));

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
  if (PAKAI_DUMMY) {
    const mentah = DATA_DUMMY[namaTab] || [];
    return { kolom: SKEMA[namaTab] || [], baris: rapikanBaris(namaTab, mentah) };
  }
  const { kolom, mentah } = await ambilDariSheet(namaTab);
  return { kolom, baris: rapikanBaris(namaTab, mentah) };
}

/* ---------------------------------------------------------------------- */
/* Pengambilan dari Google Sheets                                          */
/* ---------------------------------------------------------------------- */

async function ambilDariSheet(namaTab) {
  const url = URL_SHEET[namaTab];
  if (!url) throw new Error('URL untuk tab "' + namaTab + '" belum diisi di URL_SHEET');
  if (/docs\.google\.com/.test(url) && !/output=csv|out:csv/.test(url)) {
    console.warn('[data] URL tab "' + namaTab + '" bukan URL CSV. Tautan "/edit" tidak bisa dipakai langsung — isi ID_SPREADSHEET saja.');
  }
  if (typeof Papa === "undefined") throw new Error("PapaParse belum dimuat");

  // Baris kosong tidak dilewati di sini agar nomor baris tetap sama dengan di spreadsheet;
  // baris kosong dibuang belakangan oleh saringBaris.
  const hasil = Papa.parse((await unduhCSV(url)).replace(/\r?\n$/, ""), {
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
      throw new Error("yang diterima halaman HTML, bukan CSV — sheet belum dibagikan ke \"Siapa saja yang memiliki link\", atau URL bukan format CSV");
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
 * layanan.html#surat-keterangan-domisili) dan kunci FOTO cadangan di komponen.js.
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

/** "Kue Lapis Bu Ani (Lingk. 2)" → "kue-lapis-bu-ani-lingk-2". */
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

/**
 * Isi kolom foto → alamat gambar, atau "" bila tidak bisa dipakai. Diterima:
 * - tautan berbagi Google Drive (…/file/d/ID/view, open?id=ID, uc?id=ID) → gambar Drive
 *   berukuran `lebar` piksel (file harus dibagikan "Siapa saja yang memiliki link");
 * - tautan gambar https lain, dipakai apa adanya;
 * - nama berkas di folder img/ situs, mis. "umkm-kue-lapis.webp".
 */
function urlFoto(nilai, lebar = 1200) {
  const teks = teksPolos(nilai).trim();
  if (!teks) return "";
  const idDrive = idGoogleDrive(teks);
  if (idDrive) return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(idDrive) + "&sz=w" + lebar;
  // Tautan Drive tanpa ID berkas (mis. tautan folder) bukan gambar.
  if (/(drive|docs)\.google\.com/i.test(teks)) return "";
  if (/^https:\/\//i.test(teks)) return teks;
  if (/^[\w.-]+\.(webp|jpe?g|png|gif|avif|svg)$/i.test(teks)) return "img/" + teks;
  return "";
}

/** ID berkas dari tautan Google Drive, atau "" bila bukan tautan Drive. */
function idGoogleDrive(teks) {
  if (!/(drive|docs)\.google\.com|googleusercontent\.com/i.test(teks)) return "";
  const cocok = teks.match(/\/d\/([\w-]{20,})/) || teks.match(/[?&]id=([\w-]{20,})/);
  return cocok ? cocok[1] : "";
}

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
