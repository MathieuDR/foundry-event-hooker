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
  if (CONFIG.debug?.hooks) {
    console.log(`🔍 Foundry Event Hooker | Raw event data for ${hookName}:`, args);
  }

  const eventData = {
    event: hookName,
    timestamp: Date.now(),
    world: {
      id: game.world?.id,
      title: game.world?.title,
      system: game.system?.id,
      systemVersion: game.system?.version
    }
  };

  try {
    attributes = extractAttributes(hookName, args)

    return {
      ...eventData,
      attributes: attributes
    }
  } catch (error) {
    console.warn(`Foundry Event Hooker | Error extracting data for ${hookName}:`, error);
    return eventData;
  }
}

export function shouldLogHook(hookName, args) {
  switch (hookName) {
    case "createChatMessage":
      return args[0].type == "rest"

    default:
      return true
  }
}

export function extractAttributes(hookName, args) {
  switch (hookName) {
    case "createChatMessage":
    case "dnd5e.createActiveEffect":
      return createDocumentHook(args);

    case "dnd5e.prepareSpellSlots":
      return prepareSpellSlots(args)

    case "updateActor":
    case "updateItem":
      return updateDocumentHook(args)

    case "dnd5e.calculateDamage":
      return calculateDamage(args)

    case "dnd5e.damageActor":
    case "dnd5e.healActor":
      return damageOrHealActor(args)

    case "dnd5e.renderChatMessage":
      return args[0]

    default:
      return args
  }
}

export function damageOrHealActor(args) {
  return {
    actor: extractFromActor(args[0]),
    delta: args[1],
    value: args[2],
    userId: args[3]
  }
}

export function calculateDamage(args) {
  return {
    damage: args[1],
    actor: extractFromActor(args[0])
  }
}

export function prepareSpellSlots(args) {
  return {
    spells: args[0],
    actor: extractFromActor(args[1])
  }
}

export function updateDocumentHook(args) {
  return {
    delta: args[1],
    databaseOperation: args[2],
    userId: args[3],
    actor: extractFromActor(args[0])
  }
}

export function createDocumentHook(args) {
  const { parent, ...dbOperation } = args[1]

  return {
    userId: args[2],
    document: args[0],
    databaseOperation: dbOperation
  }
}

export function extractFromActor(actor) {
  if (actor.type != "character") { return {} }

  return {
    // Core Identity
    id: actor._id,
    name: actor.name,
    type: actor.type,

    // Character Details
    details: {
      xp: actor.system?.details?.xp
    },

    // Core Stats
    abilities: Object.keys(actor.system?.abilities || {}).reduce((acc, key) => {
      const ability = actor.system.abilities[key];
      acc[key] = {
        value: ability.value,
        proficient: ability.proficient
      };
      return acc;
    }, {}),

    attributes: {
      hp: actor.system?.attributes?.hp,
      ac: actor.system?.attributes?.ac,
      init: actor.system?.attributes?.init,
      exhaustion: actor.system?.attributes?.exhaustion,
      concentration: actor.system?.attributes?.concentration,
      death: actor.system?.attributes?.death,
      inspiration: actor.system?.attributes?.inspiration,
    },

    // Skills and Proficiencies
    traits: {
      languages: actor.system?.traits?.languages?.value,
      weapons: actor.system?.traits?.weaponProf?.value,
      armor: actor.system?.traits?.armorProf?.value,
    },

    // Resources and Currency
    currency: actor.system?.currency,
    resources: actor.system?.resources,
    spells: actor.system?.spells,
    bonuses: actor.system?.bonuses,

    // Items (spells, equipment, features, etc.)
    items: actor.items?.map(item => ({
      id: item._id,
      name: item.name,
      type: item.type,
      levels: item.system?.levels,
      uses: item.system?.uses,
      hd: item.system?.hd,
      effects: item.effects,
      quantity: item.system?.quantity,
      attunement: item.system?.attuned,
      identified: item.system?.identified,
      equipped: item.system?.equipped,
      currency: item.system?.currency,
      container: item.system?.container,
      price: item.system?.price,
    })) || [],

    // Active Effects
    effects: actor.effects?.map(effect => ({
      id: effect._id,
      name: effect.name,
      description: effect.description,
      duration: effect.duration,
      statuses: effect.statuses,
      type: effect.type,
      disabled: effect.disabled,
    })) || []
  };
}

