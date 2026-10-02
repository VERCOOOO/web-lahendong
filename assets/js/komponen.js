/* ==========================================================================
   Komponen konten bersama — potongan HTML dan format yang dipakai lebih dari
   satu halaman, plus isiDariData() untuk pola baku setiap blok data.
   Nilai dari ambilData() sudah di-escape, jadi aman disisipkan ke HTML.
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Foto statis                                                             */
/* ---------------------------------------------------------------------- */

/* Pada iterasi ini foto TIDAK diatur dari spreadsheet. Letakkan file di img/,
   lalu daftarkan di sini berdasarkan id baris di sheet (mis. W1 = baris W1 di
   tab wisata). Id yang tidak terdaftar memakai gambar pengganti; aparat tanpa
   foto memakai monogram inisial. */
const FOTO = {
  wisata: {
    W1: "wisata-danau-linow.webp",
    W2: "wisata-hutan-pinus.webp",
    W3: "wisata-mahwatu.webp",
    W4: "wisata-toulangkow.webp",
  },
  umkm: {},
  aparat: {},
};

const FOTO_PENGGANTI = "img/placeholder.webp";

/** Path foto untuk satu baris, atau null bila belum terdaftar. */
function fotoUntuk(tab, id) {
  const berkas = FOTO[tab]?.[teksPolos(id)];
  return berkas ? "img/" + berkas : null;
}

/** <img> berfoto statis; kembali ke gambar pengganti bila file tidak ada. */
function gambar(tab, item, kelas = "") {
  return `<img src="${fotoUntuk(tab, item.id) || FOTO_PENGGANTI}" alt="${item.nama}" class="${kelas}" loading="lazy" onerror="this.onerror=null;this.src='${FOTO_PENGGANTI}'" />`;
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
 * @returns {Promise<any|null>} data yang diambil, atau null bila gagal
 */
async function isiDariData(wadah, tab, render, opsi = {}) {
  if (!wadah) return null;
  const { kosong = "Belum ada data untuk ditampilkan.", gagal = "Data belum bisa dimuat saat ini.", setelah } = opsi;

  tampilkanMemuat(wadah);
  let data;
  try {
    data = Array.isArray(tab) ? await Promise.all(tab.map(ambilData)) : await ambilData(tab);
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

/** Nilai dari tab kunci-nilai (profil, statistik), atau "" bila tidak ada. */
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
      <div class="bingkai-foto aspect-[3/2]">${gambar("wisata", item)}</div>
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

/** Aparat diurutkan menurut kolom urutan; yang urutannya kosong diletakkan terakhir. */
function urutkanAparat(data) {
  return data.slice().sort((a, b) => (keAngka(a.urutan) ?? 999) - (keAngka(b.urutan) ?? 999));
}

/** Nama untuk ditampilkan; sel nama yang kosong tidak dibiarkan tampil kosong. */
function namaOrang(nama) {
  return nama || `<span class="text-[var(--muted)] font-normal">Nama belum tersedia</span>`;
}

/**
 * Foto statis orang bila terdaftar di FOTO.aparat, selain itu monogram inisial.
 * @param {object} orang  baris berkolom id & nama
 * @param {string} kelas  kelas ukuran/bentuk, mis. "aspect-[4/3]" atau "w-14 h-14 rounded-full"
 */
function visualOrang(orang, kelas) {
  const foto = orang.id && fotoUntuk("aparat", orang.id);
  if (foto) {
    return `<img src="${foto}" alt="${orang.nama}" class="${kelas} object-cover" loading="lazy" />`;
  }
  const isi = orang.nama ? inisial(orang.nama) : '<i data-lucide="user-round" class="w-1/3 h-1/3"></i>';
  return `<span class="monogram ${kelas}" aria-hidden="true">${isi}</span>`;
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
