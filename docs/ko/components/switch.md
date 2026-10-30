# Switch 스위치

::: tip 미니프로그램 측은 view 자체 그리기
네이티브 switch 컴포넌트는 미니프로그램에서 스타일을 제어할 수 없어, view로 슬라이더를 직접 그려 시각적 일치를
보장합니다.
:::

## 기본 사용법

```vue
<template>
  <lh-switch v-model="on" />
  <lh-switch v-model="on" active-text="켜짐" inactive-text="꺼짐" />
  <lh-switch v-model="on" loading />
  <lh-switch v-model="on" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const on = ref(true)
</script>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue (v-model) | 켜짐 여부 | `boolean` | `false` |
| disabled | 비활성화 | `boolean` | `false` |
| loading | 로딩 중 | `boolean` | `false` |
| name | 네이티브 name | `string` | — |
| size | 크기 | `'small' \| 'medium' \| 'large'` | — |
| activeText | 켜짐 문구 | `string` | — |
| inactiveText | 꺼짐 문구 | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| update:modelValue | 값 변경 | `(value: boolean)` |
| change | 값 변경 | `(value: boolean)` |
