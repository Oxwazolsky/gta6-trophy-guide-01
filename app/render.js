// render.js — trophy cards, grade badges, missable flags, guides with their sources cited beside them.
export const SOURCE_LINKS = {
  'Exophase — Grand Theft Auto VI trophies': 'https://www.exophase.com/game/grand-theft-auto-vi-ps5/trophies/',
  'PSNProfiles — Grand Theft Auto VI trophies': 'https://psnprofiles.com/trophies/grand-theft-auto-vi',
};
export const KIND_LABELS = { story: 'Story', side: 'Side strand', collectibles: 'Collectibles', activities: 'Activities', freeroam: 'Free roam' };

function makeBadge(text, extraClass) {
  const badge = document.createElement('span');
  badge.className = 'badge' + (extraClass ? ' ' + extraClass : '');
  badge.textContent = text;
  return badge;
}

function buildSourcesBlock(trophy) {
  const box = document.createElement('div');
  box.className = 'sources';
  box.append(document.createTextNode('Sources: '));
  trophy.sources.forEach((name, index) => {
    if (index) box.append(document.createTextNode(' · '));
    const link = document.createElement('a');
    link.href = SOURCE_LINKS[name] ?? '#';
    link.textContent = name;
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
  card.className = 'trophy' + (isEarned ? ' earned' : '');
  card.id = `trophy-${trophy.id}`;
  const top = document.createElement('div');
  top.className = 'trophy-top';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => onToggleEarned(trophy, box.checked));
  const dot = document.createElement('span');
  dot.className = `grade-dot grade-${trophy.grade}`;
  const body = document.createElement('div');
  const heading = document.createElement('h3');
  heading.textContent = hiddenBySpoiler ? '??? — hidden story trophy' : trophy.name;
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = hiddenBySpoiler ? 'Spoiler protection is on: this story trophy\u2019s name and description stay hidden until you earn it.' : trophy.description;
  if (hiddenBySpoiler) desc.classList.add('spoiler-mask');
  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.append(
    makeBadge(trophy.grade, `badge-grade-${trophy.grade}`),
    makeBadge(KIND_LABELS[trophy.kind] ?? trophy.kind),
    makeBadge(`Stage ${trophy.stage}`, 'badge-stage'),
  );
  if (trophy.missable) badges.append(makeBadge('⚠ Missable', 'badge-missable'));
  body.append(heading, desc, badges);
  if (!hiddenBySpoiler) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'guide-btn';
    btn.textContent = isOpen ? 'Hide guide ▴' : 'Guide & sources ▾';
    btn.addEventListener('click', () => onToggleGuide(trophy.id));
    body.append(btn);
    if (isOpen) body.append(buildGuidePanel(trophy));
  }
  top.append(box, dot, body);
  card.append(top);
  return card;
}

export function renderProgressSummary(trophies, earnedNames) {
  const total = trophies.length;
  const done = earnedNames.size;
  document.getElementById('progress-text').textContent = `${done} of ${total} earned · ${Math.round((done / total) * 100)}%`;
  document.getElementById('progress-bar').style.width = `${(done / total) * 100}%`;
  const grades = [['platinum', 'Platinum'], ['gold', 'Gold'], ['silver', 'Silver'], ['bronze', 'Bronze']];
  const list = document.getElementById('grade-counts');
  list.replaceChildren();
  for (const [grade, label] of grades) {
    const all = trophies.filter((t) => t.grade === grade);
    const got = all.filter((t) => earnedNames.has(t.name)).length;
    const item = document.createElement('li');
    const bold = document.createElement('b');
    bold.textContent = `${got}/${all.length}`;
    item.append(bold, document.createTextNode(` ${label}`));
    list.append(item);
  }
  const missables = trophies.filter((t) => t.missable);
  const missDone = missables.filter((t) => earnedNames.has(t.name)).length;
  document.getElementById('missable-count').textContent = `⚠ Missable: ${missDone}/${missables.length} secured — ${missables.map((t) => t.name).join(' · ')}`;
}
