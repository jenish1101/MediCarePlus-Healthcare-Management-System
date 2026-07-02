FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app
ENV API_PUBLIC_URL=http://localhost:8001

RUN apt-get update && apt-get install -y --no-install-recommends gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY scripts ./scripts
COPY tests ./tests
COPY pytest.ini .

RUN chmod +x /app/scripts/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
