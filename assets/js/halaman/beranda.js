/* Beranda (index.html): fakta ringkas, pimpinan, layanan surat, destinasi wisata.
   Sumber: tab lingkungan & profil (fakta), aparat (pimpinan), layanan, wisata. */

const MAKS_LAYANAN_BERANDA = 6;

/* tab "lingkungan" = angka hasil ringkasPenduduk(); tab "profil" = nilai kunci di tab profil. */
const FAKTA_BERANDA = [
  { tab: "lingkungan", kunci: "jiwa", label: "Jumlah penduduk", satuan: "jiwa" },
  { tab: "lingkungan", kunci: "kk", label: "Kepala keluarga", satuan: "KK" },
  { tab: "lingkungan", kunci: "lingkungan", label: "Lingkungan" },
  { tab: "profil", kunci: "luas_wilayah", label: "Luas wilayah", satuan: "km²" },
];

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("deret-statistik"), ["lingkungan", "profil"], ([lingkungan, profil]) => {
    const ringkas = ringkasPenduduk(lingkungan);
    return FAKTA_BERANDA
      .map((f) => ({ ...f, nilai: f.tab === "profil" ? nilaiKunci(profil, f.kunci) : (ringkas[f.kunci] > 0 ? String(ringkas[f.kunci]) : "") }))
      .filter((f) => f.nilai)
      .map((f) => selStatistik({ ...f, nilai: formatAngka(f.nilai) }))
      .join("");
  });

  pasangFotoHero();

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

/**
 * Kunci foto_hero di tab profil — atau berkas beranda/hero.jpg di folder foto Drive — mengganti
 * ilustrasi hero dengan foto. Foto asli butuh lapisan
 * gelap agar judul tetap terbaca, jadi hero diberi kelas .hero-foto setelah fotonya termuat.
 * Bila foto gagal dimuat, ilustrasi bawaan tetap dipakai.
 */
async function pasangFotoHero() {
  let profil = [];
  try {
    profil = await ambilData("profil");
  } catch (err) {
    return;
  }
  // Tautan di tab profil (foto_hero) didahulukan; bila kosong, berkas "hero" di folder Drive beranda/.
  await siapkanFotoDrive();
  const drive = indeksFotoDrive.get("beranda")?.get("hero");
  const url = urlFoto(nilaiKunci(profil, "foto_hero"), 1920) || (drive ? urlDrive(teksPolos(drive.id_drive), 1920) : "");
  if (!url) return;
  const uji = new Image();
  uji.onload = () => {
    const hero = document.getElementById("hero");
    hero.querySelector(".hero-gambar").src = url;
    hero.classList.add("hero-foto");
  };
  uji.src = url;
}

function renderPimpinan(aparat) {
  // Pimpinan = aparat pertama yang kolom atasannya kosong.
  const lurah = aparat.find((a) => !a.atasan) || aparat[0];
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
      <a href="layanan.html#${encodeURIComponent(teksPolos(item.id))}">
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
