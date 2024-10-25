const express = require('express');
const router = express.Router();
const { 
    createTask, 
    getTaskById, 
    getTasks,        
    updateTask, 
    deleteTask, 
    toggleTaskStatus  
  } = require('../controllers/taskController');
  
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createTask);

router.get('/:id', authMiddleware, getTaskById);

router.get('/', authMiddleware, getTasks);

router.put('/:id', authMiddleware, updateTask);

router.delete('/:id', authMiddleware, deleteTask);

router.put('/:id/complete', authMiddleware,  toggleTaskStatus);

module.exports = router;
