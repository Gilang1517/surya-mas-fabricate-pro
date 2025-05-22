
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
  Eye
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
import { machines, Machine, getStatusColor } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

const Machines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Machine>('assetNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  const handleSort = (column: keyof Machine) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const filteredMachines = machines.filter(machine =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMachines = [...filteredMachines].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDelete = (id: string) => {
    toast({
      title: "Machine deleted",
      description: "This is a demo - no actual deletion occurred.",
    });
  };

  const handleCreateMachine = () => {
    toast({
      title: "Create machine",
      description: "This functionality would open a form to create a new machine.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Machines</h1>
          <p className="text-gray-500">Manage your machine inventory</p>
        </div>
        <Button onClick={handleCreateMachine}>
          <Plus className="mr-2 h-4 w-4" /> Register Machine
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Machines Inventory</CardTitle>
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
              <Button variant="outline" size="sm">
                <FileUp className="mr-2 h-4 w-4" /> Import
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px] cursor-pointer" onClick={() => handleSort('assetNumber')}>
                    <div className="flex items-center">
                      Asset #
                      {sortBy === 'assetNumber' && (
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
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('location')}>
                    <div className="flex items-center">
                      Location
                      {sortBy === 'location' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('manufacturer')}>
                    <div className="flex items-center">
                      Manufacturer
                      {sortBy === 'manufacturer' && (
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMachines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No machines found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedMachines.map((machine) => (
                    <TableRow key={machine.id}>
                      <TableCell className="font-medium">
                        {machine.assetNumber}
                      </TableCell>
                      <TableCell>
                        <Link to={`/machines/${machine.id}`} className="hover:underline text-company-blue">
                          {machine.name}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {machine.location}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {machine.manufacturer}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(machine.status)}`}>
                          {machine.status}
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
                              <Link to={`/machines/${machine.id}`} className="flex items-center w-full">
                                <Eye className="mr-2 h-4 w-4" /> View
                              </Link>
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
            {/* Add pagination here in the future */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Machines;
