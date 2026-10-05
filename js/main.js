(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    items.forEach(function (item) { observer.observe(item); });
  } else {
    items.forEach(function (item) { item.classList.add('is-visible'); });
  }


  const feedbackTrack = document.querySelector('[data-feedback-track]');
  const feedbackPrev = document.querySelector('[data-feedback-prev]');
  const feedbackNext = document.querySelector('[data-feedback-next]');
  function scrollFeedback(direction) {
    if (!feedbackTrack) return;
    const card = feedbackTrack.querySelector('.feedback-card');
    const amount = card ? card.getBoundingClientRect().width + 18 : 360;
    feedbackTrack.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }
  if (feedbackPrev) feedbackPrev.addEventListener('click', function () { scrollFeedback(-1); });
  if (feedbackNext) feedbackNext.addEventListener('click', function () { scrollFeedback(1); });
})();
