# Checkbox 체크박스

::: tip 미니프로그램 측은 view 자체 그리기
네이티브 checkbox 컴포넌트를 사용하지 않고(MP는 스타일을 제어할 수 없음), view로 체크 상자를 직접 그리고 lh-icon
아이콘을 사용하여 패밀리의 다른 단말과 시각적으로 일치시킵니다.
:::

## 기본 사용법

```vue
<template>
  <lh-checkbox v-model="checked" label="약관 동의" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
```

## 체크박스 그룹

```vue
<template>
  <lh-checkbox-group v-model="values">
    <lh-checkbox value="a" label="옵션 1" />
    <lh-checkbox value="b" label="옵션 2" />
    <lh-checkbox value="c" label="옵션 3" disabled />
  </lh-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const values = ref(['a'])
</script>
```

## 중간 선택 상태

```vue
<lh-checkbox v-model="checked" indeterminate label="전체 선택(일부 선택됨)" />
```

## Checkbox Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue (v-model) | 체크 여부 | `boolean` | `false` |
| value | group 내의 식별 값 | `unknown` | — |
| label | 문구 | `string` | — |
| disabled | 비활성화 | `boolean` | `false` |
| indeterminate | 중간 선택 상태 | `boolean` | `false` |
| name | 네이티브 name | `string` | — |
| size | 크기 | `'small' \| 'medium' \| 'large'` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## CheckboxGroup Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue (v-model) | 선택 값 배열 | `unknown[]` | `[]` |
| disabled | 모든 자식 항목 비활성화 | `boolean` | `false` |
| name | 네이티브 name | `string` | — |
| size | 크기(자식 항목에 전달) | `'small' \| 'medium' \| 'large'` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| update:modelValue | 값 변경 | `(value)` |
| change | 값 변경 | `(value)` |
