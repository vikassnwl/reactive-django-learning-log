import os
from pathlib import Path
from PIL import Image
from django.core.files.storage import default_storage


def handleThumbnail(file, file_name, size):
    file_, ext = os.path.splitext(file_name)
    thumb_file = Image.open(file).resize(size, Image.ANTIALIAS)
    BASE_DIR = Path(__file__).resolve().parent.parent
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    fp = os.path.join(MEDIA_ROOT, file_+'-thumb'+ext)
    thumb_file.save(fp, optimize=True, quality=95)
    # default_storage.save(file_+'-thumb'+ext, thumb_file)
