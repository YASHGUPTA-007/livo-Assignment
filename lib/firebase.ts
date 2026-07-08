// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTev-g4JRCN8Dq025AmfxcJYVDShWwHC8",
  authDomain: "livo-assignement.firebaseapp.com",
  projectId: "livo-assignement",
  storageBucket: "livo-assignement.firebasestorage.app",
  messagingSenderId: "540998312252",
  appId: "1:540998312252:web:34ceaddf5b25e43e35fe39",
  measurementId: "G-MKM9PQMGK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);