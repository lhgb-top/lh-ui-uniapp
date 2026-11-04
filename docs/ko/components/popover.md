# Popover 팝오버

풍부한 콘텐츠를 담는 팝오버: Tooltip보다 많은 정보(제목, 본문, 인터랙티브 노드)를 표시합니다. 트리거는 기본 슬롯으로 감싸고 팝업 콘텐츠는 `content` 슬롯으로 전달합니다. 팝업 층은 `role="dialog"`이며 화살표는 항상 트리거를 가리킵니다.

## 기본 사용법

```vue
<template>
  <lh-popover title="수묵 팁" placement="top">
    <lh-button>클릭하여 열기</lh-button>
    <template #content>
      <text>풍부한 콘텐츠입니다. 어떤 노드든 넣을 수 있습니다.</text>
    </template>
  </lh-popover>
</template>
```

::: warning 미니프로그램에는 hover / focus 시맨틱이 없습니다
`trigger`의 기본값은 `click`(모든 타깃에서 사용 가능)입니다. `hover` / `focus`는 H5에서만 유효합니다. 미니프로그램에서는 자동으로 탭 / 터치 토글로 대체됩니다(첫 탭으로 열고 다시 탭하면 닫힙니다).
:::

## 트리거 방식

```vue
<template>
  <!-- 호버 트리거(H5에서만 유효, 미니프로그램에서는 탭 토글로 대체) -->
  <lh-popover trigger="hover" title="호버 트리거">
    <lh-button>가리켜 보세요</lh-button>
    <template #content><text>포인터가 팝업 층으로 이동해도 닫히지 않습니다.</text></template>
  </lh-popover>

  <!-- 포커스 트리거(H5에서만 유효) -->
  <lh-popover trigger="focus" title="포커스 트리거">
    <lh-input placeholder="입력란에 포커스" />
    <template #content><text>입력란이 포커스를 얻으면 표시됩니다.</text></template>
  </lh-popover>

  <!-- 수동 제어: 표시 여부를 완전히 외부 v-model:visible로 제어 -->
  <lh-popover v-model:visible="manualVisible" trigger="manual" title="수동 제어">
    <lh-button @click="manualVisible = !manualVisible">외부 스위치</lh-button>
    <template #content><text>표시 여부는 완전히 외부 상태로 제어됩니다.</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const manualVisible = ref(false)
</script>
```

> 지연 `showAfter` / `hideAfter`는 오조작 방지용 hover / focus(H5)에만 적용됩니다. `click`과 `manual`은 즉시 반응합니다.

## 12가지 배치

```vue
<template>
  <lh-popover
    v-for="p in placements"
    :key="p"
    :placement="p"
    :title="p"
  >
    <lh-button size="small">{{ p }}</lh-button>
    <template #content><text>배치: {{ p }}</text></template>
  </lh-popover>
</template>

<script setup lang="ts">
const placements = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end',
] as const
</script>
```

> 뷰포트 공간이 부족하면 팝업 층이 자동으로 방향을 뒤집고(flip) 교차축에서 되밀어 넣습니다(shift). 화살표 위치도 이에 맞춰 바뀝니다.

## 너비, 화살표, 비활성화

```vue
<template>
  <!-- 고정 너비 -->
  <lh-popover title="고정 너비" width="240">
    <lh-button>고정 너비</lh-button>
    <template #content><text>width로 팝업 층의 너비를 지정합니다.</text></template>
  </lh-popover>

  <!-- 화살표 없음 -->
  <lh-popover title="화살표 없음" :arrow="false">
    <lh-button>화살표 없음</lh-button>
    <template #content><text>arrow가 false이면 화살표를 렌더링하지 않습니다.</text></template>
  </lh-popover>

  <!-- 비활성화 -->
  <lh-popover title="비활성화됨" disabled>
    <lh-button disabled>비활성화된 트리거</lh-button>
    <template #content><text>disabled일 때 트리거와 팝업 층 모두 반응하지 않습니다.</text></template>
  </lh-popover>
</template>
```

## Popover API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| placement | 표시 위치(12가지) | `LhPopoverPlacement` | `'top'` |
| trigger | 트리거 방식: `click`(전 타깃) / `hover`, `focus`(H5 전용, MP에서는 탭으로 대체) / `manual`(제어) | `'click' \| 'hover' \| 'focus' \| 'manual'` | `'click'` |
| title | 제목(title 슬롯도 가능) | `string` | — |
| visible | 수동 제어 표시 상태(v-model:visible) | `boolean` | — |
| disabled | 비활성화 여부 | `boolean` | `false` |
| arrow | 화살표 표시 여부 | `boolean` | `true` |
| width | 팝업 층 너비(숫자는 px) | `string \| number` | — |
| popperClass | 팝업 층 사용자 정의 클래스명 | `string` | — |
| showAfter | 표시 지연(ms, H5의 hover / focus에만 유효) | `number` | — |
| hideAfter | 숨김 지연(ms, H5의 hover / focus에만 유효) | `number` | — |
| themeVars | 컴포넌트 수준 테마 변수 | `Record<string, string>` | — |
| bgPattern | 컴포넌트 수준 배경 패턴, ConfigProvider 설정을 재정의 | `string` | — |
| sx | sx 빠른 레이아웃 속성(트리거 루트 요소에 적용) | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 매개변수 |
| --- | --- | --- |
| update:visible | 표시 상태 변경(v-model) | `(value: boolean)` |
| show | 표시 후 발화 | — |
| hide | 숨김 후 발화 | — |

### Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 트리거 내용 |
| title | 사용자 정의 제목 |
| content | 팝업 내용 |

### Methods

| 메서드 | 설명 |
| --- | --- |
| show | 프로그래밍 방식으로 표시 |
| hide | 프로그래밍 방식으로 숨김 |
| toggle | 프로그래밍 방식으로 전환 |

### 접근성

- 트리거에는 `aria-haspopup="true"`와 `aria-expanded` / `aria-controls`가 붙습니다. 팝업 층은 `role="dialog"`이며 제목이 있으면 `aria-labelledby`로 연결합니다
- Esc로 닫기, 팝업 층 바깥 클릭(페이지 내 투명 마스크)으로 닫기. 여러 팝업 층이 겹치면 Esc는 최상위만 닫습니다(모두 H5 전용)
- 위치 엔진은 자체 순수 함수(flip / shift 오버플로 방지)이며 서드파티 런타임 의존이 없습니다

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **트리거 방식**: 미니프로그램에는 hover / focus 시맨틱이 없어 `trigger="hover"` / `trigger="focus"`는 MP에서 탭 / 터치 토글로 대체됩니다. 표시 / 숨김 지연(`showAfter` / `hideAfter`)은 H5의 hover / focus 모드에서만 유효하며 `click`과 `manual`은 즉시 반응합니다.
- **팝업 층 운반과 위치 결정**: `teleportTarget` prop이 없습니다. 미니프로그램에는 DOM teleport가 없어 팝업 층은 `root-portal`(구버전에서는 페이지 내 fixed 폴백)로 운반됩니다. popper 위치 결정은 2프레임 비동기 측정(숨긴 상태로 렌더링해 크기를 측정 → `computePosition`으로 배치 → 표시, 깜빡임 방지)으로 이루어지며 계산은 비동기적이므로 동기 결과를 가정할 수 없습니다. 화살표 오프셋은 컴포넌트 글루가 위치 결정 결과의 `arrowOffset`를 `--lh-arrow-offset`에 기록합니다.
- **키보드 동작은 H5 전용**: Esc 닫기는 문서 레벨 리스너로 처리합니다(여러 층이 겹치면 최상위만 닫음). 미니프로그램에는 키보드 이벤트가 없어 해당 부분은 조건부 컴파일로 제거됩니다.
- **포커스 트랩 미이식**: plus의 클릭 트리거는 포커스를 팝업 층 안에 가두고(focus-trap) 닫을 때 돌려줍니다. MP에는 키보드 포커스 시맨틱이 없어 이 저장소의 Dialog와 같이 전체를 이식하지 않았습니다.
- **표시 / 숨김 전환 미구현**: plus는 `Transition`으로 페이드하지만 MP에서는 `Transition`이 불안정하여 tooltip / dropdown과 마찬가지로 바인딩하지 않습니다.
- **트리거가 뷰포트 밖으로 스크롤되어도 자동으로 닫히지 않음**: plus의 `useLhPopper`에는 scroll-out 콜백이 있지만 uni-app에는 통합된 스크롤 / 크기 변경 감지 채널이 없어 이식하지 않았습니다.
:::
