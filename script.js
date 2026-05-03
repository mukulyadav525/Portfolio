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

