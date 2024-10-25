const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const taskController = require('./controllers/taskController');

// Load environment variables
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));

const server = http.createServer(app);
const io = socketIo(server);
require('./utils/websocket')(io);

// Initialize WebSocket in controllers
taskController.initSocket(io);
require('./controllers/teamController').initSocket(io);

// Cron Jobs
cron.schedule('0 * * * *', async () => {
  console.log('Running reminder cron job...');
  await taskController.sendTaskReminderEmails();
});
cron.schedule('0 * * * *', async () => {
  console.log('Running overdue notification cron job...');
  await taskController.sendOverdueTaskNotifications();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
