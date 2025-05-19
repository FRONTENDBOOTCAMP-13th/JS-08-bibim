document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  const openBtn = document.getElementById('open-sidebar');
  const closeBtn = document.getElementById('close-sidebar');

  openBtn?.addEventListener('click', () => {
    sidebar?.classList.remove('translate-x-full');
    sidebar?.classList.add('translate-x-0');
    backdrop?.classList.remove('hidden');
  });

  closeBtn?.addEventListener('click', () => {
    sidebar?.classList.remove('translate-x-0');
    sidebar?.classList.add('translate-x-full');
    backdrop?.classList.add('hidden');
  });

  backdrop?.addEventListener('click', () => {
    sidebar?.classList.remove('translate-x-0');
    sidebar?.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
  });
});

// Toggle point section
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-point');
  const section = document.getElementById('point-section');
  const icon = document.getElementById('point-toggle-icon');

  toggleBtn?.addEventListener('click', () => {
    section?.classList.toggle('max-h-0');
    section?.classList.toggle('max-h-[1000px]');
    icon?.classList.toggle('rotate-180');
  });
});

// Toggle article panel
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-header');
  const section = document.getElementById('article-panel');
  const icon = document.getElementById('article-toggle-icon');

  toggleBtn?.addEventListener('click', () => {
    section?.classList.toggle('max-h-0');
    section?.classList.toggle('max-h-[1000px]');
    icon?.classList.toggle('rotate-180');
  });
});

// Toggle attendance section
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-attendance');
  const section = document.getElementById('attendance-section');
  const icon = document.getElementById('toggle-icon');

  toggleBtn?.addEventListener('click', () => {
    section?.classList.toggle('max-h-0');
    section?.classList.toggle('max-h-[1000px]');
    icon?.classList.toggle('rotate-180');
  });
});
