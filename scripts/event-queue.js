/**
 * Event Batching Queue System
 * Queues filtered events and sends them in batches every 60 seconds
 * When no API endpoint is configured, stores events to localStorage per day
 */

class EventQueue {
  constructor() {
    this.events = [];
    this.batchInterval = null;
    this.BATCH_INTERVAL_MS = 60000; // 60 seconds
    this.STORAGE_KEY_PREFIX = 'foundry-event-hooker-';
  }

  /**
   * Start the batching timer
   */
  start() {
    console.log("Foundry Event Hooker | Starting event queue with 60s batching");

    this.batchInterval = setInterval(() => {
      this.sendBatch();
    }, this.BATCH_INTERVAL_MS);
  }

  /**
   * Stop the batching timer
   */
  stop() {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
      console.log("Foundry Event Hooker | Event queue stopped");
    }
  }

  /**
   * Get today's date as a string for localStorage key
   * @returns {string} Date in YYYY-MM-DD format
   */
  getTodayKey() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${this.STORAGE_KEY_PREFIX}${year}-${month}-${day}`;
  }

  /**
   * Store event to localStorage for the current day
   * @param {Object} eventData - Filtered event data
   */
  storeEventLocally(eventData) {
    try {
      const todayKey = this.getTodayKey();
      const existingData = localStorage.getItem(todayKey);
      let dayEvents = [];

      if (existingData) {
        dayEvents = JSON.parse(existingData);
      }

      // Add timestamp when storing locally
      const eventWithTimestamp = {
        ...eventData,
        storedAt: new Date().toISOString()
      };

      dayEvents.push(eventWithTimestamp);
      localStorage.setItem(todayKey, JSON.stringify(dayEvents));

      // Log the storage action
      console.log(`📁 Foundry Event Hooker | Stored event locally (${dayEvents.length} events today):`, eventData.event);
    } catch (error) {
      console.warn("Foundry Event Hooker | Failed to store event locally:", error);
    }
  }

  /**
   * Add an event to the queue
   * @param {Object} eventData - Filtered event data
   */
  addEvent(eventData) {
    if (!eventData) return;

    // Get API endpoint URL from settings to determine storage behavior
    const apiEndpoint = game.settings.get("foundry-event-hooker", "apiEndpoint");
    const hasApiEndpoint = apiEndpoint && apiEndpoint.trim() !== "";

    // Always log when event comes in (not just when sent out)
    console.log("🎯 Foundry Event Hooker | Event received:", eventData.event, eventData);

    if (!hasApiEndpoint) {
      // Store to localStorage if no API endpoint is configured
      this.storeEventLocally(eventData);
    } else {
      // Add to queue for API sending if endpoint is configured
      this.events.push(eventData);

      // Log in debug mode only for API mode
      if (CONFIG.debug?.hooks) {
        console.log("Foundry Event Hooker | Event queued for API:", eventData.event);
      }
    }
  }

  /**
   * Send all queued events in a batch
   */
  async sendBatch() {
    // Skip if no events queued
    if (this.events.length === 0) {
      return;
    }

    // Get API endpoint URL from settings
    const apiEndpoint = game.settings.get("foundry-event-hooker", "apiEndpoint");

    // Prepare batch payload
    const batchData = {
      events: [...this.events] // Clone the events array
    };

    // Clear the queue immediately (before sending)
    const eventCount = this.events.length;
    this.events = [];

    try {
      console.log(`Foundry Event Hooker | Sending batch of ${eventCount} events to ${apiEndpoint}`);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(batchData)
      });

      if (response.ok) {
        console.log(`✅ Foundry Event Hooker | Successfully sent ${eventCount} events`);
      } else {
        console.warn(`❌ Foundry Event Hooker | API responded with status: ${response.status}`);
      }

    } catch (error) {
      // Silent failure - just log in debug mode
      if (CONFIG.debug?.hooks) {
        console.warn("Foundry Event Hooker | Failed to send batch:", error);
      }
    }
  }

  /**
   * Get stored events for a specific date
   * @param {string} dateKey - Date key (YYYY-MM-DD format)
   * @returns {Array} Array of stored events for that date
   */
  getStoredEvents(dateKey = null) {
    try {
      const key = dateKey ? `${this.STORAGE_KEY_PREFIX}${dateKey}` : this.getTodayKey();
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.warn("Foundry Event Hooker | Failed to retrieve stored events:", error);
      return [];
    }
  }

  /**
   * Get all stored event dates
   * @returns {Array} Array of date strings that have stored events
   */
  getStoredEventDates() {
    const dates = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
        const date = key.replace(this.STORAGE_KEY_PREFIX, '');
        dates.push(date);
      }
    }
    return dates.sort();
  }

  /**
   * Clear stored events for a specific date or all dates
   * @param {string} dateKey - Optional date key (YYYY-MM-DD format)
   */
  clearStoredEvents(dateKey = null) {
    try {
      if (dateKey) {
        const key = `${this.STORAGE_KEY_PREFIX}${dateKey}`;
        localStorage.removeItem(key);
        console.log(`Foundry Event Hooker | Cleared stored events for ${dateKey}`);
      } else {
        // Clear all stored events
        const dates = this.getStoredEventDates();
        dates.forEach(date => {
          localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}${date}`);
        });
        console.log(`Foundry Event Hooker | Cleared all stored events (${dates.length} days)`);
      }
    } catch (error) {
      console.warn("Foundry Event Hooker | Failed to clear stored events:", error);
    }
  }

  /**
   * Export stored events for a date as JSON
   * @param {string} dateKey - Date key (YYYY-MM-DD format)
   * @returns {string} JSON string of events
   */
  exportStoredEvents(dateKey = null) {
    const events = this.getStoredEvents(dateKey);
    const exportData = {
      date: dateKey || this.getTodayKey().replace(this.STORAGE_KEY_PREFIX, ''),
      eventCount: events.length,
      events: events
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Get current queue status
   * @returns {Object} Queue status information
   */
  getStatus() {
    const apiEndpoint = game.settings.get("foundry-event-hooker", "apiEndpoint");
    const hasApiEndpoint = apiEndpoint && apiEndpoint.trim() !== "";
    const todayEvents = this.getStoredEvents();

    return {
      mode: hasApiEndpoint ? 'API' : 'localStorage',
      queuedEvents: this.events.length,
      storedEventsToday: todayEvents.length,
      storedEventDates: this.getStoredEventDates(),
      isRunning: this.batchInterval !== null,
      batchIntervalMs: this.BATCH_INTERVAL_MS,
      apiEndpoint: hasApiEndpoint ? apiEndpoint : 'Not configured'
    };
  }
}

// Global event queue instance
let globalEventQueue = null;

/**
 * Start the event queue system
 */
export function startEventQueue() {
  if (globalEventQueue) {
    globalEventQueue.stop();
  }

  globalEventQueue = new EventQueue();
  globalEventQueue.start();

  // Make it accessible globally for the main module
  window.eventQueue = globalEventQueue;
}

/**
 * Stop the event queue system
 */
export function stopEventQueue() {
  if (globalEventQueue) {
    globalEventQueue.stop();
    globalEventQueue = null;
    window.eventQueue = null;
  }
}

/**
 * Get the current event queue instance
 * @returns {EventQueue|null} Current event queue
 */
export function getEventQueue() {
  return globalEventQueue;
}
