import React, { useState, useEffect } from "react";
import {
    Users,
    Briefcase,
    DollarSign,
    Filter,
    Download,
    Clock,
    AlertCircle,
    CheckCircle2,
    Trash2,
    Edit
} from "lucide-react";

// Importing your specific UI components
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import ProgressBar from "../components/ui/ProgressBar";
import StatCard from "../components/ui/StatCard";

const Dashboard = ({ user }) => {
    const [allProjects, setAllProjects] = useState([]);
    const [inProgressProjects, setInProgressProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUserId = () => {
        const savedUser = localStorage.getItem('user');
        const userData = savedUser ? JSON.parse(savedUser) : null;
        return user?._id || userData?._id;
    };

    // Fetch projects on mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        await Promise.all([
            fetchAllProjects(),
            fetchInProgressProjects()
        ]);
    };

    const fetchAllProjects = async () => {
        const userId = getUserId();
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/projects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'userid': userId
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch all projects');
            }

            const data = await response.json();
            setAllProjects(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error('Error fetching all projects:', err);
        }
    };

    const fetchInProgressProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            // NO USER ID HEADER - fetches ALL in-progress projects
            const response = await fetch('http://localhost:5000/api/projects/in-progress', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                    // NO userid header!
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch in-progress projects');
            }

            const data = await response.json();
            console.log('✅ In-progress projects fetched:', data);
            setInProgressProjects(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error('❌ Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete project');

            // Update both lists
            setAllProjects(allProjects.filter(p => p._id !== projectId));
            setInProgressProjects(inProgressProjects.filter(p => p._id !== projectId));

            alert('Project deleted successfully!');
        } catch (err) {
            console.error('Error deleting project:', err);
            alert('Failed to delete project. Please try again.');
        }
    };

    const calculateStats = () => {
        // Calculate stats from user's projects
        const activeProjects = allProjects.filter(p =>
            p.status === 'in-progress' || p.status === 'review' || p.status === 'planning'
        ).length;

        const uniqueClients = new Set(allProjects.map(p => p.client)).size;
        const totalRevenue = allProjects.reduce((sum, p) => sum + (p.revenue || 0), 0);

        return { activeProjects, uniqueClients, totalRevenue };
    };

    const stats_calculated = calculateStats();

    const stats = [
        { title: 'Active Projects', value: stats_calculated.activeProjects.toString(), change: '+2', changeLabel: 'this week', icon: <Briefcase className="w-6 h-6" />, trend: 'up', color: 'blue' },
        { title: 'Total Clients', value: stats_calculated.uniqueClients.toString(), change: '+5', changeLabel: 'this month', icon: <Users className="w-6 h-6" />, trend: 'up', color: 'green' },
        { title: 'Revenue (MTD)', value: `£${(stats_calculated.totalRevenue / 1000).toFixed(1)}k`, change: '+18.2%', icon: <DollarSign className="w-6 h-6" />, trend: 'up', color: 'purple' },
        { title: 'Hours Logged', value: '156', change: '-5', changeLabel: 'from last week', icon: <Clock className="w-6 h-6" />, trend: 'down', color: 'orange' }
    ];

    const getStatusBadge = (status) => {
        const statusMap = {
            'completed': { variant: 'success', icon: <CheckCircle2 className="w-3 h-3" />, text: 'Completed' },
            'in-progress': { variant: 'info', icon: <Clock className="w-3 h-3" />, text: 'In Progress' },
            'review': { variant: 'warning', icon: <AlertCircle className="w-3 h-3" />, text: 'In Review' },
            'planning': { variant: 'default', icon: <Clock className="w-3 h-3" />, text: 'Planning' }
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

    const formatDeadline = (deadline) => {
        const date = new Date(deadline);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'Aditya'}!</h2>
                    <p className="text-gray-600">Here's what's happening with your projects today.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
            </div>

            {/* In-Progress Projects Table */}
            <div className="grid grid-cols-1 gap-6">
                <Card padding={false}>
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">In Progress Projects</h3>
                            <p className="text-sm text-gray-500 mt-1">All projects currently being worked on across the system</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>Filter</Button>
                            <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>Export</Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4">Loading projects...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-600">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                            <p>Error: {error}</p>
                            <Button className="mt-4" onClick={fetchAllData}>Retry</Button>
                        </div>
                    ) : inProgressProjects.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium">No projects in progress</p>
                            <p className="text-sm mt-2">Go to the Projects page to start working on projects!</p>
                        </div>
                    ) : (
                        <>
                            {/* Project Count */}
                            <div className="p-4 bg-blue-50 border-b border-blue-100">
                                <p className="text-sm text-blue-700">
                                    <span className="font-semibold">{inProgressProjects.length}</span> {inProgressProjects.length === 1 ? 'project' : 'projects'} currently in progress
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progress</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deadline</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {inProgressProjects.map((project) => (
                                            <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-sm">
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
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatDeadline(project.deadline)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
                                                        <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4 text-red-600" />} onClick={() => handleDeleteProject(project._id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;