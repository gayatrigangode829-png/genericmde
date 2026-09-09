export interface LogisticsPartner {
  id: string;
  name: string;
  code: 'dunzo' | 'porter' | 'shadowfax' | 'wellness_express';
  rating: number;
  availableRiders: number;
  avgPickupTimeMins: number;
  expressSupported: boolean;
}

export interface RiderAssignment {
  name: string;
  partner: string;
  phone: string;
  vehicleNumber: string;
  otp: string;
  estimatedArrival: string;
  assignedAt: string;
}

export const LOGISTICS_PARTNERS: LogisticsPartner[] = [
  {
    id: 'partner-1',
    name: 'Shadowfax Express Logistics',
    code: 'shadowfax',
    rating: 4.9,
    availableRiders: 42,
    avgPickupTimeMins: 8,
    expressSupported: true,
  },
  {
    id: 'partner-2',
    name: 'Dunzo Hyperlocal Direct',
    code: 'dunzo',
    rating: 4.8,
    availableRiders: 38,
    avgPickupTimeMins: 10,
    expressSupported: true,
  },
  {
    id: 'partner-3',
    name: 'Porter On-Demand Fleet',
    code: 'porter',
    rating: 4.7,
    availableRiders: 25,
    avgPickupTimeMins: 15,
    expressSupported: false,
  },
];

const RIDER_NAMES = ['Rahul K.', 'Suresh M.', 'Amit P.', 'Vikram R.', 'Deepak S.', 'Kiran B.'];
const VEHICLE_PREFIXES = ['MH-01-EQ', 'MH-02-CP', 'MH-03-BW', 'DL-01-AB', 'KA-01-MJ'];

export function assignRider(partnerCode: string, orderId: string): RiderAssignment {
  const partner = LOGISTICS_PARTNERS.find((p) => p.code === partnerCode) || LOGISTICS_PARTNERS[0];
  const randomName = RIDER_NAMES[Math.floor(Math.random() * RIDER_NAMES.length)];
  const randomPrefix = VEHICLE_PREFIXES[Math.floor(Math.random() * VEHICLE_PREFIXES.length)];
  const vehicleNo = `${randomPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  const otpCode = String(Math.floor(1000 + Math.random() * 9000));
  const phoneNo = `+91 98${Math.floor(100 + Math.random() * 900)} ${Math.floor(10000 + Math.random() * 90000)}`;

  return {
    name: randomName,
    partner: partner.name,
    phone: phoneNo,
    vehicleNumber: vehicleNo,
    otp: otpCode,
    estimatedArrival: `${partner.avgPickupTimeMins} mins`,
    assignedAt: new Date().toISOString(),
  };
}

export function verifyRiderOTP(expectedOTP: string, submittedOTP: string): boolean {
  return String(expectedOTP).trim() === String(submittedOTP).trim();
}
