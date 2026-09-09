export interface Wholesaler {
  id: string;
  name: string;
  code: string;
  licenseNumber: string;
  rating: number;
  minimumOrderQuantity: number;
  bulkDiscountPercent: number;
  primarySaltsSupplied: string[];
}

export interface PurchaseOrderRequest {
  storeCode: string;
  wholesalerCode: string;
  saltName: string;
  quantityUnits: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  poNumber: string;
  storeCode: string;
  wholesalerName: string;
  saltName: string;
  quantityUnits: number;
  unitPrice: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  estimatedDeliveryDate: string;
  status: 'submitted' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export const WHOLESALERS: Wholesaler[] = [
  {
    id: 'mfg-1',
    name: 'Cipla Generic Pharma Division',
    code: 'cipla_b2b',
    licenseNumber: '20B/MH/104921',
    rating: 4.9,
    minimumOrderQuantity: 100,
    bulkDiscountPercent: 25.0,
    primarySaltsSupplied: ['Paracetamol IP 650mg', 'Metformin HCl 500mg'],
  },
  {
    id: 'mfg-2',
    name: 'Torrent Pharma Wholesale',
    code: 'torrent_b2b',
    licenseNumber: '20B/GJ/884102',
    rating: 4.8,
    minimumOrderQuantity: 200,
    bulkDiscountPercent: 30.0,
    primarySaltsSupplied: ['Metformin HCl 500mg ER', 'Atorvastatin 10mg'],
  },
  {
    id: 'mfg-3',
    name: 'Alkem Laboratories Generics',
    code: 'alkem_b2b',
    licenseNumber: '20B/MH/339100',
    rating: 4.8,
    minimumOrderQuantity: 150,
    bulkDiscountPercent: 28.0,
    primarySaltsSupplied: ['Amoxicillin + Clavulanate 625mg', 'Pantoprazole 40mg'],
  },
];

export function createPurchaseOrder(req: PurchaseOrderRequest): PurchaseOrder {
  const wholesaler = WHOLESALERS.find((w) => w.code === req.wholesalerCode) || WHOLESALERS[0];
  const subtotal = req.quantityUnits * req.unitPrice;
  const discountAmount = (subtotal * wholesaler.bulkDiscountPercent) / 100;
  const totalAmount = subtotal - discountAmount;

  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 3);

  return {
    poNumber: `PO-B2B-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    storeCode: req.storeCode,
    wholesalerName: wholesaler.name,
    saltName: req.saltName,
    quantityUnits: req.quantityUnits,
    unitPrice: req.unitPrice,
    subtotal,
    discountAmount,
    totalAmount,
    estimatedDeliveryDate: estDate.toISOString().split('T')[0],
    status: 'submitted',
    createdAt: new Date().toISOString(),
  };
}
