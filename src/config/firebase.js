// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3tkC-52mumYNhrHVuLWZg_EjYtR4csU4",
  authDomain: "doctor-appointment-97645.firebaseapp.com",
  projectId: "doctor-appointment-97645",
  storageBucket: "doctor-appointment-97645.appspot.com",
  messagingSenderId: "992749149982",
  appId: "1:992749149982:web:e114ac9f0da942a066730f",
  measurementId: "G-W40ZD67NVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app }