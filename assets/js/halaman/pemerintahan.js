/* Pemerintahan (pemerintahan.html): struktur aparat & tabel delapan lingkungan. */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("grid-aparat"), "aparat",
    (data) => urutkanAparat(data).map(kartuAparat).join(""),
    { kosong: "Belum ada data aparat kelurahan.", gagal: "Data aparat belum bisa dimuat saat ini." }
  );

  isiDariData(document.getElementById("tabel-lingkungan"), "lingkungan",
    (data) => data.map(barisLingkungan).join(""),
    { kosong: "Belum ada data lingkungan.", gagal: "Data lingkungan belum bisa dimuat saat ini." }
  );
});

function kartuAparat(orang) {
  return `
    <div class="kartu reveal overflow-hidden">
      ${visualOrang(orang, "w-full aspect-[4/3] border-b border-[var(--line)]")}
      <div class="p-5">
        <p class="no-seksi">${String(orang.urutan).padStart(2, "0")}</p>
        <h3 class="font-judul text-[17px] leading-snug mt-2">${namaOrang(orang.nama)}</h3>
        <p class="text-[13px] text-[var(--muted)] mt-1.5 leading-snug">${orang.jabatan}</p>
      </div>
    </div>
  `;
}

function barisLingkungan(item) {
  return `
    <tr>
      <td>${item.nama}</td>
      <td>${item.kepala}</td>
      <td class="num">${formatAngka(item.jumlah_kk)}</td>
      <td class="num">${formatAngka(item.jumlah_jiwa)}</td>
      <td class="num">${formatAngka(item.laki)}</td>
      <td class="num">${formatAngka(item.perempuan)}</td>
    </tr>
  `;
}
