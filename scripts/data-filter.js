/**
 * Data Filtering System
 * Extracts only essential data from hook events, removing bulk data
 */

/**
 * Main extraction logic for all hook events
 * @param {string} hookName - Name of the hook that fired
 * @param {...any} args - Arguments passed to the hook
 * @returns {Object} Filtered event data
 */
export function extractEventData(hookName, ...args) {
  const timestamp = Date.now();
  
  // Debug logging for what we actually receive
  if (CONFIG.debug?.hooks) {
    console.log(`🔍 Foundry Event Hooker | Raw event data for ${hookName}:`, args);
  }
  
  // Base event structure with world/game context
  const eventData = {
    event: hookName,
    timestamp: timestamp,
    world: {
      id: game.world?.id,
      title: game.world?.title,
      system: game.system?.id,
      systemVersion: game.system?.version
    }
  };
  
  // Extract data based on hook type
  try {
    switch (hookName) {
      case 'dnd5e.rollSkill':
      case 'dnd5e.rollAbilityCheck':
      case 'dnd5e.rollSavingThrow':
        return extractRollEvent(eventData, args);
      
      case 'dnd5e.rollAttack':
      case 'dnd5e.rollDamage':
      case 'dnd5e.rollInitiative':
      case 'dnd5e.rollDeathSave':
        return extractRollEvent(eventData, args);
      
      case 'dnd5e.applyDamage':
        return extractDamageEvent(eventData, args);
      
      default:
        return extractGenericEvent(eventData, args);
    }
  } catch (error) {
    console.warn(`Foundry Event Hooker | Error extracting data for ${hookName}:`, error);
    return eventData;
  }
}

/**
 * Extract data from roll-based events
 * @param {Object} baseEvent - Base event structure
 * @param {Array} args - Hook arguments
 * @returns {Object} Filtered roll event data
 */
function extractRollEvent(baseEvent, args) {
  // FoundryVTT D&D5e hooks pass: [roll, context]
  const [roll, context] = args;
  
  const eventData = {
    ...baseEvent,
    actor: extractActorBasics(context?.subject),
    roll: extractRollData(roll),
    context: extractContext(baseEvent.event, context)
  };
  
  return eventData;
}

/**
 * Extract data from damage application events
 * @param {Object} baseEvent - Base event structure
 * @param {Array} args - Hook arguments
 * @returns {Object} Filtered damage event data
 */
function extractDamageEvent(baseEvent, args) {
  const [actor, damage, options] = args;
  
  const eventData = {
    ...baseEvent,
    actor: extractActorBasics(actor),
    damage: {
      amount: damage,
      type: options?.damageType || 'unknown'
    },
    context: extractContext(baseEvent.event, options)
  };
  
  return eventData;
}

/**
 * Extract data from generic events
 * @param {Object} baseEvent - Base event structure  
 * @param {Array} args - Hook arguments
 * @returns {Object} Filtered generic event data
 */
function extractGenericEvent(baseEvent, args) {
  // For unknown events, just capture basic info
  const eventData = {
    ...baseEvent,
    argsCount: args.length
  };
  
  // Try to extract actor if first arg looks like one
  if (args[0] && args[0]._id && args[0].name) {
    eventData.actor = extractActorBasics(args[0]);
  }
  
  return eventData;
}

/**
 * Extract just the basic actor information
 * @param {Object} actor - Actor document
 * @returns {Object} Basic actor data
 */
export function extractActorBasics(actor) {
  if (!actor) return {};
  
  return {
    id: actor._id || actor.id,
    name: actor.name,
    type: actor.type,
    img: actor.img
  };
}

/**
 * Extract roll data (totals and dice results)
 * @param {Object} roll - Roll object
 * @returns {Object} Roll data
 */
export function extractRollData(roll) {
  if (!roll) return {};
  
  const rollData = {
    total: roll.total,
    formula: roll.formula,
    dice: []
  };
  
  // Extract dice results if available
  if (roll.dice && Array.isArray(roll.dice)) {
    rollData.dice = roll.dice.map(die => ({
      faces: die.faces,
      results: die.results?.map(r => r.result) || []
    }));
  }
  
  return rollData;
}

/**
 * Extract context information based on hook type
 * @param {string} hookName - Name of the hook
 * @param {Object} options - Options/context object
 * @returns {Object} Context data
 */
export function extractContext(hookName, options) {
  if (!options) return {};
  
  const context = {};
  
  // Extract relevant context based on hook type
  switch (hookName) {
    case 'dnd5e.rollSkill':
      if (options.skill) context.skill = options.skill;
      break;
      
    case 'dnd5e.rollAbilityCheck':
      if (options.ability) context.ability = options.ability;
      break;
      
    case 'dnd5e.rollSavingThrow':
      if (options.ability) context.savingThrow = options.ability;
      break;
      
    case 'dnd5e.rollAttack':
      if (options.attackType) context.attackType = options.attackType;
      if (options.weapon) context.weaponName = options.weapon.name;
      break;
      
    case 'dnd5e.rollDamage':
      if (options.damageType) context.damageType = options.damageType;
      break;
      
    case 'dnd5e.applyDamage':
      if (options.damageType) context.damageType = options.damageType;
      break;
  }
  
  return context;
}