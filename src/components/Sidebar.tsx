
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Computer, 
  Layers, 
  BarChart3, 
  Settings,
  MenuIcon,
  X,
  ArrowRightLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = React.useState(!isMobile);

  const toggleSidebar = () => {
    setExpanded(prev => !prev);
  };

  React.useEffect(() => {
    setExpanded(!isMobile);
  }, [isMobile]);

  return (
    <>
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleSidebar}
            className="bg-white"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className={`
        ${expanded ? 'translate-x-0' : '-translate-x-full'} 
        ${isMobile ? 'fixed z-40 shadow-xl' : 'relative'}
        transition-transform duration-200 ease-in-out
        bg-white border-r border-gray-200 w-64 h-screen flex flex-col
      `}>
        {isMobile && (
          <div className="absolute top-4 right-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-company-orange rounded-md flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-company-blue">PT. Surya Mas Perkasa</h1>
              <p className="text-xs text-gray-500">SAP Management System</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavLink 
            to="/" 
            end
            onClick={() => isMobile && setExpanded(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-company-blue text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/materials" 
            onClick={() => isMobile && setExpanded(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-company-blue text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Package className="h-5 w-5" />
            <span>Materials</span>
          </NavLink>

          <NavLink 
            to="/transactions" 
            onClick={() => isMobile && setExpanded(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-company-blue text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <ArrowRightLeft className="h-5 w-5" />
            <span>Transactions</span>
          </NavLink>
          
          <NavLink 
            to="/machines" 
            onClick={() => isMobile && setExpanded(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-company-blue text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Computer className="h-5 w-5" />
            <span>Machines</span>
          </NavLink>
          
          <NavLink 
            to="/inventory" 
            onClick={() => isMobile && setExpanded(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-company-blue text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Layers className="h-5 w-5" />
            <span>Inventory</span>
          </NavLink>
          
          <NavLink 
            to="/reports" 
            onClick={() => isMobile && setExpanded(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-company-blue text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <BarChart3 className="h-5 w-5" />
            <span>Reports</span>
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
