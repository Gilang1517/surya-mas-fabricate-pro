
import React from 'react';
import { useUsers, useUpdateUserRole, useDeleteUser } from '@/hooks/useUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Shield, User, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading, error } = useUsers();
  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  const handleRoleChange = (userId: string, newRole: 'admin' | 'user') => {
    console.log('Changing role for user:', userId, 'to:', newRole);
    updateUserRole.mutate({ userId, role: newRole });
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      deleteUser.mutate(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data pengguna...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        <div className="text-center p-8">
          <p className="text-red-600">Terjadi kesalahan saat memuat data pengguna.</p>
          <p className="text-gray-600 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const adminUsers = users?.filter((user) => 
    user.user_roles?.some((role) => role.role === 'admin')
  ).length || 0;
  const regularUsers = totalUsers - adminUsers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        <p className="text-gray-600">Kelola pengguna dan hak akses sistem</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrator</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Reguler</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regularUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          {!users || users.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-600">Tidak ada pengguna yang ditemukan.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Bergabung</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const userRole = user.user_roles && user.user_roles.length > 0 
                    ? user.user_roles[0].role 
                    : 'user';
                  const isCurrentUser = user.id === currentUser?.id;
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || 'Tidak ada nama'}
                      </TableCell>
                      <TableCell>{user.email || 'Tidak ada email'}</TableCell>
                      <TableCell>
                        <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
                          {userRole === 'admin' ? 'Administrator' : 'Pengguna'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!isCurrentUser && (
                            <>
                              <Select
                                value={userRole}
                                onValueChange={(value: 'admin' | 'user') => 
                                  handleRoleChange(user.id, value)
                                }
                                disabled={updateUserRole.isPending}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">Pengguna</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-700"
                                disabled={deleteUser.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {isCurrentUser && (
                            <Badge variant="outline">Akun Anda</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
