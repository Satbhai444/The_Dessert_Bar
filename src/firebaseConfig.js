// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkJkfq3dQWKlwASzoAXipz9HtEWo4fDgY",
  authDomain: "the-dessert-bar.firebaseapp.com",
  projectId: "the-dessert-bar",
  storageBucket: "the-dessert-bar.appspot.com",
  messagingSenderId: "1040358851894",
  appId: "1:1040358851894:web:8157567c02dc641e20df97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();