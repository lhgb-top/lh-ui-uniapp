# Divider 구분선

다른 내용을 구분하는 선이며, 문구가 있는 그룹핑 시맨틱을 지원합니다.

## 기본 사용법

```vue
<template>
  <view>이전 내용</view>
  <lh-divider />
  <view>다음 내용</view>
</template>
```

## 문구 포함

```vue
<template>
  <lh-divider>수묵</lh-divider>
  <lh-divider label-position="left">왼쪽 정렬</lh-divider>
  <lh-divider label-position="right">오른쪽 정렬</lh-divider>
</template>
```

## 점선과 테두리 스타일

```vue
<template>
  <lh-divider dashed />
  <lh-divider border-style="dotted" />
</template>
```

`borderStyle`은 `dashed`보다 우선합니다; `dashed` / `dotted`에만 해당 스타일이 있으며, 나머지 값은 기본 실선으로
렌더링됩니다.

## 세로 방향

```vue
<template>
  <lh-space>
    <span>수묵</span>
    <lh-divider direction="vertical" />
    <span>여백</span>
  </lh-space>
</template>
```

::: tip 세로 방향의 높이
세로 구분선은 `inline-block`이며, flex 행 안에서 `align-self: stretch`로 부모 높이를 꽉 채웁니다; 블록 컨테이너에
단독으로 놓으면 `1em` 높이뿐이며, flex 행 안에서 사용하는 것이 직관에 맞습니다.
:::

## 세로 방향 문구 포함

세로 방향도 문구를 지원합니다: 선분이 문구 위아래로 배치되며, 역할이 `role="separator"`로 승격되고
`aria-orientation="vertical"`이 선언됩니다.

```vue
<template>
  <view class="vertical-text-row">
    <text>위</text>
    <lh-divider direction="vertical">수묵</lh-divider>
    <text>아래</text>
  </view>
</template>

<style>
.vertical-text-row {
  display: flex;
  align-items: center;
  height: 120px;
}
</style>
```

::: tip 세로 문구의 높이는 부모 행에서 옵니다
문구 포함 세로 구분선은 부모 행의 `align-self: stretch`에서 높이를 얻어야 선분이 펼쳐집니다 — 부모 컨테이너는
높이가 확정된 flex 행(예: 위 예의 `height: 120px`)이어야 합니다. 블록 부모 컨테이너에서는 선분이 12px의 최소
길이만 남습니다.
:::

::: tip labelPosition은 세로 방향에서 작동하지 않음
`label-position`은 가로 방향의 좌우 정렬 시맨틱입니다; 세로 방향의 문구는 항상 가운데이며 수식 클래스를
생성하지 않습니다.
:::

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| direction | 방향 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| dashed | 점선 여부 | `boolean` | `false` |
| labelPosition | 문구 포함 시 정렬 위치(가로 방향에서 유효, 세로는 항상 가운데) | `'left' \| 'center' \| 'right'` | `'center'` |
| borderStyle | 테두리 스타일(dashed보다 우선) | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 구분선 문구(가로 방향에서는 좌우에, 세로 방향에서는 위아래에 배치) |
