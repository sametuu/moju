# もじゅゲーム

スマホ向けの2Dキャラクターゲーム。キャラクターを動かして空から降ってくるアイテムを取得し、スコアを稼いでレベルアップ・進化させよう。

## 遊び方

- **操作**: 画面をタップ/ドラッグしてキャラクターを移動
- **目的**: 女性向けアイテム（ケーキ、化粧品など）を取ってスコアアップ
- **注意**: 男性向けアイテム（ガジェット、ロボットなど）は減点
- **進化**: レベル5で「もじゅ」が「いやどす」に進化

## ローカルで実行

```bash
# Python の場合
python3 -m http.server 8080

# Node.js の場合
npx serve .
```

ブラウザで `http://localhost:8080` を開く。

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

## 拡張方法

- **新キャラ追加**: `js/data/characters.js` の `CHARACTERS` に追加し、`evolutions` で進化先を指定
- **新アイテム追加**: `js/data/items.js` の `ITEMS` 配列に `{ id, name, score, weight, color }` を追加
