# Foundry Event Hooker - Development Guide

This document provides step-by-step instructions for implementing the Foundry Event Hooker module.

## Project Overview

A simple FoundryVTT module that hooks into D&D 5e system events, filters essential data, and sends batched events to a configurable API endpoint every minute.

## Core Requirements

- **Single Setting**: API endpoint URL only
- **Hardcoded Hooks**: Developer-selected events (no user choice)
- **Data Filtering**: Essential data only, strip large objects
- **Batching**: Send events every 60 seconds
- **Simple**: No retry logic, rate limiting, or complex UI

## Implementation Steps

### Step 1: Create Module Manifest

**File**: `module.json`

**Task**: Create the FoundryVTT module manifest with proper D&D 5e system dependency.

**Requirements**:
- Module ID: `foundry-event-hooker`
- Title: `Foundry Event Hooker`
- Compatibility: FoundryVTT v11+
- System requirement: D&D 5e only
- Single ES module entry point

**Expected Output**: Valid `module.json` that Foundry recognizes and loads only for D&D 5e systems.

---

### Step 2: Module Settings Registration

**File**: `scripts/settings.js`

**Task**: Register a single module setting for the API endpoint URL.

**Requirements**:
- Setting key: `apiEndpoint`
- Type: String input field
- Label: "API Endpoint URL"
- Hint: "The URL where events will be sent (e.g., https://your-api.com/events)"
- Default: Empty string
- Scope: World (GM only)

**Expected Output**: Settings menu shows one clean URL input field under module configuration.

---

### Step 3: Main Module Entry Point

**File**: `scripts/main.js`

**Task**: Create module initialization that registers settings and starts the event system.

**Requirements**:
- Initialize on `Hooks.once('init')`
- Register settings from settings.js
- Start event queue system on `Hooks.once('ready')`
- Import and initialize other components

**Expected Output**: Module loads correctly and initializes all systems when a D&D 5e world starts.

---

### Step 4: Hook Registration System

**File**: `scripts/main.js` (extend)

**Task**: Register listeners for the selected D&D 5e hooks.

**Hardcoded Hook List**:
```javascript
const MONITORED_HOOKS = [
  'dnd5e.rollSkill',
  'dnd5e.rollAbilityCheck', 
  'dnd5e.rollSavingThrow',
  'dnd5e.rollAttack',
  'dnd5e.rollDamage', 
  'dnd5e.rollInitiative',
  'dnd5e.rollDeathSave',
  'dnd5e.applyDamage'
];
```

**Requirements**:
- Register `Hooks.on()` for each event in the list
- Pass hook data to event queue for processing
- Handle both V1 and V2 hook variants (rollSkill vs rollSkillV2)

**Expected Output**: Module captures all specified D&D 5e events and queues them for processing.

---

### Step 5: Data Filtering System

**File**: `scripts/data-filter.js`

**Task**: Extract only essential data from hook events, removing bulk data.

**Requirements**:

**Core data to extract**:
- Event name/type
- Timestamp
- Actor info: `_id`, `name`, `type` only
- Roll results: `total`, `formula`, dice results
- Context: skill type, ability type, damage type, etc.

**Data to exclude**:
- Complete `subject` object (too large)
- Actor `system` data (character sheet details)
- Internal Foundry references
- Image paths and descriptions

**Functions needed**:
```javascript
function extractEventData(hookName, ...args) {
  // Main extraction logic
}

function extractActorBasics(actor) {
  // Extract just id, name, type
}

function extractRollData(rolls) {
  // Extract roll totals and dice results
}

function extractContext(hookName, data) {
  // Extract skill type, ability type, etc.
}
```

**Expected Output**: Clean, minimal event objects (~1KB each instead of 267KB+).

---

### Step 6: Event Batching Queue

**File**: `scripts/event-queue.js`

**Task**: Queue filtered events and send them in batches every 60 seconds.

**Requirements**:

**Queue Management**:
- Array to store events temporarily
- Add events as they occur
- Clear queue after sending

**Batch Timer**:
- `setInterval()` every 60,000ms (1 minute)
- Send all queued events in single POST request
- Skip sending if queue is empty
- Skip sending if no API URL configured

**API Request Format**:
```javascript
{
  "events": [
    {
      "event": "dnd5e.rollSkill",
      "timestamp": 1640995200000,
      "actor": { "id": "abc123", "name": "Lilly", "type": "character" },
      "roll": { "total": 15, "formula": "1d20+4", "dice": [...] },
      "context": { "skill": "prc" }
    }
  ]
}
```

**Error Handling**:
- Silently fail if fetch() throws error
- Continue normal operation
- Log errors to console in debug mode only

**Expected Output**: Events are batched and sent via POST every minute to configured URL.

---

### Step 7: Integration Testing

**Task**: Test the complete module workflow.

**Test Scenarios**:
1. **Module Loading**: Verify module loads only in D&D 5e systems
2. **Settings**: Confirm URL setting appears and saves correctly
3. **Hook Capture**: Make skill checks and verify events are captured
4. **Data Filtering**: Verify extracted data is clean and minimal
5. **Batching**: Confirm events are queued and sent every minute
6. **API Format**: Verify POST request format matches specification

**Tools**:
- Browser developer console for debugging
- Network tab to monitor API requests
- `CONFIG.debug.hooks = true` to see hook activity

**Expected Output**: Working module that captures D&D 5e events and sends clean data to API.

---

### Step 8: Documentation and Cleanup

**Files**: `README.md`, code comments

**Task**: Document installation, configuration, and usage.

**Requirements**:
- Installation instructions
- Single setting explanation
- List of monitored events
- API endpoint format specification
- Troubleshooting guide

**Expected Output**: Complete documentation for module users and API developers.

---

## Development Order

Work through steps 1-8 in sequence. Each step builds on the previous one:

1. **Step 1-3**: Foundation (module structure and initialization)
2. **Step 4**: Hook system (event capture)
3. **Step 5**: Data processing (filtering)
4. **Step 6**: API integration (batching and sending)
5. **Step 7**: Testing and validation
6. **Step 8**: Documentation

## Success Criteria

- ✅ Module loads correctly in D&D 5e systems only
- ✅ Single URL setting in module configuration
- ✅ Captures all specified hook events
- ✅ Filters data to essential information only
- ✅ Sends batched events every 60 seconds
- ✅ API requests match specified format
- ✅ No user configuration complexity
- ✅ Handles errors gracefully (silent failure)

## File Structure Reference

```
foundry-event-hooker/
├── module.json              # Step 1: Module manifest
├── scripts/
│   ├── main.js             # Step 3-4: Entry point and hooks
│   ├── settings.js         # Step 2: Settings registration
│   ├── data-filter.js      # Step 5: Data extraction
│   └── event-queue.js      # Step 6: Batching and API
├── lang/
│   └── en.json             # Step 8: Localization
├── README.md               # Step 8: Documentation
└── DEVELOPMENT.md          # This file
```

## Next Action

Start with **Step 1**: Create the `module.json` manifest file.