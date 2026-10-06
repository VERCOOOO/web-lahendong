/* KKT (kkt.html): dosen lapangan & mahasiswa KKT Unsrat Angkatan 149, dikelompokkan per bidang.
   Halaman ini tidak ada di menu atas; tautannya ada di baris bawah footer (ui.js).

   Berbeda dengan halaman lain, data KKT TIDAK diambil dari spreadsheet — cukup ubah DATA_KKT di bawah,
   lalu jalankan python3 tools/versi_aset.py, commit, dan push. */

const DATA_KKT = {
  periode: "", // mis. "Juli – Agustus 2026"; kosong = tidak ditampilkan

  // Tampil di panel tersendiri di atas daftar mahasiswa. foto opsional, sama seperti anggota.
  dosen: [
    { peran: "Dosen Pembimbing Lapangan", nama: "Dr. Ir. Charles R. Ngangi, MS", foto: "" },
    { peran: "Dosen Pengawas Lapangan", nama: "Decky J. Paseki, SH., M.H", foto: "" },
  ],

  // Satu paragraf per elemen; kosong = paragraf "tentang" tidak ditampilkan.
  tentang: [],

  /* Satu objek per mahasiswa. Urutan di sini = urutan tampil.
     - bidang: kelompok kartu di halaman; ditulis sama persis untuk satu bidang.
     - peran: jabatan dalam bidang. "Anggota" tidak ditampilkan sebagai label.
     - fakultas: tampil di kartu; dihitung untuk angka "Fakultas asal".
     - foto (opsional): nama berkas di folder img/ (mis. "kkt-fidelia.webp") atau tautan Google Drive.
       Kosong = monogram inisial. */
  anggota: [
    { bidang: "Pengurus Inti", peran: "Koordinator Posko", nama: "Fidelia Tishri Kololy", nim: "231011030018", fakultas: "Fakultas Matematika dan Ilmu Pengetahuan Alam", foto: "" },
    { bidang: "Pengurus Inti", peran: "Sekretaris", nama: "Geofena Theresa Viona Nender", nim: "230511060015", fakultas: "Fakultas Perikanan dan Ilmu Kelautan", foto: "" },
    { bidang: "Pengurus Inti", peran: "Bendahara", nama: "Tiara Tisya Paraso", nim: "230411040070", fakultas: "Fakultas Peternakan", foto: "" },

    { bidang: "Bidang Program", peran: "Koordinator", nama: "Vergino F. Maindoka", nim: "230211060074", fakultas: "Fakultas Teknik", foto: "" },
    { bidang: "Bidang Program", peran: "Anggota", nama: "Elistiani Meisye Manansang", nim: "230911020148", fakultas: "Fakultas Ilmu Budaya", foto: "" },

    { bidang: "Bidang Pelaporan", peran: "Koordinator", nama: "Militia Meisya Revalinny Senduk", nim: "230111040116", fakultas: "Fakultas Kedokteran", foto: "" },
    { bidang: "Bidang Pelaporan", peran: "Anggota", nama: "Pipit Desriyani", nim: "230911010009", fakultas: "Fakultas Ilmu Budaya", foto: "" },
    { bidang: "Bidang Pelaporan", peran: "Anggota", nama: "Firzyawan Listanto Mokoginta", nim: "230911020035", fakultas: "Fakultas Ilmu Budaya", foto: "" },

    { bidang: "Bidang Publikasi dan Dokumentasi", peran: "Koordinator", nama: "Emmanuel Arthur Wirakusumah", nim: "230211050022", fakultas: "Fakultas Teknik", foto: "" },
    { bidang: "Bidang Publikasi dan Dokumentasi", peran: "Anggota", nama: "Frianita M. T. Lumy", nim: "230311090016", fakultas: "Fakultas Pertanian", foto: "" },
    { bidang: "Bidang Publikasi dan Dokumentasi", peran: "Anggota", nama: "Natalia Paduli", nim: "230311090002", fakultas: "Fakultas Pertanian", foto: "" },
    { bidang: "Bidang Publikasi dan Dokumentasi", peran: "Anggota", nama: "Theodorus Dirly Keintjem", nim: "230911020066", fakultas: "Fakultas Ilmu Budaya", foto: "" },

    { bidang: "Bidang Hubungan Masyarakat", peran: "Koordinator", nama: "Ferlika Novalisa Pasalo", nim: "230111040059", fakultas: "Fakultas Kedokteran", foto: "" },
    { bidang: "Bidang Hubungan Masyarakat", peran: "Anggota", nama: "Elsa Theresia Br. Sitorus", nim: "230711010017", fakultas: "Fakultas Hukum", foto: "" },
    { bidang: "Bidang Hubungan Masyarakat", peran: "Anggota", nama: "Kanaya Montolalu", nim: "230111040027", fakultas: "Fakultas Kedokteran", foto: "" },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  isiAtauHapus("info-kkt", DATA_KKT.periode ? escapeHtml("Periode " + DATA_KKT.periode) : "");
  isiAtauHapus("tentang-kkt", DATA_KKT.tentang.map((p, i) => `<p${i === 0 ? ' class="lead"' : ""}>${escapeHtml(p)}</p>`).join(""));

  // Nilai dari kode di-escape seperti data spreadsheet, agar tanda < atau & dalam nama tetap aman.
  const rapikan = (daftar) => daftar.map((m) =>
    Object.fromEntries(["bidang", "peran", "nama", "nim", "fakultas", "foto"].map((k) => [k, escapeHtml(String(m[k] ?? "").trim())])))
    .filter((m) => m.nama);
  const anggota = rapikan(DATA_KKT.anggota);
  const dosen = rapikan(DATA_KKT.dosen);
  isiAtauHapus("dosen-kkt", dosen.map(kartuDosen).join(""));

  isiAtauHapus("angka-kkt", anggota.length
    ? [
      selStatistik({ nilai: String(anggota.length), label: "Mahasiswa" }),
      selStatistik({ nilai: String(new Set(anggota.map((m) => kodeDari(m.fakultas)).filter(Boolean)).size), label: "Fakultas asal" }),
    ].join("")
    : "");

  if (!document.getElementById("tentang-kkt") && !document.getElementById("angka-kkt")) {
    document.getElementById("seksi-tentang-kkt")?.remove();
  }

  const daftar = document.getElementById("daftar-kkt");
  if (anggota.length) {
    daftar.innerHTML = renderAnggota(anggota);
    aturKolomDi(daftar);
  } else {
    tampilkanKosong(daftar, "Daftar mahasiswa KKT sedang disiapkan.");
  }
  segarkanTampilan();
});

/** Isi elemen dengan HTML; elemen dihapus bila isinya kosong. */
function isiAtauHapus(id, html) {
  const el = document.getElementById(id);
  if (!el) return;
  if (html) {
    el.innerHTML = html;
    aturKolomDi(el);
  } else {
    el.remove();
  }
}

/** Anggota per bidang, urut sesuai kemunculan pertama. Ejaan bidang dibandingkan longgar. */
function kelompokBidang(anggota) {
  const kelompok = new Map();
  anggota.forEach((m) => {
    const kode = kodeDari(m.bidang) || "anggota";
    if (!kelompok.has(kode)) kelompok.set(kode, { nama: m.bidang || "Anggota", anggota: [] });
    kelompok.get(kode).anggota.push(m);
  });
  return kelompok;
}

function renderAnggota(anggota) {
  return [...kelompokBidang(anggota).values()].map(({ nama, anggota: daftar }) => `
    <section class="reveal">
      <h3 class="judul-grup-surat"><span>${nama}</span><span class="jumlah">${daftar.length}</span></h3>
      <!-- Kolom tetap (bukan grid adaptif) agar semua kelompok sejajar satu sama lain. -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">${daftar.map(kartuMahasiswa).join("")}</div>
    </section>
  `).join("");
}

/** Dosen lapangan: potret, jabatan, nama besar, dan asal universitas — di panel gelap. */
function kartuDosen(d) {
  return `
    <article class="dosen">
      ${visualOrang(d, "foto-dosen", "kkt")}
      <div class="min-w-0">
        <p class="label-kecil">${d.peran}</p>
        <h3 class="nama-dosen">${d.nama}</h3>
        <p class="asal-dosen">Universitas Sam Ratulangi</p>
      </div>
    </article>
  `;
}

/* Kartu mendatar: foto/monogram di kiri, teks di kanan. Baris peran selalu ada (Anggota diredupkan)
   agar nama, NIM, dan fakultas sejajar di semua kartu dalam satu baris. */
function kartuMahasiswa(m) {
  const anggota = !m.peran || /^anggota$/i.test(teksPolos(m.peran).trim());
  return `
    <article class="kartu kartu-mahasiswa">
      ${visualOrang(m, "foto-mahasiswa", "kkt")}
      <div class="min-w-0">
        <p class="label-kecil ${anggota ? "" : "peran-utama"}">${m.peran || "Anggota"}</p>
        <h4 class="nama-orang mt-1">${m.nama}</h4>
        ${m.nim ? `<p class="nim mt-1.5">NIM ${m.nim}</p>` : ""}
        ${m.fakultas ? `<p class="fakultas">${m.fakultas}</p>` : ""}
      </div>
    </article>
  `;
}
