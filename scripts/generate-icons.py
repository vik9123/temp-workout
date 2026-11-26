#!/usr/bin/env python3
"""Генерирует иконки PWA в public/: синий квадрат со скруглением + оранжевая молния.

Запуск:  python3 scripts/generate-icons.py   (нужен Pillow: pip install Pillow)
Выход:   public/icon-180.png, icon-192.png, icon-512.png, icon-512-maskable.png
"""

from PIL import Image, ImageDraw

NAVY = (0, 3, 18)        # #000312 — фон приложения
ORANGE = (249, 94, 44)   # #F95E2C — акцент

# Контур молнии на сетке 512x512
BOLT = [
    (287, 127), (276, 143), (265, 159), (254, 175), (243, 191), (232, 207),
    (221, 223), (210, 239), (199, 255), (197, 263), (217, 263), (227, 263),
    (221, 303), (213, 335), (207, 367), (206, 383), (226, 351), (246, 319),
    (266, 287), (286, 255), (306, 239), (321, 239), (301, 239), (293, 239),
    (307, 207), (321, 175), (335, 143), (347, 127), (317, 127), (302, 127),
]


def draw_icon(size: int, rounded: bool) -> Image.Image:
    """Рисует иконку с 4-кратным суперсэмплингом и сжимает до нужного размера."""
    S = 4
    W = size * S
    img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    if rounded:
        radius = int(100 / 512 * W)  # радиус из оригинала ~19.7%
        d.rounded_rectangle([0, 0, W - 1, W - 1], radius=radius, fill=NAVY + (255,))
    else:
        d.rectangle([0, 0, W, W], fill=NAVY + (255,))

    k = W / 512
    bolt = [(int(x * k), int(y * k)) for x, y in BOLT]
    d.polygon(bolt, fill=ORANGE + (255,))

    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    import os

    out = os.path.join(os.path.dirname(__file__), "..", "public")
    os.makedirs(out, exist_ok=True)

    for size in (180, 192, 512):
        draw_icon(size, rounded=True).save(os.path.join(out, f"icon-{size}.png"))
    draw_icon(512, rounded=False).save(os.path.join(out, "icon-512-maskable.png"))
    print("Иконки готовы: icon-180, icon-192, icon-512, icon-512-maskable")


if __name__ == "__main__":
    main()
