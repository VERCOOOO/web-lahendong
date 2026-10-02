/* Layanan (layanan.html): daftar surat yang bisa dicari, dikelompokkan per kategori,
   dibuka per surat (<details>). Sumber: tab layanan — satu baris per surat.

   Semua bagian mengikuti isi sheet: menambah/menghapus baris menambah/menghapus surat,
   kolom kategori yang diisi memunculkan kelompok & penyaring, sel yang kosong
   menyembunyikan bagiannya. Tautan langsung ke satu surat memakai kode dari namanya
   (dibuat beriKode di data.js): layanan.html#surat-keterangan-domisili. */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("daftar-layanan"), "layanan", renderLayanan, {
    kosong: "Belum ada data layanan surat.",
    gagal: "Data layanan belum bisa dimuat saat ini.",
    setelah: pasangPenyaring,
  });
});

/* ---------------------------------------------------------------------- */
/* Membaca isi sel                                                          */
/* ---------------------------------------------------------------------- */

/**
 * Isi sel → daftar butir. Utamakan satu butir per baris; sel lama yang masih
 * ditulis dalam satu baris dipecah memakai pemisah cadangan (koma, panah).
 */
function butirDari(teks, pemisahCadangan) {
  const baris = barisDari(teks);
  if (baris.length !== 1) return baris;
  return baris[0].split(pemisahCadangan).map((b) => b.trim()).filter(Boolean);
}

const PEMISAH_SYARAT = /\s*[;,]\s*/;
const PEMISAH_ALUR = /\s*(?:→|->)\s*/;

/** Kelompok surat menurut kolom kategori, urut sesuai kemunculan pertama di sheet. */
function kelompokkan(data) {
  const kelompok = new Map();
  data.forEach((item) => {
    const nama = item.kategori || "Lainnya";
    if (!kelompok.has(nama)) kelompok.set(nama, []);
    kelompok.get(nama).push(item);
  });
  // "Lainnya" (surat tanpa kategori) selalu di akhir.
  if (kelompok.has("Lainnya") && kelompok.size > 1) {
    const sisa = kelompok.get("Lainnya");
    kelompok.delete("Lainnya");
    kelompok.set("Lainnya", sisa);
  }
  return kelompok;
}

/* ---------------------------------------------------------------------- */
/* Render                                                                  */
/* ---------------------------------------------------------------------- */

function renderLayanan(data) {
  if (!data.length) return "";
  const kelompok = kelompokkan(data);
  const berkelompok = kelompok.size > 1;

  const isi = [...kelompok].map(([nama, daftar]) => `
    <section class="grup-surat" data-kategori="${nama}">
      ${berkelompok ? `<h3 class="judul-grup-surat"><span>${nama}</span><span class="jumlah">${daftar.length}</span></h3>` : ""}
      <div class="grid gap-3">${daftar.map(itemSurat).join("")}</div>
    </section>
  `).join("");

  return `${isi}<p id="tanpa-hasil" class="tanpa-hasil" hidden></p>`;
}

function itemSurat(item) {
  const syarat = butirDari(item.syarat, PEMISAH_SYARAT);
  const alur = butirDari(item.alur, PEMISAH_ALUR);
  const cari = teksPolos([item.nama_surat, item.kategori, ...syarat].join(" ")).toLowerCase();

  return `
    <details class="surat kartu reveal" id="${teksPolos(item.id)}" data-cari="${escapeHtml(cari)}">
      <summary>
        <span class="min-w-0 flex-1">
          <span class="nama-surat">${item.nama_surat}</span>
          ${metaSurat(item)}
        </span>
        <i data-lucide="chevron-down" class="chevron-ikon w-5 h-5 text-[var(--primary)] shrink-0"></i>
      </summary>
      <div class="isi-surat">
        ${syarat.length || alur.length ? `
          <div class="grid md:grid-cols-2 gap-8">
            ${syarat.length ? `
              <div>
                <p class="label-kecil mb-3">Syarat yang dibawa</p>
                <ul class="daftar-syarat">${syarat.map((s) => `<li>${s}</li>`).join("")}</ul>
              </div>` : ""}
            ${alur.length ? `
              <div>
                <p class="label-kecil mb-3">Alur pengurusan</p>
                <ol class="alur-surat">${alur.map((a) => `<li>${a}</li>`).join("")}</ol>
              </div>` : ""}
          </div>` : ""}
        ${!syarat.length && !alur.length && !item.catatan ? `
          <p class="text-[15px] text-[var(--muted)]">Syarat dan alur surat ini belum dicantumkan. Tanyakan langsung ke kantor kelurahan.</p>` : ""}
        ${item.catatan ? `
          <p class="catatan-surat"><i data-lucide="info" class="w-4 h-4 shrink-0 mt-1"></i><span>${berbaris(item.catatan)}</span></p>` : ""}
      </div>
    </details>
  `;
}

/** Waktu & biaya tampil di baris judul, jadi terbaca tanpa membuka surat. */
function metaSurat(item) {
  const meta = [
    ["clock", item.waktu],
    ["wallet", item.biaya],
  ].filter(([, isi]) => isi);
  if (!meta.length) return "";
  return `<span class="meta-surat">${meta.map(([ikon, isi]) =>
    `<span><i data-lucide="${ikon}" class="w-3.5 h-3.5"></i>${barisDari(isi)[0]}</span>`).join("")}</span>`;
}

/* ---------------------------------------------------------------------- */
/* Pencarian, penyaring kategori, tautan langsung                          */
/* ---------------------------------------------------------------------- */

const saringan = { kata: "", kategori: "semua" };

function pasangPenyaring(data) {
  const jumlah = document.getElementById("jumlah-surat");
  if (jumlah) jumlah.textContent = data.length + " jenis surat";

  const kotakCari = document.getElementById("cari-surat");
  if (kotakCari) {
    kotakCari.closest("[data-wadah-cari]").hidden = data.length < 5; // pencarian baru berguna bila surat banyak
    kotakCari.addEventListener("input", () => {
      saringan.kata = kotakCari.value.trim().toLowerCase();
      terapkanSaringan();
    });
  }

  const kategori = [...kelompokkan(data).keys()];
  const wadahFilter = document.getElementById("filter-kategori");
  if (wadahFilter && kategori.length > 1) {
    wadahFilter.innerHTML = ["semua", ...kategori].map((k) => `
      <button type="button" class="tombol-filter" data-filter="${k}" aria-pressed="${k === "semua"}">
        ${k === "semua" ? "Semua" : k}
      </button>`).join("");
    wadahFilter.hidden = false;
    wadahFilter.addEventListener("click", (e) => {
      const tombol = e.target.closest("[data-filter]");
      if (!tombol) return;
      saringan.kategori = tombol.dataset.filter;
      wadahFilter.querySelectorAll("[data-filter]").forEach((t) =>
        t.setAttribute("aria-pressed", String(t === tombol)));
      terapkanSaringan();
    });
  }

  bukaDariAlamat();
  window.addEventListener("hashchange", bukaDariAlamat);
}

function terapkanSaringan() {
  let terlihat = 0;
  document.querySelectorAll(".grup-surat").forEach((grup) => {
    const kategoriCocok = saringan.kategori === "semua" || grup.dataset.kategori === saringan.kategori;
    let adaDiGrup = 0;
    grup.querySelectorAll(".surat").forEach((surat) => {
      const cocok = kategoriCocok && surat.dataset.cari.includes(saringan.kata);
      surat.hidden = !cocok;
      if (cocok) adaDiGrup += 1;
    });
    grup.hidden = adaDiGrup === 0;
    terlihat += adaDiGrup;
  });

  const pesan = document.getElementById("tanpa-hasil");
  pesan.hidden = terlihat > 0;
  pesan.textContent = saringan.kata
    ? `Tidak ada surat yang cocok dengan "${saringan.kata}". Coba kata lain, atau tanyakan langsung ke kantor kelurahan.`
    : "Tidak ada surat di kategori ini.";
}

/** layanan.html#surat-keterangan-domisili membuka surat itu dan menggulir ke sana. */
function bukaDariAlamat() {
  const id = decodeURIComponent(location.hash.slice(1));
  const surat = id && document.getElementById(id);
  if (!surat || !surat.classList.contains("surat")) return;
  surat.open = true;
  surat.scrollIntoView({ block: "start" });
}
