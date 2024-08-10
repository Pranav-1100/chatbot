require('dotenv').config();
const express = require('express');
const { initDatabase } = require('./config/db');
const authRoutes = require('./routes/auth');
const chatbotRoutes = require('./routes/chatbot');
const chatRoutes = require('./routes/chat');
const profileRoutes = require('./routes/profile');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const port = process.env.PORT || 3000;

// Initialize database
initDatabase()
  .then(() => {
    console.log('Database initialized successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chatbots', chatbotRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});