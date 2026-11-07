# Affix 고정

콘텐츠를 뷰포트 상단 또는 하단에 고정합니다. 고정 판정(`isAffixFixed`)과 고정
스타일(`getAffixFixedStyle`)은 `@lh-ui/share`의 core 순수 함수에서 제공되며,
컴포넌트 계층은 스크롤 구독, 자리 채우기 측정, 반응형 연결만 담당합니다.

## 플랫폼 차이 (중요)

H5와 WeChat 미니 프로그램은 스크롤 시맨틱스가 달라 이 컴포넌트는 양단 대응 방식을
사용합니다:

- **H5**: 컴포넌트가 `window`(또는 `target` 선택자가 가리키는 컨테이너)의
  `scroll` 이벤트를 직접 수신하고, 자리 채우기 노드의 `getBoundingClientRect`로
  고정 상태를 판정합니다.
- **WeChat 미니 프로그램**: `scroll` 이벤트는 `scroll-view` 태그에만 바인딩할 수 있어
  컴포넌트가 자체적으로 구독할 수 없습니다. 컴포넌트를 `scroll-view` 안에 배치하고
  스크롤 이벤트의 `detail.scrollTop`을 `scrollTop` prop으로 주입합니다:

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <lh-affix :scroll-top="scrollTop" :offset-top="20">
      <view class="my-bar">상단 고정 바</view>
    </lh-affix>
    <!-- 긴 콘텐츠 -->
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scrollTop = ref(0)
function onScroll(event: { detail?: { scrollTop?: number } }) {
  scrollTop.value = event.detail?.scrollTop ?? 0
}
</script>
```

H5에서 `scrollTop`을 넘기지 않으면 컴포넌트가 자동으로 `window`를 수신합니다.
`target` 선택자를 넘기면 해당 컨테이너를 수신합니다.

## 기본 사용법

```vue
<template>
  <lh-affix :offset-top="20">
    <lh-button type="primary">상단 고정 버튼</lh-button>
  </lh-affix>
</template>
```

콘텐츠가 스크롤되어 `offset-top`을 지나면 뷰포트 상단에 고정됩니다. 고정 중에는
자리 채우기 요소가 원래 높이로 문서 위치를 유지하여 이후 콘텐츠가 튀지 않습니다.

## 하단 고정 모드

```vue
<template>
  <lh-affix :offset-bottom="24">
    <view class="my-bar">하단 고정 바</view>
  </lh-affix>
</template>
```

`offset-bottom`이 `offset-top`보다 우선합니다: 자리 채우기의 아래 가장자리가
"뷰포트 높이 - offset-bottom"을 지나면 하단에 고정됩니다.

## API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| offset-top | 뷰포트 상단으로부터 몇 픽셀에서 상단 고정을 트리거할지 | `number` | `0` |
| offset-bottom | 뷰포트 하단으로부터 몇 픽셀에서 하단 고정을 트리거할지 (offset-top보다 우선) | `number` | `0` |
| target | H5 스크롤 컨테이너 선택자 (기본값은 뷰포트, MP에서는 동작하지 않음) | `string` | `-` |
| scrollTop | 스크롤 위치 주입 (MP: scroll-view의 `detail.scrollTop`) | `number` | `-` |
| sx | 빠른 레이아웃 속성 (간격 / 크기 / flex) | `LhSxProps` | `-` |

### Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| change | 고정 상태가 변경될 때 발생 | `(fixed: boolean)` |

### Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 고정할 콘텐츠 |
