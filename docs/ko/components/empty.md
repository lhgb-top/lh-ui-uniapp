# Empty 빈 상태

데이터가 비어 있을 때의 자리 표시 팁이며, 수묵 일러스트를 기본으로 포함합니다.

## 기본 사용법

```vue
<template>
  <lh-empty />
</template>
```

`description`을 전달하지 않으면 언어 팩의 `empty.description`(한국어 "데이터가 없습니다")을 사용하며, ConfigProvider의
언어 전환에 자동으로 따릅니다.

## 커스텀 문구

```vue
<template>
  <lh-empty description="먹 자국이 마르지 않아 아직 볼 것이 없습니다" />
</template>
```

## 커스텀 이미지

```vue
<template>
  <lh-empty image="https://placeholder.invalid/empty.png" description="텅 비었습니다" />
</template>
```

## 슬롯으로 자체 그리기

default 슬롯으로 기본 일러스트를 완전히 대체할 수 있습니다(`image`를 전달하면 기본 일러스트도 렌더링되지 않습니다).

```vue
<template>
  <lh-empty description="즐겨찾기 없음">
    <view class="my-illustration">🎨</view>
  </lh-empty>
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| description | 빈 상태 설명 문구(미전달 시 언어 팩 empty.description 사용) | `string` | — |
| image | 커스텀 이미지 URL(기본 일러스트 대체) | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 자체 그린 일러스트(전달 시 기본 일러스트 대체) |

::: tip 미니프로그램 측의 기본 일러스트
H5는 인라인 `<svg>` 일러스트를 유지합니다(테마 착색이 완전히 보존됨); 미니프로그램은 svg를 지원하지 않아 기본
일러스트를 CSS로 그린 간소화 버전으로 대체하며, 색상은 테마 변수에서 취하고 라이트 / 다크 모드에 자동으로
대응합니다.
:::
