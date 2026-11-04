# Calendar 달력

월별 그리드로 날짜를 보여주는 달력 컴포넌트. 단일 선택 / 기간(시작·끝) / 다중 선택 세 가지 모드를 지원하고 `range`로 선택 가능 범위를 제한할 수 있습니다. 그리드·요일 헤더·패널 제목 문구는 모두 언어 팬드(`datepicker.weeks.*` / `datepicker.month1~12` / `datepicker.panelTitle`)에서 가져옵니다. 달력은 `view` 자체 그리기 그리드이며 네이티브 날짜 컨트롤에 의존하지 않아 모바일에 자연스럽고 모든 환경에서 사용할 수 있습니다.

## 기본 사용

```vue
<template>
  <lh-calendar v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date>()
</script>
```

`modelValue`를 넘기지 않으면 컴포넌트가 내부 선택 상태를 유지하고, 넘기면 제어형으로 동작합니다(다른 폼 컴포넌트와 동일).

## 기간 선택

`selection="range"`일 때 첫 번째 클릭으로 시작일을 확정하고(이때 값은 `[시작, 시작]`), 두 번째 클릭으로 종료일을 확정하며 자동 정규화합니다(역순으로 클릭해도 `[이름, 나중]` 결과가 나옵니다):

```vue
<template>
  <lh-calendar v-model="span" selection="range" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const span = ref<Date[]>([])
</script>
```

양끝은 `--selected`, 사이 날짜는 `--in-range` 배경색을 받습니다(양끝 제외).

## 선택 가능 범위 제한

`range`에 `[시작, 끝]` 튜플을 전달하면 범위 밖 날짜가 비활성화됩니다(비활성 판정은 share 순수 함수가 담당, 역순 범위도 자동 정규화):

```vue
<template>
  <lh-calendar v-model="value" :range="[start, end]" />
</template>

<script setup lang="ts">
const start = new Date(2026, 10, 1)
const end = new Date(2026, 10, 30)
</script>
```

## 다중 선택

`selection="multiple"`일 때 이미 선택된 날짜를 다시 클릭하면 선택이 해제되고 결과는 시간순으로 유지됩니다:

```vue
<template>
  <lh-calendar v-model="dates" selection="multiple" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dates = ref<Date[]>([])
</script>
```

## input 트리거 모드

`mode="input"`이면 트리거 박스만 렌더링하고, 탭으로 패널을 열고 닫습니다. 선택 후 자동으로 닫힙니다(`close-on-select` 기본 켜짐, 기간 모드는 두 번 클릭 필요):

```vue
<template>
  <lh-calendar v-model="value" mode="input" placeholder="날짜 선택" />

  <!-- 기간 + 자동으로 닫지 않기 -->
  <lh-calendar v-model="span" mode="input" selection="range" :close-on-select="false" />
</template>
```

트리거 박스 문구는 기본적으로 `YYYY-MM-DD`(기간은 `이름 ~ 나중`), 플레이스홀더는 언어 팩 `select.placeholder`에서 가져옵니다.

## 다중 패널과 사용자 정의 콘텐츠

`panels`로 동시에 표시할 월 패널 수를 지정하고(flex 줄바꿈 배치), `header` / `cell` 슬롯으로 패널 제목과 날짜 셀을 커스터마이즈합니다:

```vue
<template>
  <lh-calendar v-model="value" :panels="2">
    <template #header="{ year, month }">
      <view class="my-title">{{ year }} / {{ month + 1 }}</view>
    </template>
    <template #cell="{ date }">
      <view class="my-cell">{{ date.getDate() }}</view>
    </template>
  </lh-calendar>
</template>
```

::: tip 모바일 친화적
달력 패널은 순수 `view` 그리드(7등분 컬럼)로 네이티브 picker도 DOM 측정도 사용하지 않습니다.
H5와 WeChat 미니프로그램에서 완전히 동일하게 렌더링되며, 작은 화면에서도 컨테이너 너비에 맞춰집니다.
:::

## Calendar API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 현재 선택(제어 v-model, 생략 시 내부 상태) | `Date \| Date[]` | — |
| selection | 선택 모드: 단일 / 기간 / 다중 | `'single' \| 'range' \| 'multiple'` | `'single'` |
| range | 선택 가능 날짜 범위(범위 밖 비활성화, 역순 자동 정규화) | `[Date, Date]` | — |
| mode | 표시 형태: 상시 패널 / 확장형 트리거 박스 | `'panel' \| 'input'` | `'panel'` |
| panels | 동시에 표시할 월 패널 수 | `number` | `1` |
| placeholder | input 모드 플레이스홀더(기본: 언어 팩 select.placeholder) | `string` | — |
| closeOnSelect | input 모드에서 선택 후 패널을 닫을지 여부 | `boolean` | `true` |
| customClass | 루트 노드로 전달할 사용자 정의 클래스 | `string` | — |
| sx | sx 레이아웃 속성(루트 노드에 적용) | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 매개변수 |
| --- | --- | --- |
| update:modelValue | 선택값 변화(v-model) | `(value: Date \| Date[])` |
| change | 선택값 변화(update:modelValue와 동일 페이로드) | `(value: Date \| Date[])` |
| select | 날짜 클릭 시(비활성 날짜는 무시) | `(date: Date)` |

### Slots

| 슬롯 | 설명 | 스코프 매개변수 |
| --- | --- | --- |
| header | 패널 제목 커스터마이즈 | `{ year: number, month: number }`(month는 0부터) |
| cell | 날짜 셀 커스터마이즈 | `{ date: Date }` |

### 접근성

- 그리드는 `role="grid"`, 각 행은 `role="row"`, 날짜 셀은 `role="gridcell"`, 헤더는 `role="columnheader"`이며 `aria-selected` / `aria-current="date"`(오늘) / `aria-disabled`(비활성)를 제공
- 셀의 `aria-label`은 `YYYY-MM-DD` 형식으로 스크린리더에 전달됩니다
- 월 이동 버튼은 `role="button"` + `aria-label`(언어 팩 `datepicker.prevMonth` / `datepicker.nextMonth`)
- 키보드 그리드 탐색(방향키, Home / End, PageUp / PageDown)은 H5 전용. 아래 플랫폼 차이를 참조

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **그리드载体**: 달력은 `view` 자체 그리기 7컬럼 그리드(WXSS `grid-template-columns: repeat(7, 1fr)`)이며 네이티브 날짜 컨트롤을 사용하지 않습니다. H5와 WeChat 미니프로그램이 렌더링과 동작이 완전히 일치하고 모바일에 자연스럽습니다.
- **DOM 요소 매핑**: plus의 `<div>` / `<button>` / `<input>`은 모두 `<view>`로 교체했습니다. input 모드의 트리거 박스는 `<view>` 자체 그리기로 플레이스홀더와 선택값을 표시합니다(MP는 `::placeholder` 미지원이라 네이티브 `<input>` 사용 시 `placeholder-style` 추가 설정 필요). 비활성 셀은 `--disabled` 클래스로 외형을 표현합니다(view에는 `:disabled` 의사 클래스가 없어 SFC 인라인 폴백을 같은 토큰으로 정의).
- **키보드 그리드 탐색은 H5 전용**: 방향키 / Home / End / PageUp / PageDown 탐색과 roving tabindex는 MP에 키보드 이벤트가 없어 조건부 컴파일 가드로 호출하지 않습니다. MP 번들에 데드 코드가 남지 않습니다.
- **외부 클릭으로 닫기는 H5 전용**: plus는 문서 수준 mousedown을 감지해 패널을 닫지만 MP에는 document가 없어 트리거 박스 탭으로 열고 닫습니다.
- **aria 속성은 개별 명시 바인딩**: plus 템플릿의 share `LhAriaAttrs` 팩은 `v-bind`로 펼칠 수 없습니다(MP 템플릿 컴파일러 미지원). 글루 코드에서 `aria-*` 키를 구체적 값으로 펼쳐 바인딩하며 계약은 여전히 share 순수 함수가 결정합니다.
:::
