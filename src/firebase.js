import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA7mZa2D1PFp8tUQj12hcxsaQ1ephTKFug',
  authDomain: 'faheem-shop.firebaseapp.com',
  projectId: 'faheem-shop',
  storageBucket: 'faheem-shop.firebasestorage.app',
  messagingSenderId: '201125689859',
  appId: '1:201125689859:web:1c3faa75398e40effe2c36',
  measurementId: 'G-LXL8DS3LFT',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB= getFirestore(app)

export {app, fireDB}