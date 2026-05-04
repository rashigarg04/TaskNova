import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // If not logged in and not on login/signup/index pages
        const path = window.location.pathname;
        if (path.includes("dashboard.html") || path.includes("tasks.html") || path.includes("analytics.html") || path.includes("settings.html")) {
            window.location.href = "login.html";
        }
    } else {
        // Update sidebar if it exists
        const sidebarName = document.getElementById('sidebarName');
        const sidebarEmail = document.getElementById('sidebarEmail');
        const sidebarAvatar = document.getElementById('sidebarAvatar');
        
        if (sidebarName) sidebarName.textContent = user.displayName || "User";
        if (sidebarEmail) sidebarEmail.textContent = user.email || "No email";
        if (sidebarAvatar) {
            const name = user.displayName || user.email || "?";
            sidebarAvatar.textContent = name.charAt(0).toUpperCase();
        }
    }
});
