// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClg-qhJjI3uKGrRJ8Fcp5DhyQp4K3FrB0",
  authDomain: "chat-b00df.firebaseapp.com",
  projectId: "chat-b00df",
  storageBucket: "chat-b00df.firebasestorage.app",
  messagingSenderId: "177648580996",
  appId: "1:177648580996:web:ec83485bec09504f7885d1",
  measurementId: "G-SS5B43DF32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const database = getFirestore();