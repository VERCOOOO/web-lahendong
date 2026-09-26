/* ==========================================================================
   Komponen bersama: header, footer, menu mobile, reveal-on-scroll.
   Dipanggil di setiap halaman lewat renderHeader() / renderFooter().
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

/* Tanda kontur — identitas visual yang senada dengan citra peta topografi. */
const TANDA_KONTUR = `
  <svg viewBox="0 0 32 32" width="30" height="30" fill="none" aria-hidden="true" class="shrink-0">
    <circle cx="16" cy="16" r="14.25" stroke="var(--line)" stroke-width="1.5"/>
    <ellipse cx="16" cy="17" rx="10" ry="7.5" stroke="var(--primary)" stroke-width="1.5" opacity=".45"/>
    <ellipse cx="16" cy="16" rx="6.5" ry="4.75" stroke="var(--primary)" stroke-width="1.5" opacity=".7"/>
    <ellipse cx="16" cy="15" rx="3" ry="2.25" fill="var(--primary)"/>
    <path d="M3 22.5c4-1.6 7.2-1.6 10.5 0" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
`;

function halamanAktif() {
  const path = window.location.pathname.split("/").pop();
  return path === "" || path === undefined ? "index.html" : path;
}

function renderHeader() {
  const container = document.getElementById("header");
  if (!container) return;
  const aktif = halamanAktif();

  const tautanDesktop = NAV_LINKS.map((link) => {
    const current = link.href === aktif ? ' aria-current="page"' : "";
    return `<a href="${link.href}" class="nav-tautan"${current}>${link.label}</a>`;
  }).join("");

  const tautanMobile = NAV_LINKS.map((link) => {
    const isAktif = link.href === aktif;
    const current = isAktif ? ' aria-current="page"' : "";
    const kelas = isAktif ? "text-[var(--primary)]" : "text-[var(--ink)]";
    return `
      <a href="${link.href}"${current} class="flex items-center justify-between gap-4 py-3.5 border-b border-[var(--line)] text-[15px] font-semibold ${kelas}">
        ${link.label}
        ${isAktif ? '<span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>' : ""}
      </a>
    `;
  }).join("");

  container.innerHTML = `
    <a href="#konten-utama" class="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:m-3 focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-white focus:rounded-[4px] text-sm font-semibold">
      Lewati ke konten
    </a>
    <header class="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--line)]">
      <div class="max-w-[var(--konten)] mx-auto h-[72px] px-4 md:px-6 flex items-center justify-between gap-6">
        <a href="index.html" class="flex items-center gap-3 shrink-0" aria-label="Beranda Kelurahan Lahendong">
          ${TANDA_KONTUR}
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

  const tombolMenu = document.getElementById("tombol-menu");
  const menuMobile = document.getElementById("menu-mobile");
  if (tombolMenu && menuMobile) {
    tombolMenu.addEventListener("click", () => {
      const sedangTerbuka = !menuMobile.classList.contains("hidden");
      menuMobile.classList.toggle("hidden");
      tombolMenu.setAttribute("aria-expanded", String(!sedangTerbuka));
      tombolMenu.setAttribute("aria-label", sedangTerbuka ? "Buka menu navigasi" : "Tutup menu navigasi");

      /* Lucide mengganti <i> menjadi <svg>, jadi elemen lama harus ditukar
         dengan <i> baru sebelum createIcons() dipanggil lagi. */
      const ikonLama = tombolMenu.querySelector("i, svg");
      if (ikonLama) {
        const ikonBaru = document.createElement("i");
        ikonBaru.setAttribute("data-lucide", sedangTerbuka ? "menu" : "x");
        ikonBaru.className = "w-6 h-6";
        ikonLama.replaceWith(ikonBaru);
      }
      if (window.lucide) lucide.createIcons();
    });
  }

  if (window.lucide) lucide.createIcons();
}

function renderFooter() {
  const container = document.getElementById("footer");
  if (!container) return;

  container.innerHTML = `
    <footer class="bg-[var(--primary)] text-white mt-auto">
      <div class="max-w-[var(--konten)] mx-auto px-4 md:px-6 py-14">
        <div class="grid gap-10 md:grid-cols-12">
          <div class="md:col-span-5">
            <h3 class="font-judul text-[22px] text-white">Kelurahan Lahendong</h3>
            <p class="text-[11px] tracking-[0.08em] uppercase text-white/60 mt-2">Kecamatan Tomohon Selatan</p>
            <p class="text-sm text-white/75 leading-relaxed mt-5 max-w-[320px]">
              Pusat informasi resmi mengenai pemerintahan, data kependudukan, potensi wilayah,
              dan destinasi wisata Kelurahan Lahendong.
            </p>
          </div>

          <div class="md:col-span-3">
            <h4 class="text-[11px] font-semibold tracking-[0.08em] uppercase text-white/60 mb-4">Tautan Cepat</h4>
            <ul class="space-y-2.5 text-sm">
              <li><a href="wisata.html" class="text-white/85 hover:text-white">Destinasi Wisata</a></li>
              <li><a href="layanan.html" class="text-white/85 hover:text-white">Layanan Surat</a></li>
              <li><a href="penduduk.html" class="text-white/85 hover:text-white">Data Penduduk</a></li>
              <li><a href="pemerintahan.html" class="text-white/85 hover:text-white">Aparat Kelurahan</a></li>
            </ul>
          </div>

          <div class="md:col-span-4">
            <h4 class="text-[11px] font-semibold tracking-[0.08em] uppercase text-white/60 mb-4">Kantor Kelurahan</h4>
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
                <span>Senin – Jumat, 08.00 – 15.00 WITA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="border-t border-white/15">
        <p class="max-w-[var(--konten)] mx-auto px-4 md:px-6 py-5 text-xs text-white/60">
          &copy; ${new Date().getFullYear()} Pemerintah Kelurahan Lahendong. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  `;

  if (window.lucide) lucide.createIcons();
}

/* ---------------------------------------------------------------------- */
/* Utilitas tampilan                                                       */
/* ---------------------------------------------------------------------- */

/** Inisial nama untuk monogram pengganti foto. */
function inisial(nama) {
  const kata = String(nama || "")
    .replace(/\b(Drs|S\.STP|S\.Sos|S\.E|S\.H|M\.Si|Ir)\b\.?/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!kata.length) return "—";
  if (kata.length === 1) return kata[0].slice(0, 2).toUpperCase();
  return (kata[0][0] + kata[kata.length - 1][0]).toUpperCase();
}

/** Format angka gaya Indonesia: 3241 -> "3.241", 7.85 -> "7,85". */
function formatAngka(nilai) {
  const n = Number(String(nilai).replace(",", "."));
  if (!isFinite(n) || String(nilai).trim() === "") return nilai;
  return n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

/** Nomor urut dua digit untuk penanda seksi/kartu. */
function nomorUrut(i) {
  return String(i + 1).padStart(2, "0");
}

function aktifkanReveal() {
  const elemen = document.querySelectorAll(".reveal:not(.reveal-tampil)");
  if (!elemen.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    elemen.forEach((el) => el.classList.add("reveal-tampil"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-tampil");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elemen.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------- */
/* Status memuat / gagal — dipakai bersama seluruh halaman                */
/* ---------------------------------------------------------------------- */

function tampilkanMemuat(container, pesan = "Memuat data…") {
  if (!container) return;
  container.innerHTML = `
    <div class="col-span-full flex items-center justify-center gap-2.5 py-16 text-[var(--muted)] text-sm">
      <i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i>
      ${pesan}
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

function tampilkanGagal(container, pesan = "Data belum bisa dimuat saat ini. Silakan coba lagi nanti.") {
  if (!container) return;
  container.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center gap-3 py-16 text-center">
      <i data-lucide="triangle-alert" class="w-5 h-5 text-[var(--danger)]"></i>
      <p class="text-[var(--muted)] text-sm max-w-[320px]">${pesan}</p>
    </div>
  `;
  if (window.lucide) lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
