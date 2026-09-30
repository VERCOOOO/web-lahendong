/* ==========================================================================
   Komponen konten bersama — potongan HTML dan format yang dipakai lebih dari
   satu halaman, plus isiDariData() untuk pola baku setiap blok data.
   Nilai dari ambilData() sudah di-escape, jadi aman disisipkan ke HTML.
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Pola baku blok data                                                     */
/* ---------------------------------------------------------------------- */

/**
 * Tampilkan "Memuat data…", ambil tab, lalu isi wadah dengan hasil render.
 *
 * @param {Element|null} wadah   elemen tujuan (boleh <tbody>)
 * @param {string|string[]} tab  satu nama tab, atau beberapa (render menerima array hasil)
 * @param {(data) => string} render  mengembalikan HTML; string kosong = tidak ada data
 * @param {object} [opsi]
 * @param {string|null} [opsi.kosong]  pesan bila render kosong; null = hapus wadah
 * @param {string|null} [opsi.gagal]   pesan bila gagal dimuat; null = hapus wadah
 * @param {(data) => void} [opsi.setelah]  dijalankan setelah HTML terpasang (mis. menggambar grafik)
 * @returns {Promise<any|null>} data yang diambil, atau null bila gagal
 */
async function isiDariData(wadah, tab, render, opsi = {}) {
  if (!wadah) return null;
  const { kosong = "Belum ada data untuk ditampilkan.", gagal = "Data belum bisa dimuat saat ini.", setelah } = opsi;

  tampilkanMemuat(wadah);
  let data;
  try {
    data = Array.isArray(tab) ? await Promise.all(tab.map(ambilData)) : await ambilData(tab);
  } catch (err) {
    gagal === null ? wadah.remove() : tampilkanGagal(wadah, gagal);
    return null;
  }

  const html = render(data);
  if (!html) {
    kosong === null ? wadah.remove() : tampilkanKosong(wadah, kosong);
    return data;
  }
  wadah.innerHTML = html;
  segarkanTampilan();
  if (setelah) setelah(data);
  return data;
}

/* ---------------------------------------------------------------------- */
/* Format                                                                  */
/* ---------------------------------------------------------------------- */

/** Format angka gaya Indonesia: 3241 → "3.241", 7.85 → "7,85". Bukan angka → apa adanya. */
function formatAngka(nilai) {
  const n = keAngka(nilai);
  return n === null ? nilai : n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

/** Nomor urut dua digit untuk penanda seksi/kartu: 0 → "01". */
function nomorUrut(i) {
  return String(i + 1).padStart(2, "0");
}

/** "0812-3456-7801" → "tel:081234567801". */
function hrefTelepon(nomor) {
  return "tel:" + teksPolos(nomor).replace(/[^0-9+]/g, "");
}

/** Nilai kolom "statistik" berdasarkan kuncinya, atau null bila tidak ada. */
function nilaiStatistik(data, kunci) {
  return data.find((row) => row.kunci === kunci)?.nilai ?? null;
}

/* ---------------------------------------------------------------------- */
/* Potongan HTML                                                           */
/* ---------------------------------------------------------------------- */

/** Satu sel angka besar untuk .deret-statistik. */
function selStatistik({ nilai, satuan = "", label }) {
  return `
    <div>
      <p class="angka">${nilai}${satuan ? `<span class="satuan">${satuan}</span>` : ""}</p>
      <p class="label-angka">${label}</p>
    </div>
  `;
}

/** Kartu destinasi wisata (beranda & halaman wisata). */
function kartuWisata(item, i, { denganTautan = false } = {}) {
  return `
    <a href="wisata-detail.html?id=${encodeURIComponent(teksPolos(item.id))}" class="kartu reveal block overflow-hidden">
      <div class="bingkai-foto aspect-[4/3]">
        <img src="${urlFoto(item.foto)}" alt="${item.nama}" loading="lazy" onerror="this.src='img/placeholder.webp'" />
      </div>
      <div class="p-5">
        <p class="no-seksi">${nomorUrut(i)}</p>
        <h3 class="judul-kartu mt-2">${item.nama}</h3>
        <p class="text-sm text-[var(--muted)] mt-2 leading-[1.6]">${item.ringkas}</p>
        ${denganTautan ? `
          <span class="tautan mt-5">
            <span class="relative">Lihat detail<span class="garis absolute left-0 -bottom-0.5"></span></span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </span>` : ""}
      </div>
    </a>
  `;
}

/* ---------------------------------------------------------------------- */
/* Aparat                                                                  */
/* ---------------------------------------------------------------------- */

/** Aparat diurutkan menurut kolom urutan; yang urutannya kosong diletakkan terakhir. */
function urutkanAparat(data) {
  return data.slice().sort((a, b) => (keAngka(a.urutan) ?? 999) - (keAngka(b.urutan) ?? 999));
}

/** Nama untuk ditampilkan; sel nama yang kosong tidak dibiarkan tampil kosong. */
function namaOrang(nama) {
  return nama ? nama : `<span class="text-[var(--muted)] font-normal">Nama belum tersedia</span>`;
}

/**
 * Foto orang bila ada, selain itu monogram inisial (lebih jujur daripada foto palsu).
 * @param {object} orang  baris berkolom nama & foto
 * @param {string} kelas  kelas ukuran/bentuk, mis. "aspect-[4/3]" atau "w-14 h-14 rounded-full"
 */
function visualOrang(orang, kelas) {
  if (orang.foto) {
    return `<img src="${urlFoto(orang.foto)}" alt="${orang.nama}" class="${kelas} object-cover" loading="lazy" onerror="this.src='img/placeholder.webp'" />`;
  }
  const isi = orang.nama ? inisial(orang.nama) : '<i data-lucide="user-round" class="w-1/3 h-1/3"></i>';
  return `<span class="monogram ${kelas}" aria-hidden="true">${isi}</span>`;
}

/** Inisial nama untuk monogram, melewati gelar: "Raymon S. Londok S.T" → "RL". */
function inisial(nama) {
  const kata = teksPolos(nama)
    .split(",")[0] // gelar di belakang koma: "Nama, S.STP"
    .trim()
    .split(/\s+/)
    .filter((k) =>
      k &&
      !/^[a-z]{1,4}\.$/i.test(k) && // gelar depan & inisial tengah: Drs. Ir. H. M.
      !/^[a-z]{1,4}(\.[a-z]{1,4})+\.?$/i.test(k) // gelar akademik: S.T S.St M.Kes S.STP
    );
  if (!kata.length) return "—";
  if (kata.length === 1) return kata[0].slice(0, 2).toUpperCase();
  return (kata[0][0] + kata[kata.length - 1][0]).toUpperCase();
}
