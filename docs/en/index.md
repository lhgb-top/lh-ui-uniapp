---
layout: home

hero:
  image:
    src: /logo-banner.png
    alt: lh-ui 品牌横幅
  name: lh-ui uniapp
  text: uni-app component library
  tagline: One codebase, H5 + WeChat Mini Program; component logic and style sources shared with the Vue3 / Vue2 / React builds
  actions:
    - theme: brand
      text: Getting Started
      link: /en/guide/installation
    - theme: alt
      text: Platform Support
      link: /en/guide/platform

features:
  - title: One core, reused across platforms
    details: Component logic (state machines, validation, popper computation, i18n) lives in @lh-ui/share as pure functions; this library only adds reactive glue, so behavior matches the Vue3 / Vue2 / React builds.
  - title: H5 + WeChat Mini Program
    details: The first release covers both targets. Mini Program style restrictions (WXSS allowlist, no svg, no document) are handled uniformly by a build-time sanitization layer, so consumers have zero sass dependencies.
  - title: easycom on demand
    details: Install from npm, add one rule to pages.json, then write the tags directly in your templates; full registration via app.use is also available.
  - title: Imperative services available
    details: Message / Loading use a mount-point pattern, so imperative calls work in the Mini Program too; when no mount point is present, a clear warning is emitted during development instead of silently degrading.
---

::: tip Relation to other builds in the family
This library is the uni-app target of the lh-ui family web bloodline. It shares the core pure functions and style sources of `@lh-ui/share` with `@lh-ui/vue3` (plus), `@lh-ui/vue2`, and `@lh-ui/react`. Prop naming is mostly identical to the Vue3 version; for platform differences see [API Differences from the Vue3 Version](/en/guide/differences).
:::
