(function () {
  let hoverTimeout = null;
  let currentTooltip = null;

  function isSaveable(url) {
    return url && !url.startsWith('#') && !url.startsWith('javascript:') && !url.startsWith('chrome');
  }

  function createTooltip(link) {
    const tooltip = document.createElement('div');
    tooltip.className = 'nooks-tooltip';
    tooltip.innerHTML = `
      <button class="nooks-save-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        Nooks
      </button>
    `;

    const btn = tooltip.querySelector('.nooks-save-btn');
    let saving = false;

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (saving) return;
      saving = true;

      btn.textContent = 'Saving...';
      btn.disabled = true;

      try {
        await chrome.runtime.sendMessage({ action: 'saveLink', url: link.href });
        btn.textContent = 'Saved!';
        btn.classList.add('nooks-saved');
        setTimeout(() => {
          tooltip.remove();
          currentTooltip = null;
        }, 1200);
      } catch {
        btn.textContent = 'Failed';
        setTimeout(() => {
          btn.textContent = 'Nooks';
          btn.disabled = false;
          saving = false;
        }, 2000);
      }
    });

    return tooltip;
  }

  function showTooltip(e, link) {
    if (!isSaveable(link.href)) return;
    hideTooltip();

    const rect = link.getBoundingClientRect();
    const tooltip = createTooltip(link);

    tooltip.style.cssText = `
      position: fixed;
      left: ${rect.left + window.scrollX}px;
      top: ${rect.top + window.scrollY - 40}px;
      z-index: 999999;
      animation: nooksFadeIn 0.15s ease;
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

  function getClosestLink(el) {
    while (el && el !== document.body) {
      if (el.tagName === 'A') return el;
      el = el.parentElement;
    }
    return null;
  }

  document.addEventListener('mouseover', (e) => {
    const link = getClosestLink(e.target);
    if (!link) return;

    hoverTimeout = setTimeout(() => {
      showTooltip(e, link);
    }, 400);
  });

  document.addEventListener('mouseout', (e) => {
    const link = getClosestLink(e.target);
    if (!link) return;

    clearTimeout(hoverTimeout);
    setTimeout(hideTooltip, 150);
  });

  document.addEventListener('click', (e) => {
    if (currentTooltip && !e.target.closest('.nooks-tooltip')) {
      hideTooltip();
    }
  });
})();
