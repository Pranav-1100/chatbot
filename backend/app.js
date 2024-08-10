// app.js
const express = require('express');
const { initDatabase } = require('./config/db');

const app = express();
const port = 3000;

// Initialize database
initDatabase()
  .then(() => {
    console.log('Database initialized successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});