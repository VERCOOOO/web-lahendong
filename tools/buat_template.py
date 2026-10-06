#!/usr/bin/env python3
"""Membuat data/template-data-lahendong.xlsx dari SKEMA (data.js) + DATA_DUMMY (data-contoh.js).

Jalankan setelah mengubah SKEMA atau data contoh:  python3 tools/buat_template.py
Butuh LibreOffice (perintah soffice). Semua sel berformat Teks biasa (@), dan tab "petunjuk"
berisi peta tab → halaman serta aturan pengisian (ubah teksnya di PETA/ATURAN/KOLOM di bawah).

Agar mudah diisi: judul kolom dibekukan dan diberi catatan (arti + contoh), kolom pertama
(wajib) berwarna hijau tua, kolom pilihan (tampil, kategori, lingkungan) memakai dropdown."""
import json, os, re, subprocess, tempfile, zipfile
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
    "profil": ("Profil, Kontak, Layanan, Penduduk (tahun & sumber), Beranda (foto besar), header & footer",
               "Alamat, telepon, email & jam layanan kantor; luas, ketinggian, suhu; batas wilayah; sejarah; tahun & sumber data; foto hero"),
    "lingkungan": ("Penduduk (angka, grafik & tabel), Beranda (angka ringkas), Pemerintahan (kartu lingkungan)",
                   "Satu baris per lingkungan: kepala & wakil kepala lingkungan, KK, laki-laki, perempuan, lansia, rumah. Semua total dihitung otomatis dari tab ini"),
    "aparat": ("Pemerintahan (struktur), Beranda (pimpinan), Kontak (bila nomor diisi)",
               "Satu baris per aparat. Kolom atasan = jabatan atasannya (pilih dari daftar); kosong = pimpinan"),
    "kontak": ("Kontak", "Nomor selain aparat. kategori: darurat (polisi, damkar, ambulans) atau umum (puskesmas, dsb.)"),
    "wisata": ("Wisata, halaman detail wisata, Beranda, Galeri", "Satu baris per destinasi"),
    "layanan": ("Layanan, Beranda (daftar surat)",
                "Satu baris per jenis surat. syarat & alur: satu butir per baris dalam sel"),
    "galeri": ("Galeri", "Opsional: judul & kategori lewat sheet. Foto di folder Drive galeri/ sudah otomatis masuk Galeri tanpa baris di sini"),
}

TAMPIL = ("Ya = tampil di situs. Tidak = disembunyikan, data tetap tersimpan. Kosong dianggap Ya.", "Ya")
FOTO = ("Opsional — biasanya cukup unggah foto ke folder foto Drive dengan nama yang sesuai (lihat tab petunjuk). "
        "Isi kolom ini hanya untuk menimpanya dengan tautan berbagi satu foto.", "https://drive.google.com/file/d/…/view")

# (tab, kolom) → (arti, contoh). Tampil sebagai catatan di judul kolom dan di tab petunjuk.
KOLOM = {
    "profil": {
        "kunci": ("WAJIB. Nama informasi yang dicari situs — jangan diubah. Daftar kunci ada di tab petunjuk.", "jam_layanan"),
        "nilai": ("Isi informasinya. Beberapa paragraf: pisahkan dengan baris baru (Ctrl+Enter).", "Senin – Jumat, 08.00 – 15.00 WITA"),
        "keterangan": ("Catatan untuk admin; tidak tampil di situs.", "CONTOH — ganti"),
    },
    "lingkungan": {
        "nama": ("WAJIB. Nama lingkungan. \"Lingkungan 3\" ditampilkan sebagai angka besar.", "Lingkungan 3"),
        "kepala": ("Nama KEPALA lingkungan di baris lingkungannya. Kosong = tampil \"Belum tersedia\".", "Julius Joni Rondonuwu"),
        "wakil_kepala": ("Nama WAKIL kepala lingkungan di baris lingkungannya. Kosong = tampil \"Belum tersedia\".", "Jetni Vinsensia Poli"),
        "jumlah_kk": ("Jumlah kepala keluarga. Angka tanpa titik.", "124"),
        "laki": ("Penduduk laki-laki. Jumlah jiwa = laki + perempuan, dihitung otomatis.", "169"),
        "perempuan": ("Penduduk perempuan.", "176"),
        "jumlah_lansia": ("Jumlah lansia.", "37"),
        "jumlah_rumah": ("Jumlah rumah.", "106"),
    },
    "aparat": {
        "jabatan": ("WAJIB. Nama jabatan. Urutan baris = urutan tampil.", "Kepala Seksi Pemerintahan"),
        "nama": ("Nama lengkap dengan gelar. Kosong = \"Nama belum tersedia\".", "Reymon Stive Londok, S.T"),
        "atasan": ("Jabatan atasannya — pilih dari daftar. Kosong = pimpinan (Lurah). Atasan = Lurah → kolom tersendiri; atasan = Kasi → staf di kolom Kasi itu.", "Lurah"),
        "nomor": ("Nomor telepon. Isi hanya bila boleh tampil di halaman Kontak.", "0812-3456-7890"),
        "foto": FOTO,
    },
    "kontak": {
        "nama": ("WAJIB. Nama layanan/kontak. Hapus baris untuk menghapus kontak.", "Puskesmas Lahendong"),
        "tampil": TAMPIL,
        "peran": ("Keterangan singkat.", "Layanan kesehatan"),
        "nomor": ("Nomor telepon. Kosong = kontak tidak ditampilkan.", "0431-123456"),
        "kategori": ("Pilih dari daftar: darurat (polisi, damkar, ambulans) atau umum.", "umum"),
    },
    "wisata": {
        "nama": ("WAJIB. Nama destinasi. Hapus baris untuk menghapus destinasi.", "Danau Linow"),
        "tampil": TAMPIL,
        "foto": FOTO,
        "ringkas": ("Satu kalimat untuk kartu.", "Danau vulkanik dengan warna air yang berubah."),
        "deskripsi": ("Uraian lengkap. Satu paragraf per baris (Ctrl+Enter).", "(paragraf)"),
        "jam": ("Jam buka. Baris pertama tampil di kartu.", "Setiap hari, 08.00 – 18.00 WITA"),
        "tiket": ("Harga tiket. Baris pertama tampil di kartu.", "Rp10.000 per orang"),
        "fasilitas": ("Dipisah koma.", "Parkir, toilet, warung"),
        "waktu_terbaik": ("Saran waktu berkunjung, satu per baris.", "Pagi hari"),
        "cara_kesana": ("Rute, satu langkah per baris.", "Dari pusat Kota Tomohon …"),
        "pengelola": ("Pengelola, satu per baris.", "Pemerintah Kota Tomohon"),
        "maps_link": ("Tautan Google Maps lengkap, diawali https://", "https://maps.google.com/?q=Danau+Linow"),
    },
    "layanan": {
        "nama_surat": ("WAJIB. Nama surat. Untuk menghapus surat: hapus barisnya.", "Surat Keterangan Tidak Mampu (SKTM)"),
        "tampil": TAMPIL,
        "kategori": ("Kelompok surat: pilih dari daftar atau ketik kategori baru. Kosong = Lainnya.", "Sosial"),
        "syarat": ("Berkas yang dibawa, satu per baris (Ctrl+Enter).", "Fotokopi KTP⏎Fotokopi Kartu Keluarga"),
        "alur": ("Langkah pengurusan, satu per baris (Ctrl+Enter).", "Bawa berkas ke kantor kelurahan⏎Surat ditandatangani lurah"),
        "waktu": ("Lama proses.", "1 hari kerja"),
        "biaya": ("Biaya.", "Gratis"),
        "catatan": ("Pemberitahuan tambahan (opsional).", "Bawa dokumen asli saat pengambilan."),
    },
    "galeri": {
        "judul": ("WAJIB. Judul foto, tampil di bawah foto.", "Pengucapan Syukur 2026"),
        "tampil": TAMPIL,
        "foto": ("Tautan satu foto Drive — atau kosongkan dan unggah foto ke folder Drive galeri/ dengan nama berkas = judul.", "https://drive.google.com/file/d/…/view"),
        "kategori": ("Kelompok foto: pilih dari daftar atau ketik baru. Menjadi tombol penyaring di Galeri.", "Kegiatan"),
    },
}

# Dropdown: (tab, kolom) → (pilihan, ketat). pilihan berupa daftar nilai, atau rentang sel
# "tab.kolom" agar daftarnya mengikuti isi sheet (mis. jabatan aparat). ketat=False hanya memperingatkan.
PILIHAN = {
    ("kontak", "tampil"): (["Ya", "Tidak"], True),
    ("wisata", "tampil"): (["Ya", "Tidak"], True),
    ("layanan", "tampil"): (["Ya", "Tidak"], True),
    ("galeri", "tampil"): (["Ya", "Tidak"], True),
    ("kontak", "kategori"): (["darurat", "umum"], True),
    ("layanan", "kategori"): (sorted({r.get("kategori", "") for r in DATA.get("layanan", [])} - {""}) or ["Kependudukan"], False),
    ("galeri", "kategori"): (["Kegiatan", "Alam", "Budaya"], False),
    ("aparat", "atasan"): ("aparat.jabatan", True),
}

ALAMAT_SITUS = "https://vercoooo.github.io/web-lahendong/"

CARA = [
    "• Menambah data: isi baris kosong pertama di bawah data terakhir. Kolom pertama (judul hijau tua) wajib diisi.",
    "• Menghapus data: klik kanan nomor baris di kiri → Hapus baris. Baris kosong yang tersisa di tengah tidak masalah.",
    "• Menyembunyikan sementara: ubah kolom tampil menjadi Tidak (pilih dari daftar). Data tetap tersimpan.",
    "• Arti setiap kolom: arahkan kursor ke judul kolom (ada segitiga kecil di pojok) — muncul penjelasan dan contoh.",
    "• Urutan di situs = urutan baris di sheet. Pindahkan baris untuk mengubah urutan.",
    "• Angka total (jumlah penduduk, KK, jiwa per lingkungan) tidak perlu ditulis — situs menghitungnya dari tab lingkungan.",
    f"• Setelah mengubah data, buka halaman Cek Data: {ALAMAT_SITUS}cek-data.html — setiap isian yang keliru ditunjukkan beserta cara memperbaikinya.",
]

CARA_FOTO = [
    "Cara utama: unggah foto ke folder \"Foto Situs Lahendong\" di Google Drive (menu Situs → Buka folder foto). Situs mengenali foto dari NAMA BERKAS dan SUBFOLDER-nya:",
    "• beranda/hero.jpg → gambar besar di Beranda",
    "• wisata/<nama destinasi>.jpg → mis. wisata/Danau Linow.jpg",
    "• aparat/<jabatan atau nama tanpa gelar>.jpg → mis. aparat/Lurah.jpg",
    "• lingkungan/<nama kepala/wakil>.jpg → mis. lingkungan/Julius Joni Rondonuwu.jpg",
    "• kkt/<NIM atau nama>.jpg → mis. kkt/230211060074.jpg",
    "• galeri/<kategori>/<judul>.jpg → setiap foto otomatis masuk Galeri, mis. galeri/Kegiatan/Panen Raya.jpg",
    "Mengganti foto: hapus berkas lama, unggah yang baru dengan nama sama. Menghapus: hapus berkasnya. Huruf besar/kecil dan ekstensi (.jpg/.png/.webp) bebas.",
    "Perubahan tampil paling lambat 10 menit kemudian, atau segera lewat menu Situs → Sinkronkan foto sekarang. Foto orang 3:4 (pas foto), lanskap 3:2; hanya dengan izin yang bersangkutan.",
    "Kolom foto di tab lain (tautan Drive satu foto) tetap bisa dipakai untuk menimpa foto dari folder. Cek Data menandai nama berkas yang tidak cocok dengan data mana pun.",
]

ATURAN = [
    "1. Jangan mengganti nama tab maupun baris judul (baris pertama) di setiap tab.",
    "2. Satu baris = satu data. Menambah atau menghapus baris langsung menambah atau mengurangi isi situs; susunan tampilan menyesuaikan sendiri.",
    "3. Baris yang kolom pertamanya kosong tidak ditampilkan.",
    "4. Sel yang kosong membuat bagian itu disembunyikan di situs. Situs tidak pernah mengisi data karangan.",
    "5. Tidak ada kode/id yang perlu dikarang: setiap baris dikenali dari kolom pertamanya (nama, jabatan, judul). Hindari dua baris dengan nama yang sama persis.",
    "6. Satu orang cukup ditulis sekali, di tab aparat. Isi kolom nomor bila nomornya boleh tampil di halaman Kontak.",
    "7. Tulis angka tanpa pemisah ribuan: 2235, bukan 2.235. Desimal boleh memakai koma: 7,85.",
    "8. Semua sel diformat Teks biasa agar Google tidak mengubah isian (mis. membuang angka 0 di depan nomor telepon). Jangan ubah formatnya.",
    "9. Beberapa paragraf atau butir dalam satu sel: pisahkan dengan baris baru (Ctrl+Enter atau Alt+Enter; di Mac Cmd+Enter).",
    "10. Perubahan langsung tampil saat halaman situs dimuat ulang.",
    "11. Spreadsheet ini dapat dibaca publik — jangan simpan data pribadi (NIK, alamat rumah, nomor pribadi) di tab mana pun.",
]

KUNCI_PROFIL = [
    ("alamat_kantor", "Alamat kantor kelurahan"), ("telepon_kantor", "Telepon kantor"), ("email", "Email kantor"),
    ("jam_layanan", "Jam layanan kantor"), ("luas_wilayah", "Luas wilayah, angka saja (km²)"), ("ketinggian", "Ketinggian (mdpl)"),
    ("suhu", "Suhu rata-rata (°C)"), ("batas_utara", "Batas utara"), ("batas_selatan", "Batas selatan"),
    ("batas_timur", "Batas timur"), ("batas_barat", "Batas barat"), ("sejarah", "Sejarah, satu paragraf per baris"),
    ("tahun_data", "Tahun data kependudukan"),
    ("sumber_data", "Sumber data kependudukan"), ("foto_hero", "Foto besar di Beranda (tautan Google Drive, opsional)"),
]

TIDAK_DIATUR = [
    "• Judul dan kalimat pengantar tiap halaman, serta ilustrasi bawaan: di berkas situs (HTML & folder img/).",
    "• Peta wilayah (gambar): file img/peta-wilayah.png — halaman Profil menampilkannya otomatis bila file ada.",
]

MASIH_CONTOH = [
    "Nilai yang belum ada data resminya ditandai \"CONTOH\" di kolom keterangan dan wajib diganti sebelum situs diumumkan:",
    "• Tab profil: jam_layanan, luas_wilayah, ketinggian, suhu, sejarah.",
    "• Tab layanan: syarat, alur, waktu, biaya, dan catatan setiap surat perlu dicocokkan dengan ketentuan kantor kelurahan.",
    "• Masih kosong: telepon_kantor, email, kepala & wakil kepala Lingkungan 7, nomor aparat, galeri.",
]


def paragraf(nilai):
    return "".join(f"<text:p>{escape(b)}</text:p>" for b in str(nilai).split("\n"))


def sel(nilai, gaya="isi", validasi=None, catatan=None):
    nilai = "" if nilai is None else str(nilai)
    atribut = f' table:style-name="{gaya}"' + (f' table:content-validation-name="{validasi}"' if validasi else "")
    isi = f"<office:annotation>{paragraf(catatan)}</office:annotation>" if catatan else ""
    if nilai:
        atribut += ' office:value-type="string"'
        isi += paragraf(nilai)
    return f"<table:table-cell{atribut}>{isi}</table:table-cell>" if isi else f"<table:table-cell{atribut}/>"


def baris(nilai, gaya="isi", validasi=None):
    validasi = validasi or [None] * len(nilai)
    return "<table:table-row>" + "".join(sel(v, gaya, val) for v, val in zip(nilai, validasi)) + "</table:table-row>"


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


def validasi_xml(nama, tab, kolom_ke, pilihan, ketat):
    if isinstance(pilihan, str):  # rentang sel: "aparat.jabatan" → $aparat.$A$2:.$A$500
        tab_sumber, kolom_sumber = pilihan.split(".")
        huruf = chr(65 + SKEMA[tab_sumber].index(kolom_sumber))
        daftar = f"[$'{tab_sumber}'.${huruf}$2:.${huruf}$500]"
    else:
        daftar = ";".join(f"&quot;{escape(p)}&quot;" for p in pilihan)
    alamat = f"{tab}.{chr(65 + kolom_ke)}2"
    jenis = "stop" if ketat else "warning"
    pesan = "Pilih salah satu dari daftar." if ketat else "Nilai ini belum ada di daftar. Tetap dipakai bila memang kategori baru."
    return (f'<table:content-validation table:name="{nama}" table:condition="of:cell-content-is-in-list({daftar})" '
            f'table:allow-empty-cell="true" table:base-cell-address="{alamat}" table:display-list="unsorted">'
            f'<table:error-message table:message-type="{jenis}" table:display="true"><text:p>{pesan}</text:p></table:error-message>'
            f'</table:content-validation>')


gaya_kolom, lembar, validasi = [], [], []

# Tab petunjuk
p = [baris(["PETUNJUK MENGELOLA DATA — Website Kelurahan Lahendong"], "judul"),
     baris(["Setiap tab di spreadsheet ini mengisi bagian tertentu di situs. Ubah isi sel (tersimpan otomatis), lalu muat ulang halaman situs untuk melihat hasilnya."]),
     baris([""]),
     baris(["CARA MENAMBAH, MENGHAPUS & MENYEMBUNYIKAN DATA"], "kepala")] + [baris([c]) for c in CARA]
p += [baris([""]), baris(["FOTO DARI GOOGLE DRIVE"], "kepala")] + [baris([c]) for c in CARA_FOTO]
p += [baris([""]), baris(["TAB", "TAMPIL DI HALAMAN", "ISI"], "kepala")]
p += [baris([tab, *PETA[tab]]) for tab in SKEMA if tab in PETA]
p += [baris(["foto", "Semua halaman yang berfoto", "Diisi OTOMATIS dari folder foto Google Drive oleh skrip (menu Situs). Jangan diedit."])]
p += [baris([""]), baris(["ATURAN PENGISIAN"], "kepala")] + [baris([a]) for a in ATURAN]
p += [baris([""]), baris(["ARTI SETIAP KOLOM"], "kepala"), baris(["TAB · KOLOM", "ARTI", "CONTOH"], "kepala")]
for tab, kolom in SKEMA.items():
    if tab not in KOLOM:  # tab foto: dibuat & diisi skrip, tidak dijelaskan per kolom
        continue
    for k in kolom:
        arti, contoh = KOLOM[tab][k]
        p.append(baris([f"{tab} · {k}", arti, contoh.replace("⏎", " ↵ ")], "wajib-petunjuk" if k == kolom[0] else "isi"))
p += [baris([""]), baris(["KUNCI DI TAB PROFIL"], "kepala"), baris(["KUNCI", "ISI"], "kepala")]
p += [baris([k, arti]) for k, arti in KUNCI_PROFIL]
p += [baris([""]), baris(["TIDAK DIATUR DARI SPREADSHEET"], "kepala")] + [baris([a]) for a in TIDAK_DIATUR]
p += [baris([""]), baris(["DATA YANG MASIH CONTOH"], "kepala")] + [baris([a]) for a in MASIH_CONTOH]
lembar.append(tabel("petunjuk", ["a", "b", "c"], p, [5.6, 14.0, 12.0]))

for tab, kolom in SKEMA.items():
    if tab == "foto":  # dibuat & diisi tools/sinkron-foto.gs, bukan bagian template
        continue
    data = DATA.get(tab, [])
    nama_val = []
    for i, k in enumerate(kolom):
        if (tab, k) in PILIHAN:
            nama = f"v_{tab}_{k}"
            validasi.append(validasi_xml(nama, tab, i, *PILIHAN[(tab, k)]))
            nama_val.append(nama)
        else:
            nama_val.append(None)
    judul = "<table:table-row>" + "".join(
        sel(k, "wajib" if i == 0 else "kepala", catatan=f"{KOLOM[tab][k][0]}\nContoh: {KOLOM[tab][k][1].replace('⏎', ' ↵ ')}")
        for i, k in enumerate(kolom)) + "</table:table-row>"
    isi = [judul] + [baris([row.get(k, "") for k in kolom], validasi=nama_val) for row in data]
    # Baris kosong siap isi: berformat Teks biasa dan ber-dropdown, agar baris tambahan admin tidak diubah Google.
    kosong = "".join(sel("", "isi", v) for v in nama_val)
    isi.append(f'<table:table-row table:number-rows-repeated="100">{kosong}</table:table-row>')
    lembar.append(tabel(tab, kolom, isi, [lebar([k] + [r.get(k, "") for r in data]) for k in kolom]))

FODS = f"""<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
 xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
 xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
 xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
 xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
 xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0"
 xmlns:of="urn:oasis:names:tc:opendocument:xmlns:of:1.2"
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
 <style:style style:name="wajib" style:family="table-cell" style:data-style-name="teks">
  <style:table-cell-properties fo:background-color="#0B6B63" fo:wrap-option="wrap" style:vertical-align="top"/>
  <style:text-properties fo:font-weight="bold" fo:color="#FFFFFF"/>
 </style:style>
 <style:style style:name="wajib-petunjuk" style:family="table-cell" style:data-style-name="teks">
  <style:table-cell-properties fo:wrap-option="wrap" style:vertical-align="top"/>
  <style:text-properties fo:font-weight="bold"/>
 </style:style>
 <style:style style:name="judul" style:family="table-cell" style:data-style-name="teks">
  <style:text-properties fo:font-weight="bold" fo:font-size="13pt"/>
 </style:style>
 {"".join(gaya_kolom)}
</office:automatic-styles>
<office:body><office:spreadsheet>
 <table:content-validations>{"".join(validasi)}</table:content-validations>
 {"".join(lembar)}
</office:spreadsheet></office:body>
</office:document>"""

fods = os.path.join(KERJA, "template-data-lahendong.fods")
open(fods, "w").write(FODS)
subprocess.run(["soffice", "--headless", "--convert-to", "xlsx", "--outdir", KERJA, fods],
               check=True, capture_output=True)


def bekukan_judul(xlsx_masuk, xlsx_keluar):
    """Bekukan baris judul (baris 1) di setiap tab data, agar judul kolom tetap terlihat saat menggulir.
    Disuntikkan langsung ke XML xlsx karena pengaturan ini tidak terbawa konversi LibreOffice."""
    pane = ('<pane xSplit="0" ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>'
            '<selection pane="bottomLeft" activeCell="A2" sqref="A2"/>')
    with zipfile.ZipFile(xlsx_masuk) as zin, zipfile.ZipFile(xlsx_keluar, "w", zipfile.ZIP_DEFLATED) as zout:
        for info in zin.infolist():
            data = zin.read(info.filename)
            if re.match(r"xl/worksheets/sheet([2-9]|\d\d+)\.xml$", info.filename):  # sheet1 = petunjuk
                xml = data.decode("utf-8")
                xml = re.sub(r'(<sheetView [^>]*>)<selection [^>]*/>', lambda m: m.group(1) + pane, xml, count=1)
                data = xml.encode("utf-8")
            zout.writestr(info, data)


bekukan_judul(os.path.join(KERJA, "template-data-lahendong.xlsx"), f"{REPO}/data/template-data-lahendong.xlsx")
print("ok:", {tab: len(DATA.get(tab, [])) for tab in SKEMA})
