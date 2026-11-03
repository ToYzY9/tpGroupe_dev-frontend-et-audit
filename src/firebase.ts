import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDKxrtvSsaxF-vpo2P35s2Ft8fWRGPnTf0",
  authDomain: "fire-one-496af.firebaseapp.com",
  databaseURL: "https://fire-one-496af-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fire-one-496af",
  storageBucket: "fire-one-496af.firebasestorage.app",
  messagingSenderId: "20249674245",
  appId: "1:20249674245:web:0841ae96d991fafa11526c"
};

// Initialisation typée
export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const database: Database = getDatabase(app);