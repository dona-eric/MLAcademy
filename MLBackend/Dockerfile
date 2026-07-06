FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /academy-backend

# Empêcher Python de générer des fichiers .pyc et forcer la sortie console en direct
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copier les requirements et installer
COPY requirements.txt .
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt
# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 8000

# Lancer le serveur avec Daphne (car nous avons Django Channels)
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "MLBackend.asgi:application"]
