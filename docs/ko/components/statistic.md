# Statistic 통계 수치

통계 수치를 표시하며, 자릿수, 천 단위 구분 기호, 접두사/접미사 및 문자열 형태의 큰 숫자를 지원합니다.

## 기본 사용법

```vue
<template>
  <lh-statistic
    title="연간 방문수"
    :value="2384712"
  />
</template>
```

## 자릿수와 구분 기호

`precision`은 소수 자릿수(반올림)를 제어하고, `separator`는 천 단위 구분을 제어합니다(빈 문자열을 전달하면 구분을 끕니다).

```vue
<template>
  <lh-statistic
    title="평점"
    :value="4.8471"
    :precision="2"
  />
  <lh-statistic
    title="번호"
    :value="8899001"
    separator=""
  />
</template>
```

## 접두사와 접미사

```vue
<template>
  <lh-statistic
    title="거래액"
    :value="128600"
    prefix="¥"
    suffix="위안"
  />
  <lh-statistic
    title="성장률"
    :value="12.6"
    :precision="1"
    suffix="%"
  />
</template>
```

## 큰 숫자와 비숫자 텍스트

문자열 `value`는 큰 숫자를 담을 수 있습니다. `Number.MAX_SAFE_INTEGER`를 초과하는 정수 문자열은 문자열 포맷팅 경로를 따라 Number 변환 없이 정밀도를 잃지 않고, 숫자로 파싱할 수 없는 문자열은 원문 그대로 표시됩니다.

```vue
<template>
  <lh-statistic
    title="별들"
    value="셀 수 없이 많음"
  />
  <lh-statistic
    title="항성 간 거리"
    value="9007199254740993"
  />
</template>
```

## 슬롯

`title` / `prefix` / `suffix` 슬롯이 같은 이름의 props 텍스트를 덮어씁니다.

```vue
<template>
  <lh-statistic :value="1024">
    <template #title>
      <text>사용자 정의 제목</text>
    </template>
    <template #prefix>
      <text>¥</text>
    </template>
    <template #suffix>
      <text>위안</text>
    </template>
  </lh-statistic>
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| title | 수치 제목(수치 위에 표시) | `string` | — |
| value | 통계 수치. 문자열 형태는 큰 숫자나 부호가 있는 텍스트를 담을 수 있음 | `string \| number` | `0` |
| precision | 소수 자릿수 | `number` | `0` |
| separator | 천 단위 구분 기호. 빈 문자열은 구분 해제 | `string` | `','` |
| prefix | 수치 접두사(통화 기호 등) | `string` | — |
| suffix | 수치 접미사(단위 등) | `string` | — |
| customClass | 사용자 정의 클래스 이름 | `string` | — |
| sx | 레이아웃 간편 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| title | 사용자 정의 제목 |
| prefix | 사용자 정의 접두사 |
| suffix | 사용자 정의 접미사 |

## 플랫폼 차이

- 순수 표시 컴포넌트로 플랫폼 API를 전혀 사용하지 않으며, H5와 WeChat 미니프로그램에서 완전히 동일하게 동작합니다.
- 포맷팅 로직(자릿수, 천 단위 구분, 큰 숫자 문자열 경로)은 모두 `@lh-ui/share`의 `formatStatisticValue` 순수 함수가 담당하며, 이 저장소는 반응형 글루 코드만 작성하고 core 구현을 복사하지 않습니다.
- 수치 영역에 `aria-live="polite"`가 부여됩니다. H5에서는 `value`가 변경될 때 스크린 리더가 새 값을 부드럽게 읽어주며, 미니프로그램의 음성 지원은 플랫폼 능력에 따라 다릅니다.
- 이 컴포넌트에는 카운트업 애니메이션이 없습니다. 향후 추가할 경우, 미니프로그램에서는 `setInterval` / `requestAnimationFrame`을 모두 사용할 수 있지만 `transitionend`는 신뢰할 수 없으므로 애니메이션 끝을 `setTimeout`으로 맞춰야 합니다(message / loading 전환과 동일한 방식).
