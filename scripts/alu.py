"""Vignettes « aluminium froissé » pour les cartes de projets.

La photo est imprimée sur une feuille d'argent froissée générée par le
script : facettes planes, plis droits, et sur chacune le reflet d'un
studio photo (sources lumineuses, murs clairs et sombres). Un vernis
brillant laisse les reflets passer par-dessus l'image. La feuille a des
bords légèrement irréguliers (alpha).

Utilisation (depuis la racine du projet) :
    python3 scripts/alu.py public/img/projets/photo.webp public/img/projets/argent/photo.webp [graine]

La graine (un entier) change la forme des plis : une par projet.
Dépendances : Pillow et NumPy (pip install pillow numpy).
"""
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageOps

WIDTH, HEIGHT = 640, 800  # format 4:5 des cartes


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


def foil_reflection(seed):
    """Reflet d'un studio sur une feuille d'argent froissée, de 0 (sombre)
    à ~1,4 (éclats). Chaque facette reflète une autre partie du studio :
    c'est ce contraste franc entre facettes voisines qui fait le métal."""
    rng = np.random.default_rng(seed)
    height = np.zeros((HEIGHT, WIDTH), np.float32)
    for cells, amp in [(3, 1.0), (6, 0.6), (11, 0.28), (22, 0.08)]:
        layer = facet_layer(rng, cells, rng.uniform(0, 180))
        ridged = 1.0 - np.abs(2 * layer - 1)
        height += amp * (0.88 * layer + 0.12 * ridged)
    gy, gx = np.gradient(height * 21.0)
    nz = 1.0 / np.sqrt(gx * gx + gy * gy + 1)
    nx, ny = -gx * nz, -gy * nz
    rx, ry = 2 * nz * nx, 2 * nz * ny  # direction réfléchie (vue de face)
    # studio : plus clair en haut, bandes de murs clairs et sombres
    env = 0.5 - 0.42 * ry + 0.12 * rx + 0.28 * np.sin(3.2 * rx - 1.1 * ry + 0.6)
    for cx, cy, r2, k in [(-0.3, -0.5, 0.06, 0.55), (0.5, -0.2, 0.03, 0.45), (0.1, 0.45, 0.02, 0.3)]:
        env += k * np.exp(-((rx - cx) ** 2 + (ry - cy) ** 2) / r2)  # sources lumineuses
    for cx, cy, r2, k in [(0.55, 0.45, 0.05, 0.55), (-0.65, 0.2, 0.03, 0.45)]:
        env -= k * np.exp(-((rx - cx) ** 2 + (ry - cy) ** 2) / r2)  # drapeaux noirs
    env += 0.5 * np.exp(-((0.8 * rx + 0.6 * ry - 0.15) ** 2) / 0.003)  # réglette fine
    env += (1 - nz) ** 2 * 0.3  # les facettes très inclinées brillent (Fresnel)
    return np.clip(env, 0, 1.4)


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
    c = foil_reflection(seed)[..., None]
    tone = photo_tone(src)[..., None]
    highlight = np.array([238, 242, 250], np.float32)  # reflets froids
    shadow = np.array([52, 55, 63], np.float32)  # creux gris profond
    metal = shadow + (highlight - shadow) * np.clip(c, 0, 1)
    # photo imprimée sur l'argent, puis un vernis brillant : les reflets
    # passent aussi par-dessus l'encre sombre
    gloss = np.clip(c - 0.72, 0, 1) ** 1.2 * 255 * 0.85
    rgb = np.clip(metal * (0.3 + 0.7 * tone) + gloss, 0, 255)
    out = Image.fromarray(rgb.astype("uint8"), "RGB")
    out.putalpha(ragged_mask(seed))
    out.save(dst, quality=62, method=6, alpha_quality=60)


if __name__ == "__main__":
    if len(sys.argv) not in (3, 4):
        sys.exit(__doc__)
    alu(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) == 4 else 1)
