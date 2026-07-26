(function () {
  let hoverTimeout = null;
  let hideTimeout = null;
  let currentTooltip = null;
  let currentLink = null;

  function isSaveable(url) {
    return url && !url.startsWith('#') && !url.startsWith('javascript:') && !url.startsWith('chrome') && !url.startsWith('about');
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

      btn.disabled = true;
      btn.textContent = 'Saving...';

      try {
        await chrome.runtime.sendMessage({ action: 'saveLink', url: link.href, overrides: { title: document.title } });
        btn.textContent = 'Saved!';
        btn.classList.add('nooks-saved');
        setTimeout(() => {
          tooltip.remove();
          currentTooltip = null;
          currentLink = null;
        }, 1200);
      } catch {
        btn.textContent = 'Failed';
        setTimeout(() => {
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Nooks`;
          btn.disabled = false;
          saving = false;
        }, 2000);
      }
    });

    return tooltip;
  }

  function showTooltip(link) {
    if (!isSaveable(link.href)) return;
    if (currentTooltip) hideTooltip();

    const rect = link.getBoundingClientRect();
    const tooltip = createTooltip(link);
    currentLink = link;
    currentTooltip = tooltip;

    document.body.appendChild(tooltip);

    // Position above the link, clamped to viewport
    let top = rect.top - tooltip.offsetHeight - 6;
    if (top < 6) {
      top = rect.bottom + 6;
    }
    let left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
    left = Math.max(6, Math.min(left, window.innerWidth - tooltip.offsetWidth - 6));

    tooltip.style.cssText = `
      position: fixed;
      left: ${left}px;
      top: ${top}px;
      z-index: 999999;
      pointer-events: auto;
      opacity: 1;
      visibility: visible;
    `;
    tooltip.classList.add('nooks-tooltip-visible');
  }

  function hideTooltip() {
    if (currentTooltip) {
      currentTooltip.remove();
      currentTooltip = null;
      currentLink = null;
    }
  }

  function getClosestLink(el) {
    while (el && el !== document.body) {
      if (el.tagName === 'A') return el;
      el = el.parentElement;
    }
    return null;
  }

  // Show tooltip after 500ms hover on a link
  document.addEventListener('mouseover', (e) => {
    const target = e.target;

    // If entering the tooltip itself, cancel hide
    if (currentTooltip && currentTooltip.contains(target)) {
      clearTimeout(hideTimeout);
      return;
    }

    const link = getClosestLink(target);
    if (!link) return;

    clearTimeout(hoverTimeout);
    clearTimeout(hideTimeout);

    hoverTimeout = setTimeout(() => showTooltip(link), 500);
  });

  // Hide when leaving a link, but not if entering the tooltip
  document.addEventListener('mouseout', (e) => {
    const target = e.target;
    const related = e.relatedTarget;

    // If leaving the tooltip, start hide timer
    if (currentTooltip && currentTooltip.contains(target)) {
      if (currentLink && related && currentLink.contains(related)) return;
      clearTimeout(hoverTimeout);
      hideTimeout = setTimeout(hideTooltip, 200);
      return;
    }

    const link = getClosestLink(target);
    if (!link || link !== currentLink) return;

    // If entering the tooltip, don't hide
    if (currentTooltip && related && currentTooltip.contains(related)) return;

    clearTimeout(hoverTimeout);
    hideTimeout = setTimeout(hideTooltip, 200);
  });

  // Click outside tooltip closes it
  document.addEventListener('click', (e) => {
    if (currentTooltip && !currentTooltip.contains(e.target)) {
      hideTooltip();
    }
  });
})();
