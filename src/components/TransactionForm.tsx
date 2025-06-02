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
  transactionType: 'penerimaan' | 'pemakaian' | 'pengembalian' | 'reject' | 'pengaturan';
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
      case 'penerimaan':
        return [
          { value: 'penerimaan', label: 'Penerimaan' },
        ];
      case 'pemakaian':
        return [
          { value: 'pemakaian', label: 'Pemakaian' },
        ];
      case 'pengembalian':
        return [
          { value: 'pengembalian', label: 'Pengembalian' },
        ];
      case 'reject':
        return [
          { value: 'reject', label: 'Terjadi Reject' },
        ];
      case 'pengaturan':
        return [
          { value: 'pengaturan', label: 'Pengaturan' },
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
          <DialogTitle>Buat Transaksi Material</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="materialId"
                rules={{ required: "Material harus dipilih" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih material" />
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
                rules={{ required: "Jenis transaksi harus dipilih" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Transaksi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis transaksi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="penerimaan">Penerimaan</SelectItem>
                        <SelectItem value="pemakaian">Pemakaian</SelectItem>
                        <SelectItem value="pengembalian">Pengembalian</SelectItem>
                        <SelectItem value="reject">Terjadi Reject</SelectItem>
                        <SelectItem value="pengaturan">Pengaturan</SelectItem>
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
                  required: "Jumlah harus diisi",
                  min: { value: 0.01, message: "Jumlah harus lebih dari 0" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah</FormLabel>
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
                rules={{ required: "Movement type harus dipilih" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movement Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih movement type" />
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
                rules={{ required: "Plant harus dipilih" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plant</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih plant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="P001">P001 - Plant Utama</SelectItem>
                        <SelectItem value="P002">P002 - Plant Kedua</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storageLocation"
                rules={{ required: "Lokasi gudang harus dipilih" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi Gudang</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih lokasi gudang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SL01">SL01 - Gudang Utama</SelectItem>
                        <SelectItem value="SL02">SL02 - Gudang Kedua</SelectItem>
                        <SelectItem value="SL03">SL03 - Lantai Produksi</SelectItem>
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
                    <FormLabel>Dokumen Referensi</FormLabel>
                    <FormControl>
                      <Input placeholder="PO-2024-001, WO-2024-001, dll." {...field} />
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
                          <SelectValue placeholder="Pilih cost center" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CC-PROD">CC-PROD - Produksi</SelectItem>
                        <SelectItem value="CC-MAINT">CC-MAINT - Maintenance</SelectItem>
                        <SelectItem value="CC-ADMIN">CC-ADMIN - Administrasi</SelectItem>
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
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Catatan tambahan tentang transaksi ini..."
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
                Batal
              </Button>
              <Button type="submit">
                Buat Transaksi
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
