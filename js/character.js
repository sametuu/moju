const CharacterManager = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  characterId: DEFAULT_CHARACTER_ID,
  images: {},
  size: 80,
  lerpSpeed: 0.15,

  async init() {
    this.x = window.innerWidth / 2 - this.size / 2;
    this.y = window.innerHeight / 2 - this.size / 2;
    this.targetX = this.x;
    this.targetY = this.y;
    this.characterId = DEFAULT_CHARACTER_ID;

    const loadPromises = Object.values(CHARACTERS).map(char => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.src = char.image;
        this.images[char.id] = img;
      });
    });
    await Promise.all(loadPromises);
  },

  setTarget(x, y) {
    this.targetX = Math.max(this.size / 2, Math.min(window.innerWidth - this.size / 2, x));
    this.targetY = Math.max(this.size / 2, Math.min(window.innerHeight - this.size / 2, y));
  },

  update(dt) {
    this.x += (this.targetX - this.x) * this.lerpSpeed;
    this.y += (this.targetY - this.y) * this.lerpSpeed;
  },

  draw(ctx) {
    const char = CHARACTERS[this.characterId];
    const img = this.images[this.characterId];
    if (!char || !img) return;

    const drawX = this.x - this.size / 2;
    const drawY = this.y - this.size / 2;
    ctx.drawImage(img, drawX, drawY, this.size, this.size);

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(char.name, this.x, drawY - 8);
  },

  getBounds() {
    return {
      x: this.x - this.size / 2,
      y: this.y - this.size / 2,
      width: this.size,
      height: this.size,
      centerX: this.x,
      centerY: this.y
    };
  },

  getCurrentCharacterId() {
    return this.characterId;
  },

  getCurrentCharacter() {
    return CHARACTERS[this.characterId];
  },

  tryEvolve(level) {
    const char = CHARACTERS[this.characterId];
    if (!char || !char.evolutions) return null;
    const evolution = char.evolutions.find(e => e.level === level);
    if (evolution) {
      return { oldCharId: this.characterId, newCharId: evolution.characterId };
    }
    return null;
  },

  evolveTo(characterId) {
    this.characterId = characterId;
  }
};
