// portfolio.js — loads config.json, exposes as window.PORTFOLIO_CONFIG
// All pages (index.html, project.html, admin.html) can read from this.

(function() {
  var configUrl = 'config.json';
  // Cache-bust in development — remove for production
  // configUrl += '?t=' + Date.now();

  window.PORTFOLIO_CONFIG = null;
  window.PORTFOLIO_READY = false;
  window.PORTFOLIO_CALLBACKS = [];

  function onReady(cb) {
    if (window.PORTFOLIO_READY) { cb(window.PORTFOLIO_CONFIG); return; }
    window.PORTFOLIO_CALLBACKS.push(cb);
  }

  function notifyReady() {
    window.PORTFOLIO_READY = true;
    window.PORTFOLIO_CALLBACKS.forEach(function(cb) { cb(window.PORTFOLIO_CONFIG); });
    window.PORTFOLIO_CALLBACKS = [];
  }

  fetch(configUrl)
    .then(function(r) { return r.json(); })
    .then(function(config) {
      window.PORTFOLIO_CONFIG = config;
      notifyReady();
    })
    .catch(function(err) {
      console.warn('config.json not loaded, using fallback data', err);
      notifyReady(); // notify anyway — consumers can check if config is null
    });

  // Expose
  window.PORTFOLIO_onReady = onReady;
  window.PORTFOLIO_getProject = function(id) {
    var cfg = window.PORTFOLIO_CONFIG;
    if (!cfg || !cfg.projects) return null;
    // id can be numeric index or string id
    if (typeof id === 'number') return cfg.projects[id] || null;
    return cfg.projects.find(function(p) { return p.id === id; }) || null;
  };
  window.PORTFOLIO_getProjectIndex = function(id) {
    var cfg = window.PORTFOLIO_CONFIG;
    if (!cfg || !cfg.projects) return -1;
    return cfg.projects.findIndex(function(p) { return p.id === id; });
  };
})();
