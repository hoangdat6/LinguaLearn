# Use Python 3.10 as base image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend.settings

# Set working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    gcc \
    python3-dev \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

COPY entrypoint.sh /app/entrypoint.sh
# Make the entrypoint script executable
RUN chmod u+x /app/entrypoint.sh

# Create a non-root user and switch to it
RUN useradd -m appuser
RUN chown -R appuser:appuser /app
USER appuser

# Collect static files
# RUN python manage.py collectstatic --noinput

# Expose the port the app runs on
EXPOSE 8000

# Run the application
CMD ["/app/entrypoint.sh"]