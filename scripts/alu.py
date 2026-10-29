"""Vignettes « aluminium froissé » pour les cartes de projets.

La photo est imprimée en argent, en tons continus, sur une feuille
d'aluminium froissée générée par le script : facettes planes, plis droits,
reflets métalliques. Les plis traversent l'image (plus sombre dans les
creux, brillante sur les arêtes) et la feuille a des bords légèrement
irréguliers (alpha).

Utilisation (depuis la racine du projet) :
    python3 scripts/alu.py public/img/projets/photo.webp public/img/projets/alu/photo.webp [graine]

La graine (un entier) change la forme des plis : une par projet.
Dépendances : Pillow et NumPy (pip install pillow numpy).
"""
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageOps

WIDTH, HEIGHT = 640, 800  # format 4:5 des cartes
SILVER = np.array([200, 204, 212], np.float32)  # argent légèrement froid


def facet_layer(rng, cells, angle):
    """Grille aléatoire agrandie en bilinéaire puis tournée : des facettes
    planes et des arêtes droites, comme une feuille froissée."""
    big = int(max(WIDTH, HEIGHT) * 1.5)
    n = max(2, int(cells * 1.5))
    grid = rng.random((n, n)).astype(np.float32)
    im = Image.fromarray(grid, mode="F").resize((big, big), Image.BILINEAR)
    im = im.rotate(angle, resample=Image.BILINEAR)
    left, top = (big - WIDTH) // 2, (big - HEIGHT) // 2
    return np.asarray(im.crop((left, top, left + WIDTH, top + HEIGHT)), dtype=np.float32)


def foil_shade(seed):
    """Éclairage de la feuille froissée, de 0 (creux sombre) à 1 (reflet)."""
    rng = np.random.default_rng(seed)
    height = np.zeros((HEIGHT, WIDTH), np.float32)
    for cells, amp in [(4, 1.0), (7, 0.6), (13, 0.3), (26, 0.12)]:
        layer = facet_layer(rng, cells, rng.uniform(0, 180))
        ridged = 1.0 - np.abs(2 * layer - 1)
        height += amp * (0.88 * layer + 0.12 * ridged)
    gy, gx = np.gradient(height * 14.0)
    nz = 1.0 / np.sqrt(gx * gx + gy * gy + 1)
    nx, ny = -gx * nz, -gy * nz
    # Reflets d'un environnement de studio : bandes claires et sombres selon
    # l'orientation de chaque facette, typique du métal.
    env = 0.5 + 0.5 * np.sin(6.5 * nx + 4.0 * ny + 1.3) * np.cos(5.0 * ny - 2.5 * nx + 0.4)
    light = np.clip(0.55 * nx - 0.45 * ny + 0.7 * nz, 0, 1)  # lumière en haut à gauche
    shade = 0.6 * env ** 1.6 + 0.5 * light ** 4
    return np.clip((shade - 0.12) * 1.55, 0, 1)


def ragged_mask(seed, inset=10, jitter=7, step=60, ss=3):
    """Contour de feuille légèrement irrégulier (bords froissés)."""
    rng = np.random.default_rng(seed + 1000)
    pts = []
    w, h = WIDTH * ss, HEIGHT * ss
    i, j, s = inset * ss, jitter * ss, step * ss

    def wob():
        return rng.uniform(-j, j)

    for x in range(0, w + 1, s):
        pts.append((x, i + wob()))
    for y in range(s, h + 1, s):
        pts.append((w - i + wob(), y))
    for x in range(w - s, -1, -s):
        pts.append((x, h - i + wob()))
    for y in range(h - s, 0, -s):
        pts.append((i + wob(), y))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).polygon(pts, fill=255)
    return mask.resize((WIDTH, HEIGHT), Image.LANCZOS)


def photo_tone(src):
    """Photo en niveaux de gris, recadrée au format de la carte (0 à 1)."""
    im = Image.open(src).convert("L")
    im = ImageOps.fit(im, (WIDTH, HEIGHT), Image.LANCZOS)
    im = ImageOps.autocontrast(im, cutoff=1)
    return np.asarray(im, dtype=np.float32) / 255.0


def alu(src, dst, seed=1):
    shade = foil_shade(seed)[..., None]
    tone = photo_tone(src)[..., None]
    # Impression argent : la photo module la luminosité du métal, et les
    # plis la traversent (creux plus sombres, éclat blanc sur les arêtes).
    metal = SILVER * 1.25 * (0.12 + 0.88 * tone) * (0.5 + 0.65 * shade)
    sheen = (shade ** 10) * 60
    rgb = np.clip(metal + sheen, 0, 255)
    out = Image.fromarray(rgb.astype("uint8"), "RGB")
    out.putalpha(ragged_mask(seed))
    out.save(dst, quality=62, method=6, alpha_quality=60)


if __name__ == "__main__":
    if len(sys.argv) not in (3, 4):
        sys.exit(__doc__)
    alu(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) == 4 else 1)
