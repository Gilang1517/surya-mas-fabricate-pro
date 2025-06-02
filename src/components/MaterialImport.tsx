
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateMaterial } from '@/hooks/useMaterials';

const MaterialImport = () => {
  const { toast } = useToast();
  const createMaterial = useCreateMaterial();
  const [isUploading, setIsUploading] = useState(false);

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "material_number,name,description,category,unit,supplier,minimum_stock,price,type\n" +
      "MAT001,Contoh Material,Deskripsi material,Kategori A,pcs,Supplier A,10,15000,raw_material\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "template_import_material.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Hanya file CSV yang diperbolehkan",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      if (headers.length < 4) {
        throw new Error('Format CSV tidak valid');
      }

      const materials = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 4 && values[0].trim()) {
          materials.push({
            material_number: values[0].trim(),
            name: values[1].trim(),
            description: values[2]?.trim() || '',
            category: values[3]?.trim() || '',
            unit: values[4]?.trim() || 'pcs',
            supplier: values[5]?.trim() || '',
            minimum_stock: parseInt(values[6]) || 0,
            price: parseFloat(values[7]) || 0,
            type: values[8]?.trim() || 'raw_material'
          });
        }
      }

      console.log('Materials to import:', materials);

      for (const material of materials) {
        await createMaterial.mutateAsync(material);
      }

      toast({
        title: "Import berhasil",
        description: `${materials.length} material berhasil diimport`,
      });

      // Reset input
      event.target.value = '';
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Gagal mengimport material: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Material
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Upload File CSV</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Format yang didukung: CSV
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open('/sample-materials.csv', '_blank')}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Contoh Data
          </Button>
        </div>

        {isUploading && (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Mengimport material...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialImport;
