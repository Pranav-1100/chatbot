const express = require('express');
const AnalyticsService = require('../services/analyticsService');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's chat statistics
router.get('/chat-stats', auth, async (req, res) => {
  try {
    const stats = await AnalyticsService.getChatStats(req.user.id);
    res.send(stats);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get chatbot performance
router.get('/chatbot-performance', auth, async (req, res) => {
  try {
    const performance = await AnalyticsService.getChatbotPerformance(req.user.id);
    res.send(performance);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get user activity over time
router.get('/user-activity', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const activity = await AnalyticsService.getUserActivity(req.user.id, new Date(startDate), new Date(endDate));
    res.send(activity);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get top end users
router.get('/top-end-users', auth, async (req, res) => {
  try {
    const { limit } = req.query;
    const topUsers = await AnalyticsService.getTopEndUsers(req.user.id, parseInt(limit) || 10);
    res.send(topUsers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;