
import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
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
import { materials } from '@/data/mockData';

interface TransactionFormData {
  materialId: string;
  transactionType: 'receipt' | 'issue' | 'transfer' | 'adjustment';
  quantity: number;
  movementType: string;
  plant: string;
  storageLocation: string;
  referenceDocument?: string;
  costCenter?: string;
  notes?: string;
}

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
}

const TransactionForm = ({ onClose, onSubmit }: TransactionFormProps) => {
  const form = useForm<TransactionFormData>({
    defaultValues: {
      plant: 'P001',
      storageLocation: 'SL01',
    }
  });

  const selectedTransactionType = form.watch('transactionType');

  const getMovementTypeOptions = (type: string) => {
    switch (type) {
      case 'receipt':
        return [
          { value: '101', label: '101 - GR for Purchase Order' },
          { value: '102', label: '102 - GR for Purchase Order (Reversal)' },
        ];
      case 'issue':
        return [
          { value: '201', label: '201 - Goods Issue for Cost Center' },
          { value: '261', label: '261 - Goods Issue for Production Order' },
        ];
      case 'transfer':
        return [
          { value: '311', label: '311 - Transfer Posting Plant to Plant' },
          { value: '301', label: '301 - Transfer Posting Storage Location' },
        ];
      case 'adjustment':
        return [
          { value: '551', label: '551 - Scrap from Storage Location' },
          { value: '701', label: '701 - Inventory Difference' },
        ];
      default:
        return [];
    }
  };

  const handleSubmit = (data: TransactionFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Material Transaction</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="materialId"
                rules={{ required: "Material is required" }}
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
                            {material.materialNumber} - {material.name}
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
                name="transactionType"
                rules={{ required: "Transaction type is required" }}
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
                        <SelectItem value="receipt">Receipt</SelectItem>
                        <SelectItem value="issue">Issue</SelectItem>
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
                name="quantity"
                rules={{ 
                  required: "Quantity is required",
                  min: { value: 0.01, message: "Quantity must be greater than 0" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="movementType"
                rules={{ required: "Movement type is required" }}
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
                name="plant"
                rules={{ required: "Plant is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plant</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="P001">P001 - Main Plant</SelectItem>
                        <SelectItem value="P002">P002 - Secondary Plant</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storageLocation"
                rules={{ required: "Storage location is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select storage location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SL01">SL01 - Main Warehouse</SelectItem>
                        <SelectItem value="SL02">SL02 - Secondary Warehouse</SelectItem>
                        <SelectItem value="SL03">SL03 - Production Floor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceDocument"
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

              <FormField
                control={form.control}
                name="costCenter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Center</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cost center" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CC-PROD">CC-PROD - Production</SelectItem>
                        <SelectItem value="CC-MAINT">CC-MAINT - Maintenance</SelectItem>
                        <SelectItem value="CC-ADMIN">CC-ADMIN - Administration</SelectItem>
                      </SelectContent>
                    </Select>
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
              <Button type="submit">
                Create Transaction
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
