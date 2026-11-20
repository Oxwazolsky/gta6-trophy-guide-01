// app.js — Leonida Legend tracker: loads the 55 trophies, wires filters, spoiler mode, roadmap and progress.
import { loadEarnedNames, saveEarnedNames, loadSpoilerSetting, saveSpoilerSetting, exportProgressToFile, importProgressFromFile } from './storage.js';
import { renderRoadmapStages } from './roadmap.js';
import { createTrophyCard, renderProgressSummary } from './render.js';

const trophyData = await (await fetch('data/trophies.json')).json();
const allTrophies = trophyData.trophies;

const state = {
  earnedNames: loadEarnedNames(),
  spoilerOn: loadSpoilerSetting(),
  kindFilter: 'all',
  gradeFilter: 'all',
  stateFilter: 'all',
  stageFilter: null,
  searchText: '',
  openGuideId: 1,
};

const listEl = document.getElementById('trophy-list');
const roadmapEl = document.getElementById('roadmap-stages');

function trophyMatchesFilters(trophy) {
  if (state.kindFilter === 'missable' && !trophy.missable) return false;
  if (state.kindFilter !== 'all' && state.kindFilter !== 'missable' && trophy.kind !== state.kindFilter) return false;
  if (state.gradeFilter !== 'all' && trophy.grade !== state.gradeFilter) return false;
  if (state.stageFilter !== null && trophy.stage !== state.stageFilter) return false;
  if (state.stateFilter === 'earned' && !state.earnedNames.has(trophy.name)) return false;
  if (state.stateFilter === 'unearned' && state.earnedNames.has(trophy.name)) return false;
  if (state.searchText) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kind} ${trophy.grade}`.toLowerCase();
    if (!haystack.includes(state.searchText)) return false;
  }
  return true;
}

function renderChecklist() {
  const visible = allTrophies.filter(trophyMatchesFilters);
  listEl.replaceChildren();
  for (const trophy of visible) {
    listEl.append(createTrophyCard(trophy, {
      isEarned: state.earnedNames.has(trophy.name),
      spoilerOn: state.spoilerOn,
      isOpen: state.openGuideId === trophy.id,
      onToggleEarned: (item, checked) => {
        if (checked) state.earnedNames.add(item.name); else state.earnedNames.delete(item.name);
        saveEarnedNames(state.earnedNames);
        renderEverything();
      },
      onToggleGuide: (id) => {
        state.openGuideId = state.openGuideId === id ? null : id;
        renderChecklist();
      },
    }));
  }
  document.getElementById('result-count').textContent = `Showing ${visible.length} of ${allTrophies.length} trophies${state.stageFilter ? ` · Stage ${state.stageFilter} (click the stage again to clear)` : ''}`;
  document.getElementById('empty-msg').hidden = visible.length > 0;
}

function renderEverything() {
  renderProgressSummary(allTrophies, state.earnedNames);
  renderRoadmapStages(roadmapEl, allTrophies, state.earnedNames, state.stageFilter, (stage) => {
    state.stageFilter = stage;
    renderEverything();
  });
  renderChecklist();
}

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    state.kindFilter = chip.dataset.kind;
    renderChecklist();
  });
});
document.getElementById('grade-filter').addEventListener('change', (e) => { state.gradeFilter = e.target.value; renderChecklist(); });
document.getElementById('state-filter').addEventListener('change', (e) => { state.stateFilter = e.target.value; renderChecklist(); });
document.getElementById('search').addEventListener('input', (e) => { state.searchText = e.target.value.trim().toLowerCase(); renderChecklist(); });
const spoilerToggle = document.getElementById('spoiler-toggle');
spoilerToggle.checked = state.spoilerOn;
spoilerToggle.addEventListener('change', () => { state.spoilerOn = spoilerToggle.checked; saveSpoilerSetting(state.spoilerOn); renderChecklist(); });
document.getElementById('export-btn').addEventListener('click', () => exportProgressToFile(state.earnedNames, allTrophies.length));
document.getElementById('import-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const imported = await importProgressFromFile(file);
    state.earnedNames = new Set([...imported].filter((name) => allTrophies.some((t) => t.name === name)));
    saveEarnedNames(state.earnedNames);
    renderEverything();
  } catch { alert('That file could not be read as trophy progress.'); }
  e.target.value = '';
});
document.getElementById('reset-btn').addEventListener('click', () => {
  state.earnedNames = new Set();
  saveEarnedNames(state.earnedNames);
  renderEverything();
});

renderEverything();
