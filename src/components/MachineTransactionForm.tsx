
import React, { useState } from 'react';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getTransactionTypeLabel } from '@/data/machineTransactionData';
import { getSchemaByType } from './forms/machineTransactionSchemas';
import MachineTransactionFormFields from './forms/MachineTransactionFormFields';

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

  const form = useForm({
    resolver: zodResolver(getSchemaByType(transactionType)),
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
            <MachineTransactionFormFields
              transactionType={transactionType}
              control={form.control}
              onTransactionTypeChange={handleTransactionTypeChange}
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
