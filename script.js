/* =========================================================================
   nrxgt4 — script.js
   Everything on the site works without this file. This just adds:
     1. Editable channel stats (with a count-up animation)
     2. A small entrance animation for the hero
     3. A "copy email" convenience button
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. CHANNEL STATS — edit these numbers whenever your channel updates.

   ------------------------------------------------------------------- */
const CHANNEL_STATS = {
  followers: 1300,
  likes: 29000,
  videos: 10,
  age: 16, // this is my age, not the account's age
  updated: "September 2026", // EDIT: update this whenever you update the numbers above
};

/* Formats a number the way it should appear on screen, e.g. 9886 -> "9,886" */
function formatStat(value) {
  return value.toLocaleString("en-US");
}

/* -------------------------------------------------------------------------
   2. Populate the stats + "last updated" text from CHANNEL_STATS above,
   then animate each number counting up from 0 the first time it scrolls
   into view.
   ------------------------------------------------------------------- */
function initStats() {
  const statEls = document.querySelectorAll("[data-stat]");
  const updatedEl = document.getElementById("stats-updated");

  if (updatedEl) {
    updatedEl.textContent = CHANNEL_STATS.updated;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  statEls.forEach((el) => {
    const key = el.getAttribute("data-stat");
    const target = CHANNEL_STATS[key];
    if (typeof target !== "number") return;

    // Keep the real number as a fallback, then animate if possible.
    el.textContent = formatStat(target);

    if (prefersReducedMotion) return;

    el.dataset.target = String(target);
    el.textContent = "0";
    statObserver.observe(el);
  });
}

/* Counts a single element up to its target value over ~900ms. */
function animateCount(el) {
  const target = Number(el.dataset.target);
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    // ease-out for a natural finish rather than a linear tick-up
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    el.textContent = formatStat(current);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = formatStat(target);
    }
  }

  requestAnimationFrame(tick);
}

/* Only animate a stat once it's actually visible on screen. */
const statObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

/* -------------------------------------------------------------------------
   3. Small hero entrance — one deliberate, subtle moment on load.
   ------------------------------------------------------------------- */
function initHeroReveal() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  // Runs on the next frame so the transition in CSS actually fires.
  requestAnimationFrame(() => {
    hero.classList.add("is-visible");
  });
}

/* -------------------------------------------------------------------------
   4. Copy-to-clipboard for the business email.
   The link itself already works as a normal mailto link without this.
   ------------------------------------------------------------------- */
function initCopyEmail() {
  const button = document.getElementById("copy-email-btn");
  const emailLink = document.getElementById("business-email");
  if (!button || !emailLink) return;

  button.addEventListener("click", async () => {
    const email = emailLink.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      const original = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = original;
      }, 1500);
    } catch (err) {
      // Clipboard API unavailable — the mailto link still works fine.
    }
  });
}

/* -------------------------------------------------------------------------
   5. Footer year — keeps the copyright year correct automatically.
   ------------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* -------------------------------------------------------------------------
   Run everything once the page has loaded.
   ------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initStats();
  initHeroReveal();
  initCopyEmail();
  initFooterYear();
});
