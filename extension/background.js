chrome.runtime.onCommand.addListener((command) => {
  if (command === 'save-link') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const url = tabs[0].url;
        if (url && !url.startsWith('chrome://') && !url.startsWith('chrome-extension://')) {
          const saveUrl = `https://nooks.vercel.app/save?url=${encodeURIComponent(url)}`;
          chrome.tabs.create({ url: saveUrl });
        }
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSavePage' && request.url) {
    const saveUrl = `https://nooks.vercel.app/save?url=${encodeURIComponent(request.url)}`;
    chrome.tabs.create({ url: saveUrl });
  }
});