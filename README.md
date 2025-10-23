# Yaalir Travel Planning App - Backend Server

Backend API server for the Tamil Nadu Heritage Explorer application.

## Features

- User authentication (JWT-based)
- Heritage sites API
- Crafts and marketplace data
- Bookmarks management
- Itinerary planning

## Tech Stack

- Node.js
- Express.js
- JWT for authentication
- CORS enabled
- File-based JSON data storage

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

## Running Locally

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Heritage & Data
- `GET /api/heritage` - Get all heritage sites
- `GET /api/crafts` - Get all crafts
- `GET /api/marketplace` - Get marketplace items

### Bookmarks
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks/add` - Add bookmark
- `DELETE /api/bookmarks/remove` - Remove bookmark

### Itinerary
- `POST /api/itinerary/save` - Save itinerary
- `GET /api/itinerary` - Get user itineraries

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Set environment variables in Vercel dashboard:
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Environment Variables

Required environment variables for deployment:
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## CORS Configuration

The server is configured to accept requests from:
- `http://localhost:5173` (Local development)
- `http://localhost:3000` (Alternative local)
- `https://yaalir-travel-planning-app.vercel.app` (Production frontend)

To add more origins, update `server.js`:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
};
```

## Project Structure

```
server/
├── data/               # JSON data files
│   ├── users.json
│   ├── heritage.json
│   ├── crafts.json
│   └── marketplace.json
├── routes/             # API routes
│   ├── auth.js
│   ├── bookmarks.js
│   └── itinerary.js
├── utils/              # Utility functions
│   └── fileHandler.js
├── server.js           # Main server file
├── package.json        # Dependencies
├── vercel.json         # Vercel configuration
└── .env                # Environment variables (not committed)
```

## Data Storage

Currently using JSON files for data storage. Files are located in the `data/` directory:
- `users.json` - User accounts and profiles
- `heritage.json` - Heritage sites data
- `crafts.json` - Traditional crafts information
- `marketplace.json` - Marketplace items

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS configured for specific origins
- Environment variables for sensitive data

## License

ISC
