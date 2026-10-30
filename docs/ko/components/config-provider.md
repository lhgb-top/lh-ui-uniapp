# ConfigProvider 전역 설정

전역 설정 컴포넌트로, 자손 컴포넌트에 크기, 언어, 테마 모드와 테마 변수를 제공합니다.

::: tip 미니프로그램 측의 다크 구현
web 버전(plus)은 다크 전환 시 `document.documentElement`를 조작하지만, 미니프로그램에는 document가 없습니다.
본 라이브러리의 다크는 **감싸는 노드에 `dark` 클래스를 추가**하는 방식으로 구현됩니다 — 정제된 스타일에서 다크 블록
선택자는 `page.dark, .dark`이므로, 다크 스코프는 ConfigProvider의 감싸는 범위를 따릅니다.
:::

## 기본 사용법

```vue
<template>
  <lh-config-provider :size="size" :locale="locale" :theme="theme" :theme-vars="themeVars">
    <view class="app">
      <lh-button type="primary">버튼</lh-button>
    </view>
  </lh-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref<'small' | 'medium' | 'large'>('medium')
const locale = ref<'zh-CN' | 'en-US'>('zh-CN')
const theme = ref<'light' | 'dark'>('light')
const themeVars = ref({
  'primary-color': '#1677ff',
  'bg-pattern': 'var(--lh-pattern-willow)',
})
</script>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| size | 전역 크기 | `'small' \| 'medium' \| 'large'` | — |
| locale | 전역 언어 | `'zh-CN' \| 'en-US'` | — |
| theme | 테마 모드(uni-app 측 추가) | `'light' \| 'dark'` | `'light'` |
| themeVars | 전역 테마 변수(키명에 자동으로 `--lh-` 접두어 추가) | `Record<string, string>` | — |
| componentTheme | 컴포넌트별 테마 변수 개별 설정, 전역 themeVars 재정의 | `Partial<Record<LhThemeableComponent, Record<string, string>>>` | — |

### themeVars가 지원하는 키

- 테마 색상: `primary-color` / `success-color` / `warning-color` / `danger-color` / `info-color`
- 중국풍 색상: `gold-color` / `vermilion-color` / `jade-color`
- 중성색: `bg-color` / `text-color` / `border-color`
- 문양: `bg-pattern`(`var(--lh-pattern-willow)` 등) / `bg-pattern-opacity` / `bg-pattern-color`
- 장식: `decoration-color`

### 우선순위

컴포넌트 자체 props > `componentTheme[컴포넌트명]` > 전역 `themeVars`.
