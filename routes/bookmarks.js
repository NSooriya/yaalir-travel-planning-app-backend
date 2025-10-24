const express = require('express');
const FirestoreService = require('../services/firestoreService');
const { authenticateToken } = require('../utils/jwt');

const router = express.Router();
const usersService = new FirestoreService('users');

// Add bookmark
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { placeId, placeName } = req.body;
    const userId = req.user.userId;

    const user = await usersService.getById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already bookmarked
    const bookmarks = user.bookmarks || [];
    if (bookmarks.includes(placeName)) {
      return res.status(400).json({ error: 'Already bookmarked' });
    }

    // Add bookmark using array add operation
    await usersService.arrayAdd(userId, 'bookmarks', placeName);
    bookmarks.push(placeName);

    res.json({ message: 'Bookmark added', bookmarks });
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

    const user = await usersService.getById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove bookmark using array remove operation
    await usersService.arrayRemove(userId, 'bookmarks', placeName);
    const bookmarks = (user.bookmarks || []).filter(b => b !== placeName);

    res.json({ message: 'Bookmark removed', bookmarks });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user bookmarks
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await usersService.getById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ bookmarks: user.bookmarks || [] });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
