const express = require('express');
const router = express.Router();
const {
    uploadDocument,
    getProjectDocuments,
    downloadDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Upload Document (Admin & Lead)
// We need middleware to handle file upload before controller
router.post('/upload', protect, upload.single('file'), uploadDocument);

// Get Project Documents (All assigned)
router.get('/project/:projectId', protect, getProjectDocuments);

// Download Document (All assigned)
router.get('/:id/download', protect, downloadDocument);

module.exports = router;
