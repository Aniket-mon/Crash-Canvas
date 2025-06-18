import dash_bootstrap_components as dbc
from dash import html, dcc
import phonenumbers
from phonenumbers import geocoder, carrier

def create_signup_form_with_otp():
    return dbc.Container([
        # Header Section (same as before)
        html.Div([
            html.Img(src="/assets/twilio-logo.png", style={"height": "32px", "margin-bottom": "24px"}),
            html.H1("Sign up for free", style={"font-size": "28px", "font-weight": "600", "margin-bottom": "8px"}),
            html.P("Start your free trial and unlock all Twilio products, including Twilio SendGrid and Twilio Segment.",
                   style={"color": "#606B85", "font-size": "16px", "margin-bottom": "32px"})
        ]),
        
        # Main Form
        dbc.Form([
            # First Name
            html.Div([
                dbc.Label("First name", html_for="first-name", style={"font-weight": "500", "margin-bottom": "6px"}),
                dbc.Input(type="text", id="first-name", placeholder="Aniket", 
                         style={"height": "48px", "border-radius": "6px"})
            ], style={"margin-bottom": "20px"}),
            
            # Last Name
            html.Div([
                dbc.Label("Last name", html_for="last-name", style={"font-weight": "500", "margin-bottom": "6px"}),
                dbc.Input(type="text", id="last-name", placeholder="Bhattacharya",
                         style={"height": "48px", "border-radius": "6px"})
            ], style={"margin-bottom": "20px"}),
            
            # Email
            html.Div([
                dbc.Label("Email address*", html_for="email", style={"font-weight": "500", "margin-bottom": "6px"}),
                dbc.Input(type="email", id="email", placeholder="aniket.bhattacharya1729@gmail.com",
                         style={"height": "48px", "border-radius": "6px"}),
                html.Div(id="email-validation", style={"margin-top": "4px"})
            ], style={"margin-bottom": "20px"}),
            
            # Phone Number with Country Code
            html.Div([
                dbc.Label("Phone number*", html_for="phone", style={"font-weight": "500", "margin-bottom": "6px"}),
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
                            {"label": "🇨🇳 +86", "value": "+86"},
                            {"label": "🇧🇷 +55", "value": "+55"}
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
            ], style={"margin-bottom": "20px"}),
            
            # Password Field (same as before with all requirements)
            html.Div([
                dbc.Label("Password*", html_for="password", style={"font-weight": "500", "margin-bottom": "6px"}),
                dbc.InputGroup([
                    dbc.Input(type="password", id="password", placeholder="••••••••",
                             style={"height": "48px", "border-radius": "6px 0 0 6px"}),
                    dbc.InputGroupText(
                        html.I(className="fas fa-eye", id="password-toggle-icon"),
                        id="password-toggle",
                        style={"cursor": "pointer", "border-radius": "0 6px 6px 0"}
                    )
                ]),
                
                # Password Success/Requirements (same as before)
                html.Div([
                    html.I(className="fas fa-check-circle", style={"color": "#10B981", "margin-right": "8px"}),
                    html.Span("Success!", style={"color": "#10B981", "font-weight": "500"})
                ], id="password-success", style={"margin-top": "8px", "display": "none"}),
                
                # Password requirements section (same as detailed before)
                html.Div(id="password-requirements-section", children=[
                    # All password requirements as shown in previous implementation
                ])
            ], style={"margin-bottom": "24px"}),
            
            # Terms Checkbox (same as before)
            html.Div([
                dbc.Checkbox(id="terms-checkbox", style={"margin-right": "12px"}),
                html.Label([
                    "By clicking Continue, you agree to the ",
                    html.A("Twilio Terms of Service", href="#", style={"color": "#0F62FE"}),
                    " and to the ",
                    html.A("Twilio Privacy Policy", href="#", style={"color": "#0F62FE"}),
                    "."
                ], html_for="terms-checkbox", style={"font-size": "13px", "color": "#6B7280"})
            ], style={"display": "flex", "margin-bottom": "24px"}),
            
            # Continue Button
            dbc.Button("Continue", id="continue-btn", color="primary", size="lg", disabled=True,
                      style={"width": "100%", "height": "48px", "margin-bottom": "24px"}),
            
            # Login Link and Google Button (same as before)
        ]),
        
        # OTP Verification Modal
        dbc.Modal([
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
    ], style={"max-width": "400px", "margin": "40px auto", "padding": "0 20px"})
