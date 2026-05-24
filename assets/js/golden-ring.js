// Golden ring parallax: large glowing golden circle that follows mouse with very slow lerp
document.addEventListener('DOMContentLoaded', () => {
  const ring = document.getElementById('golden-ring');
  if (!ring) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 3;
  let currentX = targetX;
  let currentY = targetY;
  let visible = false;

  ring.style.left = currentX + 'px';
  ring.style.top = currentY + 'px';

  const animate = () => {
    // Very slow easing = heavy parallax feel, ring lags far behind cursor
    currentX += (targetX - currentX) * 0.035;
    currentY += (targetY - currentY) * 0.035;
    ring.style.left = currentX + 'px';
    ring.style.top = currentY + 'px';
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!visible) {
      ring.style.opacity = '1';
      visible = true;
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    ring.style.opacity = '0';
    visible = false;
  });
});
