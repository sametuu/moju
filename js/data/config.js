// ゲーム設定ファイル

// クリア条件: このレベルに達するとクリア
const MAX_LEVEL = 10;

// キャラクター進化設定（どのレベルでどのキャラに進化するか）
const EVOLUTIONS = {
  moju: [
    { level: 5, characterId: 'iyadosu' }
  ],
  iyadosu: []
};

// 難易度設定
const DIFFICULTIES = {
  easy: {
    name: 'かんたん',
    spawnInterval: 1200,
    fallSpeed: 2.2,
    levelThreshold: 80,
    itemSize: 44
  },
  normal: {
    name: 'ふつう',
    spawnInterval: 900,
    fallSpeed: 2.8,
    levelThreshold: 100,
    itemSize: 40
  },
  hard: {
    name: 'むずかしい',
    spawnInterval: 600,
    fallSpeed: 3.5,
    levelThreshold: 120,
    itemSize: 36
  }
};

const DEFAULT_DIFFICULTY = 'normal';
