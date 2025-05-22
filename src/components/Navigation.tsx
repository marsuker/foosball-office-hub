
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Trophy, 
  PenTool, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Players', path: '/players', icon: Users },
    { name: 'Locations', path: '/locations', icon: MapPin },
    { name: 'Games', path: '/games', icon: PenTool },
    { name: 'Tournaments', path: '/tournaments', icon: Trophy },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMobileMenu} 
          className="bg-white shadow-md"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-tableblue" />
              <span className="text-xl font-bold">Table Football</span>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                      location.pathname === item.path 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "hover:bg-sidebar-accent/50"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-sidebar-border">
            <Link to="/games/new">
              <Button className="w-full bg-tableblue hover:bg-blue-600 text-white">
                Create a Match
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div 
        className={cn(
          "hidden lg:block fixed inset-y-0 left-0 z-40 bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-sidebar-border">
            <div className={cn("flex items-center", isCollapsed ? "justify-center" : "space-x-2")}>
              <Trophy className="h-6 w-6 text-tableblue" />
              {!isCollapsed && <span className="text-xl font-bold">Table Football</span>}
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                      location.pathname === item.path 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "hover:bg-sidebar-accent/50",
                      isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-sidebar-border">
            {!isCollapsed && (
              <Link to="/games/new">
                <Button className="w-full bg-tableblue hover:bg-blue-600 text-white">
                  Create a Match
                </Button>
              </Link>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="mt-2 w-full flex justify-center"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
