import sys
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent
sys.path.append(str(BASE_DIR))

import gmail_sender

to_email = "connect@ekidea.in"
to_name = "Aneesh Rathi"
subject = "Re: Quick question about your video content, Aneesh"
body = """Hi Aneesh,

really looking forward to our call today at 5pm CET.

Here's the Google Meet link: https://meet.google.com/vtp-vqts-srh

See you soon!

Best,
Tim
"""

print(f"Enviando enlace de Meet a Aneesh ({to_email})...")
success = gmail_sender.send_email(
    to_email=to_email,
    to_name=to_name,
    subject=subject,
    body=body,
    sender_email="tim@la27productions.com",
    sender_name="Tim Helmes"
)

if success:
    print("¡Correo enviado con éxito!")
else:
    print("Fallo al enviar el correo.")
