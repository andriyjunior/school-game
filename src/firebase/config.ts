// Firebase Configuration
// TO SET UP: Go to https://console.firebase.google.com/
// 1. Create a new project
// 2. Enable Firestore Database
// 3. Enable Authentication (Email/Password)
// 4. Go to Project Settings > Add Web App
// 5. Copy the config values below

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC1lN4W-4vRgdtQlE1HWTPOxevEky_YXYo",
  authDomain: "school-project-87100.firebaseapp.com",
  projectId: "school-project-87100",
  storageBucket: "school-project-87100.firebasestorage.app",
  messagingSenderId: "301941896214",
  appId: "1:301941896214:web:0569a7a94981d629c9b137",
  measurementId: "G-WHN32H6078"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Initialize Auth
export const auth: Auth = getAuth(app);

export default app;
