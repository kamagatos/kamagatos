(() => {
  const canvas = document.querySelector('#orbit');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const pointer = { x: 0, y: 0, active: false };
  let particles = [];
  let frame;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(devicePixelRatio, 2);
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    reset();
  }
  function reset() {
    const { width, height } = canvas.getBoundingClientRect();
    particles = Array.from({ length: Math.min(160, Math.floor(width / 5)) }, (_, i) => {
      const angle = (i / 160) * Math.PI * 2;
      const radius = 35 + Math.random() * Math.min(width, height) * .42;
      return { x: width / 2 + Math.cos(angle) * radius, y: height / 2 + Math.sin(angle) * radius, px: 0, py: 0, vx: Math.cos(angle + Math.PI / 2) * .35, vy: Math.sin(angle + Math.PI / 2) * .35 };
    });
    ctx.fillStyle = '#111713'; ctx.fillRect(0, 0, width, height);
  }
  function tick() {
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = 'rgba(17,23,19,.055)'; ctx.fillRect(0, 0, rect.width, rect.height);
    const target = pointer.active ? pointer : { x: rect.width / 2, y: rect.height / 2 };
    particles.forEach((p, i) => {
      p.px = p.x; p.py = p.y;
      const dx = target.x - p.x, dy = target.y - p.y;
      const distance = Math.max(45, Math.hypot(dx, dy));
      const pull = pointer.active ? 1.8 : .7;
      p.vx += dx / distance * pull / Math.sqrt(distance);
      p.vy += dy / distance * pull / Math.sqrt(distance);
      p.vx *= .995; p.vy *= .995; p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > rect.width || p.y < 0 || p.y > rect.height) { p.x = rect.width / 2 + (Math.random() - .5) * 80; p.y = rect.height / 2 + (Math.random() - .5) * 80; p.px = p.x; p.py = p.y; }
      ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `hsla(${12 + i % 35},75%,62%,.52)`; ctx.lineWidth = .8; ctx.stroke();
    });
    frame = requestAnimationFrame(tick);
  }
  function point(event) { const r = canvas.getBoundingClientRect(); const p = event.touches?.[0] || event; pointer.x = p.clientX - r.left; pointer.y = p.clientY - r.top; pointer.active = true; }
  canvas.addEventListener('pointermove', point); canvas.addEventListener('pointerleave', () => pointer.active = false);
  document.querySelector('#reset-orbit')?.addEventListener('click', reset);
  addEventListener('resize', resize, { passive: true });
  resize(); cancelAnimationFrame(frame); tick();
})();

