// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwCebQjPv2qotzwtfFAVOWw3PmX7nlGRI",
  authDomain: "tasknova-52c69.firebaseapp.com",
  projectId: "tasknova-52c69",
  appId: "1:795966992313:web:d7b6282248dcba76e8d068"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);