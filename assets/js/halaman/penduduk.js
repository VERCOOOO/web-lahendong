/* Penduduk (penduduk.html): ringkasan, komposisi laki-laki/perempuan, rincian per lingkungan.
   Sumber: tab statistik & lingkungan. Setiap grafik disertai tabel berisi angka yang sama. */

const FAKTA_PENDUDUK = [
  { kunci: "jumlah_penduduk", label: "Jumlah penduduk", satuan: "jiwa" },
  { kunci: "jumlah_kk", label: "Kepala keluarga", satuan: "KK" },
  { kunci: "laki", label: "Laki-laki", satuan: "jiwa" },
  { kunci: "perempuan", label: "Perempuan", satuan: "jiwa" },
];

/* Warna grafik — hanya dari palet spec (lihat :root di style.css). */
const WARNA = {
  primary: "#2D5A4A",
  accent: "#C07A1E",
  line: "#DDE2DC",
  ink: "#1B2420",
  muted: "#5C6862",
  surface: "#FFFFFF",
};
const FONT = "'Source Sans 3', system-ui, sans-serif";

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
  isiDariData(document.getElementById("sumber-data"), "statistik", (data) => {
    const tahun = nilaiKunci(data, "tahun_data");
    const sumber = nilaiKunci(data, "sumber_data");
    return [tahun && `Data tahun ${tahun}`, sumber && `Sumber: ${sumber}`].filter(Boolean).join(" · ");
  }, { kosong: null, gagal: null });

  isiDariData(document.getElementById("deret-statistik"), "statistik", (data) =>
    FAKTA_PENDUDUK
      .filter((f) => nilaiKunci(data, f.kunci))
      .map((f) => selStatistik({ ...f, nilai: formatAngka(nilaiKunci(data, f.kunci)) }))
      .join("")
  );

  isiDariData(document.getElementById("tabel-gender"), "statistik", tabelGender, { setelah: grafikGender });

  isiDariData(document.getElementById("tabel-lingkungan"), "lingkungan", tabelLingkungan, {
    kosong: "Belum ada data lingkungan.",
    setelah: grafikLingkungan,
  });
});

/* ---------------------------------------------------------------------- */
/* Laki-laki & perempuan                                                   */
/* ---------------------------------------------------------------------- */

function komposisiGender(data) {
  const laki = keAngka(nilaiKunci(data, "laki")) ?? 0;
  const perempuan = keAngka(nilaiKunci(data, "perempuan")) ?? 0;
  return { laki, perempuan, total: laki + perempuan };
}

function tabelGender(data) {
  const { laki, perempuan, total } = komposisiGender(data);
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

const KOLOM_ANGKA_LINGKUNGAN = ["jumlah_kk", "jumlah_jiwa", "laki", "perempuan", "jumlah_lansia", "jumlah_rumah"];

function tabelLingkungan(data) {
  if (!data.length) return "";
  const sel = (nilai) => `<td class="num">${nilai === "" ? "—" : formatAngka(nilai)}</td>`;
  const baris = data.map((item) => `<tr><td>${item.nama}</td>${KOLOM_ANGKA_LINGKUNGAN.map((k) => sel(item[k])).join("")}</tr>`);

  // Baris total dihitung dari tabel ini, bukan dari tab statistik.
  const total = KOLOM_ANGKA_LINGKUNGAN.map((k) => {
    const angka = data.map((item) => keAngka(item[k]));
    return angka.some((n) => n === null) ? "" : String(angka.reduce((a, b) => a + b, 0));
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
        data: data.map((row) => keAngka(row.jumlah_jiwa) ?? 0),
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
