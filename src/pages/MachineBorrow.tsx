
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
  Clock,
  MapPin
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
import { useMachineTransactions } from '@/hooks/useMachineTransactions';
import { getStatusColor, formatDate } from '@/utils/statusHelpers';
import MachineTransactionForm from '@/components/MachineTransactionForm';

const MachineBorrow = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const { toast } = useToast();

  const { data: transactions = [], isLoading } = useMachineTransactions();

  // Filter hanya untuk borrowing transactions
  const borrowTransactions = transactions.filter(transaction =>
    transaction.transaction_type === 'local_borrow' || 
    transaction.transaction_type === 'site_borrow'
  );

  const filteredTransactions = borrowTransactions.filter(transaction =>
    transaction.transaction_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.borrower?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (transaction.machines?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleCreateBorrow = (type: string) => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleSubmitTransaction = async (data: any) => {
    try {
      toast({
        title: "Peminjaman berhasil dibuat",
        description: "Data peminjaman mesin telah disimpan ke database.",
      });
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat peminjaman. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Machine Borrow</h1>
          <p className="text-gray-500">Kelola peminjaman mesin internal dan eksternal</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleCreateBorrow('local_borrow')} variant="outline">
            <Clock className="mr-2 h-4 w-4" /> Local Borrow
          </Button>
          <Button onClick={() => handleCreateBorrow('site_borrow')}>
            <MapPin className="mr-2 h-4 w-4" /> Site Borrow
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {borrowTransactions.filter(t => t.status === 'active').length}
            </div>
            <p className="text-sm text-gray-500">Active Borrows</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {borrowTransactions.filter(t => t.status === 'completed').length}
            </div>
            <p className="text-sm text-gray-500">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {borrowTransactions.filter(t => t.transaction_type === 'local_borrow').length}
            </div>
            <p className="text-sm text-gray-500">Local Borrows</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {borrowTransactions.filter(t => t.transaction_type === 'site_borrow').length}
            </div>
            <p className="text-sm text-gray-500">Site Borrows</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Borrow History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="relative w-full md:w-auto md:min-w-[320px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search borrows..."
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
                  <TableHead className="w-[150px]">Transaction #</TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No borrow records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
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
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                          transaction.transaction_type === 'local_borrow' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {transaction.transaction_type === 'local_borrow' ? 'Local' : 'Site'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.borrower || '-'}</div>
                          <div className="text-xs text-gray-500">{transaction.borrower_department || ''}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{formatDate(transaction.start_date)}</div>
                        {transaction.end_date && (
                          <div className="text-xs text-gray-500">to {formatDate(transaction.end_date)}</div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {transaction.site_location || '-'}
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
                              <Trash2 className="mr-2 h-4 w-4" /> Return Machine
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
              Showing <span className="font-medium">{filteredTransactions.length}</span> of{" "}
              <span className="font-medium">{borrowTransactions.length}</span> borrow records
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <MachineTransactionForm 
          transactionType={selectedType}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmitTransaction}
        />
      )}
    </div>
  );
};

export default MachineBorrow;
