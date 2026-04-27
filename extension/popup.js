document.getElementById('saveBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab.url) {
      window.open(`/save?url=${encodeURIComponent(tab.url)}`, '_blank');
    }
  });
});