import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDkab7UpZ4ZIvAt9c8v8yd1v2dnbrOBlI8',
  authDomain: 'studio-8680828960-28e64.firebaseapp.com',
  projectId: 'studio-8680828960-28e64',
  storageBucket: 'studio-8680828960-28e64.appspot.com',
  messagingSenderId: '1010855061710',
  appId: '1:1010855061710:web:ed8625cbe51468ed86089f',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
