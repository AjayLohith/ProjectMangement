/**
 * Document Model
 * Defines the document schema for project file uploads
 * Tracks file metadata and associations with projects and users
 */

const mongoose = require('mongoose');

/**
 * Document Schema
 * Represents uploaded project documents (design docs, meeting notes, etc.)
 */
const documentSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true // Server-generated unique filename
    },
    originalName: {
        type: String,
        required: true // Original filename from user
    },
    path: {
        type: String,
        required: true // File system path
    },
    mimetype: {
        type: String,
        required: true // MIME type (e.g., 'application/pdf')
    },
    size: {
        type: Number,
        required: true, // File size in bytes
        min: 0
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Document', documentSchema);
