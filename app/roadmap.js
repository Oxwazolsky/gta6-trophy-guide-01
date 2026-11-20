// roadmap.js — the Roadmap to the Platinum: six stages built from the official descriptions.
export const ROADMAP_STAGES = [
  { stage: 1, title: 'Story chapters & core missions', plan: 'Gone Fishing, Chapters 1–4, the final mission and the named missions (Breakfast Run, Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory). Watch the story-stage missables: choices, and the departure at VCIA.' },
  { stage: 2, title: 'Character strands & strangers', plan: 'Final missions for Andy, Kenton, Billy, Randy and Tyrone, the unique-animal hunt for Bret, and 8 stranger strands for the Strangers & Freaks silver.' },
  { stage: 3, title: 'Collectibles & exploration', plan: 'Sweep Leonida region by region: 18 meditation spots, 3 card sets, WAiNK It ×100, 100 vehicles, all 52 areas, a cocktail on Ocean Beach, something strange.' },
  { stage: 4, title: 'Activities & mastery counts', plan: 'Sample all 9 activity types, then master them: 42 Shooting Range golds, drone wins at 14 locations, 20 race wins, 250 stunts, 50 challenges, fishing, arcade, bowling.' },
  { stage: 5, title: 'Money, properties & partner play', plan: 'Partner escapes and robberies (shops, jewelry, 5 vaults, armored truck, 1 operation per gang ×9), $250k laundered, $100k spent, 8 garages, 10 vehicles registered.' },
  { stage: 6, title: '100% completion & the Platinum', plan: 'Audit the in-game 100% checklist, close any gap, earn A Long Road — then Vice Got a Price! pops automatically as the 55th trophy.' },
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
