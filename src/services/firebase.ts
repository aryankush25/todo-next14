// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// My web app's Firebase configuration
// I have to commit this for easy access to the Firebase configuration for the reviewer
const firebaseConfig = {
  apiKey: "AIzaSyCnU4jy3YSk_O-WlWqqKdXkzLDhWhCiD0s",
  authDomain: "todo-next14-33ebf.firebaseapp.com",
  projectId: "todo-next14-33ebf",
  storageBucket: "todo-next14-33ebf.appspot.com",
  messagingSenderId: "359018630123",
  appId: "1:359018630123:web:2037833e0e2a39322b67ae",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
