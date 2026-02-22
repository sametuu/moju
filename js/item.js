const ItemManager = {
  items: [],
  spawnInterval: 900,
  lastSpawn: 0,
  fallSpeed: 2.8,
  itemSize: 40,
  totalWeight: 0,
  imageCache: {},

  init(difficultyKey) {
    this.items = [];
    this.lastSpawn = 0;
    const diff = DIFFICULTIES[difficultyKey || DEFAULT_DIFFICULTY] || DIFFICULTIES.normal;
    this.itemRates = diff.itemRates || {
      initial: { plus: 0.80, damage: 0.18, heal: 0.02 },
      final: { plus: 0.60, damage: 0.38, heal: 0.02 },
      finalLevel: 40
    };
    this.baseFallSpeed = diff.fallSpeed;
    this.speedPerLevel = diff.speedPerLevel ?? 0.08;
    this.maxFallSpeed = diff.maxFallSpeed ?? 6.5;
    this.fallSpeed = diff.fallSpeed;
    this.spawnInterval = diff.spawnInterval;
    this.itemSize = diff.itemSize;
    this.totalWeight = ITEMS.reduce((sum, item) => sum + item.weight, 0);
    this.preloadImages();
  },

  updateFallSpeed() {
    const level = Game.getLevel();
    this.fallSpeed = Math.min(
      this.baseFallSpeed + (level - 1) * this.speedPerLevel,
      this.maxFallSpeed
    );
  },

  preloadImages() {
    const seen = new Set();
    for (const item of ITEMS) {
      if (item.emoji && !seen.has(item.emoji)) {
        seen.add(item.emoji);
        const img = new Image();
        img.src = `${EMOJI_CDN}/${item.emoji}.png`;
        this.imageCache[item.emoji] = img;
      }
    }
  },

  getCategoryRates() {
    const level = Game.getLevel();
    const { initial, final: fin, finalLevel } = this.itemRates;
    const t = Math.min(1, (level - 1) / Math.max(1, finalLevel - 1));
    return {
      plus: initial.plus + (fin.plus - initial.plus) * t,
      damage: initial.damage + (fin.damage - initial.damage) * t,
      heal: initial.heal + (fin.heal - initial.heal) * t
    };
  },

  getRandomItemByCategory(category) {
    const level = Game.getLevel();
    let pool;
    if (category === 'plus') {
      pool = ITEMS.filter(i => (i.unlockLevel ?? 1) <= level && (i.score ?? 0) > 0 && !i.lifeHeal);
    } else if (category === 'damage') {
      pool = ITEMS.filter(i => (i.unlockLevel ?? 1) <= level && (i.score ?? 0) < 0);
    } else {
      pool = ITEMS.filter(i => (i.unlockLevel ?? 1) <= level && i.lifeHeal);
    }
    if (pool.length === 0) {
      const fallback = ITEMS.find(i => (i.unlockLevel ?? 1) <= level);
      return fallback ? { ...fallback } : { ...ITEMS[0] };
    }
    const totalWeight = pool.reduce((s, i) => s + (i.weight || 1), 0);
    let r = Math.random() * totalWeight;
    for (const item of pool) {
      r -= item.weight || 1;
      if (r <= 0) return { ...item };
    }
    return { ...pool[pool.length - 1] };
  },

  spawn() {
    const rates = this.getCategoryRates();
    const r = Math.random();
    let category;
    if (r < rates.plus) category = 'plus';
    else if (r < rates.plus + rates.damage) category = 'damage';
    else category = 'heal';
    const item = this.getRandomItemByCategory(category);
    const x = window.DEBUG_MODE
      ? window.innerWidth / 2
      : Math.random() * (window.innerWidth - this.itemSize) + this.itemSize / 2;
    this.items.push({
      ...item,
      x,
      y: -this.itemSize
    });
  },

  update(dt) {
    this.updateFallSpeed();
    const now = Date.now();
    const mult = (window.DEBUG_MODE && window.DEBUG_SPAWN_MULTIPLIER) ? window.DEBUG_SPAWN_MULTIPLIER : 1;
    const interval = this.spawnInterval / mult;
    if (now - this.lastSpawn > interval) {
      this.spawn();
      this.lastSpawn = now;
    }

    for (let i = this.items.length - 1; i >= 0; i--) {
      this.items[i].y += this.fallSpeed;
      if (this.items[i].y > window.innerHeight + this.itemSize) {
        this.items.splice(i, 1);
      }
    }
  },

  draw(ctx) {
    const size = this.itemSize;
    const half = size / 2;
    for (const item of this.items) {
      const img = item.emoji ? this.imageCache[item.emoji] : null;
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, item.x - half, item.y - half, size, size);
      } else {
        ctx.fillStyle = item.color || '#888';
        ctx.beginPath();
        ctx.arc(item.x, item.y, half, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = item.score < 0 ? '#8b0000' : '#333';
        ctx.lineWidth = item.score < 0 ? 3 : 2;
        ctx.stroke();
      }
    }
  },

  checkCollisions(characterBounds, onCollision) {
    const collected = [];
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      const cx = characterBounds.centerX;
      const cy = characterBounds.centerY;
      const half = characterBounds.width / 2;
      const dx = Math.abs(item.x - cx);
      const dy = Math.abs(item.y - cy);
      if (dx < half + this.itemSize / 2 && dy < half + this.itemSize / 2) {
        collected.push(item);
        this.items.splice(i, 1);
        if (onCollision) onCollision(item);
      }
    }
    return collected;
  }
};
