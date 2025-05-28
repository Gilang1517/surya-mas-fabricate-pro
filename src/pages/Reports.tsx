
import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Package,
  Computer,
  ArrowRightLeft,
  FileText
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
import { Button } from '@/components/ui/button';
import { useMaterials } from '@/hooks/useMaterials';
import { useMachines } from '@/hooks/useMachines';
import { useMaterialTransactions } from '@/hooks/useMaterialTransactions';
import { useMachineTransactions } from '@/hooks/useMachineTransactions';
import { formatCurrency, formatDate } from '@/utils/statusHelpers';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<'overview' | 'materials' | 'machines' | 'transactions'>('overview');

  const { data: materials = [] } = useMaterials();
  const { data: machines = [] } = useMachines();
  const { data: materialTransactions = [] } = useMaterialTransactions();
  const { data: machineTransactions = [] } = useMachineTransactions();

  // Calculate report metrics
  const totalMaterialValue = materials.reduce((total, material) => 
    total + ((material.stock || 0) * (material.price || 0)), 0
  );

  const totalMachineValue = machines.reduce((total, machine) => 
    total + (machine.purchase_price || 0), 0
  );

  const activeMaterials = materials.filter(m => m.status === 'active').length;
  const operationalMachines = machines.filter(m => m.status === 'operational').length;

  const recentMaterialTransactions = materialTransactions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const recentMachineTransactions = machineTransactions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  // Material categories summary
  const materialsByCategory = materials.reduce((acc, material) => {
    const category = material.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { count: 0, value: 0 };
    }
    acc[category].count++;
    acc[category].value += (material.stock || 0) * (material.price || 0);
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  // Machine status summary
  const machinesByStatus = machines.reduce((acc, machine) => {
    const status = machine.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exportReport = (type: string) => {
    // Placeholder for export functionality
    console.log(`Exporting ${type} report`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500">Analisis dan laporan komprehensif untuk inventory management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" /> Date Range
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportReport(selectedReport)}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button 
          variant={selectedReport === 'overview' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setSelectedReport('overview')}
          className="flex-1"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Overview
        </Button>
        <Button 
          variant={selectedReport === 'materials' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setSelectedReport('materials')}
          className="flex-1"
        >
          <Package className="mr-2 h-4 w-4" />
          Materials
        </Button>
        <Button 
          variant={selectedReport === 'machines' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setSelectedReport('machines')}
          className="flex-1"
        >
          <Computer className="mr-2 h-4 w-4" />
          Machines
        </Button>
        <Button 
          variant={selectedReport === 'transactions' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setSelectedReport('transactions')}
          className="flex-1"
        >
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Transactions
        </Button>
      </div>

      {/* Overview Report */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalMaterialValue + totalMachineValue)}</div>
                <p className="text-xs text-muted-foreground">Materials + Machines</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Materials</CardTitle>
                <Package className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeMaterials}</div>
                <p className="text-xs text-muted-foreground">of {materials.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operational Machines</CardTitle>
                <Computer className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationalMachines}</div>
                <p className="text-xs text-muted-foreground">of {machines.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <ArrowRightLeft className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materialTransactions.length + machineTransactions.length}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Materials by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(materialsByCategory).map(([category, data]) => (
                    <div key={category} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{category}</p>
                        <p className="text-sm text-gray-500">{data.count} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(data.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Machines by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(machinesByStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium capitalize">{status}</p>
                        <p className="text-sm text-gray-500">{count} machines</p>
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / machines.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Materials Report */}
      {selectedReport === 'materials' && (
        <Card>
          <CardHeader>
            <CardTitle>Materials Inventory Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.material_number}</TableCell>
                    <TableCell>{material.name}</TableCell>
                    <TableCell>{material.category || '-'}</TableCell>
                    <TableCell className="text-right">{material.stock} {material.unit}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency((material.stock || 0) * (material.price || 0))}
                    </TableCell>
                    <TableCell>{material.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Machines Report */}
      {selectedReport === 'machines' && (
        <Card>
          <CardHeader>
            <CardTitle>Machines Asset Report</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Purchase Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.asset_number}</TableCell>
                    <TableCell>{machine.name}</TableCell>
                    <TableCell>{machine.manufacturer || '-'}</TableCell>
                    <TableCell>{machine.location || '-'}</TableCell>
                    <TableCell className="text-right">
                      {machine.purchase_price ? formatCurrency(machine.purchase_price) : '-'}
                    </TableCell>
                    <TableCell>{machine.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Transactions Report */}
      {selectedReport === 'transactions' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Material Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction #</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMaterialTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.transaction_number}</TableCell>
                      <TableCell>{transaction.materials?.name}</TableCell>
                      <TableCell className="capitalize">{transaction.transaction_type}</TableCell>
                      <TableCell className="text-right">
                        {transaction.quantity > 0 ? '+' : ''}{transaction.quantity} {transaction.unit}
                      </TableCell>
                      <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
                      <TableCell>{transaction.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Machine Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction #</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMachineTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.transaction_number}</TableCell>
                      <TableCell>{transaction.machines?.name}</TableCell>
                      <TableCell className="capitalize">{transaction.transaction_type.replace('_', ' ')}</TableCell>
                      <TableCell>{transaction.borrower || '-'}</TableCell>
                      <TableCell>{formatDate(transaction.start_date)}</TableCell>
                      <TableCell>{transaction.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Reports;
