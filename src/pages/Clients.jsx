import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Filter,
  Download,
  Mail,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { Search } from "lucide-react";

const ClientsPage = () => {
  const clients = [
    { name: 'Tech Corp', projects: 3, revenue: '£45,000', contact: 'john@techcorp.com', status: 'active', logo: 'TC' },
    { name: 'StartupXYZ', projects: 2, revenue: '£28,500', contact: 'sarah@startupxyz.com', status: 'active', logo: 'SX' },
    { name: 'Fashion Co', projects: 5, revenue: '£67,200', contact: 'mike@fashionco.com', status: 'active', logo: 'FC' },
    { name: 'Retail Plus', projects: 4, revenue: '£52,000', contact: 'lisa@retailplus.com', status: 'inactive', logo: 'RP' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clients</h2>
          <p className="text-gray-600 mt-1">Manage your client relationships</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Add Client</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Clients" 
          value="48" 
          change="+5"
          changeLabel="this month"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard 
          title="Active Projects" 
          value="36" 
          change="+8"
          changeLabel="this month"
          icon={<Briefcase className="w-6 h-6" />}
          color="green"
        />
        <StatCard 
          title="Total Revenue" 
          value="£192k" 
          change="+12%"
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
        />
        <StatCard 
          title="Avg. Project Value" 
          value="£5.3k" 
          change="+3%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="orange"
        />
      </div>
      
      <Card padding={false}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Input 
              placeholder="Search clients..." 
              icon={<Search className="w-4 h-4" />}
              className="w-64"
            />
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>Filter</Button>
              <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {clients.map((client, i) => (
            <Card key={i} hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {client.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.contact}</p>
                  </div>
                </div>
                <Badge variant={client.status === 'active' ? 'success' : 'default'}>
                  {client.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Projects</p>
                  <p className="text-lg font-semibold text-gray-900">{client.projects}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Revenue</p>
                  <p className="text-lg font-semibold text-gray-900">{client.revenue}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" icon={<Mail className="w-4 h-4" />} fullWidth>
                  Email
                </Button>
                <Button variant="secondary" size="sm" icon={<Eye className="w-4 h-4" />} fullWidth>
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ClientsPage;