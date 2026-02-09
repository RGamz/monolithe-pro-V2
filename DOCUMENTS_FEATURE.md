# 📄 Système de Gestion des Documents pour Artisans

## Vue d'ensemble

J'ai implémenté un système complet de gestion des documents pour les artisans. Chaque artisan peut maintenant télécharger, gérer et suivre leurs documents de conformité administrative.

## 📋 Documents requis (5 types)

1. **KBIS** - Expire après 3 mois
2. **Assurance décennale** - Expire après 12 mois
3. **Attestation de vigilance URSSAF** - Expire après 6 mois
4. **Liste des salariés étrangers** - Expire après 12 mois (modèle téléchargeable)
5. **Déclaration sur l'honneur** - Expire après 12 mois (modèle téléchargeable)

## ✨ Fonctionnalités

### Pour les artisans :

- ✅ **Upload de documents** : Téléchargement de fichiers (PDF, JPG, JPEG, PNG, max 10MB)
- 📅 **Dates d'expiration automatiques** : Calculées automatiquement selon le type de document
- ⏰ **Alertes d'expiration** : Affichage des documents qui expirent bientôt (< 30 jours)
- 🔄 **Remplacement de documents** : Possibilité de remplacer un document existant
- ❌ **Suppression** : Suppression des documents avec confirmation
- 📥 **Téléchargement** : Téléchargement des documents uploadés
- 📄 **Modèles téléchargeables** : Pour "Liste des salariés étrangers" et "Déclaration sur l'honneur"
- ✔️ **Option "Non concerné"** : Case à cocher si l'artisan n'est pas concerné par un document

### Pour les administrateurs :

- 📊 **Statut de conformité automatique** : Dans la page "Gestion des utilisateurs"
  - 🟢 **Conforme** : Tous les documents sont valides ou marqués "non concerné"
  - 🟠 **Manquant** : Au moins un document requis est manquant
  - 🔴 **Expiré** : Au moins un document est expiré

## 🗄️ Base de données

### Nouvelle table : `artisan_documents`

```sql
CREATE TABLE artisan_documents (
  id TEXT PRIMARY KEY,
  artisan_id TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK(document_type IN (
    'kbis',
    'assurance_decennale',
    'attestation_vigilance_urssaf',
    'liste_salaries_etrangers',
    'declaration_honneur'
  )),
  file_name TEXT,
  upload_date TEXT NOT NULL DEFAULT (datetime('now')),
  expiry_date TEXT,
  is_not_concerned INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'valid' CHECK(status IN ('valid', 'expired', 'missing')),
  FOREIGN KEY (artisan_id) REFERENCES users(id),
  UNIQUE(artisan_id, document_type)
)
```

## 🛠️ Fichiers créés/modifiés

### Nouveaux fichiers :
- ✅ `routes/documents.js` - API routes pour la gestion des documents
- ✅ `public/templates/` - Dossier pour les modèles téléchargeables
- ✅ `uploads/documents/` - Dossier pour les documents uploadés

### Fichiers modifiés :
- ✅ `db/init.js` - Ajout de la table `artisan_documents`
- ✅ `server.js` - Ajout de la route `/api/documents`
- ✅ `package.json` - Ajout de la dépendance `multer`
- ✅ `routes/users.js` - Calcul automatique du statut de conformité
- ✅ `public/js/documents.js` - Interface complète de gestion des documents
- ✅ `public/js/admin.js` - Affichage du statut de conformité (déjà fait précédemment)
- ✅ `public/js/dashboard.js` - Correction du titre et des cercles (déjà fait précédemment)

## 🔌 API Endpoints

### Documents
- `GET /api/documents/:artisanId` - Récupérer tous les documents d'un artisan
- `POST /api/documents` - Upload/mettre à jour un document (avec multipart/form-data)
- `POST /api/documents/not-concerned` - Marquer un document comme "non concerné"
- `DELETE /api/documents/:id` - Supprimer un document
- `GET /api/documents/download/:filename` - Télécharger un document uploadé
- `GET /api/documents/templates/:type` - Télécharger un modèle de document

## 🚀 Démarrage

1. **Installer les dépendances** :
   ```bash
   cd monolithe-pro-V2
   npm install
   ```

2. **Réinitialiser la base de données** (si nécessaire) :
   ```bash
   npm run init-db
   ```

3. **Démarrer le serveur** :
   ```bash
   npm run dev
   ```

4. **Accéder à la gestion des documents** :
   - Se connecter en tant qu'artisan
   - Aller sur la page "Documents" dans le menu

## 📝 TODO : Ajouter les vrais modèles PDF

Pour que les modèles téléchargeables fonctionnent, vous devez ajouter les vrais fichiers PDF dans :
- `public/templates/template-liste-salaries-etrangers.pdf`
- `public/templates/template-declaration-honneur.pdf`

## 🎨 Interface utilisateur

### Page Documents (Artisan)
- Tableau de bord avec statistiques : Conformes, Expirés, Manquants
- Liste de tous les documents requis avec :
  - Statut (badge coloré)
  - Date de téléchargement
  - Date d'expiration avec alerte visuelle
  - Boutons d'action (Upload, Télécharger, Supprimer)
  - Case "Non concerné"

### Page Gestion des utilisateurs (Admin)
- La colonne "Statut" affiche maintenant le statut de conformité des documents pour les artisans
- Mise à jour en temps réel après modification

## 🔒 Sécurité

- Validation des types de fichiers (PDF, JPG, JPEG, PNG uniquement)
- Limite de taille : 10MB par fichier
- Noms de fichiers uniques pour éviter les collisions
- Vérification des permissions (seuls les artisans peuvent uploader leurs documents)
- Suppression sécurisée avec confirmation

## 📊 Logique de calcul du statut

```javascript
// Pour un artisan :
- Si moins de 5 documents → "Manquant"
- Si au moins 1 document expiré (et non marqué "non concerné") → "Expiré"
- Sinon → "Conforme"
```

## 🎯 Prochaines améliorations possibles

- 📧 Notifications par email pour les documents qui expirent bientôt
- 📱 Notifications push
- 📊 Tableau de bord admin avec vue d'ensemble de tous les artisans
- 🔍 Filtrage/recherche des documents
- 📈 Historique des versions de documents
- ✍️ Signature électronique des documents
