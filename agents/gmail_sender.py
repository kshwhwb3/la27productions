"""
Gmail Sender — sends emails via Gmail API (OAuth2).
Emails appear in Gmail Sent folder, SPF/DKIM correct, no spam issues.
Gmail limit: ~500 emails/day for personal accounts.
"""

import base64
import email.mime.text
from pathlib import Path

BASE_DIR = Path(__file__).parent
CREDENTIALS_FILE = BASE_DIR / "credentials.json"
TOKEN_FILE = BASE_DIR / "token.json"

SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
]

_service = None


def get_gmail_service():
    global _service
    if _service:
        return _service

    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build

    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
            try:
                creds = flow.run_local_server(port=0)
            except Exception:
                print("\n[AUTH] Local server failed. Opening browser for manual auth...")
                flow.redirect_uri = "urn:ietf:wg:oauth:2.0:oob"
                auth_url, _ = flow.authorization_url(prompt="consent")
                print(f"\nOpen this URL in your browser:\n{auth_url}\n")
                code = input("Paste the code from the browser here: ").strip()
                flow.fetch_token(code=code)
                creds = flow.credentials
        with open(TOKEN_FILE, "w") as f:
            f.write(creds.to_json())

    _service = build("gmail", "v1", credentials=creds)
    return _service


def send_email(to_email: str, to_name: str, subject: str, body: str,
               sender_email: str = "la27productions@gmail.com",
               sender_name: str = "Tim | LA 27 Productions") -> bool:
    """
    Send an email via Gmail API with both Plain Text and official HTML design.
    Returns True on success, False on failure.
    """
    try:
        service = get_gmail_service()
        
        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText
        from email_template import build_html
        
        # Detect language to choose correct HTML template CTA/tagline
        body_lower = body.lower()
        if any(w in body_lower for w in ["hola", "saludos", "música", "comercial"]):
            lang = "es"
        elif any(w in body_lower for w in ["hallo", "grüße", "musik", "werbung"]):
            lang = "de"
        else:
            lang = "en"
            
        html_body = build_html(body, lang=lang)

        msg = MIMEMultipart("alternative")
        
        # Encode To/From headers properly to handle special chars
        from email.header import Header
        import re as _re
        
        def safe_name(name: str) -> str:
            if not name:
                return ""
            name = _re.sub(r"[|<>()\[\]]", "", name).strip()
            try:
                name.encode("ascii")
                return name
            except UnicodeEncodeError:
                return str(Header(name, "utf-8"))
                
        safe_to   = safe_name(to_name)
        safe_from = safe_name(sender_name)
        msg["To"]      = f"{safe_to} <{to_email}>" if safe_to else to_email
        msg["From"]    = f"{safe_from} <{sender_email}>"
        msg["Subject"] = str(Header(subject, "utf-8")) if subject else ""
        
        # Attach plain text and HTML versions
        part1 = MIMEText(body, "plain", "utf-8")
        part2 = MIMEText(html_body, "html", "utf-8")
        msg.attach(part1)
        msg.attach(part2)

        raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
        service.users().messages().send(
            userId="me",
            body={"raw": raw}
        ).execute()
        return True

    except Exception as e:
        print(f"  [GmailSend] Error sending to {to_email}: {e}")
        return False
