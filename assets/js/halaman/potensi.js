/* Potensi (potensi.html): kartu UMKM. Panas bumi & pertanian berupa teks statis di HTML. */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("grid-umkm"), "umkm",
    (data) => data.map(kartuUmkm).join(""),
    { kosong: "Belum ada data UMKM.", gagal: "Data UMKM belum bisa dimuat saat ini." }
  );
});

function kartuUmkm(item, i) {
  return `
    <article class="kartu kartu-hover reveal overflow-hidden">
      <div class="bingkai-foto aspect-[4/3]">
        <img src="${urlFoto(item.foto)}" alt="${item.nama}" loading="lazy" onerror="this.src='img/placeholder.webp'" />
      </div>
      <div class="p-5">
        <p class="no-seksi">${nomorUrut(i)}</p>
        <h3 class="judul-kartu mt-2">${item.nama}</h3>
        <p class="text-sm text-[var(--muted)] mt-2 leading-[1.6]">${item.produk}</p>
        <div class="mt-5 pt-4 border-t border-[var(--line)] space-y-2">
          <p class="text-sm text-[var(--muted)] flex items-center gap-2.5">
            <i data-lucide="map-pin" class="w-4 h-4 shrink-0 text-[var(--primary)]"></i> ${item.lingkungan}
          </p>
          <p class="text-sm flex items-center gap-2.5">
            <i data-lucide="phone" class="w-4 h-4 shrink-0 text-[var(--primary)]"></i>
            <a href="${hrefTelepon(item.kontak)}" class="text-[var(--primary)] font-semibold hover:underline">${item.kontak}</a>
          </p>
        </div>
      </div>
    </article>
  `;
}
