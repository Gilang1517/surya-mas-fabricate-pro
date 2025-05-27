
import * as z from 'zod';

export const baseSchema = z.object({
  machineId: z.string().min(1, 'Pilih mesin'),
  transactionType: z.string().min(1, 'Pilih jenis transaksi'),
  startDate: z.string().min(1, 'Tanggal mulai diperlukan'),
  notes: z.string().optional(),
});

export const localBorrowSchema = baseSchema.extend({
  endDate: z.string().min(1, 'Tanggal selesai diperlukan'),
  borrower: z.string().min(1, 'Nama peminjam diperlukan'),
  borrowerDepartment: z.string().min(1, 'Department diperlukan'),
});

export const siteBorrowSchema = localBorrowSchema.extend({
  siteLocation: z.string().min(1, 'Lokasi site diperlukan'),
});

export const serviceSchema = baseSchema.extend({
  serviceType: z.string().min(1, 'Jenis servis diperlukan'),
  serviceProvider: z.string().min(1, 'Penyedia servis diperlukan'),
  repairCost: z.string().optional(),
  endDate: z.string().optional(),
});

export const damageReportSchema = baseSchema.extend({
  damageDescription: z.string().min(1, 'Deskripsi kerusakan diperlukan'),
  damageLevel: z.string().min(1, 'Level kerusakan diperlukan'),
  repairCost: z.string().optional(),
});

export const getSchemaByType = (transactionType: string) => {
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
