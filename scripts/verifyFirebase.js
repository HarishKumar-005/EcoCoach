// scripts/verifyFirebase.js
const dotenv = require('dotenv');
const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');

// Load environment variables from .env file
dotenv.config({ path: '.env' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all config values are present
const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error('❌ Firebase Connection Failed!');
  console.error('Missing environment variables:', missingKeys.join(', '));
  process.exit(1);
}

async function verifyConnection() {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    await signInAnonymously(auth);
    console.log('✅ Firebase Connection Successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Firebase Connection Failed!');
    console.error('Firebase Error:', error.message);
    process.exit(1);
  }
}

verifyConnection();
