
import React, { useState } from 'react';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Search,
  Filter,
  FileDown
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
import { useMaterials } from '@/hooks/useMaterials';
import { useMachines } from '@/hooks/useMachines';
import { getStatusColor, formatCurrency } from '@/utils/statusHelpers';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'materials' | 'machines'>('materials');

  const { data: materials = [] } = useMaterials();
  const { data: machines = [] } = useMachines();

  // Calculate inventory metrics
  const lowStockMaterials = materials.filter(material => 
    (material.stock || 0) <= (material.minimum_stock || 0)
  );

  const activeMachines = machines.filter(machine => machine.status === 'operational');
  const maintenanceMachines = machines.filter(machine => machine.status === 'maintenance');

  const totalMaterialValue = materials.reduce((total, material) => 
    total + ((material.stock || 0) * (material.price || 0)), 0
  );

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.material_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMachines = machines.filter(machine =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.asset_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">Monitor dan kelola inventaris materials dan machines</p>
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

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">
              Active materials in inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockMaterials.length}</div>
            <p className="text-xs text-muted-foreground">
              Items below minimum stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMaterialValue)}</div>
            <p className="text-xs text-muted-foreground">
              Current stock value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Machines</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeMachines.length}</div>
            <p className="text-xs text-muted-foreground">
              {maintenanceMachines.length} in maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockMaterials.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-3">
              {lowStockMaterials.length} materials are running low on stock and need replenishment.
            </p>
            <div className="space-y-2">
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
          </CardContent>
        </Card>
      )}

      {/* Inventory Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory Details</CardTitle>
            <div className="flex space-x-1">
              <Button 
                variant={selectedTab === 'materials' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedTab('materials')}
              >
                Materials
              </Button>
              <Button 
                variant={selectedTab === 'machines' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedTab('machines')}
              >
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
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Min. Stock</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Asset #</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Manufacturer</TableHead>
                      <TableHead className="text-center">Location</TableHead>
                      <TableHead className="text-right">Purchase Price</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTab === 'materials' ? (
                  filteredMaterials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No materials found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.material_number}</TableCell>
                        <TableCell>{material.name}</TableCell>
                        <TableCell className="text-center">{material.category || '-'}</TableCell>
                        <TableCell className="text-right">
                          <span className={material.stock && material.minimum_stock && material.stock <= material.minimum_stock ? 'text-orange-600 font-medium' : ''}>
                            {material.stock} {material.unit}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{material.minimum_stock} {material.unit}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency((material.stock || 0) * (material.price || 0))}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(material.status || 'active')}`}>
                            {material.status || 'active'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                ) : (
                  filteredMachines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No machines found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMachines.map((machine) => (
                      <TableRow key={machine.id}>
                        <TableCell className="font-medium">{machine.asset_number}</TableCell>
                        <TableCell>{machine.name}</TableCell>
                        <TableCell className="text-center">{machine.manufacturer || '-'}</TableCell>
                        <TableCell className="text-center">{machine.location || '-'}</TableCell>
                        <TableCell className="text-right">
                          {machine.purchase_price ? formatCurrency(machine.purchase_price) : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(machine.status || 'operational')}`}>
                            {machine.status || 'operational'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
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

export default Inventory;
