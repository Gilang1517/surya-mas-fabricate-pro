
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type MachineTransaction = Tables<'machine_transactions'>;

export const useMachineTransactions = () => {
  return useQuery({
    queryKey: ['machine_transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('machine_transactions')
        .select(`
          *,
          machines (
            asset_number,
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateMachineTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transaction: Omit<MachineTransaction, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('machine_transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machine_transactions'] });
    },
  });
};
