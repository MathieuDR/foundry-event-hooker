# FoundryVTT Event Hooker - Development Playbook

This playbook covers the essential workflows for maintaining and extending the FoundryVTT Event Hooker module.

## 🚀 How to Release

### 1. Version Bump
```bash
# Edit module.json to bump version
# Change: "version": "1.0.2" → "1.0.3"
```

### 2. Create Release Package
```bash
# Create clean ZIP with only essential files
zip -r foundry-event-hooker.zip module.json scripts/ lang/ LICENSE

# Stage and commit changes
git add module.json scripts/
git commit -m "Your commit message with improvements

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push
```

### 3. Create GitHub Release
```bash
# Create release with both ZIP and module.json
gh release create v1.0.3 foundry-event-hooker.zip module.json \
  --title "v1.0.3 - Release Title" \
  --notes "## Release Notes

### New Features
- Feature description

### Bug Fixes
- Bug fix description

### Installation
Use this manifest URL in FoundryVTT's module installer:
\`\`\`
https://github.com/MathieuDR/foundry-event-hooker/releases/latest/download/module.json
\`\`\`"
```

### 4. Installation URL
Users install with: `https://github.com/MathieuDR/foundry-event-hooker/releases/latest/download/module.json`

---

## 🗺️ How to Map Events

### Testing Event Data

1. **Enable Logging Mode**
   - Clear API endpoint in module settings (leave empty)
   - This logs events to console instead of sending to API

2. **Enable Debug Mode**
   ```javascript
   // In FoundryVTT console
   CONFIG.debug.hooks = true
   ```

3. **Trigger Events**
   - Perform skill rolls, ability checks, etc.
   - Check browser console for event data

### Understanding Event Structure

Events follow this structure:
```json
{
  "event": "dnd5e.rollSkill",
  "timestamp": 1756684675516,
  "world": {
    "id": "my-campaign",
    "title": "Curse of Drakkenheim", 
    "system": "dnd5e",
    "systemVersion": "5.1.1"
  },
  "actor": {
    "id": "character-id",
    "name": "Character Name",
    "type": "character",
    "img": "path/to/image.png"
  },
  "roll": {
    "total": 13,
    "formula": "1d20 + 4 + 2",
    "dice": [
      {
        "faces": 20,
        "results": [7]
      }
    ]
  },
  "context": {
    "skill": "per"
  }
}
```

### Customizing Data Extraction

Edit `scripts/data-filter.js`:

#### Actor Data (`extractActorBasics()`)
```javascript
return {
  id: actor._id || actor.id,
  name: actor.name,
  type: actor.type,
  img: actor.img,
  // Add custom fields here
  level: actor.system?.details?.level,
  class: actor.system?.details?.class
};
```

#### Roll Data (`extractRollData()`)
```javascript
const rollData = {
  total: roll.total,
  formula: roll.formula,
  dice: roll.dice?.map(die => ({
    faces: die.faces,
    results: die.results?.map(r => r.result) || []
  })),
  // Add custom roll data
  advantage: roll.options?.advantageMode,
  criticalSuccess: roll.options?.criticalSuccess
};
```

#### Context Data (`extractContext()`)
```javascript
case 'dnd5e.rollSkill':
  if (options.skill) context.skill = options.skill;
  // Add more context extraction
  if (options.someOtherField) context.customField = options.someOtherField;
  break;
```

---

## 🎣 How to Add New Hooks

### 1. Find Available Hooks

**In FoundryVTT Console:**
```javascript
// Enable hook debugging to see all hooks firing
CONFIG.debug.hooks = true

// Or list available hooks
Object.keys(Hooks.events)
```

**Reference Documentation:**
- Check `docs/dnd5e_hooks.md` for D&D 5e specific hooks
- FoundryVTT API documentation: https://foundryvtt.com/api/

### 2. Register New Hook

Edit `scripts/main.js`:

```javascript
// Add to SUPPORTED_HOOKS array
const SUPPORTED_HOOKS = [
  'dnd5e.rollSkill',
  'dnd5e.rollAbilityCheck', 
  'dnd5e.rollSavingThrow',
  'dnd5e.rollAttack',
  'dnd5e.rollDamage',
  'dnd5e.rollInitiative',
  'dnd5e.rollDeathSave',
  'dnd5e.applyDamage',
  // Add your new hook here
  'dnd5e.newHookName'
];
```

### 3. Add Data Extraction Logic

Edit `scripts/data-filter.js`:

#### For Roll-based Events
Add to existing cases in `extractEventData()`:
```javascript
case 'dnd5e.rollSkill':
case 'dnd5e.rollAbilityCheck':
case 'dnd5e.rollSavingThrow':
case 'dnd5e.newRollHook':  // Add here
  return extractRollEvent(eventData, args);
```

#### For Custom Event Types
Add new case and extraction function:
```javascript
case 'dnd5e.customEvent':
  return extractCustomEvent(eventData, args);

// Add extraction function
function extractCustomEvent(baseEvent, args) {
  const [customData, options] = args;  // Adjust based on hook args
  
  const eventData = {
    ...baseEvent,
    customField: customData.someProperty,
    context: extractContext(baseEvent.event, options)
  };
  
  return eventData;
}
```

#### Add Context Extraction
```javascript
case 'dnd5e.newHookName':
  if (options.customField) context.customField = options.customField;
  break;
```

### 4. Test New Hook

1. **Enable logging mode** (clear API endpoint)
2. **Enable debug hooks**: `CONFIG.debug.hooks = true`
3. **Trigger the event** in FoundryVTT
4. **Check console** for raw data and processed events
5. **Refine extraction logic** based on actual data structure

### 5. Hook Argument Patterns

Different hooks pass different arguments:

```javascript
// Roll hooks: [roll, context]
'dnd5e.rollSkill' → [D20Roll, {skill: "per", subject: ActorDocument}]

// Damage hooks: [actor, damage, options] 
'dnd5e.applyDamage' → [ActorDocument, 5, {damageType: "fire"}]

// Generic hooks: varies
'updateActor' → [ActorDocument, changes, options, userId]
```

**Always check raw data first** with `CONFIG.debug.hooks = true` to understand the structure!

---

## 🧪 Development Tips

### Local Testing Workflow

1. **Develop in FoundryVTT modules directory**
   ```
   FoundryVTT/Data/modules/foundry-event-hooker/
   ```

2. **Use logging mode for testing**
   - Clear API endpoint setting
   - Events log to console instead of sending HTTP requests

3. **Enable comprehensive debugging**
   ```javascript
   CONFIG.debug.hooks = true  // See all hook data
   CONFIG.debug.dice = true   // See dice roll details
   ```

4. **Hot reload during development**
   - Disable/enable module in FoundryVTT to reload changes
   - Or use F5 to refresh browser (loses game state)

### Debugging Event Issues

1. **Check raw hook data**
   ```javascript
   CONFIG.debug.hooks = true
   // Look for: "🔍 Foundry Event Hooker | Raw event data"
   ```

2. **Verify hook is firing**
   - Look for hook name in console logs
   - Confirm event triggers the expected action

3. **Check extraction logic**
   - Add `console.log()` statements in `extractEventData()`
   - Verify argument destructuring matches actual data structure

4. **Test with minimal data**
   - Start with basic event structure
   - Add complexity gradually

### Performance Considerations

- **Batch events every 60 seconds** (configurable in `EventQueue`)
- **Filter events before queueing** to reduce memory usage
- **Avoid heavy processing** in hook handlers (they fire frequently)
- **Use debug mode sparingly** in production (performance impact)

---

## 📁 File Structure Reference

```
foundry-event-hooker/
├── module.json           # Module manifest and metadata
├── scripts/
│   ├── main.js          # Hook registration and module initialization
│   ├── data-filter.js   # Event data extraction and filtering logic
│   ├── event-queue.js   # Batching and API sending logic
│   └── settings.js      # Module configuration settings
├── lang/
│   └── en.json          # Localization strings
├── data/                # Test data (gitignored)
├── docs/                # FoundryVTT development reference docs
├── LICENSE              # Module license
├── CLAUDE.md           # Claude Code project instructions
└── PLAYBOOK.md         # This playbook
```

Each script file has a specific responsibility:
- **main.js**: Entry point, hook registration
- **data-filter.js**: Transforms raw hook data into clean event objects  
- **event-queue.js**: Batches events and handles API communication
- **settings.js**: Manages user configuration options