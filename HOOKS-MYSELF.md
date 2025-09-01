# Hooks

These are all some hooks I found interesting. We also have the following table on how/what we want to track

| Hook                     | What                                           | Why                                               | Notes                                                                                                              |
| -                        | -                                              | -                                                 | -                                                                                                                  |
| dnd5e.calculateDamage    | This calculates damage after an attack         | Game mechanic                                     | Doesn't show the source, shows damage type though (spells & weapons work)                                          |
| dnd5e.heal/damageActor   | Whenever actor gets damaged or healed          | Game mechanic                                     | For monsters and players alike, doesn't show source, Will show up on Actor updaee hook too                         |
| dnd5e.createActiveEffect | Core mechanic, to show conditions on character | Trackind conditions                               | Has parent in second object that has to be stripped                                                                |
| deleteActiveEffect       | Core mechanic                                  | Tracking conditions, concentation etc             | Same as create, but then removing it. Similar if almost not exactly the same hook                                  |
| updateItem               | Hit die                                        | Its tracking hit die / abilities with these items | Seems like bad implementatino, but necessary for us to see who uses hit die, might use chat message instead though |
| updateActor              | All data of character sheet updates            | Tracks all changes                                | This hook is always triggered, might have 2 different hooks with same info, the parent document must be stripped   |
| createChatMessage        | Rests (long & short)                           | tracking rests                                    | Only when type is rest! Also shows what we get back                                                                |
| dnd5e.prepareSpellSlots  | Spells                                         | Tracking how many spells they can do? dnno        | Might not be usefull...                                                                                            |
| dnd5e.renderChatMessage | All chat messages from the system | Almost anything | Great help, some hooks double, get hooks from other players. Hard to get info out of |


```
 /**
     * A hook event that fires after damage values are calculated for an actor.
     * @param {Actor5e} actor                     The actor being damaged.
     * @param {DamageDescription[]} damages       Damage descriptions.
     * @param {DamageApplicationOptions} options  Additional damage application options.
     * @returns {boolean}                         Explicitly return `false` to prevent damage application.
     * @function dnd5e.calculateDamage
     * @memberof hookEvents
     */
    if ( Hooks.call("dnd5e.calculateDamage", this, damages, options) === false ) return false;

[...,   [
    {
      "value": 7,
      "type": "piercing",
      "properties": {},
      "active": {
        "multiplier": 1
      }
    }
  ],
  {
    "multiplier": 1
  }
]

```


```
 /**
         * A hook event that fires when an actor is damaged or healed by any means. The actual name
         * of the hook will depend on the change in hit points.
         * @function dnd5e.damageActor
         * @memberof hookEvents
         * @param {Actor5e} actor                                       The actor that had their hit points reduced.
         * @param {{hp: number, temp: number, total: number}} changes   The changes to hit points.
         * @param {object} update                                       The original update delta.
         * @param {string} userId                                       Id of the user that performed the update.
         */
        Hooks.callAll(`dnd5e.${changes.total > 0 ? "heal" : "damage"}Actor`, this, changes, data, userId);

[..., {
    "hp": 0,
    "temp": 10,
    "total": 10
  }, {
    "system": {
      "attributes": {
        "hp": {
          "temp": 10
        }
      }
    },
    "_stats": {
      "modifiedTime": 1756756853065
    },
    "_id": "aZBm2Mv1F2OBUISK"
  }, "..."]

```

```
[
  {
    "name": "Frightened",
    "img": "systems/dnd5e/icons/svg/statuses/frightened.svg",
    "_id": "dnd5efrightened0",
    "statuses": [
      "frightened"
    ],
    "description": "@Embed[Compendium.dnd5e.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.oreoyaFKnvZCrgij inline]",
    "type": "base",
    "system": {},
    "changes": [],
    "disabled": false,
    "duration": {
      "startTime": 6,
      "combat": null
    },
    "origin": null,
    "tint": "#ffffff",
    "transfer": false,
    "sort": 0,
    "flags": {
      "dae": {
        "specialDuration": []
      }
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "exportSource": null,
      "coreVersion": "13.347",
      "systemId": "dnd5e",
      "systemVersion": "5.1.1",
      "createdTime": 1756756655963,
      "modifiedTime": 1756756655963,
      "lastModifiedBy": "OBMXUVJe8fTkR6yS"
    }
  },
  {
    "keepId": true,
    "action": "create",
    "modifiedTime": 1756756655963,
    "render": true,
    "renderSheet": false,
    "deleted": false,
    "parent": {
      "folder": "NK5JGqICFW6cr9ZS",
      "name": "Lilly",
      "type": "character",
      "_id": "aZBm2Mv1F2OBUISK",
      "img": "tokenizer/pc-images/lilly.Avatar.webp?1756411399673",
      "system": {...},
      "prototypeToken": {
...
      },
      "items": [
...
      ],
      "effects": [
        {
          "name": "Frightened",
          "img": "systems/dnd5e/icons/svg/statuses/frightened.svg",
          "_id": "dnd5efrightened0",
          "statuses": [
            "frightened"
          ],
          "description": "@Embed[Compendium.dnd5e.rules.JournalEntry.w7eitkpD7QQTB6j0.JournalEntryPage.oreoyaFKnvZCrgij inline]",
          "type": "base",
          "system": {},
          "changes": [],
          "disabled": false,
          "duration": {
            "startTime": 6,
            "combat": null
          },
          "origin": null,
          "tint": "#ffffff",
          "transfer": false,
          "sort": 0,
          "flags": {
            "dae": {
              "specialDuration": []
            }
          },
          "_stats": {
            "compendiumSource": null,
            "duplicateSource": null,
            "exportSource": null,
            "coreVersion": "13.347",
            "systemId": "dnd5e",
            "systemVersion": "5.1.1",
            "createdTime": 1756756655963,
            "modifiedTime": 1756756655963,
            "lastModifiedBy": "OBMXUVJe8fTkR6yS"
          }
        }
      ],
      "sort": 400000,
      "ownership": {
        "default": 0,
        "4ckDtaRpdKGYV1Gb": 3,
        "OBMXUVJe8fTkR6yS": 3
      },
      "flags": {
        "core": {
          "sheetClass": "dnd5e.CharacterActorSheet"
        },
        "dnd5e": {},
        "flash-rolls-5e": {},
        "drakkenheim": {
          "contamination": 0
        }
      },
      "_stats": {
        "compendiumSource": "Actor.aZBm2Mv1F2OBUISK",
        "duplicateSource": null,
        "exportSource": null,
        "coreVersion": "13.347",
        "systemId": "dnd5e",
        "systemVersion": "5.1.1",
        "createdTime": 1755444603150,
        "modifiedTime": 1756755242440,
        "lastModifiedBy": "OBMXUVJe8fTkR6yS"
      }
    }
  },
  "OBMXUVJe8fTkR6yS"
]
```

```
[
  {
    "content": "Lilly (Copy) takes a long rest and recovers 1 hit die.",
    "flavor": "Long Rest (8 hours, new day)",
    "type": "rest",
    "rolls": [],
    "speaker": {
      "scene": "fAZAbCtRPh5CAWRV",
      "token": "yavuUdb2JaP42Dv4",
      "actor": "0u44NxNEYVi269MW",
      "alias": "Lilly (Copy)"
    },
    "system": {
      "activations": [],
      "deltas": {
        "actor": [
          {
            "keyPath": "system.spells.spell1.value",
            "delta": 2
          }
        ],
        "item": {
          "64clgz4yZAAwKQI1": [
            {
              "keyPath": "system.hd.spent",
              "delta": -1
            }
          ]
        }
      },
      "request": null,
      "type": "long"
    },
    "whisper": [],
    "blind": false,
    "_id": "szHCsgSTchkF0Y1B",
    "style": 0,
    "author": "OBMXUVJe8fTkR6yS",
    "timestamp": 1756761969922,
    "sound": null,
    "emote": false,
    "flags": {
      "core": {
        "canPopout": true
      }
    },
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "exportSource": null,
      "coreVersion": "13.347",
      "systemId": "dnd5e",
      "systemVersion": "5.1.1",
      "createdTime": 1756761969934,
      "modifiedTime": 1756761969934,
      "lastModifiedBy": "OBMXUVJe8fTkR6yS"
    }
  },
  {
    "action": "create",
    "modifiedTime": 1756761969934,
    "render": true,
    "renderSheet": false,
    "parent": null
  },
  "OBMXUVJe8fTkR6yS"
]

```

```
 /**
     * A hook event that fires to convert the provided spellcasting progression into spell slots.
     * The actual hook names include the spellcasting type (e.g. `dnd5e.prepareLeveledSlots`).
     * @param {object} spells        The `data.spells` object within actor's data. *Will be mutated.*
     * @param {Actor5e|void} actor   Actor for whom the data is being prepared, if any.
     * @param {object} progression   Spellcasting progression data.
     * @returns {boolean}            Explicitly return false to prevent default preparation from being performed.
     * @function dnd5e.prepareSpellcastingSlots
     * @memberof hookEvents
     */
    const allowed = Hooks.call(`dnd5e.prepare${type.capitalize()}Slots`, spells, actor, progression);
  {
    "spell1": {
      "value": 0,
      "label": "1st Level",
      "level": 1,
      "max": 2,
      "type": "spell"
    },
    "spell2": {
      "value": 0,
      "label": "2nd Level",
      "level": 2,
      "max": 0,
      "type": "spell"
    },
    "spell3": {
      "value": 0,
      "label": "3rd Level",
      "level": 3,
      "max": 0,
      "type": "spell"
    },
    "spell4": {
      "value": 0,
      "label": "4th Level",
      "level": 4,
      "max": 0,
      "type": "spell"
    },
    "spell5": {
      "value": 0,
      "label": "5th Level",
      "level": 5,
      "max": 0,
      "type": "spell"
    },
    "spell6": {
      "value": 0,
      "label": "6th Level",
      "level": 6,
      "max": 0,
      "type": "spell"
    },
    "spell7": {
      "value": 0,
      "label": "7th Level",
      "level": 7,
      "max": 0,
      "type": "spell"
    },
    "spell8": {
      "value": 0,
      "label": "8th Level",
      "level": 8,
      "max": 0,
      "type": "spell"
    },
    "spell9": {
      "value": 0,
      "label": "9th Level",
      "level": 9,
      "max": 0,
      "type": "spell"
    },
    "pact": {
      "value": 0,
      "type": "pact",
      "label": "Pact Magic"
    },
    "apothecary": {
      "value": 0,
      "type": "apothecary",
      "label": "Apothecary Magic"
    }
  }
```

chat messages
```
[
  {
    "sound": "sounds/dice.wav",
    "flags": {
      "dnd5e": {
        "messageType": "roll",
        "roll": {
          "ability": "con",
          "type": "save"
        }
      },
      "core": {
        "canPopout": true
      }
    },
    "flavor": "Constitution Saving Throw",
    "speaker": {
      "scene": "fAZAbCtRPh5CAWRV",
      "token": "yavuUdb2JaP42Dv4",
      "actor": "0u44NxNEYVi269MW",
      "alias": "Lilly (Copy)"
    },
    "rolls": [
      "{\"class\":\"D20Roll\",\"options\":{\"advantage\":false,\"disadvantage\":false,\"maximum\":null,\"minimum\":null,\"advantageMode\":0,\"criticalSuccess\":20,\"criticalFailure\":1,\"target\":10,\"configured\":true,\"rollType\":\"save\"},\"dice\":[],\"formula\":\"1d20 + 2\",\"terms\":[{\"class\":\"Die\",\"options\":{\"flavor\":null,\"elvenAccuracy\":false,\"halflingLucky\":false,\"advantageMode\":0,\"criticalSuccess\":20,\"criticalFailure\":1,\"target\":10},\"evaluated\":true,\"number\":1,\"faces\":20,\"modifiers\":[],\"results\":[{\"result\":9,\"active\":true}]},{\"class\":\"OperatorTerm\",\"options\":{},\"evaluated\":true,\"operator\":\"+\"},{\"class\":\"NumericTerm\",\"options\":{\"flavor\":null},\"evaluated\":true,\"number\":2}],\"total\":11,\"evaluated\":true}"
    ],
    "_id": "0NSZmwIuVPCLLjCj",
    "type": "base",
    "system": {},
    "style": 0,
    "author": "OBMXUVJe8fTkR6yS",
    "timestamp": 1756759992628,
    "content": "",
    "whisper": [],
    "blind": false,
    "emote": false,
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "exportSource": null,
      "coreVersion": "13.347",
      "systemId": "dnd5e",
      "systemVersion": "5.1.1",
      "createdTime": 1756759992640,
      "modifiedTime": 1756759992640,
      "lastModifiedBy": "OBMXUVJe8fTkR6yS"
    }
  },
  {}
]

[
  {
    "sound": "sounds/dice.wav",
    "flavor": "Rock Slam - Attack Roll",
    "flags": {
      "dnd5e": {
        "activity": {
          "type": "attack",
          "id": "4PbV1idNiIkSL49k",
          "uuid": "Actor.0u44NxNEYVi269MW.Item.bimAkIRlm77ziUFN.Activity.4PbV1idNiIkSL49k"
        },
        "item": {
          "type": "spell",
          "id": "bimAkIRlm77ziUFN",
          "uuid": "Actor.0u44NxNEYVi269MW.Item.bimAkIRlm77ziUFN"
        },
        "targets": [],
        "messageType": "roll",
        "roll": {
          "type": "attack"
        },
        "originatingMessage": "13XxZkA01whpdVKg"
      },
      "core": {
        "canPopout": true
      }
    },
    "speaker": {
      "scene": "fAZAbCtRPh5CAWRV",
      "token": "yavuUdb2JaP42Dv4",
      "actor": "0u44NxNEYVi269MW",
      "alias": "Lilly (Copy)"
    },
    "rolls": [
      "{\"class\":\"D20Roll\",\"options\":{\"criticalSuccess\":20,\"advantageMode\":0,\"criticalFailure\":1,\"configured\":true,\"rollType\":\"attack\"},\"dice\":[],\"formula\":\"1d20 + 4 + 2\",\"terms\":[{\"class\":\"Die\",\"options\":{\"flavor\":null,\"elvenAccuracy\":false,\"halflingLucky\":false,\"advantageMode\":0,\"criticalSuccess\":20,\"criticalFailure\":1},\"evaluated\":true,\"number\":1,\"faces\":20,\"modifiers\":[],\"results\":[{\"result\":5,\"active\":true}]},{\"class\":\"OperatorTerm\",\"options\":{},\"evaluated\":true,\"operator\":\"+\"},{\"class\":\"NumericTerm\",\"options\":{\"flavor\":null},\"evaluated\":true,\"number\":4},{\"class\":\"OperatorTerm\",\"options\":{},\"evaluated\":true,\"operator\":\"+\"},{\"class\":\"NumericTerm\",\"options\":{\"flavor\":null},\"evaluated\":true,\"number\":2}],\"total\":11,\"evaluated\":true}"
    ],
    "_id": "62mljWIAeMPfLApp",
    "type": "base",
    "system": {},
    "style": 0,
    "author": "OBMXUVJe8fTkR6yS",
    "timestamp": 1756761383730,
    "content": "",
    "whisper": [],
    "blind": false,
    "emote": false,
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "exportSource": null,
      "coreVersion": "13.347",
      "systemId": "dnd5e",
      "systemVersion": "5.1.1",
      "createdTime": 1756761383743,
      "modifiedTime": 1756761383743,
      "lastModifiedBy": "OBMXUVJe8fTkR6yS"
    }
  },
  {}
]

[
  {
    "sound": "sounds/dice.wav",
    "flags": {
      "dnd5e": {
        "messageType": "roll",
        "roll": {
          "ability": "cha",
          "type": "save"
        }
      },
      "core": {
        "canPopout": true
      }
    },
    "flavor": "Charisma Saving Throw",
    "speaker": {
      "scene": "fAZAbCtRPh5CAWRV",
      "token": "yavuUdb2JaP42Dv4",
      "actor": "0u44NxNEYVi269MW",
      "alias": "Lilly (Copy)"
    },
    "rolls": [
      "{\"class\":\"D20Roll\",\"options\":{\"advantage\":false,\"disadvantage\":false,\"maximum\":null,\"minimum\":null,\"advantageMode\":0,\"criticalSuccess\":20,\"criticalFailure\":1,\"configured\":true,\"rollType\":\"save\"},\"dice\":[],\"formula\":\"1d20 - 3 + 2 + 1\",\"terms\":[{\"class\":\"Die\",\"options\":{\"flavor\":null,\"elvenAccuracy\":false,\"halflingLucky\":false,\"advantageMode\":0,\"criticalSuccess\":20,\"criticalFailure\":1},\"evaluated\":true,\"number\":1,\"faces\":20,\"modifiers\":[],\"results\":[{\"result\":15,\"active\":true}]},{\"class\":\"OperatorTerm\",\"options\":{},\"evaluated\":true,\"operator\":\"-\"},{\"class\":\"NumericTerm\",\"options\":{\"flavor\":null},\"evaluated\":true,\"number\":3},{\"class\":\"OperatorTerm\",\"options\":{},\"evaluated\":true,\"operator\":\"+\"},{\"class\":\"NumericTerm\",\"options\":{\"flavor\":null},\"evaluated\":true,\"number\":2},{\"class\":\"OperatorTerm\",\"options\":{},\"evaluated\":true,\"operator\":\"+\"},{\"class\":\"NumericTerm\",\"options\":{\"flavor\":null},\"evaluated\":true,\"number\":1}],\"total\":15,\"evaluated\":true}"
    ],
    "_id": "k2fsXe1ElhRXbOw5",
    "type": "base",
    "system": {},
    "style": 0,
    "author": "OBMXUVJe8fTkR6yS",
    "timestamp": 1756758190779,
    "content": "",
    "whisper": [],
    "blind": false,
    "emote": false,
    "_stats": {
      "compendiumSource": null,
      "duplicateSource": null,
      "exportSource": null,
      "coreVersion": "13.347",
      "systemId": "dnd5e",
      "systemVersion": "5.1.1",
      "createdTime": 1756758190792,
      "modifiedTime": 1756758190792,
      "lastModifiedBy": "OBMXUVJe8fTkR6yS"
    }
  },
  {}
]

```
