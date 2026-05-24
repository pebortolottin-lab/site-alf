// IntersectionObserver: starts paused .scroll-item animations when they enter the viewport
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.scroll-item').forEach(el => observer.observe(el));

  // IAL score bar trigger
  const scoreSection = document.getElementById('ial-score-section');
  if (scoreSection) {
    const scoreObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          scoreObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    scoreObserver.observe(scoreSection);
  }
});
