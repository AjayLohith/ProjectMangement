const User = require('../models/User');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

/**
 * Generate JWT token and set it as HTTP-only cookie
 * @param {Object} res - Express response object
 * @param {String} userId - User ID
 * @param {String} role - User role
 */
const generateToken = (res, userId, role) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

/**
 * Register a new user (Admin only)
 * Validates input and creates user with hashed password
 * Note: Validation is handled by middleware before this function is called
 */
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Validate role
        const validRoles = ['admin', 'project_lead', 'developer'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        // Create user (password will be hashed by pre-save hook)
        const user = await User.create({
            username: username.trim(),
            password,
            role: role || 'developer'
        });

        if (user) {
            generateToken(res, user._id, user.role);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Login user with optional MFA verification
 * Supports two-step authentication if MFA is enabled for the user
 * Note: Validation is handled by middleware before this function is called
 */
const loginUser = async (req, res) => {
    const { username, password, mfaToken } = req.body;

    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            // Generic error message to prevent username enumeration
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if MFA is enabled
        if (user.mfaSecret) {
            // MFA is enabled, require token
            if (!mfaToken) {
                return res.status(200).json({ 
                    requiresMFA: true,
                    message: 'MFA token required' 
                });
            }

            // Verify MFA token
            const verified = speakeasy.totp.verify({
                secret: user.mfaSecret,
                encoding: 'base32',
                token: mfaToken,
                window: 2 // Allow 2 time steps (60 seconds) of tolerance
            });

            if (!verified) {
                return res.status(401).json({ message: 'Invalid MFA token' });
            }
        }

        // Login successful
        generateToken(res, user._id, user.role);
        return res.status(200).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            mfaEnabled: !!user.mfaSecret
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * Get current user profile
 */
const getUserProfile = async (req, res) => {
    try {
        // req.user already has mfaSecret from middleware (we removed the exclusion)
        const userProfile = {
            _id: req.user._id,
            username: req.user.username,
            role: req.user.role,
            mfaEnabled: !!req.user.mfaSecret
        };
        
        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
};

/**
 * Setup MFA for a user
 * Generates a secret and QR code for TOTP authentication
 */
const setupMFA = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a secret
        const secret = speakeasy.generateSecret({
            name: `PixelForge Nexus (${user.username})`,
            issuer: 'PixelForge Nexus'
        });

        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

        // Store temporary secret in session or return it (user must verify before saving)
        // For simplicity, we'll return it and require verification in enableMFA
        res.status(200).json({
            secret: secret.base32,
            qrCode: qrCodeUrl,
            manualEntryKey: secret.base32
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to setup MFA' });
    }
};

/**
 * Enable MFA after verification
 * User must provide a valid token to enable MFA
 * Note: Validation is handled by middleware before this function is called
 */
const enableMFA = async (req, res) => {
    const { secret, token } = req.body;

    try {
        // Verify the token before enabling MFA
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 2
        });

        if (!verified) {
            return res.status(400).json({ message: 'Invalid MFA token. Please try again.' });
        }

        // Save the secret to user
        const user = await User.findById(req.user._id);
        user.mfaSecret = secret;
        await user.save();

        res.status(200).json({ message: 'MFA enabled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to enable MFA' });
    }
};

/**
 * Disable MFA for a user
 */
const disableMFA = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.mfaSecret = null;
        await user.save();

        res.status(200).json({ message: 'MFA disabled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to disable MFA' });
    }
};

/**
 * Update user password
 * Note: Validation is handled by middleware before this function is called
 */
const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user._id);
        
        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters long' });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update password' });
    }
};

/**
 * Get all users (Admin only)
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password -mfaSecret');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

/**
 * Update user role (Admin only)
 * Note: Validation is handled by middleware before this function is called
 */
const updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    try {
        const validRoles = ['admin', 'project_lead', 'developer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            _id: user._id,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user role' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    setupMFA,
    enableMFA,
    disableMFA,
    updatePassword,
    getAllUsers,
    updateUserRole
};
