import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Login Page with MFA Support
 * Handles two-step authentication if MFA is enabled for the user
 */
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [requiresMFA, setRequiresMFA] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(username, password, mfaToken);
            
            // Check if MFA is required
            if (response && response.requiresMFA) {
                setRequiresMFA(true);
                setLoading(false);
                return;
            }

            // Login successful
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            setRequiresMFA(false);
            setMfaToken('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96 border border-gray-700 animate-fadeIn">
                <div className="text-center mb-6">
                    <h2 className="text-3xl text-white font-bold mb-2">PixelForge Nexus</h2>
                    <p className="text-gray-400 text-sm">Secure Project Management</p>
                </div>
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm animate-shake">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}
                
                {requiresMFA && (
                    <div className="bg-blue-900 bg-opacity-30 border border-blue-500 p-3 rounded mb-4">
                        <p className="text-blue-300 text-sm">
                            Please enter the 6-digit code from your authenticator app
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!requiresMFA ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                                    required
                                    disabled={requiresMFA}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-400 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                                    required
                                    disabled={requiresMFA}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="mb-6">
                            <label className="block text-gray-400 mb-2">MFA Code</label>
                            <input
                                type="text"
                                value={mfaToken}
                                onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                                required
                                autoFocus
                            />
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Enter the 6-digit code from your authenticator app
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {requiresMFA ? 'Verifying...' : 'Logging in...'}
                            </>
                        ) : (
                            requiresMFA ? 'Verify & Login' : 'Login'
                        )}
                    </button>

                    {requiresMFA && (
                        <button
                            type="button"
                            onClick={() => {
                                setRequiresMFA(false);
                                setMfaToken('');
                                setError('');
                            }}
                            className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                        >
                            Back
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;
