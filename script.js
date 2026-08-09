/**
 * IEDC-CETLY Main Script
 * Handles anime.js scroll animations, line leading growth, and modal interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

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
      targets: '.hero-buttons .btn',
      translateY: [15, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 600
    }, '-=400');

  // 3. Scroll Line, Mission & Team Reveal Animation
  const scrollLine = document.getElementById('scroll-line');
  let missionAnimated = false;
  let teamAnimated = false;

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);

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
          delay: anime.stagger(120, { start: 100 }),
          duration: 800,
          easing: 'easeOutCubic'
        });
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // 4. Modal Interactions
  const modalEvents = document.getElementById('modal-events');
  const modalContact = document.getElementById('modal-contact');
  const modalJoin = document.getElementById('modal-join');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
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
      }
    });
  }

  // Button triggers (event listeners removed for Events, Contact, and Join Us buttons)

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

  // 5. Back to Top Smooth Scroll
  document.getElementById('scroll-top')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
