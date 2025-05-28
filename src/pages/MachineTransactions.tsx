
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
  Loader2
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
import { useToast } from '@/hooks/use-toast';
import { useMachineTransactions, useCreateMachineTransaction, type MachineTransaction } from '@/hooks/useMachineTransactions';
import { getStatusColor, formatDate } from '@/utils/statusHelpers';
import MachineTransactionForm from '@/components/MachineTransactionForm';

const MachineTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof MachineTransaction>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const { data: transactions = [], isLoading, error } = useMachineTransactions();
  const createTransaction = useCreateMachineTransaction();

  const handleSort = (column: keyof MachineTransaction) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.transaction_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.borrower?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (transaction.machines?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
    if (bValue == null) return sortDirection === 'asc' ? -1 : 1;
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleCreateTransaction = () => {
    setShowForm(true);
  };

  const handleSubmitTransaction = async (data: any) => {
    try {
      const transactionData = {
        transaction_number: data.transaction_number,
        machine_id: data.machine_id,
        transaction_type: data.transaction_type,
        start_date: data.start_date,
        end_date: data.end_date || null,
        borrower: data.borrower || null,
        borrower_department: data.borrower_department || null,
        site_location: data.site_location || null,
        service_type: data.service_type || null,
        service_provider: data.service_provider || null,
        damage_description: data.damage_description || null,
        damage_level: data.damage_level || null,
        repair_cost: data.repair_cost || null,
        notes: data.notes || null,
        status: data.status || 'active',
        created_by: 'Current User'
      };

      await createTransaction.mutateAsync(transactionData);
      toast({
        title: "Transaksi berhasil dibuat",
        description: "Data transaksi mesin telah disimpan ke database.",
      });
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat transaksi. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-600">
          Error loading machine transactions: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Machine Transactions</h1>
          <p className="text-gray-500">Kelola transaksi dan penggunaan mesin</p>
        </div>
        <Button onClick={handleCreateTransaction}>
          <Plus className="mr-2 h-4 w-4" /> Create Transaction
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="relative w-full md:w-auto md:min-w-[320px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
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
                  <TableHead className="w-[150px] cursor-pointer" onClick={() => handleSort('transaction_number')}>
                    <div className="flex items-center">
                      Transaction #
                      {sortBy === 'transaction_number' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('machine_id')}>
                    <div className="flex items-center">
                      Machine
                      {sortBy === 'machine_id' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center cursor-pointer" onClick={() => handleSort('transaction_type')}>
                    <div className="flex items-center justify-center">
                      Type
                      {sortBy === 'transaction_type' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('borrower')}>
                    <div className="flex items-center">
                      Borrower
                      {sortBy === 'borrower' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('start_date')}>
                    <div className="flex items-center">
                      Date
                      {sortBy === 'start_date' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2">Loading transactions...</p>
                    </TableCell>
                  </TableRow>
                ) : sortedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedTransactions.map((transaction) => (
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
                      <TableCell className="text-center">
                        <span className="px-2 py-1 rounded-full text-xs capitalize bg-blue-100 text-blue-800">
                          {transaction.transaction_type.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>
                          <div className="font-medium">{transaction.borrower || '-'}</div>
                          <div className="text-xs text-gray-500">{transaction.borrower_department || ''}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>{formatDate(transaction.start_date)}</div>
                        {transaction.end_date && (
                          <div className="text-xs text-gray-500">to {formatDate(transaction.end_date)}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(transaction.status || 'active')}`}>
                          {transaction.status || 'active'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
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
              Showing <span className="font-medium">{sortedTransactions.length}</span> of{" "}
              <span className="font-medium">{transactions.length}</span> transactions
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <MachineTransactionForm 
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmitTransaction}
        />
      )}
    </div>
  );
};

export default MachineTransactions;
