/* Legenda (legenda.html): cerita rakyat Danau Linow.
   Sumber: tab profil, kunci "legenda" (satu baris dalam sel = satu paragraf). */

document.addEventListener("DOMContentLoaded", () => {
  isiDariData(document.getElementById("legenda"), "profil",
    (profil) => paragraf(nilaiKunci(profil, "legenda"), { lead: true }),
    { kosong: "Cerita legenda sedang dihimpun.", gagal: "Cerita belum bisa dimuat saat ini." }
  );
});
