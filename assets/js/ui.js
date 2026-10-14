/* ==========================================================================
   Kerangka situs — header, footer, breadcrumb, animasi muncul, dan status
   memuat/gagal/kosong. Berjalan otomatis di setiap halaman.
   ========================================================================== */

const NAV_LINKS = [
  { href: "index.html", label: "Beranda" },
  { href: "profil.html", label: "Profil" },
  { href: "pemerintahan.html", label: "Pemerintahan" },
  { href: "penduduk.html", label: "Penduduk" },
  { href: "wisata.html", label: "Wisata" },
  { href: "layanan.html", label: "Layanan" },
  { href: "kontak.html", label: "Kontak" },
];

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  isiRemah();
  isiInfoKantor();
  segarkanTampilan();
});

/** Dipanggil setelah konten baru disisipkan: gambar ikon Lucide & aktifkan animasi muncul. */
function segarkanTampilan() {
  if (window.lucide) lucide.createIcons();
  aktifkanReveal();
}

function halamanAktif() {
  return window.location.pathname.split("/").pop() || "index.html";
}

/* ---------------------------------------------------------------------- */
/* Header                                                                  */
/* ---------------------------------------------------------------------- */

/* Logo: bukit, pohon pinus, danau, dan matahari belerang — tanda netral, bukan lambang pemerintahan.
   Sama dengan img/logo/logo.svg (favicon); warna memakai token agar latarnya bisa diganti di footer. */
function emblem(ukuran = 36, latar = "var(--primary)") {
  return `
    <svg viewBox="0 0 40 40" width="${ukuran}" height="${ukuran}" aria-hidden="true" class="shrink-0">
      <rect width="40" height="40" rx="10" fill="${latar}"/>
      <circle cx="27" cy="12.5" r="3.2" fill="var(--accent)"/>
      <path d="M2 31 C9 24 12 19 16 19 C20 19 22 24 26 24 C30 24 33 27 38 31 Z" fill="var(--toska-muda)"/>
      <path d="M12 31 L16 21.5 L20 31 Z M16.8 31 L20.5 23.5 L24.2 31 Z" fill="var(--deep)"/>
      <path d="M7 35 q3.25 -2.2 6.5 0 t6.5 0 t6.5 0 t6.5 0" fill="none" stroke="var(--toska)" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `;
}

function renderHeader() {
  const wadah = document.getElementById("header");
  if (!wadah) return;
  const aktif = halamanAktif();
  const tanda = (link) => (link.href === aktif ? ' aria-current="page"' : "");

  const tautanDesktop = NAV_LINKS
    .map((link) => `<a href="${link.href}" class="nav-tautan"${tanda(link)}>${link.label}</a>`)
    .join("");

  const tautanMobile = NAV_LINKS.map((link) => {
    const isAktif = link.href === aktif;
    return `
      <a href="${link.href}"${tanda(link)} class="flex items-center justify-between gap-4 py-3.5 border-b border-[var(--line)] text-[15px] font-semibold ${isAktif ? "text-[var(--primary)]" : "text-[var(--ink)]"}">
        ${link.label}
        ${isAktif ? '<span class="w-2 h-2 bg-[var(--accent)]"></span>' : ""}
      </a>
    `;
  }).join("");

  /* Tanpa ini, header sticky terkurung di dalam #header (setinggi header itu
     sendiri) dan ikut tergulir hilang. Dengan display: contents, header menempel
     relatif terhadap <body>, sedangkan bilah atas di atasnya tetap tergulir. */
  wadah.style.display = "contents";

  wadah.innerHTML = `
    <a href="#konten-utama" class="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:m-3 focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-white focus:rounded-[4px] text-sm font-semibold">
      Lewati ke konten
    </a>

    <div class="bg-[var(--deep-2)] text-[var(--on-deep-muted)] text-[12.5px]">
      <div class="wadah h-9 flex items-center justify-between gap-4">
        <p class="flex items-center gap-2 min-w-0">
          <i data-lucide="info" class="w-3.5 h-3.5 shrink-0 text-[var(--accent)]"></i>
          <span class="truncate">Situs informasi Kelurahan Lahendong, Kota Tomohon</span>
        </p>
        <div class="hidden md:flex items-center gap-5 shrink-0">
          <span class="flex items-center gap-1.5" data-wadah-profil><i data-lucide="clock" class="w-3.5 h-3.5 text-white/60"></i><span data-profil="jam_layanan" data-profil-format="hari-ini"></span></span>
          <a href="kontak.html" class="flex items-center gap-1.5 hover:text-white"><i data-lucide="phone" class="w-3.5 h-3.5 text-white/60"></i>Hubungi kami</a>
        </div>
      </div>
    </div>

    <header class="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--line)]">
      <div class="wadah h-[72px] flex items-center justify-between gap-6">
        <a href="index.html" class="flex items-center gap-3 shrink-0" aria-label="Beranda Kelurahan Lahendong">
          ${emblem(36)}
          <span class="leading-none">
            <span class="block font-judul text-[20px] text-[var(--ink)]">Kelurahan Lahendong</span>
            <span class="block text-[11px] tracking-[0.08em] uppercase text-[var(--muted)] mt-1">Tomohon Selatan</span>
          </span>
        </a>

        <nav class="hidden lg:flex items-center gap-[14px] xl:gap-6" aria-label="Navigasi utama">
          ${tautanDesktop}
        </nav>

        <button id="tombol-menu" class="lg:hidden -mr-2 p-2 text-[var(--ink)]" aria-label="Buka menu navigasi" aria-expanded="false" aria-controls="menu-mobile">
          <i data-lucide="menu" class="w-6 h-6"></i>
        </button>
      </div>

      <nav id="menu-mobile" class="hidden lg:hidden bg-[var(--surface)] border-t border-[var(--line)] max-h-[calc(100vh-72px)] overflow-y-auto" aria-label="Navigasi utama mobile">
        <div class="px-4 md:px-6 pb-4">${tautanMobile}</div>
      </nav>
    </header>
  `;

  pasangMenuMobile();
}

function pasangMenuMobile() {
  const tombol = document.getElementById("tombol-menu");
  const menu = document.getElementById("menu-mobile");
  if (!tombol || !menu) return;

  tombol.addEventListener("click", () => {
    const akanTerbuka = menu.classList.contains("hidden");
    menu.classList.toggle("hidden", !akanTerbuka);
    tombol.setAttribute("aria-expanded", String(akanTerbuka));
    tombol.setAttribute("aria-label", akanTerbuka ? "Tutup menu navigasi" : "Buka menu navigasi");

    /* Lucide mengganti <i> menjadi <svg>, jadi elemen lama harus ditukar
       dengan <i> baru sebelum createIcons() dipanggil lagi. */
    const ikon = document.createElement("i");
    ikon.setAttribute("data-lucide", akanTerbuka ? "x" : "menu");
    ikon.className = "w-6 h-6";
    tombol.querySelector("i, svg")?.replaceWith(ikon);
    if (window.lucide) lucide.createIcons();
  });
}

/* ---------------------------------------------------------------------- */
/* Footer                                                                  */
/* ---------------------------------------------------------------------- */

function renderFooter() {
  const wadah = document.getElementById("footer");
  if (!wadah) return;

  const tautanCepat = [
    ["wisata.html", "Destinasi Wisata"],
    ["layanan.html", "Layanan Surat"],
    ["penduduk.html", "Data Penduduk"],
    ["pemerintahan.html", "Aparat Kelurahan"],
    ["kkt.html", "Tim KKT Unsrat 149"],
  ];

  wadah.innerHTML = `
    <footer class="kaki-situs">
      <div class="wadah pt-16 pb-14">
        <div class="grid gap-10 md:grid-cols-12">
          <div class="md:col-span-5">
            <div class="flex items-center gap-3.5">
              ${emblem(44, "rgba(255,255,255,.12)")}
              <div>
                <h3 class="font-judul text-[24px] leading-tight text-white">Kelurahan Lahendong</h3>
                <p class="text-[11px] tracking-[0.08em] uppercase text-white/60 mt-1.5">Kecamatan Tomohon Selatan</p>
              </div>
            </div>
            <p class="text-sm text-white/75 leading-relaxed mt-5 max-w-[320px]">
              Informasi seputar pemerintahan, data kependudukan, layanan surat,
              dan destinasi wisata Kelurahan Lahendong.
            </p>
            <p class="text-xs text-white/60 leading-relaxed mt-3 max-w-[320px]">
              Disusun oleh Mahasiswa KKT Unsrat Angkatan 149 sebagai sarana informasi. Untuk keperluan
              administrasi, pastikan kembali ke Kantor Kelurahan Lahendong.
            </p>
            <!-- Halaman KKT tidak ada di menu atas; tombol ini membuatnya mudah ditemukan. -->
            <a href="kkt.html" class="tombol tombol-belerang mt-6">
              <i data-lucide="users" class="w-4 h-4"></i>
              Kenali Tim KKT Unsrat 149
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>

          <div class="md:col-span-3">
            <h4 class="label-kecil text-[var(--toska)] mb-4">Tautan Cepat</h4>
            <ul class="space-y-2.5 text-sm">
              ${tautanCepat.map(([href, label]) => `<li><a href="${href}" class="text-white/85 hover:text-white">${label}</a></li>`).join("")}
            </ul>
          </div>

          <div class="md:col-span-4">
            <h4 class="label-kecil text-[var(--toska)] mb-4">Kantor Kelurahan</h4>
            <ul class="space-y-3 text-sm text-white/85">
              <li class="flex items-start gap-3" data-wadah-profil>
                <i data-lucide="map-pin" class="w-4 h-4 mt-1 shrink-0 text-white/60"></i>
                <span data-profil="alamat_kantor"></span>
              </li>
              <li class="flex items-center gap-3" data-wadah-profil>
                <i data-lucide="phone" class="w-4 h-4 shrink-0 text-white/60"></i>
                <a data-profil="telepon_kantor" data-profil-tautan="tel" class="hover:text-white"></a>
              </li>
              <li class="flex items-start gap-3" data-wadah-profil>
                <i data-lucide="clock" class="w-4 h-4 mt-1 shrink-0 text-white/60"></i>
                <span data-profil="jam_layanan" data-profil-format="jadwal"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="border-t border-white/10">
        <div class="wadah py-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs text-white/60">
          <p>&copy; ${new Date().getFullYear()} Situs Informasi Kelurahan Lahendong</p>
          <!-- Kredit tim penyusun situs; halaman KKT tidak ada di menu atas (lihat tombol & Tautan Cepat). -->
          <a href="kkt.html" class="inline-flex items-center gap-1.5 text-white/75 hover:text-white">
            Dikembangkan oleh Mahasiswa KKT Unsrat Angkatan 149
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>
      </div>
    </footer>
  `;
}

/* ---------------------------------------------------------------------- */
/* Informasi kantor dari tab "profil"                                      */
/* ---------------------------------------------------------------------- */

/**
 * Mengisi setiap elemen [data-profil="kunci"] di halaman mana pun dengan nilai
 * dari tab profil. Bila nilainya kosong (atau tab gagal dimuat), wadah terdekat
 * [data-wadah-profil] disembunyikan — tidak pernah menampilkan isian karangan.
 * data-profil-tautan="tel" / "mailto" menjadikan elemen <a> tautan telepon/email.
 * data-profil-format="jadwal" / "hari-ini" menampilkan jam layanan sebagai daftar / jam hari ini.
 */
async function isiInfoKantor() {
  const elemen = document.querySelectorAll("[data-profil]");
  if (!elemen.length) return;

  let profil = [];
  try {
    profil = await ambilData("profil");
  } catch (err) {
    // Pesan sudah dicatat di console oleh ambilData; elemen cukup disembunyikan.
  }

  elemen.forEach((el) => {
    const nilai = nilaiKunci(profil, el.dataset.profil);
    if (!nilai) {
      (el.closest("[data-wadah-profil]") || el).remove();
      return;
    }
    const format = { jadwal: jadwalHtml, "hari-ini": jamHariIni }[el.dataset.profilFormat];
    el.innerHTML = format ? format(nilai) : nilai;
    if (el.dataset.profilTautan === "tel") el.href = hrefTelepon(nilai);
    if (el.dataset.profilTautan === "mailto") el.href = "mailto:" + teksPolos(nilai);
  });
}

/* Jam layanan ditulis per kelompok hari, dipisah "/" atau baris baru:
   "Senin – Kamis, 08.00 – 16.30 WITA / Jumat, 08.00 – 13.30 WITA / Sabtu – Minggu, Hanya keadaan mendesak".
   Nama hari ada sebelum koma (atau titik dua) pertama; isian tanpa nama hari tampil apa adanya. */
const NAMA_HARI = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];

/** Isi jam_layanan (sudah di-escape) → [{ hari, jam }]. */
function jadwalDari(teks) {
  return teks.split(/\s*\/\s*|\n+/).map((b) => b.trim()).filter(Boolean).map((b) => {
    const [, hari = "", jam = b] = b.match(/^([^,:\d]+?)\s*[,:]\s*(.+)$/) || [];
    return { hari, jam };
  });
}

function jadwalHtml(teks) {
  return `<span class="jadwal">${jadwalDari(teks).map(({ hari, jam }) =>
    `<span class="hari">${hari}</span><span>${jam}</span>`).join("")}</span>`;
}

/** Nomor hari (0 = Minggu) yang dicakup label seperti "Senin – Kamis", "Jumat", "Sabtu – Minggu". */
function hariDalam(label) {
  const teks = teksPolos(label).toLowerCase().replace(/['’]/g, "");
  const hari = [...teks.matchAll(new RegExp(NAMA_HARI.join("|"), "g"))].map((m) => NAMA_HARI.indexOf(m[0]));
  if (hari.length !== 2 || !/[–—-]|s\.?\s?d|sampai/.test(teks)) return hari;
  const cakup = [hari[0]];
  for (let h = hari[0]; h !== hari[1]; ) cakup.push((h = (h + 1) % 7));
  return cakup;
}

/** Bilah atas: jam hari ini menurut waktu Lahendong (WITA); bila hari ini tidak tercantum, baris pertama. */
function jamHariIni(teks) {
  const jadwal = jadwalDari(teks);
  const namaHariIni = new Intl.DateTimeFormat("id-ID", { weekday: "long", timeZone: "Asia/Makassar" })
    .format(new Date()).toLowerCase().replace(/['’]/g, "");
  const hariIni = jadwal.find(({ hari }) => hariDalam(hari).includes(NAMA_HARI.indexOf(namaHariIni)));
  if (hariIni) return `Hari ini: ${hariIni.jam}`;
  return [jadwal[0].hari, jadwal[0].jam].filter(Boolean).join(", ");
}

/* ---------------------------------------------------------------------- */
/* Breadcrumb & animasi muncul                                             */
/* ---------------------------------------------------------------------- */

/** Mengisi setiap <nav data-remah> dengan jejak "Beranda / Halaman ini". */
function isiRemah() {
  const aktif = NAV_LINKS.find((link) => link.href === halamanAktif());
  const label = aktif ? aktif.label : document.title.split(" — ")[0];
  document.querySelectorAll("[data-remah]").forEach((el) => {
    el.innerHTML = `
      <a href="index.html">Beranda</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${label}</span>
    `;
  });
}

function aktifkanReveal() {
  const elemen = document.querySelectorAll(".reveal:not(.reveal-tampil)");
  if (!elemen.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elemen.forEach((el) => el.classList.add("reveal-tampil"));
    return;
  }

  const pengamat = new IntersectionObserver(
    (entri, obs) => {
      entri.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("reveal-tampil");
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  elemen.forEach((el) => pengamat.observe(el));
}

/* ---------------------------------------------------------------------- */
/* Status memuat / gagal / kosong                                          */
/* ---------------------------------------------------------------------- */

function tampilkanMemuat(wadah, pesan = "Memuat data…") {
  isiStatus(wadah, `
    <div class="flex items-center justify-center gap-2.5 py-16 text-[var(--muted)] text-sm font-normal">
      <i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i>
      ${pesan}
    </div>
  `);
}

function tampilkanGagal(wadah, pesan = "Data belum bisa dimuat saat ini. Silakan coba lagi nanti.") {
  isiStatus(wadah, pesanBerikon("triangle-alert", "text-[var(--danger)]", pesan));
}

function tampilkanKosong(wadah, pesan = "Belum ada data untuk ditampilkan.") {
  isiStatus(wadah, pesanBerikon("inbox", "text-[var(--muted)]", pesan));
}

function pesanBerikon(ikon, warnaIkon, pesan) {
  return `
    <div class="flex flex-col items-center justify-center gap-3 py-16 text-center font-normal">
      <i data-lucide="${ikon}" class="w-5 h-5 ${warnaIkon}"></i>
      <p class="text-[var(--muted)] text-sm max-w-[320px]">${pesan}</p>
    </div>
  `;
}

/** Menyisipkan pesan status; di dalam <tbody> pesan dibungkus satu baris selebar tabel. */
function isiStatus(wadah, html) {
  if (!wadah) return;
  if (wadah.tagName === "TBODY") {
    const kolom = wadah.closest("table")?.querySelectorAll("thead th").length || 1;
    wadah.innerHTML = `<tr><td colspan="${kolom}">${html}</td></tr>`;
  } else {
    wadah.innerHTML = `<div class="col-span-full">${html}</div>`;
  }
  if (window.lucide) lucide.createIcons();
}
