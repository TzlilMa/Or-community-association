// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import getFirestore
import { doc, setDoc } from 'firebase/firestore'; // Import doc and setDoc

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-eLk-pT_KSRJtSCxqEcvx_USJKPkj2gI",
    authDomain: "or-project-da21f.firebaseapp.com",
    projectId: "or-project-da21f",
    storageBucket: "or-project-da21f.appspot.com",
    messagingSenderId: "388535635099",
    appId: "1:388535635099:web:cbc2b8e0567915f4158a3e",
    measurementId: "G-WQC7J9KNV4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firestore and get a reference to the database
const db = getFirestore(app);

export { auth, db, doc, setDoc }; // Export auth, db, doc, and setDoc
