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
  const feedbackSection = document.querySelector('.feedback-section');
  const feedbackPrev = document.querySelector('[data-feedback-prev]');
  const feedbackNext = document.querySelector('[data-feedback-next]');
  let feedbackOffset = 0;
  function feedbackLimits() {
    if (!feedbackTrack) return null;
    const cards = Array.from(feedbackTrack.querySelectorAll('.feedback-card'));
    const lastCard = cards[cards.length - 1];
    if (!lastCard) return null;
    const gap = parseFloat(getComputedStyle(feedbackTrack).columnGap) || 18;
    const step = cards[0].getBoundingClientRect().width + gap;
    const trailingPageSpace = window.innerWidth > 900 ? step : 0;
    return {
      cards: cards,
      max: Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth + trailingPageSpace - feedbackTrack.clientWidth),
      step: step
    };
  }
  function setFeedbackOffset(offset) {
    const limits = feedbackLimits();
    if (!limits) return;
    feedbackOffset = Math.max(0, Math.min(offset, limits.max));
    feedbackTrack.style.setProperty('--feedback-offset', feedbackOffset + 'px');
  }
  function feedbackPages(limits) {
    const pages = [0];
    while (pages[pages.length - 1] < limits.max - 1) {
      pages.push(Math.min(pages[pages.length - 1] + limits.step * 3, limits.max));
    }
    return pages;
  }
  function scrollFeedback(direction) {
    const limits = feedbackLimits();
    if (!limits) return;
    const pages = feedbackPages(limits);
    const target = direction > 0
      ? pages.find(function (page) { return page > feedbackOffset + 1; })
      : pages.slice().reverse().find(function (page) { return page < feedbackOffset - 1; });
    setFeedbackOffset(target === undefined ? (direction > 0 ? limits.max : 0) : target);
  }
  if (feedbackSection && feedbackTrack) {
    let horizontalWheelLocked = false;
    let horizontalWheelTimer;
    let pendingHorizontalDelta = 0;
    feedbackSection.addEventListener('wheel', function (event) {
      const horizontalDelta = event.shiftKey ? event.deltaY : event.deltaX;
      const isHorizontalGesture = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (isHorizontalGesture && horizontalDelta !== 0) {
        event.preventDefault();
        if (!horizontalWheelLocked) {
          pendingHorizontalDelta += horizontalDelta;
          if (Math.abs(pendingHorizontalDelta) >= 4) {
            scrollFeedback(pendingHorizontalDelta > 0 ? 1 : -1);
            horizontalWheelLocked = true;
            pendingHorizontalDelta = 0;
          }
        }
        clearTimeout(horizontalWheelTimer);
        horizontalWheelTimer = setTimeout(function () {
          horizontalWheelLocked = false;
          pendingHorizontalDelta = 0;
        }, 450);
      }
    }, { passive: false });
    let touchStartX = 0;
    let touchStartY = 0;
    feedbackTrack.addEventListener('touchstart', function (event) {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });
    feedbackTrack.addEventListener('touchend', function (event) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        scrollFeedback(deltaX < 0 ? 1 : -1);
      }
    }, { passive: true });
  }
  if (feedbackPrev) feedbackPrev.addEventListener('click', function () { scrollFeedback(-1); });
  if (feedbackNext) feedbackNext.addEventListener('click', function () { scrollFeedback(1); });
})();
