# Select 셀렉트

## 기본 사용법

```vue
<template>
  <lh-select v-model="value" :options="options" placeholder="선택하세요" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
const options = [
  { label: '옵션 1', value: 'a' },
  { label: '옵션 2', value: 'b' },
  { label: '비활성화 항목', value: 'c', disabled: true },
]
</script>
```

## 비우기 / 필터링

```vue
<template>
  <lh-select v-model="value" :options="options" clearable />
  <lh-select v-model="value" :options="options" filterable placement="bottom" />
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue (v-model) | 바인딩 값 | `unknown` | — |
| options | 옵션 목록 | `LhSelectOption[]` | — |
| size | 크기 | `'small' \| 'medium' \| 'large'` | — |
| disabled | 비활성화 | `boolean` | `false` |
| clearable | 비우기 가능 | `boolean` | `false` |
| placeholder | 플레이스홀더 텍스트 | `string` | — |
| filterable | 필터링 가능(MP 측에서는 레이어 내에 입력 상자 제공) | `boolean` | `false` |
| placement | 레이어 위치(12개 방위) | `LhPlacement` | `'bottom'` |
| customClass | 커스텀 클래스명 | `string` | — |
| themeVars | 컴포넌트 수준 테마 변수 | `Record<string, string>` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

### LhSelectOption

| 속성 | 설명 | 타입 |
| --- | --- | --- |
| label | 표시 문구 | `string` |
| value | 값 | `unknown` |
| disabled | 비활성화 | `boolean` |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| update:modelValue | 값 변경 | `(value)` |
| change | 값 변경(비움 시 `undefined` 포함) | `(value)` |
| visible-change | 레이어 표시 / 숨김 | `(visible: boolean)` |

::: tip Vue3 버전과의 차이
- 레이어는 `root-portal` + 2프레임 비동기 측정 위치 지정을 사용합니다(absolute 위치 지정이 아님).
- **키보드 탐색(↑↓ / Home / End)은 H5 전용**, 미니프로그램에는 키보드 이벤트가 없어 컴파일 시 제거됩니다 — MP 측에서는
  옵션을 클릭하는 것만 가능합니다.
- `filterable`의 필터 입력 상자는 MP 측에서 레이어 내부에 렌더링됩니다.
:::
