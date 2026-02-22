const ItemManager = {
  items: [],
  spawnInterval: 900,
  lastSpawn: 0,
  fallSpeed: 2.8,
  itemSize: 40,
  totalWeight: 0,
  imageCache: {},

  init() {
    this.items = [];
    this.lastSpawn = 0;
    this.totalWeight = ITEMS.reduce((sum, item) => sum + item.weight, 0);
    this.preloadImages();
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

  getRandomItem() {
    let r = Math.random() * this.totalWeight;
    for (const item of ITEMS) {
      r -= item.weight;
      if (r <= 0) return { ...item };
    }
    return { ...ITEMS[0] };
  },

  spawn() {
    const item = this.getRandomItem();
    const x = Math.random() * (window.innerWidth - this.itemSize) + this.itemSize / 2;
    this.items.push({
      ...item,
      x,
      y: -this.itemSize
    });
  },

  update(dt) {
    const now = Date.now();
    if (now - this.lastSpawn > this.spawnInterval) {
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
