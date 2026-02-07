/**
 * Authentication Middleware
 * Provides route protection and role-based authorization
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - requires valid JWT token
 * Extracts token from HTTP-only cookie and verifies it
 * Attaches user object to request if authentication succeeds
 */
const protect = async (req, res, next) => {
    let token;

    // Extract token from cookie
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify token and decode user information
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user from database (exclude password, but keep mfaSecret for profile checks)
        req.user = await User.findById(decoded.userId).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

/**
 * Authorize routes - requires specific role(s)
 * Must be used after protect middleware
 * @param {...String} roles - Allowed roles (e.g., 'admin', 'project_lead')
 * @returns {Function} - Express middleware function
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized for this action' });
        }
        next();
    };
};

module.exports = { protect, authorize };
