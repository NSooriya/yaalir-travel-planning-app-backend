require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { readJSON } = require('./utils/fileHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const bookmarkRoutes = require('./routes/bookmarks');
const itineraryRoutes = require('./routes/itinerary');

app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/itinerary', itineraryRoutes);

// Get all heritage sites
app.get('/api/heritage', async (req, res) => {
  try {
    const heritage = await readJSON('heritage.json');
    res.json(heritage);
  } catch (error) {
    console.error('Error fetching heritage:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all crafts
app.get('/api/crafts', async (req, res) => {
  try {
    const crafts = await readJSON('crafts.json');
    res.json(crafts);
  } catch (error) {
    console.error('Error fetching crafts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get marketplace items
app.get('/api/marketplace', async (req, res) => {
  try {
    const marketplace = await readJSON('marketplace.json');
    res.json(marketplace);
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get language translations
app.get('/api/lang', async (req, res) => {
  try {
    const lang = await readJSON('lang.json');
    res.json(lang);
  } catch (error) {
    console.error('Error fetching language data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TamilNadu Heritage Explorer API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
});
