(() => {
  const video = document.querySelector('#cp-demo');
  const music = document.querySelector('[data-demo-music]');
  const chapters = [...document.querySelectorAll('[data-demo-time]')];
  const status = document.querySelector('[data-demo-status]');
  if (!video || !music) return;

  const play = async () => {
    try {
      await video.play();
      status.textContent = '';
    } catch {
      status.textContent = 'Use the video play control to start the demo.';
    }
  };
  const updateMusic = () => {
    music.textContent = video.paused || video.ended ? 'Play with music' : video.muted ? 'Turn music on' : 'Mute music';
  };
  const jump = seconds => {
    const seek = () => {
      video.currentTime = Math.min(seconds, video.duration || seconds);
      void play();
    };
    if (video.readyState > 0) seek();
    else {
      video.addEventListener('loadedmetadata', seek, { once: true });
      video.load();
    }
  };
  music.hidden = false;
  document.querySelector('.cp-chapters').hidden = false;
  music.addEventListener('click', () => {
    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0;
      video.muted = false;
      void play();
    } else video.muted = !video.muted;
    updateMusic();
  });
  chapters.forEach(button => button.addEventListener('click', () => jump(Number(button.dataset.demoTime))));
  document.querySelectorAll('[data-jump]').forEach(link => link.addEventListener('click', () => jump(Number(link.dataset.jump))));
  video.addEventListener('timeupdate', () => {
    const active = chapters.findLast(button => Number(button.dataset.demoTime) <= video.currentTime);
    chapters.forEach(button => {
      if (button === active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  });
  ['play', 'pause', 'ended', 'volumechange'].forEach(event => video.addEventListener(event, updateMusic));
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
  video.addEventListener('error', () => { status.textContent = 'The video could not load. You can still read the transcript or try the prototype.'; });
  updateMusic();
})();
