
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
  user_roles?: UserRole[];
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users...');
      try {
        // First get all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        if (!profiles || profiles.length === 0) {
          console.log('No profiles found');
          return [];
        }

        // Then get user roles separately
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*');
        
        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          // Don't throw error for roles, just log it
          console.log('Continuing without roles data');
        }

        // Combine the data manually
        const usersWithRoles: UserWithRole[] = profiles.map((profile) => ({
          ...profile,
          user_roles: userRoles?.filter((role) => role.user_id === profile.id) || []
        }));
        
        console.log('Users fetched successfully:', usersWithRoles);
        return usersWithRoles;
      } catch (error) {
        console.error('Error in useUsers queryFn:', error);
        throw error;
      }
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'user' }) => {
      console.log('Updating user role:', userId, role);
      
      try {
        // First, delete existing roles for this user
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);
        
        if (deleteError) {
          console.error('Error deleting existing roles:', deleteError);
          throw deleteError;
        }
        
        // Get current user for assigned_by
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error getting current user:', userError);
        }
        
        // Then insert the new role
        const { data, error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: role,
            assigned_by: user?.id || null,
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error inserting new role:', error);
          throw error;
        }
        
        console.log('Role updated successfully:', data);
        return data;
      } catch (error) {
        console.error('Error in updateUserRole mutation:', error);
        throw error;
      }
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
      
      try {
        // Delete user roles first
        const { error: rolesError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);
        
        if (rolesError) {
          console.error('Error deleting user roles:', rolesError);
          throw rolesError;
        }
        
        // Delete profile
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
        
        if (profileError) {
          console.error('Error deleting profile:', profileError);
          throw profileError;
        }
        
        console.log('User deleted successfully');
        // Note: We can't delete from auth.users via the API
        // This would need to be done via Supabase admin functions
      } catch (error) {
        console.error('Error in deleteUser mutation:', error);
        throw error;
      }
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
