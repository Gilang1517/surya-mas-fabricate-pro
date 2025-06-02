
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useHasPermission } from '@/hooks/usePermissions';
import {
  BarChart3,
  Package,
  Settings,
  FileText,
  Users,
  Archive,
  TrendingUp,
  AlertTriangle,
  Shield,
  Wrench,
  Code,
} from 'lucide-react';

interface MenuItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  permission: string;
  adminOnly?: boolean;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const menuItems = [
    { 
      href: "/dashboard", 
      icon: BarChart3, 
      label: "Dashboard",
      permission: "dashboard.view"
    },
    { 
      href: "/development", 
      icon: Code, 
      label: "Development",
      permission: "system.manage",
      adminOnly: true
    },
    { 
      href: "/materials", 
      icon: Package, 
      label: "Materials",
      permission: "materials.view"
    },
    { 
      href: "/machines", 
      icon: Settings, 
      label: "Machines",
      permission: "machines.view"
    },
    { 
      href: "/transactions", 
      icon: FileText, 
      label: "Transactions",
      permission: "transactions.view"
    },
    { 
      href: "/machine-transactions", 
      icon: Wrench, 
      label: "Machine Transactions",
      permission: "machine_transactions.view"
    },
    { 
      href: "/inventory", 
      icon: Archive, 
      label: "Inventory",
      permission: "inventory.view"
    },
    { 
      href: "/reports", 
      icon: TrendingUp, 
      label: "Reports",
      permission: "reports.view"
    },
    { 
      href: "/stock-control", 
      icon: AlertTriangle, 
      label: "Stock Control",
      permission: "stock.manage"
    },
    { 
      href: "/user-management", 
      icon: Users, 
      label: "User Management",
      permission: "users.manage",
      adminOnly: true
    },
    { 
      href: "/permission-management", 
      icon: Shield, 
      label: "Permission Management",
      permission: "permissions.manage",
      adminOnly: true
    },
  ];

  return (
    <div className="w-64 flex-shrink-0 border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => {
            // Check admin requirement
            if (item.adminOnly && !isAdmin) {
              return null;
            }

            return (
              <SidebarMenuItem key={item.href} item={item} />
            );
          })}
          <li>
            <button onClick={() => window.location.href = '/auth'} className="flex items-center p-2 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <svg className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4L8 12M13 2H1m0 8h12m0 0L15 12m-2-4L15 4"/>
              </svg>
              <span className="ml-3">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

const SidebarMenuItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  const { hasPermission, isLoading } = useHasPermission(item.permission);

  if (isLoading) {
    return (
      <li className="animate-pulse">
        <div className="flex items-center p-2 h-11 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
      </li>
    );
  }

  if (!hasPermission) {
    return null;
  }

  return (
    <li>
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          cn(
            "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group",
            isActive
              ? "bg-gray-100 dark:bg-gray-700"
              : ""
          )
        }
      >
        <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        <span className="ml-3">{item.label}</span>
      </NavLink>
    </li>
  );
};
