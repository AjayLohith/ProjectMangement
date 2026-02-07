const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
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
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * Middleware to handle validation errors
 * Checks validation results and sends error response if validation failed
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: errors.array() 
        });
    }
    next();
};

// Validation rules
const registerValidation = [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isIn(['admin', 'project_lead', 'developer']).withMessage('Invalid role')
];

const loginValidation = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const mfaValidation = [
    body('secret').notEmpty().withMessage('MFA secret is required'),
    body('token').isLength({ min: 6, max: 6 }).isNumeric().withMessage('MFA token must be 6 digits')
];

const passwordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
];

const roleValidation = [
    body('role').isIn(['admin', 'project_lead', 'developer']).withMessage('Invalid role')
];

// Public routes
router.post('/login', loginValidation, handleValidationErrors, loginUser);
router.post('/logout', logoutUser);

// Protected routes
router.get('/me', protect, getUserProfile);
router.post('/register', protect, authorize('admin'), registerValidation, handleValidationErrors, registerUser); // Admin only

// MFA routes
router.get('/mfa/setup', protect, setupMFA);
router.post('/mfa/enable', protect, mfaValidation, handleValidationErrors, enableMFA);
router.post('/mfa/disable', protect, disableMFA);

// Password management
router.post('/password/update', protect, passwordValidation, handleValidationErrors, updatePassword);

// User management (Admin only)
router.get('/users', protect, authorize('admin'), getAllUsers);
router.patch('/users/:userId/role', protect, authorize('admin'), roleValidation, handleValidationErrors, updateUserRole);

module.exports = router;
