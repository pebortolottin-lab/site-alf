/* ── CURSOR TRAIL — ALF Site ──────────────────────────────────────────────────
   Snake-style cursor trail: anel + ponto central + cauda de 18 segmentos.
   Cores: laranja ALF (orange-500 / #f97316).
   Sem dependências externas — JS puro.
─────────────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  // Se o dispositivo não tem mouse (touch/mobile), encerra sem fazer nada
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

  // ── SEGMENTOS DA CAUDA ────────────────────────────────────────────────────
  // 18 bolinhas formam a cauda tipo cobra após o cursor.
  const SEGMENTS = 18;

  const segEls = [];
  const segX   = new Array(SEGMENTS);
  const segY   = new Array(SEGMENTS);
  let sizeBoost = 0;

  // Cria um segmento: cada um fica menor e mais transparente conforme afasta
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
      // Cor: orange-400 com opacidade variável — mais próximo = mais brilhante
      `background:rgba(251,146,60,${Math.min(0.95, 0.65 + 0.02 * (SEGMENTS - i))});`,
      'box-shadow:0 0 0 2px rgba(194,65,12,0.08),0 0 18px rgba(249,115,22,0.25),inset 0 0 6px rgba(255,255,255,0.06);',
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

  // Atualiza o tamanho dos segmentos quando o cursor passa sobre elementos
  const updateSegmentSizes = () => {
    for (let i = 0; i < SEGMENTS; i++) {
      const base = Math.max(4, 12 - i * 0.5);
      const size = base + sizeBoost;
      segEls[i].style.width  = size + 'px';
      segEls[i].style.height = size + 'px';
    }
  };

  // Posiciona tudo imediatamente (sem animação) — usado na inicialização
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

  // ── LOOP DE ANIMAÇÃO ──────────────────────────────────────────────────────
  // 0.22 / 0.28 controlam a "viscosidade":
  //   maior = segue mais rápido | menor = mais arrasto
  const animate = () => {
    // Anel: segue com suavidade
    currentX += (targetX - currentX) * 0.22;
    currentY += (targetY - currentY) * 0.22;
    ring.style.left = currentX + 'px';
    ring.style.top  = currentY + 'px';

    // Ponto: fica exatamente no cursor (sem atraso)
    dot.style.left = targetX + 'px';
    dot.style.top  = targetY + 'px';

    // Cauda: efeito cobra — cada segmento segue o anterior
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

  // ── EVENTOS ───────────────────────────────────────────────────────────────

  // Posição alvo atualizada ao mover o mouse
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  // Mostra/oculta ao entrar e sair da janela
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

  // Hover em elementos interativos: anel fica maior e mais brilhante
  const hoverTargets = document.querySelectorAll(
    'a, button, [role="button"], input, select, textarea, label, .cursor-glow'
  );
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width       = '44px';
      ring.style.height      = '44px';
      ring.style.borderColor = 'rgba(251, 146, 60, 1)';
      ring.style.boxShadow   = '0 0 0 3px rgba(251,146,60,0.15), 0 0 60px rgba(249,115,22,0.4)';
      sizeBoost = 2;
      updateSegmentSizes();
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width       = '28px';
      ring.style.height      = '28px';
      ring.style.borderColor = 'rgba(249, 115, 22, 0.85)';
      ring.style.boxShadow   = '0 0 0 2px rgba(194,65,12,0.15), 0 0 30px rgba(249,115,22,0.25)';
      sizeBoost = 0;
      updateSegmentSizes();
    });
  });

  // Feedback de clique: anel comprime levemente
  window.addEventListener('mousedown', () => {
    ring.style.transform = 'translate(-50%, -50%) scale(0.88)';
  });
  window.addEventListener('mouseup', () => {
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  // Pausa a animação quando a aba fica em segundo plano (economiza CPU)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(animate);
    }
  });

  // Inicia
  snapToPosition(targetX, targetY);
  updateSegmentSizes();
  rafId = requestAnimationFrame(animate);
});
