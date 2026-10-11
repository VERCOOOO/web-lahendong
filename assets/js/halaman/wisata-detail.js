/* Detail wisata (wisata-detail.html?id=danau-linow): mencari destinasi berdasarkan ?id=.
   Sumber: tab wisata (teks). Foto & video statis dari MEDIA_DESTINASI di bawah;
   foto kartu di halaman Wisata/Beranda dari FOTO.wisata di komponen.js. */

/* Media tiap destinasi. Berkasnya di img/wisata/<kode>/ (mis. img/wisata/danau-linow/).
   Jenisnya dikenali dari akhiran nama berkas: .mp4 / .webm = video, selain itu foto.
   Cara termudah mengganti: timpa berkas contoh dengan berkas baru bernama sama.

   latar  : latar kop halaman — foto, atau video yang diputar berulang tanpa suara.
            Foto: lanskap 16:9, mis. 1920 × 1080 px. Kosong = foto kartu (FOTO.wisata).
            Video: { berkas: "latar.mp4", poster: "latar.webp" } — poster tampil selagi video dimuat,
            dan menggantikan video bila pengunjung memilih "kurangi gerak" atau menghemat data.
   media  : foto & video untuk bagian "Suasana …", berurutan; yang pertama tampil paling besar.
            Foto 3:2 (mis. 1200 × 800 px). Video: isi poster agar kotaknya langsung bergambar.
            keterangan (opsional) tampil saat media diperbesar. Daftar kosong = bagian tidak tampil.
   Saran video: MP4 (H.264) 720p–1080p, tanpa suara, 10–30 detik, di bawah ±8 MB, kamera diam (tripod). */
const MEDIA_DESTINASI = {
  "danau-linow": {
    latar: "latar.webp",
    media: [
      { berkas: "foto-1.webp", keterangan: "Foto contoh — akan diganti" },
      { berkas: "foto-2.webp", keterangan: "Foto contoh — akan diganti" },
      { berkas: "video-1.mp4", poster: "video-1.webp", keterangan: "Video contoh — akan diganti" },
      { berkas: "foto-3.webp", keterangan: "Foto contoh — akan diganti" },
      { berkas: "foto-4.webp", keterangan: "Foto contoh — akan diganti" },
    ],
  },
  "hutan-pinus-lahendong": {
    latar: "latar.webp",
    media: [
      { berkas: "foto-1.webp", keterangan: "Foto contoh — akan diganti" },
      { berkas: "foto-2.webp", keterangan: "Foto contoh — akan diganti" },
      { berkas: "video-1.mp4", poster: "video-1.webp", keterangan: "Video contoh — akan diganti" },
      { berkas: "foto-3.webp", keterangan: "Foto contoh — akan diganti" },
      { berkas: "foto-4.webp", keterangan: "Foto contoh — akan diganti" },
    ],
  },
  "mah-watu": {
    latar: "latar.webp",
    media: [
      { berkas: "foto-1.webp", keterangan: "Foto contoh — akan diganti" },
      { berkas: "foto-2.webp", keterangan: "Foto contoh — akan diganti" },
      { berkas: "video-1.mp4", poster: "video-1.webp", keterangan: "Video contoh — akan diganti" },
      { berkas: "foto-3.webp", keterangan: "Foto contoh — akan diganti" },
      { berkas: "foto-4.webp", keterangan: "Foto contoh — akan diganti" },
    ],
  },
};

const adalahVideo = (berkas) => /\.(mp4|webm)$/i.test(berkas || "");

/** Alamat berkas media satu destinasi; kosong bila nama berkasnya kosong. */
function alamatMedia(item, berkas) {
  return berkas ? `img/wisata/${encodeURIComponent(teksPolos(item.id))}/${encodeURIComponent(berkas)}` : "";
}

/** Video latar tidak diputar otomatis bila pengunjung memilih "kurangi gerak" atau mode hemat data. */
function bolehPutarOtomatis() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !navigator.connection?.saveData;
}

document.addEventListener("DOMContentLoaded", async () => {
  const wadah = document.getElementById("konten-detail");
  const id = new URLSearchParams(window.location.search).get("id");

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
  wadah.innerHTML = tampilanDetail(item) + bagianMedia(item);
  pasangLatarVideo();
  pasangPembesar();
  segarkanTampilan();
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
    <section class="kop-halaman kop-wisata">
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
  const latar = MEDIA_DESTINASI[teksPolos(item.id)]?.latar;
  const berkas = typeof latar === "string" ? latar : latar?.berkas;
  const poster = alamatMedia(item, latar?.poster);

  let isi;
  if (adalahVideo(berkas)) {
    isi = `
      <video class="latar-video" src="${alamatMedia(item, berkas)}" ${poster ? `poster="${poster}"` : ""}
             muted loop playsinline ${bolehPutarOtomatis() ? "autoplay" : 'preload="none"'} aria-hidden="true"></video>`;
  } else if (berkas) {
    // Bila foto latar gagal dimuat, foto kartu destinasi dipakai sebagai cadangan.
    isi = `<img src="${alamatMedia(item, berkas)}" alt="" onerror="this.onerror=null; this.src='${sumberFoto("wisata", item)[0] || FOTO_PENGGANTI}'" />`;
  } else {
    isi = gambar("wisata", item, "", 1600).replace(/alt="[^"]*"/, 'alt=""');
  }
  return `
    <div class="latar-kop">${isi}</div>
    ${adalahVideo(berkas) ? `
      <button type="button" class="kendali-video" aria-label="Jeda video latar">
        <i data-lucide="pause" class="w-4 h-4"></i><span>Jeda</span>
      </button>` : ""}`;
}

/** Baris pertama jam & tiket sebagai info singkat di kop. */
function ringkasKunjungan(item) {
  const info = [["clock", barisDari(item.jam)[0]], ["ticket", barisDari(item.tiket)[0]]].filter(([, teks]) => teks);
  if (!info.length) return "";
  return `<div class="kop-wisata-info">${info.map(([ikon, teks]) =>
    `<span><i data-lucide="${ikon}" class="w-4 h-4"></i>${teks}</span>`).join("")}</div>`;
}

/** Video latar: diputar otomatis bila boleh; tombol Jeda/Putar selalu tersedia. */
function pasangLatarVideo() {
  const video = document.querySelector(".latar-video");
  const tombol = document.querySelector(".kendali-video");
  if (!video || !tombol) return;

  const perbarui = () => {
    const jalan = !video.paused;
    tombol.setAttribute("aria-label", jalan ? "Jeda video latar" : "Putar video latar");
    tombol.innerHTML = `<i data-lucide="${jalan ? "pause" : "play"}" class="w-4 h-4"></i><span>${jalan ? "Jeda" : "Putar"}</span>`;
    segarkanTampilan();
  };
  video.addEventListener("play", perbarui);
  video.addEventListener("pause", perbarui);
  video.addEventListener("error", () => tombol.remove());
  tombol.addEventListener("click", () => (video.paused ? video.play() : video.pause()));

  // Browser bisa menunda putar otomatis (mis. tab di latar belakang); tombol mengikuti keadaan sebenarnya.
  if (bolehPutarOtomatis()) video.play().catch(perbarui);
  perbarui();
}

/* ---------------------------------------------------------------------- */
/* Foto & video destinasi, pembesar media                                  */
/* ---------------------------------------------------------------------- */

function bagianMedia(item) {
  const media = (MEDIA_DESTINASI[teksPolos(item.id)]?.media || []).filter((m) => m.berkas);
  if (!media.length) return "";
  const adaVideo = media.some((m) => adalahVideo(m.berkas));
  return `
    <section class="bg-[var(--surface)] border-y border-[var(--line)]">
      <div class="wadah seksi">
        <div class="reveal mb-8 md:mb-10">
          <span class="eyebrow">${adaVideo ? "Foto & video" : "Foto"}</span>
          <h2 class="judul-seksi garis-aksen mt-4">Suasana ${item.nama}</h2>
        </div>
        <div class="media-destinasi reveal" data-jumlah="${media.length}">
          ${media.map((m, i) => kotakMedia(item, m, i)).join("")}
        </div>
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

function kotakMedia(item, m, i) {
  const video = adalahVideo(m.berkas);
  const src = alamatMedia(item, m.berkas);
  const alt = escapeHtml(m.keterangan || teksPolos(item.nama));
  // Kotak video menampilkan poster; tanpa poster, bingkai pertama video dipakai.
  const gambarKotak = video && !m.poster
    ? `<video src="${src}#t=0.5" muted playsinline preload="metadata" aria-hidden="true" onerror="this.closest('.kotak-media').remove()"></video>`
    : `<img src="${video ? alamatMedia(item, m.poster) : src}" alt="${alt}" loading="lazy" onerror="this.closest('.kotak-media').remove()" />`;
  return `
    <button type="button" class="kotak-media" data-jenis="${video ? "video" : "foto"}" data-src="${src}"
            data-keterangan="${escapeHtml(m.keterangan || "")}" aria-label="${video ? "Putar video" : "Perbesar foto"} ${i + 1}">
      ${gambarKotak}
      ${video ? `<span class="tanda-putar" aria-hidden="true"><i data-lucide="play" class="w-5 h-5"></i></span>` : ""}
    </button>`;
}

/** Klik kotak → diperbesar (video diputar dengan suara & kendali); panah kiri/kanan untuk berpindah;
    Esc atau klik latar untuk menutup. Daftarnya dibaca dari kotak yang tersisa, jadi media yang gagal
    dimuat (dan sudah dihapus) ikut terlewati. */
function pasangPembesar() {
  const dialog = document.querySelector(".pembesar-foto");
  if (!dialog) return;
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
      img.alt = asal.dataset.keterangan || "";
    }
    keterangan.textContent = [asal.dataset.keterangan, semua.length > 1 ? `${indeks + 1} / ${semua.length}` : ""].filter(Boolean).join(" · ");
    dialog.querySelectorAll(".geser").forEach((t) => (t.hidden = semua.length < 2));
  };

  daftar().forEach((kotak) =>
    kotak.addEventListener("click", () => { tampilkan(daftar().indexOf(kotak)); dialog.showModal(); }));
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
