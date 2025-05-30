
import React, { useState } from 'react';
import { 
  Package, 
  Computer, 
  AlertTriangle,
  Search,
  Filter,
  FileDown,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMaterials } from '@/hooks/useMaterials';
import { useMachines } from '@/hooks/useMachines';
import { getStatusColor, formatCurrency } from '@/utils/statusHelpers';

const StockControl = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'materials' | 'machines'>('materials');

  const { data: materials = [] } = useMaterials();
  const { data: machines = [] } = useMachines();

  // Calculate stock metrics for materials
  const totalMaterialStock = materials.reduce((total, material) => total + (material.stock || 0), 0);
  const lowStockMaterials = materials.filter(material => 
    (material.stock || 0) <= (material.minimum_stock || 0)
  );
  const outOfStockMaterials = materials.filter(material => (material.stock || 0) === 0);
  const totalMaterialValue = materials.reduce((total, material) => 
    total + ((material.stock || 0) * (material.price || 0)), 0
  );

  // Calculate metrics for machines
  const operationalMachines = machines.filter(machine => machine.status === 'operational');
  const maintenanceMachines = machines.filter(machine => machine.status === 'maintenance');
  const totalMachineValue = machines.reduce((total, machine) => 
    total + (machine.purchase_price || 0), 0
  );

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.material_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMachines = machines.filter(machine =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.asset_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (current: number, minimum: number) => {
    if (current === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (current <= minimum) return { label: 'Low Stock', color: 'bg-orange-100 text-orange-800' };
    if (current <= minimum * 2) return { label: 'Medium Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const getMachineAvailability = (status: string) => {
    switch (status) {
      case 'operational':
        return { label: 'Available', color: 'bg-green-100 text-green-800' };
      case 'maintenance':
        return { label: 'In Maintenance', color: 'bg-orange-100 text-orange-800' };
      case 'out_of_service':
        return { label: 'Out of Service', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Stock Control</h1>
          <p className="text-gray-500">Monitor and control actual stock levels for materials and machines</p>
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

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Material Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaterialStock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {materials.length} different materials
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {lowStockMaterials.length + outOfStockMaterials.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {outOfStockMaterials.length} out of stock, {lowStockMaterials.length} low stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Material Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMaterialValue)}</div>
            <p className="text-xs text-muted-foreground">
              Total inventory value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Machine Status</CardTitle>
            <Computer className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{operationalMachines.length}</div>
            <p className="text-xs text-muted-foreground">
              {maintenanceMachines.length} in maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Stock Alerts */}
      {(outOfStockMaterials.length > 0 || lowStockMaterials.length > 0) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outOfStockMaterials.length > 0 && (
              <div className="mb-4">
                <p className="text-red-700 font-medium mb-2">
                  {outOfStockMaterials.length} materials are completely out of stock:
                </p>
                <div className="space-y-1">
                  {outOfStockMaterials.slice(0, 3).map(material => (
                    <div key={material.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{material.name}</span>
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  ))}
                  {outOfStockMaterials.length > 3 && (
                    <p className="text-sm text-red-600">
                      +{outOfStockMaterials.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}
            {lowStockMaterials.length > 0 && (
              <div>
                <p className="text-orange-700 font-medium mb-2">
                  {lowStockMaterials.length} materials are running low:
                </p>
                <div className="space-y-1">
                  {lowStockMaterials.slice(0, 3).map(material => (
                    <div key={material.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{material.name}</span>
                      <span className="text-orange-600">
                        {material.stock} / {material.minimum_stock} {material.unit}
                      </span>
                    </div>
                  ))}
                  {lowStockMaterials.length > 3 && (
                    <p className="text-sm text-orange-600">
                      +{lowStockMaterials.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stock Control Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Stock Control Details</CardTitle>
            <div className="flex space-x-1">
              <Button 
                variant={selectedTab === 'materials' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedTab('materials')}
              >
                <Package className="mr-2 h-4 w-4" />
                Materials
              </Button>
              <Button 
                variant={selectedTab === 'machines' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedTab('machines')}
              >
                <Computer className="mr-2 h-4 w-4" />
                Machines
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative w-full md:w-auto md:min-w-[320px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${selectedTab}...`}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectedTab === 'materials' ? (
                    <>
                      <TableHead>Material #</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Category</TableHead>
                      <TableHead className="text-right">Current Stock</TableHead>
                      <TableHead className="text-right">Min. Stock</TableHead>
                      <TableHead className="text-right">Stock Value</TableHead>
                      <TableHead className="text-center">Stock Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Asset #</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Manufacturer</TableHead>
                      <TableHead className="text-center">Location</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-center">Availability</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTab === 'materials' ? (
                  filteredMaterials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No materials found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMaterials.map((material) => {
                      const stockStatus = getStockStatus(material.stock || 0, material.minimum_stock || 0);
                      return (
                        <TableRow key={material.id}>
                          <TableCell className="font-medium">{material.material_number}</TableCell>
                          <TableCell>{material.name}</TableCell>
                          <TableCell className="text-center">{material.category || '-'}</TableCell>
                          <TableCell className="text-right">
                            <span className={material.stock === 0 ? 'text-red-600 font-medium' : 
                                           material.stock && material.minimum_stock && material.stock <= material.minimum_stock ? 'text-orange-600 font-medium' : ''}>
                              {material.stock} {material.unit}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{material.minimum_stock} {material.unit}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency((material.stock || 0) * (material.price || 0))}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={stockStatus.color}>
                              {stockStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center space-x-1">
                              <Button size="sm" variant="outline">
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Minus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )
                ) : (
                  filteredMachines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No machines found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMachines.map((machine) => {
                      const availability = getMachineAvailability(machine.status || 'operational');
                      return (
                        <TableRow key={machine.id}>
                          <TableCell className="font-medium">{machine.asset_number}</TableCell>
                          <TableCell>{machine.name}</TableCell>
                          <TableCell className="text-center">{machine.manufacturer || '-'}</TableCell>
                          <TableCell className="text-center">{machine.location || '-'}</TableCell>
                          <TableCell className="text-right">
                            {machine.purchase_price ? formatCurrency(machine.purchase_price) : '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={availability.color}>
                              {availability.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockControl;
