export type ViewMode = 
  | 'customer'
  | 'dispensary'
  | 'ops'
  | 'formulary'
  | 'orders'
  | 'iam'
  | 'superadmin'
  | 'architecture'
  | 'auth';

export interface MedicineOffer {
  id: string;
  storeName: string;
  storeCode: string;
  storeRating: number;
  reviewsCount: number;
  distanceKm: number;
  deliveryEstimate: string;
  deliveryType: 'express' | 'standard' | 'scheduled';
  brandName: string;
  manufacturer: string;
  originalPrice: number;
  discountedPrice: number;
  perTabletPrice: number;
  savingsPercent: number;
  inStock: boolean;
  stockCount: number;
  badge?: string;
  isLowest?: boolean;
}

export interface SaltNormalization {
  activeSalt: string;
  saltStrength: string;
  dosageForm: string;
  packaging: string;
  bioEquivalenceScore: number;
  brandedComparison: {
    name: string;
    manufacturer: string;
    mrp: number;
    perUnit: number;
  };
  lowestPrice: number;
  maxSavingsPercent: number;
  offers: MedicineOffer[];
}

export interface DispensaryOrder {
  id: string;
  customerName: string;
  customerPhoneMasked: string;
  itemsCount: number;
  itemsSummary: string;
  itemsList: {
    name: string;
    dosage: string;
    quantity: number;
    salt: string;
    price: number;
  }[];
  totalAmount: number;
  payoutAmount: number;
  status: 'needs_acceptance' | 'picking_packing' | 'ready_dispatch' | 'completed' | 'disputed';
  timeRemainingSeconds: number;
  createdAt: string;
  deliveryType: 'Express 45m' | 'Standard 2h';
  rider?: {
    name: string;
    partner: string;
    phone: string;
    vehicleNumber: string;
    otp: string;
    estimatedArrival: string;
  };
}

export interface DispensaryInventoryItem {
  id: string;
  sku: string;
  name: string;
  salt: string;
  manufacturer: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  threshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  batchNumber: string;
  expiryDate: string;
  isSynched: boolean;
}

export interface TenantNode {
  id: string;
  name: string;
  schemaId: string;
  region: string;
  status: 'healthy' | 'migrating' | 'quarantined';
  activeOrders: number;
  todayGMV: number;
  slaPercent: number;
  lastHeartbeat: string;
  storageGb: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Super Admin' | 'Admin / Ops Lead' | 'Pharmacist-in-Charge' | 'Support & Compliance' | 'Customer / Patient';
  tenantBound: string;
  status: 'Active' | 'Suspended' | 'Pending Verification';
  mfaEnabled: boolean;
  lastLogin: string;
  permissions: string[];
  pharmacyDetails?: {
    storeName: string;
    drugLicenseNo: string;
    pharmacistCouncilReg: string;
    pincode: string;
    city: string;
  };
  patientDetails?: {
    pincode: string;
    city: string;
    chronicConditions?: string[];
  };
}

export interface FormularySalt {
  id: string;
  canonicalKey: string;
  saltName: string;
  strength: string;
  therapeuticClass: string;
  dosageForm: string;
  activeSkusCount: number;
  brandedBenchmark: string;
  brandedPrice: number;
  lowestGenericPrice: number;
  savingsMargin: number;
  status: 'active' | 'anomaly_flagged' | 'under_review';
  cdscoCategory: string;
}
