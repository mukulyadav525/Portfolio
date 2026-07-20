// ── Year ──────────────────────────────────────────────
document.getElementById('yr').textContent = new Date().getFullYear();


// ── Progress bar ──────────────────────────────────────
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  prog.style.width = pct + '%';
});

// ── Navbar scroll ─────────────────────────────────────
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger / Drawer ────────────────────────────────
const ham = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  drawer.classList.toggle('open');
});
document.querySelectorAll('.d-link').forEach(l => {
  l.addEventListener('click', () => {
    ham.classList.remove('open');
    drawer.classList.remove('open');
  });
});

// ── Smooth scroll ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === "#") return;
    const t = document.querySelector(href);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Scroll reveal ─────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Card tilt micro-interaction ───────────────────────
document.querySelectorAll('.project-item, .exp-card, .ach-card, .skill-block').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    // achievement card has 8px translateY in CSS, others have 6px
    const hoverY = card.classList.contains('ach-card') ? -8 : -6;
    card.style.transform = `translateY(${hoverY}px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ── Animated stat counters ────────────────────────────
const statEls = document.querySelectorAll('.stat-n[data-count]');
const statObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObs.unobserve(el);
  });
}, { threshold: 0.5 });
statEls.forEach(el => statObs.observe(el));

// ── Active nav link on scroll ─────────────────────────
const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .d-link[href^="#"]');
const sections = Array.from(navLinks)
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

function setActiveNav() {
  let current = sections[0];
  const scrollPos = window.scrollY + window.innerHeight * 0.3;
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollPos) current = sec;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
  });
}
window.addEventListener('scroll', setActiveNav);
setActiveNav();

// ── Project tag filters ───────────────────────────────
const projectItems = document.querySelectorAll('#projects-list .project-item');
const filterBar = document.getElementById('project-filters');

if (filterBar && projectItems.length) {
  const tagSet = new Set();
  projectItems.forEach(item => {
    const tags = Array.from(item.querySelectorAll('.p-tag')).map(t => t.textContent.trim());
    item.dataset.tags = tags.join('|');
    tags.forEach(t => tagSet.add(t));
  });

  const priorityTags = ['Python', 'React', 'FastAPI', 'JavaScript', 'PostgreSQL'];
  const sortedTags = [...priorityTags.filter(t => tagSet.has(t)),
  ...Array.from(tagSet).filter(t => !priorityTags.includes(t)).sort()];

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.textContent = 'All';
  allBtn.dataset.filter = 'all';
  filterBar.appendChild(allBtn);

  sortedTags.slice(0, 12).forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = tag;
    btn.dataset.filter = tag;
    filterBar.appendChild(btn);
  });

  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectItems.forEach(item => {
      const tags = item.dataset.tags.split('|');
      const show = filter === 'all' || tags.includes(filter);
      item.classList.toggle('filtered-out', !show);
    });
  });
}

// ── Back to top ────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Copy email to clipboard ───────────────────────────
const copyToast = document.getElementById('copy-toast');
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener('click', e => {
    const email = link.getAttribute('href').replace('mailto:', '').split('?')[0];
    if (navigator.clipboard) {
      e.preventDefault();
      navigator.clipboard.writeText(email).then(() => {
        if (copyToast) {
          copyToast.classList.add('show');
          setTimeout(() => copyToast.classList.remove('show'), 2000);
        }
        setTimeout(() => { window.location.href = 'mailto:' + email; }, 400);
      }).catch(() => { window.location.href = link.getAttribute('href'); });
    }
  });
});

// ── Contact Form ──────────────────────────────────────
const form = document.getElementById('contact-form');
const result = document.getElementById('form-result');
const submitBtn = document.getElementById('submit-btn');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    result.textContent = "";
    result.className = "form-result";

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          result.textContent = "Success! Message sent.";
          result.classList.add('success');
          form.reset();
        } else {
          console.log(response);
          result.textContent = json.message;
          result.classList.add('error');
        }
      })
      .catch(error => {
        console.log(error);
        result.textContent = "Something went wrong!";
        result.classList.add('error');
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message →";
        setTimeout(() => {
          result.style.opacity = '0';
          setTimeout(() => {
            result.textContent = "";
            result.style.opacity = '1';
            result.className = "form-result";
          }, 300);
        }, 5000);
      });
  });
}

