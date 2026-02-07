import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Upload State
    const [file, setFile] = useState(null);

    // Assign Devs State (Admin/Lead)
    const [selectedDevIds, setSelectedDevIds] = useState([]);
    const [allDevelopers, setAllDevelopers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch project details using single project endpoint
                const projRes = await api.get(`/projects/${id}`);
                setProject(projRes.data);

                // Get documents for this project
                const docsRes = await api.get(`/documents/project/${id}`);
                setDocuments(docsRes.data);

                // Fetch all developers for assignment dropdown (Admin/Lead only)
                if (user.role === 'admin' || (projRes.data.lead && (projRes.data.lead._id === user._id || projRes.data.lead === user._id))) {
                    try {
                        const usersRes = await api.get('/auth/users');
                        const developers = usersRes.data.filter(u => u.role === 'developer');
                        setAllDevelopers(developers);
                        
                        // Pre-select currently assigned developers
                        if (projRes.data.assignedDevelopers) {
                            const assignedIds = projRes.data.assignedDevelopers.map(dev => dev._id || dev);
                            setSelectedDevIds(assignedIds);
                        }
                    } catch (error) {
                        console.error('Failed to fetch developers', error);
                    }
                }
            } catch (error) {
                console.error("Error fetching project data", error);
                if (error.response?.status === 404 || error.response?.status === 403) {
                    setProject(null);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', id);

        try {
            await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Refresh documents
            const docsRes = await api.get(`/documents/project/${id}`);
            setDocuments(docsRes.data);
            setFile(null);
        } catch (error) {
            alert('Upload failed: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDownload = async (docId, filename) => {
        try {
            const response = await api.get(`/documents/${docId}/download`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            alert('Download failed');
        }
    };

    const handleAssignDev = async (e) => {
        e.preventDefault();
        if (!project) return;

        try {
            await api.post(`/projects/${id}/assign`, { developerIds: selectedDevIds });
            
            // Refresh project data
            const projRes = await api.get(`/projects/${id}`);
            setProject(projRes.data);
            
            alert('Developers assigned successfully!');
        } catch (error) {
            alert('Failed to assign developers: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDevSelectionChange = (devId, isChecked) => {
        if (isChecked) {
            setSelectedDevIds([...selectedDevIds, devId]);
        } else {
            setSelectedDevIds(selectedDevIds.filter(id => id !== devId));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found or access denied.</div>;

    const canUpload = user.role === 'admin' || (user.role === 'project_lead' && (project.lead._id === user._id || project.lead === user._id));
    const canAssign = canUpload; // Same permissions roughly

    return (
        <div className="container mx-auto p-6">
            <div className="bg-gray-800 p-6 rounded shadow-lg text-white mb-6">
                <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
                <div className="flex gap-4 text-sm text-gray-400 mb-4">
                    <span>Lead: {project.lead?.username || project.lead}</span>
                    <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                    <span>Status: {project.status}</span>
                </div>
                <p className="text-gray-300">{project.description}</p>

                <div className="mt-4">
                    <h4 className="font-bold">Assigned Developers:</h4>
                    <div className="flex gap-2 mt-2">
                        {project.assignedDevelopers && project.assignedDevelopers.length > 0 ? (
                            project.assignedDevelopers.map(dev => (
                                <span key={dev._id || dev} className="bg-blue-900 px-2 py-1 rounded text-xs">{dev.username || dev}</span>
                            ))
                        ) : (
                            <span className="text-gray-500">None</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Assignments (Lead/Admin) */}
            {canAssign && (
                <div className="bg-gray-800 p-6 rounded shadow-lg text-white mb-6">
                    <h3 className="text-xl font-bold mb-4">Assign Developers</h3>
                    <form onSubmit={handleAssignDev} className="space-y-4">
                        <div className="max-h-48 overflow-y-auto border border-gray-600 rounded p-3 bg-gray-700">
                            {allDevelopers.length === 0 ? (
                                <p className="text-gray-400 text-sm">No developers available</p>
                            ) : (
                                allDevelopers.map(dev => (
                                    <label key={dev._id} className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-600 px-2 rounded">
                                        <input
                                            type="checkbox"
                                            checked={selectedDevIds.includes(dev._id)}
                                            onChange={(e) => handleDevSelectionChange(dev._id, e.target.checked)}
                                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                        />
                                        <span>{dev.username}</span>
                                    </label>
                                ))
                            )}
                        </div>
                        <button 
                            type="submit" 
                            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 w-full"
                        >
                            Update Assignments
                        </button>
                    </form>
                </div>
            )}

            {/* Documents Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* List */}
                <div className="bg-gray-800 p-6 rounded shadow-lg text-white">
                    <h3 className="text-xl font-bold mb-4">Project Documents</h3>
                    <div className="space-y-2">
                        {documents.length === 0 && <p className="text-gray-500">No documents uploaded.</p>}
                        {documents.map(doc => (
                            <div key={doc._id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                                <div>
                                    <p className="font-bold text-sm">{doc.originalName}</p>
                                    <p className="text-xs text-gray-400">By {doc.uploader?.username} on {new Date(doc.createdAt).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => handleDownload(doc._id, doc.originalName)}
                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                >
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upload Form */}
                {canUpload && (
                    <div className="bg-gray-800 p-6 rounded shadow-lg text-white">
                        <h3 className="text-xl font-bold mb-4">Upload Document</h3>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <input
                                type="file"
                                onChange={e => setFile(e.target.files[0])}
                                className="w-full text-gray-300"
                            />
                            <button
                                type="submit"
                                disabled={!file}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                Upload File
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
