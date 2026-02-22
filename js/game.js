const Game = {
  score: 0,
  level: 1,
  life: 100,
  maxLife: 100,
  levelThreshold: 100,
  maxLevel: 55,
  difficulty: null,
  evolutionCount: 0,

  init(difficultyKey) {
    this.score = 0;
    this.level = 1;
    this.life = 100;
    this.maxLife = 100;
    this.evolutionCount = 0;
    const diff = DIFFICULTIES[difficultyKey || DEFAULT_DIFFICULTY] || DIFFICULTIES.normal;
    this.difficulty = diff;
    this.levelThreshold = typeof LEVEL_THRESHOLD !== 'undefined' ? LEVEL_THRESHOLD : 100;
    this.maxLevel = diff.maxLevel;
  },

  damageLife(amount) {
    this.life = Math.max(0, this.life - amount);
  },

  healLife(ratio) {
    const heal = this.maxLife * ratio;
    this.life = Math.min(this.maxLife, this.life + heal);
  },

  getLifeDamage(item) {
    if (!item || item.score >= 0) return 0;
    const base = (100 / (this.difficulty.hitsToDie || 10)) || 10;
    const mult = item.lifeDamage || 1;
    return base * mult;
  },

  isGameOver() {
    return this.life <= 0;
  },

  addScore(delta) {
    this.score += delta;
    if (this.score < 0) this.score = 0;
    return this.checkLevelUp();
  },

  getScore() {
    return this.score;
  },

  getLevel() {
    return this.level;
  },

  getLevelForScore(score) {
    return Math.floor(score / this.levelThreshold) + 1;
  },

  checkLevelUp() {
    const newLevel = Math.min(this.getLevelForScore(this.score), this.maxLevel);
    if (newLevel > this.level) {
      this.level = newLevel;
      return this.level;
    }
    return 0;
  },

  getScoreForLevel(level) {
    return (level - 1) * this.levelThreshold;
  },

  getScoreToNextLevel() {
    return this.level * this.levelThreshold;
  },

  getRemainingToNextLevel() {
    return Math.max(0, this.getScoreToNextLevel() - this.score);
  },

  getExpProgress() {
    const current = this.getScoreForLevel(this.level);
    const next = this.getScoreToNextLevel();
    return (this.score - current) / (next - current);
  },

  isCleared() {
    return this.level >= this.maxLevel;
  }
};
