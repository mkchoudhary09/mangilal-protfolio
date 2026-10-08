/**
 * Mangilal Choudhary - Portfolio Interactive Scripts
 * Warm Creative Theme & Interactive Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year in Footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Toast Notification Helper
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout = null;

  function showToast(message, duration = 3500) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // 3. Theme Toggle (Warm Light <-> Warm Dark)
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('mc_theme') || 'warm-light';

  // Apply saved theme
  body.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'warm-light' ? 'warm-dark' : 'warm-light';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('mc_theme', newTheme);
      showToast(newTheme === 'warm-dark' ? '🌙 Warm Twilight mode enabled' : '☀️ Warm Day mode enabled', 2000);
    });
  }

  // 4. Mobile Navigation Drawer Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    if (!menuToggle || !mobileNav) return;
    const isOpen = menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
  }

  function closeMobileMenu() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.classList.remove('active');
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile nav on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // 5. Active Navigation Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // 6. Copy Email Quick Actions
  const officialEmail = 'mangilal.26bcon2367@jecrcu.edu.in';
  const quickSnippet = document.getElementById('quick-copy-snippet');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  function copyEmailToClipboard() {
    navigator.clipboard.writeText(officialEmail).then(() => {
      showToast('📋 Email copied to clipboard: ' + officialEmail);
    }).catch(() => {
      // Fallback
      const tempInput = document.createElement('input');
      tempInput.value = officialEmail;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('📋 Email copied: ' + officialEmail);
    });
  }

  if (quickSnippet) {
    quickSnippet.addEventListener('click', copyEmailToClipboard);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', copyEmailToClipboard);
  }

  // 7. Interactive Contact Form with Validation & Feedback
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('sender-name');
  const emailInput = document.getElementById('sender-email');
  const subjectInput = document.getElementById('sender-subject');
  const messageInput = document.getElementById('sender-message');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');
  const mailtoFallbackBtn = document.getElementById('mailto-fallback-btn');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function clearError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('has-error');
    }
  }

  function setError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('has-error');
    }
  }

  // Clear errors dynamically on input
  [nameInput, emailInput, messageInput].forEach(field => {
    if (field) {
      field.addEventListener('input', () => clearError(field));
    }
  });

  // Dynamically update mailto fallback href when inputs change
  function updateMailtoLink() {
    if (!mailtoFallbackBtn) return;
    const name = encodeURIComponent(nameInput ? nameInput.value.trim() : '');
    const subject = encodeURIComponent((subjectInput && subjectInput.value.trim()) || 'Inquiry from Portfolio');
    const msg = encodeURIComponent(
      (messageInput ? messageInput.value.trim() : '') +
      (name ? `\n\nFrom: ${decodeURIComponent(name)}` : '')
    );
    mailtoFallbackBtn.href = `mailto:${officialEmail}?subject=${subject}&body=${msg}`;
  }

  [nameInput, subjectInput, messageInput].forEach(field => {
    if (field) {
      field.addEventListener('input', updateMailtoLink);
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const messageVal = messageInput.value.trim();

      if (!nameVal) {
        setError(nameInput);
        isValid = false;
      }

      if (!emailVal || !validateEmail(emailVal)) {
        setError(emailInput);
        isValid = false;
      }

      if (!messageVal) {
        setError(messageInput);
        isValid = false;
      }

      if (!isValid) {
        showToast('⚠️ Please fill in all required fields properly');
        return;
      }

      // Button loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;

      // Simulate sending with realistic network latency
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Show success notification and card
        if (formFeedback) {
          formFeedback.classList.remove('hidden');
        }

        showToast('🎉 Message sent successfully! Mangilal will get back to you.', 4500);

        // Optionally store locally or open mailto if preferred
        updateMailtoLink();

        // Reset form inputs
        contactForm.reset();

        // Scroll smoothly to feedback
        if (formFeedback) {
          formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 1000);
    });
  }

  // 8. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.6';
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 9. Smooth Scroll for all in-page links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
