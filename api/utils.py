import dropbox
import os
from pathlib import Path
from PIL import Image
from django.core.files.storage import default_storage
from io import BytesIO


def handleThumbnail(file, file_name, size):
    file_, ext = os.path.splitext(file_name)
    thumb_file = Image.open(file)
    thumb_file = Image.open(file).resize(size, Image.ANTIALIAS)
    fp = BytesIO()
    format = 'JPEG' if ext[1:].lower() == 'jpg' else ext[1:].upper()
    thumb_file.save(fp, format, optimize=True, quality=95)
    fp.seek(0)
    return fp.read(), file_+'-thumb'+ext


# upload file to dropbox using python
dbx = dropbox.Dropbox(os.environ.get('DBX_TOKEN'))


def upload_file(file, fname):
    file_location = f'/PythonFileUpload/{fname}'
    BASE_DIR = Path(__file__).resolve().parent.parent
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    fp = os.path.join(MEDIA_ROOT, fname)
    try:
        dbx.files_upload(file.open().read(), file_location,
                         mode=dropbox.files.WriteMode.overwrite)
    except:
        dbx.files_upload(file, file_location,
                         mode=dropbox.files.WriteMode.overwrite)

    return dbx.sharing_create_shared_link(file_location).url


def delete_file(fname):
    file_location = f'/PythonFileUpload/{fname}'
    dbx.files_delete(file_location)


def read_file(dbx, file):
    _, f = dbx.files_download(file)
    f = f.content
    #f = f.decode('utf-8')
    print(f)

#read_file(dbx, file_location)
