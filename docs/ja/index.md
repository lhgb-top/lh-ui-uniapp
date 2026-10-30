---
layout: home

hero:
  name: lh-ui uniapp
  text: uni-app コンポーネントライブラリ
  tagline: 1 つのコードベースで H5 + WeChat ミニプログラム。コンポーネントのロジックとスタイルソースは Vue3 / Vue2 / React 版と共通
  actions:
    - theme: brand
      text: クイックスタート
      link: /ja/guide/installation
    - theme: alt
      text: プラットフォームサポート
      link: /ja/guide/platform

features:
  - title: 1 つの core、複数プラットフォームで再利用
    details: コンポーネントのロジック（状態マシン、バリデーション、popper 計算、i18n）は @lh-ui/share の純関数で、本ライブラリはリアクティブなグルーのみを記述します。Vue3 / Vue2 / React 版と挙動が一致します。
  - title: H5 + WeChat ミニプログラム
    details: 初版は両端をカバーします。ミニプログラムのスタイル制限（WXSS ホワイトリスト、svg なし、document なし）はビルド時の精製層で一括処理されるため、利用側の sass 依存はゼロです。
  - title: easycom によるオンデマンド導入
    details: npm でインストールし、pages.json にルールを 1 行追加するだけで、テンプレートにタグを直接書いて使えます。app.use による一括登録も可能です。
  - title: 命令的サービスが利用可能
    details: Message / Loading はマウントポイントパターンを採用し、ミニプログラムでも命令的に呼び出せます。マウントポイントがない場合は開発時に明確な警告を出し、無言のフォールバックは行いません。
---

::: tip ファミリーの他端との関係
本ライブラリは lh-ui ファミリー Web 血脈の uni-app 端で、`@lh-ui/vue3`（plus）、`@lh-ui/vue2`、`@lh-ui/react`
と `@lh-ui/share` の core 純関数およびスタイルソースを共有しています。Props の命名は Vue3 版とほぼ同じで、
プラットフォームごとの違いは [Vue3 版との API 差異](/ja/guide/differences) を参照してください。
:::
