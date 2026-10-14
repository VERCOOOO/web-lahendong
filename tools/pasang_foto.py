#!/usr/bin/env python3
"""Memasang foto dari satu folder (mis. hasil unduhan Google Drive) ke tempatnya, menurut nama berkas.

  hero-<halaman>.jpg|png|…   → img/hero/<halaman>.webp + <halaman>-hp.webp   (mis. hero-profil.jpg)
  <nim>.jpg|png|…            → img/kkt/<nim>.webp                            (mis. 230211060074.png)
  dosenpemlap / dosenpenglap → img/kkt/dosenpemlap.webp / dosenpenglap.webp  (pembimbing / pengawas)

Hanya menimpa berkas yang sudah ada (placeholder), jadi nama yang salah ketik dilaporkan, bukan
membuat berkas baru diam-diam. Kode situs tidak perlu diubah. Hero Beranda berupa video: pakai
tools/siapkan_video.py.

Pakai: python3 tools/pasang_foto.py FOLDER
"""
import os
import sys

from siapkan_foto import siapkan

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOTO = (".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif")


def tujuan_dari(nama):
    """hero-profil → (img/hero/profil.webp, hero); 230211060074 → (img/kkt/230211060074.webp, potret)."""
    kode = nama.strip().lower().replace(" ", "-").replace("_", "-")
    if kode.startswith("hero-"):
        return os.path.join(REPO, "img", "hero", kode[5:] + ".webp"), "hero"
    return os.path.join(REPO, "img", "kkt", kode.replace("-", "") + ".webp"), "potret"


def main(folder):
    dilewati = []
    for akar, _, berkas in os.walk(folder):
        for b in sorted(berkas):
            nama, akhiran = os.path.splitext(b)
            if akhiran.lower() not in FOTO:
                continue
            tujuan, jenis = tujuan_dari(nama)
            if not os.path.exists(tujuan):
                dilewati.append(f"{b} (tidak ada tempat {os.path.relpath(tujuan, REPO)})")
                continue
            siapkan(os.path.join(akar, b), tujuan, jenis)
    for d in dilewati:
        print("dilewati:", d)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
