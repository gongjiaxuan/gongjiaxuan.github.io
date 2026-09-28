(() => {
  'use strict';
  const stage = document.querySelector('.dh-reveal-stage');
  const slider = document.querySelector('#dh-light-position');
  const output = document.querySelector('#dh-light-value');
  if (stage && slider && output) {
    document.querySelector('[data-reveal-controls]').hidden = false;
    const setPosition = (x, y = 50) => {
      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));
      stage.style.setProperty('--reveal-x', `${boundedX}%`);
      stage.style.setProperty('--reveal-y', `${boundedY}%`);
      slider.value = String(Math.round(boundedX));
      output.value = `${Math.round(boundedX)}%`;
    };
    const point = event => {
      const bounds = stage.getBoundingClientRect();
      setPosition(100 * (event.clientX - bounds.left) / bounds.width, 100 * (event.clientY - bounds.top) / bounds.height);
    };
    stage.addEventListener('pointermove', event => { if (event.pointerType === 'mouse') point(event); });
    stage.addEventListener('pointerdown', point);
    slider.addEventListener('input', () => setPosition(Number(slider.value)));
    const resize = () => stage.style.setProperty('--reveal-radius', `${Math.round(stage.clientWidth * 0.12)}px`);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
    else window.addEventListener('resize', resize);
    resize();
    setPosition(50);
  }
  const videos = [...document.querySelectorAll('.dunhuang-page video')];
  videos.forEach(video => video.addEventListener('play', () => videos.forEach(other => { if (other !== video) other.pause(); })));
  document.querySelectorAll('.dh-full').forEach(details => details.addEventListener('toggle', () => { if (!details.open) details.querySelector('video').pause(); }));
})();
