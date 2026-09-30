/* Kontak (kontak.html): narahubung = aparat yang punya nomor + kontak non-aparat. */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("daftar-kontak"), ["aparat", "kontak"],
    ([aparat, kontak]) => gabungNarahubung(aparat, kontak).map(kartuNarahubung).join(""),
    { kosong: "Belum ada data kontak.", gagal: "Data kontak belum bisa dimuat saat ini." }
  );
});

/**
 * Identitas aparat hanya bersumber dari tab "aparat", sehingga Lurah atau
 * Sekretaris cukup diubah di satu tempat.
 *
 * Masa transisi: baris di tab "kontak" yang perannya sama dengan jabatan aparat
 * dianggap orang yang sama. Namanya tetap diambil dari tab aparat; nomornya hanya
 * dipakai bila aparat itu belum punya nomor. Admin diingatkan lewat console.
 */
function gabungNarahubung(aparat, kontak) {
  const kunci = (jabatan) => teksPolos(jabatan).trim().toLowerCase();
  const aparatPerJabatan = new Map(aparat.filter((a) => a.jabatan).map((a) => [kunci(a.jabatan), a]));
  const nomorLama = new Map();
  const bukanAparat = [];

  kontak.forEach((baris) => {
    const pemilik = baris.peran && aparatPerJabatan.get(kunci(baris.peran));
    if (!pemilik) {
      bukanAparat.push(baris);
      return;
    }
    console.warn(`[data] Tab "kontak" baris ${baris.id}: jabatan "${teksPolos(baris.peran)}" sudah ada di tab "aparat". ` +
      "Pindahkan nomornya ke kolom nomor di tab aparat, lalu hapus baris ini.");
    if (!pemilik.nomor) nomorLama.set(pemilik, baris.nomor);
  });

  const dariAparat = urutkanAparat(aparat)
    .map((a) => ({ nama: a.nama, peran: a.jabatan, foto: a.foto, nomor: a.nomor || nomorLama.get(a) || "" }))
    .filter((orang) => orang.nomor);

  return [...dariAparat, ...bukanAparat];
}

function kartuNarahubung(orang) {
  return `
    <div class="kartu kartu-hover reveal p-5 flex items-start gap-4">
      ${visualOrang(orang, "w-12 h-12 rounded-[4px] text-[16px] border border-[var(--line)] shrink-0")}
      <div class="min-w-0">
        <p class="font-judul text-[16px] leading-snug">${namaOrang(orang.nama)}</p>
        <p class="text-[11px] text-[var(--muted)] uppercase tracking-[0.08em] mt-1.5">${orang.peran}</p>
        <a href="${hrefTelepon(orang.nomor)}" class="inline-flex items-center gap-2 text-sm text-[var(--primary)] font-semibold hover:underline mt-3">
          <i data-lucide="phone" class="w-4 h-4"></i> ${orang.nomor}
        </a>
      </div>
    </div>
  `;
}
