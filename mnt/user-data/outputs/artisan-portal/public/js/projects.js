/**
 * Projects Page Logic (js/projects.js)
 * --------------------------------------
 * Admin view: collapsible accordion list of all projects
 * Sorted: Pending → In Progress → Completed → Cancelled
 * Shows multiple artisans per project
 */

const PROJ_ICONS = {
  folder: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
  chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronUp: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',
};

const user = initLayout('projects');
if (user) loadProjects(user);

async function loadProjects(user) {
  const container = document.getElementById('page-content');

  try {
    const res = await fetch(`/api/projects?userId=${user.id}&role=${user.role}`);
    const projects = await res.json();

    // Sort: Pending(1) → In Progress(2) → Completed(3) → Cancelled(4)
    const statusOrder = { 'En attente': 1, 'En cours': 2, 'Terminé': 3, 'Annulé': 4 };
    projects.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));

    container.innerHTML = buildProjectsHTML(projects);

  } catch (err) {
    container.innerHTML = '<div class="alert alert-error">Erreur lors du chargement des projets.</div>';
  }
}

function buildProjectsHTML(projects) {
  if (projects.length === 0) {
    return '<div class="empty-state empty-state-bordered">Aucun projet trouvé.</div>';
  }

  const items = projects.map((p, i) => accordionItem(p, i)).join('');

  return `
    <div class="space-y-6">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--slate-800); display: flex; align-items: center; gap: 8px;">
          <span style="color: var(--blue-600);">${PROJ_ICONS.folder}</span>
          Suivi des projets
        </h2>
      </div>
      <div>
        ${items}
      </div>
    </div>
  `;
}

function accordionItem(project, index) {
  // Status dot class
  let dotClass = 'pending';
  if (project.status === 'En cours') dotClass = 'progress';
  else if (project.status === 'Terminé') dotClass = 'complete';
  else if (project.status === 'Annulé') dotClass = 'cancelled';

  // Badge class
  let badgeClass = 'badge-pending';
  if (project.status === 'En cours') badgeClass = 'badge-progress';
  else if (project.status === 'Terminé') badgeClass = 'badge-complete';
  else if (project.status === 'Annulé') badgeClass = 'badge-cancelled';

  // Artisan tags
  const artisanTags = (project.artisan_names || []).map(name =>
    `<span class="artisan-tag">${name}</span>`
  ).join('');
  const artisanDisplay = artisanTags || '<span style="color: var(--slate-400); font-style: italic;">Non assigné</span>';

  return `
    <div class="accordion-item" id="accordion-${index}">
      <div class="accordion-header" onclick="toggleAccordion(${index})">
        <div class="accordion-left">
          <div class="status-dot ${dotClass}"></div>
          <div style="min-width: 0;">
            <h4 class="accordion-title">${project.title}</h4>
            <div class="accordion-subtitle">
              <span class="truncate">${project.client_company || project.client_name}</span>
              <span style="color: var(--slate-300);">•</span>
              <span>${artisanDisplay}</span>
            </div>
          </div>
        </div>
        <div class="accordion-right">
          <span class="badge ${badgeClass}">${project.status}</span>
          <span class="accordion-chevron" id="chevron-${index}">${PROJ_ICONS.chevronDown}</span>
        </div>
      </div>
      <div class="accordion-body hidden" id="body-${index}">
        <div class="accordion-body-grid">
          <div>
            <p class="detail-label">Description</p>
            <p class="text-sm" style="color: var(--slate-700); line-height: 1.6;">${project.description || 'Aucune description.'}</p>
          </div>
          <div>
            <p class="detail-label">Détails</p>
            <div style="display: flex; align-items: center; gap: 8px; color: var(--slate-700); font-size: 0.875rem;">
              ${PROJ_ICONS.calendar}
              <span>Début des travaux : <strong>${project.start_date || 'N/A'}</strong></span>
            </div>
            <div class="mt-4">
              <p class="text-xs" style="color: var(--slate-500); margin-bottom: 4px;">Artisans assignés :</p>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${(project.artisan_names || []).map(name =>
                  `<span class="artisan-tag" style="border: 1px solid var(--slate-200); padding: 4px 8px;">${name}</span>`
                ).join('') || '<span style="color: var(--slate-400); font-style: italic; font-size: 0.75rem;">Non assigné</span>'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function toggleAccordion(index) {
  const body = document.getElementById(`body-${index}`);
  const chevron = document.getElementById(`chevron-${index}`);

  if (body.classList.contains('hidden')) {
    body.classList.remove('hidden');
    chevron.innerHTML = PROJ_ICONS.chevronUp;
  } else {
    body.classList.add('hidden');
    chevron.innerHTML = PROJ_ICONS.chevronDown;
  }
}
