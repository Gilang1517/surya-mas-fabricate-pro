
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpDown, 
  Search, 
  Filter, 
  Plus, 
  FileDown, 
  FileUp,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
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
import { useMaterials, useDeleteMaterial, type Material } from '@/hooks/useMaterials';
import { getStatusColor, formatCurrency } from '@/utils/statusHelpers';

const Materials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Material>('material_number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  const { data: materials = [], isLoading, error } = useMaterials();
  const deleteMaterial = useDeleteMaterial();

  const handleSort = (column: keyof Material) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.material_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (material.category?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
    if (bValue == null) return sortDirection === 'asc' ? -1 : 1;
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteMaterial.mutateAsync(id);
      toast({
        title: "Material berhasil dihapus",
        description: "Data material telah dihapus dari database.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus material. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const handleCreateMaterial = () => {
    toast({
      title: "Create material",
      description: "Fitur create material akan segera ditambahkan.",
    });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-600">
          Error loading materials: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Materials</h1>
          <p className="text-gray-500">Kelola inventaris material perusahaan</p>
        </div>
        <Button onClick={handleCreateMaterial}>
          <Plus className="mr-2 h-4 w-4" /> Create Material
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Materials Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="relative w-full md:w-auto md:min-w-[320px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search materials..."
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
              <Button variant="outline" size="sm">
                <FileUp className="mr-2 h-4 w-4" /> Import
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] cursor-pointer" onClick={() => handleSort('material_number')}>
                    <div className="flex items-center">
                      Material #
                      {sortBy === 'material_number' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Name
                      {sortBy === 'name' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('category')}>
                    <div className="flex items-center">
                      Category
                      {sortBy === 'category' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-right cursor-pointer" onClick={() => handleSort('stock')}>
                    <div className="flex items-center justify-end">
                      Stock
                      {sortBy === 'stock' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-right">Price</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2">Loading materials...</p>
                    </TableCell>
                  </TableRow>
                ) : sortedMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No materials found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.material_number}
                      </TableCell>
                      <TableCell>
                        <Link to={`/materials/${material.id}`} className="hover:underline text-company-blue">
                          {material.name}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {material.category || '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {material.stock} {material.unit}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {material.price ? formatCurrency(material.price) : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(material.status || 'active')}`}>
                          {material.status || 'active'}
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
                              <Link to={`/materials/${material.id}`} className="flex items-center w-full">
                                <Eye className="mr-2 h-4 w-4" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(material.id)}
                              disabled={deleteMaterial.isPending}
                            >
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
              Showing <span className="font-medium">{sortedMaterials.length}</span> of{" "}
              <span className="font-medium">{materials.length}</span> materials
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Materials;
