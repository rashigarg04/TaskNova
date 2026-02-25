document.addEventListener("DOMContentLoaded", function () {

  const confirmBtn = document.getElementById("confirmLogout");
  const cancelBtn = document.getElementById("cancelLogout");

  if (confirmBtn) {
    confirmBtn.onclick = function () {
      localStorage.clear();
      alert("Logged out successfully!");
      window.location.href = "index.html";  
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = function () {
      window.location.href = "dashboard.html";
    };
  }

});