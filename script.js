/* ============================================
   BENU — Portfolio JavaScript (Complete Fix)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Custom Cursor ──────────────────── */
  const cursorDot     = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  if (cursorDot && cursorOutline) {
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    const LERP = 0.12;

    // Force visible (Firefox fix)
    cursorDot.style.display     = 'block';
    cursorOutline.style.display = 'block';

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top  = `${mouseY}px`;
    });

    function animateCursor() {
      outlineX += (mouseX - outlineX) * LERP;
      outlineY += (mouseY - outlineY) * LERP;
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top  = `${outlineY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('.hover-target').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity     = '0';
      cursorOutline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity     = '1';
      cursorOutline.style.opacity = '1';
    });
  }

  /* ── 2. Mobile Menu ────────────────────── */
  const hamburger   = document.querySelector('.nav-hamburger');
  const mobileMenu  = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const path = hamburger.querySelector('path');
    path.setAttribute('d', menuOpen
      ? 'M6 18L18 6M6 6l12 12'
      : 'M4 6h16M4 12h16M4 18h16'
    );
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => { if (menuOpen) toggleMenu(); });
    });
  }

  /* ── 3. Text Scramble Effect ───────────── */
  class TextScramble {
    constructor(el) {
      this.el    = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length  = Math.max(oldText.length, newText.length);
      return new Promise(resolve => {
        this.resolve = resolve;
        this.queue   = [];
        this.frame   = 0;
        for (let i = 0; i < length; i++) {
          const from  = oldText[i] || '';
          const to    = newText[i] || '';
          const start = Math.floor(Math.random() * 40);
          const end   = start + Math.floor(Math.random() * 40);
          this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.update();
      });
    }

    update() {
      let output = '', complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span style="color:#a855f7">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  document.querySelectorAll('.scramble-text').forEach(el => {
    const fx           = new TextScramble(el);
    const originalText = el.getAttribute('data-text') || el.innerText;
    el.addEventListener('mouseenter', () => fx.setText(originalText));
  });

  /* ── 4. Scroll Reveal ──────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── 5. Magnetic Buttons ───────────────── */
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x    = e.clientX - rect.left - rect.width  / 2;
      const y    = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });

  /* ── 6. Smooth Scroll ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── 7. Active Nav Link on Scroll ─────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.style.opacity = link.getAttribute('href').slice(1) === entry.target.id ? '1' : '0.5';
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── 8. Toast Notification ─────────────── */
  function showToast(message, type = 'success') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success'
          ? '<polyline points="20 6 9 17 4 12"/>'
          : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  /* ── 9. Contact Form ───────────────────── */
  const form         = document.querySelector('.contact-form');
  const emailInput   = form?.querySelector('[name="email"]');
  const messageInput = form?.querySelector('[name="message"]');
  const submitBtn    = form?.querySelector('.submit-btn');

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function setFieldError(input, hasError) {
    input.classList.toggle('error', hasError);
  }

  function clearErrors() {
    form.querySelectorAll('.form-input, .form-textarea')
      .forEach(el => el.classList.remove('error'));
  }

  function setLoading(loading) {
    submitBtn.classList.toggle('loading', loading);
    submitBtn.disabled = loading;
  }

  if (form) {
    [emailInput, messageInput].forEach(input => {
      input?.addEventListener('input', () => input.classList.remove('error'));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      let valid = true;

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        setFieldError(emailInput, true);
        valid = false;
      }

      if (!messageInput.value.trim()) {
        setFieldError(messageInput, true);
        valid = false;
      }

      if (!valid) {
        showToast('Please fix the errors above.', 'error');
        return;
      }

      setLoading(true);

      try {
        const res = await fetch('/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email:   emailInput.value,
            message: messageInput.value
          })
        });

        if (!res.ok) throw new Error('Failed');

        form.reset();
        showToast("Message sent! I'll get back to you soon 🚀", 'success');
      } catch (err) {
        console.error(err);
        showToast('Something went wrong. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    });
  }

  /* ── 10. Navbar Scroll Blur ────────────── */
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.background     = 'rgba(10,10,10,0.7)';
      nav.style.mixBlendMode   = 'normal';
    } else {
      nav.style.backdropFilter = 'none';
      nav.style.background     = 'transparent';
      nav.style.mixBlendMode   = 'difference';
    }
  }, { passive: true });

  /* ── 11. Page Load Reveal (Firefox safe) ── */
  function triggerVisibleReveals() {
    document.querySelectorAll('.reveal').forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => el.classList.add('active'), i * 100);
      }
    });
  }

  triggerVisibleReveals();
  setTimeout(triggerVisibleReveals, 300);
  setTimeout(triggerVisibleReveals, 800);

});
