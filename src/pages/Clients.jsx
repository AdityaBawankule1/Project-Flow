import React, { useState, useEffect } from "react";
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
  Search,
  AlertCircle
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";

const ClientsPage = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const getUserId = () => {
    const savedUser = localStorage.getItem('user');
    const userData = savedUser ? JSON.parse(savedUser) : null;
    return user?._id || userData?._id;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'userid': userId
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Aggregate client data from projects
  const getClientData = () => {
    const clientMap = new Map();

    projects.forEach(project => {
      const clientName = project.client;
      
      if (!clientMap.has(clientName)) {
        clientMap.set(clientName, {
          name: clientName,
          logo: project.clientLogo || clientName.substring(0, 2).toUpperCase(),
          projects: [],
          totalRevenue: 0,
          activeProjects: 0,
          completedProjects: 0,
          status: 'active'
        });
      }

      const client = clientMap.get(clientName);
      client.projects.push(project);
      client.totalRevenue += project.revenue || 0;
      
      if (project.status === 'completed') {
        client.completedProjects++;
      } else if (project.status === 'in-progress' || project.status === 'review' || project.status === 'planning') {
        client.activeProjects++;
      }

      // Mark as inactive if all projects are completed
      if (client.completedProjects === client.projects.length && client.projects.length > 0) {
        client.status = 'inactive';
      }
    });

    return Array.from(clientMap.values());
  };

  const clients = getClientData();

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    totalClients: clients.length,
    activeProjects: projects.filter(p => 
      p.status === 'in-progress' || p.status === 'review' || p.status === 'planning'
    ).length,
    totalRevenue: projects.reduce((sum, p) => sum + (p.revenue || 0), 0),
    avgProjectValue: clients.length > 0 
      ? projects.reduce((sum, p) => sum + (p.revenue || 0), 0) / projects.length 
      : 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Clients</h2>
          <p className="text-gray-600 mt-1">Manage your client relationships</p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />} 
          onClick={() => setShowAddClientModal(true)}
        >
          Add Client
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Clients" 
          value={stats.totalClients.toString()} 
          change="+5"
          changeLabel="this month"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatCard 
          title="Active Projects" 
          value={stats.activeProjects.toString()} 
          change="+8"
          changeLabel="this month"
          icon={<Briefcase className="w-6 h-6" />}
          color="green"
        />
        <StatCard 
          title="Total Revenue" 
          value={`£${(stats.totalRevenue / 1000).toFixed(1)}k`} 
          change="+12%"
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
        />
        <StatCard 
          title="Avg. Project Value" 
          value={`£${(stats.avgProjectValue / 1000).toFixed(1)}k`} 
          change="+3%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="orange"
        />
      </div>
      
      {/* Clients List */}
      <Card padding={false}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>Filter</Button>
              <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Loading clients...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p>Error: {error}</p>
            <Button className="mt-4" onClick={fetchProjects}>Retry</Button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">
              {searchQuery ? 'No clients found' : 'No clients yet'}
            </p>
            <p className="text-sm mt-2">
              {searchQuery 
                ? 'Try adjusting your search' 
                : 'Add projects to see clients here'}
            </p>
          </div>
        ) : (
          <>
            {/* Client Count */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredClients.length}</span> of <span className="font-semibold text-gray-900">{clients.length}</span> clients
              </p>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {filteredClients.map((client, i) => (
                <Card key={i} hover className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {client.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-500">
                          {client.projects.length} {client.projects.length === 1 ? 'project' : 'projects'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={client.status === 'active' ? 'success' : 'default'}>
                      {client.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Projects</p>
                      <p className="text-lg font-semibold text-gray-900">{client.projects.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Active</p>
                      <p className="text-lg font-semibold text-green-600">{client.activeProjects}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Completed</p>
                      <p className="text-lg font-semibold text-blue-600">{client.completedProjects}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-900">
                      £{client.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Recent Projects */}
                  <div className="mb-4 border-t pt-3">
                    <p className="text-xs text-gray-500 mb-2">Recent Projects:</p>
                    <div className="space-y-1">
                      {client.projects.slice(0, 3).map((project, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 truncate">{project.name}</span>
                          <Badge 
                            variant={
                              project.status === 'completed' ? 'success' :
                              project.status === 'in-progress' ? 'info' :
                              project.status === 'review' ? 'warning' : 'default'
                            }
                            size="sm"
                          >
                            {project.status}
                          </Badge>
                        </div>
                      ))}
                      {client.projects.length > 3 && (
                        <p className="text-xs text-gray-400 mt-1">
                          +{client.projects.length - 3} more
                        </p>
                      )}
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
          </>
        )}
      </Card>

      {/* Add Client Modal */}
      <Modal 
        isOpen={showAddClientModal} 
        onClose={() => setShowAddClientModal(false)} 
        title="Add New Client"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            To add a new client, create a project for them in the Projects section. 
            Clients are automatically created from project data.
          </p>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="ghost" 
              fullWidth 
              onClick={() => setShowAddClientModal(false)}
            >
              Close
            </Button>
            <Button 
              fullWidth 
              onClick={() => {
                setShowAddClientModal(false);
                window.location.href = '/projects'; // or use your router
              }}
            >
              Go to Projects
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientsPage;