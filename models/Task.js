const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  dueDate: { type: Date, required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  status: { type: String, enum: ['incomplete', 'complete'], default: 'incomplete' },
});

module.exports = mongoose.model('Task', TaskSchema);
