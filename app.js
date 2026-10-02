(() => {
  'use strict';

  document.querySelectorAll('[data-filter-root]').forEach(root => {
    const items = [...root.querySelectorAll('[data-item]')];
    const buttons = [...root.querySelectorAll('[data-filter]')];
    const search = root.querySelector('[data-search-input]');
    const counter = root.querySelector('[data-result-count]');
    if (!items.length || !buttons.length || !search || !counter) return;
    const unit = counter.dataset.unit || 'project';
    const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    const searchable = new Map(items.map(item => {
      const text = normalize(`${item.dataset.search || ''} ${item.dataset.aliases || ''} ${item.textContent}`);
      return [item, { text, words: new Set(text.split(' ')) }];
    }));
    let category = 'All';
    let inputTimer;
    function readURL() {
      const params = new URLSearchParams(location.search);
      category = buttons.some(b => b.dataset.filter === params.get('filter')) ? params.get('filter') : 'All';
      search.value = params.get('q') || '';
    }

    function update(historyMode) {
      const query = normalize(search.value);
      const terms = query.split(' ').filter(Boolean);
      let visible = 0;
      for (const item of items) {
        const index = searchable.get(item);
        // Short acronyms are whole words: AR should not match "research".
        const matches = (category === 'All' || item.dataset.category === category) && terms.every(term => /^[a-z]{1,2}$/.test(term) ? index.words.has(term) : index.text.includes(term));
        item.hidden = !matches;
        if (matches) visible++;
      }
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
      root.querySelectorAll('[data-result-group]').forEach(group => {
        group.hidden = ![...group.querySelectorAll('[data-item]')].some(item => !item.hidden);
      });
      counter.textContent = `${visible} of ${items.length} ${unit}s${category === 'All' ? '' : ` · ${category}`}`;
      root.querySelector('[data-empty]').hidden = visible > 0;
      root.querySelectorAll('.filter-status [data-reset]').forEach(button => {
        button.hidden = category === 'All' && !query;
      });
      if (historyMode) {
        const url = new URL(location.href);
        category === 'All' ? url.searchParams.delete('filter') : url.searchParams.set('filter', category);
        query ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
        // Some browsers restrict replaceState on file://; filtering still works offline.
        try {
          if (url.href !== location.href) history[historyMode === 'push' ? 'pushState' : 'replaceState'](null, '', url);
        } catch { /* Filtering also works in local-file previews. */ }
      }
    }
    buttons.forEach(button => button.addEventListener('click', () => {
      clearTimeout(inputTimer);
      category = button.dataset.filter;
      update('push');
    }));
    search.addEventListener('input', () => {
      clearTimeout(inputTimer);
      update();
      inputTimer = setTimeout(() => update('replace'), 180);
    });
    root.querySelectorAll('[data-reset]').forEach(button => button.addEventListener('click', () => {
      clearTimeout(inputTimer);
      category = 'All';
      search.value = '';
      update('push');
      search.focus();
    }));
    window.addEventListener('popstate', () => {
      clearTimeout(inputTimer);
      readURL();
      update();
    });
    window.addEventListener('pageshow', () => { readURL(); update(); });
    // Finalize a pending query before following a project link; Back restores it.
    root.addEventListener('click', event => {
      if (event.target.closest('[data-item] a')) {
        clearTimeout(inputTimer);
        update('replace');
      }
    });
    readURL();
    update();
    root.querySelector('.filter-bar').hidden = false;
    const status = root.querySelector('.filter-status');
    if (status) status.hidden = false;
  });

  // Copy is a separate action; the adjacent Email link still opens a mail client.
  document.querySelectorAll('[data-copy-email]').forEach(button => {
    if (!navigator.clipboard?.writeText) return;
    const feedback = button.closest('.contact-area')?.querySelector('[data-copy-feedback]');
    let resetTimer;
    let copying = false;
    button.hidden = false;
    button.addEventListener('click', async () => {
      if (copying) return;
      copying = true;
      clearTimeout(resetTimer);
      // aria-disabled prevents repeat work without removing keyboard focus.
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('aria-busy', 'true');
      if (feedback) feedback.textContent = '';
      try {
        await navigator.clipboard.writeText(button.dataset.copyEmail);
        button.dataset.copied = 'true';
        button.setAttribute('aria-label', 'Email address copied');
        if (feedback) feedback.textContent = 'Email address copied.';
      } catch {
        delete button.dataset.copied;
        button.setAttribute('aria-label', 'Copy email address');
        if (feedback) feedback.textContent = `Copy manually: ${button.dataset.copyEmail}`;
      } finally {
        copying = false;
        button.removeAttribute('aria-disabled');
        button.removeAttribute('aria-busy');
      }
      // Keep failed-copy text available for manual selection, without a timeout.
      if (button.dataset.copied) resetTimer = setTimeout(() => {
        delete button.dataset.copied;
        button.setAttribute('aria-label', 'Copy email address');
        if (feedback) feedback.textContent = '';
      }, 3000);
    });
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
      enlarged.alt = link.dataset.alt || link.querySelector('img').alt;
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
