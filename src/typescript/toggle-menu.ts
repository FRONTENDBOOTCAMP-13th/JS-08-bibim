document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar') as HTMLElement | null;
  const backdrop = document.getElementById('backdrop') as HTMLElement | null;
  const openBtn = document.getElementById(
    'open-sidebar',
  ) as HTMLButtonElement | null;
  const closeBtn = document.getElementById(
    'close-sidebar',
  ) as HTMLButtonElement | null;

  if (sidebar && backdrop && openBtn && closeBtn) {
    openBtn.addEventListener('click', () => {
      sidebar.classList.remove('translate-x-full');
      sidebar.classList.add('translate-x-0');
      backdrop.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('translate-x-0');
      sidebar.classList.add('translate-x-full');
      backdrop.classList.add('hidden');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('translate-x-0');
      sidebar.classList.add('translate-x-full');
      backdrop.classList.add('hidden');
    });
  }

  // Toggle point section
  const pointToggle = document.getElementById(
    'toggle-point',
  ) as HTMLElement | null;
  const pointSection = document.getElementById(
    'point-section',
  ) as HTMLElement | null;
  const pointIcon = document.getElementById(
    'point-toggle-icon',
  ) as SVGElement | null;

  if (pointToggle && pointSection && pointIcon) {
    pointToggle.addEventListener('click', () => {
      pointSection.classList.toggle('max-h-0');
      pointSection.classList.toggle('max-h-[1000px]');
      pointIcon.classList.toggle('rotate-180');
    });
  }

  // Toggle attendance section
  const attendanceToggle = document.getElementById(
    'toggle-attendance',
  ) as HTMLElement | null;
  const attendanceSection = document.getElementById(
    'attendance-section',
  ) as HTMLElement | null;
  const attendanceIcon = document.getElementById(
    'toggle-icon',
  ) as SVGElement | null;

  if (attendanceToggle && attendanceSection && attendanceIcon) {
    attendanceToggle.addEventListener('click', () => {
      attendanceSection.classList.toggle('max-h-0');
      attendanceSection.classList.toggle('max-h-[1000px]');
      attendanceIcon.classList.toggle('rotate-180');
    });
  }

  // Toggle article panel
  const articleToggle = document.getElementById(
    'toggle-header',
  ) as HTMLElement | null;
  const articleSection = document.getElementById(
    'article-panel',
  ) as HTMLElement | null;
  const articleIcon = document.getElementById(
    'article-toggle-icon',
  ) as SVGElement | null;

  if (articleToggle && articleSection && articleIcon) {
    articleToggle.addEventListener('click', () => {
      articleSection.classList.toggle('max-h-0');
      articleSection.classList.toggle('max-h-[1000px]');
      articleIcon.classList.toggle('rotate-180');
    });
  }
});
