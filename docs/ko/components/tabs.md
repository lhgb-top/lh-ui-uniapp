# Tabs 탭

같은 영역 내에서 탭 창을 전환합니다. 탭 헤더는 가로 스크롤, 카드 외형, 닫기/추가를 지원합니다.

## 기본 사용법

`v-model`로 활성 창의 `name`을 바인딩합니다. 생략 시 사용 가능한 첫 번째 창이 활성화됩니다.

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="ink"
      label="수묵"
    >
      수묵: 초·농·중·담·청.
    </lh-tab-pane>
    <lh-tab-pane
      name="danqing"
      label="단청"
    >
      단청: 단사와 청괄, 회화를 가리킵니다.
    </lh-tab-pane>
    <lh-tab-pane
      name="liubai"
      label="여백"
    >
      여백: 백을 흑처럼 다루어 여운을 살립니다.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('ink')
</script>
```

## 카드형

`type="card"`로 카드 외형으로 전환합니다.

```vue
<template>
  <lh-tabs
    v-model="active"
    type="card"
  >
    <lh-tab-pane
      name="spring"
      label="봄"
    >
      봄: 초목이 움트다.
    </lh-tab-pane>
    <lh-tab-pane
      name="summer"
      label="여름"
    >
      여름: 만물이 무성하다.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## 탭 위치

`tab-position="bottom"`으로 탭 헤더를 콘텐츠 아래에 배치합니다.

```vue
<template>
  <lh-tabs
    v-model="active"
    tab-position="bottom"
  >
    <lh-tab-pane
      name="poem"
      label="시"
    >
      시: 뜻을 말하다.
    </lh-tab-pane>
    <lh-tab-pane
      name="painting"
      label="그림"
    >
      그림: 뜻을 그리다.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## 비활성화 탭

`lh-tab-pane`에 `disabled`를 전달하면 활성화할 수 없습니다(클릭 무반응, `modelValue`가 해당 창을 가리키면 사용 가능한 첫 창으로 되돌아갑니다).

```vue
<template>
  <lh-tabs v-model="active">
    <lh-tab-pane
      name="first"
      label="사용 가능"
    >
      첫 번째 창은 사용 가능합니다.
    </lh-tab-pane>
    <lh-tab-pane
      name="second"
      label="비활성화"
      disabled
    >
      이 창은 비활성화되어 활성화할 수 없습니다.
    </lh-tab-pane>
  </lh-tabs>
</template>
```

## 닫기 및 추가

`closable`은 각 탭에 닫기 버튼을 렌더링하고(클릭 시 `tab-remove` 발생), `addable`은 추가 버튼을 렌더링합니다(클릭 시 `tab-add` 발생).
컴포넌트는 이벤트만 발생시키며, 탭 노드의 추가/삭제는 비즈니스 계층이 처리합니다. Vue3 버전과 동일합니다.

```vue
<template>
  <lh-tabs
    v-model="active"
    closable
    addable
    @tab-remove="handleRemove"
    @tab-add="handleAdd"
  >
    <lh-tab-pane
      v-for="pane in panes"
      :key="pane.name"
      :name="pane.name"
      :label="pane.label"
    >
      {{ pane.label }}: 창 콘텐츠.
    </lh-tab-pane>
  </lh-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('one')
const panes = ref([
  { name: 'one', label: '탭 1' },
  { name: 'two', label: '탭 2' },
])

function handleRemove(name: string) {
  panes.value = panes.value.filter((pane) => pane.name !== name)
}

function handleAdd() {
  panes.value.push({ name: `new-${panes.value.length + 1}`, label: '새 탭' })
}
</script>
```

## Tabs Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 활성 창의 name (v-model) | `string` | — |
| type | 외형: `'line'` 밑줄 / `'card'` 카드 | `'line' \| 'card'` | `'line'` |
| closable | 탭을 닫을 수 있는지 | `boolean` | `false` |
| addable | 추가 버튼 표시 여부 | `boolean` | `false` |
| tabPosition | 탭 위치: `'top'` / `'bottom'` | `'top' \| 'bottom'` | `'top'` |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 레이아웃 단축 속성 | `LhSxProps` | — |

## TabPane Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| name | 창의 고유 식별자(안정적 키, 동적 변경 비권장) | `string` | — |
| label | 탭 라벨 | `string` | `''` |
| disabled | 비활성화 여부 | `boolean` | `false` |
| customClass | 커스텀 클래스명(창 루트 노드에 전달) | `string` | — |

## Events

| Event | 설명 | 콜백 인수 |
| --- | --- | --- |
| update:modelValue | 활성 창 변경(v-model) | `(name: string)` |
| tab-change | 사용자 상호작용으로 활성 창 변경 | `(name: string)` |
| tab-remove | 닫기 버튼 클릭. 컴포넌트 자체는 자식 노드를 제거하지 않고 비즈니스 계층이 관리 | `(name: string)` |
| tab-add | 추가 버튼 클릭. 컴포넌트 자체는 자식 노드를 추가하지 않고 비즈니스 계층이 관리 | — |

## Slots

| Slot | 설명 |
| --- | --- |
| Tabs default | 창 노드(`lh-tab-pane`만 수집, `v-for` / `template`으로 감쌀 수 있음) |
| TabPane default | 창 콘텐츠 |

## 플랫폼 차이점

- 탭 헤더는 `scroll-view`로 구현합니다(가로 스크롤 네비게이션 바). WeChat 미니프로그램에서는 `enable-flex`로 스크롤 컨테이너를 flex 레이아웃으로 만들어 탭이 줄어들거나 줄바꿈하지 않게 합니다. H5에서는 클래스명의 `display: flex`가 적용됩니다.
- **활성 밑줄은 순수 CSS 트랜지션**입니다(활성 탭의 `::after` 먹선). `transitionend`에 의존하지 않습니다. 향후 JS 연동 슬라이딩 인디케이터를 구현한다면: 미니프로그램에서는 `transitionend`가 신뢰할 수 없으므로 `setTimeout`으로 시간을 맞춰야 합니다(message / loading 트랜지션과 동일한 방식).
- **키보드 탐색(방향키 / Home / End / Delete 닫기)은 H5 전용**입니다: 미니프로그램에는 키보드 이벤트가 없으며, 컴파일 시점 상수 가드로 인해 MP 번들에 탐색 분岐가 포함되지 않습니다(데드 코드 없음). roving tabindex의 `tabindex` 속성은 MP에 유지되지만 키보드 의미는 없습니다.
- 접근성 `role="tablist" / "tab" / "tabpanel"`과 `aria-selected` / `aria-controls` / `aria-labelledby`는 양쪽 플랫폼 모두 출력합니다. 미니프로그램의 스크린 리더 지원은 플랫폼 능력에 따릅니다.
- 탭과 창의 `id`는 인스턴스별 고유 접두사(`generateId`)로 생성되어 한 페이지에 여러 tabs가 있어도 충돌하지 않습니다.
- **이식 결정(Vue3 버전에 정렬, 미정의 API 미도입)**: 이식 시점에 plus 진원과 `@lh-ui/share` core에 `lazy`, `before-leave`, `editable`(= closable + addable의 편의 문법), `border-card` 외형이 아직 없었으므로 이 라이브러리에서도 제공하지 않습니다. 창 콘텐츠는 항상 렌더링되며 `v-show`로 표시를 전환합니다. 진원에 추가되면 이를 따라 업그레이드합니다.
