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
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var motionOK = !reducedMotion;
  if (finePointer) root.classList.add("has-hover");
  var onThemeChange = []; // redraw hooks (the hero sky reads theme colours)
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
  function themeChanged() {
    syncThemeToggles();
    onThemeChange.forEach(function (fn) { fn(); });
  }
  $$("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = activeTheme() === "dark" ? "light" : "dark";
      var apply = function () {
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("tfh-theme", next); } catch (e) { /* storage unavailable */ }
        themeChanged();
      };
      // The new theme spreads out in a circle from the toggle.
      if (!doc.startViewTransition || !motionOK) { apply(); return; }
      var r = btn.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      doc.startViewTransition(apply).ready.then(function () {
        root.animate(
          { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + end + "px at " + x + "px " + y + "px)"] },
          { duration: 700, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      }, function () { /* transition skipped; the theme is already applied */ });
    });
  });
  if (darkQuery.addEventListener) darkQuery.addEventListener("change", themeChanged);
  syncThemeToggles();

  /* ---------- Scroll-linked state (one rAF per frame at most) ----------
     Header border, the reading-progress line, the footer seal's turn, and
     James 5:16 lighting up word by word. */
  var header = $("#header");
  var footer = $(".footer");
  var scrollHooks = [];
  var lastProgress = -1;
  scrollHooks.push(function () {
    var max = doc.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    if (Math.abs(p - lastProgress) < 0.0005) return;
    lastProgress = p;
    header.style.setProperty("--progress", p.toFixed(4));
    if (footer && motionOK) footer.style.setProperty("--progress", p.toFixed(4));
  });
  var scrollQueued = false;
  function runScrollHooks() {
    scrollQueued = false;
    scrollHooks.forEach(function (fn) { fn(); });
  }
  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(runScrollHooks);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

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
  if (menu) $$(".menu__list li", menu).forEach(function (li, i) { li.style.setProperty("--i", i); });
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

  /* ---------- Reveal on scroll, staggered among siblings ---------- */
  var reveals = $$(".reveal");
  if (!hasIO || reducedMotion) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    reveals.forEach(function (el) {
      var sibs = $$(":scope > .reveal", el.parentNode);
      el.style.setProperty("--d", Math.min(sibs.indexOf(el), 4) * 110 + "ms");
    });
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

  /* ---------- Headings rise word by word ----------
     The words are drawn in an aria-hidden copy; the heading keeps its whole
     text in a visually hidden span, so it is still read (and named) as one. */
  function splitWords(el, withHiddenCopy) {
    var text = el.textContent.replace(/\s+/g, " ").trim();
    var words = text.split(" ");
    el.textContent = "";
    if (withHiddenCopy) {
      var copy = doc.createElement("span");
      copy.className = "visually-hidden";
      copy.textContent = text;
      el.appendChild(copy);
    }
    var wrap = doc.createElement("span");
    wrap.className = "split__words";
    if (withHiddenCopy) wrap.setAttribute("aria-hidden", "true");
    words.forEach(function (word, i) {
      var w = doc.createElement("span");
      w.className = "w";
      var inner = doc.createElement("span");
      inner.textContent = word;
      w.style.setProperty("--i", i);
      w.appendChild(inner);
      wrap.appendChild(w);
      if (i < words.length - 1) wrap.appendChild(doc.createTextNode(" "));
    });
    el.appendChild(wrap);
    el.classList.add("is-split");
    return $$(".w", wrap);
  }
  if (motionOK && hasIO) {
    var heroTitle = $(".hero__title");
    if (heroTitle) {
      splitWords(heroTitle, true);
      requestAnimationFrame(function () { requestAnimationFrame(function () { heroTitle.classList.add("is-in"); }); });
    }
    var headings = $$("main h2").filter(function (h) { return !h.closest("dialog") && !h.children.length; });
    var headWatch = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        headWatch.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    headings.forEach(function (h) { splitWords(h, true); headWatch.observe(h); });
  }

  /* ---------- James 5:16 lights up as it is read ---------- */
  $$("[data-illuminate]").forEach(function (fig) {
    if (!motionOK) return;
    var p = $("blockquote p", fig);
    if (!p) return;
    var words = splitWords(p, false);
    fig.classList.add("is-ready", "is-in"); // words are lit, not raised

    var lit = -1;
    scrollHooks.push(function () {
      var r = fig.getBoundingClientRect();
      var vh = window.innerHeight;
      if (r.bottom < -vh || r.top > vh * 2) return;
      var progress = (vh * 0.9 - r.top) / (vh * 0.55);
      var n = Math.max(0, Math.min(words.length, Math.round(progress * words.length)));
      if (n === lit) return;
      lit = n;
      words.forEach(function (w, i) { w.classList.toggle("is-lit", i < n); });
    });
  });

  /* ---------- Cards catch the light; main buttons lean toward the pointer ---------- */
  if (finePointer) {
    $$("[data-spot]").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }
  if (finePointer && motionOK) {
    $$("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.translate = (dx * 10).toFixed(1) + "px " + (dy * 8).toFixed(1) + "px";
      });
      btn.addEventListener("pointerleave", function () { btn.style.translate = ""; });
    });
  }

  /* ---------- Begin here: the light follows the pointer ---------- */
  var begin = $(".begin");
  var beginLight = $(".begin__light");
  if (begin && beginLight && motionOK) {
    begin.addEventListener("pointermove", function (e) {
      var r = begin.getBoundingClientRect();
      beginLight.style.setProperty("--lx", (e.clientX - r.left) + "px");
      beginLight.style.setProperty("--ly", (e.clientY - r.top) + "px");
    });
    begin.addEventListener("pointerleave", function () {
      beginLight.style.removeProperty("--lx");
      beginLight.style.removeProperty("--ly");
    });
  }

  /* ---------- Hero sky: lights rising, like prayers going up ----------
     A small particle field on a canvas. It runs only while the hero is on
     screen and the tab is visible; the pointer draws lights toward it and
     a click or tap sends up a burst. Never drawn under reduced motion. */
  var hero = $(".hero");
  var sky = $(".hero__sky");
  if (hero && sky && sky.getContext && motionOK) {
    (function () {
      var ctx = sky.getContext("2d");
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W = 0, H = 0, parts = [], sprites = [], running = false, visible = true, raf = 0;
      var pointer = { x: -9999, y: -9999, active: false };
      var palette, blend, strength = 1;

      function sprite(rgb) {
        var c = doc.createElement("canvas");
        c.width = c.height = 64;
        var g = c.getContext("2d");
        var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, "rgba(" + rgb + ",1)");
        grad.addColorStop(0.25, "rgba(" + rgb + ",0.55)");
        grad.addColorStop(1, "rgba(" + rgb + ",0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
        return c;
      }
      function readTheme() {
        var dark = activeTheme() === "dark";
        palette = dark ? ["226,184,102", "240,162,127", "255,236,200"] : ["226,184,102", "214,150,70", "176,68,28"];
        blend = dark ? "lighter" : "source-over";
        strength = dark ? 1 : 0.6; // on sand, the lights are warmer and quieter
        sprites = palette.map(sprite); // particles hold an index, so they survive a theme change
      }
      function make(x, y, burst) {
        return {
          x: x, y: y,
          r: burst ? 1.5 + Math.random() * 3 : 0.8 + Math.random() * 2.6,
          vx: burst ? (Math.random() - 0.5) * 1.6 : 0,
          vy: burst ? -(0.9 + Math.random() * 1.6) : -(0.18 + Math.random() * 0.5),
          phase: Math.random() * Math.PI * 2,
          sway: 0.2 + Math.random() * 0.5,
          life: 0,
          max: burst ? 140 + Math.random() * 120 : 400 + Math.random() * 500,
          c: Math.floor(Math.random() * 3)
        };
      }
      function seed() {
        var target = Math.max(28, Math.min(110, Math.round((W * H) / 9000)));
        parts = [];
        for (var i = 0; i < target; i++) {
          var p = make(Math.random() * W, Math.random() * H, false);
          p.life = Math.random() * p.max;
          parts.push(p);
        }
        parts.target = target;
      }
      function resize() {
        var r = hero.getBoundingClientRect();
        W = r.width; H = r.height;
        sky.width = Math.round(W * dpr); sky.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed();
      }
      function frame(t) {
        raf = 0;
        if (!running) return;
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = blend;
        for (var i = parts.length - 1; i >= 0; i--) {
          var p = parts[i];
          p.life++;
          p.vx *= 0.985;
          var dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
          var near = 0;
          if (pointer.active && d2 < 26000) {
            near = 1 - d2 / 26000;
            p.vx -= dx * 0.0009 * near; // drawn gently toward the pointer
            p.y -= 0.35 * near;
          }
          p.x += p.vx + Math.sin(t / 1400 + p.phase) * p.sway * 0.35;
          p.y += p.vy;
          var k = p.life / p.max;
          var a = Math.min(1, k * 6) * (1 - k) * (0.55 + near * 0.45) * strength;
          if (p.y < -20 || k >= 1) {
            if (parts.length > parts.target) { parts.splice(i, 1); continue; }
            parts[i] = make(Math.random() * W, H + 10 + Math.random() * 40, false);
            continue;
          }
          var s = p.r * (6 + near * 4);
          ctx.globalAlpha = a;
          ctx.drawImage(sprites[p.c], p.x - s / 2, p.y - s / 2, s, s);
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(frame);
      }
      function sync() {
        var should = visible && !doc.hidden;
        if (should && !running) { running = true; if (!raf) raf = requestAnimationFrame(frame); }
        else if (!should) { running = false; }
      }

      readTheme();
      resize();
      onThemeChange.push(readTheme);
      if ("ResizeObserver" in window) new ResizeObserver(function () { resize(); }).observe(hero);
      if (hasIO) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; sync(); }).observe(hero);
      doc.addEventListener("visibilitychange", sync);

      var trail = 0;
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true;
        if (++trail % 5 === 0 && parts.length < parts.target + 60) {
          var p = make(pointer.x + (Math.random() - 0.5) * 30, pointer.y + (Math.random() - 0.5) * 30, false);
          p.max = 160 + Math.random() * 120;
          parts.push(p);
        }
      });
      hero.addEventListener("pointerleave", function () { pointer.active = false; pointer.x = pointer.y = -9999; });
      hero.addEventListener("click", function (e) {
        if (e.target.closest("a, button, input, select, textarea, summary")) return;
        var r = hero.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        for (var i = 0; i < 26; i++) parts.push(make(x, y, true));
      });
      sync();
    })();
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
    var clock = $("[data-clock]");
    var cells = clock ? ["d", "h", "m", "s"].map(function (k) { return $("[data-clock-" + k + "]", clock); }) : [];
    var setText = function (el, text) { if (el.textContent !== text) el.textContent = text; };
    var setCell = function (el, text) {
      if (el.textContent === text) return;
      el.textContent = text;
      el.classList.remove("tick");
      void el.offsetWidth; // restart the roll-in
      el.classList.add("tick");
    };
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var tick = function () {
      var now = Date.now();
      if (inProgress(GATHERINGS.sunday, now)) {
        setText(nameEl, "Sunday Celebration");
        setText(timeEl, "is under way now");
        if (clock) clock.hidden = true;
        return;
      }
      var next = ["sunday", "friday"].map(function (k) {
        return { g: GATHERINGS[k], at: nextStart(GATHERINGS[k], now) };
      }).sort(function (a, b) { return a.at - b.at; })[0];
      setText(nameEl, next.g.name);
      setText(timeEl, humanise(next.at - now));
      if (clock) {
        var secs = Math.max(0, Math.floor((next.at - now) / 1000));
        setCell(cells[0], String(Math.floor(secs / 86400)));
        setCell(cells[1], pad(Math.floor((secs % 86400) / 3600)));
        setCell(cells[2], pad(Math.floor((secs % 3600) / 60)));
        setCell(cells[3], pad(secs % 60));
        clock.hidden = false;
      }
    };
    tick();
    countdown.hidden = false;
    setInterval(tick, clock ? 1000 : 30000);
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

  runScrollHooks();

  /* ---------- Footer year ---------- */
  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
