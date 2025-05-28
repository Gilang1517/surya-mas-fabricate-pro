
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'operational':
      return 'bg-green-100 text-green-800';
    case 'inactive':
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800';
    case 'discontinued':
    case 'broken':
      return 'bg-red-100 text-red-800';
    case 'retired':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID');
};
