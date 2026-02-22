// ゲーム設定ファイル

// クリア条件: このレベルに達するとクリア（pc_master到達後、全アイテム出現はLv50）
const MAX_LEVEL = 100;

// キャラクター進化設定（進化に必要なレベルは徐々に増加）
const EVOLUTIONS = {
  moju: [{ level: 3, characterId: 'moju_nasi' }],
  moju_nasi: [{ level: 6, characterId: '13fes_koara' }],
  '13fes_koara': [{ level: 9, characterId: '2024_cat' }],
  '2024_cat': [{ level: 12, characterId: 'baku' }],
  baku: [{ level: 15, characterId: 'baru' }],
  baru: [{ level: 19, characterId: 'double_dog' }],
  double_dog: [{ level: 23, characterId: 'hitsuji' }],
  hitsuji: [{ level: 27, characterId: 'iyadosu' }],
  iyadosu: [{ level: 32, characterId: 'onsen_wan' }],
  onsen_wan: [{ level: 37, characterId: 'same' }],
  same: [{ level: 42, characterId: 'pc_master' }],
  pc_master: []
};

// 難易度設定
// hitsToDie: 悪いアイテムに何回当たるとゲームオーバーか
// healChance: 回復アイテムの出現確率（0.03=3%, 0.02=2%, 0.01=1%）
// 落下速度（configで調整可能）:
//   fallSpeed: レベル1の落下速度
//   speedPerLevel: レベルが1上がるごとの増加量
//   maxFallSpeed: 落下速度の上限（ここで調整）
const DIFFICULTIES = {
  easy: {
    name: 'かんたん',
    spawnInterval: 1200,
    healChance: 0.03,
    fallSpeed: 2.2,
    speedPerLevel: 0.04,
    maxFallSpeed: 4.0,
    levelThreshold: 80,
    itemSize: 44,
    hitsToDie: 20
  },
  normal: {
    name: 'ふつう',
    spawnInterval: 600,
    healChance: 0.02,
    fallSpeed: 3.5,
    speedPerLevel: 0.08,
    maxFallSpeed: 6.5,
    levelThreshold: 120,
    itemSize: 36,
    hitsToDie: 5
  },
  hard: {
    name: 'むずかしい',
    spawnInterval: 400,
    healChance: 0.01,
    fallSpeed: 4.5,
    speedPerLevel: 0.12,
    maxFallSpeed: 9.0,
    levelThreshold: 150,
    itemSize: 32,
    hitsToDie: 3
  }
};

const DEFAULT_DIFFICULTY = 'normal';
