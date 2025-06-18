import dash_bootstrap_components as dbc
from dash import html, dcc

def create_signup_form():
    """Create the complete Twilio-style signup form"""
    return dbc.Container([
        # Header Section
        html.Div([
            html.Img(
                src="/assets/twilio-logo.png",
                style={
                    "height": "32px",
                    "margin-bottom": "24px",
                    "display": "block"
                }
            ),
            html.H1(
                "Sign up for free",
                style={
                    "font-size": "28px",
                    "font-weight": "600",
                    "margin-bottom": "8px",
                    "color": "#121212"
                }
            ),
            html.P(
                "Start your free trial and unlock all Twilio products, including Twilio SendGrid and Twilio Segment.",
                style={
                    "color": "#606B85",
                    "font-size": "16px",
                    "line-height": "1.5",
                    "margin-bottom": "32px"
                }
            )
        ]),
        
        # Form Section
        dbc.Form([
            # First Name Field
            create_input_field(
                "First name",
                "first-name",
                "text",
                "Aniket"
            ),
            
            # Last Name Field
            create_input_field(
                "Last name",
                "last-name",
                "text",
                "Bhattacharya"
            ),
            
            # Email Field
            html.Div([
                dbc.Label(
                    "Email address*",
                    html_for="email",
                    style={"font-weight": "500", "margin-bottom": "6px", "color": "#121212"}
                ),
                dbc.Input(
                    type="email",
                    id="email",
                    placeholder="aniket.bhattacharya1729@gmail.com",
                    style=get_input_style()
                ),
                html.Div(id="email-validation", style={"margin-top": "4px"})
            ], style={"margin-bottom": "20px"}),
            
            # Phone Number Field
            create_phone_field(),
            
            # Password Field
            create_password_field(),
            
            # Terms Checkbox
            create_terms_checkbox(),
            
            # Continue Button
            dbc.Button(
                "Continue",
                id="continue-btn",
                color="primary",
                size="lg",
                disabled=True,
                style={
                    "width": "100%",
                    "height": "48px",
                    "background": "#0F62FE",
                    "border": "none",
                    "border-radius": "6px",
                    "font-size": "16px",
                    "font-weight": "500",
                    "margin-bottom": "24px"
                }
            ),
            
            # Login Link
            html.Div([
                "Already have an account? ",
                html.A("Log in", href="/login", style={"color": "#0F62FE", "text-decoration": "none"})
            ], style={"text-align": "center", "margin-bottom": "24px"}),
            
            # Divider
            html.Hr(style={"border": "none", "border-top": "1px solid #E5E7EB", "margin": "24px 0"}),
            
            # Google Sign Up
            create_google_button()
        ]),
        
        # OTP Modal
        create_otp_modal()
    ], style={
        "max-width": "400px",
        "margin": "40px auto",
        "padding": "0 20px",
        "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    })

def create_input_field(label, field_id, input_type, placeholder):
    """Create a standard input field"""
    return html.Div([
        dbc.Label(
            label,
            html_for=field_id,
            style={"font-weight": "500", "margin-bottom": "6px", "color": "#121212"}
        ),
        dbc.Input(
            type=input_type,
            id=field_id,
            placeholder=placeholder,
            style=get_input_style()
        )
    ], style={"margin-bottom": "20px"})

def create_phone_field():
    """Create phone number field with country code"""
    return html.Div([
        dbc.Label(
            "Phone number*",
            html_for="phone",
            style={"font-weight": "500", "margin-bottom": "6px", "color": "#121212"}
        ),
        dbc.InputGroup([
            dbc.Select(
                id="country-code",
                options=[
                    {"label": "🇺🇸 +1", "value": "+1"},
                    {"label": "🇮🇳 +91", "value": "+91"},
                    {"label": "🇬🇧 +44", "value": "+44"},
                    {"label": "🇨🇦 +1", "value": "+1"},
                    {"label": "🇦🇺 +61", "value": "+61"},
                    {"label": "🇩🇪 +49", "value": "+49"},
                    {"label": "🇫🇷 +33", "value": "+33"},
                    {"label": "🇯🇵 +81", "value": "+81"},
                ],
                value="+91",
                style={"width": "120px", "border-radius": "6px 0 0 6px"}
            ),
            dbc.Input(
                type="tel",
                id="phone",
                placeholder="9876543210",
                style={"border-radius": "0 6px 6px 0", "border-left": "none"}
            )
        ], style={"height": "48px"}),
        html.Div(id="phone-validation", style={"margin-top": "4px"})
    ], style={"margin-bottom": "20px"})

def create_password_field():
    """Create password field with requirements"""
    return html.Div([
        dbc.Label(
            "Password*",
            html_for="password",
            style={"font-weight": "500", "margin-bottom": "6px", "color": "#121212"}
        ),
        dbc.InputGroup([
            dbc.Input(
                type="password",
                id="password",
                placeholder="••••••••",
                style={
                    "height": "48px",
                    "border": "1px solid #D1D5DB",
                    "border-radius": "6px 0 0 6px",
                    "font-size": "16px",
                    "padding": "12px 16px",
                    "border-right": "none"
                }
            ),
            dbc.InputGroupText(
                html.I(
                    className="fas fa-eye",
                    id="password-toggle-icon",
                    style={"color": "#9CA3AF", "cursor": "pointer"}
                ),
                id="password-toggle",
                style={
                    "background": "white",
                    "border": "1px solid #D1D5DB",
                    "border-left": "none",
                    "border-radius": "0 6px 6px 0",
                    "cursor": "pointer",
                    "height": "48px"
                }
            )
        ]),
        
        # Success Message
        html.Div([
            html.I(className="fas fa-check-circle", style={"color": "#10B981", "margin-right": "8px"}),
            html.Span("Success!", style={"color": "#10B981", "font-weight": "500"})
        ], id="password-success", style={"margin-top": "8px", "display": "none"}),
        
        # Password Requirements
        create_password_requirements()
    ], style={"margin-bottom": "24px"})

def create_password_requirements():
    """Create password requirements section"""
    return html.Div([
        html.P(
            "Your password must contain:",
            style={
                "margin": "12px 0 8px 0",
                "font-size": "14px",
                "color": "#374151",
                "font-weight": "500"
            }
        ),
        html.Div([
            create_requirement_item("length-check", "length-text", "At least 8 characters"),
            create_requirement_item("mixed-check", "mixed-text", "At least 1 of the following"),
            create_requirement_item("lower-check", "lower-text", "Lower case letters (a-z)", indent=True),
            create_requirement_item("upper-check", "upper-text", "Upper case letters (A-Z)", indent=True),
            create_requirement_item("numbers-check", "numbers-text", "Numbers (0-9)", indent=True),
            create_requirement_item("special-check", "special-text", "Special characters (e.g. !@#$%-*)", indent=True),
            create_requirement_item("consecutive-check", "consecutive-text", "No more than 2 identical characters in a row", indent=True)
        ])
    ], id="password-requirements", style={"margin-top": "12px"})

def create_requirement_item(check_id, text_id, text, indent=False):
    """Create individual password requirement item"""
    return html.Div([
        html.I(
            className="fas fa-check",
            id=check_id,
            style={"color": "#D1D5DB", "margin-right": "8px", "font-size": "12px"}
        ),
        html.Span(text, id=text_id, style={"font-size": "14px", "color": "#6B7280"})
    ], style={
        "margin-bottom": "6px",
        "display": "flex",
        "align-items": "center",
        "margin-left": "20px" if indent else "0"
    })

def create_terms_checkbox():
    """Create terms and conditions checkbox"""
    return html.Div([
        dbc.Checkbox(
            id="terms-checkbox",
            style={"margin-right": "12px", "margin-top": "2px"}
        ),
        html.Label([
            "By clicking Continue, you agree to the ",
            html.A("Twilio Terms of Service", href="#", style={"color": "#0F62FE", "text-decoration": "none"}),
            " and to the ",
            html.A("Twilio Privacy Policy", href="#", style={"color": "#0F62FE", "text-decoration": "none"}),
            ". If you are in the EEA or UK, you have read and agree to the ",
            html.A("Electronic Communications Code Addendum", href="#", style={"color": "#0F62FE", "text-decoration": "none"}),
            ", if applicable."
        ], html_for="terms-checkbox", style={
            "font-size": "13px",
            "color": "#6B7280",
            "line-height": "1.4",
            "cursor": "pointer"
        })
    ], style={
        "display": "flex",
        "align-items": "flex-start",
        "margin-bottom": "24px"
    })

def create_google_button():
    """Create Google sign up button"""
    return dbc.Button([
        html.Img(
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3LjY0IDkuMjA0NTVDMTcuNjQgOC41NjY4MiAxNy41ODI3IDcuOTUyMjcgMTcuNDc2NCA3LjM2MzY0SDE5VjEwLjg0MDJIMTU4NEMxNS44NCA5LjI1IDEzLjk3IDcuMzYzNjQgMTEuNSA3LjM2MzY0QzguNzI3MjcgNy4zNjM2NCA2LjQ1IDkuNjQwOTEgNi40NSAxMi40MTM2QzYuNDUgMTUuMTg2MyA4LjcyNzI3IDE3LjQ2MzYgMTEuNSAxNy40NjM2QzEzLjk3IDE3LjQ2MzYgMTUuODQgMTUuNTc3MyAxNS44NCAxMy45ODg2SDE3LjY0VjE3LjQ2MzZIMTEuNUM3LjM2MzY0IDE3LjQ2MzYgNCAyMC44MjczIDQgMjVDNCAyOS4xNzI3IDcuMzYzNjQgMzIuNTM2NCAxMS41IDMyLjUzNjRDMTUuNjM2NCAzMi41MzY0IDE5IDI5LjE3MjcgMTkgMjVDMTkgMjMuMTEzNiAxOC4zODY0IDIxLjM0MDkgMTcuMzYzNiAyMC4wNjgyVjEyLjQxMzZIMTEuNVY5LjIwNDU1SDE3LjY0WiIgZmlsbD0iIzQyODVGNCIvPgo8L3N2Zz4K",
            style={"width": "18px", "height": "18px", "margin-right": "12px"}
        ),
        "Sign up with Google"
    ], 
    color="light",
    size="lg",
    style={
        "width": "100%",
        "height": "48px",
        "border": "1px solid #D1D5DB",
        "border-radius": "6px",
        "font-size": "16px",
        "font-weight": "500",
        "color": "#374151",
        "background": "white"
    })

def create_otp_modal():
    """Create OTP verification modal"""
    return dbc.Modal([
        dbc.ModalHeader(dbc.ModalTitle("Verify Your Phone Number")),
        dbc.ModalBody([
            html.P([
                "We've sent a 6-digit verification code to ",
                html.Strong(id="phone-display"),
                ". Please enter it below:"
            ], style={"margin-bottom": "20px"}),
            
            # OTP Input Fields
            html.Div([
                dbc.Input(
                    type="text",
                    id=f"otp-{i}",
                    maxLength=1,
                    style={
                        "width": "50px",
                        "height": "50px",
                        "text-align": "center",
                        "font-size": "20px",
                        "font-weight": "bold",
                        "margin": "0 5px",
                        "border": "2px solid #D1D5DB",
                        "border-radius": "8px"
                    },
                    className="otp-input"
                ) for i in range(6)
            ], style={
                "display": "flex",
                "justify-content": "center",
                "margin-bottom": "20px"
            }),
            
            # Resend OTP
            html.Div([
                html.Span("Didn't receive the code? ", style={"color": "#6B7280"}),
                html.A("Resend OTP", id="resend-otp", href="#", 
                      style={"color": "#0F62FE", "text-decoration": "none"}),
                html.Span(id="resend-timer", style={"color": "#6B7280", "margin-left": "10px"})
            ], style={"text-align": "center", "margin-bottom": "20px"}),
            
            html.Div(id="otp-error", style={"color": "#EF4444", "text-align": "center"})
        ]),
        dbc.ModalFooter([
            dbc.Button("Verify", id="verify-otp-btn", color="primary", size="lg",
                      style={"width": "100%"})
        ])
    ], id="otp-modal", is_open=False, backdrop="static", keyboard=False)

def get_input_style():
    """Get standard input styling"""
    return {
        "height": "48px",
        "border": "1px solid #D1D5DB",
        "border-radius": "6px",
        "font-size": "16px",
        "padding": "12px 16px"
    }
