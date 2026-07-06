.PHONY: setup dev build test clean help db-up db-down
.DEFAULT_GOAL := help

# Variables
PYTHON := python3
PIP := $(PYTHON) -m pip
MANAGE := MLBackend/manage.py

help: ## Afficher l'aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Configurer l'environnement de développement complet
	@echo "🚀 Configuration de MLAcademy..."
	cp -n .env.example .env.local || true
	# Frontend
	cd AcademyFrontend && npm install
	# Backend
	cd MLBackend && $(PYTHON) -m venv .venv && . .venv/bin/activate && $(PIP) install -r requirements.txt
	# Sandbox
	cd MLSandbox && $(PYTHON) -m venv .venv && . .venv/bin/activate && $(PIP) install -r requirements.txt
	@echo "✅ Setup terminé. N'oubliez pas de configurer vos .env"

db-up: ## Démarrer Judge0 via Docker
	cd Judge0 && docker compose up -d

db-down: ## Arrêter Judge0
	cd Judge0 && docker compose down

dev-backend: ## Lancer le backend Django
	cd MLBackend && $(PYTHON) manage.py runserver 8000

dev-frontend: ## Lancer le frontend Next.js
	cd AcademyFrontend && npm run dev

dev-sandbox: ## Lancer la sandbox FastAPI
	cd MLSandbox && uvicorn main:app --reload --port 8001

dev: ## Lancer tout l'écosystème (nécessite plusieurs terminaux ou mode background)
	@echo "Utilisez 'make dev-backend', 'make dev-frontend', 'make dev-sandbox' dans des terminaux séparés."

makemigrations: ## Appliquer les migrations Django
	cd MLBackend && source .venv/bin/activate && $(PYTHON) manage.py makemigrations && $(PYTHON) manage.py migrate	

seed: ## Charger les données initiales Django
	@echo "Utilisez un script personnalisé ou django-admin loaddata"

clean: ## Nettoyer les fichiers temporaires
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -delete
	rm -rf AcademyFrontend/.next
	rm -rf AcademyFrontend/node_modules
