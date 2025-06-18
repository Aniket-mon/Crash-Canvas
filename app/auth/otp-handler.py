import os
from twilio.rest import Client
from twilio.base.exceptions import TwilioException

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_VERIFY_SERVICE_SID = os.getenv('TWILIO_VERIFY_SERVICE_SID')

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_otp_sms(phone_number):
    """Send OTP via SMS using Twilio Verify API"""
    try:
        verification = client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verifications.create(
            to=phone_number,
            channel='sms'
        )
        return {"success": True, "sid": verification.sid}
    except TwilioException as e:
        print(f"Twilio error: {e}")
        return {"success": False, "error": str(e)}
    except Exception as e:
        print(f"General error: {e}")
        return {"success": False, "error": str(e)}

def verify_otp_code(phone_number, code):
    """Verify OTP code using Twilio Verify API"""
    try:
        verification_check = client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verification_checks.create(
            to=phone_number,
            code=code
        )
        return {"success": verification_check.status == "approved", "status": verification_check.status}
    except TwilioException as e:
        print(f"Twilio verification error: {e}")
        return {"success": False, "error": str(e)}
    except Exception as e:
        print(f"General verification error: {e}")
        return {"success": False, "error": str(e)}
