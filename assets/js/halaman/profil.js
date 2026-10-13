/* Profil (profil.html): sejarah, kondisi wilayah, batas wilayah, visi & misi.
   Sumber: tab sejarah, tab profil (letak, luas/ketinggian/suhu, batas_*, visi, misi) & lingkungan (jumlah baris).
   Koordinat diisi otomatis oleh ui.js (data-profil="koordinat"). */

const GEOGRAFI = [
  { tab: "profil", kunci: "luas_wilayah", label: "Luas wilayah", satuan: "km²" },
  { tab: "profil", kunci: "ketinggian", label: "Ketinggian", satuan: "mdpl" },
  { tab: "profil", kunci: "suhu", label: "Suhu rata-rata", satuan: "°C" },
  { tab: "lingkungan", kunci: "jumlah", label: "Jumlah lingkungan" },
];

const BATAS = [
  ["batas_utara", "Utara"],
  ["batas_selatan", "Selatan"],
  ["batas_timur", "Timur"],
  ["batas_barat", "Barat"],
];

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("sejarah"), "sejarah", (data) => data.map((bab, i) => `
    <article class="bab-sejarah">
      <h3 class="judul-kartu">${bab.judul}</h3>
      <div class="prosa mt-4">${paragraf(bab.isi, { lead: i === 0 })}</div>
    </article>`).join(""),
    { kosong: "Sejarah kelurahan belum tersedia." }
  );

  isiDariData(document.getElementById("letak"), "profil", (profil) => paragraf(nilaiKunci(profil, "letak")),
    { kosong: null, gagal: null });

  isiDariData(document.getElementById("grid-geografi"), ["profil", "lingkungan"], ([profil, lingkungan]) => {
    const nilai = (g) => (g.tab === "lingkungan" ? String(lingkungan.length || "") : nilaiKunci(profil, g.kunci));
    return GEOGRAFI
      .map((g) => ({ ...g, nilai: nilai(g) }))
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

  isiDariData(document.getElementById("visi-misi"), "profil", renderVisiMisi, { kosong: null, gagal: null });
});

function renderVisiMisi(profil) {
  const visi = nilaiKunci(profil, "visi");
  const misi = barisDari(nilaiKunci(profil, "misi"));
  if (!visi && !misi.length) return "";
  return `
    <div class="wadah seksi">
      <div class="grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div class="reveal lg:col-span-5">
          <span class="eyebrow">Visi & Misi</span>
          ${visi ? `
            <p class="label-kecil text-[var(--on-deep-muted)] mt-8">Visi</p>
            <p class="visi">${visi}</p>` : ""}
        </div>
        ${misi.length ? `
          <div class="reveal lg:col-span-7">
            <p class="label-kecil text-[var(--on-deep-muted)]">Misi</p>
            <ol class="daftar-misi">${misi.map((m) => `<li>${m}</li>`).join("")}</ol>
          </div>` : ""}
      </div>
    </div>
  `;
}
