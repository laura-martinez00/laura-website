document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section");
  const cards = document.querySelectorAll(".card");

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
});

