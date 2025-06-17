FROM python:3.10-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERE=1

WORKDIR /app


RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgdal-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .


EXPOSE 8050

# Use gunicorn for a production-ready WSGI server.
# This command assumes your main application file is named 'app.py'
# and the Dash server instance is named 'server'.
# (e.g., in app.py: app = dash.Dash(__name__); server = app.server)
CMD ["gunicorn", "--bind", "0.0.0.0:8050", "app:server"]
