
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Pencil, 
  Trash2,
  Package,
  Building,
  Calendar,
  Tag,
  Box,
  Hash,
  DollarSign
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
import { materials, getStatusColor } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

const MaterialDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const material = materials.find(m => m.id === id);

  if (!material) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-bold mb-2">Material Not Found</h2>
        <p className="text-gray-500 mb-4">The material you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/materials">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Materials
          </Link>
        </Button>
      </div>
    );
  }

  const handleEdit = () => {
    toast({
      title: "Edit Material",
      description: "This functionality would open a form to edit the material.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Material deleted",
      description: "This is a demo - no actual deletion occurred.",
    });
    navigate('/materials');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/materials">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{material.name}</h1>
            <p className="text-gray-500">{material.materialNumber}</p>
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
            <CardTitle>Material Information</CardTitle>
            <CardDescription>Detailed information about this material</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Material Number</p>
                  <p className="font-medium flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" /> {material.materialNumber}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="font-medium flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" /> {material.name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="font-medium">{material.type}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="font-medium">{material.category}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Unit of Measure</p>
                  <p className="font-medium">{material.unit}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" /> {material.price.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Stock</p>
                  <p className="font-medium flex items-center gap-2">
                    <Box className="h-4 w-4 text-gray-400" /> {material.stock} {material.unit}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(material.status)}`}>
                    {material.status}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1">{material.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{material.supplier}</p>
                    <p className="text-sm text-gray-500">Primary Supplier</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="font-medium flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" /> {material.lastUpdated}
                  </p>
                </div>
                
                <Button variant="outline" className="w-full">
                  View Supplier Details
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
                      <p className="font-medium">Material Specification</p>
                      <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                      <Tag className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Safety Data Sheet</p>
                      <p className="text-xs text-gray-500">PDF • 1.8 MB</p>
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

export default MaterialDetails;
