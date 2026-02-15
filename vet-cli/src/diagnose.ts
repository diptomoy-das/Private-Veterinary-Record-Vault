import { WebSocket } from 'ws';
import http from 'http';

// 1. Define the targets we want to test
const targets = [
  { name: 'Node (IPv4)', url: 'http://127.0.0.1:9944/health' },
  { name: 'Node (Localhost)', url: 'http://localhost:9944/health' },
  { name: 'Indexer (IPv4)', url: 'http://127.0.0.1:8088/api/v3/graphql' },
  { name: 'Indexer (Localhost)', url: 'http://localhost:8088/api/v3/graphql' },
];

const checkHttp = (name: string, url: string) => {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      console.log(`[PASS] ${name} is reachable (Status: ${res.statusCode})`);
      resolve(true);
    });
    req.on('error', (err) => {
      console.log(`[FAIL] ${name} is NOT reachable: ${err.message}`);
      resolve(false);
    });
  });
};

const checkWs = (name: string, url: string) => {
  return new Promise((resolve) => {
    const ws = new WebSocket(url);
    ws.on('open', () => {
      console.log(`[PASS] ${name} WebSocket connected!`);
      ws.close();
      resolve(true);
    });
    ws.on('error', (err) => {
      console.log(`[FAIL] ${name} WebSocket failed: ${err.message}`);
      resolve(false);
    });
  });
};

const run = async () => {
  console.log('--- STARTING DIAGNOSTIC ---');
  
  // Check HTTP Endpoints
  for (const t of targets) {
    await checkHttp(t.name, t.url);
  }

  // Check WebSocket Endpoints
  console.log('\n--- CHECKING WEBSOCKETS ---');
  await checkWs('Node WS (IPv4)', 'ws://127.0.0.1:9944');
  await checkWs('Indexer WS (IPv4)', 'ws://127.0.0.1:8088/api/v3/graphql/ws');
  
  console.log('--- DONE ---');
};

run();