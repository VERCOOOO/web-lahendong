/* ==========================================================================
   Komponen konten bersama — potongan HTML dan format yang dipakai lebih dari
   satu halaman, plus isiDariData() untuk pola baku setiap blok data.
   Nilai dari ambilData() sudah di-escape, jadi aman disisipkan ke HTML.
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Foto & video — semuanya statis di folder img/, spreadsheet tidak mengatur foto */
/* ---------------------------------------------------------------------- */

/* DESTINASI = daftar destinasi wisata yang TETAP: baris tab wisata yang kodenya tidak ada di sini
   tidak tampil (lihat wisataTetap). Kode = nama destinasi, huruf kecil, selain huruf/angka jadi "-"
   ("Danau Linow" → "danau-linow"). Berkas tiap destinasi ada di img/wisata/<kode>/; cara termudah
   mengganti: timpa berkasnya dengan berkas baru bernama sama.

   kartu : foto kartu di halaman Wisata & Beranda, 3:2 (mis. 1200 × 800 px).
   latar : latar kop halaman detail — foto 16:9 (mis. 1920 × 1080 px), atau video yang diputar
           berulang tanpa suara: { berkas: "latar.mp4", hp: "latar-hp.mp4", poster: "latar.webp" }.
           Ketiga berkas video dibuat sekaligus oleh: python3 tools/siapkan_video.py ASLI.mp4 img/wisata/<kode>/latar
   media : foto & video bagian galeri halaman detail, berurutan. Rasio bebas (lanskap maupun potret).
           Video sebaiknya diberi poster. keterangan (opsional) tampil saat media diperbesar.
   Jenis media dikenali dari akhiran: .mp4 / .webm = video, selain itu foto.
   Saran video: kamera diam atau bergerak pelan, 10–30 detik.
   Menambah destinasi: buat foldernya, daftarkan di sini, tambahkan barisnya di data-contoh.js,
   lalu buat ulang template (python3 tools/buat_template.py) agar muncul di dropdown nama. */
const DESTINASI = {
  "danau-linow": {
    kartu: "kartu.webp",
    latar: "latar.webp",
    media: [
      { berkas: "foto-1.webp" },
      { berkas: "foto-2.webp" },
      { berkas: "video-1.mp4", poster: "video-1.webp" },
      { berkas: "foto-3.webp" },
      { berkas: "foto-4.webp" },
    ],
  },
  "objek-wisata-air-panas-belerang-dan-hutan-pinus": {
    kartu: "kartu.webp",
    latar: "latar.webp",
    media: [
      { berkas: "foto-1.webp" },
      { berkas: "foto-2.webp" },
      { berkas: "video-1.mp4", poster: "video-1.webp" },
      { berkas: "foto-3.webp" },
      { berkas: "foto-4.webp" },
    ],
  },
  "mah-watu": {
    kartu: "kartu.webp",
    latar: { berkas: "latar.mp4", hp: "latar-hp.mp4", poster: "latar.webp" },
    media: [
      { berkas: "foto-1.webp" },
      { berkas: "foto-2.webp" },
      { berkas: "video-1.mp4", poster: "video-1.webp" },
      { berkas: "foto-3.webp" },
      { berkas: "foto-4.webp" },
    ],
  },
};

/* Foto orang menurut kode nama (alamat berkas di dalam img/); dipakai di struktur aparat, Kontak,
   Beranda, dan kartu lingkungan. Contoh: "reymon-stive-londok-s-t": "orang/reymon-londok.webp".
   Foto KKT diisi langsung di DATA_KKT (halaman/kkt.js). Tanpa foto = monogram inisial. */
const FOTO_ORANG = {};

const FOTO_PENGGANTI = "img/placeholder.webp";

/** Hanya destinasi yang terdaftar di DESTINASI — daftar wisata tidak bisa ditambah lewat sheet. */
function wisataTetap(data) {
  return data.filter((w) => DESTINASI[teksPolos(w.id)]);
}

/** Alamat satu berkas milik destinasi, mis. img/wisata/danau-linow/kartu.webp; "" bila kosong. */
function berkasDestinasi(item, berkas) {
  return berkas ? `img/wisata/${teksPolos(item.id)}/${berkas}` : "";
}

/** Foto kartu destinasi; gambar pengganti bila berkasnya tidak ada atau gagal dimuat. */
function fotoKartuWisata(item) {
  const src = berkasDestinasi(item, DESTINASI[teksPolos(item.id)]?.kartu) || FOTO_PENGGANTI;
  return `<img src="${src}" alt="${item.nama}" loading="lazy" onerror="this.onerror=null; this.src='${FOTO_PENGGANTI}'" />`;
}

/* Video latar (hero Beranda, kop detail wisata) — <video data-src data-src-hp poster muted loop>.
   Berkasnya baru diunduh bila boleh diputar: tidak saat pengunjung memilih "kurangi gerak" atau
   mode hemat data (yang tampil posternya), kecuali ia menekan tombol Putar. HP memakai versi -hp. */
function bolehPutarOtomatis() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !navigator.connection?.saveData;
}

/** Pasang video latar dan tombol Jeda/Putar-nya (gerak lebih dari 5 detik wajib bisa dihentikan). */
function pasangVideoLatar(video) {
  if (!video) return;
  const tombol = document.createElement("button");
  tombol.type = "button";
  tombol.className = "kendali-video";
  video.closest("section").append(tombol);

  const putar = () => {
    if (!video.src) video.src = window.matchMedia("(max-width: 767px)").matches ? video.dataset.srcHp : video.dataset.src;
    return video.play();
  };
  const perbarui = () => {
    const jalan = !video.paused;
    tombol.setAttribute("aria-label", jalan ? "Jeda video latar" : "Putar video latar");
    tombol.innerHTML = `<i data-lucide="${jalan ? "pause" : "play"}" class="w-4 h-4"></i><span>${jalan ? "Jeda" : "Putar"}</span>`;
    segarkanTampilan();
  };
  video.addEventListener("play", perbarui);
  video.addEventListener("pause", perbarui);
  video.addEventListener("error", () => tombol.remove()); // poster tetap tampil
  tombol.addEventListener("click", () => (video.paused ? putar().catch(perbarui) : video.pause()));

  // Browser bisa menunda putar otomatis (mis. tab di latar belakang); tombol mengikuti keadaan sebenarnya.
  if (bolehPutarOtomatis()) putar().catch(perbarui);
  perbarui();
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
  const item = [...wadah.children].filter((el) => !el.classList.contains("col-span-full")); // tanpa pesan status
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

/**
 * Tiap baris menjadi <p>; baris berawalan "- ", "* ", atau "• " menjadi butir daftar (berurutan = satu daftar),
 * dan "Label: isi" di awal butir ditebalkan labelnya. Bila lead = true, paragraf pertama memakai gaya .lead.
 */
function paragraf(teks, { lead = false } = {}) {
  let html = "";
  let butir = [];
  const tutupDaftar = () => {
    if (butir.length) html += `<ul class="daftar-baris">${butir.join("")}</ul>`;
    butir = [];
  };
  barisDari(teks).forEach((b) => {
    const isiButir = b.match(/^[-*•]\s+(.+)$/)?.[1];
    if (isiButir) {
      butir.push(`<li>${isiButir.replace(/^([^:]{2,60}:)\s/, "<strong>$1</strong> ")}</li>`);
      return;
    }
    tutupDaftar();
    html += `<p${lead && !html ? ' class="lead"' : ""}>${b}</p>`;
  });
  tutupDaftar();
  return html;
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
      <div class="bingkai-foto aspect-[3/2]">${fotoKartuWisata(item)}</div>
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
 * Foto orang (isian foto di DATA_KKT, atau FOTO_ORANG menurut nama); monogram inisial bila tidak ada.
 * Monogram selalu dirender di belakang foto, jadi bila foto gagal dimuat monogramlah yang tampil.
 * @param {object} orang  { nama, foto? }
 * @param {string} kelas  kelas ukuran/bentuk, mis. "avatar" atau "potret"
 */
function visualOrang(orang, kelas) {
  const isi = orang.nama ? inisial(orang.nama) : '<i data-lucide="user-round" class="w-1/3 h-1/3"></i>';
  const berkas = orang.foto || FOTO_ORANG[kodeDari(orang.nama)];
  const foto = berkas
    ? `<img src="img/${berkas}" alt="${orang.nama}" class="absolute inset-0 w-full h-full object-cover" loading="lazy" onerror="this.remove()" />`
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
