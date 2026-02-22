// ゲーム設定ファイル

// クリア条件: このレベルに達するとクリア（pc_master到達はLv55）
const MAX_LEVEL = 55;

// キャラクター進化設定（moju→moju_nasi→moju_furo→moju_valentain固定、最後はpc_master）
const EVOLUTIONS = {
  moju: [{ level: 3, characterId: 'moju_nasi' }],
  moju_nasi: [{ level: 6, characterId: 'moju_furo' }],
  moju_furo: [{ level: 9, characterId: 'moju_valentain' }],
  moju_valentain: [{ level: 12, characterId: '13fes_koara' }],
  '13fes_koara': [{ level: 15, characterId: '2024_cat' }],
  '2024_cat': [{ level: 18, characterId: 'araiguma' }],
  araiguma: [{ level: 21, characterId: 'baku' }],
  baku: [{ level: 24, characterId: 'baru' }],
  baru: [{ level: 27, characterId: 'buncho' }],
  buncho: [{ level: 30, characterId: 'double_dog' }],
  double_dog: [{ level: 33, characterId: 'hitsuji' }],
  hitsuji: [{ level: 36, characterId: 'iyadosu' }],
  iyadosu: [{ level: 39, characterId: 'merubou' }],
  merubou: [{ level: 42, characterId: 'onsen_wan' }],
  onsen_wan: [{ level: 45, characterId: 'same' }],
  same: [{ level: 48, characterId: 'woo' }],
  woo: [{ level: 55, characterId: 'pc_master' }],
  pc_master: []
};

// 難易度設定
// hitsToDie: 悪いアイテムに何回当たるとゲームオーバーか
// itemRates: カテゴリ別出現率（初期→最終レベルで補間）
//   initial: レベル1の出現率（加点/ダメージ/回復）
//   final: 最終レベルでの出現率
//   finalLevel: 最終レートに達するレベル
const DIFFICULTIES = {
  easy: {
    name: 'かんたん',
    spawnInterval: 1200,
    itemRates: {
      initial: { plus: 0.80, damage: 0.17, heal: 0.03 },
      final: { plus: 0.70, damage: 0.27, heal: 0.03 },
      finalLevel: 30
    },
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
    itemRates: {
      initial: { plus: 0.80, damage: 0.18, heal: 0.02 },
      final: { plus: 0.60, damage: 0.38, heal: 0.02 },
      finalLevel: 40
    },
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
    itemRates: {
      initial: { plus: 0.80, damage: 0.19, heal: 0.01 },
      final: { plus: 0.50, damage: 0.49, heal: 0.01 },
      finalLevel: 60
    },
    fallSpeed: 4.5,
    speedPerLevel: 0.12,
    maxFallSpeed: 9.0,
    levelThreshold: 150,
    itemSize: 32,
    hitsToDie: 3
  }
};

const DEFAULT_DIFFICULTY = 'normal';
