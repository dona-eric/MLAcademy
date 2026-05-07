<p align="center">
  <img src="AcademyFrontend/public/mlacademy_logo.png" alt="MLAcademy" width="120" />
</p>

<h1 align="center">MLAcademy</h1>
<p align="center">La référence francophone en Data Science & Machine Learning</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Django-5.2-092E20?logo=django" /></a>
  <a href="#"><img src="https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript" /></a>
</p>

---

## 🚀 Présentation

MLAcademy est une plateforme e-learning dédiée à l'apprentissage du Machine Learning et de la Data Science en langue française. Elle propose des parcours structurés, des notebooks Python interactifs, des certifications et une communauté active.

## 🏗️ Architecture

```
MLAcademy/
├── AcademyFrontend/   # Next.js 14 — Interface utilisateur & Design Premium
├── MLBackend/         # Django Rest Framework — API, Auth & Business Logic
├── MLSandbox/         # FastAPI — Exécution de code Python sécurisée
├── Judge0/            # Infrastructure d'exécution de code (Docker)
├── docs/              # Spécifications et Roadmap
└── docker/            # Configuration d'infrastructure
```

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Monaco Editor |
| **Backend** | Django 5, DRF, PostgreSQL / SQLite |
| **Exécution code** | FastAPI, Python 3.11, Judge0 |
| **Auth** | Django AllAuth + JWT |
| **Vidéo** | Mux.io |
| **Paiements** | Stripe |

## 🏃 Démarrage rapide

### 1. Cloner le repo
```bash
git clone https://github.com/votre-compte/MLAcademy.git
cd MLAcademy
```

### 2. Installation automatique
```bash
make setup
```

### 3. Lancement des services
Il est recommandé de lancer les services dans des terminaux séparés :
- **Backend :** `make dev-backend` (Port 8000)
- **Frontend :** `make dev-frontend` (Port 3000)
- **Sandbox :** `make dev-sandbox` (Port 8001)

## 🎯 Roadmap

- [x] Phase 1 — MVP (Authentification, Catalogue, Player)
- [x] Phase 2 — Interactif (Notebooks, Quizz, Projets)
- [ ] Phase 3 — Certification & Communauté

## 📄 Licence

Propriétaire — © 2026 MLAcademy. Tous droits réservés.
