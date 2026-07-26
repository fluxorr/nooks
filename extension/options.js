const DEFAULT_SERVER_URL = 'http://localhost:3000';

const els = {
  serverInput: document.getElementById('serverUrl'),
  saveBtn: document.getElementById('saveBtn'),
  testBtn: document.getElementById('testBtn'),
  statusEl: document.getElementById('status'),
  apiToken: document.getElementById('apiToken'),
  saveTokenBtn: document.getElementById('saveTokenBtn'),
  clearTokenBtn: document.getElementById('clearTokenBtn'),
  tokenStatus: document.getElementById('tokenStatus'),
  urlError: document.getElementById('urlError'),
  dashboardTokenLink: document.getElementById('dashboardTokenLink'),
};

function normalizeUrl(raw) {
  let url = raw.trim();
  if (!url) return DEFAULT_SERVER_URL;
  return url.replace(/\/$/, '');
}

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch { return false; }
}

function showStatus(el, message, type) {
  el.textContent = message;
  el.className = 'status ' + (type || '');
}

async function loadSettings() {
  const result = await chrome.storage.sync.get(['serverUrl', 'apiToken']);
  els.serverInput.value = result.serverUrl || DEFAULT_SERVER_URL;
  els.apiToken.value = result.apiToken || '';
  updateDashboardLink();
}

function updateDashboardLink() {
  const url = normalizeUrl(els.serverInput.value);
  els.dashboardTokenLink.href = url + '/dashboard';
}

els.serverInput.addEventListener('input', () => {
  els.urlError.classList.remove('show');
  els.serverInput.classList.remove('error');
  updateDashboardLink();
});

async function saveSettings(e) {
  e.preventDefault();
  const url = normalizeUrl(els.serverInput.value);

  if (!isValidUrl(url.startsWith('http') ? url : 'https://' + url)) {
    els.urlError.textContent = 'Enter a valid URL starting with http:// or https://';
    els.urlError.classList.add('show');
    els.serverInput.classList.add('error');
    return;
  }

  const finalUrl = url.startsWith('http') ? url : 'https://' + url;

  els.saveBtn.disabled = true;
  els.saveBtn.textContent = 'Saving...';
  showStatus(els.statusEl, '');

  try {
    await chrome.storage.sync.set({ serverUrl: finalUrl });
    els.serverInput.value = finalUrl;
    showStatus(els.statusEl, 'Settings saved.', 'ok');
    updateDashboardLink();
  } catch (err) {
    showStatus(els.statusEl, 'Could not save: ' + (err?.message || 'unknown error'), 'err');
  } finally {
    els.saveBtn.disabled = false;
    els.saveBtn.textContent = 'Save';
  }
}

async function testConnection() {
  const url = normalizeUrl(els.serverInput.value);
  showStatus(els.statusEl, 'Checking...');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${url}/api/health`, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    showStatus(els.statusEl, data.status === 'ok' ? `Connected to ${url}` : 'Connected, but status was unexpected.', 'ok');
  } catch (err) {
    showStatus(els.statusEl, 'Connection failed: ' + (err?.message || 'unknown error'), 'err');
  }
}

els.saveTokenBtn.addEventListener('click', async () => {
  const token = els.apiToken.value.trim();
  try {
    await chrome.storage.sync.set({ apiToken: token });
    showStatus(els.tokenStatus, token ? 'Token saved.' : 'Token cleared.', 'ok');
  } catch (err) {
    showStatus(els.tokenStatus, 'Failed to save token: ' + (err?.message || 'unknown'), 'err');
  }
});

els.clearTokenBtn.addEventListener('click', async () => {
  els.apiToken.value = '';
  try {
    await chrome.storage.sync.set({ apiToken: '' });
    showStatus(els.tokenStatus, 'Token cleared.', 'ok');
  } catch (err) {
    showStatus(els.tokenStatus, 'Failed to clear token: ' + (err?.message || 'unknown'), 'err');
  }
});

document.getElementById('settingsForm').addEventListener('submit', saveSettings);
els.testBtn.addEventListener('click', testConnection);
document.addEventListener('DOMContentLoaded', loadSettings);
loadSettings();
