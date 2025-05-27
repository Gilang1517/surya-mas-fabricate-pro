
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  FileDown, 
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Wrench,
  MapPin,
  Building,
  AlertTriangle
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  machineTransactions, 
  MachineTransaction, 
  getTransactionTypeColor, 
  getTransactionTypeLabel,
  getMachineStatusColor,
  getDamageLevelColor
} from '@/data/machineTransactionData';
import { useToast } from '@/hooks/use-toast';
import MachineTransactionForm from '@/components/MachineTransactionForm';
import QuickActionButtons from '@/components/QuickActionButtons';

const MachineTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof MachineTransaction>('createdDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('');
  const { toast } = useToast();

  const handleSort = (column: keyof MachineTransaction) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredTransactions = machineTransactions.filter(transaction =>
    transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.machineNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.borrower?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getTransactionTypeLabel(transaction.transactionType).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = (id: string) => {
    toast({
      title: "Transaksi dihapus",
      description: "Ini adalah demo - tidak ada penghapusan yang terjadi.",
    });
  };

  const handleQuickAction = (type: string) => {
    setSelectedTransactionType(type);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Transaksi Mesin</h1>
          <p className="text-gray-500">Kelola peminjaman dan transaksi mesin</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Buat Transaksi
        </Button>
      </div>

      <QuickActionButtons onQuickAction={handleQuickAction} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Riwayat Transaksi Mesin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="relative w-full md:w-auto md:min-w-[320px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari transaksi..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px] cursor-pointer" onClick={() => handleSort('transactionNumber')}>
                    <div className="flex items-center">
                      No. Transaksi
                      {sortBy === 'transactionNumber' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('machineNumber')}>
                    <div className="flex items-center">
                      Mesin
                      {sortBy === 'machineNumber' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center cursor-pointer" onClick={() => handleSort('transactionType')}>
                    <div className="flex items-center justify-center">
                      Jenis Transaksi
                      {sortBy === 'transactionType' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('borrower')}>
                    <div className="flex items-center">
                      Peminjam/PIC
                      {sortBy === 'borrower' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('startDate')}>
                    <div className="flex items-center">
                      Tanggal
                      {sortBy === 'startDate' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Tidak ada transaksi ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedTransactions.map((transaction) => (
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
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${getTransactionTypeColor(transaction.transactionType)}`}>
                            {getTransactionTypeLabel(transaction.transactionType)}
                          </span>
                          {transaction.damageLevel && transaction.transactionType === 'damage_report' && (
                            <span className={`px-2 py-1 rounded-full text-xs ${getDamageLevelColor(transaction.damageLevel)}`}>
                              Level {transaction.damageLevel}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>
                          <div className="font-medium">{transaction.borrower || transaction.serviceProvider || 'N/A'}</div>
                          <div className="text-xs text-gray-500">
                            {transaction.borrowerDepartment || transaction.serviceType || ''}
                          </div>
                          {transaction.siteLocation && (
                            <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {transaction.siteLocation}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>{transaction.startDate}</div>
                        {transaction.endDate && (
                          <div className="text-xs text-gray-500">s/d {transaction.endDate}</div>
                        )}
                        <div className="text-xs text-gray-500">{transaction.createdDate}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${getMachineStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> Lihat Detail
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(transaction.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-gray-500">
              Menampilkan <span className="font-medium">{sortedTransactions.length}</span> dari{" "}
              <span className="font-medium">{machineTransactions.length}</span> transaksi
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <MachineTransactionForm 
          transactionType={selectedTransactionType}
          onClose={() => {
            setShowForm(false);
            setSelectedTransactionType('');
          }}
          onSubmit={(data) => {
            console.log('Machine transaction data:', data);
            toast({
              title: "Transaksi berhasil dibuat",
              description: "Ini adalah demo - tidak ada data yang disimpan.",
            });
            setShowForm(false);
            setSelectedTransactionType('');
          }}
        />
      )}
    </div>
  );
};

export default MachineTransactions;
