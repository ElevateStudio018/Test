(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Navbar: desktop dropdown ---------- */
  document.querySelectorAll(".nav-dropdown").forEach(function (dd) {
    var btn = dd.querySelector("button");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-dropdown.is-open").forEach(function (dd) {
      dd.classList.remove("is-open");
      dd.querySelector("button").setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Navbar: mobile panel ---------- */
  var toggle = document.getElementById("navToggle");
  var panel = document.getElementById("mobilePanel");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    var svcToggle = panel.querySelector(".mobile-services-toggle");
    var svcList = panel.querySelector(".mobile-services-list");
    if (svcToggle && svcList) {
      svcToggle.addEventListener("click", function () {
        svcList.classList.toggle("is-open");
      });
    }
  }

  /* ---------- Quote modal ---------- */
  var backdrop = document.getElementById("quoteModalBackdrop");
  if (backdrop) {
    var modal = backdrop.querySelector(".quote-modal");
    var closeBtn = backdrop.querySelector(".quote-modal-close");
    var lastTrigger = null;

    function openModal(trigger) {
      lastTrigger = trigger || null;
      backdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
      var firstField = modal.querySelector("input, select, textarea");
      if (firstField) firstField.focus();
    }

    function closeModal() {
      backdrop.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    }

    document.querySelectorAll("[data-quote-trigger]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn);
      });
    });

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && backdrop.classList.contains("is-open")) closeModal();
      if (e.key === "Tab" && backdrop.classList.contains("is-open")) {
        var focusables = modal.querySelectorAll("button, input, select, textarea, a[href]");
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------- Quote forms (inline + modal) — static UI, fake submit ---------- */
  document.querySelectorAll(".quote-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var requiredFields = form.querySelectorAll("[required]");
      var valid = true;
      requiredFields.forEach(function (f) {
        var err = form.querySelector('[data-error-for="' + f.name + '"]');
        if (!f.value.trim()) {
          valid = false;
          if (err) err.textContent = "Det här fältet behövs.";
        } else if (err) {
          err.textContent = "";
        }
      });
      if (!valid) return;

      var submitBtn = form.querySelector(".quote-submit");
      var label = submitBtn.querySelector(".label");
      var originalLabel = label.textContent;
      submitBtn.classList.add("is-loading");
      submitBtn.disabled = true;
      label.textContent = "Skickar...";

      setTimeout(function () {
        submitBtn.classList.remove("is-loading");
        submitBtn.disabled = false;
        label.textContent = originalLabel;
        form.reset();
        showConfirmation();
      }, 1000);
    });
  });

  function showConfirmation() {
    var confirmEl = document.getElementById("formConfirm");
    if (!confirmEl) return;
    confirmEl.classList.add("is-visible");
    window.clearTimeout(showConfirmation._t);
    showConfirmation._t = window.setTimeout(function () {
      confirmEl.classList.remove("is-visible");
    }, 4500);
  }

  /* ---------- Reviews carousel ---------- */
  document.querySelectorAll("[data-reviews]").forEach(function (root) {
    var slides = root.querySelector(".reviews-slides");
    var items = Array.prototype.slice.call(root.querySelectorAll(".review-slide"));
    if (!items.length) return;
    var index = 0;

    function render() {
      slides.style.transform = "translateX(-" + index * 100 + "%)";
    }

    root.querySelectorAll("[data-review-prev]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        index = (index - 1 + items.length) % items.length;
        render();
      });
    });
    root.querySelectorAll("[data-review-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        index = (index + 1) % items.length;
        render();
      });
    });

    var startX = null;
    var viewport = root.querySelector(".reviews-viewport");
    viewport.addEventListener(
      "touchstart",
      function (e) {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchend",
      function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
          index = dx < 0 ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
          render();
        }
        startX = null;
      },
      { passive: true }
    );

    render();
  });

  /* ---------- Gallery filter ---------- */
  document.querySelectorAll("[data-gallery]").forEach(function (root) {
    var buttons = root.querySelectorAll(".filter-btn");
    var items = root.querySelectorAll(".masonry-item");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        var cat = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var show = cat === "alla" || item.getAttribute("data-category") === cat;
          item.style.display = show ? "" : "none";
        });
      });
    });
  });

  /* ---------- Trust bar count-up ---------- */
  var countEls = document.querySelectorAll("[data-countup]");
  if (countEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      countEls.forEach(function (el) {
        el.textContent = el.getAttribute("data-countup");
      });
    } else {
      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            countObserver.unobserve(entry.target);
            var target = parseFloat(entry.target.getAttribute("data-countup"));
            var decimals = (entry.target.getAttribute("data-countup").split(".")[1] || "").length;
            var duration = 1200;
            var startTime = null;
            function fmt(n) {
              return n.toLocaleString("sv-SE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
            }
            function tick(ts) {
              if (!startTime) startTime = ts;
              var progress = Math.min((ts - startTime) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              entry.target.textContent = fmt(target * eased);
              if (progress < 1) requestAnimationFrame(tick);
              else entry.target.textContent = fmt(target);
            }
            requestAnimationFrame(tick);
          });
        },
        { threshold: 0.6 }
      );
      countEls.forEach(function (el) {
        countObserver.observe(el);
      });
    }
  }

  /* ---------- Process: step reveal + scroll line fill ---------- */
  var processWrap = document.querySelector(".process-wrap");
  if (processWrap) {
    var steps = processWrap.querySelectorAll(".process-step");
    var lineFill = processWrap.querySelector(".process-line-fill");

    if (reduceMotion) {
      steps.forEach(function (s) {
        s.classList.add("is-visible");
      });
      if (lineFill) lineFill.style.height = "100%";
    } else {
      if ("IntersectionObserver" in window) {
        var stepObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                stepObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.35 }
        );
        steps.forEach(function (s) {
          stepObserver.observe(s);
        });
      } else {
        steps.forEach(function (s) {
          s.classList.add("is-visible");
        });
      }

      var ticking = false;
      function updateLine() {
        ticking = false;
        var rect = processWrap.getBoundingClientRect();
        var vh = window.innerHeight;
        var total = rect.height;
        var scrolled = vh * 0.75 - rect.top;
        var pct = Math.max(0, Math.min(1, scrolled / total));
        if (lineFill) lineFill.style.height = pct * 100 + "%";
      }
      window.addEventListener(
        "scroll",
        function () {
          if (!ticking) {
            window.requestAnimationFrame(updateLine);
            ticking = true;
          }
        },
        { passive: true }
      );
      updateLine();
    }
  }

  /* ---------- Opening hours (Europe/Stockholm), Mon-Fri 07:00-16:00 ---------- */
  var OPEN_MIN = 7 * 60;
  var CLOSE_MIN = 16 * 60;
  var DAY_NAMES = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];

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
    var weekdayMap = { sön: 0, mån: 1, tis: 2, ons: 3, tor: 4, fre: 5, lör: 6 };
    var key = (map.weekday || "").replace(".", "").toLowerCase().slice(0, 3);
    return { day: weekdayMap[key], minutes: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10) };
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
    return "Öppnar kl. 07:00 " + (stillToday ? "idag" : "på " + DAY_NAMES[d]);
  }

  function updateOpenStatus() {
    var targets = document.querySelectorAll("[data-open-status]");
    if (!targets.length) return;
    var now = stockholmParts(new Date());
    var open = isWorkday(now.day) && now.minutes >= OPEN_MIN && now.minutes < CLOSE_MIN;
    var closing = open && CLOSE_MIN - now.minutes <= 60;
    var text = open
      ? closing
        ? "Öppet nu · Stänger snart (16:00)"
        : "Öppet nu · Stänger kl. 16:00"
      : "Stängt nu · " + nextOpenLabel(now.day, now.minutes);
    targets.forEach(function (el) {
      el.textContent = text;
    });
    document.querySelectorAll(".hours-table tr[data-day]").forEach(function (row) {
      row.classList.toggle("is-today", parseInt(row.getAttribute("data-day"), 10) === now.day);
    });
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);
})();
