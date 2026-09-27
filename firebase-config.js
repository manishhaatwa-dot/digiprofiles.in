// ==========================================
// DigiProfiles - Firebase Configuration
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUe84QnEA5DY31DXtzM-7M4Xu5bSa8xO8",
  authDomain: "appointment-app-cb979.firebaseapp.com",
  projectId: "appointment-app-cb979",
  storageBucket: "appointment-app-cb979.firebasestorage.app",
  messagingSenderId: "596931961212",
  appId: "1:596931961212:web:32d0153625f02ce59104f9"
};

// DigiProfiles Firebase App
const app = initializeApp(firebaseConfig);

export { app };