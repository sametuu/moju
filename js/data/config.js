// ゲーム設定ファイル

// レベル計算用（難易度に依存しない。スコア100点で1レベル、進化の順番・必要レベルは全難易度で同一）
const LEVEL_THRESHOLD = 100;

// キャラクター進化設定（全キャラ使用、3レベルごとに進化、moju系→その他、最後はpc_master）
const EVOLUTIONS = {
  moju: [{ level: 3, characterId: 'moju_nasi' }],
  moju_nasi: [{ level: 6, characterId: 'moju_furo' }],
  moju_furo: [{ level: 9, characterId: 'moju_valentain' }],
  moju_valentain: [{ level: 12, characterId: 'moju_ashikumi' }],
  moju_ashikumi: [{ level: 15, characterId: 'moju_chyuuni' }],
  moju_chyuuni: [{ level: 18, characterId: 'moju_relax' }],
  moju_relax: [{ level: 21, characterId: '13fes_koara' }],
  '13fes_koara': [{ level: 24, characterId: '2024_cat' }],
  '2024_cat': [{ level: 27, characterId: '2024cat_e' }],
  '2024cat_e': [{ level: 30, characterId: 'araiguma' }],
  araiguma: [{ level: 33, characterId: 'baku' }],
  baku: [{ level: 36, characterId: 'baru' }],
  baru: [{ level: 39, characterId: 'baru_hikouki' }],
  baru_hikouki: [{ level: 42, characterId: 'buncho' }],
  buncho: [{ level: 45, characterId: 'cat_kuro' }],
  cat_kuro: [{ level: 48, characterId: 'double_dog' }],
  double_dog: [{ level: 51, characterId: 'shiba_kawaii' }],
  shiba_kawaii: [{ level: 54, characterId: 'hitsuji' }],
  hitsuji: [{ level: 57, characterId: 'iyadosu' }],
  iyadosu: [{ level: 60, characterId: 'merubou' }],
  merubou: [{ level: 63, characterId: 'onsen_wan' }],
  onsen_wan: [{ level: 66, characterId: 'penguin_rego' }],
  penguin_rego: [{ level: 69, characterId: 'kuri' }],
  kuri: [{ level: 72, characterId: 'same' }],
  same: [{ level: 75, characterId: 'same_akapantu' }],
  same_akapantu: [{ level: 78, characterId: 'same_study' }],
  same_study: [{ level: 81, characterId: 'same_vr' }],
  same_vr: [{ level: 84, characterId: 'santa' }],
  santa: [{ level: 87, characterId: 'si-sa-1' }],
  'si-sa-1': [{ level: 90, characterId: 'si-sa-2' }],
  'si-sa-2': [{ level: 93, characterId: 'woo' }],
  woo: [{ level: 96, characterId: 'woo_kowaikao' }],
  woo_kowaikao: [{ level: 99, characterId: 'woo_milk' }],
  woo_milk: [{ level: 102, characterId: 'woo_sumaho' }],
  woo_sumaho: [{ level: 105, characterId: 'pc_master' }],
  pc_master: []
};

// 難易度設定
// maxLevel: この難易度で到達可能な最大レベル（進化チェーン・必要レベルは共通、難しいほど後ろのキャラに到達可能）
//   easy Lv30→2024cat_e / normal Lv60→iyadosu / hard Lv105→pc_master
// hitsToDie: 悪いアイテムに何回当たるとゲームオーバーか
// itemRates: カテゴリ別出現率（初期→最終レベルで補間）
//   initial: レベル1の出現率（加点/ダメージ/回復）
//   final: 最終レベルでの出現率
//   finalLevel: 最終レートに達するレベル
const DIFFICULTIES = {
  easy: {
    name: 'かんたん',
    maxLevel: 30,
    spawnInterval: 1200,
    itemRates: {
      initial: { plus: 0.80, damage: 0.17, heal: 0.03 },
      final: { plus: 0.70, damage: 0.27, heal: 0.03 },
      finalLevel: 30
    },
    fallSpeed: 2.2,
    speedPerLevel: 0.04,
    maxFallSpeed: 4.0,
    itemSize: 44,
    hitsToDie: 20
  },
  normal: {
    name: 'ふつう',
    maxLevel: 110,
    spawnInterval: 600,
    itemRates: {
      initial: { plus: 0.80, damage: 0.18, heal: 0.02 },
      final: { plus: 0.60, damage: 0.38, heal: 0.02 },
      finalLevel: 60
    },
    fallSpeed: 3.5,
    speedPerLevel: 0.08,
    maxFallSpeed: 6.5,
    itemSize: 36,
    hitsToDie: 5
  },
  hard: {
    name: 'むずかしい',
    maxLevel: 110,
    spawnInterval: 400,
    itemRates: {
      initial: { plus: 0.80, damage: 0.195, heal: 0.01 },
      final: { plus: 0.50, damage: 0.495, heal: 0.01 },
      finalLevel: 60
    },
    fallSpeed: 4.5,
    speedPerLevel: 0.12,
    maxFallSpeed: 9.0,
    itemSize: 32,
    hitsToDie: 3
  },
  endless: {
    name: 'エンドレス',
    maxLevel: 9999,
    spawnInterval: 400,
    itemRates: {
      initial: { plus: 0.80, damage: 0.195, heal: 0.01 },
      final: { plus: 0.50, damage: 0.495, heal: 0.01 },
      finalLevel: 60
    },
    fallSpeed: 4.5,
    speedPerLevel: 0.12,
    maxFallSpeed: 9.0,
    itemSize: 32,
    hitsToDie: 3
  }
};

const DEFAULT_DIFFICULTY = 'normal';
