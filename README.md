# もじゅゲーム

スマホ向けの2Dキャラクターゲーム。キャラクターを動かして空から降ってくるアイテムを取得し、スコアを稼いでレベルアップ・進化させよう。

## 遊び方

1. ホーム画面で難易度を選び、「冒険に出発！」をタップ
2. **操作**: 画面をタップ/ドラッグしてキャラクターを移動
3. **目的**: 女性向けアイテム（ケーキ、化粧品など）を取ってスコアアップ
4. **注意**: 男性向けアイテム（ガジェット、ロボットなど）は減点
5. **進化**: レベル3ごとにキャラが進化（もじゅ→もじゅと梨→13フェスコアラ→…→パソコンマスター）
6. **ライフ**: 悪いアイテムに当たるとライフ減少。ゼロでゲームオーバー
7. **クリア**: レベル33で「もじゅマスター」達成！

## ローカルで実行

```bash
# Python の場合
python3 -m http.server 8080

# Node.js の場合
npx serve .
```

ブラウザで `http://localhost:8080` を開く。

## デバッグモード

URLに `?debug=1` または `?debug=true` を付けるとデバッグモードで起動します。

- 特典アイテム（得点アイテム）のみが画面中央に落下
- キャラクターは中央に固定され自動でアイテムを取得
- 自動的にレベルアップ・進化
- 例: `http://localhost:8080/?debug=1`

## テスト

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080/test/` を開くと、エフェクトの単体テストが実行されます。

- アイテム取得時のフラッシュ（得点/減点）
- レベルアップ時のパーティクルエフェクト
- 進化時の画面遷移

## GitHub Pages でデプロイ

1. このリポジトリを GitHub にプッシュ
2. リポジトリの **Settings** → **Pages**
3. **Source**: `Deploy from a branch` を選択
4. **Branch**: `main`（または `master`）、**Folder**: `/ (root)` を選択
5. **Save** をクリック

数分後、`https://<username>.github.io/moju/` でゲームにアクセス可能になります。

### iPhone / Android でプレイ

- GitHub Pages のURLをブラウザで開く
- ホーム画面に追加するとアプリのように起動可能（iOS: 共有→「ホーム画面に追加」）

## プロジェクト構成

```
moju/
├── index.html
├── css/style.css
├── js/
│   ├── main.js         # ゲームループ・初期化
│   ├── character.js    # キャラクター管理・進化
│   ├── item.js         # アイテム落下・衝突
│   ├── game.js         # スコア・レベル
│   └── data/
│       ├── characters.js   # キャラクター定義
│       └── items.js        # アイテム定義
└── assets/
    ├── characters/     # キャラクター画像
    └── items/          # アイテム画像（将来追加）
```

## 設定ファイル（js/data/config.js）

- **進化設定**: `EVOLUTIONS` で各キャラの進化レベルを指定
- **難易度**: `DIFFICULTIES` で出現間隔・落下速度・レベル閾値を調整
- **クリア条件**: 難易度ごとの `maxLevel`（easy:29, normal:45, hard:55）

## 拡張方法

- **新キャラ追加**: `js/data/characters.js` の `CHARACTERS` に追加し、`config.js` の `EVOLUTIONS` で進化先を指定
- **新アイテム追加**: `js/data/items.js` の `ITEMS` 配列に `{ id, name, score, weight, color }` を追加
