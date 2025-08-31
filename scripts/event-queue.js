/**
 * Event Batching Queue System
 * Queues filtered events and sends them in batches every 60 seconds
 */

class EventQueue {
  constructor() {
    this.events = [];
    this.batchInterval = null;
    this.BATCH_INTERVAL_MS = 60000; // 60 seconds
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
   * Add an event to the queue
   * @param {Object} eventData - Filtered event data
   */
  addEvent(eventData) {
    if (!eventData) return;
    
    this.events.push(eventData);
    
    // Log in debug mode only
    if (CONFIG.debug?.hooks) {
      console.log("Foundry Event Hooker | Event queued:", eventData.event);
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

    // If no API URL configured, log the events instead
    if (!apiEndpoint || apiEndpoint.trim() === "") {
      console.group(`🎯 Foundry Event Hooker | LOGGING MODE - ${eventCount} events (no API endpoint set)`);
      batchData.events.forEach((event, index) => {
        console.log(`Event ${index + 1}:`, event);
      });
      console.groupEnd();
      return;
    }

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
        console.log(`Foundry Event Hooker | Successfully sent ${eventCount} events`);
      } else {
        console.warn(`Foundry Event Hooker | API responded with status: ${response.status}`);
      }

    } catch (error) {
      // Silent failure - just log in debug mode
      if (CONFIG.debug?.hooks) {
        console.warn("Foundry Event Hooker | Failed to send batch:", error);
      }
    }
  }

  /**
   * Get current queue status
   * @returns {Object} Queue status information
   */
  getStatus() {
    return {
      queuedEvents: this.events.length,
      isRunning: this.batchInterval !== null,
      batchIntervalMs: this.BATCH_INTERVAL_MS
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