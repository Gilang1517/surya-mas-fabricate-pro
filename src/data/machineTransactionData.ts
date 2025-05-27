
export interface MachineTransaction {
  id: string;
  transactionNumber: string;
  machineId: string;
  machineNumber: string;
  machineName: string;
  transactionType: 'local_borrow' | 'site_borrow' | 'service' | 'damage_report';
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  startDate: string;
  endDate?: string;
  borrower?: string;
  borrowerDepartment?: string;
  siteLocation?: string;
  serviceType?: string;
  serviceProvider?: string;
  damageDescription?: string;
  damageLevel: 'low' | 'medium' | 'high' | 'critical';
  repairCost?: number;
  notes?: string;
  createdBy: string;
  createdDate: string;
  updatedDate?: string;
}

export const machineTransactions: MachineTransaction[] = [
  {
    id: '1',
    transactionNumber: 'MT-2024-001',
    machineId: '1',
    machineNumber: 'EXC-001',
    machineName: 'Excavator CAT 320D',
    transactionType: 'local_borrow',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    borrower: 'Ahmad Doe',
    borrowerDepartment: 'Konstruksi',
    notes: 'Peminjaman untuk proyek jalan',
    createdBy: 'Admin',
    createdDate: '2024-01-15',
    damageLevel: 'low'
  },
  {
    id: '2',
    transactionNumber: 'MT-2024-002',
    machineId: '2',
    machineNumber: 'BLD-001',
    machineName: 'Bulldozer D6T',
    transactionType: 'site_borrow',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-02-10',
    borrower: 'Budi Smith',
    borrowerDepartment: 'Operasional',
    siteLocation: 'Site Bekasi - Proyek Perumahan',
    notes: 'Peminjaman ke site untuk land clearing',
    createdBy: 'Admin',
    createdDate: '2024-01-10',
    damageLevel: 'low'
  },
  {
    id: '3',
    transactionNumber: 'MT-2024-003',
    machineId: '1',
    machineNumber: 'EXC-001',
    machineName: 'Excavator CAT 320D',
    transactionType: 'service',
    status: 'completed',
    startDate: '2024-01-05',
    endDate: '2024-01-08',
    serviceType: 'Preventive Maintenance',
    serviceProvider: 'PT. Caterpillar Service',
    repairCost: 15000000,
    notes: 'Service rutin 1000 jam operasi',
    createdBy: 'Teknisi',
    createdDate: '2024-01-05',
    updatedDate: '2024-01-08',
    damageLevel: 'low'
  },
  {
    id: '4',
    transactionNumber: 'MT-2024-004',
    machineId: '3',
    machineNumber: 'CRN-001',
    machineName: 'Mobile Crane 25T',
    transactionType: 'damage_report',
    status: 'pending',
    startDate: '2024-01-12',
    damageDescription: 'Hydraulic boom bocor, perlu penggantian seal',
    damageLevel: 'high',
    repairCost: 25000000,
    notes: 'Mesin tidak dapat beroperasi, perlu perbaikan segera',
    createdBy: 'Operator',
    createdDate: '2024-01-12',
  }
];

export const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case 'local_borrow':
      return 'bg-blue-100 text-blue-800';
    case 'site_borrow':
      return 'bg-purple-100 text-purple-800';
    case 'service':
      return 'bg-green-100 text-green-800';
    case 'damage_report':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getTransactionTypeLabel = (type: string) => {
  switch (type) {
    case 'local_borrow':
      return 'Peminjaman Lokal';
    case 'site_borrow':
      return 'Peminjaman Site';
    case 'service':
      return 'Servis Mesin';
    case 'damage_report':
      return 'Berita Acara Kerusakan';
    default:
      return type;
  }
};

export const getMachineStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getDamageLevelColor = (level: string) => {
  switch (level) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
