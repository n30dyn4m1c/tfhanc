/* The Father's House, All Nations Church · site behaviour
   Vanilla JS, loaded with defer. Everything degrades gracefully: without JS
   the page is complete, the form falls back to a mailto: action, and the
   countdown, calendar links and floating button simply do not appear. */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var hasIO = "IntersectionObserver" in window;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var announcer = $("#announcer");

  function announce(msg) {
    if (!announcer) return;
    announcer.textContent = "";
    setTimeout(function () { announcer.textContent = msg; }, 50);
  }

  /* ---------- Theme toggle (persists in localStorage) ---------- */
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  function activeTheme() {
    var t = root.getAttribute("data-theme");
    return t || (darkQuery.matches ? "dark" : "light");
  }
  function syncThemeToggles() {
    var dark = activeTheme() === "dark";
    $$("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    });
    var meta = $$('meta[name="theme-color"]');
    if (root.hasAttribute("data-theme")) {
      meta.forEach(function (m) { m.setAttribute("content", dark ? "#1a1120" : "#f5ede1"); });
    }
  }
  $$("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = activeTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("tfh-theme", next); } catch (e) { /* storage unavailable */ }
      syncThemeToggles();
    });
  });
  if (darkQuery.addEventListener) darkQuery.addEventListener("change", syncThemeToggles);
  syncThemeToggles();

  /* ---------- Header state ---------- */
  var header = $("#header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Modal dialogs: menu and biographies ----------
     Native <dialog> with showModal() makes the page behind inert. We add a
     Tab trap, backdrop-click to close, and explicit focus restoration. */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  function trapTab(dialog) {
    dialog.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var items = $$(FOCUSABLE, dialog).filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  function closeOnBackdrop(dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target !== dialog) return;
      var r = dialog.getBoundingClientRect();
      var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) dialog.close();
    });
  }
  function openDialog(dialog, trigger) {
    if (typeof dialog.showModal !== "function") return false;
    dialog._trigger = trigger;
    dialog.showModal();
    return true;
  }
  $$("dialog").forEach(function (dialog) {
    trapTab(dialog);
    closeOnBackdrop(dialog);
    dialog.addEventListener("close", function () {
      if (dialog._trigger) dialog._trigger.focus();
    });
  });

  // Menu
  var menu = $("#menu");
  var menuToggle = $(".menu-toggle");
  if (menu && menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (openDialog(menu, menuToggle)) {
        menuToggle.setAttribute("aria-expanded", "true");
        var firstLink = $(".menu__list a", menu);
        if (firstLink) firstLink.focus();
      }
    });
    menu.addEventListener("close", function () { menuToggle.setAttribute("aria-expanded", "false"); });
    $("[data-menu-close]", menu).addEventListener("click", function () { menu.close(); });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        menu._trigger = null; // let the page move to the chosen section
        menu.close();
      });
    });
    window.matchMedia("(min-width: 920px)").addEventListener("change", function (e) {
      if (e.matches && menu.open) menu.close();
    });
  }

  // Biographies
  $$("[data-dialog]").forEach(function (btn) {
    var dialog = doc.getElementById(btn.getAttribute("data-dialog"));
    if (!dialog) return;
    btn.addEventListener("click", function () { openDialog(dialog, btn); });
  });
  $$("[data-dialog-close]").forEach(function (btn) {
    btn.addEventListener("click", function () { btn.closest("dialog").close(); });
  });

  /* ---------- Active section in the main navigation ---------- */
  var navLinks = $$(".nav a[href^='#']");
  if (hasIO && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute("aria-current", "location");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main > section[id]").forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$(".reveal");
  if (!hasIO || reducedMotion) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { revealer.observe(el); });
  }

  /* ---------- Gatherings: countdown and calendar files ----------
     Times are Port Moresby time (UTC+10, no daylight saving). */
  var PNG_OFFSET_MS = 10 * 60 * 60 * 1000;
  var PLACE = "Taurama Aquatic Centre Lounge, Port Moresby, Papua New Guinea";
  var GATHERINGS = {
    sunday: { name: "Sunday Celebration", day: 0, h: 9, m: 0, end: [13, 30],
      desc: "Sunday Celebration at The Father’s House, All Nations Church. Come as you are." },
    friday: { name: "Breakthrough Prayer Night", day: 5, h: 19, m: 0, end: null,
      desc: "Breakthrough Prayer Night at The Father’s House, All Nations Church." }
  };

  function nextStart(g, now) {
    var png = new Date(now + PNG_OFFSET_MS);
    var t = new Date(png.getTime());
    t.setUTCDate(png.getUTCDate() + ((g.day - png.getUTCDay() + 7) % 7));
    t.setUTCHours(g.h, g.m, 0, 0);
    if (t <= png) t.setUTCDate(t.getUTCDate() + 7);
    return t.getTime() - PNG_OFFSET_MS;
  }
  function inProgress(g, now) {
    if (!g.end) return false;
    var png = new Date(now + PNG_OFFSET_MS);
    var mins = png.getUTCHours() * 60 + png.getUTCMinutes();
    return png.getUTCDay() === g.day && mins >= g.h * 60 + g.m && mins < g.end[0] * 60 + g.end[1];
  }
  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }
  function humanise(ms) {
    var mins = Math.max(1, Math.ceil(ms / 60000));
    var d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
    if (d) return "in " + plural(d, "day") + (h ? ", " + plural(h, "hour") : "");
    if (h) return "in " + plural(h, "hour") + (m ? ", " + plural(m, "minute") : "");
    return "in " + plural(m, "minute");
  }

  var countdown = $("#countdown");
  if (countdown) {
    var nameEl = $("[data-countdown-name]", countdown);
    var timeEl = $("[data-countdown-time]", countdown);
    var tick = function () {
      var now = Date.now();
      if (inProgress(GATHERINGS.sunday, now)) {
        nameEl.textContent = "Sunday Celebration";
        timeEl.textContent = "is under way now";
        return;
      }
      var next = ["sunday", "friday"].map(function (k) {
        return { g: GATHERINGS[k], at: nextStart(GATHERINGS[k], now) };
      }).sort(function (a, b) { return a.at - b.at; })[0];
      nameEl.textContent = next.g.name;
      timeEl.textContent = humanise(next.at - now);
    };
    tick();
    countdown.hidden = false;
    setInterval(tick, 30000);
  }

  function icsDate(ms) { return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  function icsText(s) { return s.replace(/\\/g, "\\\\").replace(/[,;]/g, "\\$&"); }
  function icsFor(key) {
    var g = GATHERINGS[key];
    var start = nextStart(g, Date.now());
    var lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//The Father's House All Nations Church//Website//EN",
      "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
      "UID:" + key + "-weekly@tfhanc.org", "DTSTAMP:" + icsDate(Date.now()), "DTSTART:" + icsDate(start)
    ];
    if (g.end) lines.push("DTEND:" + icsDate(start + ((g.end[0] * 60 + g.end[1]) - (g.h * 60 + g.m)) * 60000));
    lines.push(
      "RRULE:FREQ=WEEKLY",
      "SUMMARY:" + icsText(g.name + " · The Father’s House, All Nations Church"),
      "LOCATION:" + icsText(PLACE),
      "DESCRIPTION:" + icsText(g.desc),
      "URL:https://n30dyn4m1c.github.io/tfhanc/",
      "END:VEVENT", "END:VCALENDAR"
    );
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(lines.join("\r\n"));
  }
  $$("[data-ics]").forEach(function (a) {
    var key = a.getAttribute("data-ics");
    if (!GATHERINGS[key]) return;
    a.href = icsFor(key);
    a.setAttribute("download", "tfh-anc-" + GATHERINGS[key].name.toLowerCase().replace(/\s+/g, "-") + ".ics");
    a.hidden = false;
  });

  /* ---------- Featured message: load YouTube only on click ---------- */
  $$(".video[data-video-id]").forEach(function (fig) {
    var id = (fig.getAttribute("data-video-id") || "").trim();
    var poster = $(".video__poster", fig);
    if (!id || !/^[\w-]{6,20}$/.test(id) || !poster) return; // no ID: poster links to the channel
    var title = fig.getAttribute("data-video-title") || "Latest message";
    poster.setAttribute("href", "https://www.youtube.com/watch?v=" + id);
    poster.setAttribute("role", "button");
    poster.removeAttribute("target");
    $(".visually-hidden", poster).textContent = "Play: " + title;
    poster.addEventListener("click", function (e) {
      e.preventDefault();
      var frame = doc.createElement("div");
      frame.className = "video__frame";
      var iframe = doc.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      iframe.title = title;
      iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
      poster.replaceWith(frame);
      iframe.focus();
    });
    poster.addEventListener("keydown", function (e) {
      if (e.key === " ") { e.preventDefault(); poster.click(); }
    });
  });

  /* ---------- Contact: topic presets from links across the page ---------- */
  var topic = $("#f-topic");
  $$("[data-topic]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (!topic) return;
      var want = a.getAttribute("data-topic");
      var match = $$("option", topic).some(function (o) { return o.value === want; });
      if (match) topic.value = want;
    });
  });

  /* ---------- Copy address ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = doc.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      doc.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = doc.execCommand("copy"); } catch (e) { ok = false; }
      doc.body.removeChild(ta);
      if (ok) resolve(); else reject();
    });
  }
  function wireCopy(btn) {
    var label = $("[data-copy-label]", btn);
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      copyText(text).then(function () {
        if (label) label.textContent = "Copied";
        announce("Email address copied: " + text);
        setTimeout(function () { if (label) label.textContent = "Copy address"; }, 2500);
      }, function () {
        announce("Copying is not available here. The address is " + text);
      });
    });
  }
  $$("[data-copy]").forEach(wireCopy);

  /* ---------- Contact form ----------
     With data-endpoint set (e.g. a Formspree URL) the form posts there.
     Otherwise, or if the post fails, it opens the visitor's email app. */
  var form = $("#connect-form");
  if (form) {
    var status = $("#form-status");
    var submit = $("button[type=submit]", form);
    var email = form.getAttribute("data-email") || "info@tfhanc.org";
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var checks = {
      name: function (v) { return v.trim().length > 0; },
      email: function (v) { return EMAIL_RE.test(v.trim()); }
    };
    var attempted = false;

    var validateField = function (input) {
      var ok = checks[input.name](input.value);
      var err = doc.getElementById(input.id + "-error");
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      if (err) err.hidden = ok;
      return ok;
    };
    Object.keys(checks).forEach(function (name) {
      var input = form.elements[name];
      input.addEventListener("blur", function () { if (attempted || input.value) validateField(input); });
      input.addEventListener("input", function () { if (input.getAttribute("aria-invalid") === "true") validateField(input); });
    });

    var showStatus = function (kind) {
      status.textContent = "";
      var p1 = doc.createElement("p");
      var strong = doc.createElement("strong");
      var p2 = doc.createElement("p");
      if (kind === "sent") {
        strong.textContent = "Thank you. Your message has reached the house.";
        p1.appendChild(strong);
        p2.textContent = "The house will pray with you and reply by email.";
        status.append(p1, p2);
      } else {
        strong.textContent = "Your email app should now open with your message ready to send.";
        p1.appendChild(strong);
        p2.append("If your email app did not open, write to ");
        var a = doc.createElement("a");
        a.href = "mailto:" + email;
        a.textContent = email;
        p2.append(a, ".");
        var btn = doc.createElement("button");
        btn.type = "button";
        btn.className = "copy-btn";
        btn.setAttribute("data-copy", email);
        btn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-copy"/></svg><span data-copy-label>Copy address</span>';
        wireCopy(btn);
        status.append(p1, p2, btn);
      }
      status.hidden = false;
    };

    var openMail = function (data) {
      var subject = data.topic + " · " + data.name;
      var body = "Name: " + data.name + "\nEmail: " + data.email + "\nSubject: " + data.topic + "\n\n" + data.message;
      window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      attempted = true;
      var invalid = Object.keys(checks).map(function (n) { return form.elements[n]; })
        .filter(function (input) { return !validateField(input); });
      if (invalid.length) { invalid[0].focus(); return; }

      var data = {
        topic: form.elements.topic.value,
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        message: form.elements.message.value.trim()
      };
      var endpoint = (form.getAttribute("data-endpoint") || "").trim();
      if (!endpoint || !window.fetch) { openMail(data); showStatus("mail"); return; }

      submit.disabled = true;
      submit.textContent = "Sending…";
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          showStatus("sent");
        })
        .catch(function () { openMail(data); showStatus("mail"); })
        .then(function () { submit.disabled = false; submit.textContent = "Send to the house"; });
    });
  }

  /* ---------- Floating "Send a prayer request" ----------
     Shown once the hero's own buttons have scrolled away; hidden while the
     contact section or footer is on screen. */
  var fab = $("[data-fab]");
  if (fab && hasIO) {
    var state = { hero: true, connect: false, footer: false };
    var update = function () { fab.classList.toggle("is-shown", !state.hero && !state.connect && !state.footer); };
    var watch = function (el, key) {
      if (!el) return;
      new IntersectionObserver(function (entries) {
        state[key] = entries[0].isIntersecting;
        update();
      }).observe(el);
    };
    watch($(".hero__actions"), "hero");
    watch($("#connect"), "connect");
    watch($(".footer"), "footer");
  }

  /* ---------- Disclosures that start open on wider screens ---------- */
  if (window.matchMedia("(min-width: 760px)").matches) {
    $$("details[data-open-wide]").forEach(function (d) { d.open = true; });
  }

  /* ---------- Rails: keyboard-scrollable only when they overflow ---------- */
  var rails = $$(".rail");
  var syncRails = function () {
    rails.forEach(function (r) {
      if (r.scrollWidth > r.clientWidth + 1) r.setAttribute("tabindex", "0");
      else r.removeAttribute("tabindex");
    });
  };
  syncRails();
  var railTimer;
  window.addEventListener("resize", function () { clearTimeout(railTimer); railTimer = setTimeout(syncRails, 150); });

  /* ---------- Footer year ---------- */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
