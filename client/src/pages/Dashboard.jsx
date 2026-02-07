import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import AdminPanel from './AdminPanel';

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // New Project Form State (Admin only)
    const [newProject, setNewProject] = useState({ name: '', description: '', deadline: '', lead: '' });
    const [leads, setLeads] = useState([]); // For dropdown
    const [allUsers, setAllUsers] = useState([]); // All users for admin

    useEffect(() => {
        fetchProjects();
        if (user.role === 'admin') {
            fetchAllUsers();
        }
    }, [user]);

    const fetchAllUsers = async () => {
        try {
            const { data } = await api.get('/auth/users');
            setAllUsers(data);
            // Filter to only project leads and admins for lead dropdown
            setLeads(data.filter(u => u.role === 'project_lead' || u.role === 'admin'));
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const fetchProjects = async () => {
        try {
            setLoading(true);
            // Logic differs by role
            let endpoint = '/projects';
            if (user.role === 'developer') {
                endpoint = '/projects/my-assignments';
            }
            const { data } = await api.get(endpoint);
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
            // Show user-friendly error
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            // For Lead, we need a valid User ObjectId.
            // We'll just ask for the ID in the form for now to keep it simple, 
            // or fetch users if we have time.
            await api.post('/projects', newProject);
            setNewProject({ name: '', description: '', deadline: '', lead: '' });
            fetchProjects();
        } catch (error) {
            alert('Error creating project');
        }
    };

    // Mark Complete (Admin)
    const handleMarkComplete = async (id) => {
        try {
            await api.patch(`/projects/${id}/complete`);
            fetchProjects();
        } catch (error) {
            alert('Error updating status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-400">Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl text-white font-bold mb-6">Dashboard ({user.role})</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Projects List */}
                <div>
                    <h3 className="text-xl text-blue-400 font-bold mb-4">
                        {user.role === 'developer' ? 'My Assigned Projects' : 'Active Projects'}
                    </h3>
                    <div className="space-y-4">
                        {projects.length === 0 && <p className="text-gray-400">No projects found.</p>}
                        {projects.map((project) => (
                            <div key={project._id} className="bg-gray-800 p-4 rounded shadow border border-gray-700 hover:border-blue-500 transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-bold text-white">
                                            <Link to={`/projects/${project._id}`} className="hover:underline">{project.name}</Link>
                                        </h4>
                                        <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                                        <div className="mt-2 text-xs text-gray-500">
                                            <span className="mr-2">📅 {new Date(project.deadline).toLocaleDateString()}</span>
                                            <span className={`px-2 py-0.5 rounded ${project.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                    {user.role === 'admin' && project.status === 'active' && (
                                        <button
                                            onClick={() => handleMarkComplete(project._id)}
                                            className="bg-yellow-600 text-xs px-2 py-1 rounded hover:bg-yellow-700 text-white"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Actions (Admin Only) */}
                {user.role === 'admin' && (
                    <div className="space-y-8">
                        <AdminPanel />

                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl text-white font-bold mb-4">Add New Project</h3>
                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Project Name"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    required
                                />
                                <textarea
                                    placeholder="Description"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    required
                                />
                                <input
                                    type="date"
                                    value={newProject.deadline}
                                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    required
                                />
                                <select
                                    value={newProject.lead}
                                    onChange={(e) => setNewProject({ ...newProject, lead: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                    required
                                >
                                    <option value="">Select Project Lead</option>
                                    {leads.map(lead => (
                                        <option key={lead._id} value={lead._id}>
                                            {lead.username} ({lead.role})
                                        </option>
                                    ))}
                                </select>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Create Project
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
