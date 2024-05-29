// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "fullstack-blog-b13d4.firebaseapp.com",
  projectId: "fullstack-blog-b13d4",
  storageBucket: "fullstack-blog-b13d4.appspot.com",
  messagingSenderId: "139400042729",
  appId: "1:139400042729:web:92bb4c2c7912de0d673878",
  measurementId: "G-44RCMK96QL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);