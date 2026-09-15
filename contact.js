/**
 * IEDC-CETLY Contact — page logic
 * --------------------------------------------------------------------------
 * 1. FAQ accordion (content driven by the FAQ_ITEMS array below).
 * 2. Contact form validation + submission (backend handled separately —
 *    see CONTACT_CONFIG).
 * 3. Shared page chrome (mobile nav drawer + back-to-top), mirroring
 *    script.js / events.js so this page behaves like the rest of the site.
 */

/* ==========================================================================
   FAQ CONTENT — edit this array to change, add or remove questions.
   Each item needs only a `q` (question) and an `a` (answer). The accordion
   component renders automatically; no HTML changes required.
   Content is adapted from the IEDC FAQ document (KSUM / NewGen IEDC).
   ========================================================================== */
const FAQ_ITEMS = [
  {
    q: 'What is IEDC?',
    a: 'IEDC stands for Innovation and Entrepreneurship Development Centre — a platform established in educational institutions to promote innovation and entrepreneurship among students and faculty. Across Kerala, IEDCs run under the Kerala Startup Mission (KSUM).',
  },
  {
    q: 'What is IEDC at College of Engineering Thalassery?',
    a: 'IEDC CETLY is the college\'s innovation cell — a platform for academicians, entrepreneurs and students to gather, learn and share entrepreneurial experiences. It motivates technology graduates to take up entrepreneurship as a career and runs a Technology Business Incubator (TBI) to support student tech start-ups.',
  },
  {
    q: 'What are the main objectives of IEDC?',
    a: 'To promote a culture of innovation and entrepreneurship among students, transform students from "job-seekers" into "job-generators", support start-up creation through guidance and mentorship, and build close links between industry and the institute.',
  },
  {
    q: 'Who can benefit from IEDC?',
    a: 'Students, faculty members, aspiring entrepreneurs, student teams with innovative project ideas, and start-ups from educational institutions.',
  },
  {
    q: 'What activities does IEDC conduct?',
    a: 'Expert talks on entrepreneurship, interaction sessions with successful founders, hands-on workshops (software development, IoT, robotics, web design, marketing), ideation and design-thinking workshops, business plan competitions, hackathons and industrial visits.',
  },
  {
    q: 'Does IEDC provide financial support for student projects?',
    a: 'Yes. Kerala IEDCs provide seed funding of up to ₹1 lakh for technology-oriented, innovative business ideas, and NewGen IEDC offers prototype development grants of ₹2.50 lakh per project covering mentor guidance, student stipends and prototype development costs.',
  },
  {
    q: 'What facilities does CET IEDC provide?',
    a: 'Computers and network facilities, printing and copying, a discussion room, laboratory facilities and technical backup from faculty expertise — plus a Technology Business Incubator (TBI) to help student tech start-ups get off the ground.',
  },
  {
    q: 'Where can I find more information about IEDC?',
    a: 'For the latest programmes and announcements, visit the Kerala Startup Mission IEDC portal (startupmission.kerala.gov.in/iedc) or the CET Thalassery IEDC page (cethalassery.ac.in/iedc.php). For direct queries, use the contact details on this page.',
  },
];

/* ==========================================================================
   CONTACT FORM CONFIG — the backend is being handled separately.
   Set `endpoint` to the contact API URL to activate real submission
   (e.g. 'api/contact'). While it stays empty, the form is validate-only:
   inputs are checked and errors shown, but nothing is submitted.
   Expected POST body: JSON { name, email, subject, message }.
   Success = any 2xx response; anything else surfaces the error state.
   ========================================================================== */
const CONTACT_CONFIG = {
  endpoint: '', // e.g. 'api/contact'
};

/* ==========================================================================
   Submission helper — mirrors submitRegistration() in events.js
   ========================================================================== */

async function submitMessage({ name, email, subject, message }) {
  const res = await fetch(CONTACT_CONFIG.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ name, email, subject, message }),
  });
  if (!res.ok) {
    let serverMessage = '';
    try { serverMessage = (await res.json()).message || ''; } catch (_) { /* non-JSON error body */ }
    throw new Error(serverMessage || `Message request failed (HTTP ${res.status})`);
  }
  try { return await res.json(); } catch (_) { return {}; }
}

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------
   * Mobile navigation drawer (mirrors script.js / events.js)
   * ------------------------------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const navActions = document.getElementById('nav-actions');

  if (navToggle && navActions) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navActions.classList.toggle('active');
    });

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

  /* ------------------------------------------------------------------
   * Back to top
   * ------------------------------------------------------------------ */
  const scrollTop = document.getElementById('scroll-top');
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
   * FAQ accordion
   * ------------------------------------------------------------------ */
  const faqList = document.getElementById('faq-list');

  function renderFaq() {
    if (!faqList) return;

    FAQ_ITEMS.forEach((item, index) => {
      const wrap = document.createElement('div');
      wrap.className = 'faq-item';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'faq-question font-mono';
      btn.id = `faq-btn-${index}`;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', `faq-panel-${index}`);
      btn.innerHTML =
        `<span>${item.q}</span><span class="faq-icon" aria-hidden="true">+</span>`;

      const panel = document.createElement('div');
      panel.className = 'faq-answer';
      panel.id = `faq-panel-${index}`;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', `faq-btn-${index}`);
      panel.innerHTML = `<div class="faq-answer-inner"><p>${item.a}</p></div>`;

      btn.addEventListener('click', () => {
        const isOpen = wrap.classList.contains('open');
        // Single-open accordion: close every other item first.
        faqList.querySelectorAll('.faq-item.open').forEach(other => {
          if (other !== wrap) {
            other.classList.remove('open');
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });
        wrap.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
      });

      // Escape closes an open item (WAI-ARIA accordion pattern).
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && wrap.classList.contains('open')) {
          wrap.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          btn.focus();
        }
      });

      wrap.append(btn, panel);
      faqList.appendChild(wrap);
    });
  }

  renderFaq();

  /* ------------------------------------------------------------------
   * Scroll reveals (IntersectionObserver + CSS — mirrors events-page.js)
   * ------------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(en => en.target.classList.toggle('in-view', en.isIntersecting));
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------
   * Contact form — validation + submission
   * ------------------------------------------------------------------ */
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('contact-submit');
  const viewForm = form;
  const viewSuccess = document.getElementById('contact-view-success');
  const viewError = document.getElementById('contact-view-error');
  const successAgain = document.getElementById('contact-success-again');
  const errorRetry = document.getElementById('contact-error-retry');
  const errorMsg = document.getElementById('contact-error-msg');

  const fields = {
    name: document.getElementById('contact-name'),
    email: document.getElementById('contact-email'),
    subject: document.getElementById('contact-subject'),
    message: document.getElementById('contact-message'),
  };
  const errs = {
    name: document.getElementById('err-name'),
    email: document.getElementById('err-email'),
    subject: document.getElementById('err-subject'),
    message: document.getElementById('err-message'),
  };

  function clearFieldError(field) {
    fields[field].classList.remove('invalid');
    errs[field].textContent = '';
  }

  function setFieldError(field, message) {
    fields[field].classList.add('invalid');
    errs[field].textContent = message;
    return false;
  }

  function validate() {
    let ok = true;
    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const subject = fields.subject.value.trim();
    const message = fields.message.value.trim();

    if (!name) ok = setFieldError('name', 'NAME IS REQUIRED');
    else clearFieldError('name');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ok = setFieldError('email', 'ENTER A VALID EMAIL ADDRESS');
    else clearFieldError('email');

    if (!subject) ok = setFieldError('subject', 'SUBJECT IS REQUIRED');
    else clearFieldError('subject');

    if (!message) ok = setFieldError('message', 'MESSAGE IS REQUIRED');
    else clearFieldError('message');

    return ok;
  }

  function resetToForm() {
    form.hidden = false;
    viewSuccess.hidden = true;
    viewError.hidden = true;
    form.reset();
    clearFieldError('name');
    clearFieldError('email');
    clearFieldError('subject');
    clearFieldError('message');
  }

  function showSuccess() {
    document.getElementById('contact-success-email').textContent = fields.email.value.trim();
    form.hidden = true;
    viewError.hidden = true;
    viewSuccess.hidden = false;
    viewSuccess.focus();
  }

  function showError(message) {
    errorMsg.textContent = message || 'SOMETHING WENT WRONG. PLEASE TRY AGAIN.';
    form.hidden = true;
    viewSuccess.hidden = true;
    viewError.hidden = false;
    viewError.focus();
  }

  // Clear an error as soon as the user starts fixing that field.
  Object.keys(fields).forEach(field => {
    fields[field].addEventListener('input', () => {
      if (fields[field].classList.contains('invalid')) clearFieldError(field);
    });
  });

  if (successAgain) successAgain.addEventListener('click', resetToForm);
  if (errorRetry) errorRetry.addEventListener('click', resetToForm);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Backend not connected yet — the form is validate-only until
    // CONTACT_CONFIG.endpoint is set. No submission happens here.
    if (!CONTACT_CONFIG.endpoint) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'SENDING…';
    try {
      await submitMessage({
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        subject: fields.subject.value.trim(),
        message: fields.message.value.trim(),
      });
      showSuccess();
    } catch (err) {
      console.error('Message submission failed:', err);
      showError(err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'SEND MESSAGE →';
    }
  });
});