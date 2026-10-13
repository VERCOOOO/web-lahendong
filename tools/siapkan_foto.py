#!/usr/bin/env python3
"""Menyiapkan foto untuk situs: python3 tools/siapkan_foto.py ASLI TUJUAN.webp [--jenis kartu|latar|galeri]

  kartu   dipotong ke 3:2 dari tengah, 1200 × 800 px (kartu di halaman Wisata & Beranda)
  latar   rasio asli, sisi lebar paling besar 1920 px (latar kop halaman)
  galeri  rasio asli, sisi terpanjang paling besar 1600 px (galeri; potret maupun lanskap)

Orientasi dari kamera HP (EXIF) dibetulkan, hasilnya WebP. Foto asli cukup disimpan di data/
(tidak ikut di-commit); hanya hasil di img/ yang masuk repo. Butuh Pillow (pip install pillow).

Contoh: python3 tools/siapkan_foto.py "data/linow/linow card.png" img/wisata/danau-linow/kartu.webp --jenis kartu
"""
import argparse
import os

from PIL import Image, ImageOps


def siapkan(asli, tujuan, jenis):
    im = ImageOps.exif_transpose(Image.open(asli)).convert("RGB")
    if jenis == "kartu":
        im = ImageOps.fit(im, (1200, 800), Image.LANCZOS)
    else:
        batas = (1920, 1920 * 4) if jenis == "latar" else (1600, 1600)
        im.thumbnail(batas, Image.LANCZOS)
    os.makedirs(os.path.dirname(tujuan) or ".", exist_ok=True)
    im.save(tujuan, quality=80, method=6)
    print(f"{tujuan}: {im.width} × {im.height}, {os.path.getsize(tujuan) / 1e3:.0f} KB")


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("asli")
    p.add_argument("tujuan")
    p.add_argument("--jenis", choices=["kartu", "latar", "galeri"], default="galeri")
    a = p.parse_args()
    siapkan(a.asli, a.tujuan, a.jenis)
