import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAP96Dl2JswzIaXs7rZHCVQIyrORwvEA2I",
  authDomain: "tp-front-end-70fd9.firebaseapp.com",
  databaseURL: "https://tp-front-end-70fd9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tp-front-end-70fd9",
  storageBucket: "tp-front-end-70fd9.firebasestorage.app",
  messagingSenderId: "346456116495",
  appId: "1:346456116495:web:057ecdda37269c476dc27a"
};

// Initialisation typée
export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const database: Database = getDatabase(app);