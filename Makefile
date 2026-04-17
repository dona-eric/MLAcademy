.PHONY: setup dev build test clean db-up db-down db-reset

setup: ## Configurer l'environnement de développement complet
	@echo "🚀 Configuration de MLAcademy..."
	cp -n .env.example .env.local || true
	pnpm install
	docker compose -f docker/docker-compose.yml up -d
	@echo "⏳ Attente de la base de données..."
	sleep 3
	cd backend-api && pnpm db:migrate && pnpm db:seed
	@echo "✅ Prêt ! Lancez 'make dev'"

dev: ## Lancer l'environnement de développement
	docker compose -f docker/docker-compose.yml up -d
	pnpm dev

build: ## Compiler le projet
	pnpm build

test: ## Lancer tous les tests
	pnpm test

db-up: ## Démarrer les services Docker (DB, Redis, Meilisearch)
	docker compose -f docker/docker-compose.yml up -d

db-down: ## Arrêter les services Docker
	docker compose -f docker/docker-compose.yml down

db-reset: ## Réinitialiser complètement la base de données
	docker compose -f docker/docker-compose.yml down -v
	docker compose -f docker/docker-compose.yml up -d
	sleep 3
	cd backend-api && pnpm db:migrate && pnpm db:seed

clean: ## Nettoyer les dépendances et builds
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
	find . -name '.next' -type d -prune -exec rm -rf '{}' +
	find . -name 'dist' -type d -prune -exec rm -rf '{}' +

help: ## Afficher l'aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
