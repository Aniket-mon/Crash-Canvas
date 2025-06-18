from dash import Input, Output, State, callback, no_update
import re
import phonenumbers
from phonenumbers import NumberParseException
from .validation import validate_password_strength, validate_email_format
from .otp import send_otp_sms, verify_otp_code
from database.models import create_user, get_user_by_email

def register_auth_callbacks(app):
    """Register all authentication-related callbacks"""
    
    # Password visibility toggle
    @app.callback(
        [Output("password", "type"),
         Output("password-toggle-icon", "className")],
        [Input("password-toggle", "n_clicks")],
        prevent_initial_call=True
    )
    def toggle_password_visibility(n_clicks):
        if n_clicks and n_clicks % 2 == 1:
            return "text", "fas fa-eye-slash"
        return "password", "fas fa-eye"

    # Real-time password validation
    @app.callback(
        [Output("length-check", "style"),
         Output("length-text", "style"),
         Output("mixed-check", "style"),
         Output("mixed-text", "style"),
         Output("lower-check", "style"),
         Output("lower-text", "style"),
         Output("upper-check", "style"),
         Output("upper-text", "style"),
         Output("numbers-check", "style"),
         Output("numbers-text", "style"),
         Output("special-check", "style"),
         Output("special-text", "style"),
         Output("consecutive-check", "style"),
         Output("consecutive-text", "style"),
         Output("password-success", "style"),
         Output("password-requirements", "style")],
        [Input("password", "value")]
    )
    def validate_password_requirements(password):
        if not password:
            # Default gray state
            default_check = {"color": "#D1D5DB", "margin-right": "8px", "font-size": "12px"}
            default_text = {"font-size": "14px", "color": "#6B7280"}
            success_hidden = {"margin-top": "8px", "display": "none"}
            requirements_visible = {"margin-top": "12px"}
            return [default_check, default_text] * 7 + [success_hidden, requirements_visible]
        
        # Get validation results
        validation_results = validate_password_strength(password)
        
        def get_styles(is_valid):
            if is_valid:
                check_style = {"color": "#10B981", "margin-right": "8px", "font-size": "12px"}
                text_style = {"font-size": "14px", "color": "#10B981"}
            else:
                check_style = {"color": "#EF4444", "margin-right": "8px", "font-size": "12px"}
                text_style = {"font-size": "14px", "color": "#EF4444"}
            return check_style, text_style
        
        # Get styles for each requirement
        length_styles = get_styles(validation_results['length_valid'])
        mixed_styles = get_styles(validation_results['mixed_valid'])
        lower_styles = get_styles(validation_results['has_lower'])
        upper_styles = get_styles(validation_results['has_upper'])
        numbers_styles = get_styles(validation_results['has_numbers'])
        special_styles = get_styles(validation_results['has_special'])
        consecutive_styles = get_styles(validation_results['no_consecutive'])
        
        # Show success if all requirements met
        all_valid = validation_results['all_valid']
        if all_valid:
            success_visible = {"margin-top": "8px", "display": "flex", "align-items": "center"}
            requirements_hidden = {"margin-top": "12px", "display": "none"}
        else:
            success_visible = {"margin-top": "8px", "display": "none"}
            requirements_hidden = {"margin-top": "12px"}
        
        return (
            length_styles[0], length_styles[1],
            mixed_styles[0], mixed_styles[1],
            lower_styles[0], lower_styles[1],
            upper_styles[0], upper_styles[1],
            numbers_styles[0], numbers_styles[1],
            special_styles[0], special_styles[1],
            consecutive_styles[0], consecutive_styles[1],
            success_visible, requirements_hidden
        )

    # Email validation
    @app.callback(
        Output("email-validation", "children"),
        [Input("email", "value")]
    )
    def validate_email(email):
        return validate_email_format(email)

    # Phone validation
    @app.callback(
        Output("phone-validation", "children"),
        [Input("country-code", "value"),
         Input("phone", "value")]
    )
    def validate_phone_number(country_code, phone):
        if not phone:
            return ""
        
        try:
            full_number = country_code + phone
            parsed_number = phonenumbers.parse(full_number, None)
            
            if phonenumbers.is_valid_number(parsed_number):
                formatted_number = phonenumbers.format_number(
                    parsed_number, 
                    phonenumbers.PhoneNumberFormat.INTERNATIONAL
                )
                return html.Div([
                    html.I(className="fas fa-check-circle", style={"color": "#10B981", "margin-right": "6px"}),
                    html.Span(f"Valid: {formatted_number}", style={"color": "#10B981", "font-size": "12px"})
                ])
            else:
                return html.Div([
                    html.I(className="fas fa-exclamation-circle", style={"color": "#EF4444", "margin-right": "6px"}),
                    html.Span("Invalid phone number", style={"color": "#EF4444", "font-size": "12px"})
                ])
        except NumberParseException:
            return html.Div([
                html.I(className="fas fa-exclamation-circle", style={"color": "#EF4444", "margin-right": "6px"}),
                html.Span("Invalid phone number format", style={"color": "#EF4444", "font-size": "12px"})
            ])

    # Continue button state
    @app.callback(
        Output("continue-btn", "disabled"),
        [Input("first-name", "value"),
         Input("last-name", "value"),
         Input("email", "value"),
         Input("password", "value"),
         Input("terms-checkbox", "checked"),
         Input("country-code", "value"),
         Input("phone", "value")]
    )
    def update_continue_button(first_name, last_name, email, password, terms_checked, country_code, phone):
        if not all([first_name, last_name, email, password, terms_checked, phone]):
            return True
        
        # Validate email
        if not validate_email_format(email, return_bool=True):
            return True
        
        # Validate password
        password_validation = validate_password_strength(password)
        if not password_validation['all_valid']:
            return True
        
        # Validate phone
        try:
            full_number = country_code + phone
            parsed_number = phonenumbers.parse(full_number, None)
            if not phonenumbers.is_valid_number(parsed_number):
                return True
        except:
            return True
        
        return False

    # Signup submission and OTP modal
    @app.callback(
        [Output("otp-modal", "is_open"),
         Output("phone-display", "children"),
         Output("continue-btn", "children")],
        [Input("continue-btn", "n_clicks")],
        [State("first-name", "value"),
         State("last-name", "value"),
         State("email", "value"),
         State("country-code", "value"),
         State("phone", "value"),
         State("password", "value"),
         State("terms-checkbox", "checked")],
        prevent_initial_call=True
    )
    def handle_signup_submission(n_clicks, first_name, last_name, email, country_code, phone, password, terms_checked):
        if n_clicks and all([first_name, last_name, email, phone, password, terms_checked]):
            full_phone = country_code + phone
            
            try:
                parsed_number = phonenumbers.parse(full_phone, None)
                if phonenumbers.is_valid_number(parsed_number):
                    formatted_phone = phonenumbers.format_number(parsed_number, phonenumbers.PhoneNumberFormat.E164)
                    
                    # Check if user already exists
                    existing_user = get_user_by_email(email)
                    if existing_user:
                        return False, "", "Email already exists"
                    
                    # Send OTP
                    otp_result = send_otp_sms(formatted_phone)
                    if otp_result["success"]:
                        # Store user data temporarily in session
                        return True, formatted_phone, "Sending OTP..."
                    else:
                        return False, "", "Failed to send OTP"
                else:
                    return False, "", "Invalid phone number"
            except:
                return False, "", "Invalid phone number"
        
        return False, "", "Continue"

    # OTP verification
    @app.callback(
        [Output("otp-error", "children"),
         Output("otp-modal", "is_open", allow_duplicate=True)],
        [Input("verify-otp-btn", "n_clicks")],
        [State(f"otp-{i}", "value") for i in range(6)] + [State("phone-display", "children")],
        prevent_initial_call=True
    )
    def verify_otp(n_clicks, *args):
        if n_clicks:
            otp_values = args[:6]
            phone_number = args[6]
            
            otp_code = ''.join(otp_values)
            
            if len(otp_code) == 6:
                verification_result = verify_otp_code(phone_number, otp_code)
                
                if verification_result["success"]:
                    # Create user account
                    # This would typically redirect to dashboard
                    return "", False
                else:
                    return html.Div([
                        html.I(className="fas fa-exclamation-circle", style={"margin-right": "8px"}),
                        "Invalid verification code. Please try again."
                    ], style={"color": "#EF4444"}), True
            else:
                return html.Div([
                    html.I(className="fas fa-exclamation-circle", style={"margin-right": "8px"}),
                    "Please enter all 6 digits."
                ], style={"color": "#EF4444"}), True
        
        return "", True
