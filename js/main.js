(function() {
  const STORAGE_KEY = 'moju_highscores';
  const GALLERY_KEY = 'moju_gallery';

  const Gallery = {
    load() {
      try {
        const raw = localStorage.getItem(GALLERY_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    },
    save(ids) {
      try {
        localStorage.setItem(GALLERY_KEY, JSON.stringify(ids));
      } catch (e) {
        console.warn('Gallery save failed:', e);
      }
    },
    add(characterId) {
      const ids = this.load();
      if (!ids.includes(characterId)) {
        ids.push(characterId);
        this.save(ids);
      }
    },
    has(characterId) {
      return this.load().includes(characterId);
    }
  };

  const HighScore = {
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        const def = { score: 0, level: 1 };
        return {
          easy: this._normalize(parsed.easy),
          normal: this._normalize(parsed.normal),
          hard: this._normalize(parsed.hard),
          endless: this._normalize(parsed.endless)
        };
      } catch {
        return { easy: { score: 0, level: 1 }, normal: { score: 0, level: 1 }, hard: { score: 0, level: 1 }, endless: { score: 0, level: 1 } };
      }
    },
    _normalize(v) {
      if (!v) return { score: 0, level: 1 };
      if (typeof v === 'number') return { score: v, level: 1 };
      return { score: v.score ?? 0, level: v.level ?? 1 };
    },
    save(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('HighScore save failed:', e);
      }
    },
    get(difficultyKey) {
      const s = this.load();
      return s[difficultyKey] ?? { score: 0, level: 1 };
    },
    update(difficultyKey, score, level) {
      const s = this.load();
      const prev = this.get(difficultyKey);
      const isBetter = score > prev.score || (score === prev.score && level > prev.level);
      if (isBetter) {
        s[difficultyKey] = { score, level };
        this.save(s);
        return true;
      }
      return false;
    }
  };

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const homeScreen = document.getElementById('homeScreen');
  const galleryScreen = document.getElementById('galleryScreen');
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryStats = document.getElementById('galleryStats');
  const completionScreen = document.getElementById('completionScreen');
  const completionStats = document.getElementById('completionStats');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const gameOverStats = document.getElementById('gameOverStats');
  const quitGameBtn = document.getElementById('quitGameBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const pauseScreen = document.getElementById('pauseScreen');
  const resumeBtn = document.getElementById('resumeBtn');
  const startBtn = document.getElementById('startBtn');
  const homeBtn = document.getElementById('homeBtn');
  const retryBtn = document.getElementById('retryBtn');
  const difficultySelect = document.getElementById('difficultySelect');
  const highScoreDisplay = document.getElementById('highScoreDisplay');
  let lastTime = 0;
  let rafId = null;
  let gameState = 'HOME';

  function renderGallery() {
    console.log('[Gallery] renderGallery called');
    if (!galleryGrid || !galleryStats) return;
    const order = typeof getGalleryOrder === 'function' ? getGalleryOrder() : [];
    const acquired = Gallery.load();
    const total = order.length;
    const count = acquired.length;
    const unknown = total - count;

    galleryStats.textContent = `${count} / ${total} 獲得　残り ${unknown} 体`;
    galleryGrid.innerHTML = '';

    for (const { id, level } of order) {
      const card = document.createElement('div');
      card.className = 'gallery-card' + (acquired.includes(id) ? '' : ' unknown');
      const char = CHARACTERS[id];
      if (acquired.includes(id) && char) {
        const img = document.createElement('img');
        img.src = char.image;
        img.alt = char.name;
        img.loading = 'lazy';
        card.appendChild(img);
        const nameEl = document.createElement('div');
        nameEl.className = 'gallery-card-name';
        nameEl.textContent = `Lv.${level} ${char.name}`;
        card.appendChild(nameEl);
      } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'gallery-card-placeholder';
        placeholder.textContent = '???';
        card.appendChild(placeholder);
        const nameEl = document.createElement('div');
        nameEl.className = 'gallery-card-name';
        nameEl.textContent = `Lv.${level}`;
        card.appendChild(nameEl);
      }
      galleryGrid.appendChild(card);
    }
  }

  function openGallery() {
    homeScreen.classList.add('hidden');
    homeScreen.style.display = 'none';
    renderGallery();
    galleryScreen.classList.remove('hidden');
    galleryScreen.style.display = 'flex';
    gameState = 'GALLERY';
  }

  function closeGallery() {
    galleryScreen.classList.add('hidden');
    galleryScreen.style.display = 'none';
    homeScreen.classList.remove('hidden');
    homeScreen.style.display = 'flex';
    gameState = 'HOME';
  }

  function updateHighScoreDisplay() {
    if (!highScoreDisplay) return;
    const data = HighScore.load();
    const names = { easy: 'かんたん', normal: 'ふつう', hard: 'むずかしい', endless: 'エンドレス' };
    const lines = ['easy', 'normal', 'hard', 'endless'].map(k => {
      const h = data[k] ?? { score: 0, level: 1 };
      return `${names[k]}: Lv.${h.level}　スコア${h.score}`;
    });
    highScoreDisplay.textContent = '最高記録\n' + lines.join('\n');
  }

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
    try {
    const dtMs = Math.min(timestamp - lastTime, 50);
    lastTime = timestamp;

    const w = window.innerWidth;
    const h = window.innerHeight;
    if (ctx) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#87ceeb';
      ctx.fillRect(0, 0, w, h);
    }

    if (gameState === 'COMPLETING') {
      Effects.update(dtMs);
      Effects.drawCompletion(ctx);
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (gameState === 'QUIT_RESULTS') {
      ctx.fillStyle = '#87ceeb';
      ctx.fillRect(0, 0, w, h);
      Effects.update(dtMs);
      Effects.drawQuitResult(ctx);
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (gameState === 'GAME_OVER_TRANSITION') {
      ctx.fillStyle = '#87ceeb';
      ctx.fillRect(0, 0, w, h);
      Effects.update(dtMs);
      Effects.drawGameOverResult(ctx);
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (gameState === 'PAUSED') {
      ItemManager.draw(ctx);
      CharacterManager.draw(ctx);
      pauseScreen.classList.remove('hidden');
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (gameState !== 'PLAYING') {
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (Game.isGameOver()) {
      gameState = 'GAME_OVER_TRANSITION';
      const diffKey = Game.difficultyKey || 'normal';
      const score = Game.getScore();
      const level = Game.getLevel();
      const isNewRecord = diffKey ? HighScore.update(diffKey, score, level) : false;
      if (gameOverStats) {
        const diffName = Game.difficulty ? Game.difficulty.name : 'ふつう';
        const high = diffKey ? HighScore.get(diffKey) : { score: 0, level: 1 };
        let text = `難易度: ${diffName}　レベル: ${level}　スコア: ${score}　ライフ: ${Math.floor(Game.life)}`;
        if (high.score > 0 || high.level > 1) text += `　最高: Lv.${high.level} ${high.score}` + (isNewRecord ? '（NEW!）' : '');
        gameOverStats.textContent = text;
      }
      quitGameBtn.classList.add('hidden');
      pauseBtn?.classList.add('hidden');
      Effects.triggerGameOverResult(score, level, isNewRecord, () => {
        gameOverScreen.classList.remove('hidden');
        gameState = 'GAME_OVER';
      });
      rafId = requestAnimationFrame(gameLoop);
      return;
    }

    if (Game.isCleared()) {
      gameState = 'COMPLETING';
      const diffKey = Game.difficultyKey || 'normal';
      const score = Game.getScore();
      const level = Game.getLevel();
      const isNewRecord = diffKey ? HighScore.update(diffKey, score, level) : false;
      if (completionStats) {
        const diffName = Game.difficulty ? Game.difficulty.name : 'ふつう';
        const high = diffKey ? HighScore.get(diffKey) : { score: 0, level: 1 };
        let text = `難易度: ${diffName}　スコア: ${score}　残りライフ: ${Math.floor(Game.life)}`;
        if (high.score > 0 || high.level > 1) text += `　最高: Lv.${high.level} ${high.score}` + (isNewRecord ? '（NEW!）' : '');
        completionStats.textContent = text;
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
          Gallery.add(evolutionInfo.newCharId);
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

    } catch (e) {
      console.error('gameLoop error:', e);
    }
    rafId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    try {
      const difficulty = difficultySelect?.value || 'normal';
      if (window.DEBUG_MODE) {
        const el = document.getElementById('spawnMultiplier');
        window.DEBUG_SPAWN_MULTIPLIER = Math.max(1, parseFloat(el?.value) || 5);
      }
      Game.init(difficulty);
      ItemManager.init(difficulty);
      CharacterManager.characterId = DEFAULT_CHARACTER_ID;
      Gallery.add(DEFAULT_CHARACTER_ID);
      CharacterManager.x = window.innerWidth / 2 - CharacterManager.size / 2;
      CharacterManager.y = window.innerHeight / 2 - CharacterManager.size / 2;
      CharacterManager.targetX = CharacterManager.x;
      CharacterManager.targetY = CharacterManager.y;
      Effects.flash.active = false;
      Effects.levelUp.active = false;
      Effects.evolution.active = false;
      Effects.completion.active = false;
      Effects.quitResult.active = false;
      Effects.gameOverResult.active = false;

      if (homeScreen) {
        homeScreen.classList.add('hidden');
        homeScreen.style.display = 'none';
      } else {
        console.error('startGame: homeScreen is null');
      }
      if (quitGameBtn) {
        quitGameBtn.classList.remove('hidden');
        quitGameBtn.style.display = 'block';
      } else {
        console.error('startGame: quitGameBtn is null');
      }
      if (pauseBtn) {
        pauseBtn.classList.remove('hidden');
        pauseBtn.style.display = 'block';
      }
      pauseScreen.classList.add('hidden');
      gameState = 'PLAYING';
    } catch (e) {
      console.error('startGame error:', e);
    }
  }

  function quitGame() {
    if (gameState === 'PLAYING') {
      const diffKey = Game.difficultyKey || 'normal';
      const score = Game.getScore();
      const level = Game.getLevel();
      const isNewRecord = HighScore.update(diffKey, score, level);
      gameState = 'QUIT_RESULTS';
      quitGameBtn.classList.add('hidden');
      Effects.triggerQuitResult(score, level, isNewRecord, goHome);
    }
  }

  function pauseGame() {
    if (gameState === 'PLAYING') {
      gameState = 'PAUSED';
      pauseScreen.classList.remove('hidden');
    }
  }

  function resumeGame() {
    if (gameState === 'PAUSED') {
      gameState = 'PLAYING';
      pauseScreen.classList.add('hidden');
    }
  }

  function goHome() {
    completionScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    galleryScreen?.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    quitGameBtn.classList.add('hidden');
    quitGameBtn.style.display = 'none';
    if (pauseBtn) {
      pauseBtn.classList.add('hidden');
      pauseBtn.style.display = 'none';
    }
    homeScreen.classList.remove('hidden');
    homeScreen.style.display = 'flex';
    gameState = 'HOME';
    updateHighScoreDisplay();
  }

  async function init() {
    try {
    if (!canvas || !ctx) {
      console.error('init: canvas or ctx is null');
    }
    if (!startBtn) console.error('init: startBtn is null');
    if (!quitGameBtn) console.error('init: quitGameBtn is null');
    if (!homeScreen) console.error('init: homeScreen is null');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function addTapHandler(el, handler) {
      if (!el) {
        console.warn('addTapHandler: element is null');
        return;
      }
      let lastTouch = 0;
      const safeHandler = () => {
        try {
          handler();
        } catch (e) {
          console.error('addTapHandler handler error:', e);
        }
      };
      el.addEventListener('click', (e) => {
        if (Date.now() - lastTouch < 400) return;
        safeHandler();
      });
      el.addEventListener('touchend', (e) => {
        lastTouch = Date.now();
        safeHandler();
      }, { passive: true });
    }
    addTapHandler(startBtn, startGame);
    const galleryBtn = document.getElementById('galleryBtn');
    const galleryBackBtn = document.getElementById('galleryBackBtn');
    addTapHandler(galleryBtn, openGallery);
    if (galleryBackBtn) {
      console.log('[Gallery] galleryBackBtn found, attaching handlers');
      galleryBackBtn.addEventListener('pointerdown', (e) => {
        console.log('[Gallery] pointerdown on galleryBackBtn');
        e.preventDefault();
        e.stopPropagation();
        closeGallery();
      }, { passive: false });
      galleryBackBtn.addEventListener('click', (e) => {
        console.log('[Gallery] click on galleryBackBtn');
        e.preventDefault();
        closeGallery();
      });
    } else {
      console.warn('[Gallery] galleryBackBtn not found');
    }
    addTapHandler(homeBtn, goHome);
    addTapHandler(retryBtn, goHome);
    addTapHandler(quitGameBtn, quitGame);
    addTapHandler(pauseBtn, pauseGame);
    addTapHandler(resumeBtn, resumeGame);

    try {
      await CharacterManager.init();
    } catch (e) {
      console.error('CharacterManager.init failed:', e);
    }

    updateHighScoreDisplay();
    difficultySelect?.addEventListener('change', updateHighScoreDisplay);

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
    } catch (e) {
      console.error('init error:', e);
    }
  }

  init().catch(e => console.error('init failed:', e));
})();
