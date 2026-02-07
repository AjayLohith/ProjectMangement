import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-blue-400">PixelForge Nexus</Link>
                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            <span className="text-gray-300">Welcome, {user.username} ({user.role})</span>
                            <Link to="/dashboard" className="text-white hover:text-blue-300">Dashboard</Link>
                            <Link to="/settings" className="text-white hover:text-blue-300">Settings</Link>
                            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="text-white hover:text-blue-300">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
