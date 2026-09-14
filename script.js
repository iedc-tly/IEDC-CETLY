/**
 * IEDC-CETLY Main Script
 * Handles anime.js scroll animations, line leading growth, mobile nav drawer, and modal interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Navigation Toggle Logic
  const navToggle = document.getElementById('nav-toggle');
  const navActions = document.getElementById('nav-actions');

  if (navToggle && navActions) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navActions.classList.toggle('active');
    });

    // Close menu when clicking navigation links inside mobile drawer
    navActions.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.classList.remove('active');
          navActions.classList.remove('active');
        }
      });
    });
  }

  // 2. Hero Section Entrance Animation with Anime.js
  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '.navbar',
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 800
    })
    .add({
      targets: '.frame-container',
      scale: [0.96, 1],
      opacity: [0, 1],
      duration: 900
    }, '-=400')
    .add({
      targets: '.hero-quote',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 700
    }, '-=500')
    .add({
      targets: '.hero-description',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 700
    }, '-=500')
    .add({
      targets: '.hero-events-wrapper',
      translateY: [25, 0],
      opacity: [0, 1],
      duration: 750
    }, '-=450');

  // 3. Scroll Line, Mission & Team Reveal Animation
  const scrollLine = document.getElementById('scroll-line');
  let missionAnimated = false;
  let teamAnimated = false;

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;

    // Animate line leading height fill
    if (scrollLine) {
      scrollLine.style.height = `${Math.min(scrollPercent * 3.5, 100)}%`;
    }

    // Trigger Mission section stagger animation when scrolled into view
    const missionSection = document.getElementById('mission-section');
    if (missionSection && !missionAnimated) {
      const rect = missionSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.8) {
        missionAnimated = true;
        
        anime({
          targets: '.mission-card',
          translateY: [40, 0],
          opacity: [0, 1],
          delay: anime.stagger(150, { start: 100 }),
          duration: 800,
          easing: 'easeOutCubic'
        });
      }
    }

    // Trigger Team section stagger animation when scrolled into view
    const teamSection = document.getElementById('team-section');
    if (teamSection && !teamAnimated) {
      const rect = teamSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.75) {
        teamAnimated = true;
        
        anime({
          targets: '.team-card',
          translateY: [40, 0],
          opacity: [0, 1],
          delay: anime.stagger(100, { start: 100 }),
          duration: 800,
          easing: 'easeOutCubic'
        });
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // 4. Modal Interactions
  const modalEvents = document.getElementById('modal-events');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    anime({
      targets: modal.querySelector('.modal-card'),
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutCubic'
    });
  }

  function closeModal(modal) {
    if (!modal) return;
    anime({
      targets: modal.querySelector('.modal-card'),
      scale: [1, 0.9],
      opacity: [1, 0],
      duration: 200,
      easing: 'easeInCubic',
      complete: () => {
        modal.classList.remove('active');
        if (!document.querySelector('.modal-overlay.active')) {
          document.body.classList.remove('modal-open');
        }
      }
    });
  }

  // Attach Event Listeners to Open Modals
  document.getElementById('btn-events')?.addEventListener('click', () => openModal(modalEvents));

  document.querySelectorAll('.open-events').forEach(btn => {
    btn.addEventListener('click', () => openModal(modalEvents));
  });

  // Close buttons & overlay click
  document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Close modals on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });

  // 5. Back to Top Smooth Scroll
  document.getElementById('scroll-top')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
