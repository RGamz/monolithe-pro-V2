/**
 * Database Initialization Script (db/init.js)
 * --------------------------------------------
 * Creates all tables and seeds them with demo data.
 * Uses sql.js (pure JS SQLite — no native compilation needed).
 * 
 * Run with: npm run init-db
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || './db/database.sqlite');

async function initialize() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  console.log('🔧 Initializing database...\n');

  // ------------------------------------------------------------------
  // CREATE TABLES
  // ------------------------------------------------------------------
  db.run(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('ADMIN', 'ARTISAN', 'CLIENT')),
      is_onboarded INTEGER NOT NULL DEFAULT 0,
      company_name TEXT,
      specialty TEXT,
      address TEXT,
      lat REAL,
      lng REAL,
      documents_status TEXT CHECK(documents_status IN ('compliant', 'missing', 'expired'))
    )
  `);

  db.run(`
    CREATE TABLE projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      client_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'En attente' 
        CHECK(status IN ('En cours', 'Terminé', 'En attente', 'Annulé')),
      start_date TEXT,
      description TEXT,
      end_of_work_signed INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (client_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE project_artisans (
      project_id TEXT NOT NULL,
      artisan_id TEXT NOT NULL,
      PRIMARY KEY (project_id, artisan_id),
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (artisan_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE invoices (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      artisan_id TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0,
      date TEXT,
      status TEXT NOT NULL DEFAULT 'En attente'
        CHECK(status IN ('En attente', 'Payé', 'Rejeté')),
      file_name TEXT DEFAULT 'facture.pdf',
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (artisan_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE alerts (
      id TEXT PRIMARY KEY,
      message TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'info' CHECK(type IN ('info', 'warning', 'error')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  console.log('✅ Tables created.\n');

  // ------------------------------------------------------------------
  // SEED DATA
  // ------------------------------------------------------------------

  // --- Users ---
  const users = [
    ['u1', 'Sarah Jenkins', 'admin@company.com', 'password123', 'ADMIN', 1, null, null, null, null, null, null],
    ['u2', 'Jean le Plombier', 'john@artisan.com', 'password123', 'ARTISAN', 0, 'JP Services', 'Plomberie', '12 Rue de Metz, 31000 Toulouse', 43.6000, 1.4430, 'missing'],
    ['u3', 'Alice Corporation', 'contact@alicecorp.com', 'password123', 'CLIENT', 1, 'Alice Corp HQ', null, null, null, null, null],
    ['u4', 'Mike Électricité', 'mike@sparky.com', 'password123', 'ARTISAN', 1, 'Sparky Bros', 'Électricité', '45 Avenue de Grande Bretagne, 31300 Toulouse', 43.6060, 1.4100, 'compliant'],
    ['u5', 'Pierre Menuiserie', 'pierre@woodworks.com', 'password123', 'ARTISAN', 1, 'Au Cœur du Bois', 'Menuiserie', '8 Chemin de la Chasse, 31770 Colomiers', 43.6112, 1.3413, 'compliant'],
    ['u6', 'Marie Peinture', 'marie@couleurs.com', 'password123', 'ARTISAN', 1, 'Déco 31', 'Peinture', '22 Avenue des Mimosas, 31130 Balma', 43.6110, 1.4994, 'expired'],
  ];

  for (const u of users) {
    db.run(
      `INSERT INTO users (id, name, email, password, role, is_onboarded, company_name, specialty, address, lat, lng, documents_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      u
    );
  }
  console.log(`✅ ${users.length} users seeded.`);

  // --- Projects ---
  const projects = [
    ['p1', 'Rénovation Salles de Bain HQ', 'u3', 'En cours', '2023-10-15', 'Rénovation complète des salles de bain du 3ème étage.', 0],
    ['p2', 'Mise à jour Éclairage Hall', 'u3', 'Terminé', '2023-09-01', 'Installation de luminaires LED dans le hall principal.', 1],
    ['p3', 'Aménagement Open Space', 'u3', 'En cours', '2023-11-02', 'Création de cloisons bois et peinture.', 0],
  ];

  for (const p of projects) {
    db.run(
      `INSERT INTO projects (id, title, client_id, status, start_date, description, end_of_work_signed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      p
    );
  }
  console.log(`✅ ${projects.length} projects seeded.`);

  // --- Project-Artisan Links ---
  const links = [
    ['p1', 'u2'],
    ['p2', 'u4'],
    ['p3', 'u5'],
    ['p3', 'u6'],
  ];

  for (const l of links) {
    db.run(`INSERT INTO project_artisans (project_id, artisan_id) VALUES (?, ?)`, l);
  }
  console.log(`✅ ${links.length} project-artisan links seeded.`);

  // --- Invoices ---
  const invoices = [
    ['inv1', 'p2', 'u4', 1500.00, '2023-09-15', 'Payé', 'facture-1001.pdf'],
    ['inv2', 'p1', 'u2', 3200.00, '2023-10-20', 'En attente', 'facture-1002.pdf'],
    ['inv3', 'p3', 'u5', 2800.00, '2023-11-10', 'En attente', 'facture-1003.pdf'],
  ];

  for (const i of invoices) {
    db.run(
      `INSERT INTO invoices (id, project_id, artisan_id, amount, date, status, file_name)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      i
    );
  }
  console.log(`✅ ${invoices.length} invoices seeded.`);

  // --- Alerts ---
  const alerts = [
    ['a1', 'Jean le Plombier a des documents de conformité manquants.', 'warning', '2023-10-20'],
    ['a2', "Marie Peinture : attestation d'assurance expirée.", 'warning', '2023-11-01'],
    ['a3', 'Nouveau projet "Aménagement Open Space" créé.', 'info', '2023-11-02'],
  ];

  for (const a of alerts) {
    db.run(`INSERT INTO alerts (id, message, type, created_at) VALUES (?, ?, ?, ?)`, a);
  }
  console.log(`✅ ${alerts.length} alerts seeded.`);

  // ------------------------------------------------------------------
  // VERIFY
  // ------------------------------------------------------------------
  console.log('\n📊 Database summary:');
  const tables = ['users', 'projects', 'project_artisans', 'invoices', 'alerts'];
  for (const table of tables) {
    const result = db.exec(`SELECT COUNT(*) as c FROM ${table}`);
    const count = result[0].values[0][0];
    console.log(`   ${table}: ${count}`);
  }

  // ------------------------------------------------------------------
  // SAVE TO FILE
  // ------------------------------------------------------------------
  const data = db.export();
  const buffer = Buffer.from(data);
  
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(dbPath, buffer);
  console.log(`\n💾 Database saved to: ${dbPath}`);
  console.log('🎉 Database initialized successfully!');
  
  db.close();
}

initialize().catch(err => {
  console.error('❌ Initialization failed:', err);
  process.exit(1);
});
