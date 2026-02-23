document.addEventListener('DOMContentLoaded', function () {

  // ===== MOBILE MENU TOGGLE =====
  const toggle = document.querySelector('.navbar-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const fadeElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  fadeElements.forEach(el => observer.observe(el));

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS (WITH OFFSET FOR STICKY NAVBAR) =====
  const offset = 80; // Adjust if navbar height changes
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = target.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== NAVBAR BACKGROUND CHANGE ON SCROLL =====
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(255,255,255,0.9)';
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      navbar.style.background = 'rgba(255,255,255,0.6)';
      navbar.style.boxShadow = 'none';
    }
  });

});

// ===== SIGNUP FUNCTION =====
function signupUser(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = { name, email, password };
  localStorage.setItem("tasknovaUser", JSON.stringify(user));

  alert("Account created successfully!");
  window.location.href = "login.html";
}

// ===== LOGIN FUNCTION =====
function loginUser(event) {
  event.preventDefault();
  const emailInput = document.querySelector("input[type='email']").value;
  const passwordInput = document.querySelector("input[type='password']").value;

  const storedUser = JSON.parse(localStorage.getItem("tasknovaUser"));
  if (storedUser && emailInput === storedUser.email && passwordInput === storedUser.password) {
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid email or password!");
  }
}