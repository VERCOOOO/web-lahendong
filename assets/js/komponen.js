/* ==========================================================================
   Komponen konten bersama — potongan HTML dan format yang dipakai lebih dari
   satu halaman, plus isiDariData() untuk pola baku setiap blok data.
   Nilai dari ambilData() sudah di-escape, jadi aman disisipkan ke HTML.
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Foto                                                                     */
/* ---------------------------------------------------------------------- */

/* Urutan sumber foto untuk satu baris:
   1. kolom "foto" di sheet (tautan Google Drive, tautan gambar, atau nama berkas di img/);
   2. foto cadangan di folder img/ yang didaftarkan di FOTO, menurut kode baris
      (kode = kolom pertama, huruf kecil, selain huruf/angka jadi "-": "Danau Linow" → "danau-linow");
   3. gambar pengganti. Aparat tanpa foto memakai monogram inisial.
   Bila sebuah sumber gagal dimuat (mis. foto Drive belum dibagikan), sumber berikutnya dicoba. */
const FOTO = {
  wisata: {
    "danau-linow": "wisata-danau-linow.webp",
    "hutan-pinus-lahendong": "wisata-hutan-pinus.webp",
    "mah-watu": "wisata-mahwatu.webp",
    "toulangkow-hills": "wisata-toulangkow.webp",
  },
  umkm: {}, // "kue-lapis-bu-ani": "umkm-kue-lapis.webp"
  aparat: {}, // menurut nama orang: "reymon-stive-londok-s-t": "aparat-lurah.webp"
  galeri: {},
};

const FOTO_PENGGANTI = "img/placeholder.webp";

/** Daftar alamat foto yang dicoba berurutan untuk satu baris. */
function sumberFoto(tab, item, lebar = 1200) {
  const kode = tab === "aparat" ? kodeDari(item.nama) : teksPolos(item.id);
  const cadangan = FOTO[tab]?.[kode];
  return [urlFoto(item.foto, lebar), cadangan ? "img/" + cadangan : ""].filter(Boolean);
}

/** Dipanggil onerror <img>: coba sumber berikutnya, lalu gambar pengganti. */
function fotoBerikutnya(img) {
  const sisa = (img.dataset.cadangan || "").split(" ").filter(Boolean);
  const berikut = sisa.shift();
  img.dataset.cadangan = sisa.join(" ");
  if (berikut) {
    img.src = berikut;
  } else if (img.dataset.tanpaPengganti !== undefined) {
    img.remove(); // monogram di belakangnya yang tampil
  } else {
    img.onerror = null;
    img.src = FOTO_PENGGANTI;
  }
}

/** <img> untuk satu baris; bila semua sumber gagal, memakai gambar pengganti. */
function gambar(tab, item, kelas = "", lebar = 1200) {
  const [utama = FOTO_PENGGANTI, ...cadangan] = sumberFoto(tab, item, lebar);
  return `<img src="${escapeHtml(utama)}" data-cadangan="${escapeHtml(cadangan.join(" "))}" alt="${item.nama || item.judul || ""}" class="${kelas}" loading="lazy" onerror="fotoBerikutnya(this)" />`;
}

/* ---------------------------------------------------------------------- */
/* Pola baku blok data                                                     */
/* ---------------------------------------------------------------------- */

/**
 * Tampilkan "Memuat data…", ambil tab, lalu isi wadah dengan hasil render.
 *
 * @param {Element|null} wadah   elemen tujuan (boleh <tbody>)
 * @param {string|string[]} tab  satu nama tab, atau beberapa (render menerima array hasil)
 * @param {(data) => string} render  mengembalikan HTML; string kosong = tidak ada data
 * @param {object} [opsi]
 * @param {string|null} [opsi.kosong]  pesan bila render kosong; null = hapus wadah
 * @param {string|null} [opsi.gagal]   pesan bila gagal dimuat; null = hapus wadah
 * @param {(data) => void} [opsi.setelah]  dijalankan setelah HTML terpasang (mis. menggambar grafik)
 * @param {string[]} [opsi.opsional]  tab yang boleh gagal/tidak ada; isinya dianggap kosong
 * @returns {Promise<any|null>} data yang diambil, atau null bila gagal
 */
async function isiDariData(wadah, tab, render, opsi = {}) {
  if (!wadah) return null;
  const { kosong = "Belum ada data untuk ditampilkan.", gagal = "Data belum bisa dimuat saat ini.", setelah, opsional = [] } = opsi;
  const ambil = (nama) => (opsional.includes(nama) ? ambilData(nama).catch(() => []) : ambilData(nama));

  tampilkanMemuat(wadah);
  let data;
  try {
    data = Array.isArray(tab) ? await Promise.all(tab.map(ambil)) : await ambil(tab);
  } catch (err) {
    gagal === null ? wadah.remove() : tampilkanGagal(wadah, gagal);
    return null;
  }

  const html = render(data);
  if (!html) {
    kosong === null ? wadah.remove() : tampilkanKosong(wadah, kosong);
    return data;
  }
  wadah.innerHTML = html;
  aturKolomDi(wadah);
  segarkanTampilan();
  if (setelah) setelah(data);
  return data;
}

/* ---------------------------------------------------------------------- */
/* Grid adaptif — jumlah kolom mengikuti jumlah kartu                      */
/* ---------------------------------------------------------------------- */

/* Kartu dibagi ke baris sesedikit mungkin, lalu dibagi rata per baris:
   jumlah baris = ceil(n / maks), jumlah kolom = ceil(n / baris).
   Dengan maks 4: 3 kartu → 3 kolom, 4 → 4, 5 → 3 + 2, 6 → 3 × 2, 7 → 4 + 3, 8 → 4 × 2.
   Hasilnya disimpan di variabel CSS --kolom; style.css yang menerapkannya di desktop
   (tablet 2 kolom, HP 1 kolom). Batas maks diatur lewat atribut data-maks di HTML. */
function hitungKolom(n, maks = 4) {
  if (n <= 0) return 1;
  const baris = Math.ceil(n / maks);
  return Math.ceil(n / baris);
}

/** Atur --kolom sebuah .grid-adaptif / .deret-statistik menurut jumlah anak yang tampil. */
function aturKolom(wadah) {
  const item = [...wadah.children].filter((el) =>
    !el.hidden && !el.classList.contains("hidden") && !el.classList.contains("col-span-full"));
  const kolom = hitungKolom(item.length, Number(wadah.dataset.maks) || 4);
  wadah.style.setProperty("--kolom", kolom);
  wadah.dataset.kolom = kolom;
  // Deret statistik: tandai sel pertama tiap baris agar garis pembatas kirinya dihilangkan.
  item.forEach((el, i) => el.classList.toggle("awal-baris", i % kolom === 0));
}

/** Terapkan aturKolom pada wadah itu sendiri dan grid adaptif di dalamnya. */
function aturKolomDi(wadah) {
  const pilih = ".grid-adaptif, .deret-statistik";
  if (wadah.matches(pilih)) aturKolom(wadah);
  wadah.querySelectorAll(pilih).forEach(aturKolom);
}

/* ---------------------------------------------------------------------- */
/* Membaca nilai                                                           */
/* ---------------------------------------------------------------------- */

/** Jumlah jiwa satu lingkungan = laki + perempuan; null bila keduanya kosong. */
function jiwaLingkungan(l) {
  const laki = keAngka(l.laki);
  const perempuan = keAngka(l.perempuan);
  return laki === null && perempuan === null ? null : (laki || 0) + (perempuan || 0);
}

/**
 * Semua angka kependudukan dihitung dari tab lingkungan — tidak ada total yang ditulis
 * ulang di tempat lain, jadi angka di Beranda, Profil, dan Penduduk selalu cocok.
 */
function ringkasPenduduk(lingkungan) {
  const jumlah = (kolom) => lingkungan.reduce((total, l) => total + (keAngka(l[kolom]) || 0), 0);
  const laki = jumlah("laki");
  const perempuan = jumlah("perempuan");
  return {
    jiwa: laki + perempuan,
    laki,
    perempuan,
    kk: jumlah("jumlah_kk"),
    lansia: jumlah("jumlah_lansia"),
    rumah: jumlah("jumlah_rumah"),
    lingkungan: lingkungan.length,
  };
}

/** Nilai dari tab kunci-nilai (profil), atau "" bila tidak ada. */
function nilaiKunci(data, kunci) {
  return data.find((row) => row.kunci === kunci)?.nilai ?? "";
}

/** Format angka gaya Indonesia: 3241 → "3.241", 7.85 → "7,85". Bukan angka → apa adanya. */
function formatAngka(nilai) {
  const n = keAngka(nilai);
  return n === null ? nilai : n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

/** "0812-3456-7801" → "tel:081234567801". */
function hrefTelepon(nomor) {
  return "tel:" + teksPolos(nomor).replace(/[^0-9+]/g, "");
}

/* ---------------------------------------------------------------------- */
/* Teks bertanda baris baru — satu baris di sel = satu paragraf/butir      */
/* ---------------------------------------------------------------------- */

function barisDari(teks) {
  return String(teks || "").split(/\n+/).map((b) => b.trim()).filter(Boolean);
}

/** Tiap baris menjadi <p>; bila lead = true, paragraf pertama memakai gaya .lead. */
function paragraf(teks, { lead = false } = {}) {
  return barisDari(teks)
    .map((b, i) => `<p${lead && i === 0 ? ' class="lead"' : ""}>${b}</p>`)
    .join("");
}

/** Satu baris → teks biasa; beberapa baris → dipisah <br>. */
function berbaris(teks) {
  return barisDari(teks).join("<br>");
}

/** Satu baris → teks biasa; beberapa baris → daftar berbutir. */
function daftarAtauTeks(teks) {
  const baris = barisDari(teks);
  if (baris.length <= 1) return baris[0] || "";
  return `<ul class="daftar-baris">${baris.map((b) => `<li>${b}</li>`).join("")}</ul>`;
}

/** Kalimat pertama sebuah teks, untuk ringkasan. */
function kalimatPertama(teks) {
  const t = barisDari(teks)[0] || "";
  const akhir = t.search(/[.!?](\s|$)/);
  return akhir === -1 ? t : t.slice(0, akhir + 1);
}

/* ---------------------------------------------------------------------- */
/* Potongan HTML                                                           */
/* ---------------------------------------------------------------------- */

/** Satu sel angka besar untuk .deret-statistik. */
function selStatistik({ nilai, satuan = "", label }) {
  return `
    <div>
      <p class="angka">${nilai}${satuan ? `<span class="satuan">${satuan}</span>` : ""}</p>
      <p class="label-angka">${label}</p>
    </div>
  `;
}

/** Kartu destinasi wisata (beranda & halaman wisata). */
function kartuWisata(item, { denganTautan = false } = {}) {
  const meta = [
    ["ticket", barisDari(item.tiket)[0]],
    ["clock", barisDari(item.jam)[0]],
  ].filter(([, teks]) => teks);
  return `
    <a href="wisata-detail.html?id=${encodeURIComponent(teksPolos(item.id))}" class="kartu reveal flex flex-col overflow-hidden">
      <div class="bingkai-foto aspect-[3/2]">${gambar("wisata", item, "", 800)}</div>
      <div class="p-5 md:p-6 flex flex-col flex-1">
        <h3 class="judul-kartu">${item.nama}</h3>
        <p class="text-[15px] text-[var(--muted)] mt-2 leading-[1.6]">${item.ringkas}</p>
        ${meta.length ? `
          <div class="kartu-meta">
            ${meta.map(([ikon, teks]) => `<span title="${teks}"><i data-lucide="${ikon}" class="w-4 h-4"></i><span class="meta-teks">${teks}</span></span>`).join("")}
          </div>` : ""}
        ${denganTautan ? `
          <span class="tautan mt-auto pt-5">
            <span class="relative">Lihat detail<span class="garis absolute left-0 -bottom-0.5"></span></span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </span>` : ""}
      </div>
    </a>
  `;
}

/* ---------------------------------------------------------------------- */
/* Aparat                                                                  */
/* ---------------------------------------------------------------------- */

/** Nama untuk ditampilkan; sel nama yang kosong tidak dibiarkan tampil kosong. */
function namaOrang(nama) {
  return nama || `<span class="text-[var(--muted)] font-normal">Nama belum tersedia</span>`;
}

/**
 * Foto orang (kolom foto atau FOTO.aparat); monogram inisial bila tidak ada atau gagal dimuat.
 * @param {object} orang  baris tab aparat
 * @param {string} kelas  kelas ukuran/bentuk, mis. "avatar" atau "potret"
 */
function visualOrang(orang, kelas) {
  const isi = orang.nama ? inisial(orang.nama) : '<i data-lucide="user-round" class="w-1/3 h-1/3"></i>';
  const [utama, ...cadangan] = sumberFoto("aparat", orang, 800);
  // Monogram selalu dirender di belakang foto, jadi bila foto gagal dimuat monogramlah yang tampil.
  const foto = utama
    ? `<img src="${escapeHtml(utama)}" data-cadangan="${escapeHtml(cadangan.join(" "))}" data-tanpa-pengganti alt="${orang.nama}" class="absolute inset-0 w-full h-full object-cover" loading="lazy" onerror="fotoBerikutnya(this)" />`
    : "";
  return `<span class="monogram relative overflow-hidden ${kelas}">${foto}<span aria-hidden="true">${isi}</span></span>`;
}

/** Inisial nama untuk monogram, melewati gelar: "Reymon Stive Londok, S.T" → "RL". */
function inisial(nama) {
  const kata = teksPolos(nama)
    .split(",")[0] // gelar di belakang koma: "Nama, S.STP"
    .trim()
    .split(/\s+/)
    .filter((k) =>
      k &&
      !/^[a-z]{1,4}\.$/i.test(k) && // gelar depan & inisial tengah: Drs. Ir. H. M.
      !/^[a-z]{1,4}(\.[a-z]{1,4})+\.?$/i.test(k) // gelar akademik: S.T S.St M.Kes S.STP
    );
  if (!kata.length) return "—";
  if (kata.length === 1) return kata[0].slice(0, 2).toUpperCase();
  return (kata[0][0] + kata[kata.length - 1][0]).toUpperCase();
}
