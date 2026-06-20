import os
import json
import datetime
from pathlib import Path

BASE_DIR = Path(__file__).parent
QUOTA_FILE = BASE_DIR / "logs" / "daily_quota.json"
MAX_DAILY_QUOTA = 290  # Max per account

def init_quota_file():
    if not QUOTA_FILE.parent.exists():
        QUOTA_FILE.parent.mkdir(parents=True, exist_ok=True)
    today = datetime.date.today().isoformat()
    default_structure = {"date": today, "sent_a": 0, "sent_b": 0, "sent_c": 0}
    if not QUOTA_FILE.exists():
        with open(QUOTA_FILE, "w") as f:
            json.dump(default_structure, f)
    else:
        try:
            with open(QUOTA_FILE, "r") as f:
                data = json.load(f)
            if data.get("date") != today:
                with open(QUOTA_FILE, "w") as fw:
                    json.dump(default_structure, fw)
            elif "sent_c" not in data:
                data["sent_c"] = 0
                with open(QUOTA_FILE, "w") as fw:
                    json.dump(data, fw)
        except Exception:
            with open(QUOTA_FILE, "w") as fw:
                json.dump(default_structure, fw)

def can_send(account: str = "A") -> bool:
    init_quota_file()
    try:
        with open(QUOTA_FILE, "r") as f:
            data = json.load(f)
        acc_upper = account.upper()
        if acc_upper == "A":
            key = "sent_a"
        elif acc_upper == "B":
            key = "sent_b"
        elif acc_upper == "C":
            key = "sent_c"
        else:
            return False
        return data.get(key, 0) < MAX_DAILY_QUOTA
    except Exception:
        return False

def increment_quota(account: str = "A"):
    init_quota_file()
    try:
        with open(QUOTA_FILE, "r") as f:
            data = json.load(f)
        
        acc_upper = account.upper()
        if acc_upper == "A":
            key = "sent_a"
        elif acc_upper == "B":
            key = "sent_b"
        elif acc_upper == "C":
            key = "sent_c"
        else:
            return
            
        data[key] = data.get(key, 0) + 1
        
        with open(QUOTA_FILE, "w") as f:
            json.dump(data, f)
    except Exception:
        pass

def manual_set_quota(sent_count_a: int, sent_count_b: int, sent_count_c: int = 0):
    init_quota_file()
    today = datetime.date.today().isoformat()
    with open(QUOTA_FILE, "w") as f:
        json.dump({"date": today, "sent_a": sent_count_a, "sent_b": sent_count_b, "sent_c": sent_count_c}, f)
