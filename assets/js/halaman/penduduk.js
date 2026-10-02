/* Penduduk (penduduk.html): ringkasan, komposisi laki-laki/perempuan, rincian per lingkungan.
   Sumber: tab lingkungan (semua angka & total dihitung dari sini) & profil (tahun, sumber data).
   Setiap grafik disertai tabel berisi angka yang sama. */

const FAKTA_PENDUDUK = [
  { kunci: "jiwa", label: "Jumlah penduduk", satuan: "jiwa" },
  { kunci: "kk", label: "Kepala keluarga", satuan: "KK" },
  { kunci: "laki", label: "Laki-laki", satuan: "jiwa" },
  { kunci: "perempuan", label: "Perempuan", satuan: "jiwa" },
];

/* Warna grafik — hanya dari palet spec (lihat :root di style.css). */
const WARNA = {
  primary: "#0B6B63",
  accent: "#E0AE1E",
  line: "#D3DDD8",
  ink: "#10201C",
  muted: "#4E605A",
  surface: "#FFFFFF",
};
const FONT = "'Plus Jakarta Sans', system-ui, sans-serif";

/* Grafik ikut menghormati prefers-reduced-motion, sama seperti animasi CSS. */
const ANIMASI = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ? false
  : { duration: 600, easing: "easeOutQuart" };

const GAYA_TOOLTIP = {
  backgroundColor: WARNA.ink,
  titleFont: { family: FONT },
  bodyFont: { family: FONT },
  padding: 10,
  displayColors: false,
};

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("sumber-data"), "profil", (data) => {
    const tahun = nilaiKunci(data, "tahun_data");
    const sumber = nilaiKunci(data, "sumber_data");
    return [tahun && `Data tahun ${tahun}`, sumber && `Sumber: ${sumber}`].filter(Boolean).join(" · ");
  }, { kosong: null, gagal: null });

  isiDariData(document.getElementById("deret-statistik"), "lingkungan", (data) => {
    const ringkas = ringkasPenduduk(data);
    return FAKTA_PENDUDUK
      .filter((f) => ringkas[f.kunci] > 0)
      .map((f) => selStatistik({ ...f, nilai: formatAngka(ringkas[f.kunci]) }))
      .join("");
  });

  isiDariData(document.getElementById("tabel-gender"), "lingkungan", tabelGender, { setelah: grafikGender });

  isiDariData(document.getElementById("tabel-lingkungan"), "lingkungan", tabelLingkungan, {
    kosong: "Belum ada data lingkungan.",
    setelah: grafikLingkungan,
  });
});

/* ---------------------------------------------------------------------- */
/* Laki-laki & perempuan                                                   */
/* ---------------------------------------------------------------------- */

function komposisiGender(lingkungan) {
  const { laki, perempuan, jiwa } = ringkasPenduduk(lingkungan);
  return { laki, perempuan, total: jiwa };
}

function tabelGender(data) {
  const { laki, perempuan, total } = komposisiGender(data);
  if (!total) return "";
  const persen = (n) => (total ? ((n / total) * 100).toFixed(1).replace(".", ",") : "0") + "%";
  return `
    <tr><td>Laki-laki</td><td class="num">${formatAngka(laki)}</td><td class="num">${persen(laki)}</td></tr>
    <tr><td>Perempuan</td><td class="num">${formatAngka(perempuan)}</td><td class="num">${persen(perempuan)}</td></tr>
    <tr><td>Total</td><td class="num">${formatAngka(total)}</td><td class="num">100%</td></tr>
  `;
}

function grafikGender(data) {
  const { laki, perempuan } = komposisiGender(data);
  new Chart(document.getElementById("grafik-gender"), {
    type: "doughnut",
    data: {
      labels: ["Laki-laki", "Perempuan"],
      datasets: [{
        data: [laki, perempuan],
        backgroundColor: [WARNA.primary, WARNA.accent],
        borderColor: WARNA.surface,
        borderWidth: 3,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: ANIMASI,
      cutout: "58%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: WARNA.ink, font: { family: FONT, size: 13 }, padding: 18, boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: "circle" },
        },
        tooltip: {
          ...GAYA_TOOLTIP,
          callbacks: { label: (ctx) => ctx.label + ": " + ctx.parsed.toLocaleString("id-ID") + " jiwa" },
        },
      },
    },
  });
}

/* ---------------------------------------------------------------------- */
/* Jiwa per lingkungan                                                     */
/* ---------------------------------------------------------------------- */

/* Urutan kolom tabel. "jiwa" tidak ada di sheet: dihitung dari laki + perempuan. */
const KOLOM_ANGKA_LINGKUNGAN = ["jumlah_kk", "jiwa", "laki", "perempuan", "jumlah_lansia", "jumlah_rumah"];

function angkaLingkungan(item, kolom) {
  return kolom === "jiwa" ? jiwaLingkungan(item) : keAngka(item[kolom]);
}

function tabelLingkungan(data) {
  if (!data.length) return "";
  const sel = (nilai) => `<td class="num">${nilai === null ? "—" : formatAngka(nilai)}</td>`;
  const baris = data.map((item) => `<tr><td>${item.nama}</td>${KOLOM_ANGKA_LINGKUNGAN.map((k) => sel(angkaLingkungan(item, k))).join("")}</tr>`);

  // Total kolom yang ada sel kosongnya ditulis "—" agar tidak tampak lengkap padahal tidak.
  const total = KOLOM_ANGKA_LINGKUNGAN.map((k) => {
    const angka = data.map((item) => angkaLingkungan(item, k));
    return angka.some((n) => n === null) ? null : angka.reduce((a, b) => a + b, 0);
  });
  baris.push(`<tr class="baris-total"><td>Total</td>${total.map(sel).join("")}</tr>`);
  return baris.join("");
}

function grafikLingkungan(data) {
  new Chart(document.getElementById("grafik-lingkungan"), {
    type: "bar",
    data: {
      labels: data.map((row) => teksPolos(row.nama)),
      datasets: [{
        label: "Jumlah jiwa",
        data: data.map((row) => jiwaLingkungan(row) ?? 0),
        backgroundColor: WARNA.primary,
        hoverBackgroundColor: WARNA.accent,
        borderRadius: 3,
        maxBarThickness: 22,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: ANIMASI,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...GAYA_TOOLTIP,
          callbacks: { label: (ctx) => ctx.parsed.x.toLocaleString("id-ID") + " jiwa" },
        },
      },
      scales: {
        x: {
          border: { display: false },
          grid: { color: WARNA.line, drawTicks: false },
          ticks: { color: WARNA.muted, font: { family: FONT, size: 12 }, padding: 8 },
        },
        y: {
          border: { color: WARNA.line },
          grid: { display: false },
          ticks: { color: WARNA.ink, font: { family: FONT, size: 13 }, padding: 8 },
        },
      },
    },
  });
}
