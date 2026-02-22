// 20種類のアイテム: 高得点15種(女性向け)、減点5種(男性向け)
// weight: 出現重み（高いほど出現しやすい）
// emoji: Twemoji CDN用のUnicodeコードポイント（絵文字画像のURLに使用）
const EMOJI_CDN = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72';
const ITEMS = [
  // 高得点（女性向け） weight 2-3
  { id: 'cake', name: 'ケーキ', score: 25, weight: 2, color: '#ffb6c1', emoji: '1f370' },
  { id: 'macaron', name: 'マカロン', score: 22, weight: 2, color: '#ff69b4', emoji: '1f9c1' },
  { id: 'lipstick', name: '口紅', score: 20, weight: 2, color: '#dc143c', emoji: '1f484' },
  { id: 'palette', name: 'パレット', score: 18, weight: 2, color: '#ffa07a', emoji: '1f3a8' },
  { id: 'perfume', name: '香水', score: 23, weight: 2, color: '#dda0dd', emoji: '1f490' },
  { id: 'flower', name: '花', score: 15, weight: 3, color: '#ff1493', emoji: '1f338' },
  { id: 'ribbon', name: 'リボン', score: 12, weight: 3, color: '#ff69b4', emoji: '1f380' },
  { id: 'nail', name: 'ネイル', score: 10, weight: 3, color: '#ffc0cb', emoji: '1f485' },
  { id: 'chocolate', name: 'チョコ', score: 8, weight: 3, color: '#8b4513', emoji: '1f36b' },
  { id: 'ring', name: '指輪', score: 20, weight: 2, color: '#c0c0c0', emoji: '1f48d' },
  { id: 'bag', name: 'バッグ', score: 16, weight: 2, color: '#da70d6', emoji: '1f45c' },
  { id: 'mirror', name: '鏡', score: 14, weight: 2, color: '#e6e6fa', emoji: '1fa9e' },
  { id: 'earring', name: 'イヤリング', score: 11, weight: 3, color: '#ffd700', emoji: '1f48e' },
  { id: 'bracelet', name: 'ブレスレット', score: 13, weight: 2, color: '#f0e68c', emoji: '1f4ff' },
  { id: 'cream', name: 'クリーム', score: 9, weight: 3, color: '#fffacd', emoji: '1f9f4' },
  // 減点（男性向け） weight 1-2
  { id: 'smartphone', name: 'スマホ', score: -15, weight: 1, color: '#2f4f4f', emoji: '1f4f1' },
  { id: 'robot', name: 'ロボット', score: -20, weight: 1, color: '#708090', emoji: '1f916' },
  { id: 'gamepad', name: 'ゲーム機', score: -18, weight: 1, color: '#4a4a4a', emoji: '1f3ae' },
  { id: 'drone', name: 'ドローン', score: -12, weight: 2, color: '#696969', emoji: '1f681' },
  { id: 'headphone', name: 'ヘッドホン', score: -10, weight: 2, color: '#808080', emoji: '1f3a7' }
];
