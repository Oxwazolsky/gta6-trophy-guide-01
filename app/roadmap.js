// roadmap.js — the Roadmap to the Platinum: six stages built from the official descriptions.
export const ROADMAP_STAGES = [
  { stage: 1, title: 'Story & core missions', plan: 'Gone Fishing, Chapters 1–4, final mission, named missions. Missables: choices, VCIA departure.' },
  { stage: 2, title: 'Strands & strangers', plan: 'Final missions: Andy, Kenton, Billy, Randy, Tyrone. Bret\u2019s hunt. 8 stranger strands.' },
  { stage: 3, title: 'Collectibles & exploring', plan: '18 meditation spots, 3 card sets, WAiNK ×100, 100 vehicles, 52 areas, Ocean Beach cocktail.' },
  { stage: 4, title: 'Activities & mastery', plan: 'All 9 activity types, then: 42 range golds, 14 drone wins, 20 race wins, 250 stunts, 50 challenges.' },
  { stage: 5, title: 'Money & partner play', plan: 'Robberies and escapes, 1 operation per gang ×9, $250k laundered, $100k spent, 8 garages.' },
  { stage: 6, title: '100% & the Platinum', plan: 'Audit the 100% checklist, earn A Long Road, and the Platinum pops as trophy 55.' },
];

export function renderRoadmapStages(container, trophies, earnedNames, activeStage, onStagePick) {
  container.replaceChildren();
  for (const info of ROADMAP_STAGES) {
    const inStage = trophies.filter((t) => t.stage === info.stage);
    const done = inStage.filter((t) => earnedNames.has(t.name)).length;
    const missables = inStage.filter((t) => t.missable).length;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'stage-card' + (activeStage === info.stage ? ' active' : '');
    const heading = document.createElement('h3');
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = `Stage ${info.stage} · `;
    heading.append(num, document.createTextNode(info.title));
    const plan = document.createElement('p');
    plan.textContent = info.plan;
    const meta = document.createElement('p');
    meta.className = 'stage-meta';
    meta.textContent = `${done}/${inStage.length} earned${missables ? ` · ⚠ ${missables} missable` : ''} — click to filter`;
    card.append(heading, plan, meta);
    card.addEventListener('click', () => onStagePick(activeStage === info.stage ? null : info.stage));
    container.append(card);
  }
}
