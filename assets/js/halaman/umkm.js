/* UMKM (umkm.html): kartu usaha warga.
   Sumber: tab umkm. Foto UMKM statis dari FOTO.umkm di komponen.js. */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("grid-umkm"), "umkm",
    (data) => data.map(kartuUmkm).join(""),
    { kosong: "Data UMKM sedang dihimpun oleh kelurahan.", gagal: "Data UMKM belum bisa dimuat saat ini." }
  );
});

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
