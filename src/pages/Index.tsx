
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Computer, BarChart3, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Selamat Datang di Inventory Management System
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Kelola inventaris material dan mesin Anda dengan mudah dan efisien
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/materials')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6 text-blue-600" />
              Materials
            </CardTitle>
            <CardDescription>
              Kelola data material dan stok
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Lihat Materials
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/machines')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Computer className="h-6 w-6 text-green-600" />
              Machines
            </CardTitle>
            <CardDescription>
              Kelola data mesin dan peralatan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Lihat Machines
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/reports')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              Reports
            </CardTitle>
            <CardDescription>
              Lihat laporan dan analisis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Lihat Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-orange-600" />
              Dashboard
            </CardTitle>
            <CardDescription>
              Overview sistem secara keseluruhan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Lihat Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-gray-500">
          Mulai dengan memilih salah satu menu di atas atau gunakan sidebar untuk navigasi
        </p>
      </div>
    </div>
  );
};

export default Index;
