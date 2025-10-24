const admin = require('firebase-admin');
require('dotenv').config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

let db = null;
let isFirestoreAvailable = false;

// Check if Firebase credentials are available
const hasFirebaseCredentials = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

if (hasFirebaseCredentials) {
  try {
    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });

    db = admin.firestore();
    isFirestoreAvailable = true;
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.log('⚠️  Falling back to JSON file storage');
    isFirestoreAvailable = false;
  }
} else {
  console.log('⚠️  Firebase credentials not found in environment variables');
  console.log('⚠️  Using JSON file storage instead');
  console.log('ℹ️  To use Firestore, add FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env');
}

module.exports = { admin, db, firebaseConfig, isFirestoreAvailable };

