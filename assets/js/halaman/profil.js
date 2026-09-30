/* Profil (profil.html): sejarah, geografi, batas wilayah.
   Sumber: tab profil (sejarah, luas/ketinggian/suhu, batas_*) & statistik (jumlah lingkungan). */

const GEOGRAFI = [
  { tab: "profil", kunci: "luas_wilayah", label: "Luas wilayah", satuan: "km²" },
  { tab: "profil", kunci: "ketinggian", label: "Ketinggian", satuan: "mdpl" },
  { tab: "profil", kunci: "suhu", label: "Suhu rata-rata", satuan: "°C" },
  { tab: "statistik", kunci: "jumlah_lingkungan", label: "Jumlah lingkungan" },
];

const BATAS = [
  ["batas_utara", "Utara"],
  ["batas_selatan", "Selatan"],
  ["batas_timur", "Timur"],
  ["batas_barat", "Barat"],
];

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("sejarah"), "profil",
    (profil) => paragraf(nilaiKunci(profil, "sejarah"), { lead: true }),
    { kosong: "Sejarah kelurahan belum tersedia." }
  );

  isiDariData(document.getElementById("grid-geografi"), ["profil", "statistik"], ([profil, statistik]) => {
    const sumber = { profil, statistik };
    return GEOGRAFI
      .map((g) => ({ ...g, nilai: nilaiKunci(sumber[g.tab], g.kunci) }))
      .filter((g) => g.nilai)
      .map((g) => selStatistik({ ...g, nilai: formatAngka(g.nilai) }))
      .join("");
  }, { kosong: "Data geografis belum tersedia.", gagal: "Data geografis belum bisa dimuat saat ini." });

  isiDariData(document.getElementById("tabel-batas"), "profil", (profil) =>
    BATAS
      .filter(([kunci]) => nilaiKunci(profil, kunci))
      .map(([kunci, arah]) => `<tr><td>${arah}</td><td>${nilaiKunci(profil, kunci)}</td></tr>`)
      .join(""),
    { kosong: "Batas wilayah belum tersedia." }
  );
});
