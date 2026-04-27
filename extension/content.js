(function() {
  let hoverTimeout = null;
  let currentTooltip = null;
  const NOOKS_URL = 'https://nooks.vercel.app';

  function createTooltip(link) {
    const tooltip = document.createElement('div');
    tooltip.className = 'nooks-tooltip';
    tooltip.innerHTML = `
      <button class="nooks-save-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Save to Nooks
      </button>
    `;

    const btn = tooltip.querySelector('.nooks-save-btn');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      saveLink(link.href);
    });

    return tooltip;
  }

  function saveLink(url) {
    const saveUrl = `${NOOKS_URL}/save?url=${encodeURIComponent(url)}`;
    window.open(saveUrl, '_blank');
  }

  function showTooltip(e, link) {
    if (!link.href || link.href.startsWith('#') || link.href.startsWith('javascript:') || link.href.startsWith('chrome')) {
      return;
    }

    hideTooltip();
    
    const rect = link.getBoundingClientRect();
    const tooltip = createTooltip(link);

    tooltip.style.cssText = `
      position: fixed;
      left: ${rect.left + window.scrollX}px;
      top: ${rect.top + window.scrollY - 44}px;
      z-index: 999999;
      animation: nooksFadeIn 0.2s ease;
    `;

    document.body.appendChild(tooltip);
    currentTooltip = tooltip;
  }

  function hideTooltip() {
    if (currentTooltip) {
      currentTooltip.remove();
      currentTooltip = null;
    }
  }

  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.tagName === 'A') {
      hoverTimeout = setTimeout(() => {
        showTooltip(e, e.target);
      }, 500);
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target && e.target.tagName === 'A') {
      clearTimeout(hoverTimeout);
      setTimeout(hideTooltip, 100);
    }
  });

  document.addEventListener('click', (e) => {
    if (currentTooltip && !e.target.closest('.nooks-tooltip')) {
      hideTooltip();
    }
  });
})();