import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

/**
 * Admin Panel Component
 * Allows admin to:
 * - Create new users
 * - View all users
 * - Edit user roles
 */
const AdminPanel = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('developer');
    const [message, setMessage] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingRole, setEditingRole] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAllUsers();
        }
    }, [user]);

    const fetchAllUsers = async () => {
        try {
            const { data } = await api.get('/auth/users');
            setAllUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch users', error);
            setAllUsers([]);
        }
    };

    if (user?.role !== 'admin') return <div className="text-red-500">Access Denied</div>;

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/auth/register', { username, password, role });
            setMessage('User registered successfully');
            setUsername('');
            setPassword('');
            setRole('developer');
            fetchAllUsers();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleUpdateRole = async (userId) => {
        try {
            await api.patch(`/auth/users/${userId}/role`, { role: editingRole });
            setMessage('User role updated successfully');
            setEditingUserId(null);
            setEditingRole('');
            fetchAllUsers();
        } catch (error) {
            setMessage('Failed to update user role: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="space-y-6">
            {/* Create New User */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl text-white font-bold mb-4">Create New User</h3>
                {message && (
                    <div
                        className={`p-2 rounded mb-4 text-sm ${
                            message.includes('success') ? 'bg-green-500' : 'bg-red-500'
                        } text-white`}
                    >
                        {message}
                    </div>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                            required
                            minLength={3}
                            maxLength={30}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                            required
                            minLength={8}
                        />
                        <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                        >
                            <option value="developer">Developer</option>
                            <option value="project_lead">Project Lead</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Register User
                    </button>
                </form>
            </div>

            {/* User Management */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl text-white font-bold mb-4">Manage Users</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="p-2 text-gray-400">Username</th>
                                <th className="p-2 text-gray-400">Role</th>
                                <th className="p-2 text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(Array.isArray(allUsers) ? allUsers : []).map((u) => (
                                <tr key={u._id} className="border-b border-gray-700">
                                    <td className="p-2 text-white">{u.username}</td>
                                    <td className="p-2">
                                        {editingUserId === u._id ? (
                                            <select
                                                value={editingRole}
                                                onChange={(e) => setEditingRole(e.target.value)}
                                                className="bg-gray-700 text-white border border-gray-600 rounded p-1"
                                            >
                                                <option value="developer">Developer</option>
                                                <option value="project_lead">Project Lead</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <span className="text-gray-300">{u.role}</span>
                                        )}
                                    </td>
                                    <td className="p-2">
                                        {editingUserId === u._id ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateRole(u._id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingUserId(null);
                                                        setEditingRole('');
                                                    }}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1 rounded"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingUserId(u._id);
                                                    setEditingRole(u.role);
                                                }}
                                                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-2 py-1 rounded"
                                            >
                                                Edit Role
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
