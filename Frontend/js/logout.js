import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNmiwSZM3f0_CdU6Kdz6ks-cYd6vFsKeE",
  authDomain: "tasknova-32f44.firebaseapp.com",
  projectId: "tasknova-32f44",
  appId: "1:746811490235:web:aef8bf68a461634d5f4e9e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {

  const confirmBtn = document.getElementById("confirmLogout");
  const cancelBtn = document.getElementById("cancelLogout");

  if (confirmBtn) {
    confirmBtn.onclick = function () {
      signOut(auth).then(() => {
        localStorage.clear();
        alert("Logged out successfully!");
        window.location.href = "index.html";  
      }).catch((error) => {
        alert(error.message);
      });
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = function () {
      window.location.href = "dashboard.html";
    };
  }

});