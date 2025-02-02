import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyATJRQrDwNHnAgAORGNZWrXmtJmfhHGqSw",
  authDomain: "ernesto-levano.firebaseapp.com",
  projectId: "ernesto-levano",
  storageBucket: "ernesto-levano.firebasestorage.app",
  messagingSenderId: "186575729068",
  appId: "1:186575729068:web:b730439d22b567dcea4a09"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);