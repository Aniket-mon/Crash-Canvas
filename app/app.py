# app.py
import dash
import dash_bootstrap_components as dbc
import plotly.express as px
import pandas as pd
import numpy as np
from dash import dcc, html
from dash.dependencies import Input, Output

# ==============================================================================
# Step 1: Create Dummy Data (to be replaced by real data later)
# This simulates the output of the data cleaning phase.
# ==============================================================================
def create_dummy_data(n_samples=500):
    """Generates a DataFrame of simulated accident data."""
    np.random.seed(42)  # for reproducibility
    data = {
        'Severity': np.random.choice(['Low', 'Medium', 'High'], n_samples, p=[0.6, 0.3, 0.1]),
        'DayOfWeek': np.random.choice(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], n_samples),
        'Hour': np.random.randint(0, 24, n_samples),
        'Latitude': np.random.uniform(33.7, 34.2, n_samples),  # Centered around a city like LA
        'Longitude': np.random.uniform(-118.5, -118.0, n_samples),
        'Weather': np.random.choice(['Clear', 'Rain', 'Fog'], n_samples, p=[0.7, 0.2, 0.1])
    }
    df = pd.DataFrame(data)
    # Ensure categorical order for charts
    df['DayOfWeek'] = pd.Categorical(df['DayOfWeek'], categories=['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], ordered=True)
    return df

df = create_dummy_data()

# ==============================================================================
# Step 2: Initialize the Dash App with a Bootstrap Theme
# We use the CYBORG theme for a clean, dark-mode look.
# ==============================================================================
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.CYBORG])
server = app.server # Expose server for Gunicorn

# ==============================================================================
# Step 3: Define the App Layout
# Using dbc.Container, Row, and Col for a responsive grid layout.
# ==============================================================================
app.layout = dbc.Container(fluid=True, children=[
    # Header
    dbc.Row(
        html.H1("Road Accident Analysis Dashboard (v0.1)", className="text-white bg-dark p-2 text-center"),
        className="mb-4"
    ),

    # Controls and KPIs
    dbc.Row([
        # Filter Controls
        dbc.Col(md=4, children=[
            dbc.Card([
                dbc.CardBody([
                    html.H5("Filters", className="card-title"),
                    dcc.Dropdown(
                        id='severity-filter',
                        options=[{'label': i, 'value': i} for i in ['All'] + list(df['Severity'].unique())],
                        value='All',
                        clearable=False
                    ),
                ])
            ], className="bg-dark text-white")
        ]),
        # KPI Cards
        dbc.Col(md=8, children=[
            dbc.Row([
                dbc.Col(dbc.Card(id='kpi-total-accidents', className="p-3 bg-dark text-white text-center")),
                dbc.Col(dbc.Card(id='kpi-most-common-day', className="p-3 bg-dark text-white text-center")),
            ])
        ])
    ], className="mb-4"),

    # Charts
    dbc.Row([
        dbc.Col(md=8, children=[
            dcc.Graph(id='accident-map')
        ]),
        dbc.Col(md=4, children=[
            dcc.Graph(id='accidents-by-day')
        ]),
    ]),

    dbc.Row([
        dbc.Col(md=6, children=[
            dcc.Graph(id='accidents-by-hour')
        ]),
        dbc.Col(md=6, children=[
            dcc.Graph(id='accidents-by-weather')
        ]),
    ], className="mt-4"),
])

# ==============================================================================
# Step 4: Define Callbacks for Interactivity
# One callback to rule them all: updates all charts and KPIs from the filter.
# ==============================================================================
@app.callback(
    [Output('accident-map', 'figure'),
     Output('accidents-by-day', 'figure'),
     Output('accidents-by-hour', 'figure'),
     Output('accidents-by-weather', 'figure'),
     Output('kpi-total-accidents', 'children'),
     Output('kpi-most-common-day', 'children')],
    [Input('severity-filter', 'value')]
)
def update_dashboard(selected_severity):
    # Filter data based on selection
    if selected_severity == 'All':
        filtered_df = df
    else:
        filtered_df = df[df['Severity'] == selected_severity]

    # Don't crash on empty data
    if filtered_df.empty:
        return [{}, {}, {}, {}, "Total Accidents: 0", "Busiest Day: N/A"]

    # --- Update Figures ---
    # Map
    map_fig = px.scatter_mapbox(
        filtered_df, lat="Latitude", lon="Longitude", color="Severity",
        color_discrete_map={'Low': 'green', 'Medium': 'orange', 'High': 'red'},
        zoom=9, height=500, title="Accident Locations"
    )
    map_fig.update_layout(mapbox_style="carto-darkmatter", margin={"r":0,"t":40,"l":0,"b":0})

    # Bar chart by day
    day_counts = filtered_df['DayOfWeek'].value_counts().sort_index()
    day_fig = px.bar(day_counts, x=day_counts.index, y=day_counts.values,
                     labels={'y': 'Number of Accidents', 'x': 'Day of Week'},
                     title="Accidents by Day")

    # Histogram by hour
    hour_fig = px.histogram(filtered_df, x='Hour', nbins=24, title="Accidents by Hour of Day")

    # Pie chart by weather
    weather_fig = px.pie(filtered_df, names='Weather', title="Accidents by Weather Condition")

    # Update template for dark theme
    for fig in [day_fig, hour_fig, weather_fig]:
        fig.update_layout(template="plotly_dark")

    # --- Update KPIs ---
    total_accidents = f"Total Accidents: {len(filtered_df)}"
    most_common_day = f"Busiest Day: {filtered_df['DayOfWeek'].mode()[0]}"

    return map_fig, day_fig, hour_fig, weather_fig, total_accidents, most_common_day

# ==============================================================================
# Step 5: Run the App
# ==============================================================================
if __name__ == '__main__':
    app.run_server(debug=True)
