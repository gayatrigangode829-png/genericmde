export interface NotificationPayload {
  recipientPhone: string;
  orderId: string;
  channel: 'sms' | 'whatsapp';
  messageType: 'ORDER_CONFIRMED' | 'DISPATCHED' | 'DELIVERED' | 'OTP_ALERT';
  otpCode?: string;
  trackingUrl?: string;
}

export interface NotificationResult {
  id: string;
  status: 'sent' | 'delivered' | 'failed';
  channel: 'sms' | 'whatsapp';
  timestamp: string;
  payload: NotificationPayload;
}

export function sendCustomerNotification(payload: NotificationPayload): NotificationResult {
  const trackingLink = payload.trackingUrl || `https://genericmed.in/track/${payload.orderId}`;
  
  let bodyText = '';
  switch (payload.messageType) {
    case 'ORDER_CONFIRMED':
      bodyText = `GenericMed Order #${payload.orderId} confirmed! Tracking: ${trackingLink}`;
      break;
    case 'DISPATCHED':
      bodyText = `Rider dispatched for Order #${payload.orderId}. Delivery OTP: ${payload.otpCode || '****'}. Track live: ${trackingLink}`;
      break;
    case 'DELIVERED':
      bodyText = `Order #${payload.orderId} delivered safely. Thank you for choosing GenericMed!`;
      break;
    case 'OTP_ALERT':
      bodyText = `Your GenericMed delivery verification OTP is ${payload.otpCode}. Please share with rider upon arrival.`;
      break;
  }

  return {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: 'sent',
    channel: payload.channel,
    timestamp: new Date().toISOString(),
    payload: {
      ...payload,
      trackingUrl: trackingLink,
    },
  };
}
