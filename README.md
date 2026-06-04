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
  <a href="#"><img src="https://img.shields.io/badge/Turborepo-2.9-EF4444?logo=turborepo" /></a>
</p>

---

## 🚀 Présentation

MLAcademy est une plateforme e-learning dédiée à l'apprentissage du Machine Learning et de la Data Science en langue française. Elle propose des parcours structurés, des notebooks Python interactifs, des certifications et une communauté active.

## 🏗️ Architecture du Monorepo

Le projet est organisé sous forme de monorepo fluide géré via **Turborepo** :

```text
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
| **Orchestration** | Turborepo, NPM Workspaces |
| **Vidéo** | Mux.io |
| **Paiements** | Stripe |

## 📊 Modèle de Données (UML)

La base de données est structurée autour de quatre grands piliers : **Authentification**, **Catalogue de Cours**, **Progression**, et **Communauté**.

```mermaid
erDiagram
    %% --- AUTH & USERS ---
    CustomUser {
        int id PK
        string email UK
        string username
        string password
        bool email_verified
        uuid verification_token
        bool otp_enabled
        bool is_instructor
        bool is_recruiter
        bool is_mentor
        string bio
        string avatar
        string linkedin_url
        string github_url
        string portfolio_url
        string level
        string personal_goals
        bool is_public_profile
        int xp_points
    }

    StudentProfile {
        int id PK
        int user_id FK
        string phone
        string gender
        string address_street
        string address_zip
        string address_city
        string address_country
        string french_level
        string english_level
        string current_situation
        json professional_experiences
        json work_permits
        json specific_statuses
        json diplomas
        int hours_per_week
        date desired_start_date
        bool onboarding_completed
        bool honor_declaration_accepted
        string selected_training_slug
        string funding_method
    }

    InstructorApplication {
        int id PK
        int user_id FK
        string cv_url
        string cv_file
        string linkedin_url
        string portfolio_url
        string website_url
        string motivation
        string expertise
        string expertise_detail
        string teaching_experience
        string status
        string rejection_reason
        int reviewed_by_id FK
        datetime submitted_at
        datetime reviewed_at
    }

    Notification {
        int id PK
        int user_id FK
        string type
        string title
        string content
        string link
        bool is_read
        datetime created_at
    }

    Message {
        int id PK
        int sender_id FK
        int recipient_id FK
        string subject
        string body
        bool is_read
        datetime created_at
    }

    %% --- COURSES ---
    CourseCategory {
        int id PK
        string name UK
        string slug
        string icon
        string description
    }

    LearningPath {
        int id PK
        string title
        string slug
        string short_description
        string description
        int category_id FK
        int creator_id FK
        string level
        string thumbnail
        int estimated_weeks
        bool is_published
        bool is_certifying
        bool is_free
        decimal price
        int enrolled_count
        decimal avg_rating
        int courses_count
    }

    Course {
        int id PK
        string title
        string slug
        string short_description
        string description
        int category_id FK
        int instructor_id FK
        string level
        int duration_hours
        string thumbnail
        string preview_url
        string prerequisites_text
        string syllabus
        bool is_published
        bool is_free
        bool is_standalone
        decimal price
        decimal avg_rating
        int enrolled_count
    }

    LearningPathCourse {
        int id PK
        int learning_path_id FK
        int course_id FK
        int order
        bool is_required
    }

    CoursePrerequisite {
        int id PK
        int course_id FK
        int required_course_id FK
    }

    Module {
        int id PK
        string title
        string slug
        string description
        int category_id FK
        int author_id FK
        decimal estimated_hours
        bool is_published
    }

    CourseModule {
        int id PK
        int course_id FK
        int module_id FK
        int order
    }

    Lesson {
        int id PK
        int module_id FK
        string title
        string lesson_type
        string content
        string video_url
        int duration_minutes
        int order
        bool is_free_preview
        string starter_code
        string solution_code
    }

    LessonAttachment {
        int id PK
        int lesson_id FK
        string title
        string file
    }

    Project {
        int id PK
        int module_id FK
        string title
        string description
        string instructions
        string starter_code
        string solution_code
        bool is_final
        bool is_capstone
        int passing_score
    }

    CertificationExam {
        int id PK
        int learning_path_id FK
        string title
        string instructions
        int duration_minutes
        int passing_score
        int max_attempts_per_week
        int capstone_project_id FK
        bool is_published
    }

    CourseReview {
        int id PK
        int course_id FK
        int user_id FK
        int rating
        string comment
    }

    %% --- LEARNING & PROGRESS ---
    Enrollment {
        int id PK
        int user_id FK
        int course_id FK
        datetime enrolled_at
        int progress_percentage
        bool is_completed
        datetime completed_at
    }

    PathEnrollment {
        int id PK
        int user_id FK
        int learning_path_id FK
        datetime enrolled_at
        int progress_percentage
        bool is_completed
        datetime completed_at
        bool is_certified
    }

    UserLessonProgress {
        int id PK
        int user_id FK
        int lesson_id FK
        bool is_completed
        int last_watched_position
        bool is_featured_in_portfolio
    }

    UserNote {
        int id PK
        int user_id FK
        int lesson_id FK
        string content
        int video_timecode
        bool is_featured_in_portfolio
    }

    QuizQuestion {
        int id PK
        int lesson_id FK
        string text
        string explanation
        int order
    }

    QuizChoice {
        int id PK
        int question_id FK
        string text
        bool is_correct
    }

    UserQuizAttempt {
        int id PK
        int user_id FK
        int lesson_id FK
        int score
        bool passed
        datetime created_at
    }

    UserCodeSubmission {
        int id PK
        int user_id FK
        int lesson_id FK
        string code
        json last_result
        bool is_featured_in_portfolio
    }

    ProjectSubmission {
        int id PK
        int user_id FK
        int project_id FK
        string repo_url
        string code_content
        string status
        datetime submitted_at
        bool is_featured_in_portfolio
    }

    ProjectPeerReview {
        int id PK
        int reviewer_id FK
        int submission_id FK
        int score
        string feedback
        bool is_approved
    }

    CertificationExamAttempt {
        int id PK
        int user_id FK
        int exam_id FK
        int score
        bool passed
        datetime started_at
        datetime completed_at
    }

    Certificate {
        int id PK
        int user_id FK
        int course_id FK
        int learning_path_id FK
        string cert_type
        datetime issued_at
        string certificate_id UK
        int final_score
        string pdf_file
    }

    SkillBadge {
        int id PK
        string name
        string icon
        string badge_type
        string description
    }

    UserBadge {
        int id PK
        int user_id FK
        int badge_id FK
        datetime granted_at
        int granted_by_id FK
    }

    %% --- COMMUNITY & JOBS ---
    CommunityCategory {
        int id PK
        string name
        int order
    }

    Company {
        int id PK
        string name
        string description
        string website
        string logo
        string location
        bool is_verified
    }

    JobOffer {
        int id PK
        int company_id FK
        string title
        string description
        string requirements
        string location
        string contract_type
        string salary_range
        bool is_active
        datetime posted_at
        date deadline
    }

    JobApplication {
        int id PK
        int user_id FK
        int job_id FK
        string cover_letter
        string cv_url
        string status
        datetime applied_at
    }

    Channel {
        int id PK
        int category_id FK
        string name
        string description
        string icon
        int order
        bool is_private
    }

    ChannelMessage {
        int id PK
        int channel_id FK
        int user_id FK
        string content
        int parent_id FK
        bool is_pinned
        datetime created_at
    }

    MentorshipRelation {
        int id PK
        int mentor_id FK
        int student_id FK
        string status
        datetime created_at
    }

    SponsoredChallenge {
        int id PK
        int company_id FK
        string title
        string description
        string reward
        bool is_active
        date deadline
    }

    %% --- RELATIONSHIPS ---
    CustomUser ||--o| StudentProfile : "has profile"
    CustomUser ||--o| InstructorApplication : "submits"
    CustomUser ||--o{ Notification : "receives"
    CustomUser ||--o{ Message : "sends/receives"
    
    LearningPath }|--|| CourseCategory : "categorized by"
    LearningPath ||--o{ LearningPathCourse : "contains"
    Course ||--o{ LearningPathCourse : "associated with"
    Course }|--|| CourseCategory : "categorized by"
    CoursePrerequisite }|--|| Course : "prerequisite for / requires"

    Course ||--o{ CourseModule : "contains"
    Module ||--o{ CourseModule : "associated with"
    Module }|--|| CourseCategory : "categorized by"
    Module ||--o{ Lesson : "contains"
    Module ||--o| Project : "concludes with"
    
    Lesson ||--o{ LessonAttachment : "has resources"
    Lesson ||--o{ QuizQuestion : "assessed by"
    QuizQuestion ||--o{ QuizChoice : "has choices"

    %% Progès & Évaluation
    CustomUser ||--o{ Enrollment : "enrolled in course"
    Course ||--o{ Enrollment : "has student"
    CustomUser ||--o{ PathEnrollment : "enrolled in path"
    LearningPath ||--o{ PathEnrollment : "has student"
    
    CustomUser ||--o{ UserLessonProgress : "tracks"
    Lesson ||--o{ UserLessonProgress : "tracked in"
    CustomUser ||--o{ UserNote : "writes"
    Lesson ||--o{ UserNote : "annotated in"
    
    CustomUser ||--o{ UserQuizAttempt : "attempts"
    Lesson ||--o{ UserQuizAttempt : "attempts quiz for"
    CustomUser ||--o{ UserCodeSubmission : "submits"
    Lesson ||--o{ UserCodeSubmission : "runs code for"
    
    CustomUser ||--o{ ProjectSubmission : "submits project"
    Project ||--o{ ProjectSubmission : "requires project"
    CustomUser ||--o{ ProjectPeerReview : "reviews"
    ProjectSubmission ||--o{ ProjectPeerReview : "evaluated by"

    LearningPath ||--o| CertificationExam : "concludes with"
    CustomUser ||--o{ CertificationExamAttempt : "attempts exam"
    CertificationExam ||--o{ CertificationExamAttempt : "evaluated by"
    
    CustomUser ||--o{ Certificate : "holds"
    Course ||--o{ Certificate : "attests completion"
    LearningPath ||--o{ Certificate : "certifies completion"

    CustomUser ||--o{ UserBadge : "earns"
    SkillBadge ||--o{ UserBadge : "defines"

    %% Communauté & Jobs
    Channel }|--|| CommunityCategory : "grouped under"
    ChannelMessage }|--|| Channel : "posted in"
    CustomUser ||--o{ ChannelMessage : "writes"
    ChannelMessage ||--o{ ChannelMessage : "replies to"

    Company ||--o{ JobOffer : "posts"
    CustomUser ||--o{ JobApplication : "applies"
    JobOffer ||--o{ JobApplication : "receives"
    
    CustomUser ||--o{ MentorshipRelation : "participates in"
    Company ||--o{ SponsoredChallenge : "sponsors"
```

### 💡 Concepts Clés de l'Architecture
- **Structure Réutilisable (CMS)** : Les `Lesson` sont rattachées à un `Module`, lui-même rattaché à un `Course` via une table de jonction `CourseModule`. Cela permet de réutiliser un module entier (ex: "Bases de Python") dans plusieurs cours.
- **Évaluation Hybride** : La validation des connaissances passe par des Quiz Théoriques, de l'exécution de code Python via Sandbox (`UserCodeSubmission`), et des revues de projets entre pairs (`ProjectPeerReview`).
- **Certification** : Les parcours (`LearningPath`) se concluent par un projet Capstone ou un examen (`CertificationExamAttempt`) pour délivrer une certification professionnelle officielle.

## 🏃 Démarrage rapide

### 1. Cloner le repo
```bash
git clone https://github.com/votre-compte/MLAcademy.git
cd MLAcademy
```

### 2. Installation (Monorepo)
```bash
make setup
npm install
```

### 3. Lancement fluide
Lancez tout l'écosystème avec une seule commande grâce à Turborepo (démarre Next.js, Django et FastAPI en parallèle) :
```bash
npm run dev
```

## 🎯 Roadmap

- [x] Phase 1 — MVP (Authentification, Catalogue, Player)
- [x] Phase 2 — Interactif (Notebooks, Quizz, Projets)
- [ ] Phase 3 — Certification & Communauté
- [x] Phase 4 — Configuration Monorepo Turborepo

## 📄 Licence

Propriétaire — © 2026 MLAcademy. Tous droits réservés.
