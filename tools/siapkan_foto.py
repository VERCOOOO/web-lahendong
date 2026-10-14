#!/usr/bin/env python3
"""Menyiapkan foto untuk situs: python3 tools/siapkan_foto.py ASLI TUJUAN.webp [--jenis kartu|latar|galeri|hero|potret]

  kartu   dipotong ke 3:2 dari tengah, 1200 × 800 px (kartu di halaman Wisata & Beranda)
  latar   rasio asli, sisi lebar paling besar 1920 px (latar kop detail wisata)
  galeri  rasio asli, sisi terpanjang paling besar 1600 px (galeri; potret maupun lanskap)
  hero    rasio asli, lebar 1920 px + versi HP TUJUAN-hp.webp lebar 960 px (kop halaman, img/hero/)
  potret  dipotong ke 3:4 dari tengah-atas, 600 × 800 px (pas foto KKT & dosen, img/kkt/)

Orientasi dari kamera HP (EXIF) dibetulkan, warna diubah ke sRGB, bingkai hitam dibuang, hasilnya WebP; foto HEIC (iPhone)
dibaca lewat pillow-heif (pip install pillow-heif) atau, bila tidak ada, ImageMagick.
Foto asli cukup disimpan di data/ (tidak ikut di-commit); hanya hasil di img/ yang masuk repo.
Butuh Pillow (pip install pillow); untuk HEIC sebaiknya juga pillow-heif.

Contoh: python3 tools/siapkan_foto.py "data/linow/linow card.png" img/wisata/danau-linow/kartu.webp --jenis kartu
"""
import argparse
import io
import os
import subprocess
import tempfile

from PIL import Image, ImageCms, ImageOps

try:  # foto iPhone (HEIC/HEVC): pillow-heif membawa dekodernya sendiri; tanpa itu dipakai ImageMagick
    import pillow_heif
    pillow_heif.register_heif_opener()
    HEIF_LANGSUNG = True
except ImportError:
    HEIF_LANGSUNG = False


def ke_srgb(im):
    """Foto HP (mis. iPhone, Display P3) diubah ke sRGB: WebP disimpan tanpa profil warna, jadi tanpa
    konversi ini warnanya tampil pucat di browser."""
    icc = im.info.get("icc_profile")
    if not icc:
        return im.convert("RGB")
    try:
        sumber = ImageCms.ImageCmsProfile(io.BytesIO(icc))
        return ImageCms.profileToProfile(im.convert("RGB"), sumber, ImageCms.createProfile("sRGB"), outputMode="RGB")
    except (OSError, ImageCms.PyCMSError):
        return im.convert("RGB")


def buka(asli):
    """HEIC dibaca pillow-heif bila terpasang; bila tidak, diubah dulu ke PNG sementara dengan ImageMagick."""
    if HEIF_LANGSUNG or not asli.lower().endswith((".heic", ".heif")):
        im = Image.open(asli)
        icc = im.info.get("icc_profile")
        im = ImageOps.exif_transpose(im)
        if icc:
            im.info["icc_profile"] = icc
        return ke_srgb(im)
    with tempfile.TemporaryDirectory() as tmp:
        png = os.path.join(tmp, "foto.png")
        subprocess.run(["convert", asli, "-auto-orient", png], check=True)
        im = Image.open(png)
        im.load()  # baca sebelum folder sementara dihapus
        return ke_srgb(im)


def buang_bingkai(im, ambang=24):
    """Buang bingkai hitam (mis. foto 16:9 di kanvas lebar, hasil ekspor video). Baris/kolom dibuang
    hanya bila SELURUH pikselnya hampir hitam DAN bingkainya simetris (kiri ≈ kanan atau atas ≈ bawah),
    jadi pas foto berlatar gelap atau foto malam yang langitnya hitam tidak ikut terpotong."""
    kotak = im.convert("L").point(lambda v: 255 if v > ambang else 0).getbbox()
    if not kotak:
        return im
    kiri, atas, kanan, bawah = kotak[0], kotak[1], im.width - kotak[2], im.height - kotak[3]
    simetris = lambda a, b, n: abs(a - b) <= max(2, n * 0.01)
    if not (simetris(kiri, kanan, im.width) and simetris(atas, bawah, im.height)):
        return im
    if kotak != (0, 0, im.width, im.height):
        print(f"  bingkai hitam dibuang: {im.width} × {im.height} → {kotak[2] - kotak[0]} × {kotak[3] - kotak[1]}")
        return im.crop(kotak)
    return im


def simpan(im, tujuan):
    os.makedirs(os.path.dirname(tujuan) or ".", exist_ok=True)
    im.save(tujuan, quality=80, method=6)
    print(f"{tujuan}: {im.width} × {im.height}, {os.path.getsize(tujuan) / 1e3:.0f} KB")


def siapkan(asli, tujuan, jenis):
    im = buang_bingkai(buka(asli))
    if jenis == "kartu":
        im = ImageOps.fit(im, (1200, 800), Image.LANCZOS)
    elif jenis == "potret":
        im = ImageOps.fit(im, (600, 800), Image.LANCZOS, centering=(0.5, 0.3))
    elif jenis == "hero":
        hp = im.copy()
        hp.thumbnail((960, 960 * 4), Image.LANCZOS)
        simpan(hp, tujuan.removesuffix(".webp") + "-hp.webp")
        im.thumbnail((1920, 1920 * 4), Image.LANCZOS)
    else:
        batas = (1920, 1920 * 4) if jenis == "latar" else (1600, 1600)
        im.thumbnail(batas, Image.LANCZOS)
    simpan(im, tujuan)


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("asli")
    p.add_argument("tujuan")
    p.add_argument("--jenis", choices=["kartu", "latar", "galeri", "hero", "potret"], default="galeri")
    a = p.parse_args()
    siapkan(a.asli, a.tujuan, a.jenis)
