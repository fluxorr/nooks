chrome.runtime.onCommand.addListener((command) => {
  if (command === 'save-link') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.tabs.sendMessage(tab.id, { action: 'savePage' });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openSavePage') {
    const saveUrl = `${window.location.origin}/save?url=${encodeURIComponent(request.url)}`;
    chrome.tabs.create({ url: saveUrl });
  }
});