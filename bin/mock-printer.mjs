import { createServer } from 'node:http';
import { createHash } from 'node:crypto';

const PORT = 9999;

// We use the raw Node.js HTTP server to handle the WebSocket upgrade manually,
// ensuring this project remains 100% dependency-free for the portfolio.
const server = createServer((req, res) => {
  res.writeHead(400, { 'Content-Type': 'text/plain' });
  res.end('WebSocket connections only');
});

server.on('upgrade', (req, socket) => {
  const key = req.headers['sec-websocket-key'];
  if (!key) return socket.end();

  // Standard WebSocket handshake magic string (RFC 6455)
  const hash = createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${hash}\r\n\r\n`
  );

  // When the client sends the "get" command, reply with fake telemetry
  socket.on('data', () => {
    
    // Simulate a printer that is currently busy printing
    const fakeState = {
      deviceState: "print",
      printFileName: "mock_simulation.gcode",
      printProgress: 42,
      targetNozzleTemp: 210,
      targetBedTemp: 60
    };

    const payload = JSON.stringify(fakeState);
    const length = Buffer.byteLength(payload);
    
    // Construct an unmasked WebSocket text frame
    let frame;
    if (length < 126) {
      frame = Buffer.alloc(2 + length);
      frame[0] = 0x81; // FIN = 1, Opcode = 1 (Text)
      frame[1] = length;
      frame.write(payload, 2);
    } else {
      frame = Buffer.alloc(4 + length);
      frame[0] = 0x81;
      frame[1] = 126;
      frame.writeUInt16BE(length, 2);
      frame.write(payload, 4);
    }

    socket.write(frame);
  });
});

server.listen(PORT, () => {
  console.log(`[Mock Printer] Simulating Creality hardware on ws://127.0.0.1:${PORT}`);
  console.log(`Test it with: node bin/farm-status.mjs 127.0.0.1`);
});
