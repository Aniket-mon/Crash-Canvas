import dash
from dash import html, dcc
import dash_bootstrap_components as dbc

# Initialize the app with multi-page support
app = dash.Dash(
    __name__, 
    use_pages=True,
    external_stylesheets=[dbc.themes.CYBORG],
    suppress_callback_exceptions=True
)

# Expose server for deployment
server = app.server

# Navigation bar component
navbar = dbc.NavbarSimple(
    children=[
        dbc.NavItem(dbc.NavLink("Home", href="/")),
        dbc.NavItem(dbc.NavLink("Analytics", href="/analytics")),
        dbc.NavItem(dbc.NavLink("Predictions", href="/predictions")),
    ],
    brand="Road Accident Analysis System",
    brand_href="/",
    color="dark",
    dark=True,
    className="mb-4"
)

# Main app layout
app.layout = dbc.Container([
    navbar,
    dash.page_container
], fluid=True)

if __name__ == '__main__':
    app.run_server(debug=True, host='0.0.0.0', port=8050)
