
export interface Material {
  id: string;
  materialNumber: string;
  name: string;
  type: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
  description: string;
  supplier: string;
  lastUpdated: string;
}

export interface Machine {
  id: string;
  assetNumber: string;
  name: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  location: string;
  status: 'Operational' | 'Maintenance' | 'Breakdown' | 'Standby';
  purchaseDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  operatingHours: number;
  description: string;
}

// Mock materials data
export const materials: Material[] = [
  {
    id: '1',
    materialNumber: 'MAT-10001',
    name: 'Steel Sheet A36',
    type: 'Raw Material',
    category: 'Metal',
    unit: 'Sheet',
    price: 120.50,
    stock: 150,
    status: 'Available',
    description: 'Hot rolled steel sheet, grade A36, thickness 2mm',
    supplier: 'PT Krakatau Steel',
    lastUpdated: '2025-05-01'
  },
  {
    id: '2',
    materialNumber: 'MAT-10002',
    name: 'Aluminum Rod 6061',
    type: 'Raw Material',
    category: 'Metal',
    unit: 'Rod',
    price: 75.25,
    stock: 80,
    status: 'Available',
    description: 'Extruded aluminum rod, alloy 6061-T6, diameter 25mm',
    supplier: 'PT Alumindo Light Metal',
    lastUpdated: '2025-05-03'
  },
  {
    id: '3',
    materialNumber: 'MAT-10003',
    name: 'Hydraulic Oil ISO VG 46',
    type: 'Consumable',
    category: 'Fluid',
    unit: 'Liter',
    price: 12.75,
    stock: 10,
    status: 'Low Stock',
    description: 'Premium hydraulic oil for industrial machinery',
    supplier: 'PT Pertamina Lubricants',
    lastUpdated: '2025-05-10'
  },
  {
    id: '4',
    materialNumber: 'MAT-10004',
    name: 'Bearing SKF 6205',
    type: 'Component',
    category: 'Machine Part',
    unit: 'Piece',
    price: 35.60,
    stock: 45,
    status: 'Available',
    description: 'Single row deep groove ball bearing',
    supplier: 'PT SKF Indonesia',
    lastUpdated: '2025-05-08'
  },
  {
    id: '5',
    materialNumber: 'MAT-10005',
    name: 'O-Ring Seal NBR',
    type: 'Component',
    category: 'Machine Part',
    unit: 'Piece',
    price: 2.15,
    stock: 0,
    status: 'Out of Stock',
    description: 'NBR rubber O-ring, size 25x3mm',
    supplier: 'PT Sumi Rubber Indonesia',
    lastUpdated: '2025-05-15'
  },
  {
    id: '6',
    materialNumber: 'MAT-10006',
    name: 'Welding Rod E6013',
    type: 'Consumable',
    category: 'Welding',
    unit: 'Kg',
    price: 18.90,
    stock: 65,
    status: 'Available',
    description: 'General purpose welding electrode for mild steel',
    supplier: 'PT Esabindo Pratama',
    lastUpdated: '2025-05-12'
  }
];

// Mock machines data
export const machines: Machine[] = [
  {
    id: '1',
    assetNumber: 'MACH-2001',
    name: 'CNC Milling Machine',
    model: 'VMC-850',
    manufacturer: 'Haas',
    serialNumber: 'HAS-23456-VM',
    location: 'Production Hall A',
    status: 'Operational',
    purchaseDate: '2023-01-15',
    lastMaintenanceDate: '2025-04-10',
    nextMaintenanceDate: '2025-07-10',
    operatingHours: 3450,
    description: '3-axis vertical machining center with 30-tool ATC'
  },
  {
    id: '2',
    assetNumber: 'MACH-2002',
    name: 'Hydraulic Press',
    model: 'HP-200T',
    manufacturer: 'Hoden Seimitsu',
    serialNumber: 'HS-12345-HP',
    location: 'Production Hall B',
    status: 'Maintenance',
    purchaseDate: '2022-06-20',
    lastMaintenanceDate: '2025-05-01',
    nextMaintenanceDate: '2025-08-01',
    operatingHours: 4650,
    description: '200 ton hydraulic press for metal forming operations'
  },
  {
    id: '3',
    assetNumber: 'MACH-2003',
    name: 'Lathe Machine',
    model: 'SL-30',
    manufacturer: 'Daehan',
    serialNumber: 'DH-34567-LT',
    location: 'Production Hall A',
    status: 'Operational',
    purchaseDate: '2023-09-05',
    lastMaintenanceDate: '2025-03-15',
    nextMaintenanceDate: '2025-06-15',
    operatingHours: 2150,
    description: 'CNC turning center with 12-station turret'
  },
  {
    id: '4',
    assetNumber: 'MACH-2004',
    name: 'Laser Cutting Machine',
    model: 'LCM-3015',
    manufacturer: 'Trumpf',
    serialNumber: 'TM-45678-LC',
    location: 'Production Hall C',
    status: 'Operational',
    purchaseDate: '2024-02-10',
    lastMaintenanceDate: '2025-04-25',
    nextMaintenanceDate: '2025-07-25',
    operatingHours: 1120,
    description: '3kW fiber laser cutting system for sheet metal'
  },
  {
    id: '5',
    assetNumber: 'MACH-2005',
    name: 'Injection Molding Machine',
    model: 'IM-150',
    manufacturer: 'Arburg',
    serialNumber: 'AB-56789-IM',
    location: 'Production Hall B',
    status: 'Breakdown',
    purchaseDate: '2022-12-01',
    lastMaintenanceDate: '2025-02-20',
    nextMaintenanceDate: '2025-05-20',
    operatingHours: 5320,
    description: '150-ton hydraulic injection molding machine'
  },
  {
    id: '6',
    assetNumber: 'MACH-2006',
    name: 'Robotic Welding Cell',
    model: 'RW-200',
    manufacturer: 'Fanuc',
    serialNumber: 'FN-67890-RW',
    location: 'Production Hall C',
    status: 'Standby',
    purchaseDate: '2024-01-20',
    lastMaintenanceDate: '2025-05-05',
    nextMaintenanceDate: '2025-08-05',
    operatingHours: 960,
    description: '6-axis industrial robot with MIG welding system'
  }
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
    case 'Operational':
      return 'bg-green-100 text-green-800';
    case 'Low Stock':
    case 'Maintenance':
    case 'Standby':
      return 'bg-amber-100 text-amber-800';
    case 'Out of Stock':
    case 'Breakdown':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Dashboard metrics
export const dashboardMetrics = {
  materialCount: materials.length,
  machineCount: machines.length,
  materialsOutOfStock: materials.filter(m => m.status === 'Out of Stock').length,
  materialsLowStock: materials.filter(m => m.status === 'Low Stock').length,
  machinesOperational: machines.filter(m => m.status === 'Operational').length,
  machinesInMaintenance: machines.filter(m => m.status === 'Maintenance').length,
  machinesInBreakdown: machines.filter(m => m.status === 'Breakdown').length,
  upcomingMaintenances: 2
};
