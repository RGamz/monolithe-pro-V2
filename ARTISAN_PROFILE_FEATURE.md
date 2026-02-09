# 👤 Profil Artisan pour Administrateurs

## Vue d'ensemble

J'ai implémenté une page de profil détaillée pour chaque artisan, accessible uniquement aux administrateurs depuis l'annuaire des artisans.

## ✨ Fonctionnalités

### 🔍 Navigation
- **Depuis l'annuaire** : Cliquez sur n'importe quelle carte d'artisan pour accéder à son profil
- **Depuis la carte** : Les noms d'artisans sur la carte (map popup) sont également cliquables
- **Bouton retour** : Retour facile vers l'annuaire

### 📊 En-tête du Profil
Affiche toutes les informations clés de l'artisan :
- **Avatar** : Initiale du nom dans un cercle coloré
- **Nom et entreprise**
- **Badge de statut des documents** : Conforme / Expiré / Manquant
- **Spécialité**
- **Email** (cliquable pour envoyer un mail)
- **Adresse**
- **Statistiques rapides** :
  - Nombre de projets
  - Factures payées
  - Factures en attente

### 📑 Onglets avec Contenu Détaillé

#### 1️⃣ **Vue d'ensemble**
- Résumé des projets (terminés, en cours, total)
- Résumé des revenus (payés, en attente)
- Résumé des documents (conformes, expirés, manquants)
- Liste des 5 projets les plus récents

#### 2️⃣ **Projets** (${nombre})
Table complète avec :
- Nom du projet et description
- Client
- Date de début
- Statut (badge coloré)
- Fin de travaux signée (✓ ou ✗)

#### 3️⃣ **Factures** (${nombre})
- Résumé financier :
  - Total payé en €
  - Total en attente en €
- Table des factures avec :
  - Nom du fichier
  - Projet associé
  - Date
  - Montant
  - Statut (badge coloré)

#### 4️⃣ **Documents** (${complétés}/${total})
- Statistiques :
  - Documents conformes
  - Documents expirés
  - Documents manquants
- Liste détaillée de chaque document avec :
  - Nom du document
  - Badge de statut
  - Date de téléchargement
  - Date d'expiration avec alerte visuelle
  - Nom du fichier
  - Bouton de téléchargement (si disponible)
  - Mention "Non concerné" si applicable

## 🎨 Design

- **Interface à onglets** pour une navigation fluide
- **Badges colorés** pour les statuts
- **Cartes avec couleurs** pour les résumés (vert pour conforme, rouge pour expiré, etc.)
- **Tables responsives** pour les listes
- **Alertes visuelles** pour les documents qui expirent bientôt (< 30 jours)
- **Design cohérent** avec le reste de l'application

## 📂 Fichiers Créés/Modifiés

### Nouveaux fichiers :
- ✅ `public/artisan-profile.html` - Page HTML du profil
- ✅ `public/js/artisan-profile.js` - Logique et rendu de la page

### Fichiers modifiés :
- ✅ `public/js/directory.js` - Cartes d'artisans cliquables + fonction de navigation
- ✅ `public/js/layout.js` - Ajout du titre "Profil Artisan" dans PAGE_TITLES
- ✅ `public/css/style.css` - Styles pour les onglets

## 🔗 Navigation

```
Annuaire des artisans (directory.html)
  ↓ [Clic sur carte artisan]
Profil Artisan (artisan-profile.html?id=u2)
  ↓ [Bouton "Retour à l'annuaire"]
Annuaire des artisans (directory.html)
```

## 💻 Utilisation

1. **Connexion en tant qu'admin** : admin@company.com / password123
2. **Aller à "Annuaire des artisans"**
3. **Cliquer sur n'importe quelle carte d'artisan**
4. **Explorer les onglets** :
   - Vue d'ensemble
   - Projets
   - Factures
   - Documents

## 🔐 Sécurité

- ✅ Accès réservé aux administrateurs uniquement
- ✅ Vérification du rôle au chargement de la page
- ✅ ID artisan passé via URL query parameter
- ✅ Validation de l'existence de l'artisan

## 📊 Données Affichées

### API Endpoints utilisés :
- `GET /api/users` - Récupère les informations de l'artisan
- `GET /api/projects?userId=${artisanId}&role=ARTISAN` - Projets de l'artisan
- `GET /api/invoices?artisanId=${artisanId}` - Factures de l'artisan
- `GET /api/documents/${artisanId}` - Documents de l'artisan

### Calculs automatiques :
- Revenus totaux (payés et en attente)
- Nombre de projets par statut
- Statut de conformité des documents
- Alertes pour documents expirant bientôt

## 🎯 Cas d'usage

### Pour l'administrateur :
1. **Vérifier la conformité** d'un artisan avant de l'assigner à un projet
2. **Consulter l'historique** des projets et factures
3. **Télécharger les documents** pour vérification
4. **Identifier les documents manquants** ou expirés
5. **Suivre les revenus** d'un artisan

## 🚀 Améliorations futures possibles

- 📧 Bouton pour envoyer un email de rappel pour documents manquants
- 📊 Graphiques pour visualiser les revenus par mois
- 📝 Ajouter des notes sur l'artisan
- ⭐ Système de notation/évaluation
- 📁 Export PDF du profil complet
- 🔔 Notifications pour documents expirant bientôt
- 📞 Intégration avec un système de messagerie
