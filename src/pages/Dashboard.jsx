import React, { useState } from "react";
import {
  Users,
  Briefcase,
  DollarSign,
  Plus,
  Eye,
  Filter,
  Download,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Star,
  ArrowRight,
  MoreVertical
} from "lucide-react";

// Importing your specific UI components
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import ProgressBar from "../components/ui/ProgressBar";
import Modal from "../components/ui/Modal";
import StatCard from "../components/ui/StatCard";

const Dashboard = ({ user }) => {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
  // Stats Data
  const stats = [
    { 
      title: 'Active Projects', 
      value: '12', 
      change: '+2', 
      changeLabel: 'this week',
      icon: <Briefcase className="w-6 h-6" />,
      trend: 'up',
      color: 'blue'
    },
    { 
      title: 'Total Clients', 
      value: '48', 
      change: '+5', 
      changeLabel: 'this month',
      icon: <Users className="w-6 h-6" />,
      trend: 'up',
      color: 'green'
    },
    { 
      title: 'Revenue (MTD)', 
      value: '£24.5k', 
      change: '+18.2%', 
      icon: <DollarSign className="w-6 h-6" />,
      trend: 'up',
      color: 'purple'
    },
    { 
      title: 'Hours Logged', 
      value: '156', 
      change: '-5', 
      changeLabel: 'from last week',
      icon: <Clock className="w-6 h-6" />,
      trend: 'down',
      color: 'orange'
    }
  ];
  
  // Projects Data
  const projects = [
    { 
      id: 1,
      name: 'Website Redesign', 
      client: 'Tech Corp',
      clientLogo: 'TC',
      status: 'in-progress', 
      deadline: '15 Jan 2026', 
      progress: 75,
      team: ['JD', 'SM', 'RK'],
      priority: 'high',
      tasks: { completed: 12, total: 16 }
    },
    { 
      id: 2,
      name: 'Mobile App Development', 
      client: 'StartupXYZ',
      clientLogo: 'SX',
      status: 'in-progress', 
      deadline: '28 Jan 2026', 
      progress: 45,
      team: ['AL', 'BC'],
      priority: 'high',
      tasks: { completed: 18, total: 40 }
    },
    { 
      id: 3,
      name: 'Brand Identity Refresh', 
      client: 'Fashion Co',
      clientLogo: 'FC',
      status: 'review', 
      deadline: '10 Jan 2026', 
      progress: 90,
      team: ['JD', 'TY'],
      priority: 'medium',
      tasks: { completed: 9, total: 10 }
    },
    { 
      id: 4,
      name: 'E-commerce Platform', 
      client: 'Retail Plus',
      clientLogo: 'RP',
      status: 'completed', 
      deadline: '05 Jan 2026', 
      progress: 100,
      team: ['SM', 'RK', 'AL'],
      priority: 'low',
      tasks: { completed: 32, total: 32 }
    }
  ];
  
  // Activity Data
  const recentActivity = [
    { id: 1, action: 'Project "Website Redesign" milestone completed', time: '2 hours ago', userInitials: 'SC' },
    { id: 2, action: 'New client "Tech Corp" added', time: '5 hours ago', userInitials: 'JD' },
    { id: 3, action: 'Invoice #1234 sent to Fashion Co', time: '1 day ago', userInitials: 'SY' }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'completed': { variant: 'success', icon: <CheckCircle2 className="w-3 h-3" />, text: 'Completed' },
      'in-progress': { variant: 'info', icon: <Clock className="w-3 h-3" />, text: 'In Progress' },
      'review': { variant: 'warning', icon: <AlertCircle className="w-3 h-3" />, text: 'In Review' },
      'planning': { variant: 'default', icon: <Calendar className="w-3 h-3" />, text: 'Planning' }
    };
    const config = statusMap[status] || statusMap['planning'];
    return <Badge variant={config.variant} className="flex items-center gap-1">{config.icon}{config.text}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'high': { variant: 'danger', text: 'High' },
      'medium': { variant: 'warning', text: 'Medium' },
      'low': { variant: 'default', text: 'Low' }
    };
    const config = priorityMap[priority] || priorityMap['low'];
    return <Badge variant={config.variant} size="sm">{config.text}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'Aditya'}!</h2>
          <p className="text-gray-600">Here's what's happening with your projects today.</p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowNewProjectModal(true)}
        >
          New Project
        </Button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Table */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>Filter</Button>
                <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deadline</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold">
                            {project.clientLogo}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.client}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(project.status)}
                          {getPriorityBadge(project.priority)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <ProgressBar value={project.progress} showLabel={true} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {project.deadline}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" icon={<MoreVertical className="w-4 h-4" />} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Activity Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {activity.userInitials}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* New Project Modal */}
      <Modal 
        isOpen={showNewProjectModal} 
        onClose={() => setShowNewProjectModal(false)}
        title="Create New Project"
      >
        <div className="space-y-4">
          <Input label="Project Name" placeholder="e.g. Website Redesign" />
          <Input label="Client" placeholder="Search clients..." />
          <Input label="Deadline" type="date" />
          <Button fullWidth onClick={() => setShowNewProjectModal(false)}>Save Project</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;