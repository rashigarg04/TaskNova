document.addEventListener("DOMContentLoaded", function () {

  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const themeSelect = document.getElementById("themeSelect");
  const saveBtn = document.getElementById("saveSettingsBtn");
  const emailNotif = document.getElementById("emailNotif");
  const taskReminder = document.getElementById("taskReminder");

  const saved = JSON.parse(localStorage.getItem("tasknovaSettings")) || {};

  // Load saved data
  if (saved.username) username.value = saved.username;
  if (saved.email) email.value = saved.email;
  if (saved.theme) themeSelect.value = saved.theme;
  if (saved.emailNotif) emailNotif.checked = saved.emailNotif;
  if (saved.taskReminder) taskReminder.checked = saved.taskReminder;

  applyTheme(themeSelect.value);

  saveBtn.addEventListener("click", function () {

    const settings = {
      username: username.value,
      email: email.value,
      theme: themeSelect.value,
      emailNotif: emailNotif.checked,
      taskReminder: taskReminder.checked
    };

    localStorage.setItem("tasknovaSettings", JSON.stringify(settings));

    applyTheme(settings.theme);

    alert("Settings Saved Successfully ✅");
  });

  function applyTheme(theme) {
    if (theme === "light") {
      document.body.style.background = "#f1f5f9";
      document.body.style.color = "#111";
    } else {
      document.body.style.background = "linear-gradient(135deg, #0f172a, #1e293b, #1e3a8a)";
      document.body.style.color = "white";
    }
  }

});