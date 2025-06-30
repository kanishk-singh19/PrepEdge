// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4GreWFuBRIcHJOBhVrLfLFOZvWDer2Fg",
  authDomain: "prepedge-b6dbe.firebaseapp.com",
  projectId: "prepedge-b6dbe",
  storageBucket: "prepedge-b6dbe.firebasestorage.app",
  messagingSenderId: "244807193300",
  appId: "1:244807193300:web:d9065823c4de2fa3cb6141",
  measurementId: "G-LY3PWS3CEM"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);