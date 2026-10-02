#!/usr/bin/env python3
"""Memberi penanda versi pada CSS/JS lokal di setiap halaman HTML: assets/js/data.js?v=3f9a1c2e.

GitHub Pages menyuruh browser menyimpan berkas selama 10 menit. Tanpa penanda versi, browser
pengunjung bisa memakai HTML baru dengan JS lama (atau sebaliknya) sesaat setelah pembaruan,
dan data gagal dimuat. Penanda diambil dari isi berkas, jadi hanya berubah bila berkasnya berubah.

Jalankan sebelum commit setiap kali mengubah CSS/JS:  python3 tools/versi_aset.py
"""
import glob, hashlib, os, re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POLA = re.compile(r'((?:src|href)=")((?:assets|\.\./assets)/[^"?]+\.(?:js|css))(?:\?v=[0-9a-f]+)?(")')


def sidik(path):
    with open(path, "rb") as f:
        return hashlib.sha1(f.read()).hexdigest()[:8]


def ganti(html_path):
    folder = os.path.dirname(html_path)

    def versi(m):
        berkas = os.path.normpath(os.path.join(folder, m.group(2)))
        if not os.path.exists(berkas):
            return m.group(0)
        return f"{m.group(1)}{m.group(2)}?v={sidik(berkas)}{m.group(3)}"

    asli = open(html_path, encoding="utf-8").read()
    baru = POLA.sub(versi, asli)
    if baru != asli:
        open(html_path, "w", encoding="utf-8").write(baru)
        return True
    return False


halaman = sorted(glob.glob(os.path.join(REPO, "*.html")))
berubah = [os.path.basename(h) for h in halaman if ganti(h)]
print("diperbarui:", ", ".join(berubah) if berubah else "tidak ada (versi sudah terbaru)")
