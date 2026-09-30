/* Galeri (galeri.html): foto wisata + UMKM dengan penyaring kategori. */

const LABEL_KATEGORI = { wisata: "Wisata", umkm: "UMKM" };

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("grid-galeri"), ["wisata", "umkm"], ([wisata, umkm]) => [
    ...wisata.map((row) => ({ nama: row.nama, foto: row.foto, kategori: "wisata" })),
    ...umkm.map((row) => ({ nama: row.nama, foto: row.foto, kategori: "umkm" })),
  ].map(kartuGaleri).join(""), {
    kosong: "Belum ada foto untuk ditampilkan.",
    gagal: "Galeri belum bisa dimuat saat ini.",
    setelah: () => terapkanFilter("semua"),
  });

  document.querySelectorAll(".tombol-filter").forEach((tombol) => {
    tombol.addEventListener("click", () => terapkanFilter(tombol.dataset.filter));
  });
});

function kartuGaleri(item) {
  return `
    <figure data-kategori="${item.kategori}" class="kartu kartu-hover reveal overflow-hidden">
      <div class="bingkai-foto aspect-[4/3]">
        <img src="${urlFoto(item.foto)}" alt="${item.nama}" loading="lazy" onerror="this.src='img/placeholder.webp'" />
      </div>
      <figcaption class="p-5 flex items-start justify-between gap-4">
        <p class="font-judul text-[17px] leading-snug">${item.nama}</p>
        <span class="label-kecil whitespace-nowrap mt-1">${LABEL_KATEGORI[item.kategori]}</span>
      </figcaption>
    </figure>
  `;
}

function terapkanFilter(kategori) {
  let terlihat = 0;
  document.querySelectorAll("#grid-galeri [data-kategori]").forEach((el) => {
    const cocok = kategori === "semua" || el.dataset.kategori === kategori;
    el.classList.toggle("hidden", !cocok);
    if (cocok) terlihat += 1;
  });
  document.querySelectorAll(".tombol-filter").forEach((tombol) => {
    tombol.setAttribute("aria-pressed", String(tombol.dataset.filter === kategori));
  });
  document.getElementById("jumlah-foto").textContent = terlihat + " foto";
}
