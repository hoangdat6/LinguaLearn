# Stage 1: build dependencies
FROM python:3.10-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt

# Stage 2: final lightweight image
FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copy wheels from builder
COPY --from=builder /wheels /wheels
COPY --from=builder /app/requirements.txt .

RUN pip install --no-cache-dir /wheels/*

# Copy project
COPY . .

# Add non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && exec gunicorn config.wsgi:application --config gunicorn_conf.py"]
