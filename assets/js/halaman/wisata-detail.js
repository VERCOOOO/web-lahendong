/* Detail wisata (wisata-detail.html?id=W1): mencari destinasi berdasarkan ?id=.
   Sumber: tab wisata. Foto statis dari FOTO.wisata di komponen.js. */

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
    item = (await ambilData("wisata")).find((row) => teksPolos(row.id) === id);
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
  wadah.innerHTML = tampilanDetail(item);
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
    <section class="kop-halaman">
      <div class="wadah kop-isi grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div class="lg:col-span-6">
          <a href="wisata.html" class="inline-flex items-center gap-2 text-[var(--toska)] hover:text-white text-sm font-semibold">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Daftar wisata
          </a>
          <h1 class="judul-halaman">${item.nama}</h1>
          ${item.ringkas ? `<p class="kop-ringkas">${item.ringkas}</p>` : ""}
        </div>
        <div class="lg:col-span-6">
          <div class="bingkai-foto aspect-[3/2] rounded-[var(--radius)] border-t-4 border-[var(--accent)]">
            ${gambar("wisata", item, "", 1600)}
          </div>
        </div>
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
