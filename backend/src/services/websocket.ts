import { EventEmitter } from 'node:events';

export interface WebSocketEvent {
  type: 'ORDER_CREATED' | 'ORDER_STATUS_CHANGED' | 'RIDER_TELEMETRY_UPDATED' | 'SLA_ALERT';
  orderId: string;
  tenantCode: string;
  timestamp: string;
  payload: any;
}

class WebSocketService extends EventEmitter {
  private activeConnections: Map<string, { socketId: string; tenantCode: string; role: string }> = new Map();

  constructor() {
    super();
    this.setMaxListeners(50);
  }

  registerConnection(socketId: string, tenantCode: string, role: string) {
    this.activeConnections.set(socketId, { socketId, tenantCode, role });
  }

  removeConnection(socketId: string) {
    this.activeConnections.delete(socketId);
  }

  getConnectionsCount(): number {
    return this.activeConnections.size;
  }

  broadcast(event: WebSocketEvent) {
    this.emit('broadcast', event);
    this.emit(`tenant:${event.tenantCode}`, event);
    this.emit(`order:${event.orderId}`, event);
    return {
      deliveredCount: this.activeConnections.size,
      event,
    };
  }
}

export const wsService = new WebSocketService();
