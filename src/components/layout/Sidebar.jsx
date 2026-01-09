import {
  Home,
  Briefcase,
  Users,
  BarChart3,
  UserCircle,
  Settings,
  Zap,
  Target
} from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";

const Sidebar = ({ activePage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase className="w-5 h-5" />, badge: '12' },
    { id: 'clients', label: 'Clients', icon: <Users className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'team', label: 'Team', icon: <UserCircle className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ProjectFlow</h1>
            <p className="text-xs text-gray-500">Pro Plan</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activePage === item.id 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              {item.label}
            </div>
            {item.badge && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white">
          <Target className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-semibold mb-1">Upgrade to Pro</h3>
          <p className="text-xs opacity-90 mb-3">Unlock advanced features and analytics</p>
          <Button variant="secondary" size="sm" fullWidth>
            Upgrade Now
          </Button>
        </Card>
      </div>
    </aside>
  );
};

export default Sidebar;
