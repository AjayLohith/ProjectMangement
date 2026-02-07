/**
 * Project Model
 * Defines the project schema with team assignment and status tracking
 */

const mongoose = require('mongoose');

/**
 * Project Schema
 * Represents a game development project with assigned team members
 */
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    deadline: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > new Date(); // Deadline must be in the future
            },
            message: 'Deadline must be in the future'
        }
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedDevelopers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Project', projectSchema);
