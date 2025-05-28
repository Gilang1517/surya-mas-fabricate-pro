
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type MaterialTransaction = Tables<'material_transactions'>;

export const useMaterialTransactions = () => {
  return useQuery({
    queryKey: ['material_transactions'],
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
      return data;
    },
  });
};

export const useCreateMaterialTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transaction: Omit<MaterialTransaction, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('material_transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['material_transactions'] });
    },
  });
};
