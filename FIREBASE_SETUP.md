# Firebase Firestore Setup Guide

## Overview
The application now uses Firebase Firestore for all data storage instead of JSON files. This provides better scalability, real-time updates, and production-ready database management.

## Firebase Project Configuration

### Current Configuration
- **Project ID**: yaalir
- **API Key**: AIzaSyD99XZp5dFBC1gTTTjOtg1YDTgMJnTBMxc
- **Auth Domain**: yaalir.firebaseapp.com
- **Storage Bucket**: yaalir.firebasestorage.app

## Setting Up Firebase Admin SDK (Required for Production)

### 1. Generate Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **yaalir**
3. Click the gear icon ⚙️ → **Project settings**
4. Navigate to **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file (keep it secure!)

### 2. Extract Required Credentials

From the downloaded JSON file, you need:
- `client_email`
- `private_key`

### 3. Add to Environment Variables

#### Local Development (.env file):
```env
# Firebase Admin SDK Credentials
FIREBASE_CLIENT_EMAIL=your-service-account@yaalir.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

#### Vercel Deployment:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   - `FIREBASE_CLIENT_EMAIL` = (paste client_email from JSON)
   - `FIREBASE_PRIVATE_KEY` = (paste entire private_key including newlines)

**Important**: The private key must include `\n` characters for line breaks.

## Firestore Collections Structure

### Collections Created:
1. **users** - User accounts with authentication
   ```javascript
   {
     id: string,
     name: string,
     email: string,
     passwordHash: string,
     bookmarks: array,
     itineraries: array,
     createdAt: timestamp
   }
   ```

2. **heritage** - Heritage sites data
   ```javascript
   {
     id: string,
     name: string,
     location: string,
     category: string,
     description: string,
     history: string,
     image: string,
     coordinates: object,
     duration: string,
     entry_fee: string,
     timings: string
   }
   ```

3. **crafts** - Traditional crafts data
   ```javascript
   {
     id: string,
     name: string,
     category: string,
     location: string,
     description: string,
     image: string,
     priceRange: string
   }
   ```

4. **marketplace** - Marketplace items
   ```javascript
   {
     id: string,
     name: string,
     category: string,
     price: number,
     image: string,
     description: string
   }
   ```

## Data Migration

### Initial Data Migration
Run the migration script to populate Firestore with initial data:

```bash
cd server
node scripts/migrateToFirestore.js
```

This will:
- ✅ Migrate heritage.json → Firestore 'heritage' collection
- ✅ Migrate crafts.json → Firestore 'crafts' collection
- ✅ Migrate marketplace.json → Firestore 'marketplace' collection

**Note**: User data migrates automatically as users register/login.

## Firestore Security Rules

Configure these rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for heritage, crafts, marketplace
    match /heritage/{document=**} {
      allow read: if true;
      allow write: if false; // Only admin SDK can write
    }
    
    match /crafts/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    match /marketplace/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if false; // Only admin SDK for security
    }
  }
}
```

## API Endpoints Updated

All endpoints now use Firestore:

### Authentication
- `POST /api/auth/register` - Create user in Firestore
- `POST /api/auth/login` - Verify user from Firestore
- `GET /api/auth/me` - Get current user from Firestore

### Bookmarks
- `POST /api/bookmarks/add` - Add bookmark to user document
- `POST /api/bookmarks/remove` - Remove bookmark from user document
- `GET /api/bookmarks` - Get user's bookmarks

### Itineraries
- `POST /api/itinerary/generate` - Generate itinerary (reads from Firestore)
- `POST /api/itinerary/save` - Save itinerary to user document
- `GET /api/itinerary` - Get user's itineraries

### Data Routes
- `GET /api/heritage` - Fetch all heritage sites from Firestore
- `GET /api/crafts` - Fetch all crafts from Firestore
- `GET /api/marketplace` - Fetch all marketplace items from Firestore

## Testing Firestore Integration

### 1. Check Firestore Console
- Visit: https://console.firebase.google.com/project/yaalir/firestore
- Verify collections: users, heritage, crafts, marketplace
- Check document counts match migrated data

### 2. Test API Endpoints
```bash
# Test heritage endpoint
curl http://localhost:5000/api/heritage

# Test crafts endpoint
curl http://localhost:5000/api/crafts

# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## Troubleshooting

### Error: "Could not load the default credentials"
- ✅ Ensure `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` are set
- ✅ Check private key includes `\n` for newlines
- ✅ Restart the server after adding env variables

### Error: "Permission denied"
- ✅ Check Firestore security rules
- ✅ Verify service account has Firestore permissions

### Data not appearing
- ✅ Run migration script: `node scripts/migrateToFirestore.js`
- ✅ Check Firestore console for data
- ✅ Verify collection names match code

## Production Deployment Checklist

- [ ] Generate and download Firebase service account key
- [ ] Add `FIREBASE_CLIENT_EMAIL` to Vercel environment variables
- [ ] Add `FIREBASE_PRIVATE_KEY` to Vercel environment variables
- [ ] Run data migration script locally (one-time)
- [ ] Verify data in Firestore console
- [ ] Configure Firestore security rules
- [ ] Test all API endpoints
- [ ] Deploy to Vercel
- [ ] Test production endpoints

## Benefits of Firestore Migration

✅ **Scalability**: No file system limitations
✅ **Real-time**: Automatic updates across clients
✅ **Security**: Robust authentication and access control
✅ **Reliability**: Automatic backups and replication
✅ **Performance**: Indexed queries and caching
✅ **Production-ready**: Battle-tested infrastructure

## Support

For Firebase issues:
- [Firebase Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
