# BackTop 맨 위로

스크롤이 임계값을 넘으면 나타나는 맨 위로 가기 버튼입니다. 노출 여부 판정
(`isBackTopVisible`)과 스크롤 명령(`backToTop`)은 `@lh-ui/share`의
core 순수 함수에서 제공합니다.

## 플랫폼 차이(중요)

- **H5**: 컴포넌트가 직접 `window`(또는 `target` 컨테이너)의 `scroll`
  이벤트를 수신합니다. 클릭 시 대상 컨테이너를 직접 스크롤합니다.
- **WeChat 미니프로그램**: `scroll-view`의 스크롤 이벤트
  `detail.scrollTop`을 `scrollTop` prop으로 주입해 노출/비노출을 구동해야
  합니다. 클릭 시 컴포넌트가 `update:scrollTop`(값 0)을 발생시키고, 이를
  `scroll-view`의 `scroll-top` 속성에 바인딩하면 맨 위로 돌아갑니다.
  `target`을 넘기지 않으면 페이지 단위 스크롤이 되며, 컴포넌트가
  `uni.pageScrollTo`를 직접 호출합니다.

```vue
<template>
  <scroll-view
    class="my-scroll"
    :scroll-y="true"
    :scroll-top="scrollTop"
    @scroll="onScroll"
  >
    <!-- 긴 콘텐츠 -->
    <lh-backtop :scroll-top="scrollTop" @update:scroll-top="scrollTop = $event" />
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

## 기본 사용법

```vue
<template>
  <lh-backtop :visibility-height="200" />
</template>
```

페이지나 컨테이너가 `visibility-height`(기본값 200px)을 넘어 스크롤되면
버튼이 페이드 인 전환과 함께 나타나며, 클릭 시 부드럽게 맨 위로
스크롤됩니다.

## 내용과 위치 커스터마이징

```vue
<template>
  <lh-backtop :right="24" :bottom="80">
    <view class="my-backtop">맨 위</view>
  </lh-backtop>
</template>
```

기본적으로 원형 버튼(내장 `arrow-up` 아이콘)이 렌더링됩니다.
`right` / `bottom`으로 뷰포트 우하단으로부터의 오프셋을 지정하고,
기본 슬롯으로 버튼 내용을 커스터마이징할 수 있습니다.

## API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| target | H5 스크롤 컨테이너 선택자(기본값은 뷰포트, MP에서는 페이지 레벨과 scroll-view 레벨 구분에만 사용) | `string` | `-` |
| scrollTop | 스크롤 위치 주입(MP: scroll-view의 `detail.scrollTop`) | `number` | `-` |
| visibility-height | 스크롤이 몇 px를 넘으면 나타날지 | `number` | `200` |
| right | 우측 오프셋(px) | `number` | `40` |
| bottom | 하단 오프셋(px) | `number` | `40` |
| smooth | 부드러운 스크롤 | `boolean` | `true` |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | `-` |

### Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| click | 버튼 클릭 시 발생(스크롤 명령보다 먼저) | `(event: Event)` |
| scrollend | 스크롤 정지 후 발생(150ms 디바운스) | `(scrollTop: number)` |
| update:scrollTop | MP 맨 위로 가기 계약: 값은 0, scroll-view의 scroll-top에 바인딩 | `(scrollTop: number)` |

### Slots

| 이름 | 설명 |
| --- | --- |
| default | 버튼 내용(기본값 arrow-up 아이콘) |
