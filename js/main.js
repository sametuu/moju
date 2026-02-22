(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const homeScreen = document.getElementById('homeScreen');
  const completionScreen = document.getElementById('completionScreen');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const inGameHomeBtn = document.getElementById('inGameHomeBtn');
  const startBtn = document.getElementById('startBtn');
  const homeBtn = document.getElementById('homeBtn');
  const retryBtn = document.getElementById('retryBtn');
  const difficultySelect = document.getElementById('difficultySelect');
  let lastTime = 0;
  let rafId = null;
  let gameState = 'HOME';

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

    if (gameState !== 'PLAYING') {
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (Game.isGameOver()) {
      gameState = 'GAME_OVER';
      gameOverScreen.classList.remove('hidden');
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (Game.isCleared()) {
      gameState = 'COMPLETED';
      completionScreen.classList.remove('hidden');
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

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
        if (item.score < 0) {
          const dmg = Game.getLifeDamage(item);
          Game.damageLife(dmg);
        }
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
          Game.evolutionCount++;
          ItemManager.increaseSpeed();
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

    const lifePct = Game.life / Game.maxLife;
    const lifeBarW = 120;
    const lifeBarH = 12;
    const lifeX = w - lifeBarW - 16;
    const lifeY = 10;
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(lifeX - 4, lifeY - 2, lifeBarW + 8, lifeBarH + 20);
    ctx.fillStyle = '#fff';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ライフ', lifeX, lifeY + 10);
    ctx.fillStyle = 'rgba(60,60,60,0.9)';
    ctx.fillRect(lifeX, lifeY + 14, lifeBarW, lifeBarH);
    ctx.fillStyle = lifePct > 0.3 ? '#4ade80' : lifePct > 0.1 ? '#fbbf24' : '#ef4444';
    ctx.fillRect(lifeX, lifeY + 14, lifeBarW * lifePct, lifeBarH);

    if (window.DEBUG_MODE) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('DEBUG', w - 10, h - 10);
    }

    rafId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    const difficulty = difficultySelect.value;
    Game.init(difficulty);
    ItemManager.init(difficulty);
    CharacterManager.characterId = DEFAULT_CHARACTER_ID;
    CharacterManager.x = window.innerWidth / 2 - CharacterManager.size / 2;
    CharacterManager.y = window.innerHeight / 2 - CharacterManager.size / 2;
    CharacterManager.targetX = CharacterManager.x;
    CharacterManager.targetY = CharacterManager.y;
    Effects.flash.active = false;
    Effects.levelUp.active = false;
    Effects.evolution.active = false;

    homeScreen.classList.add('hidden');
    homeScreen.style.display = 'none';
    inGameHomeBtn.classList.remove('hidden');
    inGameHomeBtn.style.display = 'block';
    gameState = 'PLAYING';
  }

  function goHome() {
    completionScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    inGameHomeBtn.classList.add('hidden');
    inGameHomeBtn.style.display = 'none';
    homeScreen.classList.remove('hidden');
    homeScreen.style.display = 'flex';
    gameState = 'HOME';
  }

  async function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (startBtn) startBtn.addEventListener('click', startGame);
    if (homeBtn) homeBtn.addEventListener('click', goHome);
    if (retryBtn) retryBtn.addEventListener('click', goHome);
    if (inGameHomeBtn) inGameHomeBtn.addEventListener('click', goHome);

    try {
      await CharacterManager.init();
    } catch (e) {
      console.error('CharacterManager.init failed:', e);
    }

    if (window.DEBUG_MODE) {
      homeScreen.classList.add('hidden');
      inGameHomeBtn.classList.remove('hidden');
      gameState = 'PLAYING';
      const difficulty = difficultySelect.value;
      Game.init(difficulty);
      ItemManager.init(difficulty);
      CharacterManager.characterId = DEFAULT_CHARACTER_ID;
      CharacterManager.x = window.innerWidth / 2 - CharacterManager.size / 2;
      CharacterManager.y = window.innerHeight / 2 - CharacterManager.size / 2;
      CharacterManager.targetX = CharacterManager.x;
      CharacterManager.targetY = CharacterManager.y;
    }

    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseup', () => {});
    canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });

    lastTime = performance.now();
    rafId = requestAnimationFrame(gameLoop);
  }

  init();
})();
