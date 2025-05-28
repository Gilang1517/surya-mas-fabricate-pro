
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Computer, ArrowUpDown, AlertTriangle, Loader2 } from 'lucide-react';
import { useMaterials } from '@/hooks/useMaterials';
import { useMachines } from '@/hooks/useMachines';
import { useMaterialTransactions } from '@/hooks/useMaterialTransactions';
import { useMachineTransactions } from '@/hooks/useMachineTransactions';

const Dashboard = () => {
  const { data: materials = [], isLoading: materialsLoading } = useMaterials();
  const { data: machines = [], isLoading: machinesLoading } = useMachines();
  const { data: materialTransactions = [], isLoading: materialTxLoading } = useMaterialTransactions();
  const { data: machineTransactions = [], isLoading: machineTxLoading } = useMachineTransactions();

  const lowStockMaterials = materials.filter(m => 
    m.stock !== null && m.minimum_stock !== null && m.stock <= m.minimum_stock
  );

  const activeMachineTransactions = machineTransactions.filter(t => t.status === 'active');

  const isLoading = materialsLoading || machinesLoading || materialTxLoading || machineTxLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Selamat datang di SAP Management System PT. Surya Mas Perkasa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockMaterials.length} items low stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
            <Computer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{machines.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeMachineTransactions.length} currently in use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Material Transactions</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materialTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Total transactions recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Machine Transactions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{machineTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeMachineTransactions.length} active transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockMaterials.length === 0 ? (
              <p className="text-gray-500">Semua material memiliki stok yang cukup</p>
            ) : (
              <div className="space-y-3">
                {lowStockMaterials.slice(0, 5).map((material) => (
                  <div key={material.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-gray-500">{material.material_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        {material.stock} {material.unit}
                      </p>
                      <p className="text-xs text-gray-500">
                        Min: {material.minimum_stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Machine Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {activeMachineTransactions.length === 0 ? (
              <p className="text-gray-500">Tidak ada mesin yang sedang digunakan</p>
            ) : (
              <div className="space-y-3">
                {activeMachineTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{transaction.machines?.name}</p>
                      <p className="text-sm text-gray-500">{transaction.machines?.asset_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{transaction.borrower}</p>
                      <p className="text-xs text-gray-500">
                        Since: {new Date(transaction.start_date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
