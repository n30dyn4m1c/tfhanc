/* The Father's House, All Nations Church — site interactions */
(function () {
  "use strict";

  /* ---------- Sticky nav state ---------- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Accordion (expandable panels) ---------- */
  document.querySelectorAll("[data-accordion]").forEach(function (group) {
    group.querySelectorAll(".accordion__trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".accordion__item");
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        var isOpen = item.classList.contains("is-open");

        /* Close siblings in the same group */
        group.querySelectorAll(".accordion__item.is-open").forEach(function (openItem) {
          if (openItem === item) return;
          openItem.classList.remove("is-open");
          var openBtn = openItem.querySelector(".accordion__trigger");
          var openPanel = document.getElementById(openBtn.getAttribute("aria-controls"));
          openBtn.setAttribute("aria-expanded", "false");
          if (openPanel) openPanel.hidden = true;
        });

        if (isOpen) {
          item.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
          if (panel) panel.hidden = true;
        } else {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          if (panel) panel.hidden = false;
        }
      });
    });
  });

  /* ---------- Countdown to next Breakthrough Prayer Night, Friday 7:00 PM, Port Moresby (UTC+10) ---------- */
  var PNG_OFFSET_MS = 10 * 60 * 60 * 1000; // PNG has no daylight saving
  var PRAYER_NIGHT_DAY = 5; // 0 = Sunday, 5 = Friday
  var PRAYER_NIGHT_HOUR = 19; // 7:00 PM

  function nextServiceTime() {
    var pngNow = new Date(Date.now() + PNG_OFFSET_MS);
    var target = new Date(pngNow);
    var daysAhead = (PRAYER_NIGHT_DAY - pngNow.getUTCDay() + 7) % 7;
    target.setUTCDate(pngNow.getUTCDate() + daysAhead);
    target.setUTCHours(PRAYER_NIGHT_HOUR, 0, 0, 0);
    if (target <= pngNow) {
      target.setUTCDate(target.getUTCDate() + 7);
    }
    return target.getTime() - PNG_OFFSET_MS;
  }

  var countdown = document.getElementById("countdown");
  if (countdown) {
    var cells = {
      days: countdown.querySelector('[data-unit="days"]'),
      hours: countdown.querySelector('[data-unit="hours"]'),
      minutes: countdown.querySelector('[data-unit="minutes"]'),
      seconds: countdown.querySelector('[data-unit="seconds"]')
    };
    var targetTs = nextServiceTime();

    var tick = function () {
      var diff = targetTs - Date.now();
      if (diff < 0) {
        targetTs = nextServiceTime();
        diff = targetTs - Date.now();
      }
      var s = Math.floor(diff / 1000);
      cells.days.textContent = Math.floor(s / 86400);
      cells.hours.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
      cells.minutes.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      cells.seconds.textContent = String(s % 60).padStart(2, "0");
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Prayer request form (mailto handoff) ---------- */
  var form = document.getElementById("connectForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var subject = "Prayer Request — " + (data.get("name") || "Website Visitor");
      var body =
        "Name: " + (data.get("name") || "") + "\n" +
        "Email: " + (data.get("email") || "") + "\n\n" +
        (data.get("message") || "");
      window.location.href =
        "mailto:info@tfhanc.org?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();
