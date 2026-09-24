/* The Father's House, All Nations Church · site behaviour
   Plain JavaScript, no libraries, loaded with `defer`.
   Without JavaScript the page is still complete: every section shows, the
   forms fall back to email, and only the extras (next gathering, calendar
   files, filters, motion) are missing. */

/* ==========================================================================
   CHANGE SERVICE TIMES HERE
   --------------------------------------------------------------------------
   • day:   0 = Sunday … 5 = Friday, 6 = Saturday
   • place: the venue, for calendar files; map: the search used for the map
   • start / end: 24-hour clock, "HH:MM", in the house's own time zone
   • timeZone: IANA name. Port Moresby is "Pacific/Port_Moresby" (UTC+10, no
     daylight saving). fixedOffsetHours is used only by very old browsers.

   If you change a time here, also change the words on the page: search
   index.html for "9:00 AM", "1:30 PM", "7:00 PM" and "10:00 PM" (visible
   text, meta description, and the JSON-LD "startTime"/"endTime").
   ========================================================================== */
var HOUSE = {
  timeZone: "Pacific/Port_Moresby",
  fixedOffsetHours: 10,
  siteUrl: "https://n30dyn4m1c.github.io/tfhanc/",
  gatherings: {
    sunday: {
      name: "Sunday Celebration", day: 0, start: "09:00", end: "13:30",
      place: "Gordon International School, Gordon, Port Moresby, Papua New Guinea",
      map: "Gordon International School, Port Moresby"
    },
    friday: {
      name: "Friday Night Prayer", day: 5, start: "19:00", end: "22:00",
      place: "Taurama Aquatic Centre Lounge, Port Moresby, Papua New Guinea",
      map: "Taurama Aquatic Centre, Port Moresby"
    }
  }
};

(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var hasIO = "IntersectionObserver" in window;
  var motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var announcer = $("#announcer");

  function announce(msg) {
    if (!announcer) return;
    announcer.textContent = "";
    setTimeout(function () { announcer.textContent = msg; }, 60);
  }

  /* ---------- Time in Port Moresby ---------- */
  var MIN = 60000, DAY = 86400000;
  var tzFormat = null;
  try {
    tzFormat = new Intl.DateTimeFormat("en-GB", {
      timeZone: HOUSE.timeZone, hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  } catch (e) { tzFormat = null; }

  // Milliseconds to add to a UTC instant to read the house's wall clock.
  function offsetAt(ms) {
    if (!tzFormat || !tzFormat.formatToParts) return HOUSE.fixedOffsetHours * 3600000;
    var p = {};
    tzFormat.formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = +x.value; });
    var asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second);
    return Math.round((asUTC - ms) / MIN) * MIN;
  }
  function hm(s) { var a = s.split(":"); return { h: +a[0], m: +a[1] }; }
  function clock(s) { var t = hm(s); return (t.h % 12 || 12) + ":" + (t.m < 10 ? "0" : "") + t.m + (t.h < 12 ? " AM" : " PM"); }

  // The next start of a gathering strictly after `now` (UTC milliseconds).
  function nextStart(g, now) {
    var off = offsetAt(now);
    var wall = new Date(now + off);
    var t = hm(g.start);
    for (var i = 0; i <= 7; i++) {
      var cand = Date.UTC(wall.getUTCFullYear(), wall.getUTCMonth(), wall.getUTCDate() + i, t.h, t.m);
      if (new Date(cand).getUTCDay() !== g.day) continue;
      var utc = cand - offsetAt(cand - off);
      if (utc > now) return utc;
    }
    return now + 7 * DAY;
  }
  function lengthOf(g) { var s = hm(g.start), e = hm(g.end); return ((e.h * 60 + e.m) - (s.h * 60 + s.m)) * MIN; }
  function gatheredNow(now) {
    var found = null;
    Object.keys(HOUSE.gatherings).forEach(function (key) {
      var g = HOUSE.gatherings[key];
      var last = nextStart(g, now - 7 * DAY);
      while (nextStart(g, last) <= now) last = nextStart(g, last);
      if (last <= now && now < last + lengthOf(g)) found = { key: key, g: g };
    });
    return found;
  }
  function soonest(now) {
    return Object.keys(HOUSE.gatherings).map(function (key) {
      return { key: key, g: HOUSE.gatherings[key], at: nextStart(HOUSE.gatherings[key], now) };
    }).sort(function (a, b) { return a.at - b.at; })[0];
  }
  function likelyGathering(now) { var on = gatheredNow(now); return on ? on.key : soonest(now).key; }

  /* ---------- One scroll loop for everything scroll-linked ---------- */
  var header = $("#header");
  var scrollHooks = [];
  var queued = false;
  function runScroll() { queued = false; scrollHooks.forEach(function (fn) { fn(); }); }
  function onScroll() { if (!queued) { queued = true; requestAnimationFrame(runScroll); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  scrollHooks.push(function () {
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    header.style.setProperty("--progress", p.toFixed(4));
  });

  /* Parallax: elements with data-parallax="speed" drift as they pass. */
  if (motionOK) {
    var layers = $$("[data-parallax]");
    scrollHooks.push(function () {
      var vh = window.innerHeight;
      layers.forEach(function (el) {
        var box = (el.parentElement || el).getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        var shift = (box.top + box.height / 2 - vh / 2) * -speed;
        el.style.transform = "translate3d(0," + shift.toFixed(1) + "px,0) scale(1.12)";
      });
    });
  }

  /* The manifesto: lines turn gold as they cross the middle of the screen. */
  var lit = $$("[data-lit]");
  if (lit.length) {
    if (!motionOK) lit.forEach(function (li) { li.classList.add("is-lit"); });
    else scrollHooks.push(function () {
      var mid = window.innerHeight * 0.62;
      lit.forEach(function (li) { li.classList.toggle("is-lit", li.getBoundingClientRect().top < mid); });
    });
  }

  /* ---------- Dialogs: menu, biographies, graphics ----------
     Native <dialog>.showModal() makes the page behind inert; we add a Tab
     trap, close on backdrop click, and return focus to the opener. */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  $$("dialog").forEach(function (dialog) {
    dialog.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var items = $$(FOCUSABLE, dialog).filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    dialog.addEventListener("click", function (e) {
      if (e.target !== dialog) return;
      var r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    dialog.addEventListener("close", function () {
      if (dialog._opener) dialog._opener.focus({ preventScroll: true });
      dialog._opener = null;
    });
  });
  function openDialog(dialog, opener) {
    if (typeof dialog.showModal !== "function") return false;
    dialog._opener = opener;
    dialog.showModal();
    return true;
  }

  var menu = $("#menu");
  var menuBtn = $(".menu-toggle");
  if (menu && menuBtn) {
    $$(".menu__list li", menu).forEach(function (li, i) { li.style.setProperty("--i", i); });
    menuBtn.addEventListener("click", function () {
      if (openDialog(menu, menuBtn)) {
        menuBtn.setAttribute("aria-expanded", "true");
        var first = $(".menu__list a", menu);
        if (first) first.focus();
      }
    });
    menu.addEventListener("close", function () { menuBtn.setAttribute("aria-expanded", "false"); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { menu._opener = null; menu.close(); }); });
    window.matchMedia("(min-width: 1280px)").addEventListener("change", function (e) { if (e.matches && menu.open) menu.close(); });
  }

  var viewer = $("#graphic");
  var viewerImg = viewer && $("[data-graphic-img]", viewer);
  $$("[data-dialog]").forEach(function (btn) {
    var dialog = doc.getElementById(btn.getAttribute("data-dialog"));
    if (!dialog) return;
    btn.setAttribute("aria-haspopup", "dialog");
    btn.addEventListener("click", function () {
      if (dialog === viewer) {
        viewerImg.src = btn.getAttribute("data-graphic");
        viewerImg.width = +btn.getAttribute("data-graphic-w");
        viewerImg.height = +btn.getAttribute("data-graphic-h");
        viewerImg.alt = btn.getAttribute("data-graphic-alt") || "";
        viewer.setAttribute("aria-label", viewerImg.alt.split(":")[0] || "Graphic");
      }
      if (!openDialog(dialog, btn) && dialog === viewer) window.open(btn.getAttribute("data-graphic"), "_blank", "noopener");
    });
  });
  $$("[data-dialog-close]").forEach(function (btn) {
    btn.addEventListener("click", function () { btn.closest("dialog").close(); });
  });

  /* ---------- Current section in the main navigation ---------- */
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

  /* ---------- Reveal on scroll ----------
     Only elements that start below the fold are hidden, so nothing above the
     fold flashes, and nothing is hidden if this script does not run. */
  if (motionOK && hasIO) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.remove("pre-reveal", "rule-pending");
        el.classList.add("is-revealed");
        revealer.unobserve(el);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    $$(".reveal").forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      var sibs = $$(":scope > .reveal", el.parentNode);
      el.style.setProperty("--d", Math.min(sibs.indexOf(el), 4) * 110 + "ms");
      el.classList.add("pre-reveal");
      revealer.observe(el);
    });
    // Meridian rules draw in as their label arrives.
    $$("main .label .rule").forEach(function (r) {
      var label = r.parentNode;
      if (label.getBoundingClientRect().top < window.innerHeight || label.closest(".hero")) return;
      label.classList.add("rule-pending");
      revealer.observe(label);
    });
  }

  /* ---------- Next gathering (hero strip) ---------- */
  var next = $("[data-next]");
  if (next) {
    var text = $("[data-next-text]", next);
    var dayFormat = null;
    try { dayFormat = new Intl.DateTimeFormat("en-GB", { timeZone: HOUSE.timeZone, weekday: "long" }); } catch (e) { dayFormat = null; }
    var plural = function (n, w) { return n + " " + w + (n === 1 ? "" : "s"); };
    var humanise = function (ms) {
      var mins = Math.max(1, Math.ceil(ms / MIN));
      var d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
      if (d) return plural(d, "day") + (h ? ", " + plural(h, "hour") : "");
      if (h) return plural(h, "hour") + (m ? ", " + plural(m, "minute") : "");
      return plural(m, "minute");
    };
    var tick = function () {
      var now = Date.now();
      var on = gatheredNow(now);
      next.classList.toggle("is-open", !!on);
      var msg;
      if (on) msg = on.g.name + " is gathered now, until " + clock(on.g.end);
      else {
        var n = soonest(now);
        var today = dayFormat && dayFormat.format(new Date(n.at)) === dayFormat.format(new Date(now));
        msg = "Next: " + n.g.name + (today ? ", today at " + clock(n.g.start) : "") + " · in " + humanise(n.at - now);
      }
      if (text.textContent !== msg) text.textContent = msg;
      next.hidden = false;
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- Calendar files (.ics) ---------- */
  function icsDate(ms) { return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  function icsText(s) { return s.replace(/\\/g, "\\\\").replace(/[,;]/g, "\\$&"); }
  function icsFor(key) {
    var g = HOUSE.gatherings[key];
    var start = nextStart(g, Date.now());
    var lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//The Father's House All Nations Church//Website//EN",
      "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
      "UID:" + key + "-weekly@tfhanc.org", "DTSTAMP:" + icsDate(Date.now()),
      "DTSTART:" + icsDate(start), "DTEND:" + icsDate(start + lengthOf(g)),
      "RRULE:FREQ=WEEKLY",
      "SUMMARY:" + icsText(g.name + " · The Father’s House, All Nations Church"),
      "LOCATION:" + icsText(g.place),
      "URL:" + HOUSE.siteUrl,
      "END:VEVENT", "END:VCALENDAR"
    ];
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(lines.join("\r\n"));
  }
  $$("[data-ics]").forEach(function (a) {
    var key = a.getAttribute("data-ics");
    if (!HOUSE.gatherings[key]) return;
    a.href = icsFor(key);
    a.setAttribute("download", "tfh-anc-" + key + ".ics");
    a.hidden = false;
  });

  /* ---------- Plan your visit: which venue the map shows ---------- */
  var venues = $("[data-venues]");
  if (venues) {
    var mapFrame = $("[data-venue-map]", venues);
    var mapLink = $("[data-venue-link]", venues);
    var showVenue = function (key) {
      var g = HOUSE.gatherings[key];
      $$("[data-venue]", venues).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-venue") === key)); });
      $$("[data-venue-card]", venues).forEach(function (c) { c.classList.toggle("is-current", c.getAttribute("data-venue-card") === key); });
      var q = encodeURIComponent(g.map);
      var src = "https://maps.google.com/maps?q=" + q + "&z=15&output=embed";
      if (mapFrame.getAttribute("src") !== src) mapFrame.setAttribute("src", src);
      mapFrame.title = "Map: " + g.map;
      mapLink.href = "https://maps.google.com/?q=" + q;
    };
    $$("[data-venue]", venues).forEach(function (b) {
      b.addEventListener("click", function () { showVenue(b.getAttribute("data-venue")); });
    });
    $(".venue-switch", venues).hidden = false;
    showVenue(likelyGathering(Date.now()));
  }

  /* ---------- Copy to clipboard ---------- */
  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(value);
    return new Promise(function (resolve, reject) {
      var ta = doc.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0";
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
    var original = label ? label.textContent : "";
    var what = btn.getAttribute("data-copy-what") || "Text";
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      copyText(value).then(function () {
        if (label) label.textContent = "Copied";
        announce(what + " copied: " + value);
        setTimeout(function () { if (label) label.textContent = original; }, 2500);
      }, function () { announce("Copying is not available here. " + what + ": " + value); });
    });
  }
  $$("[data-copy]").forEach(wireCopy);

  /* ---------- Featured message: YouTube loads only on play ---------- */
  $$("[data-video-id]").forEach(function (fig) {
    var id = (fig.getAttribute("data-video-id") || "").trim();
    var poster = $(".feature__poster", fig);
    if (!poster || !/^[\w-]{6,20}$/.test(id)) return; // no ID yet: the poster opens the channel
    var title = fig.getAttribute("data-video-title") || "Latest message";
    poster.href = "https://www.youtube.com/watch?v=" + id;
    poster.removeAttribute("target");
    poster.setAttribute("role", "button");
    $("[data-video-label]", poster).textContent = "Play: " + title;
    poster.addEventListener("click", function (e) {
      e.preventDefault();
      var frame = doc.createElement("div");
      frame.className = "feature__frame";
      var iframe = doc.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      iframe.title = title;
      iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
      poster.replaceWith(frame);
      iframe.focus();
    });
    poster.addEventListener("keydown", function (e) { if (e.key === " ") { e.preventDefault(); poster.click(); } });
  });

  /* ---------- Prophetic word: filter by category ---------- */
  var archive = $("[data-archive]");
  if (archive) {
    var words = $$(".word", archive);
    var empty = $("[data-words-empty]", archive);
    var filter = function (stream) {
      $$(".streams button", archive).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-stream") === stream)); });
      $$("[data-stream-about]", archive).forEach(function (p) { p.hidden = p.getAttribute("data-stream-about") !== stream; });
      var shown = 0;
      words.forEach(function (w) {
        var match = stream === "all" || w.getAttribute("data-stream") === stream;
        w.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown > 0;
    };
    $$(".streams button", archive).forEach(function (b) {
      b.addEventListener("click", function () { filter(b.getAttribute("data-stream")); });
    });
  }

  /* ---------- Forms (#connect-form, and the short #begin-form) ---------- */
  var connect = $("#connect-form");
  var MESSAGE_LABELS = {
    prayer: "Your prayer request",
    coming: "Anything the house should know?",
    prayed: "Tell the house a little about yourself",
    serve: "Where would you like to serve?",
    giving: "Your question about giving",
    updates: "Anything else?",
    word: "The word, with when and where it was given",
    other: "Your message"
  };
  var SUBMIT_LABELS = { prayer: "Ask the house to pray", coming: "Tell the house I’m coming" };
  var SENT_LINES = {
    coming: function (d) { return "You will be welcomed at " + d.gathering + ". Come as you are."; },
    prayer: function () { return "This house will carry your request before the Father in prayer."; },
    prayed: function () { return "Welcome to the family of God. The house will pray with you and help you take your first steps in the secret place."; }
  };

  function syncReason() {
    if (!connect) return;
    var r = $('input[name="reason"]:checked', connect);
    var reason = r ? r.value : "other";
    $("[data-message-label]", connect).textContent = MESSAGE_LABELS[reason] || MESSAGE_LABELS.other;
    $("[data-submit]", connect).textContent = SUBMIT_LABELS[reason] || "Send to the house";
    $("[data-when='coming']", connect).hidden = reason !== "coming";
  }

  // Any link with data-reason prefills the main form ("Pray for me", "I'm coming" …).
  $$("[data-reason]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (!connect) return;
      if (connect.classList.contains("is-sent")) resetForm(connect);
      var radio = $('input[name="reason"][value="' + a.getAttribute("data-reason") + '"]', connect);
      if (radio) radio.checked = true;
      var g = a.getAttribute("data-gathering") || likelyGathering(Date.now());
      $("#f-gathering").value = HOUSE.gatherings[g].name;
      syncReason();
      setTimeout(function () { var n = $("#f-name"); if (n) n.focus({ preventScroll: true }); }, motionOK ? 800 : 50);
    });
  });
  if (connect) {
    $$('input[name="reason"]', connect).forEach(function (r) { r.addEventListener("change", syncReason); });
    $("#f-gathering").value = HOUSE.gatherings[likelyGathering(Date.now())].name;
    syncReason();
  }

  function resetForm(form) {
    form.classList.remove("is-sent");
    var status = $(".form__status", form);
    status.hidden = true;
    status.textContent = "";
  }

  $$("form[data-connect]").forEach(function (form) {
    var status = $(".form__status", form);
    var submit = $("[data-submit]", form);
    var email = form.getAttribute("data-email") || "info@tfhanc.org";
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var checks = {
      name: function (v) { return v.trim().length > 0; },
      email: function (v) { return EMAIL_RE.test(v.trim()); }
    };
    var tried = false;
    var validate = function (input) {
      var ok = checks[input.name](input.value);
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      doc.getElementById(input.id + "-error").hidden = ok;
      return ok;
    };
    Object.keys(checks).forEach(function (n) {
      var input = form.elements[n];
      input.addEventListener("blur", function () { if (tried || input.value) validate(input); });
      input.addEventListener("input", function () { if (input.getAttribute("aria-invalid") === "true") validate(input); });
    });

    var para = function (txt, strong) {
      var p = doc.createElement("p");
      if (strong) { var s = doc.createElement("strong"); s.textContent = txt; p.appendChild(s); } else p.textContent = txt;
      return p;
    };
    var showSent = function (d) {
      status.textContent = "";
      var again = doc.createElement("button");
      again.type = "button";
      again.className = "link";
      again.textContent = "Send another message";
      again.addEventListener("click", function () { resetForm(form); form.reset(); syncReason(); form.elements.name.focus(); });
      status.append(para("Received. Your message has reached the house.", true), para(SENT_LINES[d.reason] ? SENT_LINES[d.reason](d) : "The house will reply by email."), again);
      status.hidden = false;
      form.classList.add("is-sent");
      status.focus({ preventScroll: true });
      status.scrollIntoView({ block: "center", behavior: motionOK ? "smooth" : "auto" });
    };
    var showMail = function () {
      status.textContent = "";
      var p2 = doc.createElement("p");
      p2.append("If it did not open, write to ");
      var a = doc.createElement("a");
      a.href = "mailto:" + email;
      a.textContent = email;
      p2.append(a, ".");
      var btn = doc.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.setAttribute("data-copy", email);
      btn.setAttribute("data-copy-what", "Email address");
      btn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-copy"/></svg><span data-copy-label>Copy address</span>';
      wireCopy(btn);
      status.append(para("Your email app should now open with your message ready to send.", true), p2, btn);
      status.hidden = false;
    };
    var openMail = function (d) {
      var body = "Name: " + d.name + "\nEmail: " + d.email + "\nAbout: " + d.subject +
        (d.reason === "coming" ? "\nGathering: " + d.gathering : "") + "\n\n" + d.message;
      window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent(d.subject + " · " + d.name) + "&body=" + encodeURIComponent(body);
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      tried = true;
      var invalid = Object.keys(checks).map(function (n) { return form.elements[n]; }).filter(function (i) { return !validate(i); });
      if (invalid.length) { invalid[0].focus(); return; }

      var reasonInput = $('input[name="reason"]:checked', form);
      var data = {
        reason: reasonInput ? reasonInput.value : form.getAttribute("data-fixed-reason"),
        subject: reasonInput ? reasonInput.getAttribute("data-subject") : form.getAttribute("data-subject"),
        gathering: form.elements.gathering ? form.elements.gathering.value : "",
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        message: form.elements.message.value.trim()
      };
      if (form.elements._gotcha.value) { showSent(data); return; } // a bot filled the trap: send nothing

      var endpoint = (form.getAttribute("data-endpoint") || "").trim();
      if (!endpoint || !window.fetch) { openMail(data); showMail(); return; }

      var body = new FormData();
      body.append("about", data.subject);
      if (data.reason === "coming") body.append("gathering", data.gathering);
      body.append("name", data.name);
      body.append("email", data.email);
      body.append("message", data.message);
      body.append("_subject", data.subject + " · " + data.name);
      body.append("_replyto", data.email);

      var label = submit.textContent;
      submit.disabled = true;
      submit.textContent = "Sending…";
      fetch(endpoint, { method: "POST", body: body, headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error(String(r.status));
          form.reset();
          syncReason();
          showSent(data);
        })
        .catch(function () { openMail(data); showMail(); })
        .then(function () { submit.disabled = false; if (submit.textContent === "Sending…") submit.textContent = label; });
    });
  });

  /* ---------- Floating actions (phones) ---------- */
  var dock = $("[data-dock]");
  if (dock && hasIO) {
    var seen = { hero: true, connect: false, footer: false, begin: false };
    var update = function () { dock.classList.toggle("is-shown", !seen.hero && !seen.connect && !seen.footer && !seen.begin); };
    [[".hero", "hero"], ["#connect", "connect"], [".footer", "footer"], ["#begin-form", "begin"]].forEach(function (pair) {
      var el = $(pair[0]);
      if (!el) return;
      new IntersectionObserver(function (entries) { seen[pair[1]] = entries[0].isIntersecting; update(); }).observe(el);
    });
  }

  /* ---------- Footer year ---------- */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  runScroll();
})();
