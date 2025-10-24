require('dotenv').config();
const express = require('express');
const cors = require('cors');
const FirestoreService = require('./services/firestoreService');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firestore services
const heritageService = new FirestoreService('heritage');
const craftsService = new FirestoreService('crafts');
const marketplaceService = new FirestoreService('marketplace');

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://yaalir-travel-planning-app.vercel.app',
  'http://yaalir-travel-planning-app.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
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
    const heritage = await heritageService.getAll();
    res.json(heritage);
  } catch (error) {
    console.error('Error fetching heritage:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all crafts
app.get('/api/crafts', async (req, res) => {
  try {
    const crafts = await craftsService.getAll();
    res.json(crafts);
  } catch (error) {
    console.error('Error fetching crafts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get marketplace items
app.get('/api/marketplace', async (req, res) => {
  try {
    const marketplace = await marketplaceService.getAll();
    res.json(marketplace);
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get language translations (keeping JSON for now as it's static config)
app.get('/api/lang', async (req, res) => {
  try {
    const { readJSON } = require('./utils/fileHandler');
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
