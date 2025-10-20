import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB5a3l8E0AqSEVMRMXkezb-PJr7spH_l1Q",
  authDomain: "warehouse-app-82964.firebaseapp.com",
  databaseURL: "https://warehouse-app-82964-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "warehouse-app-82964",
  storageBucket: "warehouse-app-82964.firebasestorage.app",
  messagingSenderId: "118355433133",
  appId: "1:118355433133:web:7c91e9e71c1895d6021824"
};

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Инициализируем Realtime Database
export const db = getDatabase(app);

export default app;