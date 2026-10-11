/**
 * Panel Foto — Website Kelurahan Lahendong
 *
 * Operator memasang foto langsung dari spreadsheet, tanpa menyalin tautan dan tanpa aturan nama berkas:
 *   1. Klik baris yang ingin diberi foto (mis. baris "Danau Linow" di tab wisata).
 *   2. Menu Situs → Pasang / ganti foto…
 *   3. Pilih foto → Simpan.
 * Skrip mengecilkan foto, menyimpannya ke folder "Foto Situs Lahendong" di Google Drive,
 * membagikannya agar bisa tampil di situs, lalu menulis tautannya ke kolom foto baris itu.
 *
 * Baris yang bisa diberi foto: tab wisata, aparat, dan galeri (kolom "foto"), serta baris
 * "foto_hero" di tab profil (gambar besar Beranda, kolom "nilai").
 * Panel samping hanya ada di Google Sheets versi komputer (browser), tidak di aplikasi HP.
 *
 * Memasang (sekali, oleh pemilik spreadsheet):
 *   Ekstensi → Apps Script → ganti seluruh isi Code.gs dengan isi berkas ini → Simpan →
 *   pilih fungsi "pasang" → Jalankan → setujui izin. Muat ulang spreadsheet: menu "Situs" muncul.
 */

const NAMA_FOLDER = "Foto Situs Lahendong";
const SISI_TERPANJANG = 1600; // piksel; foto diperkecil di browser sebelum diunggah

/* Rasio yang disarankan per tab — hanya ditampilkan sebagai petunjuk di panel. */
const SARAN_RASIO = {
  wisata: "Foto lanskap (mendatar), rasio 3:2.",
  galeri: "Foto lanskap (mendatar), rasio 3:2.",
  aparat: "Foto potret (tegak) setengah badan, rasio 3:4 seperti pas foto.",
  profil: "Foto lanskap lebar, wajah/objek utama di sisi kanan; judul situs tampil di kiri.",
};

/** Menu di spreadsheet. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Situs")
    .addItem("Pasang / ganti foto…", "bukaPanelFoto")
    .addToUi();
}

/** Sekali jalan: meminta izin, menyiapkan folder, dan membersihkan pemicu dari versi skrip lama. */
function pasang() {
  ScriptApp.getProjectTriggers().forEach((p) => ScriptApp.deleteTrigger(p));
  const folder = folderFoto();
  onOpen();
  Logger.log("Siap. Folder foto: " + folder.getUrl() + " — muat ulang spreadsheet, lalu pakai menu Situs.");
}

function bukaPanelFoto() {
  const panel = HtmlService.createHtmlOutput(HTML_PANEL).setTitle("Foto situs");
  SpreadsheetApp.getUi().showSidebar(panel);
}

/* ---------------------------------------------------------------------- */
/* Dipanggil dari panel                                                    */
/* ---------------------------------------------------------------------- */

/** Keterangan baris yang sedang dipilih: bisa diberi foto atau tidak, dan fotonya sekarang. */
function infoPilihan() {
  const tab = SpreadsheetApp.getActiveSheet();
  const baris = tab.getActiveRange().getRow();
  return keterangan(tab, baris);
}

/** Simpan foto (base64 JPEG dari panel) ke Drive dan tulis tautannya ke baris yang dipilih saat panel dibuka. */
function simpanFoto(namaTab, baris, base64) {
  const tab = SpreadsheetApp.getActive().getSheetByName(namaTab);
  const info = keterangan(tab, baris);
  if (!info.bisa) throw new Error(info.pesan);

  const blob = Utilities.newBlob(Utilities.base64Decode(base64), "image/jpeg", namaBerkas(info));
  const berkas = subfolder(namaTab).createFile(blob);
  berkas.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  tab.getRange(baris, info.kolom).setValue("https://drive.google.com/file/d/" + berkas.getId() + "/view");
  return keterangan(tab, baris);
}

/** Kosongkan kolom foto baris itu (berkas di Drive dibiarkan). Situs kembali memakai gambar bawaan. */
function hapusFoto(namaTab, baris) {
  const tab = SpreadsheetApp.getActive().getSheetByName(namaTab);
  const info = keterangan(tab, baris);
  if (!info.bisa) throw new Error(info.pesan);
  tab.getRange(baris, info.kolom).clearContent();
  return keterangan(tab, baris);
}

/* ---------------------------------------------------------------------- */
/* Pembantu                                                                */
/* ---------------------------------------------------------------------- */

function keterangan(tab, baris) {
  const namaTab = tab.getName();
  const judulKolom = tab.getRange(1, 1, 1, Math.max(1, tab.getLastColumn())).getValues()[0]
    .map((j) => String(j).trim().toLowerCase().replace(/\s+/g, "_"));
  const hasil = { tab: namaTab, baris: baris, bisa: false, nama: "", foto: "", pratinjau: "", saran: SARAN_RASIO[namaTab] || "" };

  if (baris < 2) {
    hasil.pesan = "Klik salah satu baris data (bukan baris judul), lalu tekan \"Ambil baris yang dipilih\".";
    return hasil;
  }
  hasil.nama = String(tab.getRange(baris, 1).getValue()).trim();
  let kolom = judulKolom.indexOf("foto") + 1;
  if (namaTab === "profil") {
    kolom = hasil.nama === "foto_hero" ? judulKolom.indexOf("nilai") + 1 : 0;
  }
  if (!kolom) {
    hasil.pesan = namaTab === "profil"
      ? "Di tab profil, hanya baris \"foto_hero\" (gambar besar Beranda) yang bisa diberi foto."
      : "Tab \"" + namaTab + "\" tidak punya foto. Foto bisa dipasang di tab wisata, aparat, galeri, atau baris foto_hero di tab profil.";
    return hasil;
  }
  if (!hasil.nama) {
    hasil.pesan = "Baris ini masih kosong. Isi dulu kolom pertamanya (nama/judul), lalu pasang foto.";
    return hasil;
  }
  hasil.bisa = true;
  hasil.kolom = kolom;
  hasil.foto = String(tab.getRange(baris, kolom).getValue()).trim();
  const id = (hasil.foto.match(/\/d\/([\w-]{20,})/) || hasil.foto.match(/[?&]id=([\w-]{20,})/) || [])[1];
  hasil.pratinjau = id ? "https://drive.google.com/thumbnail?id=" + id + "&sz=w600" : (/^https:\/\//.test(hasil.foto) ? hasil.foto : "");
  return hasil;
}

function namaBerkas(info) {
  const waktu = Utilities.formatDate(new Date(), "Asia/Makassar", "yyyy-MM-dd HH.mm");
  return info.nama.replace(/[\\/:*?"<>|]+/g, " ").slice(0, 80) + " (" + waktu + ").jpg";
}

function folderFoto() {
  const properti = PropertiesService.getScriptProperties();
  const id = properti.getProperty("ID_FOLDER_FOTO");
  if (id) {
    try {
      return DriveApp.getFolderById(id);
    } catch (e) {
      // folder terhapus: buat ulang
    }
  }
  const ada = DriveApp.getFoldersByName(NAMA_FOLDER);
  const folder = ada.hasNext() ? ada.next() : DriveApp.createFolder(NAMA_FOLDER);
  properti.setProperty("ID_FOLDER_FOTO", folder.getId());
  return folder;
}

function subfolder(nama) {
  const induk = folderFoto();
  const ada = induk.getFoldersByName(nama);
  return ada.hasNext() ? ada.next() : induk.createFolder(nama);
}

/* ---------------------------------------------------------------------- */
/* Tampilan panel                                                          */
/* ---------------------------------------------------------------------- */

const HTML_PANEL = `<!doctype html>
<html><head><base target="_top"><style>
  body { font-family: Arial, sans-serif; font-size: 13px; color: #10201C; margin: 0; padding: 14px; }
  h2 { font-size: 15px; margin: 0 0 4px; }
  .label { font-size: 11px; font-weight: bold; letter-spacing: .06em; text-transform: uppercase; color: #4E605A; margin: 14px 0 4px; }
  .kotak { border: 1px solid #D3DDD8; border-radius: 4px; padding: 10px; background: #fff; }
  .pratinjau { width: 100%; max-height: 220px; object-fit: contain; background: #EEF3F0; border-radius: 4px; display: block; }
  .kosong { padding: 26px 8px; text-align: center; color: #4E605A; background: #EEF3F0; border-radius: 4px; }
  button { width: 100%; padding: 10px; margin-top: 8px; border-radius: 4px; border: 1px solid #0B6B63; font-size: 13px; font-weight: bold; cursor: pointer; }
  .utama { background: #0B6B63; color: #fff; }
  .utama:disabled { background: #9FB6B1; border-color: #9FB6B1; cursor: default; }
  .kedua { background: #fff; color: #0B6B63; }
  .hapus { background: #fff; color: #A8382A; border-color: #E7C6BF; }
  .pesan { margin-top: 10px; padding: 8px 10px; border-radius: 4px; display: none; }
  .pesan.ok { display: block; background: #DDF1EC; color: #07524C; }
  .pesan.galat { display: block; background: #F6E2DE; color: #A8382A; }
  .saran { color: #4E605A; margin-top: 6px; }
  input[type=file] { width: 100%; margin-top: 6px; }
</style></head><body>
  <h2>Foto untuk situs</h2>
  <div class="label">Baris yang dipilih</div>
  <div class="kotak" id="baris">Memuat…</div>
  <button class="kedua" onclick="ambil()">Ambil baris yang dipilih</button>

  <div id="bagian-foto" style="display:none">
    <div class="label">Foto sekarang</div>
    <div id="sekarang"></div>
    <div class="label">Ganti dengan foto baru</div>
    <input type="file" id="berkas" accept="image/*" onchange="pilih(this)">
    <div class="saran" id="saran"></div>
    <img id="baru" class="pratinjau" style="display:none;margin-top:8px">
    <button class="utama" id="simpan" onclick="simpan()" disabled>Simpan foto</button>
    <button class="hapus" id="tombol-hapus" onclick="hapus()" style="display:none">Hapus foto dari baris ini</button>
  </div>
  <div class="pesan" id="pesan"></div>

<script>
  var info = null, dataFoto = null;

  function tampil(i) {
    info = i;
    document.getElementById("baris").innerHTML = i.nama
      ? "<b>" + esc(i.nama) + "</b><br>tab " + esc(i.tab) + ", baris " + i.baris
      : "tab " + esc(i.tab) + ", baris " + i.baris;
    document.getElementById("bagian-foto").style.display = i.bisa ? "block" : "none";
    if (!i.bisa) { pesan(i.pesan, true); return; }
    document.getElementById("saran").textContent = i.saran;
    document.getElementById("sekarang").innerHTML = i.pratinjau
      ? '<img class="pratinjau" src="' + i.pratinjau + '">'
      : '<div class="kosong">Belum ada foto.<br>Situs memakai gambar bawaan.</div>';
    document.getElementById("tombol-hapus").style.display = i.foto ? "block" : "none";
    document.getElementById("berkas").value = "";
    document.getElementById("baru").style.display = "none";
    document.getElementById("simpan").disabled = true;
    dataFoto = null;
  }

  function ambil() {
    pesan("", false);
    google.script.run.withSuccessHandler(tampil).withFailureHandler(gagal).infoPilihan();
  }

  /* Perkecil di browser (sisi terpanjang ${SISI_TERPANJANG} px, JPEG) agar unggahan cepat dan ringan. */
  function pilih(input) {
    var f = input.files[0];
    if (!f) return;
    var gambar = new Image();
    gambar.onload = function () {
      var skala = Math.min(1, ${SISI_TERPANJANG} / Math.max(gambar.width, gambar.height));
      var c = document.createElement("canvas");
      c.width = Math.round(gambar.width * skala);
      c.height = Math.round(gambar.height * skala);
      c.getContext("2d").drawImage(gambar, 0, 0, c.width, c.height);
      var url = c.toDataURL("image/jpeg", 0.85);
      dataFoto = url.split(",")[1];
      var baru = document.getElementById("baru");
      baru.src = url; baru.style.display = "block";
      document.getElementById("simpan").disabled = false;
      pesan("", false);
    };
    gambar.onerror = function () { pesan("Berkas ini bukan gambar yang bisa dibaca. Pilih foto JPG atau PNG.", true); };
    gambar.src = URL.createObjectURL(f);
  }

  function simpan() {
    if (!dataFoto) return;
    document.getElementById("simpan").disabled = true;
    pesan("Menyimpan foto…", false);
    google.script.run.withSuccessHandler(function (i) {
      tampil(i);
      pesan("Foto tersimpan. Muat ulang halaman situs untuk melihatnya.", false);
    }).withFailureHandler(gagal).simpanFoto(info.tab, info.baris, dataFoto);
  }

  function hapus() {
    if (!confirmasi()) return;
    google.script.run.withSuccessHandler(function (i) {
      tampil(i);
      pesan("Foto dilepas dari baris ini. Situs kembali memakai gambar bawaan.", false);
    }).withFailureHandler(gagal).hapusFoto(info.tab, info.baris);
  }

  /* Konfirmasi dua langkah di dalam panel (tanpa jendela pop-up). */
  var siapHapus = false;
  function confirmasi() {
    if (siapHapus) { siapHapus = false; return true; }
    siapHapus = true;
    pesan("Klik sekali lagi untuk melepas foto dari baris ini.", true);
    setTimeout(function () { siapHapus = false; }, 5000);
    return false;
  }

  function gagal(e) { pesan("Gagal: " + (e && e.message ? e.message : e), true); document.getElementById("simpan").disabled = !dataFoto; }
  function pesan(teks, galat) {
    var p = document.getElementById("pesan");
    p.textContent = teks;
    p.className = "pesan" + (teks ? (galat ? " galat" : " ok") : "");
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  ambil();
</script>
</body></html>`;
