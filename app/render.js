// render.js — written in this session. Everything that turns a trophy record
// into DOM: cards with checkbox, grade dot and badges, an expandable guide
// panel whose sources are cited right under the guide text, spoiler masking
// for story trophies, and the header progress summary (bar + per-grade counts).

export const SOURCE_LINKS = {
  'Exophase — Grand Theft Auto VI trophies': 'https://www.exophase.com/game/grand-theft-auto-vi-ps5/trophies/',
  'PSNProfiles — Grand Theft Auto VI trophies': 'https://psnprofiles.com/trophies/grand-theft-auto-vi',
};

export const KIND_LABELS = {
  story: 'Story',
  side: 'Side strand',
  collectibles: 'Collectibles',
  activities: 'Activities',
  freeroam: 'Free roam',
};

function makeBadge(text, extraClass) {
  const badge = document.createElement('span');
  badge.className = extraClass ? `badge ${extraClass}` : 'badge';
  badge.textContent = text;
  return badge;
}

function buildSourcesBlock(trophy) {
  const box = document.createElement('div');
  box.className = 'sources';
  box.append(document.createTextNode('Sources: '));
  trophy.sources.forEach((sourceName, index) => {
    if (index > 0) box.append(document.createTextNode(' · '));
    const link = document.createElement('a');
    link.href = SOURCE_LINKS[sourceName] ?? '#';
    link.textContent = sourceName;
    link.target = '_blank';
    link.rel = 'noopener';
    box.append(link);
  });
  box.append(document.createTextNode(' — official name, description and grade as published; guide text is original to this guide and written from the official description.'));
  return box;
}

function buildGuidePanel(trophy) {
  const panel = document.createElement('div');
  panel.className = 'guide-panel';

  const label = document.createElement('p');
  label.className = 'guide-label';
  label.textContent = 'GUIDE — IN OUR OWN WORDS';

  const text = document.createElement('p');
  text.textContent = trophy.guide;
  panel.append(label, text);

  if (trophy.missable) {
    const note = document.createElement('p');
    note.className = 'missable-note';
    note.textContent = '⚠ MISSABLE — flagged from its official description. Do it when the opportunity appears and keep a backup save.';
    panel.append(note);
  }

  panel.append(buildSourcesBlock(trophy));
  return panel;
}

export function createTrophyCard(trophy, view) {
  const { isEarned, spoilerOn, isOpen, onToggleEarned, onToggleGuide } = view;
  const hiddenBySpoiler = spoilerOn && trophy.kind === 'story' && !isEarned;

  const card = document.createElement('article');
  card.className = isEarned ? 'trophy earned' : 'trophy';
  card.id = `trophy-${trophy.id}`;

  const topRow = document.createElement('div');
  topRow.className = 'trophy-top';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = isEarned;
  checkbox.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  checkbox.addEventListener('change', () => onToggleEarned(trophy, checkbox.checked));

  const dot = document.createElement('span');
  dot.className = `grade-dot grade-${trophy.grade}`;

  const body = document.createElement('div');

  const heading = document.createElement('h3');
  heading.textContent = hiddenBySpoiler ? '??? — hidden story trophy' : trophy.name;

  const description = document.createElement('p');
  description.className = 'desc';
  description.textContent = hiddenBySpoiler
    ? 'Spoiler protection is on: this story trophy’s name and description stay hidden until you earn it.'
    : trophy.description;
  if (hiddenBySpoiler) description.classList.add('spoiler-mask');

  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.append(
    makeBadge(trophy.grade, `badge-grade-${trophy.grade}`),
    makeBadge(KIND_LABELS[trophy.kind] ?? trophy.kind),
    makeBadge(`Stage ${trophy.stage}`, 'badge-stage'),
  );
  if (trophy.missable) badges.append(makeBadge('⚠ Missable', 'badge-missable'));

  body.append(heading, description, badges);

  if (!hiddenBySpoiler) {
    const guideButton = document.createElement('button');
    guideButton.type = 'button';
    guideButton.className = 'guide-btn';
    guideButton.textContent = isOpen ? 'Hide guide ▴' : 'Guide & sources ▾';
    guideButton.addEventListener('click', () => onToggleGuide(trophy.id));
    body.append(guideButton);
    if (isOpen) body.append(buildGuidePanel(trophy));
  }

  topRow.append(checkbox, dot, body);
  card.append(topRow);
  return card;
}

export function renderProgressSummary(trophies, earnedNames) {
  const total = trophies.length;
  const done = earnedNames.size;
  const percent = Math.round((done / total) * 100);

  document.getElementById('progress-text').textContent = `${done} of ${total} earned · ${percent}%`;
  document.getElementById('progress-bar').style.width = `${(done / total) * 100}%`;

  const gradeList = document.getElementById('grade-counts');
  gradeList.replaceChildren();
  for (const [grade, label] of [['platinum', 'Platinum'], ['gold', 'Gold'], ['silver', 'Silver'], ['bronze', 'Bronze']]) {
    const inGrade = trophies.filter((trophy) => trophy.grade === grade);
    const earnedInGrade = inGrade.filter((trophy) => earnedNames.has(trophy.name)).length;
    const item = document.createElement('li');
    const bold = document.createElement('b');
    bold.textContent = `${earnedInGrade}/${inGrade.length}`;
    item.append(bold, document.createTextNode(` ${label}`));
    gradeList.append(item);
  }

  const missables = trophies.filter((trophy) => trophy.missable);
  const missablesDone = missables.filter((trophy) => earnedNames.has(trophy.name)).length;
  document.getElementById('missable-count').textContent =
    `⚠ Missable ${missablesDone}/${missables.length}: ${missables.map((trophy) => trophy.name).join(' · ')}`;
}
