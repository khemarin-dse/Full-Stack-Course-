// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeVF36rdn3zRem3F9iCi2D0XdNOW5MwA0",
  authDomain: "smalllabs-sms-aed8e.firebaseapp.com",
  projectId: "smalllabs-sms-aed8e",
  storageBucket: "smalllabs-sms-aed8e.firebasestorage.app",
  messagingSenderId: "679371842532",
  appId: "1:679371842532:web:93d531e9b4dfd70a5b5df1",
  measurementId: "G-2ECXGGZJP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };