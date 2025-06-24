import streamlit as st
import streamlit.components.v1 as components
import os

# Only show the loader once per session
html_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'home.html')
with open(html_path, 'r', encoding='utf-8') as file:
    combined_html = file.read()

# Only show loader/video once per session
if 'loader_shown' not in st.session_state:
    st.session_state['loader_shown'] = False

if not st.session_state['loader_shown']:
    st.components.v1.html(combined_html, height=1080, width=1080)
    st.session_state['loader_shown'] = True

def load_css(file_name):
    with open(file_name) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

def load_js(file_name):
    with open(file_name) as f:
        js_code = f.read()
        st.markdown(f"<script>{js_code}</script>", unsafe_allow_html=True)

css_path = os.path.join("..", "assets", "home.css")
js_path = os.path.join("..", "assets", "home.js")
load_css(css_path)
load_js(js_path)

# snow effect
snow_html = """
<div class="snow-wrapper">
  <div class="snow"></div>
  <div class="snow"></div>
  <div class="snow"></div>
  <div class="snow"></div>
  <div class="snow"></div>
  <div class="snow"></div>
  <div class="snow"></div>
  <div class="snow"></div>
  <div class="snow"></div>
  <div class="snow"></div>
</div>
"""
st.markdown(snow_html, unsafe_allow_html=True)

# Page configuration
st.set_page_config(page_title="Road Accident Analysis and Prediction System", layout="centered", initial_sidebar_state="expanded")

# Title and description
st.title("Crash Canvas")

st.markdown("""
<style>
body {
    background-color: #f0f2f6;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
h1, h2, h3, h4, h5, h6 {
    color: #2c3e50;
}
.project-description {
    font-size: 18px;
    color: #34495e;
    line-height: 1.6;
    margin-bottom: 30px;
}
.creators-section {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    margin-bottom: 40px;
}
.creator {
    text-align: center;
    padding: 10px;
}
.creator img {
    border-radius: 50%;
    width: 150px;
    height: 150px;
    object-fit: cover;
    border: 4px solid #2980b9;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(41,128,185,0.15);
    background: #eaf6fb;
}
.creator-name {
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
}
.creator-role {
    font-size: 16px;
    color: #7f8c8d;
    margin-bottom: 10px;
}
.creator-tagline {
    font-style: italic;
    color: #34495e;
}
</style>
""", unsafe_allow_html=True)

st.markdown("""
This project aims to analyze historical road accident data to identify patterns, trends, and hotspots.  
Using machine learning, it predicts the likelihood and severity of accidents to provide actionable insights.  
Our goal is to enhance road safety awareness and assist policymakers and traffic authorities in preventive planning.  
Explore interactive visualizations, accident hotspots, and prediction insights through our user-friendly interface.
""")

st.markdown("---")

st.header("Creators")

col1, col2 = st.columns(2)

with col1:
    st.image("../assets/aniCC.png", caption="Aniket")
    st.subheader("Aniket Bhattacharya")
    st.write("Designer & Security Analyst")
    st.markdown("Passionate about transforming data into life-saving insights.")

with col2:
    st.image("https://via.placeholder.com/150", caption="Vaishnavi")
    st.subheader("Vaishnavi Dwivedi")
    st.write("Data Scientist & Visualization Expert")
    st.markdown("Dedicated to mapping accident hotspots for safer roads.")
