# backend/mailer.py
"""
Krishna Accessories - Production-Grade SMTP Email & OTP Delivery Engine
Supports:
- Gmail SMTP (smtp.gmail.com:587) with App Passwords
- Custom SMTP servers (Outlook, Brevo, SendinBlue, Mailgun, Amazon SES, etc.)
- Dynamic database-stored & .env configuration
- High-conversion luxury HTML email templates
"""

import os
import smtplib
import ssl
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Any, Optional
from database import get_db_connection, dump_json_field, parse_json_field

# Load environment variables from .env file if present
def load_env_file():
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip("'\"")
                        if k and not os.environ.get(k):
                            os.environ[k] = v
        except Exception as e:
            print(f"[Mailer] Notice loading .env: {e}")

load_env_file()

def get_smtp_config() -> Dict[str, Any]:
    """
    Retrieves the active SMTP configuration from database or environment variables.
    """
    config = {
        "host": os.environ.get("SMTP_HOST", "smtp.gmail.com").strip(),
        "port": int(os.environ.get("SMTP_PORT", "587")),
        "user": os.environ.get("SMTP_USER", "").strip(),
        "password": os.environ.get("SMTP_PASS", "").strip(),
        "from_email": os.environ.get("SMTP_FROM_EMAIL", "").strip() or os.environ.get("SMTP_USER", "").strip(),
        "from_name": os.environ.get("SMTP_FROM_NAME", "Krishna Accessories Mumbai").strip(),
        "secure": os.environ.get("SMTP_SECURE", "tls").strip().lower()  # 'tls', 'ssl', or 'none'
    }

    # Override from system_config table if configured via Admin UI
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT data FROM system_config WHERE key = 'email_smtp_config'")
        row = cursor.fetchone()
        conn.close()
        if row and row["data"]:
            db_config = parse_json_field(row["data"])
            if isinstance(db_config, dict):
                for k in ["host", "port", "user", "from_email", "from_name", "secure"]:
                    if db_config.get(k):
                        config[k] = db_config[k]
                if db_config.get("password"):
                    config["password"] = db_config["password"]
    except Exception as e:
        print(f"[Mailer] DB config read error: {e}")

    return config

def save_smtp_config(new_config: Dict[str, Any]) -> bool:
    """
    Saves SMTP settings to SQLite database so Admin can configure it directly.
    """
    try:
        current = get_smtp_config()
        # If password is empty or masked '********', keep current password
        pwd = new_config.get("password", "")
        if not pwd or pwd.startswith("****"):
            pwd = current.get("password", "")

        to_save = {
            "host": (new_config.get("host") or current.get("host", "smtp.gmail.com")).strip(),
            "port": int(new_config.get("port") or current.get("port", 587)),
            "user": (new_config.get("user") or "").strip(),
            "password": pwd.strip(),
            "from_email": (new_config.get("from_email") or new_config.get("user") or "").strip(),
            "from_name": (new_config.get("from_name") or "Krishna Accessories Mumbai").strip(),
            "secure": (new_config.get("secure") or "tls").strip().lower()
        }

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT OR REPLACE INTO system_config (key, data) VALUES ('email_smtp_config', ?)", (dump_json_field(to_save),))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"[Mailer] Save config error: {e}")
        return False

def is_smtp_configured() -> bool:
    cfg = get_smtp_config()
    return bool(cfg.get("host") and cfg.get("user") and cfg.get("password"))

def log_email_to_db(to_email: str, subject: str, body: str, otp_code: str = "", email_type: str = "notification", status: str = "Delivered"):
    try:
        conn = get_db_connection()
        email_id = f"EML-{int(time.time() * 1000)}"
        conn.execute(
            "INSERT OR REPLACE INTO email_logs (id, recipient, subject, type, body, otpCode, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (email_id, to_email, subject, email_type, body, otp_code, status)
        )
        conn.commit()
        conn.close()
        return email_id
    except Exception as e:
        print(f"[Mailer] Error logging email to db: {e}")
        return None

def send_email(to_email: str, subject: str, html_body: str, text_body: Optional[str] = None, otp_code: str = "", email_type: str = "notification") -> Dict[str, Any]:
    """
    Sends an email using standard SMTP. Falls back gracefully if SMTP is not yet configured.
    """
    clean_to = to_email.strip().lower()
    cfg = get_smtp_config()
    smtp_host = cfg.get("host", "smtp.gmail.com")
    smtp_port = int(cfg.get("port", 587))
    smtp_user = cfg.get("user", "")
    smtp_pass = cfg.get("password", "")
    from_email = cfg.get("from_email") or smtp_user or "support@krishnaaccessories.com"
    from_name = cfg.get("from_name", "Krishna Accessories Mumbai")
    secure_mode = cfg.get("secure", "tls")

    # If SMTP credentials are missing, record simulated delivery for local testing
    if not smtp_user or not smtp_pass:
        log_email_to_db(clean_to, subject, text_body or subject, otp_code, email_type, status="Simulated (No SMTP Configured)")
        return {
            "success": True,
            "status": "simulated",
            "message": f"SMTP is not yet configured. OTP {otp_code} logged for testing.",
            "smtpConfigured": False,
            "otpCode": otp_code
        }

    try:
        # Construct MIME Message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{from_name} <{from_email}>"
        msg["To"] = clean_to

        if text_body:
            msg.attach(MIMEText(text_body, "plain", "utf-8"))
        if html_body:
            msg.attach(MIMEText(html_body, "html", "utf-8"))

        # Connect and send
        if secure_mode == "ssl" or smtp_port == 465:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context, timeout=15) as server:
                server.login(smtp_user, smtp_pass)
                server.sendmail(from_email, [clean_to], msg.as_string())
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
                server.ehlo()
                if secure_mode != "none":
                    context = ssl.create_default_context()
                    server.starttls(context=context)
                    server.ehlo()
                server.login(smtp_user, smtp_pass)
                server.sendmail(from_email, [clean_to], msg.as_string())

        log_email_to_db(clean_to, subject, text_body or subject, otp_code, email_type, status="Delivered")
        print(f"[Mailer] Successfully sent '{subject}' to {clean_to}")
        return {
            "success": True,
            "status": "delivered",
            "message": f"Email successfully delivered to {clean_to}",
            "smtpConfigured": True
        }

    except smtplib.SMTPAuthenticationError as auth_err:
        err_msg = f"SMTP Authentication failed for {smtp_user}. If using Gmail, please create a 16-character 'Google App Password'."
        print(f"[Mailer] Auth Error: {auth_err}")
        log_email_to_db(clean_to, subject, text_body or subject, otp_code, email_type, status=f"Auth Error: {auth_err}")
        return {
            "success": False,
            "status": "auth_error",
            "message": err_msg,
            "smtpConfigured": True,
            "error": str(auth_err)
        }
    except Exception as e:
        err_msg = f"Failed to send email: {str(e)}"
        print(f"[Mailer] Delivery Error: {e}")
        log_email_to_db(clean_to, subject, text_body or subject, otp_code, email_type, status=f"Error: {e}")
        return {
            "success": False,
            "status": "failed",
            "message": err_msg,
            "smtpConfigured": True,
            "error": str(e)
        }

def build_otp_html_template(otp_code: str, otp_type: str = "login_otp", customer_name: str = "") -> Dict[str, str]:
    """
    Generates luxury HTML and plain text templates for OTP emails.
    """
    name_greeting = f"Hello {customer_name}," if customer_name else "Hello Valued Client,"

    if otp_type in ["registration_otp", "email_verification"]:
        title = "Account Verification Code"
        purpose = "Thank you for joining Krishna Accessories. Please enter the verification code below to activate your account."
        badge = "New Account Registration"
    elif otp_type == "forgot_password":
        title = "Password Reset Security Code"
        purpose = "We received a request to reset your password for your Krishna Accessories account. Use the code below to proceed."
        badge = "Password Recovery"
    else:  # login_otp
        title = "One-Time Login Security Code"
        purpose = "Use this instant one-time security code to sign in to your Krishna Accessories account without a password."
        badge = "Instant Passwordless Sign-In"

    subject = f"[{otp_code}] Your Krishna Accessories {title}"

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid #2d3748;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 28px 24px; text-align: center; border-bottom: 3px solid #d4af37;">
              <div style="font-size: 22px; font-weight: 800; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase;">
                KRISHNA <span style="color: #d4af37;">ACCESSORIES</span>
              </div>
              <div style="font-size: 11px; color: #94a3b8; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 6px;">
                Mumbai Luxury Boutique • Premium Collection
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 28px;">
              
              <!-- Badge -->
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="display: inline-block; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 14px; border-radius: 9999px; border: 1px solid #fde68a;">
                  {badge}
                </span>
              </div>

              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0f172a; text-align: center;">
                {title}
              </h2>
              
              <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                {name_greeting}<br>
                {purpose}
              </p>

              <!-- OTP Code Display Card -->
              <div style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border: 2px dashed #d4af37; border-radius: 12px; padding: 24px 16px; text-align: center; margin: 24px 0;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 8px;">
                  Your 6-Digit One-Time Security Code
                </div>
                <div style="font-size: 40px; font-weight: 900; letter-spacing: 0.3em; color: #0f172a; font-family: 'Courier New', Courier, monospace; margin: 8px 0; padding-left: 0.3em;">
                  {otp_code}
                </div>
                <div style="font-size: 12px; color: #dc2626; font-weight: 600; margin-top: 10px;">
                  ⏱️ Code expires in 5 minutes (Do not share with anyone)
                </div>
              </div>

              <!-- Security Warning -->
              <table role="presentation" width="100%" style="background-color: #f8fafc; border-radius: 8px; padding: 14px; border-left: 4px solid #3b82f6; margin-top: 20px;">
                <tr>
                  <td style="font-size: 12px; color: #64748b; line-height: 1.5;">
                    🔒 <strong>Security Tip:</strong> Krishna Accessories staff will never ask for your OTP code or password via phone, email, or chat. If you did not request this, you can safely ignore this email.
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; line-height: 1.6;">
              <div style="font-weight: 600; color: #64748b; margin-bottom: 4px;">
                📍 Krishna Accessories • Haji Ali, Mumbai - 400026
              </div>
              <div>
                📞 Customer Concierge: +91 98334 23781 • WhatsApp Support Available
              </div>
              <div style="margin-top: 8px; color: #cbd5e1; font-size: 10px;">
                © {time.strftime('%Y')} Krishna Accessories Mumbai. All rights reserved.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    text = f"""Krishna Accessories - {title}

{name_greeting}
{purpose}

Your 6-Digit One-Time Security Code:
>>> {otp_code} <<<

(Valid for 5 minutes. Do not share this code with anyone.)

If you did not request this code, please ignore this email.

Krishna Accessories Mumbai
Phone / WhatsApp: +91 98334 23781
Shop No. 51, Heera Panna Shopping Center, Haji Ali, Mumbai - 400026
"""

    return {"subject": subject, "html": html, "text": text}

def send_otp_email(to_email: str, otp_code: str, otp_type: str = "login_otp", customer_name: str = "") -> Dict[str, Any]:
    """
    Main helper to prepare and send OTP email.
    """
    templates = build_otp_html_template(otp_code, otp_type, customer_name)
    return send_email(
        to_email=to_email,
        subject=templates["subject"],
        html_body=templates["html"],
        text_body=templates["text"],
        otp_code=otp_code,
        email_type=otp_type
    )

def test_smtp_connection(test_recipient: Optional[str] = None) -> Dict[str, Any]:
    """
    Tests the active SMTP connection by sending a diagnostic test email.
    """
    cfg = get_smtp_config()
    target = (test_recipient or cfg.get("user") or "").strip().lower()
    if not target:
        return {"success": False, "message": "No test recipient email provided or configured."}

    subject = "✓ [Krishna Accessories] SMTP Email Delivery Test Succeeded"
    html = f"""
    <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #15803d; margin-top: 0;">✓ SMTP Configuration Successful!</h2>
      <p style="color: #334155; font-size: 14px; line-height: 1.5;">
        This test email confirms that your Krishna Accessories SMTP email server is correctly connected and delivering messages to inboxes.
      </p>
      <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 12px; font-family: monospace; color: #475569;">
        Host: {cfg.get('host')}:{cfg.get('port')}<br>
        Sender: {cfg.get('from_name')} &lt;{cfg.get('from_email')}&gt;<br>
        Security: {cfg.get('secure')}<br>
        Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}
      </div>
    </div>
    """
    text = f"SMTP Test Successful! Krishna Accessories email dispatch is connected to {cfg.get('host')}:{cfg.get('port')}."

    return send_email(
        to_email=target,
        subject=subject,
        html_body=html,
        text_body=text,
        email_type="smtp_test"
    )
