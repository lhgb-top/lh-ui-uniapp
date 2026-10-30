# WeChat ミニプログラム手動回帰チェックリスト

> 利用者（またはメンテナー）が WeChat 開発者ツールで確認するためのものです。ビルドスモークテストは WXSS が合法でコンパイルが通ることだけを保証します。
> **挙動の正しさは必ず手動で回帰してください** —— vitest が実行するのは H5 のセマンティクスであり、MP 端のイベントとレンダリングの差異は検出できません。
>
> ビルド：`pnpm dev:mp-weixin`（または `pnpm build:mp-weixin`）。成果物は `dist/dev/mp-weixin`
> （または `dist/build/mp-weixin`）にあり、WeChat 開発者ツールでそのディレクトリを開きます。
>
> 前提：WeChat 基礎ライブラリ **≥ 2.25.2**（root-portal が依存。低いバージョンではページ内 fixed の降格分岐を通るため、
> 降格パスを専用に検証する場合は基礎ライブラリを 2.25.2 未満に設定して「ポップアップ系」の 3 項目をもう一度実行します）。

## 共通ベースライン（全ページで確認）

| # | 項目 | 合格基準 |
| --- | --- | --- |
| G1 | 起動 | ページが白画面にならず、「コンポーネントが登録されていません」も報告されない |
| G2 | ダークモード | エントリでダークに切り替えると、ページ内のコンポーネントの色がすべて追随する（背景だけが変わるのではない） |
| G3 | 中国語 / 英語 | エントリで言語を切り替えると、コンポーネント内の文言（form のバリデーションメッセージ、ボタンの文言など）が追随する |
| G4 | コンソール | 全体を通して `console.error` がない（特に message/loading の「マウントポイントがない」警告が出てはいけない） |

## コンポーネント一覧

| ページパス | コンポーネント | 主要インタラクション（共通ベースラインを除く） |
| --- | --- | --- |
| `pages/button/button` | button | タップで押下状態が表示される。loading / disabled / plain / round / circle / block がすべてレンダリングされる。アイコンボタンの iconfont が正しく描画される |
| `pages/icon/icon` | icon | 37 個のアイコンがすべて描画される（空白の四角ではない）。size / color が効く。loading アイコンが回転する |
| `pages/tag/tag` | tag | 各 type の色が正しい。round / hit の切り替え。closable のタップでクローズがトリガーされ、コールバックが届く |
| `pages/input/input` | input | v-model が双方向。プレースホルダースタイルが `placeholder-style` 経由で効く（**`::placeholder` は確認しない**）。textarea の高さ自動調整。文字数カウント。clearable によるクリア。error 状態で枠線が赤くなる |
| `pages/switch/switch` | switch | タップでの切り替えにツマミのアニメーションがある。loading / disabled はタップに反応しない。activeText/inactiveText が表示される |
| `pages/checkbox/checkbox` | checkbox / checkbox-group | 単体のタップでチェックが付く。group 内の複数選択が互いに干渉しない。disabled の項目は反応しない。indeterminate の半選択状態 |
| `pages/radio/radio` | radio / radio-group | 選択肢が排他（別の項目をタップすると前の項目が解除される）。disabled の項目は反応しない |
| `pages/form/form` | form / form-item | blur / input がバリデーションをトリガー。エラーテキストが `<text>` で正常に表示される。`validate()` が返す Promise が「送信」ボタン内で正しく resolve される。必須のアスタリスクが表示される |
| `pages/select/select` | select | タップで listbox が開く（**root-portal、階層はオーバーレイより上**）。選択肢のタップで選択され閉じる。clearable でクリア。filterable のポップアップ内入力フィールドが使用可能。**キーボードナビゲーションがないのは正常**（MP では削除済み） |
| `pages/tooltip/tooltip` | tooltip | trigger のタップでバブルが開く。位置が placement と一致する（2 フレーム計測後に定位。**最初のフレームでちらつきやずれが見えないこと**）。外側のタップで閉じる。trigger="hover" が MP で効かないのは正常とみなす |
| `pages/dialog/dialog` | dialog | 開くときオーバーレイとトランジションがある。オーバーレイのタップで `closeOnClick-modal` に従って閉じる。bottom 定位が全画面デバイスで `safe-area-inset-bottom` を適用する。**Esc と lockScroll が MP で無効なのは正常**。全画面モードが画面いっぱいに広がる |
| `pages/services/services` | message / loading | 次節を参照 |

## message / loading の専用チェック

| # | 項目 | 合格基準 |
| --- | --- | --- |
| S1 | 各タイプのメッセージ | success / info / warning / danger / loading の 5 タイプが表示され、アイコンと色が正しい |
| S2 | 自動クローズ | デフォルトで 3 秒後に消え、消えるときにトランジションがある（**瞬間的に消えない**） |
| S3 | 手動クローズ | loading タイプは自動クローズせず、`handle.close()` の後に消える |
| S4 | 複数メッセージの積み重ね | 連続して呼び出したとき縦に積み重なって重ならず、max を超えると古いものから押し出される |
| S5 | 全画面オーバーレイ | loading.show で全画面オーバーレイが現れ、オーバーレイ中は下の層がタップできない |
| S6 | クローズコールバック | onClose コールバックがメッセージの消失時に発火する |
| S7 | 未マウントの警告 | （専用に検証：ページから `<lh-message />` を削除してから呼び出す）コンソールが `console.error` で明確に警告し、**無言にならないこと** |

## 既知の MP 端「非欠陥」（見つけても bug として報告しない）

- select / dialog / tooltip は**キーボードナビゲーション / Esc / focus-trap / lockScroll なし** —— コンパイル期に削除済み。詳細は
  [プラットフォームサポート](/ja/guide/platform) を参照。
- tooltip の `trigger="hover"` は MP 端でトリガーされない —— hover セマンティクスがないため click を使う。
- message / loading は先にマウントポイントを置く必要がある。これは設計であり、bug ではない。
- icon はフォントレンダリングで、CSS の `fill` / `stroke` は無効。`color` のみ使用できる。

## 回帰結果の記録

表の右側に「合格 / 失敗（現象）」列を追加し、失敗項目はまず開発者ツールの Console と WXML パネルのスクリーンショットを貼り、
次に `docs/uniapp/uniapp组件库计划.md` のプラットフォーム機能マトリクスと突き合わせて「想定内の降格」か真の欠陥かを判断します。
