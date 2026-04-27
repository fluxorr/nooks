document.getElementById('saveBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      const saveUrl = `https://nooks.vercel.app/save?url=${encodeURIComponent(tab.url)}`;
      chrome.tabs.create({ url: saveUrl });
    }
  });
});