import test, { before, after } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import type { Server } from 'node:http';
import { CLUSTER_NODES, scaleClusterNode } from '../src/services/clusterOrchestrator';
import { WHOLESALERS, createPurchaseOrder } from '../src/services/b2bProcurementService';
import { computeDemandForecast } from '../src/services/demandForecastingService';

let server: Server;
let BASE_URL: string;

before(async () => {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  app.get('/api/cluster/nodes', (req, res) => {
    return res.json({ totalNodes: CLUSTER_NODES.length, nodes: CLUSTER_NODES });
  });

  app.post('/api/cluster/scale', (req, res) => {
    const { nodeId, action = 'scale_up' } = req.body;
    if (!nodeId) return res.status(400).json({ error: 'nodeId is required' });
    const updatedNode = scaleClusterNode(nodeId, action);
    return res.json({ message: `Cluster action '${action}' applied`, node: updatedNode });
  });

  app.get('/api/b2b/wholesalers', (req, res) => res.json(WHOLESALERS));

  app.post('/api/b2b/purchase-orders', (req, res) => {
    const { storeCode, wholesalerCode, saltName, quantityUnits, unitPrice } = req.body;
    if (!storeCode || !saltName || !quantityUnits || !unitPrice) {
      return res.status(400).json({ error: 'storeCode, saltName, quantityUnits, and unitPrice are required' });
    }
    const po = createPurchaseOrder({
      storeCode,
      wholesalerCode: wholesalerCode || 'cipla_b2b',
      saltName,
      quantityUnits: Number(quantityUnits),
      unitPrice: Number(unitPrice),
    });
    return res.json({ message: 'B2B Purchase order created', purchaseOrder: po });
  });

  app.get('/api/forecast/replenishment', (req, res) => {
    const forecast = computeDemandForecast();
    return res.json({ forecastItems: forecast.length, forecast });
  });

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

test('GET /api/cluster/nodes returns multi-region cluster status', async () => {
  const res = await fetch(`${BASE_URL}/api/cluster/nodes`);
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(Array.isArray(data.nodes));
  assert.ok(data.totalNodes >= 4);
});

test('POST /api/cluster/scale applies cluster scaling and quarantine action', async () => {
  const res = await fetch(`${BASE_URL}/api/cluster/scale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nodeId: 'ten_044_prod', action: 'quarantine' }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.strictEqual(data.node.status, 'quarantined');
});

test('POST /api/cluster/scale rejects missing nodeId with 400', async () => {
  const res = await fetch(`${BASE_URL}/api/cluster/scale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(res.status, 400);
  const data = (await res.json()) as any;
  assert.strictEqual(data.error, 'nodeId is required');
});

test('GET /api/b2b/wholesalers returns manufacturer list', async () => {
  const res = await fetch(`${BASE_URL}/api/b2b/wholesalers`);
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(Array.isArray(data));
  assert.ok(data.some((w: any) => w.code === 'cipla_b2b'));
});

test('POST /api/b2b/purchase-orders calculates bulk discount and creates PO', async () => {
  const res = await fetch(`${BASE_URL}/api/b2b/purchase-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      storeCode: 'TN-044',
      wholesalerCode: 'cipla_b2b',
      saltName: 'Paracetamol IP 650mg',
      quantityUnits: 500,
      unitPrice: 14.5,
    }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(data.purchaseOrder.poNumber.startsWith('PO-B2B'));
  assert.ok(data.purchaseOrder.discountAmount > 0, 'Should apply bulk discount');
  assert.strictEqual(data.purchaseOrder.status, 'submitted');
});

test('POST /api/b2b/purchase-orders rejects missing parameters with 400', async () => {
  const res = await fetch(`${BASE_URL}/api/b2b/purchase-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storeCode: 'TN-044' }),
  });
  assert.strictEqual(res.status, 400);
  const data = (await res.json()) as any;
  assert.strictEqual(data.error, 'storeCode, saltName, quantityUnits, and unitPrice are required');
});

test('GET /api/forecast/replenishment returns predictive AI demand forecast', async () => {
  const res = await fetch(`${BASE_URL}/api/forecast/replenishment`);
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(Array.isArray(data.forecast));
  assert.ok(data.forecast.length >= 3);
  assert.ok(data.forecast.some((f: any) => f.urgency === 'critical'));
});
