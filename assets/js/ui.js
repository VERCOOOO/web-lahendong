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
  { href: "potensi.html", label: "Potensi" },
  { href: "galeri.html", label: "Galeri" },
  { href: "legenda.html", label: "Legenda" },
  { href: "layanan.html", label: "Layanan" },
  { href: "kontak.html", label: "Kontak" },
];

const JAM_LAYANAN = "Senin – Jumat, 08.00 – 15.00 WITA";

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  isiRemah();
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

/* Emblem: gunung berkawah dengan uap panas bumi — ciri khas Lahendong. */
function emblem(ukuran = 36, latar = "var(--primary)") {
  return `
    <svg viewBox="0 0 40 40" width="${ukuran}" height="${ukuran}" aria-hidden="true" class="shrink-0">
      <rect width="40" height="40" rx="9" fill="${latar}"/>
      <path d="M5 31 L15 16.5 H25 L35 31 Z" fill="var(--bg)"/>
      <path d="M15 16.5 Q20 19.5 25 16.5" fill="none" stroke="var(--primary)" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M17.5 13.5 q-1.6 -2.2 0 -4.4 q1.6 -2.2 0 -4.4 M22.5 13.5 q-1.6 -2.2 0 -4.4 q1.6 -2.2 0 -4.4"
            fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/>
      <path d="M8 34.5 H32" stroke="var(--bg)" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>
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
        ${isAktif ? '<span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>' : ""}
      </a>
    `;
  }).join("");

  /* Tanpa ini, header sticky terkurung di dalam #header (setinggi header itu
     sendiri) dan ikut tergulir hilang. Dengan display: contents, header menempel
     relatif terhadap <body>, sedangkan bilah resmi di atasnya tetap tergulir. */
  wadah.style.display = "contents";

  wadah.innerHTML = `
    <a href="#konten-utama" class="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:m-3 focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-white focus:rounded-[4px] text-sm font-semibold">
      Lewati ke konten
    </a>

    <div class="bg-[var(--primary-d)] text-white/80 text-[12.5px]">
      <div class="wadah h-9 flex items-center justify-between gap-4">
        <p class="flex items-center gap-2 min-w-0">
          <i data-lucide="landmark" class="w-3.5 h-3.5 shrink-0 text-white/60"></i>
          <span class="truncate">Situs resmi Kelurahan Lahendong, Kota Tomohon</span>
        </p>
        <div class="hidden md:flex items-center gap-5 shrink-0">
          <span class="flex items-center gap-1.5"><i data-lucide="clock" class="w-3.5 h-3.5 text-white/60"></i>${JAM_LAYANAN}</span>
          <a href="kontak.html" class="flex items-center gap-1.5 hover:text-white"><i data-lucide="phone" class="w-3.5 h-3.5 text-white/60"></i>Hubungi kami</a>
        </div>
      </div>
    </div>

    <header class="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--line)]">
      <div class="wadah h-[72px] flex items-center justify-between gap-6">
        <a href="index.html" class="flex items-center gap-3 shrink-0" aria-label="Beranda Kelurahan Lahendong">
          ${emblem(36)}
          <span class="leading-none">
            <span class="block font-judul text-[17px] text-[var(--ink)]">Kelurahan Lahendong</span>
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
  ];

  wadah.innerHTML = `
    <footer class="bg-[var(--primary)] text-white mt-auto">
      <div class="wadah py-14">
        <div class="grid gap-10 md:grid-cols-12">
          <div class="md:col-span-5">
            <div class="flex items-center gap-3.5">
              ${emblem(44, "rgba(255,255,255,.12)")}
              <div>
                <h3 class="font-judul text-[22px] leading-tight text-white">Kelurahan Lahendong</h3>
                <p class="text-[11px] tracking-[0.08em] uppercase text-white/60 mt-1.5">Kecamatan Tomohon Selatan</p>
              </div>
            </div>
            <p class="text-sm text-white/75 leading-relaxed mt-5 max-w-[320px]">
              Pusat informasi resmi mengenai pemerintahan, data kependudukan, potensi wilayah,
              dan destinasi wisata Kelurahan Lahendong.
            </p>
          </div>

          <div class="md:col-span-3">
            <h4 class="label-kecil text-white/60 mb-4">Tautan Cepat</h4>
            <ul class="space-y-2.5 text-sm">
              ${tautanCepat.map(([href, label]) => `<li><a href="${href}" class="text-white/85 hover:text-white">${label}</a></li>`).join("")}
            </ul>
          </div>

          <div class="md:col-span-4">
            <h4 class="label-kecil text-white/60 mb-4">Kantor Kelurahan</h4>
            <ul class="space-y-3 text-sm text-white/85">
              <li class="flex items-start gap-3">
                <i data-lucide="map-pin" class="w-4 h-4 mt-1 shrink-0 text-white/60"></i>
                <span>Jl. Raya Lahendong, Tomohon Selatan, Kota Tomohon, Sulawesi Utara</span>
              </li>
              <li class="flex items-center gap-3">
                <i data-lucide="phone" class="w-4 h-4 shrink-0 text-white/60"></i>
                <a href="tel:0431654321" class="hover:text-white">0431-654321</a>
              </li>
              <li class="flex items-center gap-3">
                <i data-lucide="clock" class="w-4 h-4 shrink-0 text-white/60"></i>
                <span>${JAM_LAYANAN}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="border-t border-white/15">
        <p class="wadah py-5 text-xs text-white/60">
          &copy; ${new Date().getFullYear()} Pemerintah Kelurahan Lahendong. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  `;
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
  isiStatus(wadah, `
    <div class="flex flex-col items-center justify-center gap-3 py-16 text-center font-normal">
      <i data-lucide="triangle-alert" class="w-5 h-5 text-[var(--danger)]"></i>
      <p class="text-[var(--muted)] text-sm max-w-[320px]">${pesan}</p>
    </div>
  `);
}

function tampilkanKosong(wadah, pesan = "Belum ada data untuk ditampilkan.") {
  isiStatus(wadah, `
    <div class="flex flex-col items-center justify-center gap-3 py-16 text-center font-normal">
      <i data-lucide="inbox" class="w-5 h-5 text-[var(--muted)]"></i>
      <p class="text-[var(--muted)] text-sm max-w-[320px]">${pesan}</p>
    </div>
  `);
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
