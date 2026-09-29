/**
 * Firebase Backend Configuration for GECM LMS
 * 
 * Instructions:
 * To connect to your real Firebase project:
 * 1. Install firebase: npx expo install firebase
 * 2. Fill in the firebaseConfig object below with your credentials from the Firebase Console:
 *    (Project Settings -> General -> Your apps -> SDK setup and configuration)
 * 3. Set USE_REAL_FIREBASE = true;
 * 
 * While USE_REAL_FIREBASE is false, the app runs on a reactive persistent storage engine
 * with full realistic mock data, ensuring zero friction during Expo Go prototyping and testing.
 */

export const USE_REAL_FIREBASE = false;

export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "gecm-lms.firebaseapp.com",
  projectId: "gecm-lms",
  storageBucket: "gecm-lms.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

export const getFirebaseStatus = () => {
  return {
    isConfigured: USE_REAL_FIREBASE,
    projectId: firebaseConfig.projectId,
    statusText: USE_REAL_FIREBASE ? "Connected to Firebase" : "Local Prototype Engine (Expo Go Ready)"
  };
};
