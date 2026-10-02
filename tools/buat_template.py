#!/usr/bin/env python3
"""Membuat data/template-data-lahendong.xlsx dari SKEMA (data.js) + DATA_DUMMY (data-contoh.js).

Jalankan setelah mengubah SKEMA atau data contoh:  python3 tools/buat_template.py
Butuh LibreOffice (perintah soffice). Semua sel berformat Teks biasa (@), dan tab "petunjuk"
berisi peta tab → halaman serta aturan pengisian (ubah teksnya di PETA/ATURAN di bawah)."""
import json, os, re, subprocess, tempfile
from xml.sax.saxutils import escape

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KERJA = tempfile.mkdtemp()


def js_ke_json(teks):
    """Objek literal JS sederhana → JSON: buang komentar, gabung "a" + "b", kutip kunci, buang koma akhir."""
    keluar, i, n = [], 0, len(teks)
    while i < n:
        c = teks[i]
        if c == '"':
            j = i + 1
            while teks[j] != '"':
                j += 2 if teks[j] == "\\" else 1
            keluar.append(teks[i:j + 1]); i = j + 1
        elif teks.startswith("//", i):
            i = teks.index("\n", i)
        elif teks.startswith("/*", i):
            i = teks.index("*/", i) + 2
        else:
            keluar.append(c); i += 1
    s = "".join(keluar)
    s = re.sub(r'"\s*\+\s*"', "", s)                    # "a" + "b"
    s = re.sub(r'([{,]\s*)([A-Za-z_]\w*)\s*:', r'\1"\2":', s)  # kunci tanpa kutip
    s = re.sub(r",(\s*[}\]])", r"\1", s)                  # koma akhir
    return json.loads(s)


def ambil_objek(teks, penanda):
    a = teks.index("{", teks.index(penanda))
    kedalaman, i = 0, a
    while True:
        if teks[i] == '"':
            i += 1
            while teks[i] != '"':
                i += 2 if teks[i] == "\\" else 1
        elif teks[i] == "{":
            kedalaman += 1
        elif teks[i] == "}":
            kedalaman -= 1
            if kedalaman == 0:
                return teks[a:i + 1]
        i += 1


SKEMA = js_ke_json(ambil_objek(open(f"{REPO}/assets/js/data.js").read(), "const SKEMA"))
DATA = js_ke_json(ambil_objek(open(f"{REPO}/assets/js/data-contoh.js").read(), "const DATA_DUMMY"))

PETA = {
    "profil": ("Profil, Legenda, Kontak, Layanan, serta header & footer semua halaman",
               "Alamat, telepon, email & jam layanan kantor; luas, ketinggian, suhu; batas wilayah; sejarah; legenda"),
    "statistik": ("Beranda (angka ringkas), Penduduk",
                  "Jumlah penduduk, laki-laki, perempuan, KK, lingkungan; tahun & sumber data"),
    "lingkungan": ("Penduduk (tabel & grafik), Pemerintahan (kartu lingkungan)",
                   "Satu baris per lingkungan: KK, jiwa, laki-laki, perempuan, lansia, rumah, nama kepala lingkungan"),
    "aparat": ("Pemerintahan (struktur), Beranda (pimpinan), Kontak (bila nomor diisi)",
               "Satu baris per aparat. Kolom atasan = id aparat di atasnya; kosong = pimpinan (puncak struktur)"),
    "kontak": ("Kontak", "Nomor selain aparat. kategori: darurat (polisi, damkar, ambulans) atau umum (puskesmas, dsb.)"),
    "wisata": ("Wisata, halaman detail wisata, Beranda, Galeri", "Satu baris per destinasi"),
    "umkm": ("UMKM, Galeri", "Satu baris per usaha"),
    "layanan": ("Layanan, Beranda (daftar surat)",
                "Satu baris per jenis surat. syarat & alur: satu butir per baris dalam sel. "
                "kategori (opsional) mengelompokkan surat; catatan (opsional) tampil sebagai pemberitahuan"),
}

ATURAN = [
    "1. Jangan mengganti nama tab maupun baris judul (baris pertama) di setiap tab.",
    "2. Satu baris = satu data. Menambah atau menghapus baris (surat, wisata, UMKM, aparat, lingkungan) langsung menambah atau mengurangi isi situs; susunan tampilan menyesuaikan sendiri.",
    "3. Baris yang kolom pertamanya (id / kunci) kosong tidak ditampilkan — cara aman menyembunyikan data tanpa menghapusnya.",
    "4. Sel yang kosong membuat bagian itu disembunyikan di situs. Situs tidak pernah mengisi data karangan.",
    "5. Id harus unik dalam satu tab dan jangan diubah: id wisata menjadi alamat halaman detail (wisata-detail.html?id=W1) sekaligus penentu fotonya; id surat menjadi tautan langsung (layanan.html#surat-S2).",
    "6. Satu orang cukup ditulis sekali, di tab aparat. Isi kolom nomor bila nomornya boleh tampil di halaman Kontak.",
    "7. Tulis angka tanpa pemisah ribuan: 2235, bukan 2.235. Desimal boleh memakai koma: 7,85.",
    "8. Semua sel diformat Teks biasa agar Google tidak mengubah isian (mis. membuang angka 0 di depan nomor telepon). Jangan ubah formatnya.",
    "9. Beberapa paragraf atau butir dalam satu sel: pisahkan dengan baris baru (Ctrl+Enter atau Alt+Enter; di Mac Cmd+Enter). Di tab layanan, satu syarat atau satu langkah alur per baris.",
    "10. Kolom maps_link: tautan Google Maps lengkap berawalan https://.",
    "11. Perubahan langsung tampil saat halaman situs dimuat ulang.",
    "12. Spreadsheet ini dapat dibaca publik — jangan simpan data pribadi (NIK, alamat rumah, nomor pribadi) di tab mana pun.",
]

TIDAK_DIATUR = [
    "• Foto: statis di folder img/ situs, dipetakan ke id baris di assets/js/komponen.js (bagian FOTO).",
    "• Peta wilayah (gambar): file img/peta-wilayah.png — halaman Profil menampilkannya otomatis bila file ada.",
    "• Judul dan kalimat pengantar tiap halaman: di berkas HTML.",
]

MASIH_CONTOH = [
    "Nilai yang belum ada data resminya ditandai \"CONTOH\" di kolom keterangan dan wajib diganti sebelum situs diumumkan:",
    "• Tab profil: jam_layanan, luas_wilayah, ketinggian, suhu, batas_utara/selatan/timur/barat, sejarah, legenda.",
    "• Tab layanan: syarat, alur, waktu, biaya, dan catatan setiap surat perlu dicocokkan dengan ketentuan kantor kelurahan.",
    "• Masih kosong: telepon_kantor, email, nama kepala lingkungan, nomor aparat, UMKM.",
]


def sel(nilai, gaya="isi"):
    nilai = "" if nilai is None else str(nilai)
    if nilai == "":
        return f'<table:table-cell table:style-name="{gaya}"/>'
    paragraf = "".join(f"<text:p>{escape(b)}</text:p>" for b in nilai.split("\n"))
    return f'<table:table-cell table:style-name="{gaya}" office:value-type="string">{paragraf}</table:table-cell>'


def baris(nilai, gaya="isi"):
    return "<table:table-row>" + "".join(sel(v, gaya) for v in nilai) + "</table:table-row>"


def lebar(nilai_kolom):
    terpanjang = max((len(b) for v in nilai_kolom for b in str(v or "").split("\n")), default=8)
    return max(12, min(60, terpanjang + 2)) * 0.22  # cm


def tabel(nama, kolom, isi_baris, lebar_kolom):
    cols = "".join(f'<table:table-column table:style-name="k{nama}{i}" table:default-cell-style-name="isi"/>'
                   for i in range(len(kolom)))
    gaya_kolom.extend(f'<style:style style:name="k{nama}{i}" style:family="table-column">'
                      f'<style:table-column-properties style:column-width="{w:.2f}cm"/></style:style>'
                      for i, w in enumerate(lebar_kolom))
    return f'<table:table table:name="{nama}">{cols}{"".join(isi_baris)}</table:table>'


gaya_kolom = []
lembar = []

# Tab petunjuk
p = [baris(["PETUNJUK MENGELOLA DATA — Website Kelurahan Lahendong"], "judul"),
     baris(["Setiap tab di spreadsheet ini mengisi bagian tertentu di situs. Ubah isi sel (tersimpan otomatis), lalu muat ulang halaman situs untuk melihat hasilnya."]),
     baris([""]),
     baris(["TAB", "TAMPIL DI HALAMAN", "ISI"], "kepala")]
p += [baris([tab, *PETA[tab]]) for tab in SKEMA]
p += [baris([""]), baris(["ATURAN PENGISIAN"], "kepala")] + [baris([a]) for a in ATURAN]
p += [baris([""]), baris(["TIDAK DIATUR DARI SPREADSHEET"], "kepala")] + [baris([a]) for a in TIDAK_DIATUR]
p += [baris([""]), baris(["DATA YANG MASIH CONTOH"], "kepala")] + [baris([a]) for a in MASIH_CONTOH]
lembar.append(tabel("petunjuk", ["a", "b", "c"], p, [5.6, 12.4, 16.0]))

for tab, kolom in SKEMA.items():
    data = DATA.get(tab, [])
    isi = [baris(kolom, "kepala")] + [baris([row.get(k, "") for k in kolom]) for row in data]
    # Baris kosong siap isi, juga berformat Teks biasa, agar baris tambahan admin tidak diubah Google.
    isi.append(f'<table:table-row table:number-rows-repeated="100"><table:table-cell table:style-name="isi" '
               f'table:number-columns-repeated="{len(kolom)}"/></table:table-row>')
    lembar.append(tabel(tab, kolom, isi, [lebar([k] + [r.get(k, "") for r in data]) for k in kolom]))

FODS = f'''<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
 xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
 xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
 xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
 xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
 xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0"
 office:version="1.3" office:mimetype="application/vnd.oasis.opendocument.spreadsheet">
<office:automatic-styles>
 <number:text-style style:name="teks"><number:text-content/></number:text-style>
 <style:style style:name="isi" style:family="table-cell" style:data-style-name="teks">
  <style:table-cell-properties fo:wrap-option="wrap" style:vertical-align="top"/>
 </style:style>
 <style:style style:name="kepala" style:family="table-cell" style:data-style-name="teks">
  <style:table-cell-properties fo:background-color="#D3DDD8" fo:wrap-option="wrap" style:vertical-align="top"/>
  <style:text-properties fo:font-weight="bold"/>
 </style:style>
 <style:style style:name="judul" style:family="table-cell" style:data-style-name="teks">
  <style:text-properties fo:font-weight="bold" fo:font-size="13pt"/>
 </style:style>
 {"".join(gaya_kolom)}
</office:automatic-styles>
<office:body><office:spreadsheet>{"".join(lembar)}</office:spreadsheet></office:body>
</office:document>'''

fods = os.path.join(KERJA, "template-data-lahendong.fods")
open(fods, "w").write(FODS)
subprocess.run(["soffice", "--headless", "--convert-to", "xlsx", "--outdir", f"{REPO}/data", fods],
               check=True, capture_output=True)
print("ok:", {tab: len(DATA.get(tab, [])) for tab in SKEMA})
