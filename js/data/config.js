// ゲーム設定ファイル

// クリア条件: このレベルに達するとクリア（pc_master到達 = Lv33）
const MAX_LEVEL = 35;

// キャラクター進化設定（レベル3ごとに進化）
const EVOLUTIONS = {
  moju: [{ level: 3, characterId: 'moju_nasi' }],
  moju_nasi: [{ level: 6, characterId: '13fes_koara' }],
  '13fes_koara': [{ level: 9, characterId: '2024_cat' }],
  '2024_cat': [{ level: 12, characterId: 'baku' }],
  baku: [{ level: 15, characterId: 'baru' }],
  baru: [{ level: 18, characterId: 'double_dog' }],
  double_dog: [{ level: 21, characterId: 'hitsuji' }],
  hitsuji: [{ level: 24, characterId: 'iyadosu' }],
  iyadosu: [{ level: 27, characterId: 'onsen_wan' }],
  onsen_wan: [{ level: 30, characterId: 'same' }],
  same: [{ level: 33, characterId: 'pc_master' }],
  pc_master: []
};

// 難易度設定
// hitsToDie: 悪いアイテムに何回当たるとゲームオーバーか（easy=20, normal=10, hard=5）
const DIFFICULTIES = {
  easy: {
    name: 'かんたん',
    spawnInterval: 1200,
    fallSpeed: 2.2,
    levelThreshold: 80,
    itemSize: 44,
    hitsToDie: 20
  },
  normal: {
    name: 'ふつう',
    spawnInterval: 900,
    fallSpeed: 2.8,
    levelThreshold: 100,
    itemSize: 40,
    hitsToDie: 10
  },
  hard: {
    name: 'むずかしい',
    spawnInterval: 600,
    fallSpeed: 3.5,
    levelThreshold: 120,
    itemSize: 36,
    hitsToDie: 5
  }
};

const DEFAULT_DIFFICULTY = 'normal';
