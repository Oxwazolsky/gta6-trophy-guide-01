// roadmap.js — the six-stage Roadmap to the Platinum, written in this session.
// The stages are my ordering of the official list: story first, then strands,
// collectibles, activities, money / partner play, and finally the 100% audit.
// Clicking a stage card filters the checklist to that stage.

export const ROADMAP_STAGES = [
  { stage: 1, title: 'Story & core missions', plan: 'Gone Fishing, Chapters 1–4, final mission, named missions. Missables: choices, VCIA departure.' },
  { stage: 2, title: 'Strands & strangers', plan: 'Final missions: Andy, Kenton, Billy, Randy, Tyrone. Bret’s hunt. 8 stranger strands.' },
  { stage: 3, title: 'Collectibles & exploring', plan: '18 meditation spots, 3 card sets, WAiNK ×100, 100 vehicles, 52 areas, Ocean Beach cocktail.' },
  { stage: 4, title: 'Activities & mastery', plan: 'All 9 activity types, then: 42 range golds, 14 drone wins, 20 race wins, 250 stunts, 50 challenges.' },
  { stage: 5, title: 'Money & partner play', plan: 'Robberies and escapes, 1 operation per gang ×9, $250k laundered, $100k spent, 8 garages.' },
  { stage: 6, title: '100% & the Platinum', plan: 'Audit the 100% checklist, earn A Long Road, and the Platinum pops as trophy 55.' },
];

export function renderRoadmapStages(container, trophies, earnedNames, activeStage, onStagePick) {
  container.replaceChildren();
  for (const info of ROADMAP_STAGES) {
    const inStage = trophies.filter((trophy) => trophy.stage === info.stage);
    const doneCount = inStage.filter((trophy) => earnedNames.has(trophy.name)).length;
    const missableCount = inStage.filter((trophy) => trophy.missable).length;

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'stage-card' + (activeStage === info.stage ? ' active' : '');

    const heading = document.createElement('h3');
    const number = document.createElement('span');
    number.className = 'stage-num';
    number.textContent = `Stage ${info.stage} · `;
    heading.append(number, document.createTextNode(info.title));

    const plan = document.createElement('p');
    plan.textContent = info.plan;

    const meta = document.createElement('p');
    meta.className = 'stage-meta';
    meta.textContent = `${doneCount}/${inStage.length} earned${missableCount ? ` · ⚠ ${missableCount} missable` : ''} — click to filter`;

    card.append(heading, plan, meta);
    card.addEventListener('click', () => {
      onStagePick(activeStage === info.stage ? null : info.stage);
    });
    container.append(card);
  }
}
