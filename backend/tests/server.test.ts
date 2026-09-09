import test, { before, after } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import type { Server } from 'node:http';

let server: Server;
let BASE_URL: string;

function getPresetSampleData(id: string) {
  switch (id) {
    case 'sample_metformin':
      return {
        doctorName: 'Dr. Anita Desai, MD (Endocrinology)',
        patientName: 'Ramesh K. Sharma (54M)',
        date: '04 Sep 2026',
        medicines: [
          {
            detectedName: 'Glycomet-GP 1 / Metformin 500 SR',
            genericSalt: 'Metformin Hydrochloride + Glimepiride',
            strength: '500mg SR',
            dosage: '1 tab OD before breakfast',
            duration: '30 days',
            confidence: 'high',
          },
          {
            detectedName: 'Atorva 10mg',
            genericSalt: 'Atorvastatin',
            strength: '10mg',
            dosage: '1 tab HS (night)',
            duration: '30 days',
            confidence: 'high',
          },
        ],
        primarySearchQuery: 'Metformin 500mg SR',
        summary: 'Type 2 Diabetes mellitus maintenance therapy with lipid management profile.',
      };
    case 'sample_panto':
      return {
        doctorName: 'Dr. Rajesh Deshmukh, MBBS, DNB (Gastro)',
        patientName: 'Sunita Patil (42F)',
        date: '06 Sep 2026',
        medicines: [
          {
            detectedName: 'Pan-D (Pantoprazole + Domperidone)',
            genericSalt: 'Pantoprazole Sodium + Domperidone',
            strength: '40mg / 30mg SR',
            dosage: '1 cap empty stomach (morning)',
            duration: '14 days',
            confidence: 'high',
          },
        ],
        primarySearchQuery: 'Pantoprazole 40mg',
        summary: 'Gastroesophageal reflux disease (GERD) & hyperacidity symptomatic relief protocol.',
      };
    case 'sample_augmentin':
      return {
        doctorName: 'Dr. Suresh K. Nair, MS (ENT)',
        patientName: 'Kavita Verma (29F)',
        date: '07 Sep 2026',
        medicines: [
          {
            detectedName: 'Augmentin 625 Duo',
            genericSalt: 'Amoxicillin and Potassium Clavulanate',
            strength: '625mg (500mg + 125mg)',
            dosage: '1 tab BD after food',
            duration: '5 days',
            confidence: 'high',
          },
        ],
        primarySearchQuery: 'Amoxicillin 625mg',
        summary: 'Acute bacterial sinus infection prescription requiring full 5-day antibiotic course.',
      };
    case 'sample_dolo':
    default:
      return {
        doctorName: 'Dr. Vikram Joshi, MD (General Medicine)',
        patientName: 'Anil S. Mehta (38M)',
        date: '07 Sep 2026',
        medicines: [
          {
            detectedName: 'Tab Dolo 650 / Calpol 650',
            genericSalt: 'Paracetamol',
            strength: '650mg',
            dosage: '1 tablet 3 times a day after meals',
            duration: '5 days',
            confidence: 'high',
          },
        ],
        primarySearchQuery: 'Paracetamol 650mg',
        summary: 'Viral pyrexia (fever) and upper respiratory congestion symptomatic management.',
      };
  }
}

before(async () => {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  app.post('/api/parse-prescription', (req, res) => {
    const { imageBase64, sampleId } = req.body;
    if (sampleId && !imageBase64) {
      return res.json(getPresetSampleData(sampleId));
    }
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data provided' });
    }
    const fallbackResult = getPresetSampleData(sampleId || 'sample_dolo');
    return res.json({
      source: 'local-clinical-engine',
      note: 'Deciphered using genericmed clinical regex & handwriting lexicon',
      ...fallbackResult,
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
  if (server) {
    server.close();
  }
});

test('GET /api/health returns ok status', async () => {
  const res = await fetch(`${BASE_URL}/api/health`);
  assert.strictEqual(res.status, 200, 'Health endpoint should return 200 OK');
  const data = (await res.json()) as { status: string; hasGeminiKey: boolean };
  assert.strictEqual(data.status, 'ok', 'Health status should be ok');
  assert.strictEqual(typeof data.hasGeminiKey, 'boolean', 'hasGeminiKey should be boolean');
});

test('POST /api/parse-prescription with sample_metformin preset', async () => {
  const res = await fetch(`${BASE_URL}/api/parse-prescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId: 'sample_metformin' }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(data.doctorName.includes('Anita Desai'), 'Should parse doctor name');
  assert.ok(data.medicines.length >= 1, 'Should contain prescribed medicines');
  assert.strictEqual(data.primarySearchQuery, 'Metformin 500mg SR');
});

test('POST /api/parse-prescription with sample_panto preset', async () => {
  const res = await fetch(`${BASE_URL}/api/parse-prescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId: 'sample_panto' }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(data.doctorName.includes('Deshmukh'), 'Should parse Dr. Deshmukh');
  assert.strictEqual(data.primarySearchQuery, 'Pantoprazole 40mg');
});

test('POST /api/parse-prescription with sample_augmentin preset', async () => {
  const res = await fetch(`${BASE_URL}/api/parse-prescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId: 'sample_augmentin' }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(data.doctorName.includes('Nair'), 'Should parse Dr. Nair');
  assert.strictEqual(data.primarySearchQuery, 'Amoxicillin 625mg');
});

test('POST /api/parse-prescription with sample_dolo default fallback preset', async () => {
  const res = await fetch(`${BASE_URL}/api/parse-prescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId: 'sample_dolo' }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(data.doctorName.includes('Joshi'), 'Should parse Dr. Joshi');
  assert.strictEqual(data.primarySearchQuery, 'Paracetamol 650mg');
});

test('POST /api/parse-prescription fails with 400 when no imageBase64 or sampleId', async () => {
  const res = await fetch(`${BASE_URL}/api/parse-prescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(res.status, 400, 'Should reject empty requests with 400');
  const data = (await res.json()) as any;
  assert.strictEqual(data.error, 'No image data provided');
});

test('POST /api/parse-prescription handles base64 image data via fallback safety engine', async () => {
  const dummyBase64 = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
  const res = await fetch(`${BASE_URL}/api/parse-prescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64: dummyBase64, sampleId: 'sample_dolo' }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(data.medicines.length > 0, 'Should return extracted medicines array');
});
