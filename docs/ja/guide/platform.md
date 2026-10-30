# プラットフォームサポート

## 初版のプラットフォーム範囲

| プラットフォーム | 状態 | 説明 |
| --- | --- | --- |
| **H5** | ✅ 完全 | すべてのコンポーネントが全機能 |
| **WeChat ミニプログラム** | ✅ 完全（一部降格） | ポップアップ系コンポーネントのデスクトップ級機能を降格。下表を参照 |
| Alipay / Douyin ミニプログラム | 🚫 初版では未対応 | 後続で条件コンパイルにより端ごとに検証してから列を追加 |
| App（nvue） | 🚫 対応しない | nvue のレンダリング体系は webview と異なり、ロードマップ外 |

## コンポーネントの機能マトリクス

「降格」とは、**プラットフォームが対応しない機能をコンパイル期のガードで直接削除する**こと（ミニプログラムのパッケージにデッドコードを残さない）を指し、ランタイムの失敗ではありません。

| コンポーネント | H5 | WeChat ミニプログラム | 降格戦略 / 説明 |
| --- | --- | --- | --- |
| config-provider | 完全 | 完全 | provide/inject + インライン CSS 変数は全プラットフォームで利用可。ダークは `page.dark` クラスで切り替え（document なし） |
| button / tag | 完全 | 完全 | — |
| icon | 完全 | 完全 | iconfont フォント方式（Web 版はインライン SVG。下の「icon レンダリング差異」を参照） |
| input | 完全 | 完全 | プレースホルダースタイルは `placeholder-style` prop 経由（MP は `::placeholder` 非対応） |
| checkbox / radio / switch | 完全 | 完全 | **view による自前描画**（ネイティブコンポーネントを使わず、lh の視覚言語に統一） |
| form / form-item | 完全 | 完全 | バリデーションロジックは core の純関数で、プラットフォーム依存ゼロ |
| select | 完全 | 降格 | root-portal + 2 フレーム計測定位。**キーボードナビゲーションは H5 のみ**、MP はタップ + scroll-view |
| dialog | 完全 | 降格 | root-portal。**focus-trap / lockScroll は H5 のみ**、MP はオーバーレイによる遮断でフォールバック |
| tooltip | 完全 | 降格 | 2 フレーム計測定位。**hover なし**、MP 端はタップ / タッチでトリガー |
| message / loading | 完全 | 完全 | マウントポイントパターン（ミニプログラムに document がなく、JS で DOM を作成できないため） |

## WeChat ミニプログラム固有の制限と代替手段

| 制限 | 代替手段 |
| --- | --- |
| `<svg>` タグ非対応 | アイコンはコンパイル期に iconfont フォントへ変換（base64 埋め込み）、`<text class="lh-iconfont">` でレンダリング |
| `::placeholder` 非対応 | input の `placeholder-style` / `placeholder-class` prop |
| `*` ワイルドカード / 属性セレクタ / `:not()` / `:nth-*` 非対応 | ビルド時の精製：`*` ワイルドカードは flex + gap にマッピングし、それ以外は等価なクラス名に置換 |
| `document` / `document.body` なし | ポップアップは `root-portal` 経由。命令的サービスはマウントポイントパターン |
| キーボードフォーカスのセマンティクスなし | focus-trap / キーボードナビゲーションは `LH_IS_H5` ガードにより呼び出されない。aria 属性はスクリーンリーダー向けに引き続き出力 |
| `transitionend` が信頼できない | 進退アニメーションは CSS transition + setTimeout で時間を合わせる |
| `onLoad` 段階ではコンポーネントが未生成 | すべての ref / 計測呼び出しは `onReady` の後に行う必要がある |

## WeChat 基礎ライブラリのバージョン

- **root-portal には基礎ライブラリ ≥ 2.25.2 が必要**（select / dialog / tooltip のポップアップのマウントが依存）。
- 低いバージョンでは自動的に**ページ内 fixed 配置**のフォールバックに降格（`getLhLibVersion()` で判定）。ポップアップは残りますが、階層は
  ページフローの制約を受けます。

## root-portal と DingTalk などの端

`lh-root-portal` は内部で条件コンパイルにより 3 分岐しています：H5 は `<teleport to="body">`、WeChat は `<root-portal>`、
DingTalk など root-portal 非対応の端はページ内 fixed。**これは内部コンポーネントであり、利用者が気にする必要はありません**。
ここに記載しているのは、ポップアップ挙動のプラットフォーム差異の由来を説明するためです。
