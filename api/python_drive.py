import json
import requests
import os
from pathlib import Path


def upload(fname):

    BASE_DIR = Path(__file__).resolve().parent.parent
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    fp = os.path.join(MEDIA_ROOT, fname)

    headers = {"Authorization": "Bearer ya29.a0AfH6SMDtHsKRTdRNjjX1i-Lyuti6Xi1R_RK7oRahyeTrm3VWvIhQN5u_6Xi6ol5dgzXb_GXe9hNeeQyfxh1OsAszaJMqC1eeWnaHKn7odPDCcuheTXlH6tQju2C45HeARfJ8LLFpSB8dL9hsGQ8TYkpP857K"}
    para = {
        "name": fname,
        "parents": ["1iFl4fzC5fHi1qMiSfow93HMoPyaeuNrl"]
    }
    files = {
        'data': ('metadata', json.dumps(para), 'application/json; charset=UTF-8'),
        'file': open(fp, "rb")
    }
    r = requests.post(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        headers=headers,
        files=files
    )
    return(r.json()['id'])
