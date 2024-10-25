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

router.post('/', authMiddleware, createTeam);

router.get('/:id', authMiddleware, getTeamById); 
router.get('/', authMiddleware, getAllTeams);
router.put('/:id/addMember', authMiddleware, addMemberToTeam);
router.put('/:id/removeMember', authMiddleware, removeMemberFromTeam);
router.put('/:id', authMiddleware, updateTeam);
module.exports = router;
