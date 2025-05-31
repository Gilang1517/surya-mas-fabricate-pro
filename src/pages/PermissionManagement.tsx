
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Key, Settings } from 'lucide-react';
import PermissionGuard from '@/components/PermissionGuard';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
  created_at: string;
}

interface RolePermission {
  id: string;
  role: 'admin' | 'user';
  permission_id: string;
  permissions: Permission;
}

const PermissionManagement = () => {
  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['all-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('module', { ascending: true });
      
      if (error) throw error;
      return data as Permission[];
    },
  });

  const { data: rolePermissions, isLoading: rolePermissionsLoading } = useQuery({
    queryKey: ['role-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          *,
          permissions (*)
        `)
        .order('role', { ascending: true });
      
      if (error) throw error;
      return data as RolePermission[];
    },
  });

  if (permissionsLoading || rolePermissionsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manajemen Hak Akses</h1>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data hak akses...</p>
          </div>
        </div>
      </div>
    );
  }

  const groupedPermissions = permissions?.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>) || {};

  const adminPermissions = rolePermissions?.filter(rp => rp.role === 'admin') || [];
  const userPermissions = rolePermissions?.filter(rp => rp.role === 'user') || [];

  return (
    <PermissionGuard permission="users.manage_roles">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Hak Akses</h1>
          <p className="text-gray-600">Kelola permissions dan role dalam sistem</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{permissions?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Permissions</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminPermissions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Permissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPermissions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Tabs */}
        <Tabs defaultValue="by-module" className="w-full">
          <TabsList>
            <TabsTrigger value="by-module">Berdasarkan Modul</TabsTrigger>
            <TabsTrigger value="by-role">Berdasarkan Role</TabsTrigger>
          </TabsList>
          
          <TabsContent value="by-module" className="space-y-4">
            {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
              <Card key={module}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {module.replace('_', ' ')} Module
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Permission Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modulePermissions.map((permission) => {
                        const hasAdminAccess = adminPermissions.some(
                          rp => rp.permission_id === permission.id
                        );
                        const hasUserAccess = userPermissions.some(
                          rp => rp.permission_id === permission.id
                        );
                        
                        return (
                          <TableRow key={permission.id}>
                            <TableCell className="font-medium">
                              {permission.name}
                            </TableCell>
                            <TableCell>{permission.description}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{permission.action}</Badge>
                            </TableCell>
                            <TableCell>
                              {hasAdminAccess ? (
                                <Badge className="bg-green-100 text-green-800">✓</Badge>
                              ) : (
                                <Badge variant="secondary">✗</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {hasUserAccess ? (
                                <Badge className="bg-green-100 text-green-800">✓</Badge>
                              ) : (
                                <Badge variant="secondary">✗</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="by-role" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Admin Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {adminPermissions.map((rp) => (
                      <div key={rp.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{rp.permissions.name}</span>
                        <Badge variant="outline">{rp.permissions.action}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userPermissions.map((rp) => (
                      <div key={rp.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{rp.permissions.name}</span>
                        <Badge variant="outline">{rp.permissions.action}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  );
};

export default PermissionManagement;
