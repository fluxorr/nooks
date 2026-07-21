const DEFAULT_SERVER_URL = 'http://localhost:3000';

const serverInput = document.getElementById('serverUrl');
const saveBtn = document.getElementById('saveBtn');
const testBtn = document.getElementById('testBtn');
const statusEl = document.getElementById('status');

function normalizeUrl(raw) {
  let url = raw.trim();
  if (!url) return DEFAULT_SERVER_URL;
  // Remove trailing slash for consistency
  return url.replace(/\/$/, '');
}

function showStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;
}

async function loadSettings() {
  const result = await chrome.storage.sync.get(['serverUrl']);
  serverInput.value = result.serverUrl || DEFAULT_SERVER_URL;
}

async function saveSettings(e) {
  e.preventDefault();
  const url = normalizeUrl(serverInput.value);

  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';
  showStatus('');

  try {
    await chrome.storage.sync.set({ serverUrl: url });
    showStatus('Settings saved.', 'ok');
  } catch (err) {
    showStatus('Could not save settings: ' + (err?.message || 'unknown error'), 'err');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';
  }
}

async function testConnection() {
  const url = normalizeUrl(serverInput.value);
  showStatus('Checking...');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${url}/api/health`, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    showStatus(data.status === 'ok' ? `Connected to ${url}` : 'Connected, but status was unexpected.', 'ok');
  } catch (err) {
    showStatus('Connection failed: ' + (err?.message || 'unknown error'), 'err');
  }
}

document.getElementById('settingsForm').addEventListener('submit', saveSettings);
testBtn.addEventListener('click', testConnection);

document.addEventListener('DOMContentLoaded', loadSettings);
// Fallback for options pages that don't always fire DOMContentLoaded in some Chrome versions
loadSettings();
