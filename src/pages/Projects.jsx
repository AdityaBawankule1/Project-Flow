import React, { useState, useEffect } from "react";
import {
    Briefcase,
    Plus,
    Filter,
    Download,
    Clock,
    AlertCircle,
    CheckCircle2,
    Trash2,
    Edit,
    Search
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import ProgressBar from "../components/ui/ProgressBar";
import Modal from "../components/ui/Modal";

const ProjectsPage = ({ user }) => {
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const getUserId = () => {
        const savedUser = localStorage.getItem('user');
        const userData = savedUser ? JSON.parse(savedUser) : null;
        return user?._id || userData?._id;
    };

    const [formData, setFormData] = useState({
        name: '',
        client: '',
        clientLogo: '',
        status: 'planning',
        deadline: '',
        progress: 0,
        priority: 'medium'
    });

    // Fetch projects on mount
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

    // Convert ISO YYYY-MM-DD to DD/MM/YYYY
    const convertToDDMMYYYY = (isoDate) => {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();

        const userId = getUserId();
        if (!userId) {
            alert("User session not found.");
            return;
        }

        // Validate required fields
        const missing = [];
        const projectName = formData.name?.trim() || '';
        const clientName = formData.client?.trim() || '';
        const deadline = formData.deadline?.trim() || '';

        if (!projectName) missing.push("Project Name");
        if (!clientName) missing.push("Client Name");
        if (!deadline) missing.push("Deadline");

        if (missing.length > 0) {
            alert(`Please fill in required fields: ${missing.join(", ")}`);
            return;
        }

        const projectData = {
            userId,
            name: projectName,
            client: clientName,
            deadline: convertToDDMMYYYY(deadline),
            status: formData.status || 'planning',
            priority: formData.priority || 'medium',
            progress: Number(formData.progress) || 0,
            clientLogo: clientName ? clientName.substring(0, 2).toUpperCase() : '??'
        };

        try {
            const response = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message);
            }

            setProjects([result, ...projects]);
            setShowNewProjectModal(false);
            setFormData({
                name: '',
                client: '',
                status: 'planning',
                deadline: '',
                progress: 0,
                priority: 'medium',
                clientLogo: ''
            });
            alert('Project created successfully!');

        } catch (err) {
            alert(`Failed to create project: ${err.message}`);
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete project');

            setProjects(projects.filter(p => p._id !== projectId));
            alert('Project deleted successfully!');
        } catch (err) {
            console.error('Error deleting project:', err);
            alert('Failed to delete project. Please try again.');
        }
    };

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

    // Filter and search projects
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">All Projects</h2>
                    <p className="text-gray-600">Manage and track all your projects in one place</p>
                </div>
                {user.role === 'CEO' && (
                    <Button
                        icon={<Plus className="w-4 h-4" />}
                        onClick={() => setShowNewProjectModal(true)}
                    >
                        New Project
                    </Button>
                )}

            </div>

            {/* Search and Filter Bar */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search projects or clients..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="planning">Planning</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">In Review</option>
                            <option value="completed">Completed</option>
                        </select>
                        <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                            Export
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 gap-6">
                <Card padding={false}>
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4">Loading projects...</p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-600">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                            <p>Error: {error}</p>
                            <Button className="mt-4" onClick={fetchProjects}>Retry</Button>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium">
                                {searchQuery || filterStatus !== 'all' ? 'No projects found' : 'No projects yet'}
                            </p>
                            <p className="text-sm mt-2">
                                {searchQuery || filterStatus !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Click "New Project" to get started!'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Projects Count */}
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{filteredProjects.length}</span> of <span className="font-semibold text-gray-900">{projects.length}</span> projects
                                </p>
                            </div>

                            {/* Projects Table */}
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
                                        {filteredProjects.map((project) => (
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
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {formatDeadline(project.deadline)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />} />
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<Trash2 className="w-4 h-4 text-red-600" />}
                                                            onClick={() => handleDeleteProject(project._id)}
                                                        />
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

            {/* New Project Modal */}
            <Modal isOpen={showNewProjectModal} onClose={() => setShowNewProjectModal(false)} title="Create New Project">
                <form onSubmit={handleCreateProject} className="space-y-4">
                    {/* Project Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Website Redesign"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Client Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Tech Corp"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="planning">Planning</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">In Review</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* Progress */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                            value={formData.progress}
                            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deadline <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="ghost" fullWidth onClick={() => setShowNewProjectModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" fullWidth>
                            Create Project
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProjectsPage;