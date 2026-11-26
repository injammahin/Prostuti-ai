"""Render the first pages of circular PDFs to PNG: python render.py <out_dir> <max_pages> <zoom> <pdf>..."""
import os
import sys

import pymupdf

out, max_pages, zoom = sys.argv[1], int(sys.argv[2]), float(sys.argv[3])
os.makedirs(out, exist_ok=True)
for path in sys.argv[4:]:
    name = os.path.splitext(os.path.basename(path))[0]
    doc = pymupdf.open(path)
    print(f"{name}: {doc.page_count} pages")
    for number in range(min(max_pages, doc.page_count)):
        doc[number].get_pixmap(matrix=pymupdf.Matrix(zoom, zoom)).save(os.path.join(out, f"{name}-p{number + 1}.png"))
