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
      m.setAttribute("content", dark ? "#0b1424" : "#f1f6fc");
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
    // Stagger siblings that enter together (cards in a grid, timeline items)
    document.querySelectorAll(".project-grid, .edu-grid, .skills-grid, .timeline").forEach(function (group) {
      Array.prototype.forEach.call(group.querySelectorAll(":scope > .reveal"), function (el, i) {
        el.style.setProperty("--delay", ((i % 3) * 0.09).toFixed(2) + "s");
      });
    });
  }

  if (!reduced) {
    /* Scroll-driven effects: progress bar, hero parallax, timeline fill -- */
    var progressBar = document.querySelector(".scroll-progress");
    var parallaxEls = document.querySelectorAll("[data-speed]");
    var timeline = document.querySelector(".timeline");
    var ticking = false;
    function onScroll() {
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
      if (y < window.innerHeight * 1.2) {
        parallaxEls.forEach(function (el) {
          el.style.setProperty("--parallax", (y * parseFloat(el.dataset.speed)).toFixed(1) + "px");
        });
      }
      if (timeline) {
        var r = timeline.getBoundingClientRect();
        var f = (window.innerHeight * 0.6 - r.top) / r.height;
        timeline.style.setProperty("--fill", Math.max(0, Math.min(1, f)).toFixed(3));
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    /* Pointer-driven tilt and spotlight (mouse/trackpad only) -------------- */
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.querySelectorAll("[data-tilt-soft], [data-tilt]").forEach(function (card) {
        var strong = card.hasAttribute("data-tilt");
        var amount = strong ? 8 : (card.classList.contains("featured") ? 2 : 4);
        card.addEventListener("pointermove", function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
          if (strong) {
            card.style.transform = "perspective(900px) rotateY(" + ((px - 0.5) * amount).toFixed(2) + "deg) rotateX(" + ((0.5 - py) * amount).toFixed(2) + "deg)";
          } else {
            card.style.setProperty("--ry", ((px - 0.5) * amount).toFixed(2) + "deg");
            card.style.setProperty("--rx", ((0.5 - py) * amount).toFixed(2) + "deg");
          }
        });
        card.addEventListener("pointerleave", function () {
          card.style.removeProperty("--rx");
          card.style.removeProperty("--ry");
          if (strong) card.style.transform = "";
        });
      });
    }

    /* Count-up numbers ---------------------------------------------------- */
    var counters = document.querySelectorAll("[data-count]");
    if (counters.length && "IntersectionObserver" in window) {
      var fmt = new Intl.NumberFormat("en-GB");
      var countIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countIO.unobserve(entry.target);
          var el = entry.target, target = +el.dataset.count, start = null;
          function step(ts) {
            if (start === null) start = ts;
            var t = Math.min(1, (ts - start) / 1400);
            el.textContent = fmt.format(Math.round(target * (1 - Math.pow(1 - t, 3))));
            if (t < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countIO.observe(el); });
    }
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
