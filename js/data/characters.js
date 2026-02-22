const CHARACTERS = {
  moju: {
    id: 'moju',
    name: 'もじゅ',
    image: 'assets/characters/moju.png',
    evolutions: []
  },
  moju_nasi: {
    id: 'moju_nasi',
    name: 'もじゅと梨',
    image: 'assets/characters/moju_nasi.jpg',
    evolutions: []
  },
  moju_furo: {
    id: 'moju_furo',
    name: 'ふろもじゅ',
    image: 'assets/characters/moju_furo.jpg',
    evolutions: []
  },
  moju_valentain: {
    id: 'moju_valentain',
    name: 'バレンタインもじゅ',
    image: 'assets/characters/moju_valentain.jpg',
    evolutions: []
  },
  '13fes_koara': {
    id: '13fes_koara',
    name: '13フェスコアラ',
    image: 'assets/characters/13fes_koara.jpg',
    evolutions: []
  },
  '2024_cat': {
    id: '2024_cat',
    name: '2024キャット',
    image: 'assets/characters/2024_cat.jpg',
    evolutions: []
  },
  araiguma: {
    id: 'araiguma',
    name: 'アライグマ',
    image: 'assets/characters/araiguma.jpg',
    evolutions: []
  },
  baku: {
    id: 'baku',
    name: 'ばく',
    image: 'assets/characters/baku.jpg',
    evolutions: []
  },
  baru: {
    id: 'baru',
    name: 'バル',
    image: 'assets/characters/baru.jpg',
    evolutions: []
  },
  buncho: {
    id: 'buncho',
    name: 'ブンチョウ',
    image: 'assets/characters/buncho.jpg',
    evolutions: []
  },
  double_dog: {
    id: 'double_dog',
    name: '柴犬たち',
    image: 'assets/characters/double_dog.jpg',
    evolutions: []
  },
  hitsuji: {
    id: 'hitsuji',
    name: '顔面アップヒツジ',
    image: 'assets/characters/hitsuji.jpg',
    evolutions: []
  },
  iyadosu: {
    id: 'iyadosu',
    name: 'いやどす',
    image: 'assets/characters/iyadosu.png',
    evolutions: []
  },
  merubou: {
    id: 'merubou',
    name: 'メルボー',
    image: 'assets/characters/merubou.jpg',
    evolutions: []
  },
  onsen_wan: {
    id: 'onsen_wan',
    name: '温泉いぬ',
    image: 'assets/characters/onsen_wan.jpg',
    evolutions: []
  },
  same: {
    id: 'same',
    name: 'サメ先生',
    image: 'assets/characters/same.jpg',
    evolutions: []
  },
  woo: {
    id: 'woo',
    name: 'うぉー',
    image: 'assets/characters/woo.jpg',
    evolutions: []
  },
  pc_master: {
    id: 'pc_master',
    name: 'パソコンマスター',
    image: 'assets/characters/pc_master.jpg',
    evolutions: []
  },
  '2024cat_e': {
    id: '2024cat_e',
    name: '絵の2024キャット',
    image: 'assets/characters/2024cat_e.JPG',
    evolutions: []
  },
  baru_hikouki: {
    id: 'baru_hikouki',
    name: '飛行機の中のバル',
    image: 'assets/characters/baru_hikouki.jpg',
    evolutions: []
  },
  cat_kuro: {
    id: 'cat_kuro',
    name: '江ノ島にいた黒い猫',
    image: 'assets/characters/cat_kuro.jpg',
    evolutions: []
  },
  kuri: {
    id: 'kuri',
    name: '顔に見える栗',
    image: 'assets/characters/kuri.jpg',
    evolutions: []
  },
  moju_ashikumi: {
    id: 'moju_ashikumi',
    name: '足組みもじゅ',
    image: 'assets/characters/moju_ashikumi.JPG',
    evolutions: []
  },
  moju_chyuuni: {
    id: 'moju_chyuuni',
    name: '中二病もじゅ',
    image: 'assets/characters/moju_chyuuni.jpg',
    evolutions: []
  },
  moju_relax: {
    id: 'moju_relax',
    name: 'リラックスもじゅ',
    image: 'assets/characters/moju_relax.jpg',
    evolutions: []
  },
  penguin_rego: {
    id: 'penguin_rego',
    name: 'レゴペンギン',
    image: 'assets/characters/penguin_rego.jpg',
    evolutions: []
  },
  same_akapantu: {
    id: 'same_akapantu',
    name: '赤パンツのサメ',
    image: 'assets/characters/same_akapantu.jpg',
    evolutions: []
  },
  same_study: {
    id: 'same_study',
    name: '日経サイエンスサメ',
    image: 'assets/characters/same_study.jpg',
    evolutions: []
  },
  same_vr: {
    id: 'same_vr',
    name: 'VRサメ',
    image: 'assets/characters/same_vr.jpg',
    evolutions: []
  },
  santa: {
    id: 'santa',
    name: '玄関前のサンタ',
    image: 'assets/characters/santa.jpg',
    evolutions: []
  },
  shiba_kawaii: {
    id: 'shiba_kawaii',
    name: 'かわいい柴犬',
    image: 'assets/characters/shiba_kawaii.JPG',
    evolutions: []
  },
  'si-sa-1': {
    id: 'si-sa-1',
    name: 'シーサー1号',
    image: 'assets/characters/si-sa-1.jpg',
    evolutions: []
  },
  'si-sa-2': {
    id: 'si-sa-2',
    name: 'シーサー2号',
    image: 'assets/characters/si-sa-2.jpg',
    evolutions: []
  },
  woo_kowaikao: {
    id: 'woo_kowaikao',
    name: '怖い顔のうぉー',
    image: 'assets/characters/woo_kowaikao.jpg',
    evolutions: []
  },
  woo_milk: {
    id: 'woo_milk',
    name: '牛乳とうぉー',
    image: 'assets/characters/woo_milk.jpg',
    evolutions: []
  },
  woo_sumaho: {
    id: 'woo_sumaho',
    name: 'スマホとうぉー',
    image: 'assets/characters/woo_sumaho.jpg',
    evolutions: []
  }
};

// config.js の EVOLUTIONS で進化設定を上書き
if (typeof EVOLUTIONS !== 'undefined') {
  for (const [charId, evos] of Object.entries(EVOLUTIONS)) {
    if (CHARACTERS[charId]) {
      CHARACTERS[charId].evolutions = evos;
    }
  }
}

const DEFAULT_CHARACTER_ID = 'moju';
