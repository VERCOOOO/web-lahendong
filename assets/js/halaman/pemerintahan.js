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

/** Jabatan dibandingkan longgar: huruf besar/kecil, spasi, dan tanda baca diabaikan. */
function samaJabatan(a, b) {
  return kodeDari(a) !== "" && kodeDari(a) === kodeDari(b);
}

/**
 * Menyusun pohon dari kolom "atasan" (berisi jabatan atasan). Urutan = urutan baris di sheet.
 * Aparat tanpa atasan — atau atasannya tidak ditemukan — menjadi puncak (pimpinan).
 */
function susunPohon(aparat) {
  const simpul = aparat.map((a) => ({ ...a, bawahan: [] }));
  const puncak = [];
  simpul.forEach((s) => {
    const atasan = s.atasan && simpul.find((calon) => calon !== s && samaJabatan(calon.jabatan, s.atasan));
    if (atasan && !adalahBawahan(atasan, s)) {
      atasan.bawahan.push(s);
    } else {
      if (s.atasan) console.warn(`[data] Tab "aparat" baris ${s._baris}: atasan "${teksPolos(s.atasan)}" tidak ditemukan atau melingkar.`);
      puncak.push(s);
    }
  });
  return puncak;
}

/** true bila `calon` sudah berada di bawah `s` — mencegah susunan melingkar (A atasan B, B atasan A). */
function adalahBawahan(calon, s) {
  return s.bawahan.some((b) => b === calon || adalahBawahan(calon, b));
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

/* Batang di tiap kartu = jumlah jiwa dibanding lingkungan terbesar. */
function renderLingkungan(data) {
  const terbesar = Math.max(0, ...data.map((l) => jiwaLingkungan(l) || 0));
  return data.map((l) => kartuLingkungan(l, terbesar)).join("");
}

/* Isi sel kosong (mis. jabatan belum diisi, atau sel terhapus tanpa sengaja). Netral dan tetap benar
   dalam kedua keadaan, sama dengan "Nama belum tersedia" untuk aparat. */
const BELUM_TERSEDIA = "Belum tersedia";

function kartuLingkungan(item, terbesar) {
  // "Lingkungan 3" ditulis sebagai angka besar; nama lain ditampilkan utuh.
  const nomor = teksPolos(item.nama).match(/^lingkungan\s+(\S+)$/i);
  const jiwa = jiwaLingkungan(item);
  const kk = keAngka(item.jumlah_kk);

  return `
    <article class="kartu tile-lingkungan reveal">
      <header class="kepala-tile">
        <div class="min-w-0">
          <p class="label-kecil">Lingkungan</p>
          ${nomor
            ? `<p class="nomor-lingkungan mt-1">${escapeHtml(nomor[1])}</p>`
            : `<h3 class="judul-kartu mt-1">${item.nama}</h3>`}
        </div>
        <dl class="ringkas-tile">
          ${jiwa !== null ? `<div><dt>Jiwa</dt><dd>${formatAngka(jiwa)}</dd></div>` : ""}
          ${kk !== null ? `<div><dt>KK</dt><dd>${formatAngka(kk)}</dd></div>` : ""}
        </dl>
      </header>
      ${jiwa !== null && terbesar ? `<div class="porsi" title="${formatAngka(jiwa)} jiwa"><span style="width:${Math.max(4, Math.round((jiwa / terbesar) * 100))}%"></span></div>` : ""}
      <ul class="pengurus-lingkungan">
        ${barisPengurus("Kepala", item.kepala, true)}
        ${barisPengurus("Wakil kepala", item.wakil_kepala, false)}
      </ul>
    </article>
  `;
}

/** Satu jabatan di kartu lingkungan; jabatan ditentukan kolom sheet-nya, bukan isian admin. */
function barisPengurus(jabatan, nama, utama) {
  return `
    <li class="${nama ? "" : "kosong"}">
      ${visualOrang({ nama }, "avatar-pengurus", "lingkungan")}
      <div class="min-w-0">
        <p class="label-kecil ${utama ? "jabatan-utama" : ""}">${jabatan}</p>
        <p class="nama-pengurus">${nama || BELUM_TERSEDIA}</p>
      </div>
    </li>
  `;
}
