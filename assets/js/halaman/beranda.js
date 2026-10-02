/* Beranda (index.html): fakta ringkas, pimpinan, layanan surat, destinasi wisata.
   Sumber: tab statistik & profil (fakta), aparat (pimpinan), layanan, wisata. */

const MAKS_LAYANAN_BERANDA = 6;

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

  isiDariData(document.getElementById("ringkas-layanan"), "layanan", renderRingkasLayanan,
    { kosong: "Daftar layanan surat sedang disiapkan.", gagal: "Daftar layanan belum bisa dimuat saat ini." }
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

/** Surat-surat pertama dari tab layanan; tiap baris menaut ke suratnya di layanan.html. */
function renderRingkasLayanan(data) {
  const tampil = data.slice(0, MAKS_LAYANAN_BERANDA);
  const sisa = data.length - tampil.length;
  return tampil.map((item) => {
    const meta = [item.waktu, item.biaya].map((t) => barisDari(t)[0]).filter(Boolean).join(" · ");
    return `
      <a href="layanan.html#surat-${encodeURIComponent(teksPolos(item.id))}">
        <span class="min-w-0">
          <span class="nama">${item.nama_surat}</span>
          ${meta ? `<span class="meta">${meta}</span>` : ""}
        </span>
        <i data-lucide="arrow-right" class="w-5 h-5"></i>
      </a>`;
  }).join("") + (sisa > 0
    ? `<p class="pt-5 text-[14px] muted-gelap">dan ${sisa} jenis surat lainnya di halaman Layanan.</p>`
    : "");
}
