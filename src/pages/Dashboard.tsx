
import React from 'react';
import { Package, Computer, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardMetrics, materials, machines } from '@/data/mockData';
import MetricCard from '@/components/MetricCard';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome to PT. Surya Mas Perkasa SAP System</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: May 22, 2025
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Materials"
          value={dashboardMetrics.materialCount}
          icon={Package}
          color="blue"
        />
        <MetricCard
          title="Total Machines"
          value={dashboardMetrics.machineCount}
          icon={Computer}
          color="green"
        />
        <MetricCard
          title="Low/Out of Stock"
          value={dashboardMetrics.materialsLowStock + dashboardMetrics.materialsOutOfStock}
          description={`${dashboardMetrics.materialsOutOfStock} out of stock`}
          icon={AlertTriangle}
          color="orange"
        />
        <MetricCard
          title="Machines Not Operational"
          value={dashboardMetrics.machinesInMaintenance + dashboardMetrics.machinesInBreakdown}
          description={`${dashboardMetrics.machinesInBreakdown} in breakdown`}
          icon={AlertCircle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Critical Materials</CardTitle>
            <CardDescription>Materials that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {materials
                .filter(material => material.status !== 'Available')
                .slice(0, 3)
                .map(material => (
                  <div key={material.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-gray-500">{material.materialNumber}</p>
                    </div>
                    <div 
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${material.status === 'Out of Stock' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-amber-100 text-amber-800'
                        }
                      `}
                    >
                      {material.status}
                    </div>
                  </div>
                ))}
              {materials.filter(material => material.status !== 'Available').length === 0 && (
                <div className="text-center py-4 text-gray-500">No critical materials</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Maintenance</CardTitle>
            <CardDescription>Machines scheduled for maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {machines
                .filter(machine => 
                  new Date(machine.nextMaintenanceDate) <= new Date('2025-06-15'))
                .slice(0, 3)
                .map(machine => (
                  <div key={machine.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{machine.name}</p>
                      <p className="text-sm text-gray-500">{machine.assetNumber}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{machine.nextMaintenanceDate}</span>
                    </div>
                  </div>
                ))}
              {machines.filter(machine => 
                new Date(machine.nextMaintenanceDate) <= new Date('2025-06-15')).length === 0 && (
                <div className="text-center py-4 text-gray-500">No upcoming maintenance</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and operations</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { name: 'Create Material', icon: 'package-plus' },
            { name: 'Register Machine', icon: 'computer-plus' },
            { name: 'Schedule Maintenance', icon: 'calendar-plus' },
            { name: 'Generate Reports', icon: 'file-bar-chart' }
          ].map((action, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              <div className="h-10 w-10 bg-company-blue/10 rounded-full flex items-center justify-center mb-2">
                <span className="text-company-blue material-symbols-outlined">
                  {action.icon}
                </span>
              </div>
              <span className="text-sm font-medium text-center">{action.name}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
