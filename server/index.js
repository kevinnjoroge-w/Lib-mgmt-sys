require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const { init } = require('./utils/socket');
const cronTasks = require('./jobs/cronTasks');

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/borrow', require('./routes/borrow'));
app.use('/api/fines', require('./routes/fines'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications')); // Add Notifications route

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lib-mgmt')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket setup
const io = init(server);
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    // User joins a room based on their user ID to receive direct notifications
    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined room: ${userId}`);
    });
});

// Start Cron Tasks
cronTasks.start();
// trigger restart
