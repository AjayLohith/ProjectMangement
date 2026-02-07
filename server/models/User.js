/**
 * User Model
 * Defines the user schema with authentication and authorization fields
 * Includes password hashing and MFA support
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Stores user authentication and role information
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['admin', 'project_lead', 'developer'],
        default: 'developer',
        required: true
    },
    mfaSecret: {
        type: String,
        default: null,
        select: false // Don't include in queries by default for security
    }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt
});

/**
 * Pre-save hook: Hash password before saving
 * Only hashes if password is modified to avoid re-hashing on every save
 * Updated for Mongoose 9.x compatibility
 */
userSchema.pre('save', async function () {
    // Skip if password is not modified
    if (!this.isModified('password')) {
        return;
    }
    
    try {
        const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

/**
 * Instance method: Compare entered password with hashed password
 * @param {String} enteredPassword - Plain text password to verify
 * @returns {Boolean} - True if password matches, false otherwise
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
