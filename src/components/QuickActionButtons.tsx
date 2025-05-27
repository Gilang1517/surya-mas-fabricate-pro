
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Building, 
  MapPin, 
  Wrench, 
  AlertTriangle 
} from 'lucide-react';

interface QuickActionButtonsProps {
  onQuickAction: (type: string) => void;
}

const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({ onQuickAction }) => {
  const quickActions = [
    {
      id: 'local_borrow',
      label: 'Peminjaman Lokal',
      description: 'Pinjam mesin untuk area lokal',
      icon: Building,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'site_borrow',
      label: 'Peminjaman Site',
      description: 'Pinjam mesin ke lokasi site',
      icon: MapPin,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'service',
      label: 'Servis Mesin',
      description: 'Catat servis dan maintenance',
      icon: Wrench,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'damage_report',
      label: 'Berita Acara Kerusakan',
      description: 'Laporkan kerusakan mesin',
      icon: AlertTriangle,
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickActions.map((action) => {
        const IconComponent = action.icon;
        return (
          <Card 
            key={action.id}
            className={`${action.color} cursor-pointer transition-all duration-200 hover:shadow-md`}
            onClick={() => onQuickAction(action.id)}
          >
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${action.iconColor} bg-white/50`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-900">
                    {action.label}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickActionButtons;
