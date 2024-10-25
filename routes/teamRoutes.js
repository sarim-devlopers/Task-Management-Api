const express = require('express');
const router = express.Router();
const { 
    createTeam, 
    getTeamById, 
    getAllTeams, 
    addMemberToTeam, 
    removeMemberFromTeam, 
    updateTeam
} = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new team
router.post('/', authMiddleware, createTeam);

// Get a team by ID
router.get('/:id', authMiddleware, getTeamById); 

// Get all teams
router.get('/', authMiddleware, getAllTeams);

// Add a member to a team
router.put('/:id/addMember', authMiddleware, addMemberToTeam);

// Remove a member from a team
router.put('/:id/removeMember', authMiddleware, removeMemberFromTeam);

// Update team information
router.put('/:id', authMiddleware, updateTeam);

module.exports = router;
