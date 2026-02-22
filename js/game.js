const Game = {
  score: 0,
  level: 1,
  levelThreshold: 100,

  init() {
    this.score = 0;
    this.level = 1;
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
    const newLevel = this.getLevelForScore(this.score);
    if (newLevel > this.level) {
      this.level = newLevel;
      return this.level;
    }
    return 0;
  },

  getScoreForLevel(level) {
    return (level - 1) * this.levelThreshold;
  }
};
