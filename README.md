# ArtisanPortal

Plateforme de gestion centralisée pour les artisans, clients et administrateurs de projets de construction et rénovation.

## Fonctionnalités

### Trois rôles avec vues dédiées

**Administrateur**
- Tableau de bord avec statistiques globales et alertes système
- Annuaire des artisans (vue liste + carte Leaflet interactive)
- Suivi de tous les projets avec vue accordéon
- Gestion multi-artisans par projet

**Artisan**
- Assistant d'intégration (onboarding) au premier accès
- Tableau de bord avec projets assignés
- Gestion des factures (historique + soumission)
- Section documents de conformité

**Client**
- Tableau de bord avec suivi de ses projets
- Accès aux documents de fin de travaux signés

### Autres fonctionnalités
- Authentification complète (connexion, mot de passe oublié, réinitialisation)
- Graphique en anneau des statuts de projets (Chart.js)
- Carte interactive des artisans (Leaflet + OpenStreetMap)
- Interface responsive (mobile + desktop)
- Navigation dynamique selon le rôle

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | HTML, CSS (pur), JavaScript (vanilla) |
| Backend | Node.js, Express.js |
| Base de données | SQLite (via sql.js) |
| Graphiques | Chart.js |
| Carte | Leaflet + OpenStreetMap |

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Créer la base de données avec les données de démo
npm run init-db

# 3. Lancer le serveur
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

## Comptes de démo

Mot de passe commun : `password123`

| Rôle | E-mail |
|---|---|
| Admin | admin@company.com |
| Artisan | john@artisan.com |
| Client | contact@alicecorp.com |

> L'artisan `john@artisan.com` n'est pas encore intégré — vous verrez l'assistant de profil au premier accès.

## Structure du projet

```
artisan-portal/
├── server.js                  # Point d'entrée Express
├── package.json
├── .env                       # Variables d'environnement (PORT, DB_PATH)
├── .gitignore
│
├── db/
│   ├── init.js                # Création des tables + données de démo
│   └── helper.js              # Wrapper sql.js (getAll, getOne, run, save)
│
├── routes/
│   ├── auth.js                # POST /api/auth/login, /forgot, /reset-password
│   ├── projects.js            # GET/POST /api/projects
│   ├── invoices.js            # GET/POST /api/invoices
│   ├── users.js               # GET /api/users/artisans, POST /api/users/profile
│   └── alerts.js              # GET /api/alerts
│
└── public/
    ├── index.html             # Page de connexion (4 étapes)
    ├── dashboard.html         # Tableau de bord
    ├── invoices.html          # Factures (Artisan)
    ├── directory.html         # Annuaire + carte (Admin)
    ├── projects.html          # Suivi des projets (Admin)
    ├── documents.html         # Documents signés (Client)
    ├── onboarding.html        # Assistant de profil
    ├── css/
    │   └── style.css          # Tous les styles (650+ lignes, pas de Tailwind)
    └── js/
        ├── auth.js            # Logique de connexion / réinitialisation
        ├── layout.js          # Sidebar + header injectés dynamiquement
        ├── dashboard.js       # Stats, liste projets, graphique
        ├── invoices.js        # Tableau + formulaire de soumission
        ├── directory.js       # Cartes artisans + carte Leaflet
        ├── projects.js        # Liste accordéon triée par statut
        ├── documents.js       # Documents de fin de travaux
        └── onboarding.js      # Formulaire de profil
```

## Base de données

Cinq tables SQLite :

- **users** — Tous les utilisateurs (Admin, Artisan, Client) avec coordonnées GPS
- **projects** — Projets de construction/rénovation
- **project_artisans** — Relation many-to-many (plusieurs artisans par projet)
- **invoices** — Factures soumises par les artisans
- **alerts** — Notifications système pour les administrateurs

Pour réinitialiser la base de données :

```bash
npm run init-db
```

## API

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Connexion (email + mot de passe) |
| POST | `/api/auth/forgot` | Vérifier si un e-mail existe |
| POST | `/api/auth/reset-password` | Réinitialiser le mot de passe |
| GET | `/api/projects?userId=...&role=...` | Projets filtrés par rôle |
| POST | `/api/projects` | Créer un projet |
| GET | `/api/invoices?artisanId=...` | Factures d'un artisan |
| POST | `/api/invoices` | Soumettre une facture |
| GET | `/api/users/artisans` | Liste des artisans |
| POST | `/api/users/profile` | Mise à jour du profil (onboarding) |
| GET | `/api/alerts` | Alertes système |

## Déploiement sur Render

1. Créer un compte sur [render.com](https://render.com)
2. Nouveau → Web Service → connecter le dépôt GitHub
3. Paramètres :
   - **Build Command** : `npm install && npm run init-db`
   - **Start Command** : `npm start`
   - **Environment** : ajouter `PORT=3000`
4. Déployer

## Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `PORT` | Port du serveur | `3000` |
| `DB_PATH` | Chemin vers le fichier SQLite | `./db/database.sqlite` |
