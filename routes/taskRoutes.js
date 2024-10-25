const express = require('express');
const router = express.Router();
const { 
    createTask, 
    getTaskById, 
    getTasks,        // assuming getTasks is intended as filterTasks
    updateTask, 
    deleteTask, 
    toggleTaskStatus  // assuming toggleTaskStatus replaces markTaskComplete
  } = require('../controllers/taskController');
  
const authMiddleware = require('../middlewares/authMiddleware');

// Create a task
router.post('/', authMiddleware, createTask);

// Get task by ID
router.get('/:id', authMiddleware, getTaskById);

// Get all tasks (with optional filtering)
router.get('/', authMiddleware, getTasks);

// Update a task
router.put('/:id', authMiddleware, updateTask);

// Delete a task
router.delete('/:id', authMiddleware, deleteTask);

// Mark task as complete
router.put('/:id/complete', authMiddleware,  toggleTaskStatus);

module.exports = router;
