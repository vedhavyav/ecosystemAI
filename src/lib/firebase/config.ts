import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

// Initialize Firebase safely (avoid crashing Next.js pre-rendering if keys are missing)
let app;
let auth: ReturnType<typeof getAuth>;
let db: Firestore;

if (typeof window !== 'undefined') {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);

  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    import('firebase/auth').then(({ connectAuthEmulator }) => {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    });
    import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
    });
    console.log('Firebase Emulators connected!');
  }
  
  // Expose db and network methods to window for Cypress offline testing
  if (typeof window !== 'undefined' && window.Cypress) {
    window.db = db;
    import('firebase/firestore').then(({ disableNetwork, enableNetwork }) => {
      window.disableNetwork = disableNetwork;
      window.enableNetwork = enableNetwork;
    });
  }

  // Initialize App Check with reCAPTCHA Enterprise
  if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true
      });
    } catch (e) {
      console.warn("Failed to initialize AppCheck", e);
    }
  }
}

export { app, auth, db };
