/* Beranda (index.html): fakta ringkas, pimpinan, destinasi wisata, potensi.
   Sumber: tab statistik & profil (fakta), aparat (pimpinan), wisata, potensi. */

const FAKTA_BERANDA = [
  { tab: "statistik", kunci: "jumlah_penduduk", label: "Jumlah penduduk", satuan: "jiwa" },
  { tab: "statistik", kunci: "jumlah_kk", label: "Kepala keluarga", satuan: "KK" },
  { tab: "statistik", kunci: "jumlah_lingkungan", label: "Lingkungan" },
  { tab: "profil", kunci: "luas_wilayah", label: "Luas wilayah", satuan: "km²" },
];

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("deret-statistik"), ["statistik", "profil"], ([statistik, profil]) => {
    const sumber = { statistik, profil };
    return FAKTA_BERANDA
      .map((f) => ({ ...f, nilai: nilaiKunci(sumber[f.tab], f.kunci) }))
      .filter((f) => f.nilai)
      .map((f) => selStatistik({ ...f, nilai: formatAngka(f.nilai) }))
      .join("");
  });

  // Pelengkap: bila gagal atau kosong, bloknya cukup tidak ditampilkan.
  isiDariData(document.getElementById("pimpinan"), "aparat", renderPimpinan, { kosong: null, gagal: null });

  isiDariData(document.getElementById("grid-wisata"), "wisata",
    (data) => data.slice(0, 4).map((item) => kartuWisata(item)).join(""),
    { gagal: "Daftar destinasi belum bisa dimuat saat ini." }
  );

  isiDariData(document.getElementById("daftar-potensi"), "potensi",
    (data) => data.map(ringkasanPotensi).join(""),
    { kosong: "Data potensi belum tersedia.", gagal: "Data potensi belum bisa dimuat saat ini." }
  );
});

function renderPimpinan(aparat) {
  const [lurah] = urutkanAparat(aparat);
  if (!lurah) return "";
  return `
    <a href="pemerintahan.html" class="kartu kartu-hover flex items-center gap-4 p-4 group">
      ${visualOrang(lurah, "w-14 h-14 rounded-full border border-[var(--line)] text-[18px] shrink-0")}
      <span class="min-w-0">
        <span class="block font-judul text-[20px] leading-tight group-hover:text-[var(--primary)]">${namaOrang(lurah.nama)}</span>
        <span class="block text-[13px] text-[var(--muted)] mt-1">${lurah.jabatan}</span>
      </span>
    </a>
  `;
}

function ringkasanPotensi(item, i) {
  return `
    <div class="flex gap-5 md:gap-8 py-7 border-b border-white/15">
      <span class="nomor-urut shrink-0 mt-0.5">${nomorUrut(i)}</span>
      <div>
        <h3 class="judul-kartu">${item.judul}</h3>
        <p class="muted-gelap mt-2 max-w-[560px]">${kalimatPertama(item.deskripsi)}</p>
      </div>
    </div>
  `;
}
