import { probe, judge } from "./probe.mjs";

// Central memory store: Holds the latest status of every printer.
export const farmState = new Map();

/**
 * Starts a background polling loop to continuously sweep the network.
 * 
 * @param {Array<{id: string, ip: string}>} printers 
 * @param {number} intervalMs - How often to poll in milliseconds (default: 5000)
 */
export function startFarmPolling(printers, intervalMs = 5000) {
  
  async function poll() {
    // Dispatch concurrent network probes
    const rawResults = await Promise.all(printers.map(p => probe(p)));
    
    // Evaluate state and update the central memory store
    for (const raw of rawResults) {
      const final = judge(raw);
      farmState.set(final.id, final);
    }
  }

  // Run the first sweep immediately
  poll();
  
  // Schedule all future sweeps
  setInterval(poll, intervalMs);
}
