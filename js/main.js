(function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const homeScreen = document.getElementById('homeScreen');
  const completionScreen = document.getElementById('completionScreen');
  const completionStats = document.getElementById('completionStats');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const gameOverStats = document.getElementById('gameOverStats');
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

    if (gameState === 'COMPLETING') {
      Effects.update(dtMs);
      Effects.drawCompletion(ctx);
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (gameState !== 'PLAYING') {
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (Game.isGameOver()) {
      gameState = 'GAME_OVER';
      if (gameOverStats) {
        const diffName = Game.difficulty ? Game.difficulty.name : 'ふつう';
        gameOverStats.textContent = `難易度: ${diffName}　レベル: ${Game.getLevel()}　スコア: ${Game.getScore()}　ライフ: ${Math.floor(Game.life)}`;
      }
      gameOverScreen.classList.remove('hidden');
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (Game.isCleared()) {
      gameState = 'COMPLETING';
      if (completionStats) {
        const diffName = Game.difficulty ? Game.difficulty.name : 'ふつう';
        completionStats.textContent = `難易度: ${diffName}　スコア: ${Game.getScore()}　残りライフ: ${Math.floor(Game.life)}`;
      }
      Effects.triggerCompletion(() => {
        completionScreen.classList.remove('hidden');
        gameState = 'COMPLETED';
      });
    }

    if (gameState !== 'PLAYING') {
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
      let totalScoreDelta = 0;
      const collected = ItemManager.checkCollisions(CharacterManager.getBounds());

      function processCollectedItem(item) {
        if (item.lifeHeal) {
          Game.healLife(item.lifeHeal);
          const healMsg = item.lifeHeal >= 1 ? 'おー！ライフ全回復！' : 'ライフ回復！';
          Effects.triggerLifeHeal(item.x, item.y, healMsg);
          return 0;
        }
        Effects.triggerFlash(item.score > 0, item.x, item.y);
        if (item.score < 0 && !window.DEBUG_MODE) {
          const dmg = Game.getLifeDamage(item);
          Game.damageLife(dmg);
        }
        const score = item.score || 0;
        return (window.DEBUG_MODE && score < 0) ? 0 : score;
      }
      for (const item of collected) {
        totalScoreDelta += processCollectedItem(item);
      }
      if (collected.length > 0) {
        const levelUp = Game.addScore(totalScoreDelta);
        if (levelUp > maxNewLevel) maxNewLevel = levelUp;
      }
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
    Effects.drawLifeHeal(ctx);

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
    if (window.DEBUG_MODE) {
      const el = document.getElementById('spawnMultiplier');
      window.DEBUG_SPAWN_MULTIPLIER = Math.max(1, parseFloat(el?.value) || 5);
    }
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
    Effects.completion.active = false;

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

    function addTapHandler(el, handler) {
      if (!el) return;
      let lastTouch = 0;
      el.addEventListener('click', (e) => {
        if (Date.now() - lastTouch < 400) return;
        handler();
      });
      el.addEventListener('touchend', (e) => {
        lastTouch = Date.now();
        handler();
      }, { passive: true });
    }
    addTapHandler(startBtn, startGame);
    addTapHandler(homeBtn, goHome);
    addTapHandler(retryBtn, goHome);
    addTapHandler(inGameHomeBtn, goHome);

    try {
      await CharacterManager.init();
    } catch (e) {
      console.error('CharacterManager.init failed:', e);
    }

    if (window.DEBUG_MODE) {
      homeScreen.classList.remove('hidden');
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
