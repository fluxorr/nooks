const DEFAULT_SERVER_URL = 'http://localhost:3000';

const els = {
  saveBtn: document.getElementById('saveBtn'),
  nookSelect: document.getElementById('nookSelect'),
  serverHint: document.getElementById('serverHint'),
  optionsLink: document.getElementById('optionsLink'),
  dashboardLink: document.getElementById('dashboardLink'),
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
  recentList: document.getElementById('recentList'),
  recentEmpty: document.getElementById('recentEmpty'),
};

let saving = false;
let serverUrl = DEFAULT_SERVER_URL;

function storageGet(keys) {
  return new Promise(resolve => chrome.storage.sync.get(keys, resolve));
}

function isMac() {
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function loadSettings() {
  const result = await storageGet(['serverUrl']);
  serverUrl = result.serverUrl || DEFAULT_SERVER_URL;
}

async function loadNooks() {
  const result = await chrome.runtime.sendMessage({ action: 'fetchNooks' });
  if (!result.success) return { nooks: [], links: [] };
  return result;
}

async function loadRecent() {
  const { links } = await loadNooks();
  const recent = (links || []).slice(-5).reverse();
  const container = els.recentList;

  const existing = container.querySelectorAll('.recent-item, .recent-empty');
  existing.forEach(el => el.remove());

  if (recent.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'recent-empty';
    empty.textContent = 'No saves yet';
    container.appendChild(empty);
  } else {
    const sectionLabel = container.querySelector('.section-label');
    recent.forEach(link => {
      const item = document.createElement('div');
      item.className = 'recent-item';
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.title = link.title || link.url;
      a.textContent = link.title || link.url;
      item.appendChild(a);
      container.appendChild(item);
    });
  }
}

function renderNookSelect(nooks) {
  const current = els.nookSelect.value;
  els.nookSelect.innerHTML = '<option value="">Inbox</option>';
  (nooks || []).forEach(nook => {
    const opt = document.createElement('option');
    opt.value = nook.id;
    opt.textContent = nook.name;
    els.nookSelect.appendChild(opt);
  });
  els.nookSelect.value = current;
}

function normalizeUrl(raw) {
  return raw.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function setStatus(kind, text) {
  els.statusDot.className = 'status-dot ' + kind;
  els.statusText.textContent = text;
  els.statusText.title = kind === 'ok' ? 'Server reachable' : 'Check server URL in settings';
}

async function checkHealth() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${serverUrl}/api/health`, { signal: controller.signal });
    clearTimeout(timeout);
    setStatus(res.ok ? 'ok' : 'err', res.ok ? 'Server reachable' : `Server error: ${res.status}`);
  } catch (err) {
    setStatus('err', err.name === 'AbortError' ? 'Server timed out' : 'Server unreachable');
  }
}

els.saveBtn.addEventListener('click', async () => {
  if (saving) return;
  saving = true;

  const originalText = els.saveBtn.textContent;
  els.saveBtn.textContent = 'Saving...';
  els.saveBtn.disabled = true;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) throw new Error('No active page');

    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      els.saveBtn.textContent = 'Cannot save this page';
      setTimeout(() => window.close(), 1500);
      return;
    }

    const overrides = { title: tab.title };
    const nookId = els.nookSelect.value;
    if (nookId) overrides.nookId = nookId;

    const result = await chrome.runtime.sendMessage({ action: 'saveLink', url: tab.url, overrides });
    if (result?.success) {
      els.saveBtn.textContent = 'Saved!';
      setStatus('ok', 'Saved to Nooks');
      setTimeout(() => window.close(), 800);
    } else {
      throw new Error((result && result.error) || 'Save failed');
    }
  } catch (err) {
    const msg = err?.message || 'Failed to save';
    els.saveBtn.textContent = msg.length > 24 ? 'Failed to save' : msg;
    els.saveBtn.style.background = '#dc2626';
    els.saveBtn.style.color = '#fff';
    setTimeout(() => {
      els.saveBtn.textContent = originalText;
      els.saveBtn.style.background = '';
      els.saveBtn.style.color = '';
      els.saveBtn.disabled = false;
      saving = false;
    }, 2500);
  }
});

els.optionsLink.addEventListener('click', () => chrome.runtime.openOptionsPage());
els.dashboardLink.addEventListener('click', () => chrome.tabs.create({ url: serverUrl + '/dashboard' }));

async function init() {
  await loadSettings();
  els.serverHint.textContent = normalizeUrl(serverUrl);
  checkHealth();

  const { nooks } = await loadNooks();
  renderNookSelect(nooks);
  loadRecent();
}

init();
