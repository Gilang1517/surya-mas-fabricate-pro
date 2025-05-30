
import React from 'react';
import { Bell, HelpCircle, Search, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4 w-full max-w-md">
        <Search className="h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search..."
          className="h-9 focus-visible:ring-company-blue"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">
              {user?.email}
            </div>
            {isAdmin && (
              <Badge variant="destructive" className="text-xs">
                Administrator
              </Badge>
            )}
          </div>
          <div className="h-8 w-8 rounded-full bg-company-blue text-white flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
