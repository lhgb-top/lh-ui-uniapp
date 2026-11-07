# VirtualList 가상 목록

수만 건의 데이터도 화면에 보이는 창만 렌더링합니다. 고정 높이 구간
(`computeVirtualRange`)과 동적 높이 로직
(`buildVirtualItems` / `findVirtualRange`)은 모두 `@lh-ui/share`의
core 순수 함수에서 제공되며, 컴포넌트 계층은 스크롤 구동과 뷰포트
측정만 담당합니다.

## 플랫폼 차이

- **H5**: 컨테이너는 `view`(`overflow: auto`)로 렌더링되고, 뷰포트 높이는
  `clientHeight` + `ResizeObserver`로 측정합니다.
- **WeChat 미니 프로그램**: 컨테이너는 `scroll-view`(`scroll-y`)로
  렌더링되고, 스크롤 이벤트는 `detail.scrollTop`을 가져오며, 뷰포트
  높이는 `createSelectorQuery`로 측정합니다(MP에는 `ResizeObserver`가
  없습니다).
- **동적 높이**: `itemSize`는 선언적 함수 계약(호출자가 각 항목의 높이를
  반환)입니다. 양쪽에서 동일하게 동작하며, MP에 없는 측정 API에 의존하지
  않습니다.

## 기본 사용법 (고정 높이)

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-height="48">
    <template #default="{ item, index }">
      <view class="my-item">{{ index + 1 }}번째 행: {{ item.label }}</view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  label: `목록 항목 ${i + 1}`,
}))
</script>
```

`height`는 컨테이너 높이를, `item-height`는 고정 높이 모드의 항목 높이를
설정합니다(실제 항목 높이와 일치해야 합니다). 가시 창 바깥에는
`overscan`(기본 2) 화면분의 버퍼 항목만 유지합니다.

## 동적 높이

```vue
<template>
  <lh-virtual-list :data="items" :height="360" :item-size="sizeOf">
    <template #default="{ item, index }">
      <view class="my-item" :style="{ height: `${sizeOf(index)}px` }">
        {{ index + 1 }}번째 행: {{ item.label }}
      </view>
    </template>
  </lh-virtual-list>
</template>

<script setup lang="ts">
// itemSize는 선언적 함수: 각 항목의 높이를 반환하며 양쪽에서 동일하게 동작함
function sizeOf(index: number): number {
  return 48 + (index % 5) * 24
}
</script>
```

`item-height`와 `item-size` 중 하나만 사용합니다: `itemSize`를 전달하면
동적 높이 모드로 동작합니다(항목별 오프셋을 미리 계산하고 이진 탐색으로
가시 구간을 찾습니다).

## API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| data | 데이터 소스(항목 렌더링은 default 슬롯이 담당) | `any[]` | `[]` |
| height | 컨테이너 높이(숫자는 px) | `number \| string` | `300` |
| itemHeight | 고정 높이 모드의 항목 높이 | `number` | `-` |
| itemSize | 동적 높이 모드: 각 항목의 높이를 반환 | `(index: number) => number` | `-` |
| overscan | 오버스캔 항목 수(가시 창 바깥의 버퍼 항목) | `number` | `2` |
| sx | sx 빠른 레이아웃 속성 | `LhSxProps` | `-` |

### Slots

| 슬롯 | 설명 | 스코프 매개변수 |
| --- | --- | --- |
| default | 항목 렌더링 | `{ item, index }` |
