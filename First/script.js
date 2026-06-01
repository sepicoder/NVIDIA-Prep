/*
===========================================
  script.js — Sepideh Homami · NVIDIA TPM
  Built with: Vanilla JavaScript. No jQuery.
  No React. No Vue. Just the real language.
===========================================

  HOW TO EXPLAIN THIS FILE:
  "All the interactivity is vanilla JavaScript —
   no libraries, no frameworks. I used
   querySelector to select elements,
   classList to toggle CSS classes,
   and addEventListener to respond to clicks.
   These are the core DOM APIs every browser
   understands natively."
*/


/* ── 1. SMOOTH ACTIVE NAV LINK ──────────────────────────
   This watches which section is on screen using
   IntersectionObserver — a native browser API that
   fires a callback when an element enters or leaves
   the viewport. Much more efficient than listening
   to scroll events.
*/
document.addEventListener('DOMContentLoaded', () => {

  // Get all sections with an id attribute
  const sections = document.querySelectorAll('section[id]');

  // Get all nav links
  const navLinks = document.querySelectorAll('.nav-links a');

  /*
    IntersectionObserver watches elements and calls
    our function when they enter or leave the screen.
    threshold: 0.3 means 30% of the section must be
    visible before we mark it as active.
  */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove 'active' from all nav links
        navLinks.forEach(link => link.classList.remove('active'));

        // Add 'active' to the link matching this section's id
        const activeLink = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  // Start observing each section
  sections.forEach(section => observer.observe(section));

});


/* ── 2. STATS COUNTER ANIMATION ─────────────────────────
   When the hero section comes into view, the numbers
   count up from 0 to their target value.
   This creates a satisfying "loading" effect.
*/
function animateCounter(element, target, duration = 1500) {
  /*
    We use performance.now() for timing — more precise
    than setTimeout. requestAnimationFrame runs our
    function before the next screen repaint (60fps).
  */
  const start = performance.now();
  const startValue = 0;

  function update(currentTime) {
    // How far through the animation are we? (0 to 1)
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out: starts fast, slows down at the end
    // Math.sqrt creates a curve instead of linear
    const eased = 1 - Math.pow(1 - progress, 3);

    // Calculate current number
    const current = Math.round(startValue + (target - startValue) * eased);
    element.textContent = current + (element.dataset.suffix || '');

    // Keep going until progress reaches 1 (100%)
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Watch for the hero card to appear, then trigger counters
document.addEventListener('DOMContentLoaded', () => {
  const heroCard = document.querySelector('.hero-card');
  if (!heroCard) return;

  const statNums = document.querySelectorAll('.hc-stat .num');

  // Map each stat to its target number and suffix
  const targets = [
    { value: 8,   suffix: '+' },
    { value: 50,  suffix: '+' },
    { value: 4,   suffix: ''  },
    { value: 300, suffix: '+' },
  ];

  let animated = false;

  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true; // only run once
      statNums.forEach((el, i) => {
        if (targets[i]) {
          el.dataset.suffix = targets[i].suffix;
          // Stagger each counter by 150ms
          setTimeout(() => {
            animateCounter(el, targets[i].value);
          }, i * 150);
        }
      });
    }
  }, { threshold: 0.5 });

  heroObserver.observe(heroCard);
});


/* ── 3. SCROLL-IN ANIMATIONS ────────────────────────────
   Cards and sections fade in as you scroll down.
   We add a CSS class 'visible' when they enter
   the viewport, which triggers a CSS transition.

   The CSS for this is:
     .fade-in-card { opacity: 0; transform: translateY(20px); transition: all 0.4s; }
     .fade-in-card.visible { opacity: 1; transform: translateY(0); }
*/
document.addEventListener('DOMContentLoaded', () => {
  // Add fade-in-card class to animatable elements
  const animatables = document.querySelectorAll(
    '.value-card, .prod-card, .tl-item, .npi-box, .understanding-box'
  );

  animatables.forEach(el => el.classList.add('fade-in-card'));

  // Add the CSS dynamically so it doesn't need to be in the stylesheet
  const style = document.createElement('style');
  style.textContent = `
    .fade-in-card {
      opacity: 0;
      transform: translateY(16px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .fade-in-card.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .nav-links a.active {
      background: rgba(168, 85, 247, 0.2);
      color: #C084FC;
    }
  `;
  document.head.appendChild(style);

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        cardObserver.unobserve(entry.target); // stop watching once visible
      }
    });
  }, { threshold: 0.1 });

  animatables.forEach(el => cardObserver.observe(el));
});


/* ── 4. COPY EMAIL TO CLIPBOARD ─────────────────────────
   When someone clicks the email pill, copies
   the email address and shows a brief confirmation.
*/
document.addEventListener('DOMContentLoaded', () => {
  const emailPill = document.querySelector('.contact-pill a[href^="mailto"]');
  if (!emailPill) return;

  emailPill.addEventListener('click', (e) => {
    e.preventDefault(); // don't open mail app
    navigator.clipboard.writeText('sp.homami@gmail.com').then(() => {
      const original = emailPill.textContent;
      emailPill.textContent = 'Copied!';
      emailPill.style.color = '#9DCC3C';
      setTimeout(() => {
        emailPill.textContent = original;
        emailPill.style.color = '';
      }, 2000);
    });
  });
});


/* ── 5. SCHEDULE TABLE ROW HOVER ────────────────────────
   Adds a subtle glow effect to table rows on hover.
   We do this in JS instead of CSS because the tables
   use inline styles and we can't easily add hover
   pseudo-selectors to them.
*/
document.addEventListener('DOMContentLoaded', () => {
  const tableRows = document.querySelectorAll('tbody tr');

  tableRows.forEach(row => {
    row.style.transition = 'background 0.2s';
    row.style.cursor = 'default';

    row.addEventListener('mouseenter', () => {
      row.style.background = 'rgba(168, 85, 247, 0.06)';
    });

    row.addEventListener('mouseleave', () => {
      row.style.background = '';
    });
  });
});
