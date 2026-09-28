(() => {
  'use strict';
  const videos = [...document.querySelectorAll('.showcase-page video')];
  videos.forEach(video => video.addEventListener('play', () => videos.forEach(other => { if (other !== video) other.pause(); })));
  document.querySelectorAll('[data-chapters]').forEach(group => { group.hidden = false; });
  const status = document.querySelector('.sc-media-status');
  let seekRequest = 0;
  document.querySelectorAll('[data-video][data-time]').forEach(button => button.addEventListener('click', async () => {
    const video = document.getElementById(button.dataset.video);
    if (!video) return;
    const request = ++seekRequest;
    const time = Number(button.dataset.time);
    const position = () => { if (request === seekRequest) video.currentTime = time; };
    if (status) status.textContent = 'Loading the selected chapter…';
    try {
      if (video.readyState >= 1) position();
      else { video.addEventListener('loadedmetadata', position, { once:true }); video.load(); }
      await video.play();
      if (request !== seekRequest) return;
      document.querySelectorAll(`[data-video="${video.id}"]`).forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      if (status) status.textContent = `Playing ${button.textContent.trim()}.`;
      video.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    } catch {
      if (request === seekRequest && status) status.textContent = 'Playback could not start. Use the video controls or open the video link to try again.';
    }
  }));
  document.querySelectorAll('.sc-details').forEach(details => details.addEventListener('toggle', () => {
    if (!details.open) details.querySelectorAll('video').forEach(video => video.pause());
  }));
})();
