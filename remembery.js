(() => {
  'use strict';
  const video = document.querySelector('#remembery-excerpt');
  if (!video) return;
  const full = document.querySelector('#remembery-full');
  const status = document.querySelector('#rm-playback-status');
  const chapterItems = [...document.querySelectorAll('[data-chapter]')];
  const buttons = [];
  let pendingSeek = null;

  function seekIfReady() {
    if (pendingSeek === null || !video.seekable.length) return;
    const end = video.seekable.end(video.seekable.length - 1);
    if (end <= pendingSeek) return;
    video.currentTime = pendingSeek;
    pendingSeek = null;
  }
  ['loadedmetadata', 'loadeddata', 'progress', 'canplay', 'durationchange'].forEach(event => video.addEventListener(event, seekIfReady));
  chapterItems.forEach(item => {
    const label = item.querySelector('.rm-chapter-title');
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = label.innerHTML;
    button.setAttribute('aria-controls', video.id);
    button.setAttribute('aria-label', `Play from ${label.textContent.trim()}`);
    label.replaceWith(button);
    buttons.push(button);
    button.addEventListener('click', () => {
      full.pause();
      pendingSeek = Number(item.dataset.chapter);
      status.textContent = '';
      seekIfReady();
      // Playback starts only in response to an explicit user gesture.
      video.play().then(seekIfReady).catch(() => {
        status.textContent = 'Use the video play control to start the walkthrough.';
      });
    });
  });
  video.addEventListener('timeupdate', () => {
    const current = chapterItems.reduce((index, item, i) => video.currentTime >= Number(item.dataset.chapter) ? i : index, 0);
    buttons.forEach((button, i) => button.setAttribute('aria-current', String(i === current)));
  });
  video.addEventListener('play', () => full.pause());
  full.addEventListener('play', () => video.pause());
  full.closest('details').addEventListener('toggle', event => { if (!event.target.open) full.pause(); });
  video.addEventListener('error', () => { status.textContent = 'The excerpt could not load. The full recording is available below.'; });
})();
