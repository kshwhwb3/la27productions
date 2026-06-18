import os
import sys
import json
import time
import random
import sqlite3
import base64
import shutil
import ctypes
import argparse
import subprocess
from ctypes import wintypes
from pathlib import Path
import requests

# Try to import cryptography and linkedin_api
try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
except ImportError:
    print("Error: 'cryptography' library is required. Install it using: pip install cryptography")
    sys.exit(1)

try:
    from linkedin_api import Linkedin
except ImportError:
    print("Error: 'linkedin-api' library is required. Install it using: pip install linkedin-api")
    sys.exit(1)

# Configuration & Paths
BASE_DIR = Path(__file__).parent
HISTORY_FILE = BASE_DIR / "linkedin_local_history.json"
REMOTE_IP = "35.185.44.165"
SSH_KEY_PATH = Path(os.environ.get("USERPROFILE", "")) / ".ssh" / "id_rsa"

# Windows DPAPI Structures for cookie decryption
class DATA_BLOB(ctypes.Structure):
    _fields_ = [("cbData", wintypes.DWORD), ("pbData", ctypes.POINTER(ctypes.c_char))]

def decrypt_key_with_dpapi(encrypted_key):
    in_blob = DATA_BLOB(len(encrypted_key), ctypes.create_string_buffer(encrypted_key))
    out_blob = DATA_BLOB()
    res = ctypes.windll.crypt32.CryptUnprotectData(
        ctypes.byref(in_blob), None, None, None, None, 0, ctypes.byref(out_blob)
    )
    if not res:
        raise Exception("CryptUnprotectData failed.")
    decrypted_key = ctypes.string_at(out_blob.pbData, out_blob.cbData)
    ctypes.windll.kernel32.LocalFree(out_blob.pbData)
    return decrypted_key

def get_encryption_key(local_state_path):
    if not os.path.exists(local_state_path):
        return None
    try:
        with open(local_state_path, "r", encoding="utf-8") as f:
            local_state = json.load(f)
        encrypted_key = base64.b64decode(local_state["os_crypt"]["encrypted_key"])
        encrypted_key = encrypted_key[5:] # Remove "DPAPI" header
        return decrypt_key_with_dpapi(encrypted_key)
    except Exception as e:
        print(f"Error getting encryption key: {e}")
        return None

def decrypt_cookie(encrypted_value, key):
    try:
        if encrypted_value.startswith(b'v10') or encrypted_value.startswith(b'v11'):
            nonce = encrypted_value[3:15]
            ciphertext = encrypted_value[15:]
            aesgcm = AESGCM(key)
            decrypted = aesgcm.decrypt(nonce, ciphertext, None)
            return decrypted.decode('utf-8')
        else:
            return decrypt_key_with_dpapi(encrypted_value).decode('utf-8')
    except Exception as e:
        return f"Error: {e}"

def extract_linkedin_cookies():
    """Extract LinkedIn session cookies from local Chrome/Edge databases."""
    browsers = {
        "Edge": {
            "local_state": os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Microsoft", "Edge", "User Data", "Local State"),
            "profiles": [
                os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Microsoft", "Edge", "User Data", "Default"),
                os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Microsoft", "Edge", "User Data", "Profile 1"),
                os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Microsoft", "Edge", "User Data", "Profile 2")
            ]
        },
        "Chrome": {
            "local_state": os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Google", "Chrome", "User Data", "Local State"),
            "profiles": [
                os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Google", "Chrome", "User Data", "Default"),
                os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Google", "Chrome", "User Data", "Profile 1"),
                os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Google", "Chrome", "User Data", "Profile 2")
            ]
        }
    }
    
    linkedin_cookies = {}
    
    for browser_name, paths in browsers.items():
        key = get_encryption_key(paths["local_state"])
        if not key:
            continue
            
        for profile_path in paths["profiles"]:
            db_path = os.path.join(profile_path, "Network", "Cookies")
            if not os.path.exists(db_path):
                db_path = os.path.join(profile_path, "Cookies")
            if not os.path.exists(db_path):
                continue
                
            temp_db = os.path.join(os.environ["TEMP"], f"temp_cookies_{browser_name}.db")
            if os.path.exists(temp_db):
                try: os.unlink(temp_db)
                except: pass
                
            # Copy cookie database to bypass locks using PowerShell with FileShare.ReadWrite share mode
            copied = False
            try:
                db_path_fixed = db_path.replace("\\", "/")
                temp_db_fixed = temp_db.replace("\\", "/")
                ps_script = f"""
                $ErrorActionPreference = 'Stop'
                $src = [System.IO.File]::Open('{db_path_fixed}', [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
                $dst = [System.IO.File]::Create('{temp_db_fixed}')
                $src.CopyTo($dst)
                $src.Close()
                $dst.Close()
                """
                res = subprocess.run(["powershell", "-Command", ps_script], capture_output=True, text=True)
                if res.returncode == 0 and os.path.exists(temp_db) and os.path.getsize(temp_db) > 0:
                    copied = True
            except Exception:
                pass

            if not copied:
                try:
                    shutil.copyfile(db_path, temp_db)
                    if os.path.exists(temp_db) and os.path.getsize(temp_db) > 0:
                        copied = True
                except Exception:
                    pass

            if not copied:
                continue
                
            conn = None
            try:
                conn = sqlite3.connect(temp_db)
                cursor = conn.cursor()
                cursor.execute("SELECT host_key, name, encrypted_value FROM cookies WHERE host_key LIKE '%linkedin.com%'")
                found_any = False
                for host, name, enc_val in cursor.fetchall():
                    if name in ["li_at", "JSESSIONID"]:
                        decrypted = decrypt_cookie(enc_val, key)
                        if "Error" not in decrypted:
                            linkedin_cookies[name] = decrypted
                            found_any = True
                conn.close()
                conn = None
                try: os.unlink(temp_db)
                except: pass
                
                if found_any and "li_at" in linkedin_cookies and "JSESSIONID" in linkedin_cookies:
                    print(f"[OK] Extracted active LinkedIn session from {browser_name} ({os.path.basename(profile_path)})")
                    return linkedin_cookies
            except Exception as e:
                if conn:
                    try: conn.close()
                    except: pass
                if os.path.exists(temp_db):
                    try: os.unlink(temp_db)
                    except: pass
                    
    return linkedin_cookies

def fetch_leads_from_server():
    """Retrieve outreach leads from remote GCP server CSV file via SSH."""
    if not SSH_KEY_PATH.exists():
        print(f"Error: SSH key not found at {SSH_KEY_PATH}")
        return []
    
    cmd = [
        "ssh", "-i", str(SSH_KEY_PATH), "-o", "StrictHostKeyChecking=no",
        f"timhe@{REMOTE_IP}", "cat /home/timhe/la27/LA27_leads_with_email.csv"
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", check=True)
        import csv
        import io
        f = io.StringIO(res.stdout)
        reader = csv.reader(f)
        rows = list(reader)
        if not rows:
            return []
        
        header = rows[0]
        try:
            idx_company = header.index("Company name")
            idx_email = header.index("Email")
            idx_url = header.index("Company website")
            idx_name = header.index("Contact name")
            idx_industry = header.index("Company industry")
            idx_location = header.index("Location")
        except ValueError:
            idx_company = 2
            idx_name = 0
            idx_url = 4
            idx_email = 6
            idx_industry = 5
            idx_location = 3
            
        leads = []
        for row in rows[1:]:
            if len(row) > max(idx_company, idx_email, idx_url):
                leads.append({
                    "company": row[idx_company].strip(),
                    "email": row[idx_email].strip(),
                    "website": row[idx_url].strip(),
                    "contact_name": row[idx_name].strip(),
                    "industry": row[idx_industry].strip(),
                    "location": row[idx_location].strip(),
                })
        return leads
    except Exception as e:
        print(f"Error fetching leads from server: {e}")
        return []

def load_history():
    if HISTORY_FILE.exists():
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def save_history(history):
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving local history: {e}")

def detect_language(location: str, email: str) -> str:
    loc = location.lower()
    em = email.lower()
    
    if "spain" in loc or "españa" in loc or "madrid" in loc or "barcelona" in loc or em.endswith(".es"):
        return "es"
    if "germany" in loc or "deutschland" in loc or "austria" in loc or "österreich" in loc or em.endswith(".de") or em.endswith(".at"):
        return "de"
    return "en"

def get_message_template(company, contact_name, industry, location, email):
    lang = detect_language(location, email)
    industry_lower = industry.lower()
    is_d2c = "supplement" in industry_lower or "nutrition" in industry_lower
    
    first_name = contact_name.split()[0] if contact_name else ("there" if lang == "en" else "Hola")
    
    if is_d2c:
        # Supplements D2C templates
        if lang == "es":
            return (
                f"Hola {first_name}, he visto vuestra marca {company}. Producimos VSLs y anuncios de vídeo "
                f"para marcas de suplementos con música original y edición premium. Conectemos: la27productions.com"
            )
        elif lang == "de":
            return (
                f"Hallo {first_name}, ich bin auf {company} gestoßen. Wir produzieren VSLs und Video-Ads "
                f"für Health & Supplement-Brands mit exklusiver Musik und professionellem Schnitt. Lass uns vernetzen: la27productions.com"
            )
        else:
            return (
                f"Hi {first_name}, came across {company}. We produce VSLs and video ads for health & "
                f"supplement brands with custom music and premium editing. Let's connect: la27productions.com"
            )
    else:
        # Agencies (Clutch) templates
        if lang == "es":
            return (
                f"Hola {first_name}, me encanta vuestro trabajo. Soy Tim de LA 27 Productions "
                f"(música original y diseño de sonido en Barcelona). Conectemos para futuras campañas: la27productions.com"
            )
        elif lang == "de":
            return (
                f"Hallo {first_name}, ich liebe eure Arbeit. Ich bin Tim von LA 27 Productions "
                f"(Originalmusik & Sounddesign aus Barcelona). Lass uns für zukünftige Kampagnen vernetzen: la27productions.com"
            )
        else:
            return (
                f"Hi {first_name}, love your work. I'm Tim from LA 27 Productions (original music & "
                f"sound design in Barcelona). Let's connect for future campaigns: la27productions.com"
            )

def send_invitation_raw(api, urn_id, message):
    """Fallback to direct Voyager POST if public_id resolution fails."""
    try:
        session = api.client.session
        csrf_token = api.client.session.cookies.get("JSESSIONID").strip('"')
        
        headers = {
            "accept": "application/vnd.linkedin.normalized+json+2.1",
            "content-type": "application/json",
            "csrf-token": csrf_token,
            "x-li-lang": "en_US",
            "x-restli-protocol-version": "2.0.0",
        }
        
        payload = {
            "invitee": {
                "inviteeUnion": {
                    "memberProfile": f"urn:li:fsd_profile:{urn_id}"
                }
            },
            "customMessage": message,
        }
        
        url = "https://www.linkedin.com/voyager/api/voyagerRelationshipsDashMemberRelationships?action=verifyQuotaAndCreateV2&decorationId=com.linkedin.voyager.dash.deco.relationships.InvitationCreationResultWithInvitee-2"
        resp = session.post(url, json=payload, headers=headers)
        return resp.status_code in (200, 201), resp.status_code, resp.text
    except Exception as e:
        return False, 999, str(e)

def run():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Perform a dry run without sending invitations.")
    parser.add_argument("--test-ssh", action="store_true", help="Test remote SSH leads retrieval.")
    args = parser.parse_args()
    
    print("=" * 60)
    print("   LA27 HYBRID LINKEDIN AGENT")
    print("=" * 60)
    
    if args.test_ssh:
        print("Testing SSH leads retrieval...")
        leads = fetch_leads_from_server()
        print(f"Success! Retrieved {len(leads)} leads from server.")
        if leads:
            print(f"First Lead Example: {leads[0]}")
        sys.exit(0)
        
    # 1. Extract local cookies
    cookies = extract_linkedin_cookies()
    if not cookies or "li_at" not in cookies:
        print("[ERROR] Could not extract active LinkedIn session cookies from local browser profiles.")
        print("\nNote: Google Chrome locks its database while active. If you are using Google Chrome:")
        print("  1. Close ALL Google Chrome windows completely (ensure no background processes remain).")
        print("  2. Run this script again.")
        print("\nAlternative:")
        print("  Log in to LinkedIn on Microsoft Edge once. Microsoft Edge database is not locked and can be read anytime.")
        sys.exit(1)
        
    cookie_jar = requests.cookies.cookiejar_from_dict({
        "li_at": cookies["li_at"].strip('"'),
        "JSESSIONID": cookies["JSESSIONID"].strip('"')
    })
    
    # 2. Login to LinkedIn API
    print("Initializing LinkedIn API client...")
    try:
        api = Linkedin("", "", cookies=cookie_jar)
        print("[OK] Connected to LinkedIn successfully.")
    except Exception as e:
        print(f"[ERROR] Failed to initialize LinkedIn client: {e}")
        sys.exit(1)
        
    # 3. Load sent history & remote leads
    history = load_history()
    leads = fetch_leads_from_server()
    if not leads:
        print("[ERROR] No leads fetched from the server. Check your SSH key / connection.")
        sys.exit(1)
        
    print(f"Loaded {len(leads)} leads from remote server.")
    
    # Find leads that haven't been contacted yet
    pending_leads = [l for l in leads if l["company"].lower() not in history]
    print(f"Found {len(pending_leads)} pending leads to process.")
    
    if not pending_leads:
        print("All leads have already been processed locally.")
        sys.exit(0)
        
    # Daily Run Configuration (Safe Limits)
    MAX_INVITES = 8
    RUN_DURATION_MINS = 12
    start_time = time.time()
    sent_count = 0
    
    for lead in pending_leads:
        # Check limits
        elapsed_mins = (time.time() - start_time) / 60.0
        if elapsed_mins >= RUN_DURATION_MINS:
            print(f"\nTime limit reached ({RUN_DURATION_MINS} mins). Stopping run.")
            break
        if sent_count >= MAX_INVITES:
            print(f"\nSent limit reached ({MAX_INVITES} invites). Stopping run to stay safe.")
            break
            
        company = lead["company"]
        print(f"\nProcessing target company: {company}")
        
        # Search for key decision maker profiles at this company
        search_query = f"{company} Creative Director OR Art Director OR Producer OR Marketing Director"
        print(f"  Searching: '{search_query}'...")
        
        try:
            results = api.search_people(
                keywords=search_query,
                limit=3
            )
        except Exception as e:
            print(f"  Search error: {e}")
            continue
            
        if not results:
            print("  No profiles found. Skipping.")
            # Record that we searched this company so we don't repeat it immediately
            history[company.lower()] = {
                "date": time.strftime("%Y-%m-%d"),
                "status": "not_found",
                "reason": "no_profiles_in_search"
            }
            save_history(history)
            continue
            
        # Target the first valid person found
        target_person = results[0]
        urn_id = target_person.get("urn_id")
        name = target_person.get("name", "Director")
        
        if not urn_id:
            print("  Person URN is missing. Skipping.")
            continue
            
        # Check if we've already sent to this exact URN in history
        already_sent_urn = any(
            isinstance(v, dict) and v.get("urn_id") == urn_id for v in history.values()
        )
        if already_sent_urn:
            print(f"  Already sent invitation to {name} (URN: {urn_id}) in a previous run. Skipping.")
            history[company.lower()] = {
                "date": time.strftime("%Y-%m-%d"),
                "status": "already_contacted",
                "urn_id": urn_id,
                "name": name
            }
            save_history(history)
            continue
            
        message = get_message_template(
            company=company,
            contact_name=name,
            industry=lead["industry"],
            location=lead["location"],
            email=lead["email"]
        )
        
        print(f"  Found contact: {name} (URN: {urn_id})")
        print(f"  Prepared Message: \"{message}\"")
        
        if args.dry_run:
            print(f"  [DRY RUN] Would send invitation to {name} for {company}.")
            sent_count += 1
            history[company.lower()] = {
                "date": time.strftime("%Y-%m-%d"),
                "status": "dry_run",
                "urn_id": urn_id,
                "name": name,
                "message": message
            }
            save_history(history)
            continue
            
        # Send connect request
        success = False
        try:
            # Try via public_id resolver
            profile = api.get_profile(urn_id=urn_id)
            public_id = profile.get('public_id', '') or profile.get('profile_id', '')
            if public_id:
                res = api.add_connection(public_id, message=message)
                if res not in (False, None):
                    success = True
                    print(f"  ✅ CONNECTION REQUEST SENT to {name} via add_connection!")
            
            if not success:
                # Fallback to manual Voyager API post
                success, status_code, body = send_invitation_raw(api, urn_id, message)
                if success:
                    print(f"  ✅ CONNECTION REQUEST SENT to {name} via raw Voyager POST!")
                else:
                    if status_code == 409:
                        print(f"  ⚠️ Already pending or connected to {name}.")
                        success = True # Mark as handled/skipped
                    elif status_code == 429:
                        print("  ⚠️ Rate limited by LinkedIn. Stopping run.")
                        break
                    else:
                        print(f"  ❌ Failed to send invitation. Code: {status_code}. Response: {body[:200]}")
        except Exception as ex:
            print(f"  Error sending invitation: {ex}")
            
        if success:
            sent_count += 1
            history[company.lower()] = {
                "date": time.strftime("%Y-%m-%d"),
                "status": "sent",
                "urn_id": urn_id,
                "name": name,
                "message": message
            }
            save_history(history)
            
            # Wait with a human-like delay between 60 to 120 seconds
            delay = random.uniform(60, 120)
            print(f"  Waiting {delay:.1f} seconds to simulate human interaction...")
            time.sleep(delay)
            
    print("\n" + "="*60)
    print(f"Run Finished. Sent {sent_count} invitations in {((time.time() - start_time)/60.0):.1f} minutes.")
    print("="*60 + "\n")

if __name__ == "__main__":
    run()
