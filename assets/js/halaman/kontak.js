/* Kontak (kontak.html): narahubung dikelompokkan menjadi darurat, aparat, dan layanan umum.
   Sumber: tab kontak (kolom kategori) & aparat (yang nomornya diisi).
   Informasi kantor di kolom kiri diisi otomatis oleh ui.js dari tab profil. */

/* Ikon untuk nomor darurat yang dikenal; nomor lain memakai ikon telepon. */
const IKON_DARURAT = { 110: "shield", 112: "siren", 113: "flame", 118: "ambulance", 119: "ambulance" };

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("daftar-narahubung"), ["aparat", "kontak"], ([aparat, kontak]) => {
    const { darurat, dariAparat, umum } = kelompokkanNarahubung(aparat, kontak);
    return [
      grup("Darurat", darurat.map(kartuDarurat), 3),
      grup("Aparat kelurahan", dariAparat.map(kartuNarahubung)),
      grup("Layanan umum", umum.map(kartuNarahubung)),
    ].join("");
  }, { kosong: "Belum ada data kontak.", gagal: "Data kontak belum bisa dimuat saat ini." });
});

/**
 * Identitas aparat hanya bersumber dari tab "aparat", sehingga Lurah atau
 * Sekretaris cukup diubah di satu tempat. Baris tanpa nomor tidak ditampilkan.
 *
 * Baris "umum" di tab kontak yang perannya sama dengan jabatan aparat dianggap
 * orang yang sama: namanya diambil dari tab aparat, nomornya hanya dipakai bila
 * aparat itu belum punya nomor. Admin diingatkan lewat console.
 */
function kelompokkanNarahubung(aparat, kontak) {
  const kunci = (teks) => teksPolos(teks).trim().toLowerCase();
  const aparatPerJabatan = new Map(aparat.filter((a) => a.jabatan).map((a) => [kunci(a.jabatan), a]));
  const nomorLama = new Map();
  const darurat = [];
  const umum = [];

  kontak.forEach((baris) => {
    if (kunci(baris.kategori) === "darurat") {
      darurat.push(baris);
      return;
    }
    const pemilik = baris.peran && aparatPerJabatan.get(kunci(baris.peran));
    if (!pemilik) {
      umum.push(baris);
      return;
    }
    console.warn(`[data] Tab "kontak" baris "${teksPolos(baris.nama)}": jabatan "${teksPolos(baris.peran)}" sudah ada di tab "aparat". ` +
      "Pindahkan nomornya ke kolom nomor di tab aparat, lalu hapus baris ini.");
    if (!pemilik.nomor) nomorLama.set(pemilik, baris.nomor);
  });

  const dariAparat = aparat
    .map((a) => ({ id: a.id, nama: a.nama, peran: a.jabatan, nomor: a.nomor || nomorLama.get(a) || "" }));

  const adaNomor = (orang) => orang.nomor;
  return { darurat: darurat.filter(adaNomor), dariAparat: dariAparat.filter(adaNomor), umum: umum.filter(adaNomor) };
}

/** Satu kelompok berjudul; kelompok tanpa isi tidak ditampilkan. maks = kolom terbanyak di desktop. */
function grup(judul, kartu, maks = 2) {
  if (!kartu.length) return "";
  return `
    <section>
      <h3 class="label-kecil mb-4">${judul}</h3>
      <div class="grid-adaptif rata-kiri" data-maks="${maks}">${kartu.join("")}</div>
    </section>
  `;
}

function kartuDarurat(item) {
  const ikon = IKON_DARURAT[teksPolos(item.nomor).trim()] || "phone";
  return `
    <a href="${hrefTelepon(item.nomor)}" class="kartu kartu-hover p-5 flex items-center gap-4">
      <span class="w-11 h-11 rounded-full bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center shrink-0">
        <i data-lucide="${ikon}" class="w-5 h-5 text-[var(--danger)]"></i>
      </span>
      <span class="min-w-0">
        <span class="block font-judul text-[26px] leading-none text-[var(--ink)]">${item.nomor}</span>
        <span class="block text-sm font-semibold mt-1.5">${item.nama}</span>
        <span class="block text-[12px] text-[var(--muted)]">${item.peran}</span>
      </span>
    </a>
  `;
}

function kartuNarahubung(orang) {
  return `
    <div class="kartu kartu-hover p-5 flex items-start gap-4">
      ${visualOrang(orang, "w-12 h-12 rounded-[4px] text-[16px] border border-[var(--line)] shrink-0")}
      <div class="min-w-0">
        <p class="font-judul text-[19px] leading-tight">${namaOrang(orang.nama)}</p>
        <p class="text-[11px] text-[var(--muted)] uppercase tracking-[0.08em] mt-1.5">${orang.peran}</p>
        <a href="${hrefTelepon(orang.nomor)}" class="inline-flex items-center gap-2 text-sm text-[var(--primary)] font-semibold hover:underline mt-3">
          <i data-lucide="phone" class="w-4 h-4"></i> ${orang.nomor}
        </a>
      </div>
    </div>
  `;
}
