# Crash Canvas 

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](#) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#) [![ML Model](https://img.shields.io/badge/Model-XGBoost-blue.svg)](#) [![Accuracy](https://img.shields.io/badge/Accuracy-95.1%25-success.svg)](#)

**Crash Canvas** is a <ins>Road Accident Analysis and Prediction System</ins> for data-driven traffic safety insights. This project was developed to tackle the growing problem of traffic accidents in India by moving beyond simple pattern analysis to create real-world safety solutions that save lives. It analyzes historical accident data to identify patterns, predict high-risk areas, and provide actionable insights for improving road safety through machine learning and spatial analysis.

---

##  Overview

India's roads are among the most dangerous in the world, with crashes claiming over 150,000 lives annually. Traditional safety measures are often reactive, responding only after a tragedy occurs. This project was born from the critical need for a proactive approach—a tool that can predict high-risk scenarios *before* they lead to a crash.

Our solution, **Crash Canvas**, is an interactive dashboard that consolidates powerful predictive analytics and data visualization. It empowers traffic authorities, city planners, and first responders with the data they need to make smarter, faster decisions, shifting the paradigm from reactive to proactive road safety management.

###  **[View the Live Project](https://crash-canvas.vercel.app)**

---

## ✨ Key Features

Crash Canvas provides a powerful suite of tools for comprehensive road safety analysis, allowing users to move from raw data to actionable insights.

| Feature                          | Description                                                                                                                                                                                                      |
| :------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🌐 **Interactive Spatial Analysis** | Instantly pinpoint accident hotspots and explore geographical crash concentrations using a dynamic GIS heatmap.                                                                                |
| 🔮 **Real-Time Severity Prediction** | Input any scenario (weather, time, road type) to get an immediate forecast of whether an accident will be **Minor**, **Serious**, or **Fatal**, complete with the key risk factors driving the prediction. |
| 📈 **Historical Trend Analysis** | Explore long-term accident trends with interactive charts that break down data by year, hour of the day, day of the week, and vehicle type involved.                                           |
| 📜 **Policy Impact Analysis** | Connect traffic laws to their real-world impact by viewing clear before-and-after comparisons of crash data for specific policies, providing data-backed insights into what works.                  |
| 🚗 **Detailed Road Analytics** | Dig into the details by comparing accident rates on highways vs. city streets and analyzing risks associated with specific road conditions and lighting.                                      |

---

##  System Architecture & Methodology

The system is designed with a modern, data-centric architecture, starting from data collection and ending with an interactive user dashboard.

| Feature                          | Description                                                                                                                                                                                                      |
| :------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  **Data Collection** | We integrated six years of data (2018-2023) from official Indian sources, including the Ministry of Road Transport and Highways (MoRTH) and the India Meteorological Department (IMD).                                                                                |
|  **Data Preprocessing** | Raw data was carefully cleaned by handling missing values, standardizing categorical labels (e.g., "Drizzle" and "Heavy Rain" were merged into "Rain"), and removing outliers. |
|  **Feature Engineering** | Created new insightful features to boost model performance, including Temporal Features (Time of Day, is_weekend), Environmental Features, and applying One-Hot & Label Encoding.                                           |
|  **Modeling** | The task was framed as a multi-class classification problem to predict accident severity. We experimented with several models, with a tuned **XGBoost** model achieving the highest performance.                  |
|  **Deployment** | The frontend is hosted on Vercel, which connects to a backend ML engine and database via a RESTful API, ensuring a scalable and responsive user experience.                                      |


---

##  Results & Key Findings

Our predictive model proved to be highly reliable for forecasting accident severity in real-world scenarios.

-   **Model Performance:** The tuned **XGBoost model achieved 95.1% accuracy** on the test set, outperforming the Random Forest baseline (89.3%).
-   **Top Predictive Factors:** Feature importance analysis revealed that the most critical factors in determining an accident's severity are:
    1.  **Time of Day**
    2.  **Weather Conditions**
    3.  **Road Type**

---

## Technology Stack

| Category                 | Tools & Technologies                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Data Science & Backend** | `Python`, `Pandas`, `NumPy`, `Scikit-learn`, `XGBoost`                                                             |
| **Frontend & UI** | `React`, `Vite`, `PrimeReact`, `Tailwind CSS`, `Framer Motion`                                                             |
| **Data Visualization** | `Recharts`, `Nivo`, `D3.js`, `Matplotlib`, `Plotly`                                                              |
| **Geospatial Analysis** | `GeoPandas`, `Folium`, `QGIS`, `React Leaflet`                                                                   |
| **Database & Deployment** | `MongoDB`, `Docker`, `Vercel`                                                                                      |

---

##  Authors & Acknowledgements
Authors :

1. Vaishnavi Dwivedi - [Linkedin](https://www.linkedin.com/in/vaishnavi-dwivedi-34068a229/) 
2. Aniket Bhattacharya - [Linkedin](https://www.linkedin.com/in/aniket-bhattacharya-b6938a200/) 



We would like to express our gratitude to our project guide, [Dr. Seema Sharma](https://www.linkedin.com/in/dr-seema-sharma-94724626/), for her invaluable guidance and supervision.
