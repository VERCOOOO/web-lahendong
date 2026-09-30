/* Profil (profil.html): angka geografis. Ketinggian & suhu belum ada di sheet, jadi tetap di sini. */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("grid-geografi"), "statistik", (data) => {
    const dariSheet = (kunci) => formatAngka(nilaiStatistik(data, kunci) ?? "—");
    return [
      { nilai: dariSheet("luas_wilayah"), satuan: "km²", label: "Luas wilayah" },
      { nilai: "800–950", satuan: "mdpl", label: "Ketinggian" },
      { nilai: "22–26", satuan: "°C", label: "Suhu rata-rata" },
      { nilai: dariSheet("jumlah_lingkungan"), label: "Jumlah lingkungan" },
    ].map(selStatistik).join("");
  }, { gagal: "Data geografis belum bisa dimuat saat ini." });
});
