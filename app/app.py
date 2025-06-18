import dash
from dash import html, dcc
import dash_bootstrap_components as dbc
from flask import Flask, session
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import authentication modules
from auth.callbacks import register_auth_callbacks
from database.models import init_db

# Initialize Flask server
server = Flask(__name__)
server.secret_key = os.getenv('SECRET_KEY', 'your-fallback-secret-key-change-in-production')

# Initialize the app with multi-page support and authentication
app = dash.Dash(
    __name__,
    server=server,
    use_pages=True,
    external_stylesheets=[
        dbc.themes.CYBORG,  # Keep your existing theme
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"  # For icons
    ],
    suppress_callback_exceptions=True,
    assets_folder='assets'
)

# Expose server for deployment
server = app.server

# Initialize database
try:
    init_db()
except Exception as e:
    print(f"Database initialization warning: {e}")

# Authentication-aware navigation bar component
def create_navbar(authenticated=False, user_name=None):
    """Create navigation bar based on authentication state"""
    if authenticated:
        # Authenticated user navbar
        nav_items = [
            dbc.NavItem(dbc.NavLink("Home", href="/")),
            dbc.NavItem(dbc.NavLink("Analytics", href="/analytics")),
            dbc.NavItem(dbc.NavLink("Predictions", href="/predictions")),
            dbc.DropdownMenu(
                children=[
                    dbc.DropdownMenuItem("Profile", href="/profile"),
                    dbc.DropdownMenuItem("Settings", href="/settings"),
                    dbc.DropdownMenuItem(divider=True),
                    dbc.DropdownMenuItem("Logout", href="/logout", id="logout-link"),
                ],
                nav=True,
                in_navbar=True,
                label=f"Welcome, {user_name or 'User'}",
                toggle_style={"color": "white"}
            ),
        ]
        brand_text = "Road Accident Analysis System"
    else:
        # Unauthenticated user navbar
        nav_items = [
            dbc.NavItem(dbc.NavLink("Login", href="/login")),
            dbc.NavItem(dbc.NavLink("Sign Up", href="/signup")),
        ]
        brand_text = "Road Accident Analysis System - Please Login"
    
    return dbc.NavbarSimple(
        children=nav_items,
        brand=brand_text,
        brand_href="/",
        color="dark",
        dark=True,
        className="mb-4"
    )

# Register authentication pages
dash.register_page(
    "signup", 
    path="/signup", 
    layout=lambda: html.Div(id="signup-page-content")
)

dash.register_page(
    "login", 
    path="/login", 
    layout=lambda: html.Div(id="login-page-content")
)

dash.register_page(
    "logout", 
    path="/logout", 
    layout=lambda: html.Div(id="logout-page-content")
)

dash.register_page(
    "profile", 
    path="/profile", 
    layout=lambda: html.Div(id="profile-page-content")
)

# Main app layout with authentication state management
app.layout = dbc.Container([
    # Store components for session management
    dcc.Store(id="session-store", storage_type="session"),
    dcc.Store(id="user-store", storage_type="session"),
    dcc.Location(id="url", refresh=False),
    
    # Dynamic navbar based on authentication state
    html.Div(id="navbar-container"),
    
    # Page content container
    html.Div(id="page-content-container", children=[
        dash.page_container
    ]),
    
    # Authentication modals and components
    html.Div(id="auth-modals-container")
], fluid=True)

# Authentication state callback
@app.callback(
    [dash.dependencies.Output("navbar-container", "children"),
     dash.dependencies.Output("page-content-container", "style")],
    [dash.dependencies.Input("url", "pathname"),
     dash.dependencies.Input("session-store", "data"),
     dash.dependencies.Input("user-store", "data")]
)
def update_layout_based_on_auth(pathname, session_data, user_data):
    """Update layout based on authentication state"""
    
    # Public pages that don't require authentication
    public_pages = ["/login", "/signup", "/logout"]
    
    # Check if user is authenticated
    is_authenticated = False
    user_name = None
    
    if session_data and user_data:
        is_authenticated = session_data.get("authenticated", False)
        user_name = user_data.get("first_name", "User")
    
    # Create navbar based on authentication state
    navbar = create_navbar(is_authenticated, user_name)
    
    # Handle page access control
    if pathname in public_pages:
        # Public pages - show normal content
        content_style = {"display": "block"}
    elif is_authenticated:
        # Protected pages - user is authenticated
        content_style = {"display": "block"}
    else:
        # Protected pages - user not authenticated, redirect to login
        content_style = {"display": "none"}
        # This would trigger a redirect to login page
    
    return navbar, content_style

# Authentication page content callbacks
@app.callback(
    dash.dependencies.Output("signup-page-content", "children"),
    [dash.dependencies.Input("url", "pathname")]
)
def display_signup_page(pathname):
    """Display signup page content"""
    if pathname == "/signup":
        from auth.forms import create_signup_form
        return create_signup_form()
    return dash.no_update

@app.callback(
    dash.dependencies.Output("login-page-content", "children"),
    [dash.dependencies.Input("url", "pathname")]
)
def display_login_page(pathname):
    """Display login page content"""
    if pathname == "/login":
        from auth.forms import create_login_form
        return create_login_form()
    return dash.no_update

@app.callback(
    dash.dependencies.Output("logout-page-content", "children"),
    [dash.dependencies.Input("url", "pathname")]
)
def display_logout_page(pathname):
    """Handle logout functionality"""
    if pathname == "/logout":
        return html.Div([
            html.H2("Logging out...", className="text-center"),
            html.P("Please wait while we log you out.", className="text-center"),
            dcc.Interval(id="logout-interval", interval=1000, n_intervals=0, max_intervals=1)
        ])
    return dash.no_update

@app.callback(
    dash.dependencies.Output("profile-page-content", "children"),
    [dash.dependencies.Input("url", "pathname")],
    [dash.dependencies.State("user-store", "data")]
)
def display_profile_page(pathname, user_data):
    """Display user profile page"""
    if pathname == "/profile" and user_data:
        return html.Div([
            html.H2("User Profile", className="text-center mb-4"),
            dbc.Card([
                dbc.CardBody([
                    html.H4(f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}", 
                           className="card-title"),
                    html.P(f"Email: {user_data.get('email', '')}", className="card-text"),
                    html.P(f"Phone: {user_data.get('phone', '')}", className="card-text"),
                    html.P(f"Member since: {user_data.get('created_at', '')}", className="card-text"),
                    dbc.Button("Edit Profile", color="primary", className="mt-3")
                ])
            ], style={"max-width": "500px", "margin": "0 auto"})
        ])
    elif pathname == "/profile":
        # Not authenticated, redirect to login
        return dcc.Location(pathname="/login", id="redirect-to-login")
    return dash.no_update

# Logout handling callback
@app.callback(
    [dash.dependencies.Output("session-store", "data", allow_duplicate=True),
     dash.dependencies.Output("user-store", "data", allow_duplicate=True),
     dash.dependencies.Output("url", "pathname", allow_duplicate=True)],
    [dash.dependencies.Input("logout-interval", "n_intervals")],
    prevent_initial_call=True
)
def handle_logout(n_intervals):
    """Handle user logout"""
    if n_intervals and n_intervals > 0:
        # Clear session data and redirect to login
        return {}, {}, "/login"
    return dash.no_update, dash.no_update, dash.no_update

# Protected route middleware
@app.callback(
    dash.dependencies.Output("url", "pathname", allow_duplicate=True),
    [dash.dependencies.Input("url", "pathname")],
    [dash.dependencies.State("session-store", "data")],
    prevent_initial_call=True
)
def protect_routes(pathname, session_data):
    """Protect routes that require authentication"""
    
    # Define protected routes
    protected_routes = ["/", "/analytics", "/predictions", "/profile", "/settings"]
    public_routes = ["/login", "/signup", "/logout"]
    
    # Check if current path is protected
    if pathname in protected_routes:
        # Check if user is authenticated
        if not session_data or not session_data.get("authenticated", False):
            # Redirect to login page
            return "/login"
    
    # Allow access to public routes or if authenticated
    return dash.no_update

# Register all authentication callbacks
try:
    register_auth_callbacks(app)
except Exception as e:
    print(f"Authentication callbacks registration warning: {e}")

# Error handling for missing authentication components
@app.callback(
    dash.dependencies.Output("auth-modals-container", "children"),
    [dash.dependencies.Input("url", "pathname")]
)
def load_auth_components(pathname):
    """Load authentication components when needed"""
    if pathname in ["/signup", "/login"]:
        try:
            # This will contain OTP modals and other auth components
            return html.Div([
                # OTP Modal will be loaded here by auth callbacks
                html.Div(id="otp-modal-placeholder")
            ])
        except Exception as e:
            print(f"Auth components loading warning: {e}")
            return html.Div()
    return html.Div()

if __name__ == '__main__':
    app.run_server(
        debug=os.getenv('DEBUG', 'True').lower() == 'true',
        host='0.0.0.0', 
        port=int(os.getenv('PORT', 8050))
    )
