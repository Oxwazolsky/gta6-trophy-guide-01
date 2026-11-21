// storage.js — persistence for Leonida Legend.
// Earned trophies and the spoiler setting live in localStorage; progress can
// also leave the browser as a JSON file and come back in through import.

export const PROGRESS_KEY = 'leonida-legend-earned-v1';
export const SPOILER_KEY = 'leonida-legend-spoiler-v1';

export function loadEarnedNames() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((entry) => typeof entry === 'string'));
  } catch {
    return new Set();
  }
}

export function saveEarnedNames(earnedNames) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earnedNames]));
}

export function loadSpoilerSetting() {
  return localStorage.getItem(SPOILER_KEY) === 'on';
}

export function saveSpoilerSetting(isOn) {
  localStorage.setItem(SPOILER_KEY, isOn ? 'on' : 'off');
}

export function exportProgressToFile(earnedNames, totalCount) {
  const payload = {
    app: 'leonida-legend-gta6-tracker',
    exportedAt: new Date().toISOString(),
    total: totalCount,
    earned: [...earnedNames],
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'gta6-trophy-progress.json';
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

export async function importProgressFromFile(file) {
  const parsed = JSON.parse(await file.text());
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('No earned list in that file');
  return new Set(names.filter((entry) => typeof entry === 'string'));
}
