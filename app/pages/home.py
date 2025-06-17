import dash
from dash import html, dcc, callback, Input, Output
import dash_bootstrap_components as dbc
import plotly.express as px
import plotly.graph_objects as go
from components.data_generator import create_accident_data, get_summary_stats

# Register this page
dash.register_page(__name__, path='/', name='Home')

# Load data
df = create_accident_data()
stats = get_summary_stats(df)

# Page layout
layout = dbc.Container([
    dbc.Row([
        dbc.Col([
            html.H1("Road Accident Analysis Dashboard", className="text-center mb-4"),
            html.P("Comprehensive analysis of road accident patterns and trends", 
                   className="text-center text-muted mb-5")
        ])
    ]),
    
    # KPI Cards
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H4(f"{stats['total_accidents']:,}", className="card-title text-primary"),
                    html.P("Total Accidents", className="card-text")
                ])
            ], className="text-center")
        ], md=3),
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H4(f"{stats['fatal_accidents']:,}", className="card-title text-danger"),
                    html.P("Fatal Accidents", className="card-text")
                ])
            ], className="text-center")
        ], md=3),
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H4(f"{stats['most_dangerous_hour']}:00", className="card-title text-warning"),
                    html.P("Peak Hour", className="card-text")
                ])
            ], className="text-center")
        ], md=3),
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H4(stats['most_dangerous_day'], className="card-title text-info"),
                    html.P("Peak Day", className="card-text")
                ])
            ], className="text-center")
        ], md=3),
    ], className="mb-4"),
    
    # Charts
    dbc.Row([
        dbc.Col([
            dcc.Graph(
                figure=px.line(
                    x=list(stats['yearly_trend'].keys()),
                    y=list(stats['yearly_trend'].values()),
                    title="Accident Trends Over Years",
                    template="plotly_dark"
                ).update_layout(
                    xaxis_title="Year",
                    yaxis_title="Number of Accidents"
                )
            )
        ], md=6),
        dbc.Col([
            dcc.Graph(
                figure=px.bar(
                    x=list(stats['weather_impact'].keys()),
                    y=list(stats['weather_impact'].values()),
                    title="Average Severity by Weather Condition",
                    template="plotly_dark"
                ).update_layout(
                    xaxis_title="Weather Condition",
                    yaxis_title="Average Severity Score"
                )
            )
        ], md=6),
    ], className="mb-4"),
    
    # Overview section
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H5("System Overview", className="card-title"),
                    html.P([
                        "This dashboard provides comprehensive analysis of road accident data including:",
                        html.Br(),
                        "• Temporal and spatial pattern analysis",
                        html.Br(),
                        "• Risk factor identification",
                        html.Br(),
                        "• Predictive modeling capabilities",
                        html.Br(),
                        "• Interactive visualizations and filtering"
                    ])
                ])
            ])
        ])
    ])
], fluid=True)
