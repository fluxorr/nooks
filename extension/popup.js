const NOOKS_URL = 'http://localhost:3000';

let saving = false;

document.getElementById('saveBtn').addEventListener('click', async () => {
  if (saving) return;
  saving = true;

  const btn = document.getElementById('saveBtn');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) return;

    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      btn.textContent = 'Cannot save this page';
      setTimeout(() => window.close(), 1500);
      return;
    }

    await chrome.runtime.sendMessage({ action: 'saveLink', url: tab.url });
    btn.textContent = 'Saved!';
    setTimeout(() => window.close(), 800);
  } catch (err) {
    btn.textContent = 'Failed to save';
    btn.style.background = '#dc2626';
    btn.style.color = '#fff';
    setTimeout(() => window.close(), 2000);
  }
});

chrome.storage.sync.get(['serverUrl'], (result) => {
  const url = result.serverUrl || NOOKS_URL;
  document.querySelector('.server-hint').textContent = url.replace(/^https?:\/\//, '');
});
