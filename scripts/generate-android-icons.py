#!/usr/bin/env python3
"""Генерирует иконки Android (mipmap-*) поверх проекта, созданного `npx cap add android`.

Запуск:  python3 scripts/generate-android-icons.py   (нужен Pillow)
Требует: папку android/ в корне проекта (создаётся командой `npx cap add android`)
"""

import importlib.util
import os
import sys

from PIL import Image, ImageDraw

# Импортируем BOLT/цвета из generate-icons.py (в имени файла дефис — грузим через importlib)
_here = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location("genicons", os.path.join(_here, "generate-icons.py"))
_genicons = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_genicons)

NAVY = _genicons.NAVY
ORANGE = _genicons.ORANGE
BOLT = _genicons.BOLT
draw_icon = _genicons.draw_icon

# Размеры иконки лаунчера по плотностям (foreground адаптивной иконки = 108/48 от этого)
DENSITIES = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}

RES = os.path.join(_here, "..", "android", "app", "src", "main", "res")


def draw_circle(size: int) -> Image.Image:
    """Круглая иконка: синий круг + молния (для ic_launcher_round)."""
    S = 4
    W = size * S
    img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([0, 0, W - 1, W - 1], fill=NAVY + (255,))
    k = W / 512
    d.polygon([(int(x * k), int(y * k)) for x, y in BOLT], fill=ORANGE + (255,))
    return img.resize((size, size), Image.LANCZOS)


def draw_foreground(size: int) -> Image.Image:
    """Слой адаптивной иконки: скруглённый квадрат в центре прозрачного холста.

    Холст 108dp, видимая зона иконки — внутренние 72dp; остальное срезает маска,
    под углами просвечивает фон ic_launcher_background (#000312).
    """
    fg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    inner = int(round(size * 72 / 108))
    icon = draw_icon(inner, rounded=True)
    off = (size - inner) // 2
    fg.paste(icon, (off, off), icon)
    return fg


def main() -> None:
    if not os.path.isdir(RES):
        sys.exit("Папка android/ не найдена — сначала выполни: npx cap add android")

    for name, size in DENSITIES.items():
        out = os.path.join(RES, f"mipmap-{name}")
        os.makedirs(out, exist_ok=True)
        draw_icon(size, rounded=True).save(os.path.join(out, "ic_launcher.png"))
        draw_circle(size).save(os.path.join(out, "ic_launcher_round.png"))
        draw_foreground(size * 108 // 48).save(os.path.join(out, "ic_launcher_foreground.png"))

    values = os.path.join(RES, "values")
    os.makedirs(values, exist_ok=True)
    with open(os.path.join(values, "ic_launcher_background.xml"), "w", encoding="utf-8") as f:
        f.write(
            '<?xml version="1.0" encoding="utf-8"?>\n'
            "<resources>\n"
            '    <color name="ic_launcher_background">#000312</color>\n'
            "</resources>\n"
        )
    print("Иконки Android готовы: mipmap-mdpi … mipmap-xxxhdpi")


if __name__ == "__main__":
    main()
