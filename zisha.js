(() => {
  'use strict';
  const tablist = document.querySelector('[data-experience-tabs]');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    function activate(tab, focus = false) {
      tabs.forEach(item => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(item.getAttribute('aria-controls'));
        panel.hidden = !selected;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', item.id);
        panel.tabIndex = 0;
      });
      if (focus) tab.focus();
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          activate(tabs[next], true);
        }
      });
    });
    activate(tabs[0]);
    tablist.hidden = false;
    document.body.classList.add('is-enhanced');
  }

  const walkthrough = document.getElementById('zisha-walkthrough');
  if (!walkthrough) return;
  let pendingTime = null;
  function seekRequestedTime() {
    if (pendingTime === null || !walkthrough.seekable.length) return;
    // A server without byte-range support may expose metadata before seeking is possible.
    const availableEnd = walkthrough.seekable.end(walkthrough.seekable.length - 1);
    if (availableEnd < pendingTime) return;
    walkthrough.currentTime = pendingTime;
    pendingTime = null;
  }
  ['loadedmetadata', 'loadeddata', 'canplay', 'progress'].forEach(event => {
    walkthrough.addEventListener(event, seekRequestedTime);
  });
  document.querySelectorAll('[data-demo-seek]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      pendingTime = Number(link.dataset.demoSeek);
      if (walkthrough.readyState >= 1) seekRequestedTime();
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      walkthrough.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' });
      walkthrough.focus({ preventScroll: true });
      // Playback is requested only in response to the user's chapter click.
      walkthrough.play().catch(() => { /* Native controls remain available. */ });
    });
  });
  const videos = [...document.querySelectorAll('video')];
  videos.forEach(video => video.addEventListener('play', () => {
    videos.forEach(other => { if (other !== video) other.pause(); });
  }));
  const original = document.querySelector('.zisha-original');
  original?.addEventListener('toggle', () => {
    if (!original.open) original.querySelector('video')?.pause();
  });
})();
