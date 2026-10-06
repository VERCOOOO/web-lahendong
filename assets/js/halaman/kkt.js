/* KKT (kkt.html): dosen lapangan & mahasiswa KKT Unsrat Angkatan 149, dikelompokkan per bidang.
   Halaman ini tidak ada di menu atas; tautannya ada di baris bawah footer (ui.js).

   Berbeda dengan halaman lain, data KKT TIDAK diambil dari spreadsheet — cukup ubah DATA_KKT di bawah,
   lalu jalankan python3 tools/versi_aset.py, commit, dan push. */

const DATA_KKT = {
  periode: "", // mis. "Juli – Agustus 2026"; kosong = tidak ditampilkan

  // Tampil di panel tersendiri di atas daftar mahasiswa. foto opsional (rasio 3:4), sama seperti anggota.
  dosen: [
    { peran: "Dosen Pembimbing Lapangan", nama: "Dr. Ir. Charles R. Ngangi, MS", foto: "" },
    { peran: "Dosen Pengawas Lapangan", nama: "Decky J. Paseki, SH., M.H", foto: "" },
  ],

  // Satu paragraf per elemen; kosong = paragraf "tentang" tidak ditampilkan.
  tentang: [],

  /* Satu objek per mahasiswa. Urutan di sini = urutan tampil di bagan struktur.
     - bidang: kelompok pertama (Pengurus Inti) tampil di puncak bagan, orang pertamanya di tengah;
       bidang lain tampil sebagai kolom di bawahnya. Tulis nama bidang sama persis untuk satu bidang.
     - peran: "Koordinator…" ditonjolkan di kepala kolom bidang; "Anggota" tampil di daftar bawahnya.
     - fakultas: tampil di kartu; dihitung untuk angka "Fakultas asal".
     - foto (opsional): nama berkas di folder img/ (mis. "kkt-fidelia.webp") atau tautan Google Drive.
       Kosong = monogram inisial. Semua tempat foto berasio 3:4 (pas foto), mis. 600 × 800 piksel,
       wajah di sepertiga atas; foto dengan rasio lain dipotong otomatis dari tengah-atas. */
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
    daftar.innerHTML = renderStruktur(anggota);
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

/* ---------------------------------------------------------------------- */
/* Bagan struktur                                                           */
/* ---------------------------------------------------------------------- */

/* Ikon kolom bidang menurut kata kunci namanya; bidang lain memakai ikon kelompok. */
const IKON_BIDANG = [
  [/program/i, "clipboard-list"],
  [/pelaporan|laporan/i, "file-text"],
  [/publikasi|dokumentasi/i, "camera"],
  [/humas|hubungan masyarakat/i, "megaphone"],
];

/**
 * Kelompok pertama (Pengurus Inti) menjadi puncak bagan: orang pertamanya di tengah, sisanya mengapit.
 * Kelompok lain menjadi kolom bidang yang disambung garis dari puncak — sama seperti struktur aparat
 * di halaman Pemerintahan (kelas .cabang-struktur / .cabang di style.css).
 */
function renderStruktur(anggota) {
  const [inti, ...bidang] = [...kelompokBidang(anggota).values()];
  const [ketua, ...pendamping] = inti.anggota;
  // Ketua di tengah: separuh pendamping di kiri, separuh di kanan.
  const kiri = pendamping.slice(0, Math.ceil(pendamping.length / 2));
  const kanan = pendamping.slice(kiri.length);
  const tersambung = bidang.length && bidang.length <= 4 ? " tersambung" : "";

  return `
    <div class="struktur-kkt reveal">
      <p class="label-kecil text-center">${inti.nama}</p>
      <div class="pengurus-kkt">
        ${kiri.map((m) => kartuPengurus(m)).join("")}
        ${kartuPengurus(ketua, true)}
        ${kanan.map((m) => kartuPengurus(m)).join("")}
      </div>
      ${bidang.length ? `
        <div class="cabang-struktur grid-adaptif${tersambung}" data-maks="4">
          ${bidang.map(kolomBidang).join("")}
        </div>` : ""}
    </div>
  `;
}

function kartuPengurus(m, ketua = false) {
  return `
    <article class="kartu kartu-pengurus${ketua ? " ketua" : ""}">
      ${visualOrang(m, "foto-pengurus", "kkt")}
      <p class="label-kecil peran">${m.peran}</p>
      <h3 class="nama-pengurus-kkt">${m.nama}</h3>
      ${m.nim ? `<p class="nim">NIM ${m.nim}</p>` : ""}
      ${m.fakultas ? `<p class="fakultas">${m.fakultas}</p>` : ""}
    </article>
  `;
}

/** Satu kolom bidang: kepala berikon, koordinator ditonjolkan, anggota dalam daftar ringkas. */
function kolomBidang({ nama, anggota }) {
  const koordinator = anggota.find((m) => /koordinator/i.test(teksPolos(m.peran))) || anggota[0];
  const lainnya = anggota.filter((m) => m !== koordinator);
  const ikon = (IKON_BIDANG.find(([pola]) => pola.test(teksPolos(nama))) || [null, "users"])[1];
  return `
    <div class="cabang">
      <article class="kartu kartu-bidang">
        <header class="kepala-bidang">
          <span class="ikon-bidang"><i data-lucide="${ikon}" class="w-[18px] h-[18px]"></i></span>
          <h3>${nama}</h3>
          <span class="jumlah-bidang">${anggota.length}</span>
        </header>
        <div class="koordinator-bidang">
          ${visualOrang(koordinator, "foto-koordinator", "kkt")}
          <div class="min-w-0">
            <p class="label-kecil peran">${koordinator.peran || "Koordinator"}</p>
            <p class="nama">${koordinator.nama}</p>
            <p class="detail">${detailMahasiswa(koordinator)}</p>
          </div>
        </div>
        ${lainnya.length ? `
          <ul class="anggota-bidang">
            ${lainnya.map((m) => `
              <li>
                ${visualOrang(m, "foto-anggota", "kkt")}
                <div class="min-w-0">
                  <p class="nama">${m.nama}</p>
                  <p class="detail">${detailMahasiswa(m)}</p>
                </div>
              </li>`).join("")}
          </ul>` : ""}
      </article>
    </div>
  `;
}

/** "230211060074 · Teknik" — kata "Fakultas" dilepas agar muat di kolom yang sempit. */
function detailMahasiswa(m) {
  return [m.nim, teksPolos(m.fakultas).replace(/^fakultas\s+/i, "")].filter(Boolean).map(escapeHtml).join(" · ");
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
