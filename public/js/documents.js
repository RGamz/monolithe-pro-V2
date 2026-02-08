/**
 * Documents Page Logic (js/documents.js)
 * ----------------------------------------
 * Client-only page showing signed end-of-work documents.
 */

const DOC_ICONS = {
  fileText: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
};

const user = initLayout('documents');
if (user) loadDocuments(user);

async function loadDocuments(user) {
  const container = document.getElementById('page-content');

  try {
    const res = await fetch(`/api/projects?userId=${user.id}&role=${user.role}`);
    const projects = await res.json();

    // Filter to only signed documents
    const signedProjects = projects.filter(p => p.end_of_work_signed);

    container.innerHTML = `
      <div class="documents-card">
        <div class="documents-icon">
          ${DOC_ICONS.fileText}
        </div>
        <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--slate-900);">Documents du projet</h2>
        <p style="color: var(--slate-500); margin-top: 8px;">Tous les documents de fin de travaux apparaîtront ici.</p>
        
        <div style="margin-top: 32px; border-top: 1px solid var(--slate-200); padding-top: 32px; text-align: left;">
          ${signedProjects.length === 0
            ? '<p style="text-align: center; color: var(--slate-400);">Aucun document signé pour le moment.</p>'
            : signedProjects.map(p => `
              <div class="document-row">
                <span class="font-medium">${p.title} - Fin de Travaux.pdf</span>
                <span class="badge badge-complete">Signé</span>
              </div>
            `).join('')
          }
        </div>
      </div>
    `;

  } catch (err) {
    container.innerHTML = '<div class="alert alert-error">Erreur lors du chargement des documents.</div>';
  }
}
