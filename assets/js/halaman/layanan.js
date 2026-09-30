/* Layanan (layanan.html): prosedur surat dalam bentuk accordion (<details>). */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("daftar-layanan"), "layanan",
    (data) => data.map(itemLayanan).join(""),
    { kosong: "Belum ada data layanan surat.", gagal: "Data layanan belum bisa dimuat saat ini." }
  );
});

function itemLayanan(item, i) {
  return `
    <details class="kartu reveal overflow-hidden">
      <summary class="flex items-center gap-4 px-5 py-4">
        <span class="nomor-urut text-[22px] shrink-0">${nomorUrut(i)}</span>
        <span class="font-judul text-[20px] md:text-[23px] leading-tight flex-1">${item.nama_surat}</span>
        <i data-lucide="chevron-down" class="chevron-ikon w-5 h-5 text-[var(--primary)] shrink-0"></i>
      </summary>
      <div class="px-5 pb-5 pt-1">
        <div class="border-t border-[var(--line)] pt-5 space-y-5">
          ${blokInfo("Syarat", item.syarat)}
          ${blokInfo("Alur pengajuan", item.alur)}
          <div class="grid grid-cols-2 gap-6 pt-1">
            ${blokInfo("Estimasi waktu", item.waktu)}
            ${blokInfo("Biaya", item.biaya, { aksen: true })}
          </div>
        </div>
      </div>
    </details>
  `;
}

function blokInfo(label, isi, { aksen = false } = {}) {
  return `
    <div>
      <p class="label-kecil mb-1.5">${label}</p>
      <p class="text-[15px] ${aksen ? "text-[var(--primary-d)] font-semibold" : "text-[var(--muted)]"} leading-[1.6]">${isi}</p>
    </div>
  `;
}
