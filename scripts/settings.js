/**
 * Module Settings Registration
 * Registers a single setting for the API endpoint URL
 */

export function registerSettings() {
  game.settings.register("foundry-event-hooker", "apiEndpoint", {
    name: game.i18n.localize("foundry-event-hooker.settings.apiEndpoint.name"),
    hint: game.i18n.localize("foundry-event-hooker.settings.apiEndpoint.hint"),
    scope: "world",
    config: true,
    type: String,
    default: ""
  });
}