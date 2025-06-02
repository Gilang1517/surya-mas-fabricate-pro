
import React, { useState, useMemo } from 'react';
import { 
  Package,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
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
import { useMaterialTransactions } from '@/hooks/useMaterialTransactions';
import { formatCurrency, formatDate } from '@/utils/statusHelpers';

interface MaterialStockChange {
  materialId: string;
  materialNumber: string;
  materialName: string;
  unit: string;
  currentStock: number;
  totalReceipts: number;
  totalIssues: number;
  stockDifference: number;
  totalValue: number;
  price: number;
}

const MaterialStockReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const { data: materials = [] } = useMaterials();
  const { data: transactions = [] } = useMaterialTransactions();

  const reportData = useMemo(() => {
    const now = new Date();
    const periodDays = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : selectedPeriod === '90d' ? 90 : 0;
    const startDate = periodDays > 0 ? new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000)) : null;

    const filteredTransactions = startDate 
      ? transactions.filter(t => new Date(t.transaction_date) >= startDate)
      : transactions;

    const materialStockChanges: MaterialStockChange[] = materials.map(material => {
      const materialTransactions = filteredTransactions.filter(t => t.material_id === material.id);
      
      const totalReceipts = materialTransactions
        .filter(t => t.transaction_type === 'receipt')
        .reduce((sum, t) => sum + t.quantity, 0);
      
      const totalIssues = materialTransactions
        .filter(t => t.transaction_type === 'issue')
        .reduce((sum, t) => sum + Math.abs(t.quantity), 0);
      
      const stockDifference = totalReceipts - totalIssues;
      const currentStock = material.stock || 0;
      const price = material.price || 0;
      const totalValue = currentStock * price;

      return {
        materialId: material.id,
        materialNumber: material.material_number,
        materialName: material.name,
        unit: material.unit,
        currentStock,
        totalReceipts,
        totalIssues,
        stockDifference,
        totalValue,
        price
      };
    });

    return materialStockChanges.sort((a, b) => Math.abs(b.stockDifference) - Math.abs(a.stockDifference));
  }, [materials, transactions, selectedPeriod]);

  const summaryStats = useMemo(() => {
    const totalMaterials = reportData.length;
    const materialsWithIncrease = reportData.filter(m => m.stockDifference > 0).length;
    const materialsWithDecrease = reportData.filter(m => m.stockDifference < 0).length;
    const totalStockValue = reportData.reduce((sum, m) => sum + m.totalValue, 0);
    const totalReceived = reportData.reduce((sum, m) => sum + m.totalReceipts, 0);
    const totalIssued = reportData.reduce((sum, m) => sum + m.totalIssues, 0);

    return {
      totalMaterials,
      materialsWithIncrease,
      materialsWithDecrease,
      totalStockValue,
      totalReceived,
      totalIssued
    };
  }, [reportData]);

  const exportReport = () => {
    console.log('Exporting material stock report...');
    // Implementation for export functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Laporan Selisih Stock Material</h1>
          <p className="text-gray-500">Analisis perubahan stock material berdasarkan penerimaan dan pengeluaran</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedPeriod('7d')}
            className={selectedPeriod === '7d' ? 'bg-blue-50 border-blue-200' : ''}
          >
            7 Hari
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedPeriod('30d')}
            className={selectedPeriod === '30d' ? 'bg-blue-50 border-blue-200' : ''}
          >
            30 Hari
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedPeriod('90d')}
            className={selectedPeriod === '90d' ? 'bg-blue-50 border-blue-200' : ''}
          >
            90 Hari
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedPeriod('all')}
            className={selectedPeriod === 'all' ? 'bg-blue-50 border-blue-200' : ''}
          >
            Semua
          </Button>
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Material</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalMaterials}</div>
            <p className="text-xs text-muted-foreground">Items dalam inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penerimaan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summaryStats.totalReceived}</div>
            <p className="text-xs text-muted-foreground">Unit diterima</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summaryStats.totalIssued}</div>
            <p className="text-xs text-muted-foreground">Unit dikeluarkan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Stock</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalStockValue)}</div>
            <p className="text-xs text-muted-foreground">Total nilai inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Material Stock Changes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Perubahan Stock Material</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead className="text-center">Stock Saat Ini</TableHead>
                <TableHead className="text-center">Penerimaan</TableHead>
                <TableHead className="text-center">Pengeluaran</TableHead>
                <TableHead className="text-center">Selisih</TableHead>
                <TableHead className="text-right">Nilai Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((material) => (
                <TableRow key={material.materialId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{material.materialNumber}</div>
                      <div className="text-sm text-gray-500">{material.materialName}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium">{material.currentStock} {material.unit}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-green-600 font-medium">
                      +{material.totalReceipts} {material.unit}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-red-600 font-medium">
                      -{material.totalIssues} {material.unit}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={`font-medium ${
                      material.stockDifference > 0 
                        ? 'text-green-600' 
                        : material.stockDifference < 0 
                          ? 'text-red-600' 
                          : 'text-gray-600'
                    }`}>
                      {material.stockDifference > 0 ? '+' : ''}{material.stockDifference} {material.unit}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">{formatCurrency(material.totalValue)}</div>
                    <div className="text-xs text-gray-500">
                      @ {formatCurrency(material.price)}/{material.unit}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {material.stockDifference > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Bertambah
                      </span>
                    )}
                    {material.stockDifference < 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        Berkurang
                      </span>
                    )}
                    {material.stockDifference === 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        Tidak Berubah
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {reportData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data material ditemukan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Period Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Periode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summaryStats.materialsWithIncrease}</div>
              <div className="text-sm text-gray-500">Material dengan stock bertambah</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summaryStats.materialsWithDecrease}</div>
              <div className="text-sm text-gray-500">Material dengan stock berkurang</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {summaryStats.totalMaterials - summaryStats.materialsWithIncrease - summaryStats.materialsWithDecrease}
              </div>
              <div className="text-sm text-gray-500">Material tanpa perubahan</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialStockReport;
