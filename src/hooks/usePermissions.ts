
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Permission {
  permission_name: string;
  module: string;
  action: string;
}

export const usePermissions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for permissions check');
        return [];
      }

      console.log('Fetching permissions for user:', user.id);
      
      try {
        const { data, error } = await supabase.rpc('get_user_permissions', {
          _user_id: user.id
        });

        if (error) {
          console.error('Error fetching permissions:', error);
          throw error;
        }

        console.log('User permissions:', data);
        return data || [];
      } catch (error) {
        console.error('Error in usePermissions:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });
};

export const useHasPermission = (permissionName: string) => {
  const { data: permissions, isLoading } = usePermissions();
  
  const hasPermission = permissions?.some(
    (permission: Permission) => permission.permission_name === permissionName
  ) || false;

  return { hasPermission, isLoading };
};

// Helper function to check multiple permissions
export const useHasAnyPermission = (permissionNames: string[]) => {
  const { data: permissions, isLoading } = usePermissions();
  
  const hasAnyPermission = permissions?.some(
    (permission: Permission) => permissionNames.includes(permission.permission_name)
  ) || false;

  return { hasAnyPermission, isLoading };
};

// Helper function to check if user has all specified permissions
export const useHasAllPermissions = (permissionNames: string[]) => {
  const { data: permissions, isLoading } = usePermissions();
  
  const hasAllPermissions = permissionNames.every(
    permissionName => permissions?.some(
      (permission: Permission) => permission.permission_name === permissionName
    )
  ) || false;

  return { hasAllPermissions, isLoading };
};
