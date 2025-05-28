
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type MaterialTransaction = Tables<'material_transactions'> & {
  materials?: Tables<'materials'>;
};

export const useMaterialTransactions = () => {
  return useQuery({
    queryKey: ['material-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('material_transactions')
        .select(`
          *,
          materials (
            material_number,
            name,
            unit
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MaterialTransaction[];
    },
  });
};

export const useCreateMaterialTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transaction: Omit<Tables<'material_transactions'>, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('material_transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['material-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};
