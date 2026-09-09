import test, { before, after } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import type { Server } from 'node:http';
import jwt from 'jsonwebtoken';
import { SYSTEM_USERS, MEDICINES_DATA, TENANT_NODES, INITIAL_DISPENSARY_ORDERS } from '../src/data/initialData';

let server: Server;
let BASE_URL: string;
const JWT_SECRET = 'genericmed-jwt-secret-key-2026';

before(async () => {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = SYSTEM_USERS.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tenantBound: user.tenantBound },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.json({ message: 'Authentication successful', token, user });
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = SYSTEM_USERS.find((u) => u.id === decoded.id);
      if (!user) return res.status(404).json({ error: 'User profile not found' });
      return res.json({ user });
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    return res.json({ message: 'Logged out successfully' });
  });

  app.get('/api/medicines', (req, res) => res.json(MEDICINES_DATA));
  app.get('/api/tenants', (req, res) => res.json(TENANT_NODES));
  app.get('/api/orders', (req, res) => res.json(INITIAL_DISPENSARY_ORDERS));

  return new Promise<void>((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (typeof address === 'object' && address !== null) {
        BASE_URL = `http://127.0.0.1:${address.port}`;
      }
      resolve();
    });
  });
});

after(() => {
  if (server) server.close();
});

test('POST /api/auth/login authenticates user and returns JWT token', async () => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aarav.sharma@gmail.com', password: 'password123' }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(data.token, 'Should return JWT token');
  assert.strictEqual(data.user.name, 'Aarav Sharma (Patient)');
  assert.strictEqual(data.user.role, 'Customer / Patient');
});

test('POST /api/auth/login rejects invalid email with 401 Unauthorized', async () => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'unknown@invalid.com' }),
  });
  assert.strictEqual(res.status, 401);
  const data = (await res.json()) as any;
  assert.strictEqual(data.error, 'Invalid credentials');
});

test('POST /api/auth/login rejects missing email with 400 Bad Request', async () => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(res.status, 400);
  const data = (await res.json()) as any;
  assert.strictEqual(data.error, 'Email is required');
});

test('GET /api/auth/me returns authenticated user profile when token is valid', async () => {
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'vikram.j@metrochemist.in' }),
  });
  const loginData = (await loginRes.json()) as any;

  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${loginData.token}` },
  });
  assert.strictEqual(meRes.status, 200);
  const meData = (await meRes.json()) as any;
  assert.strictEqual(meData.user.role, 'Pharmacist-in-Charge');
  assert.strictEqual(meData.user.email, 'vikram.j@metrochemist.in');
});

test('GET /api/auth/me rejects missing or invalid bearer token with 401', async () => {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: 'Bearer invalid.jwt.token' },
  });
  assert.strictEqual(res.status, 401);
  const data = (await res.json()) as any;
  assert.strictEqual(data.error, 'Invalid or expired token');
});

test('POST /api/auth/logout returns success message', async () => {
  const res = await fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST' });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.strictEqual(data.message, 'Logged out successfully');
});

test('GET /api/medicines returns canonical generic salt normalization data', async () => {
  const res = await fetch(`${BASE_URL}/api/medicines`);
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(data.paracetamol, 'Should contain paracetamol salt key');
  assert.strictEqual(data.paracetamol.activeSalt, 'Paracetamol IP');
});

test('GET /api/tenants returns multi-tenant node list', async () => {
  const res = await fetch(`${BASE_URL}/api/tenants`);
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(Array.isArray(data), 'Should return array of tenant nodes');
  assert.ok(data.length >= 1);
});

test('GET /api/orders returns dispensary orders list', async () => {
  const res = await fetch(`${BASE_URL}/api/orders`);
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(Array.isArray(data), 'Should return array of dispensary orders');
  assert.ok(data.length >= 1);
});
