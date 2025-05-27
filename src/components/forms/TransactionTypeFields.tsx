
import React from 'react';
import { Control } from 'react-hook-form';
import {
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TransactionTypeFieldsProps {
  transactionType: string;
  control: Control<any>;
}

const TransactionTypeFields: React.FC<TransactionTypeFieldsProps> = ({
  transactionType,
  control,
}) => {
  if (transactionType === 'local_borrow' || transactionType === 'site_borrow') {
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
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
            control={control}
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

        {transactionType === 'site_borrow' && (
          <FormField
            control={control}
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
      </>
    );
  }

  if (transactionType === 'service') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
    );
  }

  if (transactionType === 'damage_report') {
    return (
      <>
        <FormField
          control={control}
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
          control={control}
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
    );
  }

  return null;
};

export default TransactionTypeFields;
