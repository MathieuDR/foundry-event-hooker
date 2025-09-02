/**
 * Foundry Event Hooker - Main Entry Point
 * Hooks into D&D 5e events and sends them to a configurable API endpoint
 */

import { registerSettings } from "./settings.js";
import { startEventQueue } from "./event-queue.js";
import { extractEventData, shouldLogHook } from "./data-filter.js";

// List of D&D 5e hooks to monitor
const MONITORED_HOOKS = [
  'createChatMessage',
  'dnd5e.createActiveEffect',
  'dnd5e.prepareSpellSlots',
  'updateActor',
  'updateItem',
  'dnd5e.calculateDamage',
  'dnd5e.damageActor',
  'dnd5e.healActor',
  'dnd5e.renderChatMessage'
];

/**
 * Initialize the module
 */
Hooks.once('init', function() {
  console.log("Foundry Event Hooker | Initializing module");

  // Register module settings
  registerSettings();
});

/**
 * Start the event system once Foundry is ready
 */
Hooks.once('ready', function() {
  console.log("Foundry Event Hooker | Starting event system");

  // Start the event queue system
  startEventQueue();

  // Register listeners for all monitored hooks
  registerHookListeners();
});

/**
 * Register listeners for all D&D 5e hooks we want to monitor
 */
function registerHookListeners() {
  MONITORED_HOOKS.forEach(hookName => {
    Hooks.on(hookName, function(...args) {
      const shouldLog = shouldLogHook(hookName, ...args)

      if (shouldLog) {
        // Extract essential data from the hook
        const eventData = extractEventData(hookName, ...args);

        // Add to event queue for batching
        window.eventQueue?.addEvent(eventData);
      }
    });
  });

  console.log(`Foundry Event Hooker | Registered listeners for ${MONITORED_HOOKS.length} hooks`);
}
