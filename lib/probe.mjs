// PrinterFarm — shared printer probing logic.
//
// No dependencies — Node 22+ global WebSocket only.

/**
 * Probe a single printer to check network connectivity.
 * Opens a WebSocket connection to port 9999 and resolves when connected.
 * 
 * @param {{ id: string, ip: string }} printer
 * @param {number} [timeoutMs=4000]
 * @returns {Promise<{ id, ip, status, job }>}
 */
export function probe(printer, timeoutMs = 4000) {
  return new Promise((resolve) => {
    let settled = false, ws;

    const done = (status, job) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { ws?.close(); } catch {}
      resolve({ ...printer, status, job });
    };

    const timer = setTimeout(() => done("unreachable", "timeout"), timeoutMs);

    try {
      ws = new WebSocket(`ws://${printer.ip}:9999/`);
    } catch {
      return done("unreachable", "socket error");
    }

    ws.addEventListener("open", () => {
      // Socket opened successfully! We will request telemetry in the next commit.
      done("online", "connected");
    });

    ws.addEventListener("error", () => {
      done("unreachable", "connection failed");
    });
  });
}
