import test, { before, after } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import type { Server } from 'node:http';
import { analyzeDrugInteractions } from '../src/services/ddiEngine';
import { verifyPrescriptionAuthenticity } from '../src/services/fraudDetectionService';
import { generateCDSCOComplianceReport } from '../src/services/cdscoReportGenerator';

let server: Server;
let BASE_URL: string;

before(async () => {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  app.post('/api/clinical/check-interactions', (req, res) => {
    const { salts } = req.body;
    if (!salts || !Array.isArray(salts) || salts.length === 0) {
      return res.status(400).json({ error: 'Array of active chemical salts is required' });
    }
    const ddiResult = analyzeDrugInteractions(salts);
    return res.json(ddiResult);
  });

  app.post('/api/clinical/verify-prescription', (req, res) => {
    const verificationResult = verifyPrescriptionAuthenticity(req.body);
    return res.json(verificationResult);
  });

  app.get('/api/compliance/cdsco-report', (req, res) => {
    const report = generateCDSCOComplianceReport();
    return res.json(report);
  });

  app.get('/api/compliance/pricing-anomalies', (req, res) => {
    const report = generateCDSCOComplianceReport();
    const anomalies = report.auditLedger.filter((item) => item.status.includes('ANOMALY') || item.status.includes('REVIEW'));
    return res.json({
      totalAnomalies: anomalies.length,
      anomalies,
    });
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

test('POST /api/clinical/check-interactions detects critical interaction (Metformin + Contrast Media)', async () => {
  const res = await fetch(`${BASE_URL}/api/clinical/check-interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salts: ['Metformin Hydrochloride', 'Contrast Media'] }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.strictEqual(data.hasInteractions, true);
  assert.strictEqual(data.maxSeverity, 'critical');
  assert.ok(data.interactions.length >= 1);
});

test('POST /api/clinical/check-interactions returns safe for non-interacting salts', async () => {
  const res = await fetch(`${BASE_URL}/api/clinical/check-interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salts: ['Paracetamol IP', 'Cetirizine Hydrochloride'] }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.strictEqual(data.hasInteractions, false);
  assert.strictEqual(data.maxSeverity, 'safe');
});

test('POST /api/clinical/check-interactions rejects missing salts array with 400', async () => {
  const res = await fetch(`${BASE_URL}/api/clinical/check-interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(res.status, 400);
  const data = (await res.json()) as any;
  assert.strictEqual(data.error, 'Array of active chemical salts is required');
});

test('POST /api/clinical/verify-prescription checks doctor reg and Schedule H1 flags', async () => {
  const res = await fetch(`${BASE_URL}/api/clinical/verify-prescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doctorName: 'Dr. Anita Desai',
      doctorRegistrationNumber: 'MCI-61092-2024',
      medicinesList: ['Amoxicillin and Potassium Clavulanate 625mg'],
    }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.strictEqual(data.isAuthentic, true);
  assert.strictEqual(data.doctorRegStatus, 'verified');
  assert.ok(data.scheduleH1Flags.length >= 1, 'Should log Schedule H1 flag');
});

test('GET /api/compliance/cdsco-report returns CDSCO e-Pharmacy audit ledger', async () => {
  const res = await fetch(`${BASE_URL}/api/compliance/cdsco-report`);
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(data.reportId.startsWith('CDSCO-AUDIT'));
  assert.ok(Array.isArray(data.auditLedger));
  assert.ok(data.genericBioequivalenceComplianceRate > 90);
});

test('GET /api/compliance/pricing-anomalies returns NLEM price review flags', async () => {
  const res = await fetch(`${BASE_URL}/api/compliance/pricing-anomalies`);
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(typeof data.totalAnomalies === 'number');
  assert.ok(Array.isArray(data.anomalies));
});
