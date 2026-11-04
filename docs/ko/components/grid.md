# Grid 그리드

24열 그리드 레이아웃: `lh-row`와 `lh-col`의 조합（easycom으로 태그를 직접 작성 가능；필요 시 import 시 컴포넌트 이름은 `LhRow` / `LhCol`）. 내부적으로 CSS Grid를 사용하며, `span` / `offset` / `push` / `pull`은 그대로 `grid-column` 배치에 매핑됩니다. 클래스명과 배치 알고리즘은 모두 `@lh-ui/share` core 순수 함수가 산출합니다.

## 기본 레이아웃

```vue
<template>
  <lh-row>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## 열 간격 gutter

`gutter`는 `number`（가로만）또는 `[가로, 세로]` 배열을 받으며, Row는 음수 바깥 여백으로 열 안쪽 여백을 상쇄합니다.

```vue
<template>
  <lh-row :gutter="16">
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
    <lh-col :span="8"><view class="cell">8</view></lh-col>
  </lh-row>
  <lh-row :gutter="[16, 24]">
    <lh-col :span="12"><view class="cell">12</view></lh-col>
    <lh-col :span="12"><view class="cell">12</view></lh-col>
  </lh-row>
</template>
```

## 주축 정렬 justify / 교차축 정렬 align

`justify`의 `center`와 `align`의 `middle`은 각각 독립적인 수정자 클래스로 매핑됩니다（두 축이 클래스를 공유하지 않음）；`align='center'`는 `middle`의 호환 별칭입니다.

```vue
<template>
  <lh-row justify="center" align="middle">
    <lh-col :span="6"><view class="cell">6</view></lh-col>
    <lh-col :span="6"><view class="cell">6</view></lh-col>
  </lh-row>
</template>
```

## 오프셋과 이동

- `offset`：시작점을 N열만큼 오른쪽으로 이동（명시적 시작 `offset + 1`）
- `push` / `pull`：offset을 기준으로 시작점을 오른쪽 / 왼쪽으로 이동

```vue
<template>
  <lh-row>
    <lh-col :span="6" :offset="6"><view class="cell">6 / offset 6</view></lh-col>
    <lh-col :span="9" :push="6"><view class="cell">9 / push 6</view></lh-col>
  </lh-row>
</template>
```

## 반응형 브레이크포인트

`xs` / `sm` / `md` / `lg` / `xl`은 `<640 / ≥640 / ≥768 / ≥1024 / ≥1280px`에서 각각 적용되며, 선언되지 않은 경우 정의된 가장 가까운 하위 단계로 폴백합니다（`xs`가 항상 최후보）. `sizes`로 일괄 선언할 수도 있습니다.

```vue
<template>
  <lh-row>
    <lh-col :xs="24" :sm="12" :md="8" :lg="6">
      <view class="cell">xs=24 sm=12 md=8 lg=6</view>
    </lh-col>
  </lh-row>
</template>
```

## Row Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| gutter | 열 간격（px, 또는 `[가로, 세로]`） | `number \| [number, number]` | `0` |
| justify | 주축 정렬 | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around'` | `'start'` |
| align | 교차축 정렬 | `'top' \| 'middle' \| 'bottom'` | `'top'` |
| wrap | 줄 바꿈 여부 | `boolean` | `true` |
| customClass | 커스텀 클래스（루트 노드로 전달） | `string` | — |
| sx | sx 축약 레이아웃 속성 | `LhSxProps` | — |

## Col Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| span | 차지하는 열 수（24 그리드 기준） | `number` | — |
| offset | 선행 오프셋 열 수 | `number` | — |
| push | 오른쪽으로 이동할 열 수 | `number` | — |
| pull | 왼쪽으로 이동할 열 수 | `number` | — |
| xs / sm / md / lg / xl | 각 브레이크포인트별 크기（`number` 또는 `{ span, offset }`） | `LhColSize` | — |
| sizes | 브레이크포인트별 일괄 선언（xs–xl과 동등, 둘 중 하나 사용） | `LhBreakpointSizes` | — |
| customClass | 커스텀 클래스（루트 노드로 전달） | `string` | — |
| sx | sx 축약 레이아웃 속성 | `LhSxProps` | — |

## Slots

| Slot | 설명 |
| --- | --- |
| default | 그리드 내용（Row와 Col 모두 기본 슬롯 제공） |

## 플랫폼 차이

- **순수 레이아웃 컴포넌트**：오버레이, 계측, document 의존성이 없어 H5와 WeChat 미니프로그램에서 동일하게 동작합니다.
- **브레이크포인트 소스**：H5는 `matchMedia`로 뷰포트 변화를 감지하지만, **미니프로그램에는 matchMedia가 없어** 항상 `xs` 단계로 고정 강등됩니다（폴백 규칙은 여전히 share core의 `resolveResponsiveSize`가 결정하되, 현재 브레이크포인트만 `xs`로 고정）. 미니프로그램에서 화면 너비별 분할이 필요하다면 `uni.getSystemInfoSync().windowWidth`를 `useLhBreakpoint`의 주입 인터페이스에 직접 연결하거나, 미니프로그램용으로 고정 레이아웃을 하나 정의하세요.
- **태그 치환**：plus의 `<div>`는 `<view>`가 됩니다（WXSS는 태그 선택자를 금지하며, 스타일은 `lh-row*` / `lh-col*` 클래스로 적용）.
- **`grid-column` 배치**：순수 `span`은 auto-placement（`span N`）를 사용하고, `offset` / `push` / `pull`이 있으면 시작점을 명시적으로 배치한 뒤 24열 좌표계 안으로 클램프하여, 범위를 벗어난 조합이 컨테이너를 깨뜨리지 않게 합니다.

::: tip Vue3 버전과의 차이
- 컴포넌트 구조, props 구성, 클래스명, 배치 알고리즘이 plus와 완전히 일치합니다（동일한 share core）.
- 하위 컴포넌트 태그는 easycom 관례에 따라 `lh-row` / `lh-col`입니다（필요 시 import 시 `LhRow` / `LhCol`）.
- `customClass` prop이 추가되었습니다：uni-app에서는 커스텀 클래스가 `styleIsolation`을 통과하지 못해 prop으로 전달합니다（plus는 class를 직접 전달）.
:::
