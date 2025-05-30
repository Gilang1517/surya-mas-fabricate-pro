
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Package, 
  Computer, 
  ArrowRightLeft, 
  BarChart3, 
  Warehouse,
  ClipboardList,
  FileText,
  UserCheck,
  Wrench,
  Users,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Materials', path: '/materials' },
    { icon: Computer, label: 'Machines', path: '/machines' },
    { icon: ArrowRightLeft, label: 'Transactions', path: '/transactions' },
    { icon: UserCheck, label: 'Machine Borrow', path: '/machine-borrow' },
    { icon: Wrench, label: 'Machine Service', path: '/machine-service' },
    { icon: Warehouse, label: 'Inventory', path: '/inventory' },
    { icon: ClipboardList, label: 'Stock Control', path: '/stock-control' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
  ];

  const adminMenuItems = [
    { icon: Users, label: 'User Management', path: '/user-management' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Inventory System</h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
          
          {isAdmin && (
            <>
              <li className="pt-4">
                <div className="flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <Settings className="w-4 h-4" />
                  <span>Administration</span>
                </div>
              </li>
              {adminMenuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-red-50 text-red-600 border-r-2 border-red-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </>
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <div className="text-xs text-gray-500 text-center">
          Inventory Management System v1.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
