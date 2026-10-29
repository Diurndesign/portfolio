"""Trame bleu roi pour les vignettes de projets.

Transforme une photo en impression tramée : points d'encre bleu roi
(#010d94) sur papier clair, avec un grain pellicule. Le résultat est
recadré au format portrait 4:5 des cartes de l'accueil.

Utilisation (depuis la racine du projet) :
    python3 scripts/trame.py public/img/projets/photo.webp public/img/projets/trame/photo.webp

Dépendances : Pillow et NumPy (pip install pillow numpy).
"""
import math
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

INK = np.array([1, 13, 148], dtype=float)  # bleu roi du site ($color-blue)
PAPER = np.array([246, 244, 239], dtype=float)  # papier légèrement chaud
WIDTH, HEIGHT = 720, 900  # format 4:5 des cartes (2x la largeur affichée)
CELL = 10  # pas de la trame en pixels (taille des points)
ANGLE = 45  # inclinaison classique d'une trame d'imprimerie
SUPERSAMPLE = 3  # dessin en haute définition puis réduction (points nets)
GAMMA = 0.6  # < 1 éclaircit les tons moyens


def halftone(src, dst, seed=7):
    im = Image.open(src).convert("L")
    im = ImageOps.fit(im, (WIDTH, HEIGHT), Image.LANCZOS)  # recadrage centré
    im = ImageOps.autocontrast(im, cutoff=1)
    # Éclaircit les tons moyens : sans ça, les photos sombres deviennent
    # des aplats d'encre et l'image ne se lit plus.
    im = im.point(lambda v: round(255 * (v / 255) ** GAMMA))

    # Trame inclinée : on tourne l'image, on pose les points sur une grille
    # droite, puis on remet l'ensemble d'aplomb.
    big = im.rotate(ANGLE, expand=True, fillcolor=255, resample=Image.BICUBIC)
    bw, bh = big.size
    tones = np.asarray(big, dtype=float) / 255.0
    canvas = Image.new("L", (bw * SUPERSAMPLE, bh * SUPERSAMPLE), 255)
    draw = ImageDraw.Draw(canvas)
    for y in range(0, bh, CELL):
        for x in range(0, bw, CELL):
            darkness = 1.0 - tones[y:y + CELL, x:x + CELL].mean()
            # rayon tel que la surface du point suit la densité du ton ;
            # au-delà de ~0,78 les points se touchent (aplats sombres)
            r = CELL * 0.5 * math.sqrt(darkness) * 1.25
            if r < 0.35:
                continue
            cx = (x + CELL / 2) * SUPERSAMPLE
            cy = (y + CELL / 2) * SUPERSAMPLE
            rr = r * SUPERSAMPLE
            draw.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=0)
    canvas = canvas.resize((bw, bh), Image.LANCZOS)
    back = canvas.rotate(-ANGLE, expand=True, fillcolor=255, resample=Image.BICUBIC)
    cx, cy = back.size[0] // 2, back.size[1] // 2
    back = back.crop((cx - WIDTH // 2, cy - HEIGHT // 2,
                      cx - WIDTH // 2 + WIDTH, cy - HEIGHT // 2 + HEIGHT))

    # Quelques poussières d'encre. Le grain pellicule fin est ajouté en CSS
    # (une seule petite texture partagée), sinon chaque image pèse 3 fois plus.
    rng = np.random.default_rng(seed)
    tone = np.asarray(back, dtype=float)
    dust = rng.random(tone.shape)
    tone[dust > 0.9995] -= 140  # petites taches d'encre
    tone[dust < 0.0005] += 140  # petits manques
    tone = np.clip(tone, 0, 255)
    tone = np.asarray(Image.fromarray(tone.astype("uint8")).filter(ImageFilter.GaussianBlur(0.3)), dtype=float)

    # Bichromie : 0 = encre bleu roi, 255 = papier
    t = (tone / 255.0)[..., None]
    rgb = INK + (PAPER - INK) * t
    # 4 nuances (encre, papier, deux tons de bord) en WebP sans perte : une
    # trame se compresse 2 à 3 fois mieux ainsi qu'en WebP classique.
    out = Image.fromarray(rgb.astype("uint8"), "RGB")
    out = out.quantize(colors=4, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    out.convert("RGB").save(dst, lossless=True, method=6)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    halftone(sys.argv[1], sys.argv[2])
