/**
 * Luminary – script.js
 * Handles: mobile nav, sticky header, scroll-reveal, form validation
 * Vanilla JS · No frameworks · Accessible
 */

'use strict';

/* ── 1. DOM REFERENCES ──────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mainNav    = document.getElementById('main-nav');
const siteHeader = document.querySelector('.site-header');
const contactForm = document.getElementById('contact-form');

/* ── 2. MOBILE NAVIGATION TOGGLE ───────────────────────────── */
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));

    // Trap / release scroll when nav is open on mobile
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  mainNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      mainNav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
      mainNav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
      document.body.style.overflow = '';
    }
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (
      mainNav.classList.contains('is-open') &&
      !mainNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      mainNav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ── 3. STICKY HEADER SHADOW ────────────────────────────────── */
if (siteHeader) {
  const handleHeaderScroll = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run once on load
}

/* ── 4. SCROLL REVEAL (IntersectionObserver) ────────────────── */
const revealElements  = document.querySelectorAll('.reveal');
const staggerElements = document.querySelectorAll('.reveal-stagger');

// Combine all observed elements
const allRevealTargets = [...revealElements, ...staggerElements];

if ('IntersectionObserver' in window && allRevealTargets.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  allRevealTargets.forEach((el) => revealObserver.observe(el));
} else {
  // Fallback: show everything if IntersectionObserver isn't supported
  allRevealTargets.forEach((el) => el.classList.add('visible'));
}

/* ── 5. CONTACT FORM VALIDATION ─────────────────────────────── */
if (contactForm) {

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (val) => val.trim().length >= 2 ? '' : 'Please enter your full name (min 2 characters).',
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ? '' : 'Please enter a valid email address.',
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (val) => val.trim().length >= 10 ? '' : 'Please write a message (min 10 characters).',
    },
  };

  /**
   * Validate a single field.
   * Returns true if valid, false if not.
   */
  function validateField(fieldKey) {
    const field  = fields[fieldKey];
    const value  = field.input.value;
    const errMsg = field.validate(value);

    if (errMsg) {
      field.input.classList.add('invalid');
      field.input.setAttribute('aria-invalid', 'true');
      field.error.textContent = errMsg;
      return false;
    } else {
      field.input.classList.remove('invalid');
      field.input.removeAttribute('aria-invalid');
      field.error.textContent = '';
      return true;
    }
  }

  // Live validation on blur
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('blur', () => validateField(key));

    // Clear error as the user starts typing
    fields[key].input.addEventListener('input', () => {
      if (fields[key].input.classList.contains('invalid')) {
        validateField(key);
      }
    });
  });

  // Submit handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const allValid = Object.keys(fields).map(validateField).every(Boolean);

    if (!allValid) {
      // Focus first invalid field
      const firstInvalid = contactForm.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // ── Simulate successful form submission ──
    const submitBtn  = contactForm.querySelector('.btn-submit');
    const btnLabel   = submitBtn.querySelector('.btn-label');
    const btnSuccess = submitBtn.querySelector('.btn-success');

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    btnLabel.textContent = 'Sending…';

    setTimeout(() => {
      btnLabel.hidden = true;
      btnSuccess.hidden = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.background = '#4caf6e';

      // Reset form after delay
      setTimeout(() => {
        contactForm.reset();
        btnLabel.hidden = false;
        btnLabel.textContent = 'Send Message';
        btnSuccess.hidden = true;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 3000);

    }, 1200);
  });
}

/* ── 6. SMOOTH SCROLL POLYFILL ──────────────────────────────── */
// CSS scroll-behavior handles it for modern browsers.
// This covers anchor clicks for any browser that doesn't support it.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;

    // If browser already supports smooth scroll natively, let CSS handle it
    if ('scrollBehavior' in document.documentElement.style) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── 7. APPLY REVEAL CLASSES TO SECTIONS ───────────────────── */
// Called after DOM is ready; adds .reveal / .reveal-stagger to sections
// so the CSS animation fires on scroll.
(function addRevealClasses() {
  const targets = [
    { selector: '.hero-content',          cls: 'reveal' },
    { selector: '.about-text',            cls: 'reveal' },
    { selector: '.about-stats',           cls: 'reveal-stagger' },
    { selector: '.services-grid',         cls: 'reveal-stagger' },
    { selector: '.work-grid',             cls: 'reveal-stagger' },
    { selector: '.testimonials-grid',     cls: 'reveal-stagger' },
    { selector: '.contact-text',          cls: 'reveal' },
    { selector: '.contact-form',          cls: 'reveal' },
  ];

  targets.forEach(({ selector, cls }) => {
    const el = document.querySelector(selector);
    if (el) el.classList.add(cls);
  });

  // Re-initialise observer for newly tagged elements
  if ('IntersectionObserver' in window) {
    const newTargets = document.querySelectorAll('.reveal:not(.visible), .reveal-stagger:not(.visible)');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    newTargets.forEach((el) => observer.observe(el));
  }
})();