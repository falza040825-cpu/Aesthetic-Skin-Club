/* =========================================
   AESTHETIC SKIN CLUB – APP.JS
   Ultra-Luxury Booking System & Interactivity
   ========================================= */

'use strict';

// ---- DOM Utility Helpers ----
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

// ---- Navbar Scroll Visual Effect ----
const navbar = $('#navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ---- Mobile Nav Toggle ----
const navToggle = $('#navToggle');
const navLinks  = $('#navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = $$('span', navToggle);
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close navigation menu upon link selection
  $$('.nav-link').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    $$('span', navToggle).forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));
}

// ---- Smooth Scroll for Anchor Links ----
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (target) {
    e.preventDefault();
    const offset = 85;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
});

// ---- Hero Particle Animation (Champagne & Foil Gold Tones) ----
function createParticles() {
  const container = $('#particles');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size   = Math.random() * 3.5 + 2;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 8;
    const dur    = Math.random() * 12 + 8;
    const color  = ['#C5A059','#E5C98B','#D4AF37','#9E7B35','#2A538C','#1E3E6B'][Math.floor(Math.random() * 6)];
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%; bottom:-10px;
      background:${color};
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ---- Service Category Tabs ----
function initTabs() {
  const tabs     = $$('.tab-btn');
  const contents = $$('.tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const content = $(`#tab${capitalize(target)}-content`);
      if (content) content.classList.add('active');
    });
  });
}

window.switchTab = function(tabId) {
  const tab = $(`.tab-btn[data-tab="${tabId}"]`);
  if (tab) tab.click();
  const el = document.getElementById('services');
  if (el) {
    setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - 85;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 50);
  }
};
initTabs();

// ---- Testimonials Drag & Scroll System ----
function initTestimonials() {
  const track = $('#testimonialsTrack');
  if (!track) return;
  let isDragging = false, startX, scrollLeft;

  track.addEventListener('mousedown', e => {
    isDragging = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX);
  });
  ['mouseup', 'mouseleave'].forEach(ev => {
    track.addEventListener(ev, () => {
      isDragging = false;
      track.style.cursor = 'grab';
    });
  });

  // Dots indicator creation
  const cards    = $$('.testi-card', track);
  const dotsWrap = $('#testiDots');
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = i === 0 ? 'dot active' : 'dot';
    dot.addEventListener('click', () => {
      const card = cards[i];
      track.scrollTo({ left: card.offsetLeft - 24, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });

  // Update dots state on scroll
  track.addEventListener('scroll', () => {
    const scrollPos = track.scrollLeft;
    const cardW     = cards[0].offsetWidth + 28;
    const idx       = Math.round(scrollPos / cardW);
    $$('.dot', dotsWrap).forEach((dot, i) => dot.classList.toggle('active', i === idx));
  }, { passive: true });
}
initTestimonials();

// ---- Intersection Observer Scroll Reveal ----
function initReveal() {
  const els = $$('.wa-card, .service-card, .exp-item, .promo-card, .testi-card, .location-card, .perk, .pillar-card');
  els.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal').forEach(el => observer.observe(el));
}
initReveal();

// ---- Booking Form Validation & WhatsApp Routing ----
const bookingForm = $('#bookingForm');
const fields      = {
  bookName:    { error: '#nameError',    msg: 'Nama lengkap wajib diisi.' },
  bookPhone:   { error: '#phoneError',   msg: 'Nomor WhatsApp wajib diisi.' },
  bookBranch:  { error: '#branchError',  msg: 'Silakan pilih cabang.' },
  bookService: { error: '#serviceError', msg: 'Silakan pilih treatment.' },
  bookDate:    { error: '#dateError',    msg: 'Tanggal kunjungan wajib diisi.' },
  bookTime:    { error: '#timeError',    msg: 'Silakan pilih jam kunjungan.' },
};

function validatePhone(phone) {
  return /^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(phone.replace(/\s|-/g, ''));
}

function showError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  const error = $(fields[fieldId].error);
  if (field) field.classList.add('error');
  if (error) error.textContent = msg;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const error = $(fields[fieldId].error);
  if (field) field.classList.remove('error');
  if (error) error.textContent = '';
}

// Live validation on blur
Object.keys(fields).forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('blur', () => {
    if (!el.value.trim()) {
      showError(id, fields[id].msg);
    } else {
      if (id === 'bookPhone' && !validatePhone(el.value)) {
        showError(id, 'Format nomor WhatsApp tidak valid.');
      } else {
        clearError(id);
      }
    }
  });
  el.addEventListener('input', () => clearError(id));
});

// Set min date = today
const dateInput = $('#bookDate');
if (dateInput) {
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

// Form submit → WhatsApp redirect
if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.keys(fields).forEach(id => {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) {
        showError(id, fields[id].msg);
        valid = false;
      } else if (id === 'bookPhone' && !validatePhone(el.value)) {
        showError(id, 'Format nomor WhatsApp tidak valid.');
        valid = false;
      } else {
        clearError(id);
      }
    });

    if (!valid) {
      const firstError = bookingForm.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Build booking payload
    const name    = document.getElementById('bookName').value.trim();
    const phone   = document.getElementById('bookPhone').value.trim();
    const branch  = document.getElementById('bookBranch').value;
    const service = document.getElementById('bookService').value;
    const date    = document.getElementById('bookDate').value;
    const time    = document.getElementById('bookTime').value;
    const notes   = document.getElementById('bookNotes').value.trim();

    // Format date string
    const dateObj   = new Date(date + 'T12:00:00');
    const dateStr   = dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const branchWA  = branch.includes('Kebon Jeruk') ? '6285799200800' : '6285810004006';

    // Build WA message
    const msg = [
      `✨ *RESERVASI VIP – AESTHETIC SKIN CLUB*`,
      ``,
      `👤 *Nama Pasien:* ${name}`,
      `📱 *No. WhatsApp:* ${phone}`,
      `🏥 *Cabang:* ASC ${branch}`,
      `💆 *Treatment Choice:* ${service}`,
      `📅 *Tanggal Kunjungan:* ${dateStr}`,
      `⏰ *Waktu:* ${time} WIB`,
      notes ? `📝 *Catatan Khusus:* ${notes}` : '',
      ``,
      `_Mohon konfirmasi slot jadwal kedatangan. Terima kasih!_`,
    ].filter(Boolean).join('\n');

    // Show success modal
    const modalService = $('#modalService');
    if (modalService) modalService.textContent = service;
    showModal();

    // Open WhatsApp after brief delay
    setTimeout(() => {
      const waUrl = `https://wa.me/${branchWA}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    }, 800);

    bookingForm.reset();
  });
}

// ---- Booking Confirmation Modal System ----
const bookingModal = $('#bookingModal');
const modalClose   = $('#modalClose');
const modalConfirm = $('#modalConfirm');

function showModal() {
  if (!bookingModal) return;
  bookingModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideModal() {
  if (!bookingModal) return;
  bookingModal.classList.remove('active');
  document.body.style.overflow = '';
}

if (modalClose)   modalClose.addEventListener('click', hideModal);
if (modalConfirm) modalConfirm.addEventListener('click', hideModal);
if (bookingModal) {
  bookingModal.addEventListener('click', e => { if (e.target === bookingModal) hideModal(); });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });

// ---- Open Booking Modal & Focus Form from Cards ----
window.openBookingModal = function(serviceName) {
  const serviceSelect = $('#bookService');
  const branchSelect  = $('#bookBranch');
  if (serviceSelect) {
    const opt = [...serviceSelect.options].find(o => o.value === serviceName);
    if (opt) serviceSelect.value = serviceName;
    if (branchSelect && !branchSelect.value) branchSelect.value = 'Kebon Jeruk';
  }
  const bookingSec = document.getElementById('booking');
  if (bookingSec) {
    const top = bookingSec.getBoundingClientRect().top + window.scrollY - 85;
    window.scrollTo({ top, behavior: 'smooth' });
    setTimeout(() => document.getElementById('bookName')?.focus(), 600);
  }
};

// ---- Helper Utilities ----
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---- Active Nav Link on Scroll Observer ----
function initActiveNav() {
  const sections = $$('section[id]');
  const navLinkEls = $$('.nav-link:not(.nav-cta)');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkEls.forEach(link => {
          const href = link.getAttribute('href');
          const isCurrent = href === `#${id}`;
          if (isCurrent) {
            link.style.color = 'var(--gold-bright)';
            link.style.background = 'rgba(212, 175, 55, 0.28)';
            link.style.borderColor = 'rgba(212, 175, 55, 0.5)';
          } else {
            link.style.color = '#FFFFFF';
            link.style.background = '';
            link.style.borderColor = '';
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
}
initActiveNav();

// ---- Hero Image Fallback ----
const heroImgWrap = $('.hero-img-wrap');
const heroImg     = $('.hero-img');
if (heroImg && heroImgWrap) {
  heroImg.onerror = () => {
    heroImg.style.display = 'none';
    heroImgWrap.style.background = 'linear-gradient(135deg, #0F2E28 0%, #051411 100%)';
    heroImgWrap.innerHTML += `
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:24px;">
        <div style="width:64px;height:64px;border-radius:16px;background:rgba(197,160,89,0.15);border:1px solid #C5A059;display:flex;align-items:center;justify-content:center;color:#E5C98B;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div style="text-align:center;color:#E5C98B;">
          <div style="font-family:'Cormorant Garamond',serif;font-size:1.85rem;font-weight:600">Aesthetic Skin Club</div>
          <div style="font-size:0.875rem;opacity:0.8;margin-top:4px">Kebon Jeruk · Jakarta Barat</div>
        </div>
      </div>
    `;
  };
}

// ---- FAQ Accordion Toggle ----
window.toggleFaq = function(id) {
  const item = document.getElementById(id);
  if (!item) return;
  const isOpen = item.classList.contains('open');
  $$('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) {
    item.classList.add('open');
    const btn = item.querySelector('.faq-question');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
};

// ---- Back to Top Button ----
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
initBackToTop();

// ---- Stats Counter Animation ----
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const start    = Date.now();
  const isLarge  = target > 100;

  function update() {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = (isLarge ? current.toLocaleString('id-ID') : current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = (isLarge ? target.toLocaleString('id-ID') : target) + suffix;
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = $$('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
initCounters();

console.log('%c✨ Aesthetic Skin Club Kebon Jeruk – Luxury Edition', 'color:#C5A059;font-size:16px;font-weight:bold');
console.log('%cBeauty backed up by passion and medical science', 'color:#E5C98B;font-size:12px');
