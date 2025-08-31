# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository is for developing a **Foundry VTT Module** that hooks into events from FoundryVTT and sends them to an API. The project is currently in its initial development phase.

## Project Type

This is a **FoundryVTT Module** (not a System or World), designed to extend Foundry Virtual Tabletop functionality by:
- Hooking into FoundryVTT events using the Hooks framework
- Processing event data
- Sending event data to external APIs

## Development Setup

### Initial Module Structure (When Implementing)

The module should follow standard FoundryVTT module structure:
```
foundry-event-hooker/
├── module.json           # Module manifest (required)
├── scripts/             # JavaScript/ES6 modules
├── templates/           # Handlebars templates (if needed)
├── styles/              # CSS stylesheets (if needed)
├── lang/                # Localization files
└── docs/                # Documentation (existing)
```

### Module Manifest (module.json)

Required fields for a FoundryVTT module:
- `id`: "foundry-event-hooker" (must match directory name)
- `title`: Human-readable module name
- `description`: Brief description of functionality
- `version`: Module version number
- `compatibility`: Foundry VTT version compatibility
- `authors`: Author information
- `esmodules` or `scripts`: JavaScript entry points

### JavaScript Development

- Use ES6 modules (`esmodules` in manifest) rather than legacy scripts
- Primary entry point should initialize the module during Foundry's `init` hook
- Use FoundryVTT's Hooks framework for event handling
- Follow JavaScript namespacing best practices to avoid conflicts

### Key FoundryVTT Concepts

#### Hooks Framework
- Use `Hooks.on()` to register event listeners
- Use `Hooks.once()` for initialization events
- Common hooks: `init`, `ready`, `updateActor`, `createChatMessage`, etc.
- Enable hook debugging with `CONFIG.debug.hooks = true`

#### Event Processing
- Events provide data objects that can be processed and transformed
- Consider filtering events before sending to API (performance)
- Handle async operations properly when sending to external APIs

### API Integration Considerations

- Use `fetch()` or similar for HTTP requests to external APIs
- Implement proper error handling for network failures
- Consider rate limiting and batching for high-frequency events
- Add user configuration for API endpoints and authentication

### Configuration and Settings

- Use `game.settings.register()` to create module settings
- Provide UI for users to configure API endpoints, authentication, and event filtering
- Store sensitive data (API keys) securely using Foundry's settings system

### Best Practices

- Test module compatibility with different FoundryVTT versions
- Implement proper error handling and logging
- Use localization for user-facing text
- Follow CSS namespacing (prefix classes with module name)
- Document event hooks and API integration in code comments

### Development Workflow

Since this is a FoundryVTT module:
1. Develop within Foundry's `Data/modules/` directory for testing
2. Use Foundry's developer tools and browser console for debugging
3. Test with actual FoundryVTT instance to ensure compatibility
4. Package for distribution as ZIP file with manifest URL

### Documentation Reference

The `docs/` directory contains official FoundryVTT development documentation for reference:
- `intro_dev.md`: General development introduction
- `module.md`: Module development specifics
- `system_dev.md`: System development (for reference)
- `sytem_data_models.md`: Data models (for reference)
- `subtypes.md`: Custom document subtypes (for reference)

## Current State

The repository currently contains:
- README with basic project description
- Official FoundryVTT documentation in `docs/` directory
- No implementation code yet

## Next Steps for Development

1. Create `module.json` manifest file
2. Set up basic module structure with entry point JavaScript file
3. Implement event hook listeners
4. Add API integration functionality
5. Create user configuration interface
6. Add proper error handling and logging
7. Test with FoundryVTT instance