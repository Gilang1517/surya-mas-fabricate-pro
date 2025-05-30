
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

export type Profile = Tables<'profiles'>;
export type UserRole = Tables<'user_roles'>;

export type UserWithRole = Profile & {
  user_roles: UserRole[];
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'user' }) => {
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
      toast({
        title: "Gagal",
        description: error.message,
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
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
