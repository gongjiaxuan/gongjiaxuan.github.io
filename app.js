(() => {
  'use strict';

  document.querySelectorAll('[data-filter-root]').forEach(root => {
    const items = [...root.querySelectorAll('[data-item]')];
    const buttons = [...root.querySelectorAll('[data-filter]')];
    const search = root.querySelector('[data-search-input]');
    const counter = root.querySelector('[data-result-count]');
    const unit = counter.dataset.unit || 'project';
    let category = 'All';
    const initial = new URLSearchParams(location.search);
    if (buttons.some(b => b.dataset.filter === initial.get('filter'))) category = initial.get('filter');
    search.value = initial.get('q') || '';

    function update(writeURL = true) {
      const query = search.value.trim().toLocaleLowerCase();
      let visible = 0;
      for (const item of items) {
        const matches = (category === 'All' || item.dataset.category === category) && item.dataset.search.includes(query);
        item.hidden = !matches;
        if (matches) visible++;
      }
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
      root.querySelectorAll('[data-result-group]').forEach(group => {
        group.hidden = ![...group.querySelectorAll('[data-item]')].some(item => !item.hidden);
      });
      counter.textContent = `${visible} ${unit}${visible === 1 ? '' : 's'}`;
      root.querySelector('[data-empty]').hidden = visible > 0;
      if (writeURL) {
        const url = new URL(location.href);
        category === 'All' ? url.searchParams.delete('filter') : url.searchParams.set('filter', category);
        query ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
        // Some browsers restrict replaceState on file://; filtering still works offline.
        try { history.replaceState(null, '', url); } catch { /* Local-file preview. */ }
      }
    }
    buttons.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.filter;
      update();
    }));
    search.addEventListener('input', () => update());
    root.querySelector('[data-reset]').addEventListener('click', () => {
      category = 'All';
      search.value = '';
      update();
      search.focus();
    });
    window.addEventListener('pageshow', () => update(false));
    update(false);
  });

  const dialog = document.querySelector('.image-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const enlarged = document.getElementById('image-enlarged');
  const caption = document.getElementById('image-caption');
  const original = document.getElementById('image-original');
  const close = dialog.querySelector('[data-close-image]');
  let opener;
  document.querySelectorAll('[data-zoom]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      enlarged.src = link.href;
      enlarged.alt = link.querySelector('img').alt;
      caption.textContent = link.dataset.caption;
      original.href = link.href;
      dialog.showModal();
      document.body.classList.add('dialog-open');
      close.focus();
    });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    enlarged.removeAttribute('src');
    if (opener?.isConnected) opener.focus();
  });
})();
