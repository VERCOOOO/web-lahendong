/* Wisata (wisata.html): daftar seluruh destinasi. */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("grid-wisata"), "wisata",
    (data) => data.map((item, i) => kartuWisata(item, i, { denganTautan: true })).join(""),
    { kosong: "Belum ada data destinasi wisata.", gagal: "Daftar destinasi belum bisa dimuat saat ini." }
  );
});
