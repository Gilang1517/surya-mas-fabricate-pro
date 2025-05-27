
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit } from 'lucide-react';
import QuickActionButtons from '@/components/QuickActionButtons';
import MachineTransactionForm from '@/components/MachineTransactionForm';
import { 
  machineTransactions,
  getTransactionTypeColor,
  getTransactionTypeLabel,
  getMachineStatusColor,
  getDamageLevelColor,
  type MachineTransaction 
} from '@/data/machineTransactionData';

const MachineTransactions = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('');
  const [transactions, setTransactions] = useState<MachineTransaction[]>(machineTransactions);

  const handleQuickAction = (type: string) => {
    setSelectedTransactionType(type);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    const newTransaction: MachineTransaction = {
      id: String(transactions.length + 1),
      transactionNumber: `MT-2024-${String(transactions.length + 1).padStart(3, '0')}`,
      machineId: data.machineId,
      machineNumber: getMachineNumber(data.machineId),
      machineName: getMachineName(data.machineId),
      transactionType: data.transactionType,
      status: data.transactionType === 'damage_report' ? 'pending' : 'active',
      startDate: data.startDate,
      endDate: data.endDate,
      borrower: data.borrower,
      borrowerDepartment: data.borrowerDepartment,
      siteLocation: data.siteLocation,
      serviceType: data.serviceType,
      serviceProvider: data.serviceProvider,
      damageDescription: data.damageDescription,
      damageLevel: data.damageLevel || 'low',
      repairCost: data.repairCost,
      notes: data.notes,
      createdBy: 'Current User',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setTransactions([newTransaction, ...transactions]);
    setIsFormOpen(false);
    setSelectedTransactionType('');
  };

  const getMachineNumber = (machineId: string) => {
    const machines = {
      '1': 'EXC-001',
      '2': 'BLD-001',
      '3': 'CRN-001',
      '4': 'GDR-001',
    };
    return machines[machineId as keyof typeof machines] || 'Unknown';
  };

  const getMachineName = (machineId: string) => {
    const machines = {
      '1': 'Excavator CAT 320D',
      '2': 'Bulldozer D6T',
      '3': 'Mobile Crane 25T',
      '4': 'Motor Grader 140M',
    };
    return machines[machineId as keyof typeof machines] || 'Unknown Machine';
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaksi Mesin</h1>
          <p className="text-gray-600 mt-1">Kelola semua transaksi mesin perusahaan</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tambah Transaksi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickActionButtons onQuickAction={handleQuickAction} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Transaksi</TableHead>
                  <TableHead>Mesin</TableHead>
                  <TableHead>Jenis Transaksi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Peminjam/PIC</TableHead>
                  <TableHead>Biaya</TableHead>
                  <TableHead>Level Kerusakan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.transactionNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.machineNumber}</div>
                        <div className="text-sm text-gray-500">{transaction.machineName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTransactionTypeColor(transaction.transactionType)}>
                        {getTransactionTypeLabel(transaction.transactionType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getMachineStatusColor(transaction.status)}>
                        {transaction.status === 'active' ? 'Aktif' :
                         transaction.status === 'completed' ? 'Selesai' :
                         transaction.status === 'pending' ? 'Pending' : 'Dibatalkan'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{transaction.startDate}</div>
                        {transaction.endDate && (
                          <div className="text-sm text-gray-500">s/d {transaction.endDate}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.borrower || transaction.serviceProvider || transaction.createdBy}
                      {transaction.borrowerDepartment && (
                        <div className="text-sm text-gray-500">{transaction.borrowerDepartment}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(transaction.repairCost)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getDamageLevelColor(transaction.damageLevel)}>
                        {transaction.damageLevel === 'low' ? 'Rendah' :
                         transaction.damageLevel === 'medium' ? 'Sedang' :
                         transaction.damageLevel === 'high' ? 'Tinggi' : 'Kritis'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <MachineTransactionForm
          transactionType={selectedTransactionType}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedTransactionType('');
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default MachineTransactions;
