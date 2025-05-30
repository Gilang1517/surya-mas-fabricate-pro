
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  assigned_at: string;
  assigned_by: string | null;
}

export type UserWithRole = Profile & {
  user_roles: UserRole[];
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users...');
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Users fetched:', data);
      return data as UserWithRole[];
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'user' }) => {
      console.log('Updating user role:', userId, role);
      
      // First, delete existing roles for this user
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      // Then insert the new role
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role,
          assigned_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Berhasil",
        description: "Peran pengguna telah diperbarui",
      });
    },
    onError: (error: any) => {
      console.error('Error updating user role:', error);
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat memperbarui peran",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      console.log('Deleting user:', userId);
      
      // Delete user roles first
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      // Delete profile
      await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      // Note: We can't delete from auth.users via the API
      // This would need to be done via Supabase admin functions
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Berhasil",
        description: "Pengguna telah dihapus",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      toast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat menghapus pengguna",
        variant: "destructive",
      });
    },
  });
};
