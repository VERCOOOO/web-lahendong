/* Pemerintahan (pemerintahan.html): struktur aparat & lingkungan.
   Sumber: tab aparat (kolom atasan membentuk struktur) & lingkungan. */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("struktur"), "aparat",
    (data) => susunPohon(data).map(renderStruktur).join(""),
    { kosong: "Struktur organisasi belum tersedia.", gagal: "Struktur organisasi belum bisa dimuat saat ini." }
  );

  isiDariData(document.getElementById("grid-lingkungan"), "lingkungan", renderLingkungan,
    { kosong: "Belum ada data lingkungan.", gagal: "Data lingkungan belum bisa dimuat saat ini." }
  );
});

/* ---------------------------------------------------------------------- */
/* Struktur                                                                */
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

/** Satu puncak (biasanya Lurah): panel pimpinan, lalu bawahan langsungnya sebagai cabang. */
function renderStruktur(pimpinan) {
  const cabang = pimpinan.bawahan;
  // Garis penyambung hanya digambar bila semua cabang muat dalam satu baris (maks. 4).
  const tersambung = cabang.length && cabang.length <= 4 ? " tersambung" : "";
  return `
    <div class="struktur reveal">
      <article class="pimpinan">
        ${visualOrang(pimpinan, "potret")}
        <div class="min-w-0">
          <p class="label-kecil text-[var(--toska)]">${pimpinan.jabatan}</p>
          <h3 class="nama-pimpinan">${namaOrang(pimpinan.nama)}</h3>
          ${cabang.length ? `
            <p class="label-kecil text-[var(--on-deep-muted)] mt-6">Membawahi</p>
            <div class="membawahi">${cabang.map((c) => `<span>${c.jabatan}</span>`).join("")}</div>` : ""}
        </div>
      </article>
      ${cabang.length ? `
        <div class="cabang-struktur grid-adaptif${tersambung}" data-maks="4">
          ${cabang.map(kartuCabang).join("")}
        </div>` : ""}
    </div>
  `;
}

function kartuCabang(orang) {
  return `
    <div class="cabang">
      <article class="kartu kartu-cabang p-4 md:p-5">
        ${barisOrang(orang)}
        ${daftarStaf(orang.bawahan)}
      </article>
    </div>
  `;
}

/** Staf di bawah kepala cabang; tingkat yang lebih dalam menjorok dengan garis di kiri. */
function daftarStaf(staf) {
  if (!staf.length) return "";
  return `<ul class="staf">${staf.map((s) => `<li>${barisOrang(s)}${daftarStaf(s.bawahan)}</li>`).join("")}</ul>`;
}

function barisOrang(orang) {
  return `
    <div class="orang">
      ${visualOrang(orang, "avatar")}
      <div class="min-w-0">
        <p class="label-kecil">${orang.jabatan}</p>
        <p class="nama-orang mt-1">${namaOrang(orang.nama)}</p>
      </div>
    </div>
  `;
}

/* ---------------------------------------------------------------------- */
/* Lingkungan                                                              */
/* ---------------------------------------------------------------------- */

/* Batang kecil di tiap kartu = jumlah jiwa dibanding lingkungan terbesar. */
function renderLingkungan(data) {
  const terbesar = Math.max(0, ...data.map((l) => keAngka(l.jumlah_jiwa) || 0));
  return data.map((l) => kartuLingkungan(l, terbesar)).join("");
}

function kartuLingkungan(item, terbesar) {
  // "Lingkungan 3" ditulis sebagai angka besar; nama lain ditampilkan utuh.
  const nomor = teksPolos(item.nama).match(/^lingkungan\s+(\S+)$/i);
  const jiwa = keAngka(item.jumlah_jiwa);
  const kk = keAngka(item.jumlah_kk);
  const angka = [jiwa !== null && formatAngka(jiwa) + " jiwa", kk !== null && formatAngka(kk) + " KK"].filter(Boolean);

  return `
    <article class="kartu tile-lingkungan reveal">
      ${nomor
        ? `<p class="label-kecil">Lingkungan</p><p class="nomor-lingkungan mt-2">${escapeHtml(nomor[1])}</p>`
        : `<h3 class="judul-kartu">${item.nama}</h3>`}
      <p class="label-kecil mt-5">Kepala lingkungan</p>
      <p class="text-[15px] font-semibold mt-1 leading-snug">${item.kepala || '<span class="text-[var(--muted)] font-normal">Belum dicantumkan</span>'}</p>
      ${angka.length ? `
        <div class="mt-auto pt-5">
          <p class="text-[13px] text-[var(--muted)]">${angka.join(" · ")}</p>
          ${jiwa !== null && terbesar ? `<div class="porsi" title="${formatAngka(jiwa)} jiwa"><span style="width:${Math.max(4, Math.round((jiwa / terbesar) * 100))}%"></span></div>` : ""}
        </div>` : ""}
    </article>
  `;
}
