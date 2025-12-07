/**
 * Integration tests for server /api/analyze
 * Spawns the server process (server/index.js) and polls /health until ready.
 *
 * NOTE: Node 18+ provides global fetch used below.
 */

/* eslint-env node */
import { spawn } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';
import { setTimeout as wait } from 'timers/promises';
import { describe, test, beforeAll, afterAll, expect } from '@jest/globals';

const SERVER_START_TIMEOUT = 12000;
const HEALTH_POLL_INTERVAL = 300;
const SERVER_PORT = process.env.TEST_SERVER_PORT || 3000;

let serverProc;

async function waitForHealth(url, timeout = SERVER_START_TIMEOUT) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch (e) {
      // ignore, server not ready yet
    }
    await wait(HEALTH_POLL_INTERVAL);
  }
  throw new Error('Server did not become healthy in time');
}

beforeAll(async () => {
  const serverPath = resolve(process.cwd(), 'server', 'index.js');
  serverProc = spawn(process.execPath, [serverPath], {
    env: { ...process.env, PORT: String(SERVER_PORT) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // forward server stdout/stderr for debugging (tests will still fail on errors)
  serverProc.stdout?.on('data', (d) => { /*console.log('[server]', d.toString());*/ });
  serverProc.stderr?.on('data', (d) => { /*console.error('[server]', d.toString());*/ });

  const healthUrl = `http://127.0.0.1:${SERVER_PORT}/health`;
  await waitForHealth(healthUrl, SERVER_START_TIMEOUT);
}, SERVER_START_TIMEOUT + 2000);

afterAll(() => {
  if (serverProc && !serverProc.killed) {
    serverProc.kill('SIGTERM');
  }
});

describe('/api/analyze integration', () => {
  test('returns 400 for missing input', async () => {
    const res = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: '' })
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test('analyze returns expected structure for a domain', async () => {
    const payload = { type: 'url', input: 'example.com' };
    const res = await fetch(`http://127.0.0.1:${SERVER_PORT}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    expect(res.ok).toBe(true);
    const j = await res.json();
    expect(j).toHaveProperty('tech');
    expect(j).toHaveProperty('social');
    expect(j).toHaveProperty('community');
    expect(typeof j.score).toBe('number');
    expect(['high', 'medium', 'safe']).toContain(j.riskLevel);
  }, 10000);
});
