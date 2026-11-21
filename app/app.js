// app.js — Leonida Legend, the tracker controller.
// I load the 55 trophies, keep the current filter / search / spoiler state in
// one place, and re-render the checklist, roadmap and progress header whenever
// anything changes. Earned state is delegated to storage.js.

import {
  loadEarnedNames,
  saveEarnedNames,
  loadSpoilerSetting,
  saveSpoilerSetting,
  exportProgressToFile,
  importProgressFromFile,
} from './storage.js';
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
  // The "missable" chip is a kind filter of its own: it ignores kind and
  // keeps only flagged trophies.
  if (state.kindFilter === 'missable') {
    if (!trophy.missable) return false;
  } else if (state.kindFilter !== 'all' && trophy.kind !== state.kindFilter) {
    return false;
  }
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
        if (checked) state.earnedNames.add(item.name);
        else state.earnedNames.delete(item.name);
        saveEarnedNames(state.earnedNames);
        renderEverything();
      },
      onToggleGuide: (id) => {
        state.openGuideId = state.openGuideId === id ? null : id;
        renderChecklist();
      },
    }));
  }
  const stageNote = state.stageFilter ? ` · Stage ${state.stageFilter} (click the stage again to clear)` : '';
  document.getElementById('result-count').textContent = `Showing ${visible.length} of ${allTrophies.length} trophies${stageNote}`;
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

// Filter chips (kind, including missable-only)
document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((other) => other.classList.remove('active'));
    chip.classList.add('active');
    state.kindFilter = chip.dataset.kind;
    renderChecklist();
  });
});

document.getElementById('grade-filter').addEventListener('change', (event) => {
  state.gradeFilter = event.target.value;
  renderChecklist();
});
document.getElementById('state-filter').addEventListener('change', (event) => {
  state.stateFilter = event.target.value;
  renderChecklist();
});
document.getElementById('search').addEventListener('input', (event) => {
  state.searchText = event.target.value.trim().toLowerCase();
  renderChecklist();
});

const spoilerToggle = document.getElementById('spoiler-toggle');
spoilerToggle.checked = state.spoilerOn;
spoilerToggle.addEventListener('change', () => {
  state.spoilerOn = spoilerToggle.checked;
  saveSpoilerSetting(state.spoilerOn);
  renderChecklist();
});

document.getElementById('export-btn').addEventListener('click', () => {
  exportProgressToFile(state.earnedNames, allTrophies.length);
});

document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = await importProgressFromFile(file);
    const knownNames = new Set(allTrophies.map((trophy) => trophy.name));
    state.earnedNames = new Set([...imported].filter((name) => knownNames.has(name)));
    saveEarnedNames(state.earnedNames);
    renderEverything();
  } catch {
    alert('That file could not be read as trophy progress.');
  }
  event.target.value = '';
});

document.getElementById('reset-btn').addEventListener('click', () => {
  state.earnedNames = new Set();
  saveEarnedNames(state.earnedNames);
  renderEverything();
});

renderEverything();
