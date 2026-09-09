import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  MEDICINES_DATA,
  INITIAL_DISPENSARY_ORDERS,
  INITIAL_INVENTORY_ITEMS,
  TENANT_NODES,
  SYSTEM_USERS,
  FORMULARY_SALTS,
} from '../src/data/initialData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding GenericMed database...');

  // Clean existing tables
  await prisma.dispensaryOrder.deleteMany();
  await prisma.dispensaryInventoryItem.deleteMany();
  await prisma.medicineOffer.deleteMany();
  await prisma.formularySalt.deleteMany();
  await prisma.tenantNode.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Users
  for (const user of SYSTEM_USERS) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone || null,
        role: user.role,
        tenantBound: user.tenantBound,
        status: user.status,
        mfaEnabled: user.mfaEnabled,
        lastLogin: user.lastLogin,
        permissionsJson: JSON.stringify(user.permissions),
        pharmacyDetailsJson: user.pharmacyDetails ? JSON.stringify(user.pharmacyDetails) : null,
        patientDetailsJson: user.patientDetails ? JSON.stringify(user.patientDetails) : null,
      },
    });
  }
  console.log(`Seeded ${SYSTEM_USERS.length} users.`);

  // 2. Seed Tenant Nodes
  for (const tenant of TENANT_NODES) {
    await prisma.tenantNode.create({
      data: {
        id: tenant.id,
        name: tenant.name,
        schemaId: tenant.schemaId,
        region: tenant.region,
        status: tenant.status,
        activeOrders: tenant.activeOrders,
        todayGMV: tenant.todayGMV,
        slaPercent: tenant.slaPercent,
        lastHeartbeat: tenant.lastHeartbeat,
        storageGb: tenant.storageGb,
      },
    });
  }
  console.log(`Seeded ${TENANT_NODES.length} tenant nodes.`);

  // 3. Seed Formulary Salts & Offers
  for (const [key, data] of Object.entries(MEDICINES_DATA)) {
    const salt = await prisma.formularySalt.create({
      data: {
        canonicalKey: key,
        saltName: data.activeSalt,
        strength: data.saltStrength,
        therapeuticClass: 'General Medicine',
        dosageForm: data.dosageForm,
        activeSkusCount: data.offers.length,
        brandedBenchmark: data.brandedComparison.name,
        brandedPrice: data.brandedComparison.mrp,
        lowestGenericPrice: data.lowestPrice,
        savingsMargin: data.maxSavingsPercent,
        status: 'active',
        cdscoCategory: 'Schedule H / Generic Bioequivalent',
      },
    });

    for (const offer of data.offers) {
      await prisma.medicineOffer.create({
        data: {
          id: offer.id,
          storeName: offer.storeName,
          storeCode: offer.storeCode,
          storeRating: offer.storeRating,
          reviewsCount: offer.reviewsCount,
          distanceKm: offer.distanceKm,
          deliveryEstimate: offer.deliveryEstimate,
          deliveryType: offer.deliveryType,
          brandName: offer.brandName,
          manufacturer: offer.manufacturer,
          originalPrice: offer.originalPrice,
          discountedPrice: offer.discountedPrice,
          perTabletPrice: offer.perTabletPrice,
          savingsPercent: offer.savingsPercent,
          inStock: offer.inStock,
          stockCount: offer.stockCount,
          badge: offer.badge || null,
          isLowest: offer.isLowest || false,
          saltId: salt.id,
        },
      });
    }
  }
  console.log('Seeded Master Formularies and Medicine Offers.');

  // 4. Seed Dispensary Inventory Items
  for (const item of INITIAL_INVENTORY_ITEMS) {
    await prisma.dispensaryInventoryItem.create({
      data: {
        id: item.id,
        tenantCode: 'TN-044',
        sku: item.sku,
        name: item.name,
        salt: item.salt,
        manufacturer: item.manufacturer,
        mrp: item.mrp,
        sellingPrice: item.sellingPrice,
        stock: item.stock,
        threshold: item.threshold,
        status: item.status,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        isSynched: item.isSynched,
      },
    });
  }
  console.log(`Seeded ${INITIAL_INVENTORY_ITEMS.length} inventory items.`);

  // 5. Seed Dispensary Orders
  for (const order of INITIAL_DISPENSARY_ORDERS) {
    await prisma.dispensaryOrder.create({
      data: {
        id: order.id,
        tenantCode: 'TN-044',
        customerName: order.customerName,
        customerPhoneMasked: order.customerPhoneMasked,
        itemsCount: order.itemsCount,
        itemsSummary: order.itemsSummary,
        itemsListJson: JSON.stringify(order.itemsList),
        totalAmount: order.totalAmount,
        payoutAmount: order.payoutAmount,
        status: order.status,
        timeRemainingSeconds: order.timeRemainingSeconds,
        deliveryType: order.deliveryType,
        riderJson: order.rider ? JSON.stringify(order.rider) : null,
      },
    });
  }
  console.log(`Seeded ${INITIAL_DISPENSARY_ORDERS.length} dispensary orders.`);

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
