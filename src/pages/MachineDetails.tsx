
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Pencil, 
  Trash2,
  Computer,
  MapPin,
  Calendar,
  Tag,
  Clock,
  Hash,
  Clock3,
  Wrench,
  Info,
  Factory
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { machines, getStatusColor } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

const MachineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const machine = machines.find(m => m.id === id);

  if (!machine) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-bold mb-2">Machine Not Found</h2>
        <p className="text-gray-500 mb-4">The machine you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/machines">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Machines
          </Link>
        </Button>
      </div>
    );
  }

  const handleEdit = () => {
    toast({
      title: "Edit Machine",
      description: "This functionality would open a form to edit the machine.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Machine deleted",
      description: "This is a demo - no actual deletion occurred.",
    });
    navigate('/machines');
  };

  const handleMaintenanceRequest = () => {
    toast({
      title: "Maintenance request submitted",
      description: "This is a demo - no actual request was submitted.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/machines">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{machine.name}</h1>
            <p className="text-gray-500">{machine.assetNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Machine Information</CardTitle>
            <CardDescription>Detailed information about this machine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Asset Number</p>
                  <p className="font-medium flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" /> {machine.assetNumber}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="font-medium flex items-center gap-2">
                    <Computer className="h-4 w-4 text-gray-400" /> {machine.name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Model</p>
                  <p className="font-medium">{machine.model}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Manufacturer</p>
                  <p className="font-medium flex items-center gap-2">
                    <Factory className="h-4 w-4 text-gray-400" /> {machine.manufacturer}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Serial Number</p>
                  <p className="font-medium">{machine.serialNumber}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" /> {machine.location}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Operating Hours</p>
                  <p className="font-medium flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-gray-400" /> {machine.operatingHours} hours
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Purchase Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" /> {machine.purchaseDate}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(machine.status)}`}>
                    {machine.status}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1">{machine.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Maintenance</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-gray-400" /> {machine.lastMaintenanceDate}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Next Scheduled Maintenance</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" /> {machine.nextMaintenanceDate}
                  </p>
                </div>
                
                <div className={`p-3 rounded-md flex items-center gap-2 ${
                  new Date(machine.nextMaintenanceDate) <= new Date('2025-05-30')
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-gray-50 text-gray-800 border border-gray-200'
                }`}>
                  <Info className="h-4 w-4" />
                  <p className="text-sm">
                    {new Date(machine.nextMaintenanceDate) <= new Date('2025-05-30')
                      ? 'Maintenance due soon'
                      : 'No immediate maintenance required'}
                  </p>
                </div>
                
                <Button className="w-full" onClick={handleMaintenanceRequest}>
                  <Wrench className="mr-2 h-4 w-4" /> Request Maintenance
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 border rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <Tag className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Machine Manual</p>
                      <p className="text-xs text-gray-500">PDF • 5.2 MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                      <Tag className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Maintenance Records</p>
                      <p className="text-xs text-gray-500">XLSX • 1.3 MB</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MachineDetails;
