export interface ClusterNodeStatus {
  id: string;
  name: string;
  region: string;
  status: 'healthy' | 'migrating' | 'quarantined' | 'scaling';
  activeOrders: number;
  cpuUtilizationPercent: number;
  memoryUtilizationPercent: number;
  todayGMV: number;
  slaPercent: number;
  storageGb: number;
}

export const CLUSTER_NODES: ClusterNodeStatus[] = [
  {
    id: 'ten_044_prod',
    name: 'Metro Generic Chemist Node (Mumbai-Dadar)',
    region: 'asia-south1 (Mumbai)',
    status: 'healthy',
    activeOrders: 15,
    cpuUtilizationPercent: 42.5,
    memoryUtilizationPercent: 68.2,
    todayGMV: 28640.0,
    slaPercent: 99.4,
    storageGb: 4.2,
  },
  {
    id: 'ten_012_prod',
    name: 'Apollo Pharmacy Hub Node (Mumbai-Bandra)',
    region: 'asia-south1 (Mumbai)',
    status: 'healthy',
    activeOrders: 28,
    cpuUtilizationPercent: 65.0,
    memoryUtilizationPercent: 78.4,
    todayGMV: 49210.0,
    slaPercent: 98.8,
    storageGb: 6.8,
  },
  {
    id: 'ten_008_prod',
    name: 'Apex Healthcare Superstore Node (Mumbai-Kurla)',
    region: 'asia-south1 (Mumbai)',
    status: 'healthy',
    activeOrders: 12,
    cpuUtilizationPercent: 38.1,
    memoryUtilizationPercent: 54.0,
    todayGMV: 18450.0,
    slaPercent: 97.9,
    storageGb: 3.9,
  },
  {
    id: 'ten_099_delhi',
    name: 'North India Central Node (Delhi NCR)',
    region: 'asia-south2 (Delhi)',
    status: 'healthy',
    activeOrders: 34,
    cpuUtilizationPercent: 58.4,
    memoryUtilizationPercent: 71.3,
    todayGMV: 62100.0,
    slaPercent: 99.1,
    storageGb: 8.4,
  },
];

export function scaleClusterNode(nodeId: string, action: 'scale_up' | 'quarantine' | 'restore'): ClusterNodeStatus {
  const node = CLUSTER_NODES.find((n) => n.id === nodeId) || CLUSTER_NODES[0];
  if (action === 'quarantine') {
    node.status = 'quarantined';
  } else if (action === 'scale_up') {
    node.status = 'scaling';
    node.cpuUtilizationPercent = Math.max(15, node.cpuUtilizationPercent - 20);
    setTimeout(() => { node.status = 'healthy'; }, 2000);
  } else if (action === 'restore') {
    node.status = 'healthy';
  }
  return node;
}
