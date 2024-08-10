const express = require('express');
const { initDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');

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

// Protected route example
const auth = require('./middleware/auth');
app.get('/api/protected', auth, (req, res) => {
  res.send('This is a protected route');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});