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
  pc_master: {
    id: 'pc_master',
    name: 'パソコンマスター',
    image: 'assets/characters/pc_master.jpg',
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
