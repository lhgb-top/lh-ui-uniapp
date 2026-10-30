# Card 카드

정보를 집약하는 컨테이너로, 표지, 헤더, 본문, 하단과 로딩 자리 표시를 지원합니다.

## 기본 사용법

```vue
<template>
  <lh-card title="수묵">
    <view>카드 내용</view>
  </lh-card>
</template>
```

## 표지와 하단

```vue
<template>
  <lh-card title="산수 화첩">
    <template #cover>
      <image class="cover" src="https://placeholder.invalid/cover.png" mode="aspectFill" />
    </template>
    <view>카드 내용</view>
    <template #footer>
      <view>하단 작업</view>
    </template>
  </lh-card>
</template>
```

::: tip 표지 내 자식 요소는 너비를 직접 설정해야 함
share의 "표지 자식 요소가 너비를 꽉 채움" 규칙(`.lh-card__cover > *`)은 WXSS가 지원하지 않는 와일드카드 선택자에
의존하며, 정제 파이프라인이 이를 버립니다. 미니프로그램 측에서는 표지 내의 `<image>` 등 자식 요소에 너비를 명시적으로
작성하십시오(예: `width: 100%`).
:::

## 헤더 오른쪽 작업 영역

`extra` 슬롯은 제목 오른쪽에 렌더링되며, `title` 또는 `header` 슬롯이 있을 때만 나타납니다.

```vue
<template>
  <lh-card title="주문">
    <template #extra>
      <lh-button size="small" text>더 보기</lh-button>
    </template>
    <view>카드 내용</view>
  </lh-card>
</template>
```

## 그림자와 클릭 가능

```vue
<template>
  <lh-card shadow="hover" clickable @click="onClick">
    <view>마우스를 올리면 떠오르고, 클릭하면 이벤트가 트리거됩니다</view>
  </lh-card>
</template>

<script setup lang="ts">
const onClick = () => console.log('카드 클릭')
</script>
```

## 로딩 자리 표시

```vue
<template>
  <lh-card title="수묵" loading>
    <view>내용 로딩 중에는 렌더링되지 않습니다</view>
  </lh-card>
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| title | 카드 제목(header 슬롯 사용도 가능) | `string` | — |
| shadow | 그림자 표시 시기 | `'always' \| 'hover' \| 'never'` | `'always'` |
| clickable | 카드 전체 클릭 가능(button 키보드 시맨틱 담당) | `boolean` | `false` |
| loading | 로딩 상태: 내용 영역을 스켈레톤 자리 표시로 | `boolean` | `false` |
| themeVars | 컴포넌트 수준 테마 변수(키에 자동으로 `--lh-` 접두어 추가) | `Record<string, string>` | — |
| bgPattern | 문양 배경 URL(예: `var(--lh-pattern-willow)`), 전역 화이트리스트 제한을 받지 않음 | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| click | 카드 전체 클릭(`clickable`일 때만 트리거) | `(e: Event)` |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| cover | 표지 |
| header | 헤더(title보다 우선) |
| extra | 헤더 오른쪽 작업 영역(헤더 존재에 의존) |
| default | 본문 내용 |
| footer | 하단 |

::: tip 키보드 활성화는 H5 전용
`clickable`한 카드는 H5에서 Enter / Space 키보드 활성화를 지원합니다(APG button 패턴에 정렬); 미니프로그램에는
키보드 이벤트가 없어 이 처리는 조건부 컴파일로 MP 측에서 제거됩니다.
:::
