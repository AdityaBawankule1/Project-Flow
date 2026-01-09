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
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Star,
  ArrowRight,
  MoreVertical
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import ProgressBar from "../components/ui/ProgressBar";
import Modal from "../components/ui/Modal";
import StatCard from "../components/ui/StatCard";
import { useState } from "react";


const DashboardPage = () => {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
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
    },
    { 
      id: 5,
      name: 'Analytics Dashboard', 
      client: 'Data Inc',
      clientLogo: 'DI',
      status: 'planning', 
      deadline: '02 Feb 2026', 
      progress: 15,
      team: ['BC'],
      priority: 'medium',
      tasks: { completed: 3, total: 20 }
    }
  ];
  
  const recentActivity = [
    { 
      id: 1,
      action: 'Project "Website Redesign" milestone completed', 
      time: '2 hours ago', 
      user: 'Sarah Chen',
      userInitials: 'SC',
      type: 'success'
    },
    { 
      id: 2,
      action: 'New client "Tech Corp" added to portfolio', 
      time: '5 hours ago', 
      user: 'John Davis',
      userInitials: 'JD',
      type: 'info'
    },
    { 
      id: 3,
      action: 'Invoice #1234 sent to Fashion Co', 
      time: '1 day ago', 
      user: 'System',
      userInitials: 'SY',
      type: 'default'
    },
    { 
      id: 4,
      action: 'Project "Mobile App" phase 2 started', 
      time: '2 days ago', 
      user: 'Mike Wilson',
      userInitials: 'MW',
      type: 'info'
    },
    { 
      id: 5,
      action: 'Team meeting scheduled for tomorrow', 
      time: '2 days ago', 
      user: 'Alice Brown',
      userInitials: 'AB',
      type: 'warning'
    }
  ];
  
  const upcomingDeadlines = [
    { project: 'Brand Identity Refresh', client: 'Fashion Co', date: '10 Jan', daysLeft: 1, urgent: true },
    { project: 'Website Redesign', client: 'Tech Corp', date: '15 Jan', daysLeft: 6, urgent: false },
    { project: 'Mobile App Development', client: 'StartupXYZ', date: '28 Jan', daysLeft: 19, urgent: false }
  ];
  
  const getStatusBadge = (status) => {
    const statusMap = {
      'completed': { variant: 'success', icon: <CheckCircle2 className="w-3 h-3" />, text: 'Completed' },
      'in-progress': { variant: 'info', icon: <Clock className="w-3 h-3" />, text: 'In Progress' },
      'review': { variant: 'warning', icon: <AlertCircle className="w-3 h-3" />, text: 'In Review' },
      'planning': { variant: 'default', icon: <Calendar className="w-3 h-3" />, text: 'Planning' }
    };
    const config = statusMap[status];
    return <Badge variant={config.variant}>{config.icon}{config.text}</Badge>;
  };
  
  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'high': { variant: 'danger', text: 'High' },
      'medium': { variant: 'warning', text: 'Medium' },
      'low': { variant: 'default', text: 'Low' }
    };
    const config = priorityMap[priority];
    return <Badge variant={config.variant} size="sm">{config.text}</Badge>;
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Aditya!</h2>
          <p className="text-gray-600">Here's what's happening with your projects today.</p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowNewProjectModal(true)}
        >
          New Project
        </Button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Table - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card padding={false}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Active Projects</h3>
                  <p className="text-sm text-gray-600 mt-1">Track and manage your ongoing work</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>
                    Filter
                  </Button>
                  <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                    Export
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Deadline</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-semibold text-sm">
                            {project.clientLogo}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.client}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {getStatusBadge(project.status)}
                          {getPriorityBadge(project.priority)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <ProgressBar value={project.progress} showLabel={true} />
                          <p className="text-xs text-gray-500">
                            {project.tasks.completed}/{project.tasks.total} tasks
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {project.team.map((member, i) => (
                            <div 
                              key={i}
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                            >
                              {member}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {project.deadline}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} />
                          <Button variant="ghost" size="sm" icon={<MoreVertical className="w-4 h-4" />} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">Showing 5 of 12 projects</p>
              <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                View All Projects
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map((item, i) => (
                <div key={i} className={`p-3 rounded-lg border-l-4 ${item.urgent ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-300'}`}>
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-sm text-gray-900">{item.project}</p>
                    <Badge variant={item.urgent ? 'danger' : 'default'} size="sm">
                      {item.daysLeft}d
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{item.client}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Quick Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Task Completion Rate</span>
                <span className="text-sm font-semibold text-gray-900">87%</span>
              </div>
              <ProgressBar value={87} color="green" showLabel={false} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Client Satisfaction</span>
                <span className="text-sm font-semibold text-gray-900">4.8/5.0</span>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Active Team Members</span>
                <span className="text-sm font-semibold text-gray-900">24</span>
              </div>
            </div>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {activity.userInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" fullWidth className="mt-4">
              View All Activity
            </Button>
          </Card>
        </div>
      </div>
      
      {/* New Project Modal */}
      <Modal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        title="Create New Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowNewProjectModal(false)}>
              Cancel
            </Button>
            <Button>Create Project</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Project Name" placeholder="Enter project name" />
          <Input label="Client Name" placeholder="Select or add client" icon={<Users className="w-4 h-4" />} />
          <Input label="Deadline" type="date" icon={<Calendar className="w-4 h-4" />} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" fullWidth>Low</Button>
              <Button variant="outline" size="sm" fullWidth>Medium</Button>
              <Button variant="outline" size="sm" fullWidth>High</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;