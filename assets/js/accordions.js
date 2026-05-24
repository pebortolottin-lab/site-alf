// Accordion expand/collapse for case study cards
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-accordion-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id = trigger.getAttribute('data-accordion-trigger');
      const panel = document.getElementById('panel-' + id);
      if (!panel) return;
      const isOpen = panel.getAttribute('data-open') === 'true';
      // Close all panels
      document.querySelectorAll('.accordion-panel[data-open="true"]').forEach(p => {
        p.setAttribute('data-open', 'false');
        p.style.maxHeight = '0';
      });
      document.querySelectorAll('[data-accordion-icon]').forEach(icon => {
        icon.style.transform = 'rotate(0deg)';
      });
      // Open clicked panel if it was closed
      if (!isOpen) {
        panel.setAttribute('data-open', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        const icon = trigger.querySelector('[data-accordion-icon]');
        if (icon) icon.style.transform = 'rotate(45deg)';
      }
    });
  });
});
