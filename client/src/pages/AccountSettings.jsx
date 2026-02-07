import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

/**
 * Account Settings Page
 * Allows users to:
 * - Update their password
 * - Setup/enable/disable MFA
 */
const AccountSettings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('password');
    
    // Password update state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordMessage, setPasswordMessage] = useState('');

    // MFA state
    const [mfaSetup, setMfaSetup] = useState(null);
    const [mfaToken, setMfaToken] = useState('');
    const [mfaMessage, setMfaMessage] = useState('');
    const [mfaEnabled, setMfaEnabled] = useState(false);

    useEffect(() => {
        // Check if MFA is enabled
        if (user) {
            setMfaEnabled(user.mfaEnabled || false);
        }
    }, [user]);

    // Handle password update
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordMessage('New password must be at least 8 characters long');
            return;
        }

        try {
            await api.post('/auth/password/update', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordMessage('Password updated successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setPasswordMessage(error.response?.data?.message || 'Failed to update password');
        }
    };

    // Setup MFA
    const handleSetupMFA = async () => {
        try {
            const { data } = await api.get('/auth/mfa/setup');
            setMfaSetup(data);
            setMfaMessage('');
        } catch (error) {
            setMfaMessage('Failed to setup MFA');
        }
    };

    // Enable MFA after verification
    const handleEnableMFA = async (e) => {
        e.preventDefault();
        setMfaMessage('');

        if (!mfaToken || mfaToken.length !== 6) {
            setMfaMessage('Please enter a valid 6-digit token');
            return;
        }

        try {
            await api.post('/auth/mfa/enable', {
                secret: mfaSetup.secret,
                token: mfaToken
            });
            setMfaMessage('MFA enabled successfully!');
            setMfaEnabled(true);
            setMfaSetup(null);
            setMfaToken('');
        } catch (error) {
            setMfaMessage(error.response?.data?.message || 'Failed to enable MFA. Please verify the token is correct.');
        }
    };

    // Disable MFA
    const handleDisableMFA = async () => {
        if (!window.confirm('Are you sure you want to disable MFA? This will reduce your account security.')) {
            return;
        }

        try {
            await api.post('/auth/mfa/disable');
            setMfaMessage('MFA disabled successfully');
            setMfaEnabled(false);
        } catch (error) {
            setMfaMessage('Failed to disable MFA');
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h2 className="text-3xl text-white font-bold mb-6">Account Settings</h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('password')}
                    className={`px-4 py-2 font-semibold ${
                        activeTab === 'password'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Change Password
                </button>
                <button
                    onClick={() => setActiveTab('mfa')}
                    className={`px-4 py-2 font-semibold ${
                        activeTab === 'mfa'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Multi-Factor Authentication
                </button>
            </div>

            {/* Password Update Tab */}
            {activeTab === 'password' && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl text-white font-bold mb-4">Update Password</h3>
                    {passwordMessage && (
                        <div
                            className={`p-3 rounded mb-4 ${
                                passwordMessage.includes('success')
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                            }`}
                        >
                            {passwordMessage}
                        </div>
                    )}
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-2">Current Password</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                                }
                                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                                }
                                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                required
                                minLength={8}
                            />
                            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                }
                                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
                                required
                                minLength={8}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            )}

            {/* MFA Tab */}
            {activeTab === 'mfa' && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl text-white font-bold mb-4">Multi-Factor Authentication</h3>
                    
                    {mfaMessage && (
                        <div
                            className={`p-3 rounded mb-4 ${
                                mfaMessage.includes('success')
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                            }`}
                        >
                            {mfaMessage}
                        </div>
                    )}

                    {mfaEnabled ? (
                        <div>
                            <div className="bg-green-900 bg-opacity-30 border border-green-500 p-4 rounded mb-4">
                                <p className="text-green-300 font-semibold mb-2">✓ MFA is currently enabled</p>
                                <p className="text-gray-400 text-sm">
                                    Your account is protected with two-factor authentication. You'll need to enter a
                                    code from your authenticator app when logging in.
                                </p>
                            </div>
                            <button
                                onClick={handleDisableMFA}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Disable MFA
                            </button>
                        </div>
                    ) : (
                        <div>
                            {!mfaSetup ? (
                                <div>
                                    <p className="text-gray-400 mb-4">
                                        Multi-factor authentication adds an extra layer of security to your account.
                                        You'll need to use an authenticator app (like Google Authenticator or Authy) to
                                        generate codes when logging in.
                                    </p>
                                    <button
                                        onClick={handleSetupMFA}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Setup MFA
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-400 mb-4">
                                        Scan this QR code with your authenticator app, then enter the 6-digit code to
                                        verify and enable MFA.
                                    </p>
                                    <div className="flex flex-col items-center mb-4">
                                        <img src={mfaSetup.qrCode} alt="MFA QR Code" className="mb-4 bg-white p-2 rounded" />
                                        <div className="bg-gray-700 p-3 rounded mb-4">
                                            <p className="text-xs text-gray-400 mb-1">Manual Entry Key:</p>
                                            <p className="text-white font-mono text-sm">{mfaSetup.manualEntryKey}</p>
                                        </div>
                                    </div>
                                    <form onSubmit={handleEnableMFA} className="space-y-4">
                                        <div>
                                            <label className="block text-gray-400 mb-2">Enter 6-digit code</label>
                                            <input
                                                type="text"
                                                value={mfaToken}
                                                onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 text-center text-2xl tracking-widest"
                                                placeholder="000000"
                                                maxLength={6}
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Verify & Enable
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMfaSetup(null);
                                                    setMfaToken('');
                                                    setMfaMessage('');
                                                }}
                                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccountSettings;

