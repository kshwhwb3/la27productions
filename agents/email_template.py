"""
LA 27 Productions — HTML email template helper
Usage:
    from email_template import build_html
    html = build_html(body_text, lang="es")
"""

CTA_ES = "Escucha nuestro trabajo"
CTA_EN = "Hear our work"
CTA_DE = "Unsere Arbeit anhören"
CTA_FR = "Écoutez notre travail"
CTA_PT = "Ouça o nosso trabalho"

TAGLINE_ES = "Música Original · Barcelona"
TAGLINE_EN = "Original Music · Barcelona"
TAGLINE_DE = "Original-Musik · Barcelona"
TAGLINE_FR = "Musique Originale · Barcelone"
TAGLINE_PT = "Música Original · Barcelona"


def _strip_plain_signature(text: str) -> str:
    """Remove plain-text signature block from the body (HTML footer handles branding)."""
    import re
    # Match a blank line followed by a standalone "Tim" or "Tim Helmes" line
    # (but NOT "At LA 27" mid-sentence — only isolated name lines)
    sig_markers = re.compile(
        r'\n\s*\n(Tim(\s+Helmes)?\s*\n|Saludos,?\s*\n|Best,?\s*\n|Regards,?\s*\n|Un saludo,?\s*\n)',
        re.IGNORECASE
    )
    match = sig_markers.search(text)
    if match:
        return text[:match.start()].strip()
    return text.strip()


def _parse_markdown(text: str) -> str:
    import re
    # 1. Replace headers (### Text) with bold inline style
    text = re.sub(r'^###\s+(.*?)$', r'<strong style="font-size:16px;color:#0d0d0d;">\1</strong>', text, flags=re.MULTILINE)
    text = re.sub(r'^##\s+(.*?)$', r'<strong style="font-size:18px;color:#0d0d0d;">\1</strong>', text, flags=re.MULTILINE)
    text = re.sub(r'^#\s+(.*?)$', r'<strong style="font-size:20px;color:#0d0d0d;">\1</strong>', text, flags=re.MULTILINE)
    
    # 2. Replace bold (**text**) with <strong>
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    
    # 3. Replace bullet points (* text) with bullet symbol
    text = re.sub(r'^\*\s+(.*?)$', r'• \1', text, flags=re.MULTILINE)
    
    # 4. Replace italics (*text*) with <em>
    text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', text)
    
    return text


def build_html(body_text: str, lang: str = "en") -> str:
    cta     = {"es": CTA_ES,     "de": CTA_DE,     "fr": CTA_FR,     "pt": CTA_PT    }.get(lang, CTA_EN)
    tagline = {"es": TAGLINE_ES, "de": TAGLINE_DE, "fr": TAGLINE_FR, "pt": TAGLINE_PT}.get(lang, TAGLINE_EN)
    unsub_text = {"es": "¿No te interesa? ", "de": "Kein Interesse? ", "fr": "Pas intéressé ? ", "pt": "Não tem interesse? "}.get(lang, "Not interested? ")
    unsub_link = {"es": "Darme de baja", "de": "Abmelden", "fr": "Se désabonner", "pt": "Cancelar inscrição"}.get(lang, "Unsubscribe")

    body_text = _strip_plain_signature(body_text)
    body_text = _parse_markdown(body_text)

    # Body: split on double newline → paragraphs
    paragraphs = body_text.strip().split("\n\n")
    body_html = ""
    for p in paragraphs:
        lines = p.replace("\n", "<br>")
        body_html += (
            f'<p style="margin:0 0 18px 0;line-height:1.75;'
            f'font-family:Georgia,\'Times New Roman\',serif;'
            f'font-size:15px;color:#1a1a1a;">{lines}</p>\n'
        )

    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f2f2f0;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f2f2f0;">
 <tr><td align="center" style="padding:40px 16px;">

  <table width="600" cellpadding="0" cellspacing="0" border="0"
         style="max-width:600px;width:100%;background:#ffffff;
                border-radius:4px;overflow:hidden;
                box-shadow:0 2px 12px rgba(0,0,0,0.08);">

    <!-- RED TOP BAR -->
    <tr>
      <td style="height:3px;background:#cc0000;font-size:0;">&nbsp;</td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding:40px 44px 8px 44px;">
        {body_html}
      </td>
    </tr>

    <!-- CTA LINK -->
    <tr>
      <td style="padding:10px 44px 36px 44px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="border-bottom:1.5px solid #cc0000;padding-bottom:3px;">
              <a href="https://la27productions.com"
                 style="font-family:Arial,Helvetica,sans-serif;
                        font-size:12px;font-weight:700;
                        letter-spacing:2.5px;text-transform:uppercase;
                        color:#cc0000;text-decoration:none;
                        display:block;">
                {cta} &nbsp;→
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- DARK FOOTER -->
    <tr>
      <td style="background:#0d0d0d;padding:28px 44px 28px 44px;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <!-- LOGO (CSS recreation) -->
            <td valign="middle" width="55%">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:3px;background:#cc0000;border-radius:1px;vertical-align:top;padding-top:4px;">&nbsp;</td>
                  <td style="width:12px;">&nbsp;</td>
                  <td>
                    <div style="font-family:Arial,Helvetica,sans-serif;
                                font-size:26px;font-weight:900;
                                color:#ffffff;letter-spacing:-0.5px;
                                line-height:1;">LA 27</div>
                    <div style="font-family:Arial,Helvetica,sans-serif;
                                font-size:7.5px;font-weight:700;
                                color:#cc0000;letter-spacing:5px;
                                text-transform:uppercase;
                                border-bottom:1.5px solid #cc0000;
                                padding-bottom:5px;margin-top:3px;
                                display:inline-block;">PRODUCTIONS</div>
                  </td>
                </tr>
              </table>
            </td>
            <!-- CONTACT -->
            <td valign="middle" align="right" width="45%">
              <div style="font-family:Arial,Helvetica,sans-serif;
                          font-size:12px;color:#888888;
                          line-height:1.9;text-align:right;">
                <span style="color:#ffffff;font-weight:600;font-size:13px;">Tim Helmes</span><br>
                {tagline}<br>
                <a href="https://la27productions.com"
                   style="color:#cc0000;text-decoration:none;
                          font-weight:600;font-size:12px;letter-spacing:0.3px;">
                  la27productions.com
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- UNSUBSCRIBE -->
    <tr>
      <td style="background:#0d0d0d;padding:0 44px 20px 44px;border-top:1px solid #1a1a1a;">
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#555;line-height:1.6;text-align:center;">
          {unsub_text}
          <a href="mailto:tim@la27productions.com?subject=Unsubscribe&body=Please%20remove%20me%20from%20your%20mailing%20list"
             style="color:#777;text-decoration:underline;">{unsub_link}</a>
        </p>
      </td>
    </tr>

  </table>

 </td></tr>
</table>

</body>
</html>"""
