const CHARACTERS = {
  moju: {
    id: 'moju',
    name: 'もじゅ',
    image: 'assets/characters/moju.png',
    evolutions: []
  },
  iyadosu: {
    id: 'iyadosu',
    name: 'いやどす',
    image: 'assets/characters/iyadosu.png',
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
