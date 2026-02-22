(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  let lastTime = 0;
  let rafId = null;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
  }

  function getPointerPosition(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function handlePointerDown(e) {
    e.preventDefault();
    const pos = getPointerPosition(e);
    CharacterManager.setTarget(pos.x, pos.y);
  }

  function handlePointerMove(e) {
    if (e.buttons === 1 || (e.touches && e.touches.length > 0)) {
      e.preventDefault();
      const pos = getPointerPosition(e);
      CharacterManager.setTarget(pos.x, pos.y);
    }
  }

  function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 16.67, 1) * (1000 / 60);
    lastTime = timestamp;

    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    ItemManager.update(dt);
    ItemManager.draw(ctx);

    CharacterManager.update(dt);
    CharacterManager.draw(ctx);

    let maxNewLevel = 0;
    ItemManager.checkCollisions(CharacterManager.getBounds(), (item) => {
      const levelUp = Game.addScore(item.score);
      if (levelUp > maxNewLevel) maxNewLevel = levelUp;
    });
    if (maxNewLevel > 0) {
      for (let l = 1; l <= maxNewLevel; l++) {
        CharacterManager.tryEvolve(l);
      }
    }

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 140, 50);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('スコア: ' + Game.getScore(), 10, 22);
    ctx.fillText('Lv.' + Game.getLevel(), 10, 42);

    rafId = requestAnimationFrame(gameLoop);
  }

  async function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseup', () => {});
    canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });

    Game.init();
    await CharacterManager.init();
    ItemManager.init();

    lastTime = performance.now();
    rafId = requestAnimationFrame(gameLoop);
  }

  init();
})();
