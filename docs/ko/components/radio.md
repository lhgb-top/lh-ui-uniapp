# Radio 라디오 버튼

::: tip 미니프로그램 측은 view 자체 그리기
네이티브 radio 컴포넌트를 사용하지 않고(MP는 스타일을 제어할 수 없음), view로 점을 직접 그립니다.
:::

## 기본 사용법

```vue
<template>
  <lh-radio-group v-model="value">
    <lh-radio value="a" label="옵션 1" />
    <lh-radio value="b" label="옵션 2" />
    <lh-radio value="c" label="옵션 3" disabled />
  </lh-radio-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref('a')
</script>
```

## Radio Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue (v-model) | 선택 여부 | `unknown` | — |
| value | 이 항목의 값 | `unknown` | — |
| label | 문구 | `string` | — |
| disabled | 비활성화 | `boolean` | `false` |
| name | 네이티브 name | `string` | — |
| size | 크기 | `'small' \| 'medium' \| 'large'` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## RadioGroup Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue (v-model) | 선택 값 | `unknown` | — |
| disabled | 모든 자식 항목 비활성화 | `boolean` | `false` |
| name | 네이티브 name | `string` | — |
| size | 크기(자식 항목에 전달) | `'small' \| 'medium' \| 'large'` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| update:modelValue | 값 변경 | `(value)` |
| change | 값 변경 | `(value)` |
