(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mainNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Opening hours (Europe/Stockholm), Mon-Fri 07:00-16:00 ---------- */
  var OPEN_MIN = 7 * 60;
  var CLOSE_MIN = 16 * 60;
  var DAY_NAMES = [
    "söndag",
    "måndag",
    "tisdag",
    "onsdag",
    "torsdag",
    "fredag",
    "lördag",
  ];

  function stockholmParts(date) {
    var fmt = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Europe/Stockholm",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    var parts = fmt.formatToParts(date);
    var map = {};
    parts.forEach(function (p) {
      map[p.type] = p.value;
    });
    var weekdayMap = {
      sön: 0,
      mån: 1,
      tis: 2,
      ons: 3,
      tor: 4,
      fre: 5,
      lör: 6,
    };
    var key = (map.weekday || "").replace(".", "").toLowerCase().slice(0, 3);
    return {
      day: weekdayMap[key],
      minutes: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10),
    };
  }

  function isWorkday(day) {
    return day >= 1 && day <= 5;
  }

  function nextOpenLabel(day, minutes) {
    var d = day;
    var stillToday = isWorkday(d) && minutes < OPEN_MIN;
    if (!stillToday) {
      do {
        d = (d + 1) % 7;
      } while (!isWorkday(d));
    }
    var label = stillToday ? "idag" : "på " + DAY_NAMES[d];
    return "Öppnar kl. 07:00 " + label;
  }

  function updateOpenStatus() {
    var targets = document.querySelectorAll("[data-open-status]");
    if (!targets.length) return;
    var now = stockholmParts(new Date());
    var open = isWorkday(now.day) && now.minutes >= OPEN_MIN && now.minutes < CLOSE_MIN;
    var text;
    var closing = open && CLOSE_MIN - now.minutes <= 60;

    if (open) {
      text = closing ? "Öppet nu · Stänger snart (16:00)" : "Öppet nu · Stänger kl. 16:00";
    } else {
      text = "Stängt nu · " + nextOpenLabel(now.day, now.minutes);
    }

    targets.forEach(function (el) {
      el.textContent = text;
      var dot = el.parentElement && el.parentElement.querySelector(".status-dot");
      if (dot) dot.classList.toggle("is-closed", !open);
    });

    document.querySelectorAll(".hours-table tr[data-day]").forEach(function (row) {
      row.classList.toggle("is-today", parseInt(row.getAttribute("data-day"), 10) === now.day);
    });
  }

  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  /* ---------- Gallery lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("[data-lb-img]");
    var lbTitle = lightbox.querySelector("[data-lb-title]");
    var lbDesc = lightbox.querySelector("[data-lb-desc]");
    var lastFocused = null;

    function openLightbox(tile) {
      var img = tile.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbTitle.textContent = tile.getAttribute("data-title") || "";
      lbDesc.textContent = tile.getAttribute("data-desc") || "";
      lastFocused = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox-close").focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll(".gallery-tile").forEach(function (tile) {
      tile.addEventListener("click", function () {
        openLightbox(tile);
      });
    });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.closest(".lightbox-close")) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }
})();
