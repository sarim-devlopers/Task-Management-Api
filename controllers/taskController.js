const Task = require('../models/Task');
const User = require('../models/User');
const { sendTaskReminder, sendOverdueNotification } = require('../utils/emailService');
let io;

// Initialize WebSocket in the task controller
exports.initSocket = (socketIoInstance) => {
  io = socketIoInstance;
};

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, priority, dueDate, assignedTo, team, dependencies } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      team,
      dependencies,
    });

    await newTask.save();
    io.to(team).emit('taskCreated', newTask);  // Emit WebSocket event to notify team

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all tasks with filtering and sorting options
exports.getTasks = async (req, res) => {
  const { status, priority, dueDate, assignedTo, sortBy } = req.query;

  let filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (dueDate === 'upcoming') filter.dueDate = { $gte: new Date() };
  if (dueDate === 'overdue') filter.dueDate = { $lt: new Date() };
  if (assignedTo) filter.assignedTo = assignedTo;

  let sort = {};
  if (sortBy === 'priority') sort.priority = 1;
  if (sortBy === 'dueDate') sort.dueDate = 1;
  if (sortBy === 'creationDate') sort.createdAt = 1;

  try {
    const tasks = await Task.find(filter).sort(sort).populate('assignedTo team');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, dueDate, assignedTo, status, dependencies } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;
    task.dependencies = dependencies || task.dependencies;

    await task.save();
    io.to(task.team).emit('taskUpdated', task);  // Emit WebSocket event

    res.json(task);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    io.to(task.team).emit('taskDeleted', id);  // Emit WebSocket event
    res.json({ msg: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Mark a task as complete or incomplete
exports.toggleTaskStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate('dependencies');
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    if (task.status === 'complete') {
      task.status = 'incomplete';
    } else {
      // Check for task dependencies
      const incompleteDependencies = task.dependencies.filter(dep => dep.status !== 'complete');
      if (incompleteDependencies.length > 0) {
        return res.status(400).json({ msg: 'Cannot complete task with incomplete dependencies' });
      }
      task.status = 'complete';
    }

    await task.save();
    io.to(task.team).emit('taskStatusChanged', task);  // Emit WebSocket event

    res.json(task);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Send reminders for tasks approaching deadlines
exports.sendTaskReminderEmails = async () => {
  try {
    const upcomingTasks = await Task.find({
      dueDate: { $gte: new Date(), $lte: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) },
      status: 'incomplete',
    }).populate('assignedTo');

    for (const task of upcomingTasks) {
      for (const user of task.assignedTo) {
        await sendTaskReminder(user.email, task);
      }
    }
  } catch (error) {
    console.error('Error sending task reminders:', error);
  }
};

// Send overdue task notifications
exports.sendOverdueTaskNotifications = async () => {
  try {
    const overdueTasks = await Task.find({
      dueDate: { $lt: new Date() },
      status: 'incomplete',
    }).populate('assignedTo');

    for (const task of overdueTasks) {
      for (const user of task.assignedTo) {
        await sendOverdueNotification(user.email, task);
      }
    }
  } catch (error) {
    console.error('Error sending overdue notifications:', error);
  }
};
// Get a task by ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const task = await Task.findById(id).populate('assignedTo team');
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }
  
      res.json(task);
    } catch (error) {
      res.status(500).json({ msg: 'Server error' });
    }
  };
  