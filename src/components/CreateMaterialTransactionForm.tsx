
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMaterials } from '@/hooks/useMaterials';
import { useCreateMaterialTransaction } from '@/hooks/useMaterialTransactions';
import { useToast } from '@/hooks/use-toast';

const transactionSchema = z.object({
  transaction_number: z.string().min(1, "Transaction number is required"),
  material_id: z.string().min(1, "Material is required"),
  transaction_type: z.enum(['inbound', 'outbound', 'transfer', 'adjustment']),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  movement_type: z.string().min(1, "Movement type is required"),
  reference_document: z.string().optional(),
  notes: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface CreateMaterialTransactionFormProps {
  open: boolean;
  onClose: () => void;
}

const CreateMaterialTransactionForm = ({ open, onClose }: CreateMaterialTransactionFormProps) => {
  const { toast } = useToast();
  const { data: materials = [] } = useMaterials();
  const createTransaction = useCreateMaterialTransaction();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transaction_number: '',
      material_id: '',
      quantity: 1,
      movement_type: '',
    }
  });

  const selectedTransactionType = form.watch('transaction_type');

  const getMovementTypeOptions = (type: string) => {
    switch (type) {
      case 'inbound':
        return [
          { value: '101', label: '101 - GR for Purchase Order' },
          { value: '102', label: '102 - GR Reversal' },
        ];
      case 'outbound':
        return [
          { value: '201', label: '201 - Goods Issue for Cost Center' },
          { value: '261', label: '261 - Goods Issue for Production' },
        ];
      case 'transfer':
        return [
          { value: '311', label: '311 - Transfer Plant to Plant' },
          { value: '301', label: '301 - Transfer Storage Location' },
        ];
      case 'adjustment':
        return [
          { value: '551', label: '551 - Scrap' },
          { value: '701', label: '701 - Inventory Difference' },
        ];
      default:
        return [];
    }
  };

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      const selectedMaterial = materials.find(m => m.id === data.material_id);
      await createTransaction.mutateAsync({
        ...data,
        unit: selectedMaterial?.unit || 'Piece',
        status: 'completed',
        created_by: 'Current User',
      });
      toast({
        title: "Transaction berhasil dibuat",
        description: "Data transaksi material telah disimpan ke database.",
      });
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat transaksi. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Material Transaction</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="transaction_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Number</FormLabel>
                    <FormControl>
                      <Input placeholder="TXN-MAT-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="material_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {materials.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.material_number} - {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transaction_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="inbound">Inbound (Receipt)</SelectItem>
                        <SelectItem value="outbound">Outbound (Issue)</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="movement_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movement Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select movement type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getMovementTypeOptions(selectedTransactionType).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="1"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference_document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Document</FormLabel>
                    <FormControl>
                      <Input placeholder="PO-2024-001, WO-2024-001, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about this transaction..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTransaction.isPending}>
                {createTransaction.isPending ? "Creating..." : "Create Transaction"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMaterialTransactionForm;
