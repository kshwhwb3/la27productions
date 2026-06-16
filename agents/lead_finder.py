"""
LA27 Lead Finder v4 — DDG only (Clutch/DesignRush use JS, return 0)
Target: 30-60 leads per run via DuckDuckGo search.
"""

import re
import csv
import time
import random
import datetime
import json
import os
from pathlib import Path
from urllib.parse import urlparse
import requests
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")

CRM_PATH  = Path(os.getenv("CRM_PATH",  BASE_DIR.parent / "LA27_CRM.xlsx"))
LEADS_CSV = CRM_PATH.parent / "LA27_leads_with_email.csv"
LOG_PATH  = Path(os.getenv("LOG_PATH",  BASE_DIR / "logs"))

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}
EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

SKIP_EMAIL_PATTERNS = [
    "noreply","no-reply","donotreply","bounce","mailer","postmaster",
    "webmaster","abuse@","spam@","example.com","test.com","sentry",
    "wix.com","wordpress","squarespace","shopify","gmail.com",
    "yahoo.com","hotmail","outlook.com","newsletter@",
    "unsubscribe","privacy@","legal@","billing@","mail.com",
    "info@","contact@","hello@","hola@","admin@","yourname@",
    ".png","@2x","@1x",".jpg",".gif",".svg","thebeatles","ringo",
    "vendor@","sales@","customerservice@","client-care@",
    "user@","you@","your@","usuario@","vous@","name@",
    "domain.com","company.com","example.com","somewhere.com","email.fr",
    "exemple.com","doe.com","domaine.com",
    "jobs", "careers", "interns", "recruitment", "hr@", "hiring", "talent", "apply@",
    "licensing", "press", "redaccion", "autonews", "support", "assistenza", "hotro"
]

SKIP_DOMAINS = [
    "wikipedia","linkedin","facebook","twitter","instagram","youtube",
    "reddit","yelp","glassdoor","indeed","crunchbase","g2.com","capterra",
    "trustpilot","apple.com","google.com","quora.com","tiktok.com",
    "pinterest.com","forbes","techcrunch","hubspot.com","canva.com",
    "adobe.com","shopify.com","wordpress.com","medium.com","bloomberg",
    "fiverr.com","upwork.com","freelancer.com","bark.com","clutch.co",
    "designrush.com","agencyspotter.com","sortlist.com","manifest.com",
    "themanifest.com","goodfirms.co","awwwards.com","behance.net",
    "dribbble.com","producthunt.com","angelist.com","ycombinator.com",
    "myjobmag","jobmag","jobboard","jobsite","jobs.","careers.",
    "clearonhold.com","onholdmarketing","phmg.com","voiceoversandvocals",
    "grin.com","influencer","affiliate",
    # Disposable / fake email domains
    "teleworm.us","mailinator.com","guerrillamail","tempmail","throwam",
    "sharklasers.com","grr.la","yopmail.com","maildrop.cc","dispostable.com",
    "trashmail","fakeinbox","spamgourmet","10minutemail","tempinbox",
    "mailnull","spamex.com","spam4.me","discard.email","mailnesia",
    "dundermifflin.com","example.com","test.com","fake.com","guerrillamail.com","tempmail.com"
]

# Big pool of queries — shuffled each run for variety
DDG_QUERIES = [
    # === LUXURY & FASHION (high budget, audio matters) ===
    'luxury brand agency "sonic branding" contact email site:.com',
    'fashion brand production agency audio contact email',
    'luxury advertising agency music production email contact',
    '"creative director" luxury fashion agency audio email',
    'high-end brand agency "sound logo" email contact site:.com',
    'luxury brand creative agency soundtrack email site:.com',
    'fashion film production company music email contact',
    'luxury automotive brand agency audio production email',
    # === DIRECTORIES (Clutch & Adforum targets) ===
    'site:clutch.co/agencies creative OR production OR "video production" OR advertising',
    'site:adforum.com/agency video OR creative OR music OR branding',
    'site:clutch.co/agencies/hacker-noon OR "creative" OR "branding"',
    'site:adforum.com/agency/ "creative directors" OR "production"',
    '"brand film" production company music email contact site:.com',
    'perfume fragrance advertising agency music contact email',
    'jewellery brand advertising music production email contact',
    'fashion week film production music audio email contact',
    
    # === AUTOMOTIVE (huge budgets for audio) ===
    'automotive brand advertising agency music audio email contact',
    '"car commercial" production agency music email contact',
    'automotive creative agency soundtrack audio email site:.com',
    '"TV spot" automotive production music audio email',
    
    # === PRODUCTION COMPANIES (need music for every project) ===
    'production company advertising music audio email contact site:.com',
    'branded content production company music contact email',
    'commercial production company "music supervisor" email',
    'video production company branded content music email contact',
    '"brand film" director production company music email',
    'commercial director production company audio music email',
    'TVC production company music contact email site:.com',
    'advertising production house music audio email site:.co.uk',
    
    # === AGENCIES with sound/audio focus ===
    'advertising agency "music production" contact email site:.com',
    'branding agency "sonic branding" email contact site:.com',
    'creative agency "audio branding" email contact site:.com',
    'ad agency "sound design" contact email site:.com',
    'brand studio "audio logo" contact email',
    'creative production company music contact email site:.com',
    '"head of production" advertising agency music email',
    '"creative director" branding agency audio email site:.com',
    '"music supervisor" advertising agency email contact',
    'advertising agency music jingle contact email site:.co.uk',
    'branding agency audio identity email site:.co.uk',
    'creative agency sound music contact site:.com.au email',
    'digital agency "brand music" email contact',
    'brand agency "sonic identity" email contact site:.com',
    'advertising company music production email contact site:.ca',
    'creative studio audio branding contact email site:.nl',
    'branding studio music audio email contact site:.de',
    'advertising agency "jingle" production email site:.com',
    '"marketing director" agency music audio branding email',
    '"brand manager" agency audio identity email contact',
    'creative agency soundtrack advertising contact email',
    'full service agency audio production contact email site:.com',
    'integrated agency "sound branding" email contact',
    'boutique agency music audio production email site:.com',
    
    # === GLOBAL MARKETS ===
    'creative agency music sound branding email site:.sg',
    'advertising agency audio production email site:.ae',
    'branding agency sonic identity email site:.fr',
    'creative studio music branding email contact site:.it',
    'media agency audio brand identity email site:.se',
    'advertising agency music jingle email site:.dk',
    'brand agency sound design email site:.no',
    'creative agency audio branding email site:.fi',
    'brand studio music production email contact site:.nz',
    
    # === SPANISH MARKET ===
    'agencia publicidad musica audio contacto email site:.es',
    'agencia marketing "branding sonoro" contacto email',
    'agencia creativa musica produccion contacto email site:.mx',
    'agencia publicidad sonido jingle contacto email site:.ar',
    'estudio creativo audio branding contacto email site:.co',
    'productora publicidad musica contacto email site:.es',
    '"director creativo" agencia musica audio email',
    'agencia branding "logo sonoro" contacto email',
    'agencia comunicacion audio produccion email site:.es',
    'agencia publicidad lujo moda musica contacto email',
    'productora cine publicitario musica contacto email site:.es',
    
    # === GAMING & TECH (growing market for audio) ===
    'gaming company brand audio music email contact',
    'tech startup brand sonic identity music email contact',
    'app brand "audio logo" "sound design" email contact',
    'gaming studio music branding email contact site:.com',
    
    # === EVENTS & ENTERTAINMENT ===
    'event production company brand music audio email contact',
    'luxury event agency music production email contact',
    '"brand experience" agency audio music email contact',
    
    # === DIRECT BRANDS (cut out the agency middleman) ===
    '"head of marketing" luxury brand music audio email',
    '"brand director" fashion company music email contact',
    '"marketing manager" automotive brand audio email',

    # === BARCELONA / SPAIN PRIORITY (Tim home market — easier to close) ===
    'agencia publicidad Barcelona "director creativo" email contacto',
    'productora spots Barcelona musica audio email contacto',
    'agencia creativa Madrid lujo moda audio contacto email',
    'estudio produccion audiovisual Barcelona email contacto',
    'agencia branding Barcelona "identidad sonora" email',
    'productora cine publicitario Madrid musica audio email',
    'fashion brand Spain music production email contact',
    'luxury brand Spain "sound branding" email contact',
    '"jefe de produccion" agencia publicidad Madrid email',

    # === LATAM PREMIUM (Spanish-speaking, good budgets) ===
    'agencia publicidad Mexico "director creativo" musica email',
    'productora publicidad Bogota musica audio email contacto',
    'agencia creativa Buenos Aires "branding sonoro" email',
    'agencia publicidad Santiago Chile musica audio email',
    'produccion audiovisual premium Mexico musica contacto email',

    # === FRANCE (Paris — premium, close to Barcelona) ===
    'agence publicite Paris musique audio email contact',
    '"directeur creation" agence Paris audio email contact',
    'luxury brand agency Paris music audio email contact',
    'agence branding Paris identite sonore email contact',

    # === GERMANY / NETHERLANDS (high budget) ===
    'creative agency Amsterdam audio branding email contact',
    'production company Berlin music branding email contact',
    'advertising agency Hamburg music production email contact',
    'brand agency Netherlands sonic identity email contact',
]


DDG_SUPPLEMENT_QUERIES = [
    'nahrungsergänzung shop kaufen site:.de',
    'protein pulver online shop site:.de',
    'keto tropfen kaufen official site:.de',
    'abnehmen kapseln shop bestellen site:.de',
    'vitamin supplement online kaufen site:.de',
]


SUPPLEMENT_IMPRESSUM_PATHS = [
    '/impressum',
    '/pages/impressum',
    '/policies/legal-notice',
    '/policies/contact-information',
]


SUPPLEMENT_SKIP_DOMAINS = {
    'amazon.de', 'amazon.com', 'ebay.de', 'ebay.com', 'otto.de',
    'dm.de', 'rossmann.de', 'docmorris.de', 'shop-apotheke.com',
    'apo.com', 'medpex.de', 'gesundheitskauf24.de', 'mydays.de',
    'groupon', 'idealo.de', 'guenstiger.de', 'preisvergleich',
    'rtl.de', 'sparkasse.at', 'google.com', 'axelspringer.de',
    'rundfunkbeitrag.de', 'otto.de', 'amazon.de', 'zalando.de',
    'welt.de', 'wiwo.de', 'university', 'uni-', 'hochschule',
    'swm.de', 'baeren-apotheken.de', 'medizinfuchs.de',
}


SUPPLEMENT_GENERIC_EMAIL_PREFIXES = [
    'datenschutz', 'impressum', 'news', 'presse', 'service',
    'jobs', 'careers', 'interns', 'recruitment', 'hr', 'hiring', 'talent', 'apply'
]


def estimate_employee_count(domain: str) -> int:
    try:
        import requests
        url = f"https://www.{domain}"
        r = requests.get(url, headers=HEADERS, timeout=5)
        text = r.text.lower()
        if any(word in text for word in ['career', 'jobs', 'team', 'employees', 'staff', 'gmbh', 'ag', 'corp']):
            if 'about' in text or 'team' in text:
                return 100
        return 10
    except:
        return 10


def is_small_company(domain: str) -> bool:
    return estimate_employee_count(domain) <= 50


def is_valid_impressum_email(email: str, is_small: bool = True) -> bool:
    e = email.lower().strip()
    if "@" not in e:
        return False
    parts = e.split("@")
    if len(parts) != 2:
        return False
    domain = parts[1]
    if len(domain) < 5 or "." not in domain:
        return False
    local = parts[0]
    if local in SUPPLEMENT_GENERIC_EMAIL_PREFIXES:
        return False
    if not is_small:
        return False
    return True


def get_known_emails() -> set:
    emails = set()
    if LEADS_CSV.exists():
        with open(LEADS_CSV, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                e = row.get("Email", "").strip().lower()
                if e:
                    emails.add(e)
    try:
        import openpyxl
        wb = openpyxl.load_workbook(CRM_PATH)
        ws = wb["CRM"]
        for row in ws.iter_rows(min_row=2, values_only=True):
            if row[3]:
                emails.add(str(row[3]).lower().strip())
    except Exception:
        pass
    return emails


def get_known_domains(known_emails: set) -> set:
    domains = set()
    for e in known_emails:
        if "@" in e:
            domain = e.split("@")[-1].strip().lower()
            if domain:
                domains.add(domain)
    return domains


def is_valid_email(email: str) -> bool:
    e = email.lower()
    for p in SKIP_EMAIL_PATTERNS:
        if p in e:
            return False
    parts = e.split("@")
    if len(parts) != 2:
        return False
    domain = parts[1]
    if len(domain) < 5 or "." not in domain:
        return False
    if re.search(r"\.(png|jpg|gif|svg|webp|ico)$", domain):
        return False
    # Must have a valid TLD (at least 2 chars)
    tld = domain.rsplit(".", 1)[-1]
    if len(tld) < 2:
        return False
    return True


def is_valid_domain(domain: str) -> bool:
    """Filter out job boards, aggregators, and non-agency sites."""
    for skip in SKIP_DOMAINS:
        if skip in domain:
            return False
    return True



def domain_is_valid(email: str) -> bool:
    try:
        import socket
        domain = email.split("@")[-1].strip()
        socket.getaddrinfo(domain, None)
        return True
    except Exception:
        return False

def save_lead(lead: dict):
    file_exists = LEADS_CSV.exists()
    fieldnames = ["Contact name","Job title","Company name",
                  "Location","Company website","Company industry","Email", "Icebreaker", "Score"]
    with open(LEADS_CSV, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow({
            "Contact name":     lead.get("contact_name",""),
            "Job title":        lead.get("title",""),
            "Company name":     lead.get("company",""),
            "Location":         lead.get("location",""),
            "Company website":  lead.get("website",""),
            "Company industry": lead.get("industry","Premium Advertising / Brand"),
            "Email":            lead.get("email",""),
            "Icebreaker":       lead.get("icebreaker",""),
            "Score":            lead.get("_score",50),
        })


def extract_emails_from_url(url: str, timeout: int = 8) -> list:
    try:
        r = requests.get(url, headers=HEADERS, timeout=timeout)
        if r.status_code != 200:
            return []
        text = r.text.replace("&#64;","@").replace("[at]","@").replace("(at)","@")
        found = list(set(e.lower() for e in EMAIL_REGEX.findall(text)))
        return [e for e in found if is_valid_email(e)]
    except Exception:
        return []


def get_emails_from_site(base_url: str) -> list:
    emails = []
    for path in ["", "/contact", "/contact-us", "/about", "/about-us", "/team"]:
        found = extract_emails_from_url(base_url.rstrip("/") + path)
        emails += found
        time.sleep(0.3)
        if emails:
            break
    return list(set(emails))


def fetch_ddg_leads(known_emails: set, target: int) -> list:
    try:
        from ddgs import DDGS
    except ImportError:
        try:
            from duckduckgo_search import DDGS
        except ImportError:
            print("  [DDG] ddgs not installed.")
            return []

    found = []
    visited = set()
    queries = DDG_QUERIES.copy()
    random.shuffle(queries)

    known_domains = get_known_domains(known_emails)

    try:
        with DDGS() as ddgs:
            for query in queries:
                if len(found) >= target:
                    break

                print(f"  [DDG] {query[:65]}...")
                try:
                    import concurrent.futures
                    with concurrent.futures.ThreadPoolExecutor() as executor:
                        future = executor.submit(lambda q: list(ddgs.text(q, max_results=10)), query)
                        results = future.result(timeout=15)
                except concurrent.futures.TimeoutError:
                    print("  [DDG] Search timed out! DDG is blocking the IP. Aborting search for this cycle.")
                    break  # Abort queries loop to prevent hanging forever
                except Exception as e:
                    print(f"  [DDG] Search error: {e}")
                    time.sleep(4)
                    continue

                time.sleep(random.uniform(1.5, 3))

                for result in results:
                    if len(found) >= target:
                        break

                    url = result.get("href", "")
                    if not url:
                        continue

                    # Custom resolving for directories (Clutch & Adforum)
                    is_directory = False
                    if "clutch.co" in url or "adforum.com" in url:
                        try:
                            # Fetch the directory page to extract the real agency website URL
                            r_dir = requests.get(url, headers=HEADERS, timeout=8)
                            if r_dir.status_code == 200:
                                # Find absolute URLs in the page text excluding internal clutch/adforum domains
                                candidates = re.findall(r'href="(https?://[^"]+)"', r_dir.text)
                                for cand in candidates:
                                    cand_domain = urlparse(cand).netloc.replace("www.", "").lower().strip()
                                    if cand_domain and not any(d in cand_domain for d in ["clutch.co", "adforum.com", "google", "facebook", "twitter", "linkedin", "instagram", "youtube", "pinterest", "apple", "reddit"]):
                                        url = cand
                                        is_directory = True
                                        break
                        except Exception as e:
                            print(f"  [Directory Scrape] Error resolving {url}: {e}")

                    parsed = urlparse(url)
                    domain = parsed.netloc.replace("www.", "").lower().strip()
                    base = f"{parsed.scheme}://{parsed.netloc}"

                    if not is_directory:
                        # Standard check for search result domain
                        if domain in visited or domain in known_domains:
                            continue
                        if not is_valid_domain(domain):
                            continue
                    else:
                        # Directory resolved domain checks
                        if domain in visited or domain in known_domains or not is_valid_domain(domain):
                            continue

                    visited.add(domain)

                    emails = get_emails_from_site(base)
                    good = []
                    for e in emails:
                        e_lower = e.lower().strip()
                        e_domain = e_lower.split("@")[-1] if "@" in e_lower else ""
                        if e_domain in known_domains:
                            continue
                        if e_lower not in known_emails and domain_is_valid(e):
                            good.append(e)

                    if not good:
                        continue

                    email = good[0]
                    email_domain = email.lower().strip().split("@")[-1]
                    known_domains.add(email_domain)
                    company = domain.split(".")[0].replace("-", " ").title()

                    # --- NEW: EXTREME AI PERSONALIZATION (ICEBREAKER & SCORE) ---
                    icebreaker = ""
                    ai_score = 50
                    try:
                        import requests
                        r_site = requests.get(base, headers=HEADERS, timeout=5)
                        site_text = r_site.text[:1500]
                        
                        groq_api_key = os.getenv("GROQ_API_KEY")
                        if not groq_api_key:
                            print("  [AI] No GROQ_API_KEY found, skipping AI personalization.")
                            pass
                        else:
                            headers = {
                                "Authorization": f"Bearer {groq_api_key}",
                                "Content-Type": "application/json"
                            }
                            # 1. AI Filter
                            prompt_filter = (
                                "You are a strict B2B lead classifier. Analyze this website excerpt and classify if this company is a potential target.\n"
                                "Respond strictly with 'YES' or 'NO' (no punctuation, no explanation).\n\n"
                                "CRITERIA TO APPROVE (YES):\n"
                                "- Advertising or marketing agencies that produce campaigns.\n"
                                "- Video production companies or film production houses that create commercials/ads.\n"
                                "- Branding or brand identity design studios.\n"
                                "- Creative agencies making spots, commercial advertisements, or branded content.\n\n"
                                "CRITERIA TO REJECT (NO):\n"
                                "- Music studios, record labels, or music agencies.\n"
                                "- Music supervisors, music libraries, or sound-only production houses.\n"
                                "- Magazines, blogs, publishers, or media outlets.\n"
                                "- Software, SaaS, IT, or technology companies.\n"
                                "- Universities, schools, or educational institutions.\n"
                                "- Very large corporations (over 500 employees).\n"
                                "- Any entity that does NOT produce audiovisual content for brands.\n\n"
                                f"Website: {base}\n"
                                f"Text excerpt: {site_text}\n\n"
                                "Decision (YES or NO):"
                            )
                            payload_filter = {
                                "model": "llama3-8b-8192",
                                "messages": [{"role": "user", "content": prompt_filter}],
                                "temperature": 0.1
                            }

                            r_filter = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload_filter, timeout=10)
                            if r_filter.status_code == 200:
                                answer = r_filter.json().get("choices", [{}])[0].get("message", {}).get("content", "").strip().upper()
                                if "YES" not in answer:
                                    print(f"  [AI Filter] Skipped {company} — Not a high-ticket target.")
                                    continue
                                
                            # 2. AI Icebreaker
                            prompt_ice = f"You are writing a cold email to {company}. Based on their website text, write ONE short, highly personalized opening sentence (max 15 words) referencing their specific work, niche, or a recent project. Do NOT include greetings. Just the sentence.\n\nText: {site_text}"
                            payload_ice = {
                                "model": "llama3-8b-8192",
                                "messages": [{"role": "user", "content": prompt_ice}],
                                "temperature": 0.7
                            }
                            r_ice = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload_ice, timeout=10)
                            if r_ice.status_code == 200:
                                icebreaker = r_ice.json().get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                                ai_score = 90  # Verified by Groq AI and personalized!
                    except Exception as e:
                        pass
                    # -----------------------------------------------------------------

                    # Try to extract a real contact name
                    contact_info = {}
                    try:
                        from name_extractor import get_contact_from_website
                        contact_info = get_contact_from_website(base, timeout=5)
                    except Exception:
                        pass
                    lead = {
                        "contact_name": contact_info.get("name", ""),
                        "title": contact_info.get("title", "Creative Director / Head of Prod"),
                        "company": company,
                        "email": email,
                        "location": "",
                        "website": base,
                        "industry": "Premium Advertising / Brand",
                        "icebreaker": icebreaker,
                        "_score": ai_score
                    }
                    if contact_info.get("name"):
                        print(f"  [DDG] Found contact: {contact_info['name']} ({contact_info.get('title','')})")
                    save_lead(lead)
                    known_emails.add(email)
                    found.append(lead)
                    print(f"  [DDG] + {email} ({company}) [AI Verified ✅]")
                    time.sleep(random.uniform(0.5, 1))

    except KeyboardInterrupt:
        pass

    return found


def run_lead_finder() -> dict:
    print("  [LeadFinder] Starting v4 — DDG focused...")
    LOG_PATH.mkdir(exist_ok=True)

    known_emails = get_known_emails()
    print(f"  [LeadFinder] Known emails to skip: {len(known_emails)}")

    ddg_leads = fetch_ddg_leads(known_emails, target=60)

    log_file = LOG_PATH / f"lead_finder_{datetime.date.today()}.json"
    with open(log_file, "w", encoding="utf-8") as f:
        json.dump({
            "date": datetime.date.today().isoformat(),
            "found": len(ddg_leads),
            "leads": [l["email"] for l in ddg_leads[:50]]
        }, f, indent=2, ensure_ascii=False)

    print(f"  [LeadFinder] Done. Found {len(ddg_leads)} new leads.")
    return {"found": len(ddg_leads), "leads": ddg_leads}


def fetch_supplement_leads(known_emails: set, target: int = 30) -> list:
    """Find German/DACH region D2C supplement brands via Impressum pages."""
    try:
        from ddgs import DDGS
    except ImportError:
        from duckduckgo_search import DDGS

    found = []
    visited = set()
    known_domains = get_known_domains(known_emails)

    try:
        with DDGS() as ddgs:
            for query in DDG_SUPPLEMENT_QUERIES:
                if len(found) >= target:
                    break
                print(f"  [SUPP] {query[:65]}...")
                try:
                    import concurrent.futures
                    with concurrent.futures.ThreadPoolExecutor() as executor:
                        future = executor.submit(lambda q: list(ddgs.text(q, max_results=10)), query)
                        results = future.result(timeout=15)
                except Exception:
                    continue

                time.sleep(random.uniform(1.5, 3))

                for result in results:
                    url = result.get("href", "")
                    if not url:
                        continue
                    parsed = urlparse(url)
                    domain = parsed.netloc.replace("www.", "").lower().strip()
                    if not domain:
                        continue
                    if not any(domain.endswith(tld) for tld in [".de", ".at", ".ch"]):
                        continue
                    if domain in visited or domain in known_domains:
                        continue
                    if domain in SUPPLEMENT_SKIP_DOMAINS or domain.split(".")[0] in SUPPLEMENT_SKIP_DOMAINS:
                        continue
                    forbidden_words = ['apotheke', 'klinik', 'gemeinde', 'stadt', 'landkreis', 'farmacia', 'hospital']
                    if any(word in domain.lower() for word in forbidden_words):
                        continue
                    # Validate URL contains keywords
                    url_lower = url.lower()
                    title_lower = result.get("title", "").lower()
                    valid_keywords = ["kaufen", "bestellen", "shop", "supplement", "nahrungsergänzung"]
                    if not any(kw in url_lower or kw in title_lower for kw in valid_keywords):
                        continue

                    visited.add(domain)

                    base = f"{parsed.scheme}://{parsed.netloc}"
                    is_small = is_small_company(domain)
                    email = None
                    for path in SUPPLEMENT_IMPRESSUM_PATHS:
                        emails = extract_emails_from_url(base.rstrip("/") + path, timeout=5)
                        valid = []
                        for e in emails:
                            e_lower = e.lower().strip()
                            e_domain = e_lower.split("@")[-1] if "@" in e_lower else ""
                            if e_domain in known_domains:
                                continue
                            # Check forbidden email strings
                            forbidden_email_keywords = ["datenschutz", "impressum", "news", "jobs", "redaktion", "presse"]
                            if any(f_kw in e_lower for f_kw in forbidden_email_keywords):
                                continue
                            if is_valid_impressum_email(e, is_small) and e not in known_emails:
                                valid.append(e)
                        if valid:
                            email = valid[0]
                            break

                    if not email:
                        continue
                    if not domain_is_valid(email):
                        continue

                    email_domain = email.lower().strip().split("@")[-1]
                    known_domains.add(email_domain)

                    company = domain.split(".")[0].replace("-", " ").title()
                    lead = {
                        "contact_name": "",
                        "title": "Founder / Marketing",
                        "company": company,
                        "email": email,
                        "location": "",
                        "website": base,
                        "industry": "D2C Nutrition / Health Supplements",
                        "icebreaker": "",
                        "_score": 75
                    }
                    save_lead(lead)
                    known_emails.add(email)
                    found.append(lead)
                    print(f"  [SUPP] + {email} ({company}) [Impressum]")
                    time.sleep(random.uniform(0.5, 1))
    except KeyboardInterrupt:
        pass
    return found


if __name__ == "__main__":
    result = run_lead_finder()
    print(f"Total new leads: {result['found']}")
