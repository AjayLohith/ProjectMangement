const Document = require('../models/Document');
const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { projectId } = req.body;
        const project = await Project.findById(projectId);

        if (!project) {
            // Clean up file if project not found
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check permissions: Admin, Lead of project, or Member of project
        // Actually, requirement: "Admins and Project Leads can upload"
        // Devs cannot upload.
        if (req.user.role !== 'admin' && req.user.role !== 'project_lead') {
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ message: 'Not authorized to upload documents' });
        }

        // If Project Lead, must be lead of THIS project
        if (req.user.role === 'project_lead' && project.lead.toString() !== req.user._id.toString()) {
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ message: 'Not authorized for this project' });
        }

        const document = await Document.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            project: projectId,
            uploader: req.user._id
        });

        res.status(201).json(document);
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message });
    }
};

const getProjectDocuments = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);

        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Access: Admin, Lead, or Assigned Dev
        const isAssigned = project.assignedDevelopers.includes(req.user._id);
        const isLead = project.lead.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isLead && !isAssigned) {
            return res.status(403).json({ message: 'Not authorized to view documents' });
        }

        const documents = await Document.find({ project: projectId }).populate('uploader', 'username');
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const downloadDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found' });

        // Check permissions logic (same as view)
        const project = await Project.findById(document.project);
        const isAssigned = project.assignedDevelopers.includes(req.user._id);
        const isLead = project.lead.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isLead && !isAssigned) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.download(document.path, document.originalName);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadDocument,
    getProjectDocuments,
    downloadDocument
};
