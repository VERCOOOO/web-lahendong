/* Galeri (galeri.html): foto dengan penyaring kategori.
   Sumber: tab galeri (foto bebas, kolom kategori), ditambah foto wisata yang punya foto.
   Penyaring dibuat dari kategori yang benar-benar ada, jadi kategori baru di sheet langsung muncul. */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("grid-galeri"), ["galeri", "wisata"], ([galeri, wisata]) => {
    const item = [
      // Baris tanpa foto tidak dimasukkan: galeri berisi gambar pengganti tidak ada gunanya.
      ...galeri.filter((row) => sumberFoto("galeri", row).length)
        .map((row) => ({ tab: "galeri", data: row, judul: row.judul, kategori: teksPolos(row.kategori) || "Lainnya" })),
      ...wisata.filter((row) => sumberFoto("wisata", row).length)
        .map((row) => ({ tab: "wisata", data: row, judul: row.nama, kategori: "Wisata" })),
    ];
    return item.map(kartuGaleri).join("");
  }, {
    kosong: "Belum ada foto untuk ditampilkan.",
    gagal: "Galeri belum bisa dimuat saat ini.",
    setelah: pasangPenyaring,
    opsional: ["galeri"], // tab galeri belum ada pun, foto wisata tetap tampil
  });
});

function kartuGaleri(item) {
  return `
    <figure data-kategori="${escapeHtml(item.kategori)}" class="kartu kartu-hover reveal overflow-hidden">
      <div class="bingkai-foto aspect-[3/2]">${gambar(item.tab, item.data, "", 800)}</div>
      <figcaption class="p-5 flex items-start justify-between gap-4">
        <p class="font-judul text-[20px] leading-tight">${item.judul}</p>
        <span class="label-kecil whitespace-nowrap mt-1">${escapeHtml(item.kategori)}</span>
      </figcaption>
    </figure>
  `;
}

function pasangPenyaring() {
  const kategori = [...new Set([...document.querySelectorAll("#grid-galeri [data-kategori]")].map((el) => el.dataset.kategori))];
  const wadah = document.getElementById("filter-galeri");
  if (kategori.length > 1) {
    wadah.innerHTML = ["semua", ...kategori].map((k) => `
      <button type="button" data-filter="${escapeHtml(k)}" aria-pressed="${k === "semua"}" class="tombol-filter">${k === "semua" ? "Semua" : escapeHtml(k)}</button>`).join("");
    wadah.addEventListener("click", (e) => {
      const tombol = e.target.closest("[data-filter]");
      if (tombol) terapkanFilter(tombol.dataset.filter);
    });
  }
  terapkanFilter("semua");
}

function terapkanFilter(kategori) {
  let terlihat = 0;
  document.querySelectorAll("#grid-galeri [data-kategori]").forEach((el) => {
    const cocok = kategori === "semua" || el.dataset.kategori === kategori;
    el.classList.toggle("hidden", !cocok);
    if (cocok) terlihat += 1;
  });
  document.querySelectorAll("#filter-galeri .tombol-filter").forEach((tombol) => {
    tombol.setAttribute("aria-pressed", String(tombol.dataset.filter === kategori));
  });
  document.getElementById("jumlah-foto").textContent = terlihat + " foto";
  aturKolom(document.getElementById("grid-galeri"));
}
