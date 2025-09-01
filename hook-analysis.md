# FoundryVTT Hook Data Analysis

## Overview
This analysis examines all JSON hook data files in `data/hooks/` to identify patterns, repeated structures, and properties that could be safely dropped for efficient API transmission.

## Hook Categories and Patterns

### 1. Actor-Related Hooks

#### `updateActor` (9 files)
- **Files**: addSpellSlot, addTempHp, contamination, failedDeathSave, inspirationAdded, inspiration, postHitDie, successDeathSave, updateTempMax
- **Common Structure**: All have identical property sets
- **Properties**: `["_id","_stats","effects","flags","folder","img","items","name","ownership","prototypeToken","sort","system","type"]`

#### `dnd5e.damageActor` & `dnd5e.healActor` (2 files)
- **Files**: dnd5e.damageActor, dnd5e.healActor
- **Structure**: Same as updateActor
- **Properties**: `["_id","_stats","effects","flags","folder","img","items","name","ownership","prototypeToken","sort","system","type"]`

#### `dnd5e.calculateDamage*` (3 files)
- **Files**: calculateDamage, calculateDamageMace, calculateDmgspell
- **Structure**: Same as updateActor + additional damage calculation data
- **Properties**: `["_id","_stats","effects","flags","folder","img","items","name","ownership","prototypeToken","sort","system","type"]`

### 2. Active Effect Hooks

#### `createActiveEffect` & `deleteActiveEffect` (2 files)
- **Files**: createActiveEffect, deleteActiveEffect
- **Structure**: Identical properties
- **Properties**: `["_id","_stats","changes","description","disabled","duration","flags","img","name","origin","sort","statuses","system","tint","transfer","type"]`

#### `dnd5e.createActiveEffect` (2 files)
- **Files**: concentrateSpell, lvl2
- **Structure**: Same as createActiveEffect
- **Properties**: `["_id","_stats","changes","description","disabled","duration","flags","img","name","origin","sort","statuses","system","tint","transfer","type"]`

### 3. Chat Message Hooks

#### `createChatMessage` (2 files)
- **Files**: longrest, shortrest
- **Structure**: Standard chat message structure
- **Properties**: `["_id","_stats","author","blind","content","emote","flags","flavor","rolls","sound","speaker","style","system","timestamp","type","whisper"]`

#### `dnd5e.renderChatMessage` (17 files)
- **Files**: abilityCheck, attack, chatAsMe, chatMessage, concSave, hitdie, randomroll, saveWithProfAndCustomValue, savingthrow, skillCheck, skillCheckAdv, skillCheckProficincy, spell, spellDmg, weapon, weapon2
- **Structure**: Most are arrays with chat message as first element
- **Base Properties**: `["_id","_stats","author","blind","content","emote","flags","flavor","rolls","sound","speaker","style","system","timestamp","type","whisper"]`
- **Variations**: 
  - `weapon.json` and `hitdie.json` add `"title"` property
  - `skillCheckAdv.json` includes additional metadata object with keys: `["alias","author","canClose","canDelete","cssClass","isWhisper","message","speakerActor","user","whisperTo"]`

### 4. Item Hooks

#### `updateItem` (2 files)
- **Files**: addHitDie, hdUsed
- **Structure**: Similar to Actor but without `items` and `prototypeToken`
- **Properties**: `["_id","_stats","effects","flags","folder","img","name","ownership","sort","system","type"]`

### 5. Spell Slot Hooks

#### `dnd5e.prepareSpellSlots` (3 files)
- **Files**: added, castSpell, used
- **Structure**: Unique - contains spell slot data
- **Properties**: `["apothecary","pact","spell1","spell2","spell3","spell4","spell5","spell6","spell7","spell8","spell9"]`

## Property Frequency Analysis

### Universal Properties (Present in ALL actor/item/effect hooks)
- `_id` - Foundry document ID (essential for tracking)
- `_stats` - Document statistics (likely safe to drop)
- `flags` - Module/system flags (potentially important for functionality)
- `img` - Image path (safe to drop for API)
- `name` - Entity name (essential for identification)
- `system` - System-specific data (essential for game mechanics)
- `type` - Entity type (essential for categorization)

### Frequently Repeated Properties
- `effects` - Present in all actor/item hooks (important for game state)
- `folder` - Present in actor hooks only (organization, safe to drop)
- `ownership` - Present in actor/item hooks (permissions, potentially important)
- `sort` - Present in all hooks (display order, safe to drop)

### Chat-Specific Properties
- `author`, `speaker`, `timestamp` - Essential for chat identification
- `content`, `flavor` - Essential message data
- `rolls` - Dice roll data (essential for game mechanics)
- `blind`, `whisper`, `emote` - Chat behavior flags (important for functionality)
- `sound`, `style` - UI/UX properties (safe to drop)

### Rarely Used Properties
- `title` - Only in some chat messages (contextual)
- `prototypeToken` - Only in actor hooks (token configuration, safe to drop)
- `items` - Only in actor hooks (inventory, important for character state)

## Recommendations for Property Dropping

### Safe to Drop (Low Impact on Functionality)
1. **`_stats`** - Internal Foundry statistics, not needed for external API
2. **`img`** - Image paths, not relevant for most API integrations
3. **`folder`** - Organization/UI property, not game-critical
4. **`sort`** - Display order, not relevant for external systems
5. **`sound`** - Audio UI property, safe to drop
6. **`style`** - CSS styling property, safe to drop
7. **`prototypeToken`** - Token configuration, usually not needed externally

### Context-Dependent (Drop Based on Use Case)
1. **`flags`** - Contains module-specific data; drop if not using specific modules
2. **`ownership`** - Permission data; drop if not tracking user permissions
3. **`effects`** - Active effects; keep if tracking buffs/debuffs, drop otherwise
4. **`items`** - Character inventory; keep for character sheets, drop for simple events

### Essential Properties (Keep)
1. **`_id`** - Essential for entity identification
2. **`name`** - Essential for human-readable identification
3. **`type`** - Essential for categorizing events
4. **`system`** - Contains core game mechanics data
5. **Chat message core**: `author`, `content`, `speaker`, `timestamp`
6. **Roll data**: `rolls` (for dice-related events)

### Hook-Specific Recommendations

#### For `updateActor` events:
- **Drop**: `_stats`, `img`, `folder`, `sort`, `prototypeToken`
- **Keep**: `_id`, `name`, `type`, `system`, `effects` (if tracking status changes)
- **Conditional**: `flags`, `ownership`, `items`

#### For `dnd5e.renderChatMessage` events:
- **Drop**: `_stats`, `sound`, `style`, `emote`
- **Keep**: `_id`, `author`, `content`, `speaker`, `timestamp`, `type`, `rolls`
- **Conditional**: `flags`, `flavor`, `blind`, `whisper`

#### For Active Effect events:
- **Drop**: `_stats`, `img`, `sort`, `tint`
- **Keep**: `_id`, `name`, `type`, `changes`, `duration`, `origin`
- **Conditional**: `flags`, `statuses`

#### For Spell Slot events:
- **Keep all properties** - These are already minimal and spell-specific

## Implementation Strategy

1. **Create property filter profiles** based on hook types
2. **Implement configurable filtering** allowing users to choose between minimal, standard, and full data transmission
3. **Add size-based filtering** to automatically drop large properties when payload exceeds thresholds
4. **Consider compression** for frequently repeated properties like `_stats` and `flags`

## Additional Notes

- The MD files indicate that inspiration data is found in the `system.attributes` path
- Roll results in `dnd5e.renderChatMessage` are nested in `rolls[0].terms[0].results`
- Consider implementing smart filtering that preserves essential data while dropping UI/display properties