import dash
from dash import html, dcc, callback, Input, Output, State
import dash_bootstrap_components as dbc
import plotly.express as px
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from components.data_generator import create_accident_data

# Register this page
dash.register_page(__name__, name='Predictions')

# Load and prepare data for modeling
df = create_accident_data()

# Prepare features for ML model
def prepare_model_data(df):
    model_df = df.copy()
    
    # Encode categorical variables
    le_weather = LabelEncoder()
    le_road_type = LabelEncoder()
    le_age_group = LabelEncoder()
    le_gender = LabelEncoder()
    
    model_df['Weather_encoded'] = le_weather.fit_transform(model_df['Weather'])
    model_df['Road_Type_encoded'] = le_road_type.fit_transform(model_df['Road_Type'])
    model_df['Age_Group_encoded'] = le_age_group.fit_transform(model_df['Age_Group'])
    model_df['Gender_encoded'] = le_gender.fit_transform(model_df['Gender'])
    
    # Select features
    features = ['Hour', 'Weather_encoded', 'Road_Type_encoded', 'Vehicle_Count', 
                'Speed_Limit', 'Age_Group_encoded', 'Gender_encoded', 'Rush_Hour']
    
    X = model_df[features]
    y = model_df['Severity_Score']
    
    return X, y, le_weather, le_road_type, le_age_group, le_gender

# Train model
X, y, le_weather, le_road_type, le_age_group, le_gender = prepare_model_data(df)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Get feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

# Page layout
layout = dbc.Container([
    dbc.Row([
        dbc.Col([
            html.H2("Accident Prediction & Risk Assessment", className="mb-4"),
        ])
    ]),
    
    dbc.Row([
        # Prediction form
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H5("Risk Prediction Tool", className="card-title"),
                    html.P("Enter scenario details to predict accident severity risk:"),
                    
                    html.Label("Hour of Day:"),
                    dcc.Slider(
                        id='pred-hour',
                        min=0, max=23, step=1, value=12,
                        marks={i: str(i) for i in range(0, 24, 4)},
                        className="mb-3"
                    ),
                    
                    html.Label("Weather Condition:"),
                    dcc.Dropdown(
                        id='pred-weather',
                        options=[{'label': w, 'value': w} for w in df['Weather'].unique()],
                        value='Clear',
                        className="mb-3"
                    ),
                    
                    html.Label("Road Type:"),
                    dcc.Dropdown(
                        id='pred-road-type',
                        options=[{'label': r, 'value': r} for r in df['Road_Type'].unique()],
                        value='Urban',
                        className="mb-3"
                    ),
                    
                    html.Label("Speed Limit:"),
                    dcc.Dropdown(
                        id='pred-speed-limit',
                        options=[{'label': f"{s} mph", 'value': s} for s in sorted(df['Speed_Limit'].unique())],
                        value=35,
                        className="mb-3"
                    ),
                    
                    html.Label("Age Group:"),
                    dcc.Dropdown(
                        id='pred-age-group',
                        options=[{'label': a, 'value': a} for a in df['Age_Group'].unique()],
                        value='26-35',
                        className="mb-3"
                    ),
                    
                    dbc.Button("Predict Risk", id="predict-btn", color="primary", className="w-100")
                ])
            ])
        ], md=4),
        
        # Results and visualizations
        dbc.Col([
            dbc.Row([
                dbc.Col([
                    dbc.Card([
                        dbc.CardBody([
                            html.H5("Prediction Result", className="card-title"),
                            html.Div(id="prediction-result", className="text-center")
                        ])
                    ])
                ], md=12)
            ], className="mb-4"),
            
            dbc.Row([
                dbc.Col([
                    dcc.Graph(
                        figure=px.bar(
                            feature_importance.head(8),
                            x='importance', y='feature',
                            orientation='h',
                            title="Feature Importance in Prediction Model",
                            template="plotly_dark"
                        ).update_layout(yaxis={'categoryorder': 'total ascending'})
                    )
                ], md=12)
            ])
        ], md=8)
    ], className="mb-4"),
    
    # Model performance section
    dbc.Row([
        dbc.Col([
            dbc.Card([
                dbc.CardBody([
                    html.H5("Model Performance", className="card-title"),
                    html.P(f"Training Accuracy: {model.score(X_train, y_train):.3f}"),
                    html.P(f"Test Accuracy: {model.score(X_test, y_test):.3f}"),
                    html.P("Model: Random Forest Classifier with 100 estimators")
                ])
            ])
        ])
    ])
], fluid=True)

# Prediction callback
@callback(
    Output('prediction-result', 'children'),
    [Input('predict-btn', 'n_clicks')],
    [State('pred-hour', 'value'),
     State('pred-weather', 'value'),
     State('pred-road-type', 'value'),
     State('pred-speed-limit', 'value'),
     State('pred-age-group', 'value')]
)
def make_prediction(n_clicks, hour, weather, road_type, speed_limit, age_group):
    if n_clicks is None:
        return "Click 'Predict Risk' to see results"
    
    # Prepare input data
    weather_encoded = le_weather.transform([weather])[0]
    road_type_encoded = le_road_type.transform([road_type])[0]
    age_group_encoded = le_age_group.transform([age_group])[0]
    gender_encoded = 0  # Default to male for prediction
    rush_hour = 1 if (7 <= hour <= 9) or (17 <= hour <= 19) else 0
    
    input_data = np.array([[hour, weather_encoded, road_type_encoded, 2, 
                           speed_limit, age_group_encoded, gender_encoded, rush_hour]])
    
    # Make prediction
    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0]
    
    severity_labels = {1: 'Low', 2: 'Medium', 3: 'High', 4: 'Fatal'}
    predicted_severity = severity_labels[prediction]
    confidence = max(probability) * 100
    
    # Create result display
    color_map = {'Low': 'success', 'Medium': 'warning', 'High': 'danger', 'Fatal': 'dark'}
    
    return dbc.Alert([
        html.H4(f"Predicted Severity: {predicted_severity}", className="alert-heading"),
        html.P(f"Confidence: {confidence:.1f}%"),
        html.Hr(),
        html.P("This prediction is based on historical accident patterns and should be used for general risk assessment only.")
    ], color=color_map[predicted_severity])
