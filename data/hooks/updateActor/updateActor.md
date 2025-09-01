This is a general, core hook.
Existing out of 4 objects 

[Document, change, option, userId]

I reckon we can filter the document on only that was has changed, it has the same keys. Then send that together with timestap and the user. I'm not sure what the options is exactly.

It is important to note, that some effects, might be shown here to, for example, when we have the dnd5e heal hook, it will also call an updaeActor hook, as it updates our actor.

Should we only care about this update actor, or should we also save the healing one? Nobody knows

Example options

```
{
    "action": "update",
    "modifiedTime": 1756759694280,
    "diff": true,
    "recursive": true,
    "render": true,
    "dnd5e": {
      "hp": {
        "value": 8,
        "max": 8,
        "temp": null,
        "tempmax": 0,
        "bonuses": {
          "level": "",
          "overall": ""
        },
        "effectiveMax": 8,
        "damage": 0,
        "pct": 100
      }
    },
    "drakkenheim": {
      "previousContamination": 0
    },
    "parent": null
  }
```

Example changes

Adding a spell slot
```
{
    "system": {
      "spells": {
        "spell1": {
          "value": 1
        }
      }
    },
    "_stats": {
      "modifiedTime": 1756759694280
    },
    "_id": "0u44NxNEYVi269MW"
  }
```

Temp HP added
```
{
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
  }
```

Contamination (from Drakkenheim, in the option it says previousContamination)
```
{
    "flags": {
      "drakkenheim": {
        "contamination": 4
      }
    },
    "_stats": {
      "modifiedTime": 1756759483571
    },
    "_id": "0u44NxNEYVi269MW"
  }
```

Failed death save
```
{
    "system": {
      "attributes": {
        "death": {
          "failure": 1
        }
      }
    },
    "_stats": {
      "modifiedTime": 1756758475340
    },
    "_id": "0u44NxNEYVi269MW"
  }
```

For a success it juts death.success: 1. No rocket science.

Inspiration

```
{
    "system": {
      "attributes": {
        "inspiration": false
      }
    },
    "_stats": {
      "modifiedTime": 1756756710837
    },
    "_id": "aZBm2Mv1F2OBUISK"
  }
```

Healing from a hitdie (This doesn't say where we got healed from. This could either be in the dnd5e chat message or maybe in the healing Actor hook?)
```
{
    "system": {
      "attributes": {
        "hp": {
          "value": 6
        }
      }
    },
    "_stats": {
      "modifiedTime": 1756761589808
    },
    "_id": "0u44NxNEYVi269MW"
  }
```

Temp, max HP update
```
{
    "system": {
      "attributes": {
        "hp": {
          "bonuses": {
            "overall": "",
            "level": ""
          },
          "tempmax": 2
        }
      }
    },
    "_stats": {
      "modifiedTime": 1756757092833
    },
    "_id": "aZBm2Mv1F2OBUISK"
  }
```
