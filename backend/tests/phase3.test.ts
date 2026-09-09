import test, { before, after } from 'node:test';
import assert from 'node:assert';
import express from 'express';
import type { Server } from 'node:http';
import { wsService } from '../src/services/websocket';
import { LOGISTICS_PARTNERS, assignRider, verifyRiderOTP } from '../src/services/logisticsAdapter';
import { sendCustomerNotification } from '../src/services/notificationService';
import { INITIAL_DISPENSARY_ORDERS } from '../src/data/initialData';

let server: Server;
let BASE_URL: string;

before(async () => {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  app.get('/api/logistics/partners', (req, res) => {
    return res.json({
      partners: LOGISTICS_PARTNERS,
      activeConnections: wsService.getConnectionsCount(),
    });
  });

  app.post('/api/orders/:id/dispatch', (req, res) => {
    const { id } = req.params;
    const { partnerCode = 'shadowfax' } = req.body;
    const order = INITIAL_DISPENSARY_ORDERS.find((o) => o.id === id) || INITIAL_DISPENSARY_ORDERS[0];
    const rider = assignRider(partnerCode, id);
    order.rider = rider;
    order.status = 'ready_dispatch';

    const wsEvent = wsService.broadcast({
      type: 'RIDER_TELEMETRY_UPDATED',
      orderId: id,
      tenantCode: 'TN-044',
      timestamp: new Date().toISOString(),
      payload: { rider, status: 'ready_dispatch' },
    });

    const notification = sendCustomerNotification({
      recipientPhone: order.customerPhoneMasked,
      orderId: id,
      channel: 'whatsapp',
      messageType: 'DISPATCHED',
      otpCode: rider.otp,
    });

    return res.json({
      message: 'Rider dispatched successfully',
      orderId: id,
      rider,
      notification,
      wsEvent,
    });
  });

  app.post('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const wsEvent = wsService.broadcast({
      type: 'ORDER_STATUS_CHANGED',
      orderId: id,
      tenantCode: 'TN-044',
      timestamp: new Date().toISOString(),
      payload: { status },
    });

    return res.json({ message: 'Order status updated', orderId: id, status, wsEvent });
  });

  app.post('/api/orders/:id/verify-otp', (req, res) => {
    const { id } = req.params;
    const { otpSubmitted } = req.body;
    const order = INITIAL_DISPENSARY_ORDERS.find((o) => o.id === id) || INITIAL_DISPENSARY_ORDERS[0];
    const expectedOTP = order.rider?.otp || '8842';

    const isValid = verifyRiderOTP(expectedOTP, String(otpSubmitted));
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid delivery OTP code' });
    }

    order.status = 'completed';
    const notification = sendCustomerNotification({
      recipientPhone: order.customerPhoneMasked,
      orderId: id,
      channel: 'sms',
      messageType: 'DELIVERED',
    });

    return res.json({
      message: 'Delivery OTP verified successfully. Order marked completed!',
      orderId: id,
      status: 'completed',
      notification,
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

test('GET /api/logistics/partners returns active 3PL partner network', async () => {
  const res = await fetch(`${BASE_URL}/api/logistics/partners`);
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(Array.isArray(data.partners));
  assert.ok(data.partners.length >= 3);
  assert.strictEqual(data.partners[0].code, 'shadowfax');
});

test('POST /api/orders/:id/dispatch assigns rider and triggers WebSocket telemetry', async () => {
  let receivedWsEvent: any = null;
  const listener = (evt: any) => { receivedWsEvent = evt; };
  wsService.on('broadcast', listener);

  const res = await fetch(`${BASE_URL}/api/orders/GM-99420/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ partnerCode: 'dunzo' }),
  });

  wsService.off('broadcast', listener);

  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.ok(data.rider, 'Should return assigned rider details');
  assert.ok(data.rider.otp, 'Should generate 4-digit OTP');
  assert.strictEqual(data.notification.status, 'sent');
  assert.ok(receivedWsEvent, 'Should trigger WebSocket broadcast event');
  assert.strictEqual(receivedWsEvent.type, 'RIDER_TELEMETRY_UPDATED');
});

test('POST /api/orders/:id/status broadcasts order status change', async () => {
  const res = await fetch(`${BASE_URL}/api/orders/GM-99420/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'picking_packing' }),
  });
  assert.strictEqual(res.status, 200);
  const data = (await res.json()) as any;
  assert.strictEqual(data.status, 'picking_packing');
});

test('POST /api/orders/:id/verify-otp validates correct delivery OTP', async () => {
  const dispatchRes = await fetch(`${BASE_URL}/api/orders/GM-99420/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ partnerCode: 'shadowfax' }),
  });
  const dispatchData = (await dispatchRes.json()) as any;
  const otpCode = dispatchData.rider.otp;

  const verifyRes = await fetch(`${BASE_URL}/api/orders/GM-99420/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otpSubmitted: otpCode }),
  });

  assert.strictEqual(verifyRes.status, 200);
  const verifyData = (await verifyRes.json()) as any;
  assert.strictEqual(verifyData.status, 'completed');
});

test('POST /api/orders/:id/verify-otp rejects invalid delivery OTP with 400', async () => {
  const res = await fetch(`${BASE_URL}/api/orders/GM-99420/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otpSubmitted: '0000' }),
  });
  assert.strictEqual(res.status, 400);
  const data = (await res.json()) as any;
  assert.strictEqual(data.error, 'Invalid delivery OTP code');
});
