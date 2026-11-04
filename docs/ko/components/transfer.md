# Transfer 트랜스퍼

두 개 패널 목록과 체크박스 기반 이동을 결합한 컴포넌트입니다. 데이터 분할, 필터링,
전체 선택, 이동 로직은 모두 `@lh-ui/share`의 core 순수 함수
(`partitionTransferData` / `filterTransferItems` / `toggleTransferCheckAll` /
`moveTransferKeys` 등)를 그대로 소비하고, 컴포넌트 계층은 렌더링, 이벤트,
키보드 탐색만 담당합니다. 양쪽 패널 모두 `role="listbox"`입니다(APG listbox 패턴).

## 기본 사용법

```vue
<template>
  <lh-transfer v-model="source" :data="items" @change="onChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhTransferItem } from '@lh-ui/share/core/transfer'

const source = ref<Array<string | number>>(['a'])
const items: LhTransferItem[] = [
  { key: 'a', label: '갑' },
  { key: 'b', label: '을' },
  { key: 'c', label: '병', disabled: true },
  { key: 'd', label: '정' },
]

function onChange(keys: Array<string | number>, direction: 'left-to-right' | 'right-to-left') {
  console.log(keys, direction)
}
</script>
```

`v-model`은 왼쪽(소스) 키 목록을 바인딩합니다. `modelValue`에 포함된 키는 왼쪽 열에,
나머지는 오른쪽 열에 표시됩니다. 임의의 항목을 체크한 뒤 가운데 › / ‹ 버튼을 누르면
이동하며, `update:modelValue`와 `change`(방향 `'left-to-right'` / `'right-to-left'`
포함)이 이어서 발생합니다. 체크된 항목 목록은 이동 후 비워집니다.

각 패널 상단에는 검색창이 상시 자리합니다(Vue3 버전과 동일하게 끌 수 없음).
라벨 기준으로 대소문자 구분 없이 필터링하며, 패널 헤더에는 '현재 쪽 개수 / 전체 개수'
카운트와 전체 선택 상자가 표시됩니다(일부 선택 상태는 `indeterminate`가 담당).

`data`는 `LhTransferItem[]`입니다. `key`는 고유 값, `label`은 표시 텍스트(누락 시 key로
대체), `disabled`는 해당 항목을 비활성화합니다(체크 불가, 전체 선택 제외, 이동 불가).

## 비활성화

`disabled`는 트랜스퍼 전체를 비활성화합니다. 체크, 전체 선택, 검색, 이동까지
모든 조작이 차단됩니다.

```vue
<template>
  <lh-transfer v-model="source" :data="items" disabled />
</template>
```

## API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| data | 전체 데이터 | `LhTransferItem[]` | — |
| modelValue | 왼쪽(소스) 키 목록(제어 v-model) | `Array<string \| number>` | `[]` |
| disabled | 비활성화 | `boolean` | `false` |
| sx | sx 빠른 레이아웃 속성 | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 매개변수 |
| --- | --- | --- |
| update:modelValue | 왼쪽(소스) 키 목록 변경(v-model용) | `(keys: Array<string \| number>)` |
| change | 데이터 이동 완료 후 발생 | `(keys: Array<string \| number>, direction: 'left-to-right' \| 'right-to-left')` |

### LhTransferItem

| 필드 | 설명 | 타입 |
| --- | --- | --- |
| key | 고유 키 | `string \| number` |
| label | 표시 텍스트(누락 시 key로 대체) | `string` |
| disabled | 비활성화(체크 불가 / 전체 선택 제외 / 이동 불가) | `boolean` |

### 접근성

- 양쪽 패널 모두 `role="listbox"` + `aria-multiselectable`이며, 항목은
  `role="option"`에 `aria-selected` / `aria-disabled`를 노출
- 각 패널의 검색창은 `aria-label`을 가지고, 이동 버튼에도 `aria-label`
  ('오른쪽으로 이동' / '왼쪽으로 이동')이 부여됩니다
- 전체 선택 상자의 일부 선택 상태는 `indeterminate`가 담당하며, 비활성 항목은
  체크, 전체 선택, 이동의 모든 단계에서 제외됩니다

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **API 범위는 plus 소스에 엄격하게 정렬**: 이 패키지는 plus에 있는 `data` /
  `modelValue` / `disabled` / `sx`만 제공합니다. 다른 라이브러리에 흔히 있지만
  plus 소스에는 없는 `titles`(패널 제목), `filterable`(검색 토글), `props`
  (필드명 커스터마이징), `left/right-default-checked`(기본 체크 키)는
  의도적으로 추가하지 않았습니다. 패널 제목은 share locales의
  `transfer.sourceTitle` / `transfer.targetTitle` 키(10개 국어 지원)에서
  가져오고, 검색창은 plus의 상시 형태(토글 없음)를 그대로 따릅니다.
- **두 목록을 scroll-view가 담당**: Vue3 버전의 `<ul>` / `<li>` 목록은
  `<scroll-view scroll-y>` + `<view>`로 대체됩니다(미니 프로그램에서는
  `view`의 오버플로우 스크롤이 신뢰할 수 없기 때문). H5와 WeChat 미니
  프로그램에서 동일하게 동작하며, 목록 스타일은 여전히 share의
  `.lh-transfer-panel__list`에서 가져옵니다.
- **버튼 이동은 모든 환경에서 사용 가능**: 가운데 › / ‹ 이동 버튼은
  uni 내장 `<button>`으로, H5와 미니 프로그램 양쪽에서 모두 클릭할 수
  있습니다. 여기에는 플랫폼 차이가 없으며, 비활성 상태는 `disabled`
  속성이 담당합니다.
- **키보드 탐색은 H5 전용**: APG listbox 패턴의 키 조작 — 필터링된 목록
  안에서 ↑/↓ 이동(비활성 항목 건너뜀, 순환 없음), Enter / Space로 포커스
  항목 체크, ←/→로 패널 간 포커스 이동, Escape로 포커스 재설정 — 은
  H5에서만 작동합니다. 미니 프로그램에는 키보드 이벤트가 없어 이 블록
  전체가 조건부 컴파일로 제거되며(MP 번들에 데드 코드 없음),
  roving tabindex 역시 H5에서만 값이 내려갑니다.
- **체크박스는 자체 그리기**: 전체 선택 상자와 항목별 체크박스에 네이티브
  `<input type="checkbox">`를 사용하지 않습니다(미니 프로그램에서는
  스타일을 제어할 수 없음). 대신 이 패키지의 `lh-checkbox`(view 자체
  그리기 + lh-icon)를 사용하며, 상태는 여전히 컴포넌트가 제어 방식으로
  기록하여 의미 체계는 동일합니다.
:::
