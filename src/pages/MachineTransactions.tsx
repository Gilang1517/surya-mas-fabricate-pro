
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
import { Plus, Eye, Edit, Loader2 } from 'lucide-react';
import QuickActionButtons from '@/components/QuickActionButtons';
import MachineTransactionForm from '@/components/MachineTransactionForm';
import { useMachineTransactions, useCreateMachineTransaction } from '@/hooks/useMachineTransactions';
import { useMachines } from '@/hooks/useMachines';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/statusHelpers';

const MachineTransactions = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('');
  const { toast } = useToast();

  const { data: transactions = [], isLoading: transactionsLoading } = useMachineTransactions();
  const { data: machines = [] } = useMachines();
  const createTransaction = useCreateMachineTransaction();

  const handleQuickAction = (type: string) => {
    setSelectedTransactionType(type);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      await createTransaction.mutateAsync({
        transaction_number: `MT-${Date.now()}`,
        machine_id: data.machineId,
        transaction_type: data.transactionType,
        start_date: data.startDate,
        end_date: data.endDate,
        borrower: data.borrower,
        borrower_department: data.borrowerDepartment,
        site_location: data.siteLocation,
        service_type: data.serviceType,
        service_provider: data.serviceProvider,
        damage_description: data.damageDescription,
        damage_level: data.damageLevel,
        repair_cost: data.repairCost,
        notes: data.notes,
        created_by: 'Current User',
      });

      toast({
        title: "Transaksi berhasil dibuat",
        description: "Data transaksi mesin telah disimpan ke database.",
      });

      setIsFormOpen(false);
      setSelectedTransactionType('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat transaksi. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'local_borrow': return 'Peminjaman Lokal';
      case 'site_borrow': return 'Peminjaman Site';
      case 'service': return 'Service';
      case 'damage_report': return 'Laporan Kerusakan';
      default: return type;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'local_borrow': return 'bg-blue-100 text-blue-800';
      case 'site_borrow': return 'bg-purple-100 text-purple-800';
      case 'service': return 'bg-orange-100 text-orange-800';
      case 'damage_report': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDamageLevelColor = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'completed': return 'Selesai';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
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
                {transactionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2">Loading transactions...</p>
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.transaction_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.machines?.asset_number}</div>
                          <div className="text-sm text-gray-500">{transaction.machines?.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTransactionTypeColor(transaction.transaction_type)}>
                          {getTransactionTypeLabel(transaction.transaction_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status || 'pending')}>
                          {getStatusLabel(transaction.status || 'pending')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{formatDate(transaction.start_date)}</div>
                          {transaction.end_date && (
                            <div className="text-sm text-gray-500">s/d {formatDate(transaction.end_date)}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.borrower || transaction.service_provider || transaction.created_by}
                        {transaction.borrower_department && (
                          <div className="text-sm text-gray-500">{transaction.borrower_department}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.repair_cost ? formatCurrency(transaction.repair_cost) : '-'}
                      </TableCell>
                      <TableCell>
                        {transaction.damage_level ? (
                          <Badge className={getDamageLevelColor(transaction.damage_level)}>
                            {transaction.damage_level === 'low' ? 'Rendah' :
                             transaction.damage_level === 'medium' ? 'Sedang' :
                             transaction.damage_level === 'high' ? 'Tinggi' : 'Kritis'}
                          </Badge>
                        ) : '-'}
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
                  ))
                )}
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
