# ÉTAPE 1 : Builder
FROM python:3.11-slim AS builder
WORKDIR /academy-backend
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# On installe gcc et libpq-dev UNIQUEMENT pour compiler les packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# On compile toutes les dépendances sous forme de "wheels" pré-paquetées
RUN pip wheel --default-timeout=1000 --no-cache-dir --wheel-dir /academy-backend/wheels -r requirements.txt


# ÉTAPE 2 : L'image finale de Production (Ultra-légère)

FROM python:3.11-slim

WORKDIR /academy-backend

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# On installe uniquement la librairie d'exécution pour PostgreSQL (libpq-dev n'est plus requis, libpq5 suffit !)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# On récupère les packages pré-compilés du builder et on les installe instantanément
COPY --from=builder /academy-backend/wheels /wheels
RUN pip install --no-cache-dir /wheels/*

# Copie du reste du code de l'application
COPY . .

# Sécurité : Création d'un utilisateur non-root pour exécuter Daphne
RUN addgroup --system app && adduser --system --group app && chown -R app:app /academy-backend
USER app

EXPOSE 10000

# Votre commande d'origine inchangée
CMD python3 create_admin.py; daphne -b 0.0.0.0 -p ${PORT:-8000} MLBackend.asgi:application
