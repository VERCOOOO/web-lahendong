/**
 * Sinkronisasi foto Google Drive → tab "foto" — Website Kelurahan Lahendong
 *
 * Cara memasang (sekali saja, oleh pemilik spreadsheet):
 *   1. Buka spreadsheet situs → Ekstensi → Apps Script.
 *   2. Hapus isi Code.gs, tempel seluruh isi berkas ini, lalu Simpan.
 *   3. Pilih fungsi "pasang" di bilah atas → Jalankan → setujui izin yang diminta.
 *      Fungsi ini membuat folder "Foto Situs Lahendong" beserta subfoldernya di Drive Anda,
 *      membagikannya "Siapa saja yang memiliki link" (Pelihat), mengisi tab "foto",
 *      dan memasang sinkronisasi otomatis setiap 10 menit.
 *   4. Tautan folder tercatat di menu Situs → Buka folder foto.
 *
 * Sehari-hari admin cukup mengunggah, mengganti, atau menghapus foto di folder itu.
 * Situs mengenali foto dari NAMA BERKAS dan SUBFOLDER-nya (lihat tab petunjuk & Panduan Admin):
 *   beranda/hero.jpg                 → gambar besar Beranda
 *   wisata/Danau Linow.jpg           → destinasi bernama "Danau Linow"
 *   aparat/Lurah.jpg                 → aparat berjabatan "Lurah" (atau nama orang tanpa gelar)
 *   lingkungan/Julius Joni Rondonuwu.jpg → kepala/wakil kepala lingkungan bernama itu
 *   kkt/230211060074.jpg             → mahasiswa KKT ber-NIM itu (atau namanya)
 *   galeri/Kegiatan/Panen Raya.jpg   → foto Galeri berjudul "Panen Raya", kategori "Kegiatan"
 * Perubahan tampil di situs paling lambat 10 menit kemudian, atau segera lewat menu
 * Situs → Sinkronkan foto sekarang.
 */

const SUBFOLDER = ["beranda", "wisata", "aparat", "lingkungan", "galeri", "kkt"];
const NAMA_TAB = "foto";
const MENIT_SINKRON = 10;

/** Menu di spreadsheet. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Situs")
    .addItem("Sinkronkan foto sekarang", "sinkronkanFoto")
    .addItem("Buka folder foto", "bukaFolder")
    .addToUi();
}

/** Pemasangan sekali jalan: folder, berbagi, tab foto, dan sinkronisasi otomatis. */
function pasang() {
  const akar = folderAkar();
  SUBFOLDER.forEach((nama) => {
    if (!akar.getFoldersByName(nama).hasNext()) akar.createFolder(nama);
  });
  const galeri = akar.getFoldersByName("galeri").next();
  if (!galeri.getFoldersByName("Kegiatan").hasNext()) galeri.createFolder("Kegiatan");
  akar.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  ScriptApp.getProjectTriggers()
    .filter((p) => p.getHandlerFunction() === "sinkronkanFoto")
    .forEach((p) => ScriptApp.deleteTrigger(p));
  ScriptApp.newTrigger("sinkronkanFoto").timeBased().everyMinutes(MENIT_SINKRON).create();

  sinkronkanFoto();
  Logger.log("Selesai. Folder foto: " + akar.getUrl());
}

/** Folder akar; dibuat bila belum ada. ID-nya disimpan di properti skrip. */
function folderAkar() {
  const properti = PropertiesService.getScriptProperties();
  const id = properti.getProperty("ID_FOLDER_FOTO");
  if (id) {
    try {
      return DriveApp.getFolderById(id);
    } catch (e) {
      // folder terhapus: buat ulang di bawah
    }
  }
  const folder = DriveApp.createFolder("Foto Situs Lahendong");
  properti.setProperty("ID_FOLDER_FOTO", folder.getId());
  return folder;
}

function bukaFolder() {
  const url = folderAkar().getUrl();
  const html = HtmlService.createHtmlOutput(
    '<p style="font-family:sans-serif">Folder foto situs:<br><a href="' + url + '" target="_blank">' + url + "</a></p>"
  ).setWidth(420).setHeight(110);
  SpreadsheetApp.getUi().showModalDialog(html, "Folder foto");
}

/** Tulis daftar semua gambar di folder foto ke tab "foto" (nama_file, folder, id_drive, diubah). */
function sinkronkanFoto() {
  const baris = [];
  telusuri(folderAkar(), "", baris);
  // Urutan tetap (folder lalu nama) agar tab mudah dibaca dan perubahan mudah dilacak.
  baris.sort((a, b) => (a[1] + "/" + a[0]).localeCompare(b[1] + "/" + b[0]));

  const buku = SpreadsheetApp.getActive();
  const tab = buku.getSheetByName(NAMA_TAB) || buku.insertSheet(NAMA_TAB);
  const isi = [["nama_file", "folder", "id_drive", "diubah"]].concat(baris);
  tab.clearContents();
  tab.getRange(1, 1, isi.length, 4).setNumberFormat("@").setValues(isi);
  tab.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#D3DDD8");
  tab.setFrozenRows(1);
  tab.getRange(1, 1).setNote("Tab ini diisi otomatis dari folder foto Google Drive. Jangan diedit; ubah fotonya di Drive.");
}

function telusuri(folder, jalur, baris) {
  const berkas = folder.getFiles();
  while (berkas.hasNext()) {
    const f = berkas.next();
    if (!/^image\//.test(f.getMimeType())) continue;
    // Pastikan setiap foto bisa dilihat situs, meski diunggah sebelum folder dibagikan.
    if (f.getSharingAccess() !== DriveApp.Access.ANYONE_WITH_LINK) {
      try {
        f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (e) {
        // berkas milik orang lain: dibiarkan; Cek Data akan menandainya bila tidak bisa dibuka
      }
    }
    baris.push([f.getName(), jalur, f.getId(), f.getLastUpdated().toISOString()]);
  }
  const sub = folder.getFolders();
  while (sub.hasNext()) {
    const s = sub.next();
    telusuri(s, jalur ? jalur + "/" + s.getName() : s.getName(), baris);
  }
}
