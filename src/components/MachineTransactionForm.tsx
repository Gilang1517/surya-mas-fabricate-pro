
import React, { useState } from 'react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getTransactionTypeLabel } from '@/data/machineTransactionData';

const baseSchema = z.object({
  machineId: z.string().min(1, 'Pilih mesin'),
  transactionType: z.string().min(1, 'Pilih jenis transaksi'),
  startDate: z.string().min(1, 'Tanggal mulai diperlukan'),
  notes: z.string().optional(),
});

const localBorrowSchema = baseSchema.extend({
  endDate: z.string().min(1, 'Tanggal selesai diperlukan'),
  borrower: z.string().min(1, 'Nama peminjam diperlukan'),
  borrowerDepartment: z.string().min(1, 'Department diperlukan'),
});

const siteBorrowSchema = localBorrowSchema.extend({
  siteLocation: z.string().min(1, 'Lokasi site diperlukan'),
});

const serviceSchema = baseSchema.extend({
  serviceType: z.string().min(1, 'Jenis servis diperlukan'),
  serviceProvider: z.string().min(1, 'Penyedia servis diperlukan'),
  repairCost: z.string().optional(),
  endDate: z.string().optional(),
});

const damageReportSchema = baseSchema.extend({
  damageDescription: z.string().min(1, 'Deskripsi kerusakan diperlukan'),
  damageLevel: z.string().min(1, 'Level kerusakan diperlukan'),
  repairCost: z.string().optional(),
});

interface MachineTransactionFormProps {
  transactionType?: string;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const MachineTransactionForm: React.FC<MachineTransactionFormProps> = ({
  transactionType: initialTransactionType = '',
  onClose,
  onSubmit
}) => {
  const [transactionType, setTransactionType] = useState(initialTransactionType);

  const getSchema = () => {
    switch (transactionType) {
      case 'local_borrow':
        return localBorrowSchema;
      case 'site_borrow':
        return siteBorrowSchema;
      case 'service':
        return serviceSchema;
      case 'damage_report':
        return damageReportSchema;
      default:
        return baseSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      machineId: '',
      transactionType: initialTransactionType,
      startDate: '',
      endDate: '',
      borrower: '',
      borrowerDepartment: '',
      siteLocation: '',
      serviceType: '',
      serviceProvider: '',
      damageDescription: '',
      damageLevel: '',
      repairCost: '',
      notes: '',
    }
  });

  const handleSubmit = (data: any) => {
    const processedData = {
      ...data,
      repairCost: data.repairCost ? parseFloat(data.repairCost) : undefined,
    };
    onSubmit(processedData);
  };

  const handleTransactionTypeChange = (value: string) => {
    setTransactionType(value);
    form.setValue('transactionType', value);
  };

  const getFormTitle = () => {
    if (transactionType) {
      return `Buat ${getTransactionTypeLabel(transactionType)}`;
    }
    return 'Buat Transaksi Mesin';
  };

  const machines = [
    { id: '1', number: 'EXC-001', name: 'Excavator CAT 320D' },
    { id: '2', number: 'BLD-001', name: 'Bulldozer D6T' },
    { id: '3', number: 'CRN-001', name: 'Mobile Crane 25T' },
    { id: '4', number: 'GDR-001', name: 'Motor Grader 140M' },
  ];

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>{getFormTitle()}</SheetTitle>
          <SheetDescription>
            Masukkan detail transaksi mesin dengan lengkap
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="machineId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mesin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih mesin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {machines.map((machine) => (
                          <SelectItem key={machine.id} value={machine.id}>
                            {machine.number} - {machine.name}
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Transaksi</FormLabel>
                    <Select onValueChange={handleTransactionTypeChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis transaksi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="local_borrow">Peminjaman Lokal</SelectItem>
                        <SelectItem value="site_borrow">Peminjaman Site</SelectItem>
                        <SelectItem value="service">Servis Mesin</SelectItem>
                        <SelectItem value="damage_report">Berita Acara Kerusakan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {transactionType === 'service' ? 'Tanggal Servis' : 
                       transactionType === 'damage_report' ? 'Tanggal Kejadian' : 'Tanggal Mulai'}
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(transactionType === 'local_borrow' || transactionType === 'site_borrow' || transactionType === 'service') && (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {transactionType === 'service' ? 'Tanggal Selesai (Opsional)' : 'Tanggal Selesai'}
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {(transactionType === 'local_borrow' || transactionType === 'site_borrow') && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="borrower"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Peminjam</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama lengkap peminjam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="borrowerDepartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Department peminjam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {transactionType === 'site_borrow' && (
              <FormField
                control={form.control}
                name="siteLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi Site</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat lengkap lokasi site" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {transactionType === 'service' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Servis</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis servis" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                          <SelectItem value="corrective">Corrective Maintenance</SelectItem>
                          <SelectItem value="overhaul">Overhaul</SelectItem>
                          <SelectItem value="inspection">Inspeksi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Penyedia Servis</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama bengkel/teknisi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {transactionType === 'damage_report' && (
              <>
                <FormField
                  control={form.control}
                  name="damageDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Kerusakan</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Jelaskan kerusakan secara detail..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="damageLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level Kerusakan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih level kerusakan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Rendah - Tidak mengganggu operasi</SelectItem>
                          <SelectItem value="medium">Sedang - Perlu perbaikan segera</SelectItem>
                          <SelectItem value="high">Tinggi - Mesin tidak dapat beroperasi</SelectItem>
                          <SelectItem value="critical">Kritis - Berbahaya jika digunakan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {(transactionType === 'service' || transactionType === 'damage_report') && (
              <FormField
                control={form.control}
                name="repairCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimasi Biaya (Rp)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Catatan tambahan..."
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
                Simpan Transaksi
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default MachineTransactionForm;
