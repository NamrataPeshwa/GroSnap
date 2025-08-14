// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB35VsiE669rxHUqDqjqJWHjRBR1LzGixk",
  authDomain: "grosnap-9d9ed.firebaseapp.com",
  projectId: "grosnap-9d9ed",
  storageBucket: "grosnap-9d9ed.appspot.com",
  messagingSenderId: "339114489568",
  appId: "1:339114489568:web:11e140565e5d4deac00285",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Uncomment these lines ONLY if you're using Firebase emulator for local development
// if (location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectFirestoreEmulator(db, "localhost", 8080);
// }

// Debug logging
console.log('[Firebase] App initialized:', app);
console.log('[Firebase] Auth initialized:', auth);
console.log('[Firebase] Firestore initialized:', db);
console.log('[Firebase] Project ID:', firebaseConfig.projectId);

export { db, auth, app };