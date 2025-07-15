// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDC94zn7QamC6xJfCryC8OEUYRnFvBZHH8",
    authDomain: "eventfriend-2e489.firebaseapp.com",
    projectId: "eventfriend-2e489",
    storageBucket: "eventfriend-2e489.firebasestorage.app",
    messagingSenderId: "53277412088",
    appId: "1:53277412088:web:4fbe8a96bf05ad295c890d",
    measurementId: "G-2B28Q3CZCW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
