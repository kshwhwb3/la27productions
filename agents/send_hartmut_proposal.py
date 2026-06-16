import sys
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent
sys.path.append(str(BASE_DIR))

import gmail_sender

to_email = "h.vonschwiderski@avaluequestconsulting.com"
to_name = "Hartmut von Schwiderski"
subject = "Re: Video-Konzept für ProNutraQuest"
body = """Hallo Hartmut,

wir haben die Zahlen nochmal durchgerechnet — für ein einzelnes VSL zu 1.000 € ist die Marge für uns ehrlich gesagt sehr knapp.

Aber wenn wir langfristig zusammenarbeiten und du weitere VSLs und Ads mit uns produzierst, kann das für beide Seiten ein echtes Win-Win werden.

Deshalb unser Vorschlag:

### Option A — Partnerschaft (2–3 Projekte):
* **VSL (30 Min.):** 1.000 € — inklusive AI-Avatar Dr. Wood (HeyGen, lip-synced), nativer englischer Sprecher, dynamischer B-Roll-Schnitt, Original-Musik und Sound Design
* **Video Ad:** 100 €

### Option B — Einzelprojekt:
* **VSL (30 Min.):** 1.200 € — gleiche Topqualität, keine weitere Verpflichtung

Bei Option A und Option B bekommt ihr also die volle Premiumproduktion zum Preis, den ihr vorgeschlagen habt.

Was denkst du?

Beste Grüße,
Tim
"""

print(f"Enviando propuesta a Hartmut ({to_email})...")
success = gmail_sender.send_email(
    to_email=to_email,
    to_name=to_name,
    subject=subject,
    body=body,
    sender_email="tim@la27productions.com",
    sender_name="Tim Helmes"
)

if success:
    print("¡Propuesta enviada con éxito!")
else:
    print("Fallo al enviar la propuesta.")
