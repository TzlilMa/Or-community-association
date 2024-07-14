// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, doc, getDoc, setDoc, Timestamp, arrayUnion, increment, orderBy, FieldValue, arrayRemove} from 'firebase/firestore';
import { getAuth, signOut, signInWithEmailAndPassword } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, doc,getDoc, setDoc ,Timestamp, arrayUnion, increment, signOut, orderBy, signInWithEmailAndPassword,FieldValue, arrayRemove};
