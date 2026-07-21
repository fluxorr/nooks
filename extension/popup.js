const DEFAULT_SERVER_URL = 'http://localhost:3000';

const els = {
  saveBtn: document.getElementById('saveBtn'),
  serverHint: document.getElementById('serverHint'),
  optionsLink: document.getElementById('optionsLink'),
  shortcutKeys: document.getElementById('shortcutKeys'),
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
};

let saving = false;

function getServerUrl() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['serverUrl'], (result) => {
      resolve(result.serverUrl || DEFAULT_SERVER_URL);
    });
  });
}

function normalizeUrl(raw) {
  return raw.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function isMac() {
  // navigator.platform is deprecated but still reliable enough for a popup.
  const platform = navigator.platform || navigator.userAgentData?.platform || '';
  return /Mac|iPhone|iPad|iPod/i.test(platform);
}

function renderShortcut() {
  const modifier = isMac() ? 'Cmd' : 'Ctrl';
  els.shortcutKeys.innerHTML = `
    <span class="key">${modifier}</span>
    <span class="key">Shift</span>
    <span class="key">S</span>
  `;
}

async function checkHealth() {
  const url = await getServerUrl();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${url}/api/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      setStatus('ok', 'Server reachable');
    } else {
      setStatus('err', `Server error: ${res.status}`);
    }
  } catch (err) {
    setStatus('err', err.name === 'AbortError' ? 'Server timed out' : 'Server unreachable');
  }
}

function setStatus(kind, text) {
  els.statusDot.className = 'status-dot ' + kind;
  els.statusText.textContent = text;
  if (kind === 'ok') {
    els.statusText.title = 'The Nooks server is reachable.';
  } else if (kind === 'err') {
    els.statusText.title = 'Check the server URL in extension options.';
  }
}

async function init() {
  const url = await getServerUrl();
  els.serverHint.textContent = normalizeUrl(url);
  renderShortcut();
  checkHealth();
}

els.saveBtn.addEventListener('click', async () => {
  if (saving) return;
  saving = true;

  const originalText = els.saveBtn.textContent;
  els.saveBtn.textContent = 'Saving...';
  els.saveBtn.disabled = true;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      throw new Error('No active page');
    }

    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      els.saveBtn.textContent = 'Cannot save this page';
      setTimeout(() => window.close(), 1500);
      return;
    }

    const result = await chrome.runtime.sendMessage({ action: 'saveLink', url: tab.url });
    if (result && result.success) {
      els.saveBtn.textContent = 'Saved!';
      setStatus('ok', 'Saved to Nooks');
      setTimeout(() => window.close(), 800);
    } else {
      throw new Error((result && result.error) || 'Save failed');
    }
  } catch (err) {
    const message = err?.message || 'Failed to save';
    els.saveBtn.textContent = message.length > 24 ? 'Failed to save' : message;
    els.saveBtn.style.background = '#dc2626';
    els.saveBtn.style.color = '#fff';
    setStatus('err', 'Save failed');
    setTimeout(() => {
      els.saveBtn.textContent = originalText;
      els.saveBtn.style.background = '';
      els.saveBtn.style.color = '';
      els.saveBtn.disabled = false;
      saving = false;
    }, 2500);
  }
});

els.optionsLink.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

init();
