# TimePicker 시간 선택기

시, 분, 초를 선택하는 컴포넌트입니다. 트리거를 클릭하면 패널이 열리고, 각 열(시/분/초)은 독립적으로 세로 스크롤되는 목록입니다. 열 항목을 클릭해 선택하고, 하단의 «지금 / 확인» 버튼으로 확정합니다.

## 기본 사용법

```vue
<template>
  <lh-time-picker v-model="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

기본 `format`은 `HH:mm:ss`이며 패널에 시/분/초 세 열이 렌더링됩니다. 열 항목을 클릭하면 즉시 선택되고(패널은 닫히지 않음), «확인»을 클릭하면 `Date`를 확정하고 패널을 닫습니다. «지금»은 현재 시각을 각 열에 채웁니다.

## 시·분 포맷

`format`에 `ss`가 없으면 패널에 시/분 두 열만 렌더링되고, 플레이스홀더도 `format`에 맞춰 생성됩니다:

```vue
<template>
  <lh-time-picker v-model="value" format="HH:mm" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 시간 범위

`start` / `end`로 시간 열의 선택 범위를 제한합니다(0~23과의 교집합). 범위를 벗어난 기존 선택값은 범위 안으로 수렴하며, «지금»도 같게 수렴됩니다:

```vue
<template>
  <lh-time-picker v-model="value" :start="8" :end="20" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 스텝

`step-hour` / `step-minute` / `step-second`로 각 열의 옵션 간격을 지정합니다:

```vue
<template>
  <lh-time-picker v-model="value" :step-hour="2" :step-minute="5" :step-second="10" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 비활성화

`disabled`는 피커 전체를 비활성화합니다(패널이 열리지 않고 지우기 아이콘도 숨겨짐):

```vue
<template>
  <lh-time-picker v-model="value" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(new Date(2026, 10, 3, 9, 30, 0))
</script>
```

## 플레이스홀더와 지우기

`placeholder`로 플레이스홀더 텍스트를 덮어씁니다(지정하지 않으면 `format`에서 언어 팩 `timepicker.hour/minute/second`로 생성). 값이 있으면 트리거 오른쪽에 지우기 아이콘이 나타나고, 클릭하면 값을 비웁니다(`clearable` 기본값 `true`):

```vue
<template>
  <lh-time-picker v-model="value" placeholder="알림 시간 선택" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const value = ref<Date | null>(null)
</script>
```

## TimePicker API

### Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 바인딩된 시간 | `Date \| null` | `null` |
| size | 크기 | `LhTimePickerSize` | `'medium'` |
| disabled | 피커 전체 비활성화 | `boolean` | `false` |
| clearable | 지우기 버튼 표시 | `boolean` | `true` |
| placeholder | 플레이스홀더(미지정 시 format에서 언어 팩 `timepicker.hour/minute/second`로 생성) | `string` | — |
| format | 시간 포맷(`ss`가 있어야 초 열 표시) | `string` | `'HH:mm:ss'` |
| readonly | 읽기 전용 플래그(트리거는 view 자체 렌더링이며 입력 상태가 없어 사실상 항상 읽기 전용) | `boolean` | `false` |
| arrowControl | 화살표 버튼 표시(H5에서만 렌더링, 키보드 스텝과 함께 사용) | `boolean` | `false` |
| start | 시작 시간(0~23과의 교집합) | `number` | `0` |
| end | 종료 시간(0~23과의 교집합) | `number` | `24` |
| stepHour | 시간 열 스텝 | `number` | `1` |
| stepMinute | 분 열 스텝 | `number` | `1` |
| stepSecond | 초 열 스텝 | `number` | `1` |
| customClass | 커스텀 클래스 이름(루트 노드로 전달) | `string` | — |
| themeVars | 컴포넌트 수준 테마 변수 | `Record<string, string>` | — |
| sx | sx 레이아웃 속성(트리거 루트에 적용, 패널에는 영향 없음) | `LhSxProps` | — |

### Events

| Event | 설명 | 매개변수 |
| --- | --- | --- |
| update:modelValue | 바인딩 값이 변경될 때 발생 | `(value: Date \| null)` |
| change | «확인» 또는 지우기 아이콘 클릭 시 발생 | `(value: Date \| null)` |

### 접근성

- 트리거는 `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls`를 가집니다(share의 `getTimePickerTriggerAria`가 생성한 속성 묶음을 키별로 펼쳐 바인딩)
- 패널은 `role="dialog"`, 각 열은 `role="listbox"`(`aria-label`은 언어 팩 `timepicker.hourLabel/minuteLabel/secondLabel`), 열 항목은 `aria-selected` / `aria-disabled`를 가진 `role="option"`입니다
- 위치 계산 엔진은 자체 제작한 순수 함수(flip / shift 화면 overflowing 방지)이며 서드파티 런타임 의존성이 없습니다

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **롤러를 scroll-view 열 패널로 변경**: plus의 열 컨테이너는 `overflow-y: auto` `div`이며 `@wheel.prevent`로 휠을 가로채 스텝 이동하고, 선택 항목은 `scrollIntoView`로 표시 위치를 맞춥니다. uni-app 버전에서는 각 열을 독립적인 세로 스크롤 `scroll-view`(`scroll-y`)로 변경했습니다(MP의 `view`에는 신뢰할 수 있는 오버플로 스크롤이 없기 때문). 선택 항목은 `scroll-into-view`로 표시 위치로 스크롤합니다(MP에는 `scrollIntoView` API가 없습니다). 선택 인터랙션은 동일합니다: 열 항목을 클릭해 선택, 하단의 «지금 / 확인»으로 확정합니다.
- **휠 스텝은 미포팅**: 열 내 스크롤은 `scroll-view`의 네이티브 스크롤에 맡깁니다(H5에서는 휠이 긴 목록을 자연스럽게 스크롤). wheel 이벤트를 가로채 step 단위로 점프하지 않습니다. 스텝 옵션 생성(`step-hour` 등)은 plus와 동일합니다.
- **키보드 내비게이션은 H5 전용**: 트리거는 Enter/Space/아래 방향키로 패널을 열고 첫 번째 열로 포커스를 옮깁니다. 패널 내부에서 ↑↓로 설정 스텝 이동(시간은 랩 후 start/end 범위로 수렴), ←→로 열 사이 이동, Enter/Space로 확정 후 닫기, Escape는 문서 수준 리스너로 닫습니다(여러 오버레이가 겹치면 최상위만). 처리 본문 전체가 조건부 컴파일로 잘려 나가 MP 번들에는 데드 코드가 없습니다.
- **arrowControl은 H5에서만 렌더링**: 화살표 버튼은 키보드 스텝 의미에 의존하므로 MP에서는 렌더링하지 않습니다(템플릿 `v-if`를 컴파일 시점 `LH_IS_H5`로 가드).
- **외부 클릭 닫기**: plus는 document 클릭을 감지하지만, uni-app 버전은 페이지 내 투명 마스크로 처리합니다(마스크를 클릭하면 change를 발생시키지 않고 닫습니다).
- **트리거 자체 렌더링**: plus의 트리거는 입력 가능한 `<input>`이지만, uni-app 버전은 `<view>` + `<text>`로 직접 그립니다(MP에는 트리거 내 input 포커스 의미가 없고 플레이스홀더 색은 수식 클래스로 보충하며, `readonly`는 사실상 항상 켜진 상태입니다).
- **트리거 아이콘**: plus는 `date` 아이콘을 사용하지만 이 라이브러리는 의미에 더 맞는 `clock` 아이콘을 사용합니다.
- **등장/퇴장 트랜지션 미바인딩**: MP의 `Transition`은 신뢰할 수 없어서 tooltip / dropdown / popover / cascader와 마찬가지로 패널을 그대로 표시/숨김합니다.
:::
