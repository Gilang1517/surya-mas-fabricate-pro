
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Database, Settings, Users, FileText, Upload, Table, Edit } from 'lucide-react';
import MaterialImport from '@/components/MaterialImport';
import FormEditor from '@/components/FormEditor';
import TableEditor from '@/components/TableEditor';

const Development = () => {
  const [activeTab, setActiveTab] = useState('materials');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Development Dashboard</h1>
        <p className="text-gray-600 mt-2">Kelola dan kembangkan sistem aplikasi</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="materials">
            <Upload className="w-4 h-4 mr-2" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="forms">
            <FileText className="w-4 h-4 mr-2" />
            Form Editor
          </TabsTrigger>
          <TabsTrigger value="tables">
            <Table className="w-4 h-4 mr-2" />
            Table Editor
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Edit className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-6">
          <MaterialImport />
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          <FormEditor />
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          <TableEditor />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Management</CardTitle>
              <CardDescription>Kelola template sistem dan komponen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">React Component Template</h4>
                  <p className="text-sm text-gray-600 mb-3">Template untuk membuat komponen React baru</p>
                  <div className="text-xs bg-gray-100 p-2 rounded">
                    {`import React from 'react';

interface Props {
  // Define props here
}

const ComponentName: React.FC<Props> = () => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default ComponentName;`}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">API Hook Template</h4>
                  <p className="text-sm text-gray-600 mb-3">Template untuk membuat custom hooks</p>
                  <div className="text-xs bg-gray-100 p-2 rounded">
                    {`import { useQuery } from '@tanstack/react-query';

export const useDataHook = () => {
  return useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      // Fetch logic here
    },
  });
};`}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Page Template</h4>
                  <p className="text-sm text-gray-600 mb-3">Template untuk membuat halaman baru</p>
                  <div className="text-xs bg-gray-100 p-2 rounded">
                    {`import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PageName = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Page Title</h1>
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Page content */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PageName;`}
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Konfigurasi sistem dan pengaturan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Environment Variables</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>VITE_SUPABASE_URL</span>
                      <span className="text-green-600">✓ Set</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VITE_SUPABASE_ANON_KEY</span>
                      <span className="text-green-600">✓ Set</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Application Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>App Version</span>
                      <span>1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Build Mode</span>
                      <span>Development</span>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management Tools</CardTitle>
              <CardDescription>Tools untuk mengelola pengguna dan permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Role Editor</h4>
                  <p className="text-sm text-gray-600 mb-3">Buat dan kelola role pengguna</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Admin</span>
                      <span className="text-xs text-gray-500">Full Access</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Editor</span>
                      <span className="text-xs text-gray-500">Edit Content</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>User</span>
                      <span className="text-xs text-gray-500">View Only</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Permission Matrix</h4>
                  <p className="text-sm text-gray-600 mb-3">Matrix hak akses per module</p>
                  <div className="text-xs">
                    <div className="grid grid-cols-4 gap-1 mb-1 font-semibold">
                      <span>Module</span>
                      <span>Admin</span>
                      <span>Editor</span>
                      <span>User</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-center">
                      <span className="text-left">Materials</span>
                      <span className="text-green-600">✓</span>
                      <span className="text-green-600">✓</span>
                      <span className="text-yellow-600">R</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-center">
                      <span className="text-left">Reports</span>
                      <span className="text-green-600">✓</span>
                      <span className="text-green-600">✓</span>
                      <span className="text-yellow-600">R</span>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Development;
