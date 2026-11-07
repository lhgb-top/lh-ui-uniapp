# Text 텍스트

제목 / 본문 / 말줄임 / 복사를 한 곳에 담은 조판 컴포넌트입니다. 의미 수식은 모두 BEM 수식 클래스로 적용됩니다.

## 레벨

```vue
<template>
  <lh-text level="h1">제목 1</lh-text>
  <lh-text level="p">본문 단락</lh-text>
  <lh-text level="caption">보조 설명</lh-text>
</template>
```

`level`은 `h1` ~ `h6` / `p`(기본) / `caption`을 지원합니다. 잘못된 값은 `p`로 대체됩니다.

## 의미와 수식

```vue
<template>
  <lh-text type="success" strong>성공·굵게</lh-text>
  <lh-text mark>강조 표시</lh-text>
  <lh-text code>코드 스타일</lh-text>
</template>
```

`type`: `default`(기본) / `secondary` / `success` / `warning` / `danger`. 수식 속성: `strong` / `italic` / `underline` / `mark` / `code` / `disabled`.

## 말줄임

```vue
<template>
  <lh-text :ellipsis="true">한 줄 말줄임</lh-text>
  <lh-text :ellipsis="2">두 줄 말줄임</lh-text>
</template>
```

`ellipsis`에 `true`를 전달하면 한 줄 말줄임, 숫자를 전달하면 줄 수로 잘라냅니다(상한 10, 여러 줄 말줄임은 인라인 `-webkit-line-clamp` 사용).

## 복사

```vue
<template>
  <lh-text copyable copy-text="고정 텍스트">뒤의 버튼을 눌러 복사</lh-text>
</template>
```

`copyable`은 복사 버튼을 추가합니다. 클릭 시 클립보드에 쓰고 잠시 동안「복사됨」으로 전환되며, 동시에 `copy` 이벤트를 발생시킵니다(인수는 실제로 쓰인 텍스트).

::: tip 미니프로그램에서의 복사
H5는 `copy-text`를 전달하지 않으면 슬롯의 텍스트를 자동으로 가져옵니다. **미니프로그램에서는 컴포넌트가 슬롯의 텍스트를 읽을 수 없어 `copy-text`를 반드시 전달해야 합니다.** 그렇지 않으면 버튼이 아무것도 쓰지 않습니다(클릭 자체는 `copy` 이벤트를 발생시킵니다). 라벨은 언어 팩 `text.copy` / `text.copied`에서 가져오며 `copy-label`로 덮어쓸 수 있습니다.
:::

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| level | 제목 레벨과 단락 형태 | `'h1' \| ... \| 'h6' \| 'p' \| 'caption'` | `'p'` |
| type | 의미 색상 | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'default'` |
| strong / italic / underline / mark / code / disabled | 불리언 수식 | `boolean` | `false` |
| ellipsis | 말줄임: `true`는 한 줄, 숫자는 줄 수 | `boolean \| number` | `false` |
| copyable | 복사 버튼 추가 | `boolean` | `false` |
| copyLabel | 복사 버튼의 접근성 이름 | `string` | — |
| copyText | 복사할 텍스트(미니프로그램에서 필수) | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| copy | 복사 버튼 클릭 | `(text: string)` |

## 플랫폼 차이

| 기능 | H5 | 미니프로그램 |
| --- | --- | --- |
| 렌더링 요소 | view(조판은 `lh-text--<level>` 클래스가 담당) | H5와 동일 |
| 복사 | `copy-text` 미전달 시 슬롯 텍스트 자동 사용(`navigator.clipboard`) | `copy-text` 필수, `uni.setClipboardData` 사용(시스템 알림 있음) |
