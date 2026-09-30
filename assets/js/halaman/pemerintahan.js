/* Pemerintahan (pemerintahan.html): bagan struktur, profil aparat, kepala lingkungan.
   Sumber: tab aparat (kolom atasan membentuk bagan) & lingkungan. */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("bagan"), "aparat",
    (data) => renderBagan(susunPohon(data)),
    { kosong: "Struktur organisasi belum tersedia.", gagal: "Bagan belum bisa dimuat saat ini." }
  );

  isiDariData(document.getElementById("grid-aparat"), "aparat",
    (data) => urutkanAparat(data).map(kartuAparat).join(""),
    { kosong: "Belum ada data aparat kelurahan.", gagal: "Data aparat belum bisa dimuat saat ini." }
  );

  isiDariData(document.getElementById("grid-lingkungan"), "lingkungan",
    (data) => data.map(kartuLingkungan).join(""),
    { kosong: "Belum ada data lingkungan.", gagal: "Data lingkungan belum bisa dimuat saat ini." }
  );
});

/* ---------------------------------------------------------------------- */
/* Bagan                                                                   */
/* ---------------------------------------------------------------------- */

/**
 * Menyusun pohon dari kolom "atasan" (berisi id aparat di atasnya).
 * Aparat tanpa atasan — atau atasannya tidak ditemukan — menjadi puncak bagan.
 */
function susunPohon(aparat) {
  const urut = urutkanAparat(aparat);
  const perId = new Map(urut.map((a) => [teksPolos(a.id), { ...a, bawahan: [] }]));
  const puncak = [];

  perId.forEach((simpul) => {
    const atasan = perId.get(teksPolos(simpul.atasan).trim());
    if (atasan && atasan !== simpul) {
      atasan.bawahan.push(simpul);
    } else {
      if (simpul.atasan) console.warn(`[data] Tab "aparat" baris ${simpul.id}: atasan "${teksPolos(simpul.atasan)}" tidak ditemukan.`);
      puncak.push(simpul);
    }
  });
  return puncak;
}

function renderBagan(puncak, tingkat = 0) {
  if (!puncak.length) return "";
  return `<ul>${puncak.map((s) => `
    <li>
      <div class="bagan-simpul${tingkat === 0 ? " akar" : ""}">
        ${visualOrang(s, "w-11 h-11 rounded-full text-[15px] shrink-0")}
        <div class="min-w-0">
          <p class="label-kecil">${s.jabatan}</p>
          <p class="font-judul text-[17px] leading-tight mt-1">${namaOrang(s.nama)}</p>
        </div>
      </div>
      ${renderBagan(s.bawahan, tingkat + 1)}
    </li>`).join("")}</ul>`;
}

/* ---------------------------------------------------------------------- */
/* Kartu                                                                   */
/* ---------------------------------------------------------------------- */

function kartuAparat(orang) {
  return `
    <div class="kartu reveal overflow-hidden">
      ${visualOrang(orang, "w-full aspect-[4/3] border-b border-[var(--line)] text-[44px]")}
      <div class="p-5">
        <p class="label-kecil">${orang.jabatan}</p>
        <h3 class="font-judul text-[21px] leading-tight mt-2">${namaOrang(orang.nama)}</h3>
      </div>
    </div>
  `;
}

function kartuLingkungan(item) {
  return `
    <div class="kartu reveal p-5">
      <p class="font-judul text-[22px] leading-tight">${item.nama}</p>
      <p class="label-kecil mt-4">Kepala lingkungan</p>
      <p class="text-[15px] mt-1">${item.kepala || '<span class="text-[var(--muted)]">Belum dicantumkan</span>'}</p>
    </div>
  `;
}
