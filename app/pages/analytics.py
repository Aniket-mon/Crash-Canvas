import dash
from dash import html, dcc, callback, Input, Output
import dash_bootstrap_components as dbc
import plotly.express as px
import plotly.graph_objects as go
from components.data_generator import create_accident_data

# Register this page
dash.register_page(__name__, name='Analytics')

# Load data
df = create_accident_data()

# Page layout
layout = dbc.Container([
    dbc.Row([
        dbc.Col([
            html.H2("Detailed Analytics", className="mb-4"),
        ])
    ]),
    
    # Filters
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H5("Filters", className="card-title"),
                    html.Label("Severity Level:"),
                    dcc.Dropdown(
                        id='severity-filter',
                        options=[{'label': 'All', 'value': 'All'}] + 
                               [{'label': sev, 'value': sev} for sev in df['Severity'].unique()],
                        value='All',
                        className="mb-3"
                    ),
                    html.Label("Year:"),
                    dcc.Dropdown(
                        id='year-filter',
                        options=[{'label': 'All', 'value': 'All'}] + 
                               [{'label': year, 'value': year} for year in sorted(df['Year'].unique())],
                        value='All',
                        className="mb-3"
                    ),
                    html.Label("Weather Condition:"),
                    dcc.Dropdown(
                        id='weather-filter',
                        options=[{'label': 'All', 'value': 'All'}] + 
                               [{'label': weather, 'value': weather} for weather in df['Weather'].unique()],
                        value='All'
                    )
                ])
            ])
        ], md=3),
        
        # Main content
        dbc.Col([
            dbc.Row([
                dbc.Col([
                    dcc.Graph(id='hourly-distribution')
                ], md=6),
                dbc.Col([
                    dcc.Graph(id='daily-distribution')
                ], md=6),
            ]),
            dbc.Row([
                dbc.Col([
                    dcc.Graph(id='severity-by-age')
                ], md=6),
                dbc.Col([
                    dcc.Graph(id='accident-heatmap')
                ], md=6),
            ]),
        ], md=9)
    ])
], fluid=True)

# Callbacks for interactivity
@callback(
    [Output('hourly-distribution', 'figure'),
     Output('daily-distribution', 'figure'),
     Output('severity-by-age', 'figure'),
     Output('accident-heatmap', 'figure')],
    [Input('severity-filter', 'value'),
     Input('year-filter', 'value'),
     Input('weather-filter', 'value')]
)
def update_analytics_charts(severity, year, weather):
    # Filter data
    filtered_df = df.copy()
    
    if severity != 'All':
        filtered_df = filtered_df[filtered_df['Severity'] == severity]
    if year != 'All':
        filtered_df = filtered_df[filtered_df['Year'] == year]
    if weather != 'All':
        filtered_df = filtered_df[filtered_df['Weather'] == weather]
    
    # Create figures
    hourly_fig = px.histogram(
        filtered_df, x='Hour', 
        title="Accidents by Hour of Day",
        template="plotly_dark"
    )
    
    daily_fig = px.histogram(
        filtered_df, x='DayOfWeek',
        category_orders={'DayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']},
        title="Accidents by Day of Week",
        template="plotly_dark"
    )
    
    severity_age_fig = px.box(
        filtered_df, x='Age_Group', y='Severity_Score',
        title="Severity Distribution by Age Group",
        template="plotly_dark"
    )
    
    # Create heatmap data
    heatmap_data = filtered_df.groupby(['Hour', 'DayOfWeek']).size().reset_index(name='Count')
    heatmap_pivot = heatmap_data.pivot(index='Hour', columns='DayOfWeek', values='Count').fillna(0)
    
    heatmap_fig = px.imshow(
        heatmap_pivot,
        title="Accident Frequency Heatmap (Hour vs Day)",
        template="plotly_dark",
        aspect="auto"
    )
    
    return hourly_fig, daily_fig, severity_age_fig, heatmap_fig
