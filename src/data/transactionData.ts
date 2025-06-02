
export interface MaterialTransaction {
  id: string;
  transactionNumber: string;
  materialId: string;
  materialNumber: string;
  materialName: string;
  transactionType: 'penerimaan' | 'pemakaian' | 'pengembalian' | 'reject' | 'pengaturan';
  quantity: number;
  unit: string;
  movementType: string;
  plant: string;
  storageLocation: string;
  referenceDocument?: string;
  costCenter?: string;
  date: string;
  time: string;
  createdBy: string;
  status: 'posted' | 'pending' | 'cancelled';
  notes?: string;
}

export const materialTransactions: MaterialTransaction[] = [
  {
    id: '1',
    transactionNumber: 'TR-2024-001',
    materialId: '1',
    materialNumber: 'MAT-001',
    materialName: 'Steel Rod 12mm',
    transactionType: 'penerimaan',
    quantity: 100,
    unit: 'PCS',
    movementType: 'penerimaan',
    plant: 'P001',
    storageLocation: 'SL01',
    referenceDocument: 'PO-2024-001',
    costCenter: 'CC-PROD',
    date: '2024-01-15',
    time: '10:30',
    createdBy: 'Ahmad Doe',
    status: 'posted',
    notes: 'Penerimaan barang dari supplier'
  },
  {
    id: '2',
    transactionNumber: 'TR-2024-002',
    materialId: '2',
    materialNumber: 'MAT-002',
    materialName: 'Concrete Mix',
    transactionType: 'pemakaian',
    quantity: 50,
    unit: 'KG',
    movementType: 'pemakaian',
    plant: 'P001',
    storageLocation: 'SL01',
    referenceDocument: 'WO-2024-001',
    costCenter: 'CC-MAINT',
    date: '2024-01-14',
    time: '14:15',
    createdBy: 'Budi Smith',
    status: 'posted',
    notes: 'Pemakaian material untuk pekerjaan maintenance'
  },
  {
    id: '3',
    transactionNumber: 'TR-2024-003',
    materialId: '3',
    materialNumber: 'MAT-003',
    materialName: 'Hydraulic Oil',
    transactionType: 'pengembalian',
    quantity: 25,
    unit: 'L',
    movementType: 'pengembalian',
    plant: 'P001',
    storageLocation: 'SL02',
    costCenter: 'CC-PROD',
    date: '2024-01-13',
    time: '09:45',
    createdBy: 'Siti Johnson',
    status: 'posted',
    notes: 'Pengembalian material tidak terpakai'
  },
  {
    id: '4',
    transactionNumber: 'TR-2024-004',
    materialId: '1',
    materialNumber: 'MAT-001',
    materialName: 'Steel Rod 12mm',
    transactionType: 'reject',
    quantity: -5,
    unit: 'PCS',
    movementType: 'reject',
    plant: 'P001',
    storageLocation: 'SL01',
    costCenter: 'CC-ADMIN',
    date: '2024-01-12',
    time: '16:20',
    createdBy: 'Rahman Lee',
    status: 'posted',
    notes: 'Material reject - barang rusak'
  },
  {
    id: '5',
    transactionNumber: 'TR-2024-005',
    materialId: '4',
    materialNumber: 'MAT-004',
    materialName: 'Bearing SKF 6208',
    transactionType: 'pengaturan',
    quantity: 20,
    unit: 'PCS',
    movementType: 'pengaturan',
    plant: 'P001',
    storageLocation: 'SL01',
    referenceDocument: 'ADJ-2024-001',
    costCenter: 'CC-MAINT',
    date: '2024-01-11',
    time: '11:00',
    createdBy: 'Ahmad Doe',
    status: 'pending',
    notes: 'Penyesuaian stock inventory'
  }
];

export const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case 'penerimaan':
      return 'bg-green-100 text-green-800';
    case 'pemakaian':
      return 'bg-red-100 text-red-800';
    case 'pengembalian':
      return 'bg-blue-100 text-blue-800';
    case 'reject':
      return 'bg-orange-100 text-orange-800';
    case 'pengaturan':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'posted':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
