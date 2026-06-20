# LA27 PRODUCTIONS — B2B Free Email Enrichment Playbook

This rule file contains the strict guidelines for acquiring and verifying B2B emails for outreach campaigns without using paid enrichment APIs. Follow this workflow step-by-step for any lead processing task.

---

## Expectations
- **20-35%**: Confirmed high-confidence email (verified pattern + confirmed person)
- **25-35%**: Deduced medium-confidence email (reasonable pattern, unverified)
- **30-50%**: No reliable free data available (use fallback/generic)

---

## Step-by-Step Workflow

### Paso 0: Verification of "Real Person"
Before searching, verify the contact name:
- **Red Flags (NOT a real person):**
  - Contact name is identical or very similar to the company name (e.g., "ADV Production").
  - LinkedIn handle is generic or system-generated (e.g., `adv-production-39aba4206`).
  - No profile picture, or the job title is extremely ambiguous.
- **Action:** If red flags are present, do NOT guess personal emails. Go directly for the company's generic address (`info@`, `hello@`, `contacto@`, etc.).

### Paso 1: Visit the Company Website ("Company website")
Go directly to pages like `/contact`, `/contact-us`, `/contacto`, `/about`, `/team`, `/our-team`.
- Look for any visible email addresses of *any* employee to identify the email domain and pattern.
- **Rule of Dominant Domains:** If a website domain is `rezultzadvertising.com` but the visible emails on the site end in `@rezultz4u.com`, the visible email domain takes absolute priority over the web domain.
- **Obfuscated Emails:** If email addresses are protected by systems like Cloudflare email-protection, do not attempt to bypass them. Proceed directly to Step 2.

### Paso 2: Identify the "Email Format" Pattern
Search Google for:
- `[domain] email format rocketreach`
- `[domain] email format hunter`
- `[company name] email format`

This reveals the typical format percentage (e.g., `first.last@domain.com (98%)` or `first@domain.com (100%)`).

### Paso 3: Confirm the Person and Role
Search:
- `"[First Last]" [Company] zoominfo`
- `[First Last] [Company]`

Use this to ensure the target's role in the list matches current records and avoid name homonyms.

### Paso 4: Determine Pattern by Company Size
Use the following heuristics to prioritize guessing patterns:
- **Small/Boutique (<20 people):** `first@domain.com` (First name only)
- **Medium/Corporate (20-200 people):** `first.last@domain.com`
- **Large/Enterprise (>200 people):** `initial+last@domain.com` (e.g., `jdoe@domain.com`)

### Paso 5: Construct the Candidate Email
Apply the identified pattern to the contact's name.

### Paso 6: Verify Before Sending (Critical)
Always run verification to protect domain reputation:
- Use free search: Query the candidate email address in Google enclosed in quotes (`"name@domain.com"`). If it appears on any public page, it is highly likely to be valid.
- DNS MX validation: Perform real-time MX check to confirm the receiving mail servers exist.

### Paso 7: When to Give Up & Fallbacks
If no reliable personal email can be found:
- Use the generic company email (`info@`, `hello@`, etc.) and explicitly mention the contact's name in the subject line (e.g., `For [Name] - [Subject]`).
- Tag the lead for manual LinkedIn message/InMail outreach.
