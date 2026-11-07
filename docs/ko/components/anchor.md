# Anchor 앵커 내비게이션

앵커 내비게이션: 클릭하면 해당 섹션으로 이동하고, 스크롤 시 현재 섹션을 연동하여 강조 표시합니다. 평탄화(`flattenAnchorItems`)와 활성 앵커 판정(`resolveActiveAnchor`)은 `@lh-ui/share`의 core 순수 함수에서 제공됩니다.

## 플랫폼 차이 (중요)

- **H5**: 컴포넌트가 직접 `window`(또는 `target` 컨테이너)의 스크롤을 감시하며, 앵커 위치 이동은 네이티브 `scrollIntoView`를 사용합니다.
- **WeChat 미니프로그램**: 스크롤 연동을 위해 `scroll-view`의 `detail.scrollTop`을 `scrollTop` prop으로 주입해야 합니다. 앵커를 클릭하면 컴포넌트가 `update:scrollIntoView`(대상 섹션 id)를 발생시키고, 이를 `scroll-view`의 `scroll-into-view` 속성에 바인딩하여 위치를 이동합니다. `target`을 전달하지 않으면 페이지 단위 위치 이동이 되며, 컴포넌트가 `uni.pageScrollTo({ selector })`를 직접 호출합니다.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-into-view="anchorTarget"
    @scroll="onScroll"
  >
    <view id="section-a" class="my-section">区块 A</view>
    <view id="section-b" class="my-section">区块 B</view>
    <lh-anchor
      :items="items"
      :scroll-top="scrollTop"
      @update:scroll-into-view="anchorTarget = $event"
    />
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = [
  { id: 'section-a', title: '区块 A' },
  { id: 'section-b', title: '区块 B' },
]
const scrollTop = ref(0)
const anchorTarget = ref('')
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

## 기본 사용법

```vue
<template>
  <lh-anchor :items="items" />
</template>

<script setup lang="ts">
const items = [
  { id: 'section-a', title: '区块 A' },
  {
    id: 'group-b',
    title: 'B 组',
    children: [
      { id: 'section-b', title: '区块 B' },
      { id: 'section-c', title: '区块 C' },
    ],
  },
]
</script>
```

`items`는 하위 항목(`children`)을 지원하며, 렌더링 시 깊이 우선으로 평탄화하고 자동으로 들여쓰기를 적용합니다. 활성 앵커 판정 규칙: 마지막으로 "섹션 상단 가장자리가 `offset` 임계선을 스크롤하여 통과한" 앵커가 활성 항목이 됩니다.

## 가로 배치

```vue
<template>
  <lh-anchor :items="items" direction="horizontal" />
</template>
```

## API

### Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| items | 앵커 데이터 (children 하위 항목 지원) | `LhAnchorItem[]` | `[]` |
| target | H5 스크롤 컨테이너 선택자 (기본값 window) | `string` | — |
| scrollTop | 스크롤 위치 주입 (MP: scroll-view의 `detail.scrollTop`) | `number` | — |
| offset | 활성 판정 임계값 (섹션 상단 가장자리부터 컨테이너 상단까지의 거리) | `number` | `0` |
| direction | 배치 방향 | `'vertical' \| 'horizontal'` | `'vertical'` |
| smooth | 부드러운 스크롤 | `boolean` | `true` |
| sx | 레이아웃 바로가기 속성 | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 콜백 인자 |
| --- | --- | --- |
| change | 활성 앵커가 변경될 때 발생 | `(id: string)` |
| click | 앵커 항목을 클릭할 때 발생 (스크롤 위치 이동보다 먼저) | `(id: string)` |
| update:scrollIntoView | MP 위치 이동 계약: 대상 섹션 id, scroll-into-view에 바인딩 | `(id: string)` |
