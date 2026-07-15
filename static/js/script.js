document.addEventListener("DOMContentLoaded", function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sections = document.querySelectorAll(".section");
  const cards = document.querySelectorAll(".card");

  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
        }
      });
    }, {
      threshold: 0.1
    });

    sections.forEach(section => {
      section.classList.add("hidden");
      observer.observe(section);
    });

    cards.forEach(card => {
      card.classList.add("hidden");
      observer.observe(card);
    });
  }

  // Contact form: show a success banner after FormSubmit redirects back,
  // and give the button a pending state while the request is in flight.
  const form = document.getElementById("contact-form");
  const successBanner = document.getElementById("contact-success");

  if (window.location.search.includes("sent=true") && successBanner) {
    successBanner.hidden = false;
    const cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  if (form) {
    form.addEventListener("submit", function () {
      const button = form.querySelector("button[type=submit]");
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }
    });
  }
});
