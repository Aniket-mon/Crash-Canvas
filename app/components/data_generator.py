import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def create_accident_data(n_samples=1000):
    """Generate comprehensive accident data for analysis"""
    np.random.seed(42)
    
    # Generate base data
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2024, 12, 31)
    date_range = pd.date_range(start=start_date, end=end_date, freq='D')
    
    data = {
        'Date': np.random.choice(date_range, n_samples),
        'Severity': np.random.choice(['Low', 'Medium', 'High', 'Fatal'], n_samples, p=[0.5, 0.3, 0.15, 0.05]),
        'Hour': np.random.randint(0, 24, n_samples),
        'Latitude': np.random.uniform(33.7, 34.2, n_samples),
        'Longitude': np.random.uniform(-118.5, -118.0, n_samples),
        'Weather': np.random.choice(['Clear', 'Rain', 'Fog', 'Snow'], n_samples, p=[0.6, 0.25, 0.1, 0.05]),
        'Road_Type': np.random.choice(['Highway', 'Urban', 'Rural'], n_samples, p=[0.4, 0.4, 0.2]),
        'Vehicle_Count': np.random.randint(1, 5, n_samples),
        'Speed_Limit': np.random.choice([25, 35, 45, 55, 65, 75], n_samples),
        'Age_Group': np.random.choice(['16-25', '26-35', '36-50', '51-65', '65+'], n_samples),
        'Gender': np.random.choice(['Male', 'Female'], n_samples, p=[0.6, 0.4])
    }
    
    df = pd.DataFrame(data)
    
    # Add derived features
    df['DayOfWeek'] = df['Date'].dt.day_name()
    df['Month'] = df['Date'].dt.month_name()
    df['Year'] = df['Date'].dt.year
    df['Is_Weekend'] = df['Date'].dt.weekday >= 5
    df['Rush_Hour'] = ((df['Hour'] >= 7) & (df['Hour'] <= 9)) | ((df['Hour'] >= 17) & (df['Hour'] <= 19))
    
    # Create severity score for modeling
    severity_map = {'Low': 1, 'Medium': 2, 'High': 3, 'Fatal': 4}
    df['Severity_Score'] = df['Severity'].map(severity_map)
    
    return df

def get_summary_stats(df):
    """Generate summary statistics for the dashboard"""
    stats = {
        'total_accidents': len(df),
        'fatal_accidents': len(df[df['Severity'] == 'Fatal']),
        'most_dangerous_hour': df.groupby('Hour').size().idxmax(),
        'most_dangerous_day': df.groupby('DayOfWeek').size().idxmax(),
        'weather_impact': df.groupby('Weather')['Severity_Score'].mean().to_dict(),
        'yearly_trend': df.groupby('Year').size().to_dict()
    }
    return stats
