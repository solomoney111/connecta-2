/**
 * DND Chatbot Engine
 * An intelligent conversational companion for Messenger supporting:
 * 1. D&D 5e Dice Rolling (/roll 1d20, /roll 2d6+3, /roll stats, etc.)
 * 2. Dynamic Text RPG / Interactive Adventures
 * 3. Character & NPC Generator
 * 4. Monster Lore & Stat Blocks
 * 5. Do Not Disturb (DND) status and focus mode management
 */

export interface DndBotResponse {
  content: string;
}

// Dice roller logic
export function rollDice(diceExpr: string): string {
  const clean = diceExpr.trim().toLowerCase().replace('/roll', '').replace('roll', '').trim();
  
  // Special: stats roll (4d6 drop lowest 6 times)
  if (clean.includes('stat')) {
    const stats: number[] = [];
    const breakdown: string[] = [];
    for (let i = 0; i < 6; i++) {
      const rolls = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ].sort((a, b) => b - a);
      const sum = rolls[0] + rolls[1] + rolls[2];
      stats.push(sum);
      breakdown.push(`[${rolls.slice(0, 3).join(', ')} | dropped ${rolls[3]}] = ${sum}`);
    }
    return `🎲 **D&D 5e Ability Scores Roll (4d6 drop lowest):**\n\n` +
      breakdown.map((b, idx) => `• Stat ${idx + 1}: ${b}`).join('\n') +
      `\n\n✨ **Generated Array:** [${stats.sort((a, b) => b - a).join(', ')}]\n` +
      `Assign these to STR, DEX, CON, INT, WIS, and CHA!`;
  }

  // General dice regex: e.g. 1d20, 2d6+4, d100, 3d8-2
  const match = clean.match(/^(\d*)d(\d+)(?:\s*([+-])\s*(\d+))?$/i);
  if (!match) {
    // Default to d20 if unspecified or just a number
    const count = 1;
    const sides = 20;
    const roll = Math.floor(Math.random() * sides) + 1;
    let critNote = '';
    if (roll === 20) critNote = ' — 🌟 **NATURAL 20! CRITICAL SUCCESS!**';
    if (roll === 1) critNote = ' — 💀 **NATURAL 1! CRITICAL FUMBLE!**';
    return `🎲 **DND Rolled:** 1d20 ➔ **${roll}**${critNote}`;
  }

  const count = match[1] ? Math.min(20, parseInt(match[1], 10)) : 1;
  const sides = parseInt(match[2], 10);
  const sign = match[3];
  const mod = match[4] ? parseInt(match[4], 10) : 0;

  if (sides <= 0 || sides > 1000) {
    return `🎲 Invalid die size! Please roll standard dice like d4, d6, d8, d10, d12, d20, or d100.`;
  }

  const rolls: number[] = [];
  let sum = 0;
  for (let i = 0; i < count; i++) {
    const val = Math.floor(Math.random() * sides) + 1;
    rolls.push(val);
    sum += val;
  }

  let finalTotal = sum;
  let modStr = '';
  if (sign === '+') {
    finalTotal += mod;
    modStr = ` + ${mod}`;
  } else if (sign === '-') {
    finalTotal -= mod;
    modStr = ` - ${mod}`;
  }

  let critNote = '';
  if (count === 1 && sides === 20) {
    if (rolls[0] === 20) critNote = ' — 🌟 **NATURAL 20! CRITICAL SUCCESS!**';
    if (rolls[0] === 1) critNote = ' — 💀 **NATURAL 1! CRITICAL FUMBLE!**';
  }

  return `🎲 **DND Rolled ${count}d${sides}${modStr}:**\n` +
    `Rolls: [${rolls.join(', ')}]${modStr} = **${finalTotal}**${critNote}`;
}

// Dynamic Character Generator
export function generateCharacter(): string {
  const races = [
    'Tiefling with deep obsidian horns and glowing amber eyes',
    'High Elf chronomancer scholar from Silvermoon',
    'Dwarf runecarver from the Ironforge Citadels',
    'Dragonborn paladin bearing ancient brass scales',
    'Halfling rogue with a penchant for glowing trinkets',
    'Goliath barbarian from the Frostpeak Crags',
    'Aasimar celestial sorcerer radiating gentle starlight',
    'Gnome artificer carrying clockwork brass automata',
  ];

  const classes = [
    'Wizard (School of Evocation)',
    'Paladin (Oath of Vengeance)',
    'Rogue (Arcane Trickster)',
    'Bard (College of Lore)',
    'Druid (Circle of the Moon)',
    'Warlock (Pact of the Hexblade)',
    'Fighter (Battle Master)',
    'Ranger (Gloom Stalker)',
  ];

  const alignments = [
    'Chaotic Good',
    'Lawful Good',
    'Neutral Good',
    'Chaotic Neutral',
    'True Neutral',
    'Lawful Neutral',
  ];

  const quirks = [
    'Compulsively cleans silver cutlery before entering combat.',
    'Speaks in dramatic third person whenever rolling a critical hit.',
    'Carries a small sentient cactus named Bramble in a leather holster.',
    'Always insists on taking the first watch, singing soft tavern shanties.',
    'Refuses to enter ancient catacombs without lighting scented sage incense.',
  ];

  const names = [
    'Vespera Nightbreeze',
    'Thorin Emberstrike',
    'Lyra Starwhisper',
    'Balthazar Ironroot',
    'Zephyr Swiftclaw',
    'Kaelen Ashfall',
    'Morwenna Deepwater',
    'Seraphina Voidgaze',
  ];

  const race = races[Math.floor(Math.random() * races.length)];
  const cls = classes[Math.floor(Math.random() * classes.length)];
  const align = alignments[Math.floor(Math.random() * alignments.length)];
  const quirk = quirks[Math.floor(Math.random() * quirks.length)];
  const name = names[Math.floor(Math.random() * names.length)];

  // Generate 6 quick scores
  const scores = {
    STR: Math.floor(Math.random() * 7) + 11,
    DEX: Math.floor(Math.random() * 7) + 11,
    CON: Math.floor(Math.random() * 7) + 11,
    INT: Math.floor(Math.random() * 7) + 11,
    WIS: Math.floor(Math.random() * 7) + 11,
    CHA: Math.floor(Math.random() * 7) + 11,
  };

  return `🧙 **DND Character Sheet Generator**\n\n` +
    `⚔️ **Name:** ${name}\n` +
    `🧬 **Race & Origin:** ${race}\n` +
    `🛡️ **Class:** ${cls}\n` +
    `⚖️ **Alignment:** ${align}\n` +
    `❤️ **Hit Points:** ${Math.floor(Math.random() * 15) + 24} (Level 3)\n` +
    `🛡️ **Armor Class:** ${Math.floor(Math.random() * 5) + 14}\n\n` +
    `📊 **Ability Scores:**\n` +
    `• STR ${scores.STR} | DEX ${scores.DEX} | CON ${scores.CON}\n` +
    `• INT ${scores.INT} | WIS ${scores.WIS} | CHA ${scores.CHA}\n\n` +
    `🎭 **Personality Quirk:**\n"${quirk}"\n\n` +
    `Type \`/roll d20\` to check for initiative or say **"adventure"** to send ${name} into the fray!`;
}

// Quest Generator
export function generateQuest(): string {
  const locations = [
    'The Sunken Vault of the Whispering Archmage',
    'The Obsidian Crags of Mount Dreadspire',
    'The Flooded Catacombs beneath the Old City Market',
    'The Enchanted Grove of the Twilight Fae',
    'The Clockwork Spire of High Artificer Vane',
  ];

  const objectives = [
    'Retrieve the shattered Sunshard Amulet before the eclipse seals the gate',
    'Investigate the disappearance of the merchant caravan and its arcane shipment',
    'Slay the Corrupted Wyrm poisoning the valley river with necrotic blight',
    'Negotiate an uneasy peace pact between the Moonclan Orcs and town elders',
    'Disarm the ancient runic wards guarding the sleeping titan',
  ];

  const rewards = [
    '850 Gold Pieces and a Cloak of the Mountebank (+2 Stealth)',
    '1,200 Gold Pieces, a Ring of Spell Storing, and free tavern board for life',
    'A legendary Vorpal Longsword with radiant runic inscriptions',
    'An arcane flying carpet woven from silver spider silk',
  ];

  const loc = locations[Math.floor(Math.random() * locations.length)];
  const obj = objectives[Math.floor(Math.random() * objectives.length)];
  const rew = rewards[Math.floor(Math.random() * rewards.length)];

  return `📜 **New Quest Available: [Rank: Silver Rank Hero]**\n\n` +
    `📍 **Location:** ${loc}\n` +
    `🎯 **Primary Objective:** ${obj}\n` +
    `💰 **Bounty & Loot:** ${rew}\n\n` +
    `Do you accept this bounty? Type **"accept quest"** or tell me what action you take first!`;
}

// Monsters & Bestiary
export function getMonsterLore(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes('beholder')) {
    return `👁️ **Monster Dossier: Beholder (Large Aberration, Lawful Evil)**\n\n` +
      `• **Armor Class:** 18 (Natural Armor)\n` +
      `• **Hit Points:** 180 (19d10 + 76)\n` +
      `• **Speed:** 0 ft., fly 20 ft. (hover)\n` +
      `• **Central Eye:** Antimagic Cone (150-foot cone, suppresses all spells & magic items!)\n` +
      `• **Eye Rays:** 10 magical rays including Disintegration, Charm, Death Ray, and Telekinesis.\n\n` +
      `⚠️ *DM Tip:* Never approach in an open corridor. Use mirrors, physical cover, and ranged archery outside antimagic cone radius!`;
  }

  if (lower.includes('dragon')) {
    return `🐉 **Monster Dossier: Adult Red Dragon (Huge Dragon, Chaotic Evil)**\n\n` +
      `• **Armor Class:** 19 (Natural Armor)\n` +
      `• **Hit Points:** 256 (17d12 + 146)\n` +
      `• **Speed:** 40 ft., fly 80 ft., climb 40 ft.\n` +
      `• **Frightful Presence:** DC 19 WIS save or become Frightened for 1 minute.\n` +
      `• **Fire Breath:** 60-foot cone, 63 (18d6) fire damage (DC 21 DEX save for half).\n` +
      `• **Legendary Actions:** Wing Attack, Tail Sweep, Detect.\n\n` +
      `🔥 *Tactical Advice:* Equip Rings of Fire Resistance and do not bunch up!`;
  }

  if (lower.includes('mimic')) {
    return `📦 **Monster Dossier: Mimic (Medium Monstrosity, Neutral)**\n\n` +
      `• **Armor Class:** 12\n` +
      `• **Hit Points:** 58 (9d8 + 18)\n` +
      `• **False Appearance:** While motionless, it is indistinguishable from an ordinary chest, door, or barrel!\n` +
      `• **Adhesive:** Huge adhesive pseudopod sticks to anything it touches. Huge DC 13 escape check.\n\n` +
      `🗝️ *Always poke suspicious treasure chests with an 11-foot pole before opening!*`;
  }

  return `👾 **Random Monster Encounter!**\n\n` +
    `A **Shadow Stalker Panther** emerges from the underbrush!\n` +
    `• AC: 14 | HP: 45 | Stealth: +6\n` +
    `• Pounce Attack: 2d8 + 3 slashing damage (DC 13 STR save or knocked prone).\n\n` +
    `Roll initiative! Type \`/roll 1d20+3\` to see who strikes first!`;
}

// Interactive Adventure State Engine
export function handleAdventureStep(userInput: string): string {
  const lower = userInput.toLowerCase();

  if (lower.includes('start') || lower.includes('adventure') || lower.includes('campaign') || lower.includes('begin')) {
    return `🏰 **The Gates of Eldoria (Chapter 1)**\n\n` +
      `A cold mountain rain beats against your cloak. Before you rise the towering ironwood gates of Eldoria. ` +
      `The torches flicker erratically, and the portcullis is jammed half-open. Inside the courtyard, you hear the ` +
      `low guttural chanting of a goblin ritual and the metallic clinking of a locked iron chest.\n\n` +
      `What do you do?\n` +
      `**1.** Stealthily climb the ruined outer parapet to peek into the courtyard.\n` +
      `**2.** Draw your weapon and kick the iron gate open with a thunderous battle cry!\n` +
      `**3.** Cast an illusory distraction spell to draw the guards away.\n\n` +
      `*(Reply with 1, 2, or 3, or tell me your custom action!)*`;
  }

  if (lower === '1' || lower.includes('climb') || lower.includes('stealth')) {
    const roll = Math.floor(Math.random() * 20) + 1;
    if (roll >= 10) {
      return `🧗 **Stealth Check Result: [${roll} + 3 = ${roll + 3} - Success!]**\n\n` +
        `You scale the crumbling stone like a ghost. From the battlements, you spot three Goblin Skirmishers ` +
        `roasting a boar over glowing magical coals, while a Shaman chants over a chained treasure chest with arcane runes!\n\n` +
        `What is your next move?\n` +
        `• **A.** Snipe the Shaman with a longbow arrow (\`/roll 1d20+5\` to hit)\n` +
        `• **B.** Drop down behind the treasure chest to pick the lock\n` +
        `• **C.** Drop an oil flask into their fire to create an explosion!`;
    } else {
      return `🧗 **Stealth Check Result: [${roll} + 3 = ${roll + 3} - Failed!]**\n\n` +
        `A loose stone crumbles beneath your boot, crashing loudly onto the stone cobbles below! ` +
        `The goblins screech in surprise: *"INTRUDER! SHARPEN THE SPEARS!"*\n\n` +
        `Roll for initiative immediately! Type \`/roll 1d20+2\` to react before their arrows fly!`;
    }
  }

  if (lower === '2' || lower.includes('kick') || lower.includes('attack') || lower === 'a') {
    const atk = Math.floor(Math.random() * 20) + 1;
    const dmg = Math.floor(Math.random() * 8) + Math.floor(Math.random() * 8) + 4;
    return `⚔️ **Combat Encounter!**\n\n` +
      `You burst forward with steel drawn! Your strike rolls **${atk + 4}** to hit! ` +
      (atk >= 10
        ? `A direct hit! You cleave the frontline defender for **${dmg} slashing damage**, sending them sprawling!`
        : `The defender parries with a buckler shield! Sparks shower the wet stones!`) +
      `\n\nThe Goblin Shaman begins channeling a Bolt of Dark Lightning! Type \`/roll 1d20\` for a Dexterity saving throw!`;
  }

  if (lower === '3' || lower.includes('spell') || lower.includes('magic') || lower.includes('illusion')) {
    return `✨ **Arcane Illusion!**\n\n` +
      `You weave somatic gestures, producing the lifelike phantom roar of a manticore just outside the northern wall! ` +
      `The goblins panic, dropping their weapons and scrambling to investigate the roar. ` +
      `The courtyard and chest are momentarily unguarded!\n\n` +
      `Do you open the chest, or set an ambush? Type your action!`;
  }

  return `🎲 You press forward into the dungeon corridors. Shadows dance against the carved dwarven pillars. ` +
    `Ahead, the path splits into a damp tunnel leading downward smelling of sulfur, and a high arched doorway ` +
    `emanating soft blue light. Which path do you take?`;
}

// Do Not Disturb Mode handler
export function handleDndMode(text: string): string {
  return `🛡️ **[DND Protocol - Do Not Disturb Active]**\n\n` +
    `Hello! As the **DND Bot**, I serve double duty: your tabletop Dungeon Master AND your Connecta Do-Not-Disturb guardian.\n\n` +
    `✨ **Current Status:**\n` +
    `• Silent Notification Shield: Active\n` +
    `• Auto-Responder: *"The user is currently focused (or rolling saving throws). Incoming messages are queued."*\n` +
    `• To toggle your social status, visit **Settings > Privacy** anytime!\n\n` +
    `Need a quick adventure break while in DND mode? Type \`adventure\` or \`/roll d20\`!`;
}

// Main message responder
export function generateDndBotResponse(incomingMessage: string, userName: string = 'traveler'): DndBotResponse {
  const text = incomingMessage.trim();
  const lower = text.toLowerCase();

  // 1. Dice rolls
  if (lower.startsWith('/roll') || lower.startsWith('roll ') || lower === 'roll' || lower.match(/^\d*d\d+/)) {
    return { content: rollDice(text) };
  }

  // 2. Character creation
  if (lower.includes('character') || lower.includes('create char') || lower.includes('make char') || lower.includes('sheet') || lower.includes('npc')) {
    return { content: generateCharacter() };
  }

  // 3. Quest prompt
  if (lower.includes('quest') || lower.includes('bounty') || lower.includes('mission')) {
    return { content: generateQuest() };
  }

  // 4. Monster inquiry
  if (lower.includes('monster') || lower.includes('beholder') || lower.includes('dragon') || lower.includes('mimic') || lower.includes('bestiary')) {
    return { content: getMonsterLore(text) };
  }

  // 5. Interactive Adventure
  if (
    lower.includes('adventure') ||
    lower.includes('campaign') ||
    lower === '1' ||
    lower === '2' ||
    lower === '3' ||
    lower === 'a' ||
    lower === 'b' ||
    lower === 'c' ||
    lower.includes('attack') ||
    lower.includes('open chest') ||
    lower.includes('climb') ||
    lower.includes('stealth') ||
    lower.includes('potion')
  ) {
    return { content: handleAdventureStep(text) };
  }

  // 6. Do Not Disturb / DND acronym inquiry
  if (
    lower.includes('do not disturb') ||
    lower === 'dnd' ||
    lower === 'dnd mode' ||
    lower.includes('quiet mode') ||
    lower.includes('away mode') ||
    lower.includes('status')
  ) {
    return { content: handleDndMode(text) };
  }

  // 7. Help & Commands
  if (lower.includes('help') || lower.includes('command') || lower.includes('what can you do') || lower === 'hi' || lower === 'hello' || lower === 'hey') {
    return {
      content: `Greetings ${userName}! 🎲 I am **DND**, your AI Dungeon Master & Messenger companion!\n\n` +
        `Here are the spells and commands at your disposal:\n` +
        `• 🎲 \`/roll 1d20\` or \`/roll 2d6+3\` — Roll any tabletop dice\n` +
        `• 📊 \`/roll stats\` — Roll 4d6 drop lowest ability scores\n` +
        `• ⚔️ \`adventure\` — Start an interactive text RPG quest\n` +
        `• 🧙 \`character\` — Generate a complete D&D 5e character concept\n` +
        `• 🐉 \`monster [name]\` — View monster stats (Beholder, Dragon, Mimic)\n` +
        `• 📜 \`quest\` — Receive a high-stakes adventure bounty\n` +
        `• 🛡️ \`dnd mode\` — Check Do Not Disturb & auto-reply status\n\n` +
        `What would you like to explore first?`,
    };
  }

  // 8. General conversational fallback with roleplay charm
  const responses = [
    `Ah, an interesting remark, ${userName}! 🎲 The Dungeon Master ponders your words. Would you like to test your fate with a \`/roll 1d20\` check, or embark on a new \`adventure\`?`,
    `A wise traveler speaks! In the taverns of Neverwinter, tales like that are worth a pint of dwarven ale. 🍺 Type \`quest\` if you are ready to seek glory and gold!`,
    `The dice rattle in their velvet pouch... 🎲 Tell me, ${userName}, are you feeling lucky today? Type \`/roll d20\` to test your fortune, or ask me for a \`character\` concept!`,
    `Your message echoes through the grand stone halls. As DND, I'm here to run adventures, roll dice, or keep watch while you focus. Say \`help\` anytime to see all commands!`,
  ];

  return {
    content: responses[Math.floor(Math.random() * responses.length)],
  };
}
