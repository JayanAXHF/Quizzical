// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5Wx1tmwXiUsBDGZ31tB0Hm5E5xABAY1c",
  authDomain: "quizzical-561.firebaseapp.com",
  databaseURL:
    "https://quizzical-561-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quizzical-561",
  storageBucket: "quizzical-561.appspot.com",
  messagingSenderId: "292381639760",
  appId: "1:292381639760:web:f9f85c7d93ddd313a73d55",
  measurementId: "G-7YX47NG3X0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
