
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
  Trash2
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
import { materialTransactions, MaterialTransaction, getTransactionTypeColor, getStatusColor } from '@/data/transactionData';
import { useToast } from '@/hooks/use-toast';
import TransactionForm from '@/components/TransactionForm';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof MaterialTransaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleSort = (column: keyof MaterialTransaction) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredTransactions = materialTransactions.filter(transaction =>
    transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.materialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.transactionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = (id: string) => {
    toast({
      title: "Transaction deleted",
      description: "This is a demo - no actual deletion occurred.",
    });
  };

  const handleCreateTransaction = () => {
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Material Transactions</h1>
          <p className="text-gray-500">Manage material movements and transactions</p>
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
                  <TableHead className="w-[150px] cursor-pointer" onClick={() => handleSort('transactionNumber')}>
                    <div className="flex items-center">
                      Transaction #
                      {sortBy === 'transactionNumber' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('materialNumber')}>
                    <div className="flex items-center">
                      Material
                      {sortBy === 'materialNumber' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center cursor-pointer" onClick={() => handleSort('transactionType')}>
                    <div className="flex items-center justify-center">
                      Type
                      {sortBy === 'transactionType' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort('quantity')}>
                    <div className="flex items-center justify-end">
                      Quantity
                      {sortBy === 'quantity' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('date')}>
                    <div className="flex items-center">
                      Date
                      {sortBy === 'date' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions found
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
                          <div className="font-medium">{transaction.materialNumber}</div>
                          <div className="text-sm text-gray-500">{transaction.materialName}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${getTransactionTypeColor(transaction.transactionType)}`}>
                          {transaction.transactionType}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-medium">
                          {transaction.quantity > 0 ? '+' : ''}{transaction.quantity} {transaction.unit}
                        </div>
                        <div className="text-xs text-gray-500">MT: {transaction.movementType}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>{transaction.date}</div>
                        <div className="text-xs text-gray-500">{transaction.time}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
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
                            <DropdownMenuItem onClick={() => handleDelete(transaction.id)}>
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
              <span className="font-medium">{materialTransactions.length}</span> transactions
            </div>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <TransactionForm 
          onClose={() => setShowForm(false)}
          onSubmit={(data) => {
            console.log('Transaction data:', data);
            toast({
              title: "Transaction created",
              description: "This is a demo - no actual creation occurred.",
            });
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Transactions;
