/* Detail wisata (wisata-detail.html?id=danau-linow): mencari destinasi berdasarkan ?id=.
   Teks dari tab wisata; foto & video dari DESTINASI di komponen.js. */

const adalahVideo = (berkas) => /\.(mp4|webm)$/i.test(berkas || "");

/* Kode lama → kode sekarang, agar tautan yang terlanjur dibagikan tetap membuka destinasinya
   (kode berubah bila nama destinasi di sheet diganti). */
const KODE_LAMA = {
  "objek-wisata-air-panas-belerang-dan-hutan-pinus": "air-panas-belerang-dan-hutan-pinus",
};

document.addEventListener("DOMContentLoaded", async () => {
  const wadah = document.getElementById("konten-detail");
  const dariAlamat = new URLSearchParams(window.location.search).get("id");
  const id = KODE_LAMA[dariAlamat] || dariAlamat;

  if (!id) {
    tampilkanPesan(wadah, "map-pin-off", "Destinasi tidak ditemukan",
      "Tautan yang Anda buka tidak menyertakan destinasi apa pun.");
    return;
  }

  let item;
  try {
    item = wisataTetap(await ambilData("wisata")).find((row) => teksPolos(row.id) === id);
  } catch (err) {
    tampilkanPesan(wadah, "triangle-alert", "Data belum bisa dimuat",
      "Silakan coba lagi beberapa saat lagi.", "text-[var(--danger)]");
    return;
  }

  if (!item) {
    tampilkanPesan(wadah, "map-pin-off", "Destinasi tidak ditemukan",
      "Tautan yang Anda buka tidak valid atau destinasi sudah tidak tersedia.");
    return;
  }

  document.title = teksPolos(item.nama) + " — Kelurahan Lahendong";
  wadah.innerHTML = tampilanDetail(item) + bagianGaleri(item);
  segarkanTampilan();
  pasangVideoLatar(document.querySelector(".kop-wisata video"));
  pasangGaleri();
});

function tampilkanPesan(wadah, ikon, judul, pesan, warnaIkon = "text-[var(--muted)]") {
  wadah.innerHTML = `
    <section class="wadah py-24 md:py-32 text-center">
      <i data-lucide="${ikon}" class="w-10 h-10 ${warnaIkon} mx-auto mb-5"></i>
      <h1 class="judul-halaman">${judul}</h1>
      <p class="text-[var(--muted)] mt-4 mb-8 max-w-[420px] mx-auto">${pesan}</p>
      <a href="wisata.html" class="tombol">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> Kembali ke daftar wisata
      </a>
    </section>
  `;
  segarkanTampilan();
}

function barisInfo(ikon, label, nilai, { terakhir = false } = {}) {
  return `
    <div class="${terakhir ? "pt-5" : "py-5 border-b border-[var(--line)]"} flex gap-4">
      <i data-lucide="${ikon}" class="w-[18px] h-[18px] text-[var(--primary)] shrink-0 mt-1"></i>
      <div>
        <p class="label-kecil">${label}</p>
        <div class="text-[15px] mt-1 leading-[1.6]">${nilai}</div>
      </div>
    </div>
  `;
}

/** Baris informasi di kartu samping; baris yang kosong di sheet tidak ditampilkan. */
function infoKunjungan(item) {
  const info = [
    ["clock", "Jam operasional", berbaris(item.jam)],
    ["ticket", "Tiket masuk", berbaris(item.tiket)],
    ["layout-grid", "Fasilitas", item.fasilitas],
    ["sun", "Waktu terbaik", daftarAtauTeks(item.waktu_terbaik)],
  ].filter(([, , nilai]) => nilai);
  return info
    .map(([ikon, label, nilai], i) => barisInfo(ikon, label, nilai, { terakhir: i === info.length - 1 }))
    .join("");
}

function tampilanDetail(item) {
  const tautanPeta = escapeHtml(urlAman(teksPolos(item.maps_link)));
  return `
    <section class="kop-halaman kop-berfoto kop-wisata">
      ${latarKop(item)}
      <div class="wadah kop-wisata-isi">
        <a href="wisata.html" class="inline-flex items-center gap-2 text-[var(--toska)] hover:text-white text-sm font-semibold">
          <i data-lucide="arrow-left" class="w-4 h-4"></i> Daftar wisata
        </a>
        <h1 class="judul-halaman">${item.nama}</h1>
        ${item.ringkas ? `<p class="kop-ringkas">${item.ringkas}</p>` : ""}
        ${ringkasKunjungan(item)}
      </div>
    </section>

    <section class="wadah seksi">
      <div class="grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div class="lg:col-span-7">
          <span class="eyebrow">Tentang destinasi</span>
          <h2 class="judul-seksi garis-aksen mt-4 mb-8">Kenali ${item.nama}</h2>
          <div class="prosa">${paragraf(item.deskripsi)}</div>

          ${item.cara_kesana ? `
            <h3 class="judul-kartu mt-12 mb-4">Cara menuju lokasi</h3>
            <div class="prosa">${daftarAtauTeks(item.cara_kesana)}</div>` : ""}

          ${item.pengelola ? `
            <h3 class="judul-kartu mt-12 mb-4">Pengelola</h3>
            <div class="prosa">${daftarAtauTeks(item.pengelola)}</div>` : ""}

          ${tautanPeta ? `
            <a href="${tautanPeta}" target="_blank" rel="noopener noreferrer" class="tombol tombol-sekunder mt-7">
              <i data-lucide="map" class="w-4 h-4"></i> Buka di Google Maps
            </a>` : ""}
        </div>

        <aside class="lg:col-span-5">
          <div class="kartu p-6 md:p-7">
            <p class="label-kecil pb-4 border-b border-[var(--line)]">Informasi kunjungan</p>
            ${infoKunjungan(item)}
          </div>
        </aside>
      </div>
    </section>
  `;
}

/* ---------------------------------------------------------------------- */
/* Kop: latar foto atau video                                              */
/* ---------------------------------------------------------------------- */

function latarKop(item) {
  const { kartu, latar } = DESTINASI[teksPolos(item.id)];
  const berkas = typeof latar === "string" ? latar : latar?.berkas;
  // Tanpa latar, atau bila latar gagal dimuat, foto kartu destinasi yang dipakai.
  const cadangan = berkasDestinasi(item, kartu) || FOTO_PENGGANTI;
  const isi = adalahVideo(berkas)
    ? `<video data-src="${berkasDestinasi(item, berkas)}" data-src-hp="${berkasDestinasi(item, latar.hp || berkas)}"
              poster="${berkasDestinasi(item, latar.poster) || cadangan}" muted loop playsinline preload="none" aria-hidden="true"></video>`
    : `<img src="${berkasDestinasi(item, berkas) || cadangan}" alt="" onerror="this.onerror=null; this.src='${cadangan}'" />`;
  return `<div class="latar-kop">${isi}</div>`;
}

/** Baris pertama jam & tiket sebagai info singkat di kop. */
function ringkasKunjungan(item) {
  const info = [["clock", barisDari(item.jam)[0]], ["ticket", barisDari(item.tiket)[0]]].filter(([, teks]) => teks);
  if (!info.length) return "";
  return `<div class="kop-wisata-info">${info.map(([ikon, teks]) =>
    `<span><i data-lucide="${ikon}" class="w-4 h-4"></i>${teks}</span>`).join("")}</div>`;
}

/* ---------------------------------------------------------------------- */
/* Galeri foto & video                                                     */
/* ---------------------------------------------------------------------- */

function bagianGaleri(item) {
  const media = DESTINASI[teksPolos(item.id)].media.filter((m) => m.berkas);
  if (!media.length) return "";
  const jenis = media.some((m) => adalahVideo(m.berkas)) ? "Foto & video" : "Foto";
  return `
    <section class="bg-[var(--surface)] border-y border-[var(--line)]">
      <div class="wadah seksi">
        <div class="reveal mb-8 md:mb-10">
          <span class="eyebrow">${jenis}</span>
          <h2 class="judul-seksi garis-aksen mt-4">Galeri ${/^objek wisata/i.test(teksPolos(item.nama)) ? "" : "wisata "}${item.nama}</h2>
        </div>
        <div class="galeri-media reveal">${media.map((m) => kotakMedia(item, m)).join("")}</div>
      </div>
    </section>
    <dialog class="pembesar-foto" aria-label="Media diperbesar">
      <button type="button" class="tutup" aria-label="Tutup"><i data-lucide="x" class="w-6 h-6"></i></button>
      <button type="button" class="geser sebelumnya" aria-label="Sebelumnya"><i data-lucide="chevron-left" class="w-7 h-7"></i></button>
      <figure>
        <img alt="" />
        <video controls playsinline hidden></video>
        <figcaption></figcaption>
      </figure>
      <button type="button" class="geser berikutnya" aria-label="Berikutnya"><i data-lucide="chevron-right" class="w-7 h-7"></i></button>
    </dialog>
  `;
}

/** Satu kotak galeri. Rasionya dibaca dari berkasnya sendiri (aturRasio), jadi foto potret tidak terpotong. */
function kotakMedia(item, m) {
  const video = adalahVideo(m.berkas);
  const src = berkasDestinasi(item, m.berkas);
  const keterangan = escapeHtml(m.keterangan || "");
  // Kotak video menampilkan posternya; tanpa poster, bingkai awal videonya.
  const tampak = video && !m.poster
    ? `<video src="${src}#t=0.5" muted playsinline preload="metadata" aria-hidden="true" onloadedmetadata="aturRasio(this)" onerror="mediaGagal(this)"></video>`
    : `<img src="${video ? berkasDestinasi(item, m.poster) : src}" alt="${keterangan || item.nama}" loading="lazy" onload="aturRasio(this)" onerror="mediaGagal(this)" />`;
  return `
    <button type="button" class="kotak-media" data-jenis="${video ? "video" : "foto"}" data-src="${src}"
            data-keterangan="${keterangan}" aria-label="${video ? "Putar video" : "Perbesar foto"}">
      ${tampak}
      ${video ? `<span class="tanda-putar" aria-hidden="true"><i data-lucide="play" class="w-5 h-5"></i></span>` : ""}
    </button>`;
}

function aturRasio(el) {
  const [w, h] = el.tagName === "VIDEO" ? [el.videoWidth, el.videoHeight] : [el.naturalWidth, el.naturalHeight];
  if (!w || !h) return;
  el.closest(".kotak-media").style.setProperty("--rasio", (w / h).toFixed(3));
  susunGaleri();
}

/** Media yang gagal dimuat dilepas dari galeri (dan dari pembesar). */
function mediaGagal(el) {
  el.closest(".kotak-media").remove();
  susunGaleri();
}

/**
 * Galeri rata kiri-kanan: kotak dibagi ke beberapa baris yang tingginya mendekati tinggi ideal,
 * lalu tiap baris diregangkan selebar wadah (lebar kotak sebanding rasionya, lihat .baris-media).
 * Tidak ada foto yang terpotong dan tidak ada sel kosong; bila semua lanskap, petaknya seragam per baris.
 * Kotak ke-i masuk baris tempat titik tengahnya jatuh bila total rasio dibagi rata ke semua baris.
 */
function susunGaleri() {
  const wadah = document.querySelector(".galeri-media");
  const kotak = wadah ? [...wadah.querySelectorAll(".kotak-media")] : [];
  if (!kotak.length) {
    wadah?.closest("section").remove();
    return;
  }
  const lebar = wadah.clientWidth;
  if (!lebar) return; // belum tampil (mis. tab di latar belakang); disusun saat lebarnya terbaca
  const tinggiIdeal = lebar < 640 ? 110 : lebar < 1024 ? 200 : 240;
  const rasio = kotak.map((k) => Number(k.style.getPropertyValue("--rasio")) || 1.5);
  const total = rasio.reduce((a, r) => a + r, 0);
  const jumlahBaris = Math.max(1, Math.round((total * tinggiIdeal) / lebar));
  const perBaris = total / jumlahBaris;

  const baris = Array.from({ length: jumlahBaris }, () => {
    const el = document.createElement("div");
    el.className = "baris-media";
    return el;
  });
  let sebelum = 0;
  kotak.forEach((k, i) => {
    baris[Math.min(jumlahBaris - 1, Math.floor((sebelum + rasio[i] / 2) / perBaris))].append(k);
    sebelum += rasio[i];
  });
  wadah.replaceChildren(...baris.filter((b) => b.children.length));
}

/** Galeri: susun baris (ulang saat lebar berubah), lalu pasang pembesar media. */
function pasangGaleri() {
  const wadah = document.querySelector(".galeri-media");
  if (!wadah) return;
  susunGaleri();
  let lebarTerakhir = wadah.clientWidth;
  new ResizeObserver(() => {
    if (wadah.clientWidth === lebarTerakhir) return;
    lebarTerakhir = wadah.clientWidth;
    susunGaleri();
  }).observe(wadah);
  pasangPembesar();
}

/** Klik kotak → diperbesar (video diputar dengan suara & kendali); panah kiri/kanan untuk berpindah;
    Esc atau klik latar untuk menutup. Daftarnya dibaca dari kotak yang tersisa saat itu. */
function pasangPembesar() {
  const dialog = document.querySelector(".pembesar-foto");
  const img = dialog.querySelector("img");
  const video = dialog.querySelector("video");
  const keterangan = dialog.querySelector("figcaption");
  const daftar = () => [...document.querySelectorAll(".kotak-media")];
  let indeks = 0;

  const tampilkan = (i) => {
    const semua = daftar();
    indeks = (i + semua.length) % semua.length;
    const asal = semua[indeks];
    const putarVideo = asal.dataset.jenis === "video";
    video.pause();
    img.hidden = putarVideo;
    video.hidden = !putarVideo;
    if (putarVideo) {
      video.src = asal.dataset.src;
      video.play().catch(() => {});
    } else {
      video.removeAttribute("src");
      img.src = asal.dataset.src;
      img.alt = asal.dataset.keterangan;
    }
    keterangan.textContent = [asal.dataset.keterangan, semua.length > 1 ? `${indeks + 1} / ${semua.length}` : ""].filter(Boolean).join(" · ");
    dialog.querySelectorAll(".geser").forEach((t) => (t.hidden = semua.length < 2));
  };

  // Satu pendengar di wadah: kotak berpindah baris saat galeri disusun ulang.
  document.querySelector(".galeri-media").addEventListener("click", (e) => {
    const kotak = e.target.closest(".kotak-media");
    if (!kotak) return;
    tampilkan(daftar().indexOf(kotak));
    dialog.showModal();
  });
  dialog.addEventListener("close", () => video.pause());
  dialog.querySelector(".tutup").addEventListener("click", () => dialog.close());
  dialog.querySelector(".sebelumnya").addEventListener("click", () => tampilkan(indeks - 1));
  dialog.querySelector(".berikutnya").addEventListener("click", () => tampilkan(indeks + 1));
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", (e) => {
    if (e.target === video && (e.key === "ArrowLeft" || e.key === "ArrowRight")) return; // geser waktu video
    if (e.key === "ArrowLeft") tampilkan(indeks - 1);
    if (e.key === "ArrowRight") tampilkan(indeks + 1);
  });
}
