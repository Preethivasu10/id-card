// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDF8CgZcTJ7hMqu_9j7x1OhBLkhFfHXDPU",
  authDomain: "wowhr-7ee36.firebaseapp.com",
  projectId: "wowhr-7ee36",
  storageBucket: "wowhr-7ee36.appspot.com",
  messagingSenderId: "393164529148",
  appId: "1:393164529148:web:1611e1b13ebf4bfbed6679",
  measurementId: "G-80KKGJ98FG",
  databaseURL: "https://wowhr-7ee36-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export default app;