#!/usr/bin/env python3
"""Menyiapkan video latar (hero) untuk situs: python3 tools/siapkan_video.py ASLI.mp4 FOLDER/NAMA

Menghasilkan, dari satu video asli (resolusi & ukuran berapa pun):
  FOLDER/NAMA.mp4      1920 px, 30 fps — untuk layar lebar
  FOLDER/NAMA-hp.mp4   1280 px, 30 fps — untuk HP (lebih hemat kuota)
  FOLDER/NAMA.webp     poster: bingkai pertama video, tampil selagi video dimuat
Suara dibuang. Ujung video dibaurkan ke awalnya (crossfade) agar perulangannya tidak terlihat
melompat, sehingga hasilnya lebih pendek sebanyak --baur detik. Target ukuran: di bawah ±8 MB
(layar lebar) dan ±4 MB (HP); naikkan --crf bila masih lebih besar. Butuh ffmpeg.

Contoh: python3 tools/siapkan_video.py "data/mahwatu hero.mp4" img/wisata/mah-watu/latar
"""
import argparse
import json
import os
import subprocess


def durasi(berkas):
    keluaran = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", berkas],
                              capture_output=True, text=True, check=True).stdout
    return float(json.loads(keluaran)["format"]["duration"])


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("asli")
    p.add_argument("tujuan", help="alamat tanpa akhiran, mis. img/wisata/mah-watu/latar")
    p.add_argument("--baur", type=float, default=1.0, help="lama crossfade di sambungan (detik)")
    p.add_argument("--crf", type=int, default=27,
                   help="kualitas H.264: makin besar makin kecil berkasnya (bawaan 27; video yang ramai gerak, mis. drone, ±31)")
    a = p.parse_args()
    os.makedirs(os.path.dirname(a.tujuan) or ".", exist_ok=True)

    d, f = durasi(a.asli), a.baur
    # Potongan [f, d] diikuti potongan [0, f] yang dibaurkan masuk: bingkai terakhir hasil = bingkai f asli
    # = bingkai pertama hasil, jadi sambungan perulangan mulus.
    baur = (f"[0:v]fps=30,split[a][b];[a]trim=start={f},setpts=PTS-STARTPTS[a1];"
            f"[b]trim=end={f},setpts=PTS-STARTPTS[b1];"
            f"[a1][b1]xfade=transition=fade:duration={f}:offset={d - 2 * f:.3f},format=yuv420p,split[v1][v2]")
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-i", a.asli, "-filter_complex",
        baur + ";[v1]scale=1920:-2[besar];[v2]scale=1280:-2[kecil]",
        "-map", "[besar]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf), "-movflags", "+faststart", a.tujuan + ".mp4",
        "-map", "[kecil]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf + 1), "-movflags", "+faststart", a.tujuan + "-hp.mp4",
    ], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", a.tujuan + ".mp4", "-frames:v", "1", "-quality", "80",
                    a.tujuan + ".webp"], check=True)
    for akhiran in (".mp4", "-hp.mp4", ".webp"):
        print(f"{a.tujuan}{akhiran}: {os.path.getsize(a.tujuan + akhiran) / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
