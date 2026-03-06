import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlCLpngMrhge_UcmiZPW5O2e96jR8yIwU",
    authDomain: "priyas-collection.firebaseapp.com",
    projectId: "priyas-collection",
    storageBucket: "priyas-collection.firebasestorage.app",
    messagingSenderId: "207213848402",
    appId: "1:207213848402:web:c9783aca51bf7b9584bc8b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
