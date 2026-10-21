(function () {
  "use strict";
  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Theme toggle --------------------------------------------------------- */
  var themeBtn = document.querySelector(".theme-toggle");
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  function isDark() {
    return root.dataset.theme ? root.dataset.theme === "dark" : darkQuery.matches;
  }
  function syncTheme() {
    var dark = isDark();
    if (themeBtn) themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute("content", dark ? "#0f1716" : "#f7f6f2");
      m.removeAttribute("media");
    });
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncTheme();
    });
  }
  darkQuery.addEventListener && darkQuery.addEventListener("change", syncTheme);
  syncTheme();

  /* Mobile menu ---------------------------------------------------------- */
  var menuBtn = document.querySelector(".menu-toggle");
  var links = document.getElementById("nav-links");
  function setMenu(open) {
    if (!menuBtn || !links) return;
    links.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () { setMenu(!links.classList.contains("open")); });
    links.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
    });
  }

  /* Header border once the page scrolls ---------------------------------- */
  var header = document.querySelector(".site-header");
  var sentinel = document.getElementById("top");
  if (header && sentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle("scrolled", entries[0].boundingClientRect.top < 0);
    }, { threshold: [0, 1] }).observe(sentinel);
  }

  /* Highlight the nav link for the section in view ----------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (sec) { spy.observe(sec); });
    var heroEl = document.getElementById("top");
    if (heroEl) spy.observe(heroEl); // clears the highlight back at the top
  }

  /* Scroll reveal -------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealEls.forEach(function (el) { revealer.observe(el); });
  }

  /* Contact form --------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  var successBanner = document.getElementById("contact-success");
  if (successBanner && /[?&]sent=true/.test(window.location.search)) {
    successBanner.hidden = false;
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  }
  if (form) {
    form.addEventListener("submit", function () {
      var button = form.querySelector("button[type=submit]");
      if (button) {
        button.disabled = true;
        button.firstChild.nodeValue = "Sending… ";
      }
    });
  }

  /* Footer year ---------------------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
