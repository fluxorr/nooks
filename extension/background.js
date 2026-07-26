const DEFAULT_SERVER_URL = 'http://localhost:3000';

function storageGet(keys) {
  return new Promise(resolve => chrome.storage.sync.get(keys, resolve));
}

async function getServerUrl() {
  const result = await storageGet(['serverUrl']);
  return result.serverUrl || DEFAULT_SERVER_URL;
}

async function getApiToken() {
  const result = await storageGet(['apiToken']);
  return result.apiToken || '';
}

function authHeaders(token) {
  return token ? { 'x-api-token': token } : {};
}

async function saveLink(url, tabId, overrides) {
  const [serverUrl, token] = await Promise.all([getServerUrl(), getApiToken()]);
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const body = { url, ...(overrides || {}) };

      const res = await fetch(`${serverUrl}/api/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      const data = await res.json();

      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Saved to Nooks',
        message: data.title || url,
        contextMessage: attempt > 0 ? `Retried ${attempt} time(s)` : undefined,
      });

      return { success: true, data };
    } catch (err) {
      if (err.name === 'AbortError') {
        if (attempt < maxRetries) continue;
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Save timed out',
          message: 'The server took too long. Please try again.',
        });
        return { success: false, error: 'timeout' };
      }

      if (attempt < maxRetries && err.message?.includes('Failed to fetch')) {
        continue;
      }

      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Save failed',
        message: err.message || 'Could not save to Nooks',
      });
      return { success: false, error: err.message };
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-link-to-nooks',
    title: 'Save link to Nooks',
    contexts: ['link'],
  });
  chrome.contextMenus.create({
    id: 'save-page-to-nooks',
    title: 'Save this page to Nooks',
    contexts: ['page'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const url = info.linkUrl || info.pageUrl;
  if (url && !url.startsWith('chrome://') && !url.startsWith('chrome-extension://')) {
    saveLink(url, tab?.id);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveLink' && request.url) {
    saveLink(request.url, sender.tab?.id, request.overrides).then(sendResponse);
    return true;
  }
  if (request.action === 'getServerUrl') {
    getServerUrl().then(sendResponse);
    return true;
  }
  if (request.action === 'setServerUrl') {
    chrome.storage.sync.set({ serverUrl: request.serverUrl }, sendResponse);
    return true;
  }
  if (request.action === 'fetchNooks') {
    (async () => {
      const [serverUrl, token] = await Promise.all([getServerUrl(), getApiToken()]);
      try {
        const res = await fetch(`${serverUrl}/api/nooks`, { headers: { ...authHeaders(token) } });
        const data = await res.json();
        sendResponse({ success: true, nooks: data.nooks || [], links: data.links || [] });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    })();
    return true;
  }
  if (request.action === 'getSettings') {
    storageGet(['serverUrl', 'apiToken']).then(sendResponse);
    return true;
  }
  if (request.action === 'setApiToken') {
    chrome.storage.sync.set({ apiToken: request.token }, sendResponse);
    return true;
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'save-link') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const url = tabs[0].url;
        if (url && !url.startsWith('chrome://') && !url.startsWith('chrome-extension://')) {
          saveLink(url, tabs[0].id);
        }
      }
    });
  }
});
