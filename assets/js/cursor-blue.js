/* ── CURSOR TRAIL — Design System ─────────────────────────────────────────────
   Snake-style cursor trail: anel + ponto central + cauda de 18 segmentos.
   Cores: azul ALF (blue-500 / #3b82f6).
   Sem dependências externas — JS puro.
─────────────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  if (!window.matchMedia('(pointer: fine)').matches) {
    ring.style.display = 'none';
    dot.style.display  = 'none';
    return;
  }

  let rafId;
  let targetX  = window.innerWidth  / 2;
  let targetY  = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  const SEGMENTS = 18;
  const segEls = [];
  const segX   = new Array(SEGMENTS);
  const segY   = new Array(SEGMENTS);
  let sizeBoost = 0;

  const createSegment = (i) => {
    const el       = document.createElement('div');
    const baseSize = Math.max(4, 12 - i * 0.5);
    const opacity  = Math.max(0.15, 0.9 - i * 0.04);
    el.style.cssText = [
      'pointer-events:none;',
      'position:fixed;',
      'top:0;',
      'left:0;',
      'z-index:9998;',
      `width:${baseSize}px;`,
      `height:${baseSize}px;`,
      'border-radius:9999px;',
      'transform:translate(-50%,-50%);',
      // Cor: blue-300 com opacidade variável — mais próximo = mais brilhante
      `background:rgba(147,197,253,${Math.min(0.95, 0.65 + 0.02 * (SEGMENTS - i))});`,
      'box-shadow:0 0 0 2px rgba(29,78,216,0.08),0 0 18px rgba(59,130,246,0.25),inset 0 0 6px rgba(255,255,255,0.06);',
      `opacity:${opacity};`,
      'transition:opacity .2s;',
      'will-change:left,top;'
    ].join('');
    document.body.appendChild(el);
    return el;
  };

  for (let i = 0; i < SEGMENTS; i++) {
    segEls[i] = createSegment(i);
    segX[i]   = targetX;
    segY[i]   = targetY;
  }

  const updateSegmentSizes = () => {
    for (let i = 0; i < SEGMENTS; i++) {
      const base = Math.max(4, 12 - i * 0.5);
      const size = base + sizeBoost;
      segEls[i].style.width  = size + 'px';
      segEls[i].style.height = size + 'px';
    }
  };

  const snapToPosition = (x, y) => {
    ring.style.left = x + 'px';
    ring.style.top  = y + 'px';
    dot.style.left  = x + 'px';
    dot.style.top   = y + 'px';
    for (let i = 0; i < SEGMENTS; i++) {
      segX[i] = x; segY[i] = y;
      segEls[i].style.left = x + 'px';
      segEls[i].style.top  = y + 'px';
    }
  };

  const animate = () => {
    currentX += (targetX - currentX) * 0.22;
    currentY += (targetY - currentY) * 0.22;
    ring.style.left = currentX + 'px';
    ring.style.top  = currentY + 'px';

    dot.style.left = targetX + 'px';
    dot.style.top  = targetY + 'px';

    segX[0] += (targetX - segX[0]) * 0.28;
    segY[0] += (targetY - segY[0]) * 0.28;

    for (let i = 1; i < SEGMENTS; i++) {
      segX[i] += (segX[i - 1] - segX[i]) * 0.28;
      segY[i] += (segY[i - 1] - segY[i]) * 0.28;
    }

    for (let i = 0; i < SEGMENTS; i++) {
      segEls[i].style.left = segX[i] + 'px';
      segEls[i].style.top  = segY[i] + 'px';
    }

    rafId = requestAnimationFrame(animate);
  };

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseenter', () => {
    ring.style.opacity = '.9';
    dot.style.opacity  = '.9';
    for (let i = 0; i < SEGMENTS; i++) {
      segEls[i].style.opacity = Math.max(0.15, 0.9 - i * 0.04);
    }
  });
  window.addEventListener('mouseleave', () => {
    ring.style.opacity = '0';
    dot.style.opacity  = '0';
    for (const el of segEls) el.style.opacity = '0';
  });

  const hoverTargets = document.querySelectorAll(
    'a, button, [role="button"], input, select, textarea, label, .cursor-glow'
  );
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width       = '44px';
      ring.style.height      = '44px';
      ring.style.borderColor = 'rgba(147, 197, 253, 1)';
      ring.style.boxShadow   = '0 0 0 3px rgba(147,197,253,0.15), 0 0 60px rgba(59,130,246,0.4)';
      sizeBoost = 2;
      updateSegmentSizes();
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width       = '28px';
      ring.style.height      = '28px';
      ring.style.borderColor = 'rgba(59, 130, 246, 0.85)';
      ring.style.boxShadow   = '0 0 0 2px rgba(29,78,216,0.15), 0 0 30px rgba(59,130,246,0.25)';
      sizeBoost = 0;
      updateSegmentSizes();
    });
  });

  window.addEventListener('mousedown', () => {
    ring.style.transform = 'translate(-50%, -50%) scale(0.88)';
  });
  window.addEventListener('mouseup', () => {
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(animate);
    }
  });

  // Aparece ao primeiro movimento do mouse
  window.addEventListener('mousemove', function show() {
    ring.style.opacity = '.9';
    dot.style.opacity  = '.9';
    window.removeEventListener('mousemove', show);
  }, { passive: true });

  snapToPosition(targetX, targetY);
  updateSegmentSizes();
  rafId = requestAnimationFrame(animate);
});
