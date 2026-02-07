const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * Get all active projects
 * All authenticated users can view active projects
 */
router.get('/', protect, async (req, res) => {
    try {
        // Requirement: "View Projects: All users can view a list of active projects."
        const projects = await Project.find({ status: 'active' })
            .populate('lead', 'username')
            .populate('assignedDevelopers', 'username')
            .sort({ createdAt: -1 }); // Sort by newest first
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch projects' });
    }
});

/**
 * Get single project by ID
 * Users can only view projects they have access to
 */
router.get('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('lead', 'username')
            .populate('assignedDevelopers', 'username');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check access: Admin, Lead, or Assigned Developer
        const isAssigned = project.assignedDevelopers.some(
            dev => dev._id.toString() === req.user._id.toString()
        );
        const isLead = project.lead._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isLead && !isAssigned && project.status === 'active') {
            // For active projects, all users can view (per requirement)
            // But if not assigned, they can still view active projects
        } else if (!isAdmin && !isLead && !isAssigned) {
            return res.status(403).json({ message: 'Not authorized to view this project' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch project' });
    }
});

/**
 * Create new project (Admin only)
 * Requires: name, description, deadline, and lead (User ID)
 */
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { name, description, deadline, lead } = req.body;

        // Input validation
        if (!name || !description || !deadline || !lead) {
            return res.status(400).json({ message: 'Missing required fields: name, description, deadline, lead' });
        }

        // Validate deadline is in the future
        const deadlineDate = new Date(deadline);
        if (deadlineDate < new Date()) {
            return res.status(400).json({ message: 'Deadline must be in the future' });
        }

        // Verify lead user exists and is a project_lead
        const User = require('../models/User');
        const leadUser = await User.findById(lead);
        if (!leadUser) {
            return res.status(404).json({ message: 'Lead user not found' });
        }
        if (leadUser.role !== 'project_lead' && leadUser.role !== 'admin') {
            return res.status(400).json({ message: 'Lead must be a project lead or admin' });
        }

        const project = new Project({
            name: name.trim(),
            description: description.trim(),
            deadline: deadlineDate,
            lead
        });
        const createdProject = await project.save();
        
        // Populate before returning
        await createdProject.populate('lead', 'username');
        res.status(201).json(createdProject);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create project' });
    }
});

/**
 * Mark project as completed (Admin only)
 */
router.patch('/:id/complete', protect, authorize('admin'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.status = 'completed';
        const updatedProject = await project.save();
        
        await updatedProject.populate('lead', 'username');
        await updatedProject.populate('assignedDevelopers', 'username');
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update project status' });
    }
});

/**
 * Assign developers to project (Project Lead or Admin)
 * Project Leads can only assign to their own projects
 */
router.post('/:id/assign', protect, authorize('project_lead', 'admin'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check authorization: Admin or Lead of this project
        if (req.user.role !== 'admin' && project.lead.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to manage this project' });
        }

        const { developerIds } = req.body; // Array of User IDs

        // Validate that all IDs are valid developers
        if (!Array.isArray(developerIds)) {
            return res.status(400).json({ message: 'developerIds must be an array' });
        }

        const User = require('../models/User');
        const developers = await User.find({ 
            _id: { $in: developerIds },
            role: 'developer' 
        });

        if (developers.length !== developerIds.length) {
            return res.status(400).json({ message: 'One or more developer IDs are invalid' });
        }

        // Remove duplicates
        project.assignedDevelopers = [...new Set(developerIds.map(id => id.toString()))];
        await project.save();
        
        await project.populate('lead', 'username');
        await project.populate('assignedDevelopers', 'username');
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Failed to assign developers' });
    }
});

/**
 * Get projects assigned to current user (Developer view)
 * Returns both active and completed projects the developer is assigned to
 */
router.get('/my-assignments', protect, async (req, res) => {
    try {
        const projects = await Project.find({ 
            assignedDevelopers: req.user._id 
        })
        .populate('lead', 'username')
        .populate('assignedDevelopers', 'username')
        .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch assigned projects' });
    }
});

module.exports = router;
