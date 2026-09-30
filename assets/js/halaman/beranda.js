/* Beranda (index.html): fakta ringkas, pimpinan kelurahan, destinasi wisata. */

const FAKTA_BERANDA = [
  { kunci: "jumlah_penduduk", label: "Jumlah penduduk", satuan: "jiwa" },
  { kunci: "jumlah_kk", label: "Kepala keluarga", satuan: "KK" },
  { kunci: "jumlah_lingkungan", label: "Lingkungan" },
  { kunci: "luas_wilayah", label: "Luas wilayah", satuan: "km²" },
];

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("deret-statistik"), "statistik", (data) =>
    FAKTA_BERANDA
      .filter((f) => nilaiStatistik(data, f.kunci) !== null)
      .map((f) => selStatistik({ ...f, nilai: formatAngka(nilaiStatistik(data, f.kunci)) }))
      .join("")
  );

  // Pelengkap: bila gagal atau kosong, bloknya cukup tidak ditampilkan.
  isiDariData(document.getElementById("pimpinan"), "aparat", renderPimpinan, { kosong: null, gagal: null });

  isiDariData(document.getElementById("grid-wisata"), "wisata",
    (data) => data.slice(0, 4).map((item, i) => kartuWisata(item, i)).join(""),
    { gagal: "Daftar destinasi belum bisa dimuat saat ini." }
  );
});

function renderPimpinan(aparat) {
  const [lurah] = urutkanAparat(aparat);
  if (!lurah) return "";
  return `
    <p class="label-kecil mb-4">Pimpinan kelurahan</p>
    <a href="pemerintahan.html" class="flex items-center gap-4 pt-5 border-t border-[var(--line)] group">
      ${visualOrang(lurah, "w-14 h-14 rounded-full border border-[var(--line)] text-[18px] shrink-0")}
      <span class="min-w-0">
        <span class="block font-judul text-[17px] leading-snug group-hover:text-[var(--primary)]">${namaOrang(lurah.nama)}</span>
        <span class="block text-[13px] text-[var(--muted)] mt-1">${lurah.jabatan}</span>
      </span>
    </a>
  `;
}
