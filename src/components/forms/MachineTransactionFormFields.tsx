
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
import { machines } from './machineData';
import TransactionTypeFields from './TransactionTypeFields';

interface MachineTransactionFormFieldsProps {
  transactionType: string;
  control: Control<any>;
  onTransactionTypeChange: (value: string) => void;
}

const MachineTransactionFormFields: React.FC<MachineTransactionFormFieldsProps> = ({
  transactionType,
  control,
  onTransactionTypeChange,
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
          name="transactionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Transaksi</FormLabel>
              <Select onValueChange={onTransactionTypeChange} defaultValue={field.value}>
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
          control={control}
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
            control={control}
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

      <TransactionTypeFields transactionType={transactionType} control={control} />

      {(transactionType === 'service' || transactionType === 'damage_report') && (
        <FormField
          control={control}
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
        control={control}
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
    </>
  );
};

export default MachineTransactionFormFields;
