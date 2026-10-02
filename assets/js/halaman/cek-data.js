/* Cek Data (cek-data.html): memeriksa isi spreadsheet dan melaporkan isian yang keliru.
   Halaman alat admin — tidak ada di menu. Setiap temuan menyebut tab, nomor baris di sheet,
   kolom, apa masalahnya, dan cara memperbaikinya.

   Tingkat temuan:
   - "salah"    : bagian itu tidak tampil atau tampil keliru di situs — perlu diperbaiki;
   - "periksa"  : situs tetap jalan, tetapi kemungkinan besar bukan yang dimaksud admin;
   - "info"     : sekadar pemberitahuan (mis. ada baris yang sengaja disembunyikan). */

const TINGKAT = {
  salah: { label: "Perlu diperbaiki", ikon: "circle-x" },
  periksa: { label: "Periksa", ikon: "triangle-alert" },
  info: { label: "Info", ikon: "info" },
};

const BATAS_UJI_FOTO_MS = 12000;

document.addEventListener("DOMContentLoaded", () => {
  const tautan = document.getElementById("tautan-sheet");
  if (PAKAI_DUMMY) tautan.remove();
  else tautan.href = "https://docs.google.com/spreadsheets/d/" + ID_SPREADSHEET + "/edit";

  document.getElementById("periksa-ulang").addEventListener("click", jalankanCek);
  jalankanCek();
});

/* ---------------------------------------------------------------------- */
/* Menjalankan pemeriksaan                                                 */
/* ---------------------------------------------------------------------- */

async function jalankanCek() {
  const hasil = document.getElementById("hasil-cek");
  document.getElementById("judul-hasil").textContent = "Memeriksa spreadsheet…";
  document.getElementById("ringkasan-cek").innerHTML = "";
  tampilkanMemuat(hasil, "Membaca " + Object.keys(SKEMA).length + " tab…");
  Object.keys(tembolokData).forEach((tab) => delete tembolokData[tab]); // selalu ambil data terbaru

  // Semua tab diambil lebih dulu karena beberapa pemeriksaan melihat tab lain
  // (mis. lingkungan UMKM harus ada di tab lingkungan).
  const tab = {};
  await Promise.all(Object.keys(SKEMA).map(async (nama) => {
    try {
      tab[nama] = await muatTab(nama);
    } catch (err) {
      tab[nama] = { galat: err.message, kolom: [], baris: [] };
    }
  }));

  const temuan = [];
  Object.keys(SKEMA).forEach((nama) => periksaTab(nama, tab, temuan));
  tampilkanHasil(tab, temuan);

  // Foto diuji terakhir karena butuh waktu (setiap foto benar-benar dicoba dibuka).
  const fotoGagal = await ujiSemuaFoto(tab);
  if (fotoGagal.length) {
    temuan.push(...fotoGagal);
    tampilkanHasil(tab, temuan);
  }
  document.getElementById("waktu-cek").textContent = "Diperiksa " +
    new Date().toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" }) +
    (PAKAI_DUMMY ? " · mode data contoh (PAKAI_DUMMY = true)" : " · langsung dari Google Sheet");
}

/* ---------------------------------------------------------------------- */
/* Aturan pemeriksaan                                                       */
/* ---------------------------------------------------------------------- */

function periksaTab(nama, semua, temuan) {
  const { galat, kolom, baris } = semua[nama];
  const lapor = (tingkat, b, kolomNya, pesan, saran = "") =>
    temuan.push({ tab: nama, tingkat, baris: b ? b._baris : null, kolom: kolomNya, pesan, saran });

  if (galat) {
    lapor("salah", null, "", "Tab ini tidak bisa dibaca: " + galat + ".",
      `Pastikan ada tab bernama persis "${nama}" (huruf kecil) dan baris pertamanya berisi judul kolom dari template.`);
    return;
  }

  // Judul kolom
  const skema = SKEMA[nama];
  skema.filter((k) => !kolom.includes(k)).forEach((k) =>
    lapor("salah", null, k, `Kolom "${k}" tidak ada, jadi isinya tidak tampil di situs.`,
      `Tambahkan kolom berjudul "${k}" di baris pertama, atau perbaiki judul kolom yang salah ketik.`));
  kolom.filter((k) => k && !skema.includes(k) && !k.startsWith("_")).forEach((k) => {
    const mirip = palingMirip(k, skema);
    lapor("periksa", null, k, `Kolom "${k}" tidak dikenal dan diabaikan situs.`,
      mirip ? `Mungkin maksudnya "${mirip}"? Ganti judul kolomnya.` : "Hapus kolom ini bila tidak dipakai.");
  });

  const kunci = skema[0];
  const terisi = baris.filter((b) => skema.some((k) => b[k]));
  const hitungKode = new Map();

  terisi.forEach((b) => {
    // Kolom pertama wajib
    if (!b[kunci]) {
      lapor("salah", b, kunci, `Kolom "${kunci}" kosong, jadi baris ini tidak ditampilkan.`,
        `Isi "${kunci}", atau hapus barisnya bila memang tidak dipakai (klik kanan nomor baris → Hapus baris).`);
      return;
    }
    const kode = nama === "profil" ? b.kunci : kodeDari(b[kunci]);
    hitungKode.set(kode, [...(hitungKode.get(kode) || []), b]);

    // Kolom tampil
    if ("tampil" in b && b.tampil && !/^(ya|tidak)$/i.test(teksPolos(b.tampil).trim())) {
      lapor("periksa", b, "tampil", `Isi "${teksPolos(b.tampil)}" tidak dikenal; baris dianggap tampil.`,
        "Pilih Ya atau Tidak dari daftar pilihan.");
    }
    if (/^tidak$/i.test(teksPolos(b.tampil).trim())) {
      lapor("info", b, "tampil", `"${teksPolos(b[kunci])}" disembunyikan (tampil = Tidak).`);
    }

    // Kolom foto
    if ("foto" in b && b.foto) periksaFoto(b.foto, (pesan, saran) => lapor("salah", b, "foto", pesan, saran));

    // Data pribadi: deret 16 angka seperti NIK
    skema.forEach((k) => {
      if (/(^|\D)\d{16}(\D|$)/.test(teksPolos(b[k]).replace(/[\s.-]/g, ""))) {
        lapor("salah", b, k, "Ada deret 16 angka yang mirip NIK. Spreadsheet ini bisa dibaca publik.",
          "Hapus data pribadi seperti NIK dari spreadsheet.");
      }
    });
  });

  // Nama kembar
  hitungKode.forEach((sama) => {
    if (sama.length > 1 && nama !== "aparat") {
      lapor("periksa", sama[1], kunci, `"${teksPolos(sama[0][kunci])}" ditulis lebih dari sekali (baris ${sama.map((b) => b._baris).join(", ")}).`,
        nama === "profil" ? "Situs hanya memakai yang pertama. Hapus baris ganda." : "Bila memang berbeda, bedakan namanya; bila sama, hapus salah satunya.");
    }
  });

  const aturan = ATURAN_TAB[nama];
  if (aturan) aturan(terisi.filter((b) => b[kunci]), lapor, semua);
}

/* Pemeriksaan khusus per tab. `baris` = baris yang kolom pertamanya terisi. */
const ATURAN_TAB = {
  profil(baris, lapor) {
    baris.forEach((b) => {
      if (!KUNCI_PROFIL.includes(b.kunci)) {
        const mirip = palingMirip(b.kunci, KUNCI_PROFIL);
        lapor("periksa", b, "kunci", `Kunci "${b.kunci}" tidak dikenal situs, jadi isinya tidak tampil.`,
          mirip ? `Mungkin maksudnya "${mirip}"?` : "Periksa ejaannya di tab petunjuk.");
      }
    });
    const nilai = (k) => baris.find((b) => b.kunci === k)?.nilai || "";
    if (nilai("luas_wilayah") && keAngka(nilai("luas_wilayah")) === null) {
      const b = baris.find((x) => x.kunci === "luas_wilayah");
      lapor("periksa", b, "nilai", `Luas wilayah "${teksPolos(nilai("luas_wilayah"))}" bukan angka.`, "Tulis angkanya saja, mis. 7,85 (satuan km² ditambahkan situs).");
    }
    const hero = baris.find((b) => b.kunci === "foto_hero");
    if (hero?.nilai) periksaFoto(hero.nilai, (pesan, saran) => lapor("salah", hero, "nilai", pesan, saran));
    ["alamat_kantor", "jam_layanan", "tahun_data", "sumber_data"].filter((k) => !nilai(k)).forEach((k) =>
      lapor("info", null, k, `Kunci "${k}" belum diisi; bagiannya disembunyikan di situs.`));
  },

  lingkungan(baris, lapor) {
    // Satu orang di dua jabatan/lingkungan biasanya tanda baris yang tertukar saat menyalin.
    const tercatat = new Map();
    baris.forEach((b) => ["kepala", "wakil_kepala"].forEach((k) => {
      const kode = kodeDari(b[k]);
      if (kode) tercatat.set(kode, [...(tercatat.get(kode) || []), { b, k }]);
    }));
    tercatat.forEach((daftar) => {
      // Kepala = wakil di baris yang sama dilaporkan terpisah di bawah; di sini hanya antarlingkungan.
      if (new Set(daftar.map(({ b }) => b)).size > 1) {
        const tempat = daftar.map(({ b, k }) => `${teksPolos(b.nama)} (${k === "kepala" ? "kepala" : "wakil"})`).join(", ");
        lapor("periksa", daftar[1].b, daftar[1].k, `"${teksPolos(daftar[0].b[daftar[0].k])}" tercatat lebih dari sekali: ${tempat}.`,
          "Pastikan nama ditulis di baris lingkungan dan kolom jabatan yang benar.");
      }
    });
    const kolomAngka = ["jumlah_kk", "laki", "perempuan", "jumlah_lansia", "jumlah_rumah"];
    baris.forEach((b) => {
      kolomAngka.forEach((k) => {
        if (b[k] && (keAngka(b[k]) === null || keAngka(b[k]) < 0)) {
          lapor("salah", b, k, `"${teksPolos(b[k])}" bukan angka, jadi tidak ikut dihitung.`, "Tulis angka bulat tanpa titik, mis. 345.");
        }
      });
      // Kepala & wakil: jabatan ditentukan kolomnya, jadi yang perlu dijaga hanya isinya.
      [["kepala", "Kepala"], ["wakil_kepala", "Wakil kepala"]].filter(([k]) => !b[k]).forEach(([k, label]) =>
        lapor("info", b, k, `${label} ${teksPolos(b.nama)} belum diisi; tampil sebagai "Belum tersedia".`));
      if (b.kepala && kodeDari(b.kepala) === kodeDari(b.wakil_kepala)) {
        lapor("periksa", b, "wakil_kepala", `${teksPolos(b.nama)}: kepala dan wakil kepala diisi orang yang sama.`, "Periksa kembali nama wakil kepala lingkungan.");
      }
      if (!b.laki || !b.perempuan) {
        lapor("periksa", b, !b.laki ? "laki" : "perempuan", `${teksPolos(b.nama)}: jumlah laki-laki atau perempuan kosong, jadi jumlah jiwanya tidak lengkap.`,
          "Isi keduanya; jumlah jiwa dan total penduduk dihitung otomatis dari dua kolom ini.");
      }
    });
  },

  aparat(baris, lapor) {
    const pimpinan = baris.filter((b) => !b.atasan);
    if (pimpinan.length === 0 && baris.length) {
      lapor("salah", null, "atasan", "Tidak ada pimpinan: semua aparat punya atasan.", "Kosongkan kolom atasan pada baris Lurah.");
    }
    if (pimpinan.length > 1) {
      lapor("periksa", pimpinan[1], "atasan", `Ada ${pimpinan.length} aparat tanpa atasan (${pimpinan.map((b) => teksPolos(b.jabatan)).join(", ")}); semuanya tampil sebagai pimpinan.`,
        "Hanya Lurah yang kolom atasannya kosong. Isi atasan untuk yang lain.");
    }
    const jabatan = baris.map((b) => teksPolos(b.jabatan));
    const kembar = jabatan.filter((j, i) => jabatan.findIndex((x) => kodeDari(x) === kodeDari(j)) !== i);
    baris.forEach((b) => {
      if (!b.atasan) return;
      if (kodeDari(b.atasan) === kodeDari(b.jabatan)) {
        lapor("salah", b, "atasan", "Atasan diisi jabatannya sendiri.", "Isi dengan jabatan atasannya, atau kosongkan bila ini Lurah.");
        return;
      }
      const cocok = baris.filter((x) => x !== b && kodeDari(x.jabatan) === kodeDari(b.atasan));
      if (!cocok.length) {
        const mirip = palingMirip(teksPolos(b.atasan), jabatan);
        lapor("salah", b, "atasan", `Atasan "${teksPolos(b.atasan)}" tidak ada di kolom jabatan, jadi ${teksPolos(b.jabatan)} tampil sebagai pimpinan.`,
          mirip ? `Mungkin maksudnya "${mirip}"? Pilih dari daftar pilihan.` : "Pilih atasan dari daftar pilihan di kolom atasan.");
      } else if (kembar.some((k) => kodeDari(k) === kodeDari(b.atasan))) {
        lapor("periksa", b, "atasan", `Ada lebih dari satu aparat berjabatan "${teksPolos(b.atasan)}"; ${teksPolos(b.jabatan)} ditaruh di bawah yang pertama.`,
          "Bedakan nama jabatannya, mis. tambahkan nama seksinya.");
      }
    });
    baris.filter((b) => !b.nama).forEach((b) =>
      lapor("info", b, "nama", `Nama ${teksPolos(b.jabatan)} kosong; tampil sebagai "Nama belum tersedia".`));
  },

  kontak(baris, lapor) {
    baris.forEach((b) => {
      if (!/^(darurat|umum)$/i.test(teksPolos(b.kategori).trim())) {
        lapor("periksa", b, "kategori", `Kategori "${teksPolos(b.kategori) || "(kosong)"}" tidak dikenal; kontak ini masuk kelompok Layanan umum.`, "Pilih darurat atau umum dari daftar pilihan.");
      }
      if (!b.nomor) lapor("info", b, "nomor", `${teksPolos(b.nama)} tidak punya nomor, jadi tidak ditampilkan.`);
    });
  },

  wisata(baris, lapor) {
    baris.forEach((b) => {
      if (!b.ringkas) lapor("periksa", b, "ringkas", `${teksPolos(b.nama)} belum punya kalimat ringkas; kartunya hanya berisi nama.`, "Isi satu kalimat pendek tentang destinasi ini.");
      if (b.maps_link && !urlAman(teksPolos(b.maps_link))) {
        lapor("salah", b, "maps_link", "Tautan peta tidak diawali https://, jadi tombol Google Maps tidak muncul.", "Salin tautan lengkap dari Google Maps (Bagikan → Salin link).");
      }
    });
  },

  umkm(baris, lapor, semua) {
    const namaLingkungan = (semua.lingkungan?.baris || []).map((l) => kodeDari(l.nama)).filter(Boolean);
    baris.forEach((b) => {
      if (b.lingkungan && namaLingkungan.length && !namaLingkungan.includes(kodeDari(b.lingkungan))) {
        lapor("periksa", b, "lingkungan", `Lingkungan "${teksPolos(b.lingkungan)}" tidak ada di tab lingkungan.`, "Pilih dari daftar pilihan agar ejaannya sama.");
      }
      if (!b.produk) lapor("periksa", b, "produk", `${teksPolos(b.nama)} belum punya keterangan produk.`, "Isi produk utama usaha ini.");
    });
  },

  layanan(baris, lapor) {
    baris.forEach((b) => {
      if (!b.syarat && !b.alur) lapor("info", b, "syarat", `${teksPolos(b.nama_surat)} belum punya syarat maupun alur; pengunjung diminta bertanya ke kantor.`);
    });
  },

  galeri(baris, lapor) {
    baris.filter((b) => !b.foto).forEach((b) =>
      lapor("salah", b, "foto", `"${teksPolos(b.judul)}" tidak punya foto, jadi tidak tampil di Galeri.`, "Tempel tautan foto Google Drive di kolom foto."));
  },
};

/** Memeriksa bentuk isian foto (bukan apakah fotonya bisa dibuka — itu di ujiSemuaFoto). */
function periksaFoto(nilai, lapor) {
  const teks = teksPolos(nilai).trim();
  if (/drive\.google\.com\/drive\/(u\/\d+\/)?folders\//i.test(teks)) {
    lapor("Ini tautan folder Google Drive, bukan tautan satu foto.", "Buka fotonya di Drive → Bagikan → Salin link, lalu tempel tautan itu.");
  } else if (!urlFoto(teks)) {
    lapor(`Isian foto "${teks.slice(0, 60)}" tidak dikenali.`, "Tempel tautan berbagi Google Drive (diawali https://drive.google.com/…), tautan gambar https, atau nama berkas di folder img/.");
  }
}

/* ---------------------------------------------------------------------- */
/* Uji foto: setiap foto benar-benar dicoba dibuka                         */
/* ---------------------------------------------------------------------- */

async function ujiSemuaFoto(semua) {
  const daftar = [];
  Object.entries(semua).forEach(([nama, { baris = [] }]) => {
    baris.forEach((b) => {
      const isian = nama === "profil" ? (b.kunci === "foto_hero" ? b.nilai : "") : b.foto;
      const url = isian && urlFoto(isian, 200);
      if (url) daftar.push({ nama, b, url, kolom: nama === "profil" ? "nilai" : "foto" });
    });
  });
  const hasil = await Promise.all(daftar.map(async (d) => ({ ...d, bisa: await bisaDibuka(d.url) })));
  return hasil.filter((h) => !h.bisa).map(({ nama, b, kolom, url }) => ({
    tab: nama, tingkat: "salah", baris: b._baris, kolom,
    pesan: "Foto tidak bisa dibuka, jadi situs memakai gambar cadangan.",
    saran: /drive\.google\.com/.test(url)
      ? "Di Google Drive: klik kanan foto → Bagikan → Akses umum: \"Siapa saja yang memiliki link\" (Pelihat). Pastikan berkasnya foto (JPG/PNG), bukan PDF atau folder."
      : "Periksa tautannya di browser; tautan harus langsung menuju gambar.",
  }));
}

function bisaDibuka(url) {
  return new Promise((selesai) => {
    const img = new Image();
    const batas = setTimeout(() => selesai(false), BATAS_UJI_FOTO_MS);
    img.onload = () => { clearTimeout(batas); selesai(img.naturalWidth > 1); };
    img.onerror = () => { clearTimeout(batas); selesai(false); };
    img.src = url;
  });
}

/* ---------------------------------------------------------------------- */
/* Tampilan hasil                                                          */
/* ---------------------------------------------------------------------- */

function tampilkanHasil(semua, temuan) {
  const jumlah = (t) => temuan.filter((x) => x.tingkat === t).length;
  const salah = jumlah("salah");
  const periksa = jumlah("periksa");

  document.getElementById("judul-hasil").textContent = salah
    ? `${salah} isian perlu diperbaiki`
    : periksa ? "Tidak ada kesalahan, ada yang perlu diperiksa" : "Semua data beres";

  const ringkasan = document.getElementById("ringkasan-cek");
  ringkasan.innerHTML = [
    selStatistik({ nilai: String(salah), label: "Perlu diperbaiki" }),
    selStatistik({ nilai: String(periksa), label: "Perlu diperiksa" }),
    selStatistik({ nilai: String(jumlah("info")), label: "Info" }),
    selStatistik({ nilai: String(Object.keys(SKEMA).filter((t) => !temuan.some((x) => x.tab === t && x.tingkat !== "info")).length) + "/" + Object.keys(SKEMA).length, label: "Tab tanpa masalah" }),
  ].join("");
  aturKolom(ringkasan);

  const urutan = { salah: 0, periksa: 1, info: 2 };
  document.getElementById("hasil-cek").innerHTML = Object.keys(SKEMA).map((nama) => {
    const milik = temuan.filter((x) => x.tab === nama).sort((a, b) => urutan[a.tingkat] - urutan[b.tingkat] || (a.baris || 0) - (b.baris || 0));
    const jumlahBaris = (semua[nama]?.baris || []).filter((b) => b[SKEMA[nama][0]]).length;
    const bermasalah = milik.some((x) => x.tingkat !== "info");
    return `
      <section class="kartu tab-cek ${bermasalah ? "bermasalah" : ""}">
        <header>
          <h3><span class="nama-tab">${nama}</span></h3>
          <span class="text-sm text-[var(--muted)]">${semua[nama]?.galat ? "tidak terbaca" : jumlahBaris + " baris terisi"}</span>
          <span class="status-tab">
            <i data-lucide="${bermasalah ? "circle-alert" : "circle-check"}" class="w-4 h-4"></i>
            ${bermasalah ? milik.filter((x) => x.tingkat !== "info").length + " temuan" : "Beres"}
          </span>
        </header>
        ${milik.length ? `<ul class="daftar-temuan">${milik.map(itemTemuan).join("")}</ul>` : ""}
      </section>
    `;
  }).join("");
  segarkanTampilan();
}

function itemTemuan(t) {
  const lokasi = [t.baris ? "Baris " + t.baris : "", t.kolom ? "kolom " + t.kolom : ""].filter(Boolean).join(" · ");
  return `
    <li class="temuan temuan-${t.tingkat}">
      <span class="tanda"><i data-lucide="${TINGKAT[t.tingkat].ikon}" class="w-4 h-4"></i>${TINGKAT[t.tingkat].label}</span>
      <div class="min-w-0">
        ${lokasi ? `<p class="lokasi">${escapeHtml(lokasi)}</p>` : ""}
        <p class="pesan">${escapeHtml(t.pesan)}</p>
        ${t.saran ? `<p class="saran">${escapeHtml(t.saran)}</p>` : ""}
      </div>
    </li>
  `;
}

/* ---------------------------------------------------------------------- */
/* Saran salah ketik                                                       */
/* ---------------------------------------------------------------------- */

/** Pilihan yang paling mirip dengan `teks` (jarak edit kecil), atau "" bila tidak ada. */
function palingMirip(teks, pilihan) {
  const a = kodeDari(teks);
  let terbaik = "";
  let jarakTerbaik = Infinity;
  pilihan.forEach((p) => {
    const jarak = jarakEdit(a, kodeDari(p));
    if (jarak < jarakTerbaik) {
      jarakTerbaik = jarak;
      terbaik = p;
    }
  });
  return jarakTerbaik <= Math.max(2, Math.floor(a.length / 4)) ? terbaik : "";
}

function jarakEdit(a, b) {
  const baris = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let kiriAtas = baris[0];
    baris[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const simpan = baris[j];
      baris[j] = Math.min(baris[j] + 1, baris[j - 1] + 1, kiriAtas + (a[i - 1] === b[j - 1] ? 0 : 1));
      kiriAtas = simpan;
    }
  }
  return baris[b.length];
}
