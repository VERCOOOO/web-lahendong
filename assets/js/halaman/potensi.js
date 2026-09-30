/* Potensi (potensi.html): daftar potensi & kartu UMKM.
   Sumber: tab potensi & umkm. Foto UMKM statis dari FOTO.umkm di komponen.js. */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("daftar-potensi"), "potensi",
    (data) => data.map(blokPotensi).join(""),
    { kosong: "Data potensi belum tersedia.", gagal: "Data potensi belum bisa dimuat saat ini." }
  );

  isiDariData(document.getElementById("grid-umkm"), "umkm",
    (data) => data.map(kartuUmkm).join(""),
    { kosong: "Data UMKM sedang dihimpun.", gagal: "Data UMKM belum bisa dimuat saat ini." }
  );
});

function blokPotensi(item, i) {
  return `
    <article class="reveal grid md:grid-cols-12 gap-4 md:gap-12 py-8 md:py-10 border-b border-[var(--line)]">
      <div class="md:col-span-4">
        <p class="nomor-urut">${nomorUrut(i)}</p>
        <h3 class="judul-kartu mt-2">${item.judul}</h3>
      </div>
      <div class="md:col-span-8 prosa">${paragraf(item.deskripsi)}</div>
    </article>
  `;
}

function kartuUmkm(item) {
  return `
    <article class="kartu kartu-hover reveal overflow-hidden">
      <div class="bingkai-foto aspect-[3/2]">${gambar("umkm", item)}</div>
      <div class="p-5">
        <h3 class="judul-kartu">${item.nama}</h3>
        <p class="text-sm text-[var(--muted)] mt-2 leading-[1.6]">${item.produk}</p>
        <div class="mt-5 pt-4 border-t border-[var(--line)] space-y-2">
          ${item.lingkungan ? `
            <p class="text-sm text-[var(--muted)] flex items-center gap-2.5">
              <i data-lucide="map-pin" class="w-4 h-4 shrink-0 text-[var(--primary)]"></i> ${item.lingkungan}
            </p>` : ""}
          ${item.kontak ? `
            <p class="text-sm flex items-center gap-2.5">
              <i data-lucide="phone" class="w-4 h-4 shrink-0 text-[var(--primary)]"></i>
              <a href="${hrefTelepon(item.kontak)}" class="text-[var(--primary)] font-semibold hover:underline">${item.kontak}</a>
            </p>` : ""}
        </div>
      </div>
    </article>
  `;
}
