import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const googleProvider = new GoogleAuthProvider();

// ================= SIGNUP =================
window.signup = function () {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      return updateProfile(user, { displayName: name }).then(() => {
        sendTokenToBackend(user);
      });
    })
    .catch((error) => {
      alert(error.message);
    });
};

// ================= LOGIN =================
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      sendTokenToBackend(userCredential.user);
    })
    .catch((error) => {
      alert("Login Failed: " + error.message);
    });
};

// ================= GOOGLE LOGIN =================
window.googleAuth = function () {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      sendTokenToBackend(result.user);
    })
    .catch((error) => {
      alert("Google Login Error: " + error.message);
    });
};

// ================= LOGOUT =================
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// ================= SEND TOKEN =================
function sendTokenToBackend(user) {
  user.getIdToken().then((token) => {
    fetch("http://127.0.0.1:8000/api/auth/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend Response:", data);
        window.location.href = "dashboard.html";
      })
      .catch((err) => {
        console.error("Backend Error:", err);
      });
  });
}

// ================= LANDING PAGE ANIMATIONS =================
document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer for fade-in elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => observer.observe(el));

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('glass');
      } else {
        navbar.classList.remove('glass');
      }
    });
  }
});