const Team = require('../models/Team');
const User = require('../models/User');
let io;

// Initialize WebSocket in the team controller
exports.initSocket = (socketIoInstance) => {
  io = socketIoInstance;
};

// Create a new team
exports.createTeam = async (req, res) => {
  const { name, owner } = req.body;

  try {
    const team = new Team({ name, owner, roles: { owner: [owner], admin: [], member: [] } });
    await team.save();

    const user = await User.findById(owner);
    if (user) {
      user.teams.push(team._id);
      await user.save();
    }

    io.emit('teamCreated', team);  // Notify all users that a new team has been created
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add a member to a team
exports.addMemberToTeam = async (req, res) => {
  const { teamId, userId } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      user.teams.push(teamId);
      await team.save();
      await user.save();
    }

    io.to(teamId).emit('memberAdded', user);  // Emit WebSocket event to notify team
    res.json(team);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Remove a member from a team
exports.removeMemberFromTeam = async (req, res) => {
  const { teamId, userId } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }

    team.members = team.members.filter(memberId => memberId.toString() !== userId);
    await team.save();

    const user = await User.findById(userId);
    if (user) {
      user.teams = user.teams.filter(tId => tId.toString() !== teamId);
      await user.save();
    }

    io.to(teamId).emit('memberRemoved', userId);  // Notify team that member was removed
    res.json(team);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get team details
exports.getTeamById = async (req, res) => {
  const { id } = req.params;

  try {
    const team = await Team.findById(id).populate('owner members');
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('owner members');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.updateTeam = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    try {
      const team = await Team.findByIdAndUpdate(id, { name }, { new: true });
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ msg: 'Server error' });
    }
  };
  