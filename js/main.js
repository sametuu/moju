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

  function drawExpBar(ctx) {
    const barW = Math.min(200, window.innerWidth - 30);
    const barH = 10;
    const x = 10;
    const y = 54;
    const progress = Game.getExpProgress();
    const remaining = Game.getRemainingToNextLevel();

    ctx.fillStyle = 'rgba(60,60,60,0.9)';
    ctx.fillRect(x, y, barW, barH);

    ctx.fillStyle = '#4ade80';
    ctx.fillRect(x, y, barW * Math.min(1, progress), barH);

    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barW, barH);

    ctx.fillStyle = '#fff';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('次のレベルまであと ' + remaining, x, y + barH + 14);
  }

  function gameLoop(timestamp) {
    const dtMs = Math.min(timestamp - lastTime, 50);
    lastTime = timestamp;

    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, w, h);

    const evolutionActive = Effects.isEvolutionActive();

    if (!evolutionActive) {
      ItemManager.update(dtMs / 1000);
      ItemManager.draw(ctx);

      CharacterManager.update(dtMs / 1000);
      CharacterManager.draw(ctx);

      let maxNewLevel = 0;
      let evolutionInfo = null;
      ItemManager.checkCollisions(CharacterManager.getBounds(), (item) => {
        Effects.triggerFlash(item.score > 0, item.x, item.y);
        const levelUp = Game.addScore(item.score);
        if (levelUp > maxNewLevel) maxNewLevel = levelUp;
      });
      if (maxNewLevel > 0) {
        Effects.triggerLevelUp();
      }
      if (maxNewLevel > 0) {
        for (let l = 1; l <= maxNewLevel; l++) {
          const evo = CharacterManager.tryEvolve(l);
          if (evo) evolutionInfo = evo;
        }
        if (evolutionInfo) {
          Effects.triggerEvolution(evolutionInfo.oldCharId, evolutionInfo.newCharId, () => {
            CharacterManager.evolveTo(evolutionInfo.newCharId);
          });
        }
      }
    } else {
      Effects.drawEvolution(ctx, CharacterManager.x, CharacterManager.y, CharacterManager.size);
    }

    Effects.update(dtMs);
    Effects.drawFlash(ctx);
    Effects.drawLevelUp(ctx);

    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, 220, 82);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('スコア: ' + Game.getScore(), 10, 22);
    ctx.fillText('Lv.' + Game.getLevel(), 10, 42);
    drawExpBar(ctx);

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
