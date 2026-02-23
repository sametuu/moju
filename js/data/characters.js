const CHARACTERS = {
  moju: {
    id: 'moju',
    name: 'もじゅ',
    image: 'assets/characters/moju.png',
    intro: '最も一般的なもじゅ。結構昔のホワイトデーに我が家にやってきた。',
    evolutions: []
  },
  moju_nasi: {
    id: 'moju_nasi',
    name: 'もじゅと梨',
    image: 'assets/characters/moju_nasi.jpg',
    intro: '梨を食べているもじゅ。',
    evolutions: []
  },
  moju_furo: {
    id: 'moju_furo',
    name: 'ふろもじゅ',
    image: 'assets/characters/moju_furo.jpg',
    intro: '年に一回くらいのペースで風呂で洗われるもじゅ',
    evolutions: []
  },
  moju_valentain: {
    id: 'moju_valentain',
    name: 'バレンタインもじゅ',
    image: 'assets/characters/moju_valentain.jpg',
    intro: 'バレンタインに作ってくれたケーキの隣でイベントを盛り上げるもじゅ',
    evolutions: []
  },
  '13fes_koara': {
    id: '13fes_koara',
    name: '13フェスコアラ',
    image: 'assets/characters/13fes_koara.jpg',
    intro: '毎月13日に現れる、玄関の前で13フェスを盛り上げるコアラ',
    evolutions: []
  },
  '2024_cat': {
    id: '2024_cat',
    name: '2024キャット',
    image: 'assets/characters/2024_cat.jpg',
    intro: '2024年に大活躍した猫',
    evolutions: []
  },
  araiguma: {
    id: 'araiguma',
    name: 'アライグマ',
    image: 'assets/characters/araiguma.jpg',
    intro: '手洗い場でいつも両手をあげているアライグマ',
    evolutions: []
  },
  baku: {
    id: 'baku',
    name: 'ばく',
    image: 'assets/characters/baku.jpg',
    intro: 'マレーシアから輸入されてきたグレーの熊。鼻が長いことを自慢に思っている。',
    evolutions: []
  },
  baru: {
    id: 'baru',
    name: 'バル',
    image: 'assets/characters/baru.jpg',
    intro: '小牧出身の元靴下。元々コマキンという名前だったが、沖縄でばバルと言う名前に変わった。',
    evolutions: []
  },
  buncho: {
    id: 'buncho',
    name: 'ブンチョウ',
    image: 'assets/characters/buncho.jpg',
    intro: '今にも溶けそうなブンチョウ。お風呂でぬるめにしてあげるとよくごろごろしてくれる。',
    evolutions: []
  },
  double_dog: {
    id: 'double_dog',
    name: '柴犬たち',
    image: 'assets/characters/double_dog.jpg',
    intro: '散歩に連れて行ってもらうことを心待ちにしている芝犬の兄弟。',
    evolutions: []
  },
  hitsuji: {
    id: 'hitsuji',
    name: '顔面アップヒツジ',
    image: 'assets/characters/hitsuji.jpg',
    intro: 'ふれあい動物園出身の顔面がアップになった羊。餌を求めて近寄ってくるよ。',
    evolutions: []
  },
  iyadosu: {
    id: 'iyadosu',
    name: 'いやどす',
    image: 'assets/characters/iyadosu.png',
    intro: '何をするのも嫌な鳥。',
    evolutions: []
  },
  merubou: {
    id: 'merubou',
    name: 'メルボー',
    image: 'assets/characters/merubou.jpg',
    intro: '栗きんとんの紙袋に書かれたダックスフンドの絵',
    evolutions: []
  },
  onsen_wan: {
    id: 'onsen_wan',
    name: '温泉いぬ',
    image: 'assets/characters/onsen_wan.jpg',
    intro: 'オールインクルーシブのホテルで客をもてなしている、温泉に浸かっている犬',
    evolutions: []
  },
  same: {
    id: 'same',
    name: 'サメ先生',
    image: 'assets/characters/same.jpg',
    intro: 'サメの子供達に指導をしているサメ先生。',
    evolutions: []
  },
  woo: {
    id: 'woo',
    name: 'うぉー',
    image: 'assets/characters/woo.jpg',
    intro: 'よく吠えるワニ',
    evolutions: []
  },
  pc_master: {
    id: 'pc_master',
    name: 'パソコンマスター',
    image: 'assets/characters/pc_master.jpg',
    intro: 'パソコンをマスターした小さな男の子',
    evolutions: []
  },
  '2024cat_e': {
    id: '2024cat_e',
    name: '絵の2024キャット',
    image: 'assets/characters/2024cat_e.JPG',
    intro: '2024年に大活躍した猫の絵',
    evolutions: []
  },
  baru_hikouki: {
    id: 'baru_hikouki',
    name: '飛行機の中のバル',
    image: 'assets/characters/baru_hikouki.jpg',
    intro: '飛行機の中でのんびりするバル',
    evolutions: []
  },
  cat_kuro: {
    id: 'cat_kuro',
    name: '江ノ島にいた黒い猫',
    image: 'assets/characters/cat_kuro.jpg',
    intro: '江ノ島に住んでいる黒い猫。アカウントのアイコンにすると幸せになるらしい。',
    evolutions: []
  },
  kuri: {
    id: 'kuri',
    name: '顔に見える栗',
    image: 'assets/characters/kuri.jpg',
    intro: '黒い蜜が目のように見える栗',
    evolutions: []
  },
  moju_ashikumi: {
    id: 'moju_ashikumi',
    name: '足組みもじゅ',
    image: 'assets/characters/moju_ashikumi.JPG',
    intro: '足を組んでいるもじゅ。足が長いからこそできる技。',
    evolutions: []
  },
  moju_chyuuni: {
    id: 'moju_chyuuni',
    name: '中二病もじゅ',
    image: 'assets/characters/moju_chyuuni.jpg',
    intro: '飼い主が編み物にハマりかけた時に厨二病になったもじゅ',
    evolutions: []
  },
  moju_relax: {
    id: 'moju_relax',
    name: 'リラックスもじゅ',
    image: 'assets/characters/moju_relax.jpg',
    intro: 'ベッドの上でのんびりしながら映画を見ているもじゅ',
    evolutions: []
  },
  penguin_rego: {
    id: 'penguin_rego',
    name: 'レゴペンギン',
    image: 'assets/characters/penguin_rego.jpg',
    intro: 'レゴでできたペンギン。友達にレゴワニやレゴイヌもいる。',
    evolutions: []
  },
  same_akapantu: {
    id: 'same_akapantu',
    name: '赤パンツのサメ',
    image: 'assets/characters/same_akapantu.jpg',
    intro: '赤いパンツを履いたサメ。川崎でよく見かける。',
    evolutions: []
  },
  same_study: {
    id: 'same_study',
    name: '日経サイエンスサメ',
    image: 'assets/characters/same_study.jpg',
    intro: '宇宙の勉強をするサメ。宇宙人と仲良くなった。',
    evolutions: []
  },
  same_vr: {
    id: 'same_vr',
    name: 'VRサメ',
    image: 'assets/characters/same_vr.jpg',
    intro: 'VRゲームをしているサメ。平衡感覚がとても良く、酔うことはない。',
    evolutions: []
  },
  santa: {
    id: 'santa',
    name: '玄関前のサンタ',
    image: 'assets/characters/santa.jpg',
    intro: 'クリスマスシーズンになると玄関前で待ち構えるサンタ。シーズンが終わるとキッチンの箸置きとして活躍する。',
    evolutions: []
  },
  shiba_kawaii: {
    id: 'shiba_kawaii',
    name: 'かわいい柴犬',
    image: 'assets/characters/shiba_kawaii.JPG',
    intro: 'とても良く懐いてくれる芝犬の兄弟。',
    evolutions: []
  },
  'si-sa-1': {
    id: 'si-sa-1',
    name: 'シーサー1号',
    image: 'assets/characters/si-sa-1.jpg',
    intro: '沖縄でよく見かけるシーサー。クールビズを意識している。',
    evolutions: []
  },
  'si-sa-2': {
    id: 'si-sa-2',
    name: 'シーサー2号',
    image: 'assets/characters/si-sa-2.jpg',
    intro: '笑顔が素敵なシーサー。子供たちを喜ばせることができる。',
    evolutions: []
  },
  woo_kowaikao: {
    id: 'woo_kowaikao',
    name: '怖い顔のうぉー',
    image: 'assets/characters/woo_kowaikao.jpg',
    intro: '眉毛がキリッとしたワニ。口癖は「お前は東大に行け」。',
    evolutions: []
  },
  woo_milk: {
    id: 'woo_milk',
    name: '牛乳とうぉー',
    image: 'assets/characters/woo_milk.jpg',
    intro: '牛乳の上に乗っかっているワニ。こうしないと顔がよく見えない。',
    evolutions: []
  },
  woo_sumaho: {
    id: 'woo_sumaho',
    name: 'スマホとうぉー',
    image: 'assets/characters/woo_sumaho.jpg',
    intro: 'スマホの上に乗っかっているワニ。よくスマホのゲームをしている。',
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
