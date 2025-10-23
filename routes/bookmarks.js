const express = require('express');
const { readJSON, writeJSON } = require('../utils/fileHandler');
const { authenticateToken } = require('../utils/jwt');

const router = express.Router();

// Add bookmark
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { placeId, placeName } = req.body;
    const userId = req.user.userId;

    const users = await readJSON('users.json');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already bookmarked
    if (users[userIndex].bookmarks.includes(placeName)) {
      return res.status(400).json({ error: 'Already bookmarked' });
    }

    users[userIndex].bookmarks.push(placeName);
    await writeJSON('users.json', users);

    res.json({ message: 'Bookmark added', bookmarks: users[userIndex].bookmarks });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove bookmark
router.post('/remove', authenticateToken, async (req, res) => {
  try {
    const { placeName } = req.body;
    const userId = req.user.userId;

    const users = await readJSON('users.json');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex].bookmarks = users[userIndex].bookmarks.filter(b => b !== placeName);
    await writeJSON('users.json', users);

    res.json({ message: 'Bookmark removed', bookmarks: users[userIndex].bookmarks });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user bookmarks
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const users = await readJSON('users.json');
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
