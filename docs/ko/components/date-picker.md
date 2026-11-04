# DatePicker 날짜 선택

날짜 선택기: 트리거 박스를 탭하면 캘린더 패널이 열리며, 날짜 / 월 / 연도 세 가지 선택 모드, 커스텀 표시 형식, 범위 값 에코를 지원합니다. 캘린더 그리드 생성, 날짜 포맷팅, 비활성 판정은 모두 `@lh-ui/share` core 순수 함수를 소비하고, 패널은 `view` 자체 그리기 그리드라 H5와 WeChat 미니프로그램에서 동일하게 렌더링됩니다.

## 값 타입 계약

컴포넌트의 바인딩 값은 **항상 `Date` 객체**입니다(범위는 `[Date, Date]` 튜플). ISO 날짜 문자열은 받지도, 내보내지도 않습니다:

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// ✅ 올바름: Date 객체
const value = ref<Date | null>(new Date(2026, 10, 3))
// ❌ 틀림: '2026-11-03' 문자열은 에코도 파싱도 되지 않습니다
</script>
```

`format` prop은 **트리거와 패널의 표시에만** 영향을 줍니다(고정 폭 토큰 `yyyy` / `MM` / `dd` / `HH` / `mm` / `ss`). 바인딩 값의 형태는 바뀌지 않습니다. 받는 것은 `Date`이며, 저장용 ISO 문자열이 필요하면 직접 `formatDate` 또는 `toISOString()`을 호출하세요.

## 기본 사용

```vue
<template>
  <lh-date-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3))
</script>
```

날짜 모드에서 패널 안의 날짜 탭은 **임시 저장**일 뿐이며, 하단의「확인」을 탭해야 확정됩니다(2단계 확정, Vue3 버전과 동일).「오늘」버튼은 패널을 이번 달로 되돌리고 오늘을 임시 저장합니다.

## 월·연도 모드

`mode="month"` / `mode="year"`이면 패널이 열릴 때 바로 해당 그리드로 진입하고, 셀을 탭하면 즉시 선택 후 닫힙니다(하단 버튼 없음). 날짜 모드에서는 패널 제목을 탭해 단계적으로 드릴다운합니다: 날짜 → 월 → 연도. 연도 보기에서 제목을 탭하면 월로 돌아갑니다.

```vue
<template>
  <lh-date-picker v-model="month" mode="month" />
  <lh-date-picker v-model="year" mode="year" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const month = ref<Date | null>(new Date(2026, 5, 1))
const year = ref<Date | null>(new Date(2024, 0, 1))
</script>
```

## 날짜 포맷팅

```vue
<template>
  <lh-date-picker v-model="value" format="MM/dd/yyyy" />
  <lh-date-picker v-model="value" format="yyyy년MM월dd일" />
</template>
```

`placeholder`를 생략하면 `format`에서 플레이스홀더를 생성합니다(`yyyy` → 언어팩「년」, `MM` → 「월」, `dd` → 「일」).

## 비활성·읽기 전용

```vue
<template>
  <lh-date-picker v-model="value" disabled />
  <lh-date-picker :model-value="value" readonly />
</template>
```

`disabled`는 선택기 전체를 비활성화합니다(탭해도 패널이 열리지 않음). `readonly`는 읽기 전용입니다(프로그래밍 방식으로 값을 설정할 수 있으나 탭해도 패널이 열리지 않음).

## 크기와 지우기

```vue
<template>
  <lh-date-picker v-model="value" size="small" />
  <lh-date-picker v-model="value" size="medium" />
  <lh-date-picker v-model="value" size="large" />
  <lh-date-picker v-model="value" :clearable="false" />
</template>
```

`size`는 ConfigProvider 글로벌 크기로 폴백하고, 최종적으로 `medium`이 됩니다. `clearable`은 기본적으로 켜져 있으며 트리거 오른쪽에 지우기 아이콘을 표시합니다.

## 범위 값 에코

바인딩 값이 `[Date, Date]`이면 트리거가 양 끝을 `range-separator`(기본 `~`)로 이어 에코합니다:

```vue
<template>
  <lh-date-picker v-model="span" range-separator=" ~ " />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<[Date, Date]>([new Date(2026, 10, 1), new Date(2026, 10, 7)])
</script>
```

::: warning 범위 / 날짜 시간 선택 UI는 미구현
Vue3 버전과 마찬가지로 `mode="datetime"`과 범위 선택은 **타입 예약만 있고 선택 UI가 없습니다**(시간 열과 범위 패널 미구현, 가족 백로그 P-08). 범위 값은 에코할 수 있지만, 패널 안에서「확인」을 탭해도 이미 바인딩된 범위 값을 단일 `Date`로 덮어쓰지 않습니다.
:::

## 셀과 패널 커스터마이징

```vue
<template>
  <lh-date-picker v-model="value" :cell-class-name="cellClassName" popper-class="my-popper" />
</template>

<script setup lang="ts">
const cellClassName = (date: Date) => (date.getDay() === 0 || date.getDay() === 6 ? 'my-weekend' : '')
</script>
```

`cell-class-name`은 날짜별로 셀에 커스텀 클래스를 추가합니다(빈 반환값은 건너뜀). `popper-class`는 패널 루트로 전달되어 패널 단위의 스타일링에 사용할 수 있습니다.

## DatePicker API

### Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 바인딩 값(Date / 범위 튜플 / null, **ISO 문자열 불가**) | `Date \| [Date, Date] \| null` | `null` |
| mode | 선택 모드 | `'date' \| 'month' \| 'year' \| 'datetime' \| 'range'` | `'date'` |
| size | 크기(생략 시 ConfigProvider 글로벌 크기, 최종 medium) | `'small' \| 'medium' \| 'large' \| 'mini' \| 'x-large'` | `'medium'` |
| disabled | 선택기 전체 비활성화 | `boolean` | `false` |
| clearable | 지우기 버튼 표시 | `boolean` | `true` |
| placeholder | 플레이스홀더(생략 시 format에서 생성) | `string` | `''` |
| format | 표시 형식(고정 폭 토큰, 표시에만 영향) | `string` | `'yyyy-MM-dd'` |
| readonly | 읽기 전용(패널을 열지 않음) | `boolean` | `true` |
| rangeSeparator | 범위 구분자(범위 에코 결합) | `string` | `'~'` |
| cellClassName | 날짜 셀 커스텀 클래스 콜백 | `(date: Date) => string` | — |
| popperClass | 패널 커스텀 클래스 | `string` | — |
| customClass | 루트 노드 커스텀 클래스 | `string` | — |
| themeVars | 컴포넌트 수준 테마 변수(ConfigProvider 덮어쓰기) | `Record<string, string>` | — |
| sx | sx 빠른 레이아웃 props(루트 요소, 플로팅 패널에는 영향 없음) | `LhSxProps` | — |

::: tip mode 값
`'datetime'`과 `'range'`는 **타입 예약**입니다: `LhDatePickerMode`(share core)에는 포함되어 있으나 시간 열과 범위 패널이 미구현(백로그 P-08)이므로, 지금은 `'date'` / `'month'` / `'year'`만 사용해 주세요.
:::

### Events

| Event | 설명 | 매개변수 |
| --- | --- | --- |
| update:modelValue | 값 변경(v-model) | `(value: Date \| [Date, Date] \| null)` |
| change | 값 확정(update:modelValue와 동일 페이로드) | `(value: Date \| [Date, Date] \| null)` |

### 접근성

- 트리거는 `role="combobox"`(`aria-expanded` / `aria-haspopup="dialog"` / 패널을 가리키는 `aria-controls`). 속성 팩은 share의 `getDatePickerTriggerAria`가 생성합니다
- 패널은 `role="dialog"`; 캘린더는 `role="grid"`, 날짜 셀은 `role="gridcell"`이며 `aria-selected` / `aria-current="date"`(오늘) / `aria-disabled`(비활성)를 가집니다
- 날짜 셀의 `aria-label`은「YYYY년 M월 D일 요일X」형태의 전체 문구라 스크린 리더가 인식할 수 있습니다
- 월 이동 버튼은 `role="button"` + `aria-label`(언어팩 `datepicker.prevMonth` / `datepicker.nextMonth`)
- 키보드 그리드 탐색과 트리거 키보드 동작은 H5 전용입니다. 아래 플랫폼 차이를 참고하세요

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **패널형 선택**: plus의 캘린더 패널은 본래 패널형(롤러형 선택기가 아님)이며 이 포팅도 같은 상호작용을 유지합니다. 플로팅 레이어의 컨테이너는 `Teleport to="body"`에서 `lh-root-portal`(구버전에서는 페이지 내 fixed 폴백)로 변경, 위치 지정은 2단계 비동기 계산(숨김 상태로 렌더링해 치수 측정 → `computePosition` 위치 계산 → 표시, 깜빡임 방지)으로 처리하고 진입/이탈 트랜지션은 연결하지 않았습니다.
- **요소 매핑**: plus의 `<div>` / `<button>` / `<input>`은 모두 `<view>`로 교체; 트리거 에코와 플레이스홀더는 `<text>` 자체 그리기입니다(MP는 `::placeholder` 미지원, 플레이스홀더 색상은 SFC 인라인 수식어 클래스가 같은 토큰으로 보충). 월 이동 / 오늘 / 확인 버튼의 비활성 상태는 클래스로 표현합니다(view에는 `:disabled` 의사 클래스가 없음).
- **외부 클릭 닫기**: plus는 문서 수준의 click을 감지하지만, 이 포팅은 페이지 내 투명 마스크 탭으로 닫습니다(동등한 의미, MP에는 document가 없음). 마스크 탭은 닫기만 할 뿐 change를 발생시키지 않습니다.
- **키보드 탐색은 H5 전용**: 트리거 Enter / Space, 그리드 방향키 이동(월 넘기기 포함) / Home / End / PageUp / PageDown, roving tabindex, Escape로 최상위 오버레이 닫기는 MP에 키보드 이벤트가 없어 조건부 컴파일 가드로 호출하지 않습니다. MP 번들에 데드 코드가 없습니다.
- **aria 속성은 개별 명시 바인딩**: plus 템플릿의 share `LhAriaAttrs` 속성 팩은 `v-bind`로 펼칠 수 없어(MP 템플릿 컴파일러 미지원) 글루 레이어가 `aria-*` 키를 구체적인 값으로 펼쳐 바인딩합니다. 계약은 여전히 share 순수 함수가 결정합니다.
- **값 타입 계약**: plus와 완전히 동일 — 바인딩 값은 `Date` / `[Date, Date]`이며 어느 방향으로도 ISO 날짜 문자열을 다루지 않습니다; `format`은 표시 계층에만 작용합니다.
:::
