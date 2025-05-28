
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
import { useToast } from '@/hooks/use-toast';
import { useMachines, type Machine } from '@/hooks/useMachines';
import { getStatusColor, formatDate } from '@/utils/statusHelpers';
import CreateMachineForm from '@/components/CreateMachineForm';

const Machines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Machine>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const { data: machines = [], isLoading, error } = useMachines();

  const handleSort = (column: keyof Machine) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredMachines = machines.filter(machine =>
    machine.asset_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (machine.manufacturer && machine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (machine.location && machine.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedMachines = [...filteredMachines].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
    if (bValue == null) return sortDirection === 'asc' ? -1 : 1;
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = (id: string) => {
    toast({
      title: "Machine deleted",
      description: "This is a demo - no actual deletion occurred.",
    });
  };

  const handleRegisterMachine = () => {
    setShowForm(true);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-600">
          Error loading machines: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Machines</h1>
          <p className="text-gray-500">Manage heavy equipment and machinery</p>
        </div>
        <Button onClick={handleRegisterMachine}>
          <Plus className="mr-2 h-4 w-4" /> Register Machine
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Machine List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="relative w-full md:w-auto md:min-w-[320px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search machines..."
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
                  <TableHead className="w-[150px] cursor-pointer" onClick={() => handleSort('asset_number')}>
                    <div className="flex items-center">
                      Asset Number
                      {sortBy === 'asset_number' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Machine Name
                      {sortBy === 'name' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('manufacturer')}>
                    <div className="flex items-center">
                      Manufacturer
                      {sortBy === 'manufacturer' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('location')}>
                    <div className="flex items-center">
                      Location
                      {sortBy === 'location' && (
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : sortedMachines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No machines found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedMachines.map((machine) => (
                    <TableRow key={machine.id}>
                      <TableCell className="font-medium">
                        {machine.asset_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{machine.name}</div>
                          <div className="text-sm text-gray-500">{machine.model}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {machine.manufacturer || '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {machine.location || '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(machine.status || 'operational')}`}>
                          {machine.status || 'operational'}
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
                            <DropdownMenuItem onClick={() => handleDelete(machine.id)}>
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
              Showing <span className="font-medium">{sortedMachines.length}</span> of{" "}
              <span className="font-medium">{machines.length}</span> machines
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateMachineForm 
        open={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
};

export default Machines;
