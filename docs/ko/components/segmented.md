# Segmented 세그먼트 컨트롤

상호 배타적인 옵션 전환, 주로 뷰 전환 상황에서 사용합니다. 데이터 기반: 옵션을 `options` 배열로 직접 전달하며, 자식 컴포넌트를 수동으로 조립할 필요가 없습니다.

## 기본 사용법

`options`는 문자열 단축 표기를 지원하고, `modelValue`(`v-model`)가 현재 선택 값입니다.

```vue
<template>
  <lh-segmented v-model="view" :options="['목록', '카드', '표']" />
</template>

<script setup>
import { ref } from 'vue'
const view = ref('목록')
</script>
```

## 객체 옵션

객체 표기는 `label` / `value`를 제공하여, 표시되는 텍스트와 값이 다른 경우에 적합합니다.

```vue
<template>
  <lh-segmented
    v-model="mode"
    :options="[
      { label: '일', value: 'day' },
      { label: '주', value: 'week' },
      { label: '월', value: 'month' },
    ]"
  />
</template>

<script setup>
import { ref } from 'vue'
const mode = ref('day')
</script>
```

## 비활성화 항목과 전체 비활성화

옵션 객체에 `disabled: true`를 지정하면 해당 항목을 선택할 수 없고, 컴포넌트 수준의 `disabled`는 세그먼트 컨트롤 전체를 비활성화합니다.

```vue
<template>
  <lh-segmented
    v-model="seg"
    :options="[
      { label: '입춘', value: 'lichun' },
      { label: '우수', value: 'yushui' },
      { label: '경칩', value: 'jingzhe', disabled: true },
    ]"
  />
  <lh-segmented v-model="all" disabled :options="['갑', '을', '병']" />
</template>

<script setup>
import { ref } from 'vue'
const seg = ref('lichun')
const all = ref('갑')
</script>
```

## 블록 너비

`block`은 세그먼트 컨트롤이 컨테이너를 가득 채우고 옵션들이 너비를 균등하게 나누게 합니다(뷰 전환 바에서 자주 사용).

```vue
<template>
  <lh-segmented v-model="block" block :options="['시', '사', '곡', '부']" />
</template>

<script setup>
import { ref } from 'vue'
const block = ref('시')
</script>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue (v-model) | 현재 값(제어형, `update:modelValue` 이벤트와 함께 사용) | `string \| number` | — |
| options | 옵션(문자열 단축 표기 또는 `{ label, value, disabled }` 객체) | `[LhSegmentedInput](#타입-메모)[]` | — |
| disabled | 그룹 전체 비활성화 | `boolean` | `false` |
| block | 컨테이너를 가득 채움(옵션이 너비를 균등하게 나눔) | `boolean` | `false` |
| customClass | 커스텀 클래스 이름(루트 노드로 전달) | `string` | — |
| sx | 레이아웃 간단 속성 | `LhSxProps` | — |

### 타입 메모

```ts
/** 옵션 값 타입 */
type LhSegmentedValue = string | number

/** 옵션 객체 형태 */
interface LhSegmentedOption {
  label: string
  value: LhSegmentedValue
  disabled?: boolean
}

/** 입력 옵션(문자열 단축 표기 또는 객체) */
type LhSegmentedInput = LhSegmentedValue | LhSegmentedOption
```

## Events

| 이벤트 이름 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| update:modelValue | 선택 항목이 변경될 때 발생, v-model과 함께 사용 | `(value: string \| number)` |
| change | 선택 항목이 변경될 때 발생(클릭과 방향키 모두 발생) | `(value: string \| number)` |

## 플랫폼 차이

- **view로 직접 그리는 터치 상호작용, 모든 플랫폼에서 사용 가능**: Vue3 버전의 `<div>` + `<button>`은 `<view>`로 대체됩니다(WXSS는 태그 선택자를 금지하고 클래스 이름으로 스타일을 적용). 선택 전환은 `@click`으로 발생하며 H5와 WeChat 미니프로그램에서 동일하게 동작하고, 어떤 플랫폼 API에도 의존하지 않습니다.
- **선택 슬라이더는 순수 CSS 전환**: 선택 항목의 배경색 / 그림자는 클래스 전환으로 구동되고, WXSS는 단순 `transition`을 지원하므로 양쪽 모두에서 페이드 효과가 있습니다.**`transitionend`에 의존하지 않습니다**(미니프로그램에서는 해당 이벤트가 불안정하여 이 리포지터리의 message / loading 등 애니메이션 컴포넌트는 모두 setTimeout으로 시간을 맞추지만, 세그먼트 컨트롤은 JS 타이밍 조정조차 필요 없이 순수 CSS로 충분합니다).
- **방향키 내비게이션은 H5 전용**: roving tabindex(방향키로 선택 이동, 양 끝에서 순환, 비활성화 항목 건너뛰기, `@lh-ui/share` core의 `getNextListIndex` / `getRovingTabIndex` 재사용)는 미니프로그램에 키보드 이벤트가 없어 SFC의 `@keydown` 처리는 조건부 컴파일로 가드되고 MP 번들 내에서는 호출되지 않습니다. MP에서는 탭으로만 선택할 수 있습니다.
- **비활성화 항목의 외형은 클래스 폴백**: share 스타일 소스의 비활성화 스타일은 `&:disabled` 가상 클래스(button 요소에만 일치)에 작성되어 있는데 view에는 해당 가상 클래스가 없으므로, 컴포넌트는 SFC 인라인으로 동일한 토큰(`--lh-disabled-text-color`)의 `lh-segmented__option--disabled` 클래스 규칙을 보충합니다(lh-spinner / lh-empty의 인라인 폴백 선례와 동일, 정화 산물에는 포함되지 않습니다).
- **접근성 속성은 항목별로 개별 바인딩**: `role="radiogroup"` / `role="radio"` + `aria-checked` / `aria-disabled`의 계약은 여전히 share의 `getSegmentedAria` / `getSegmentedItemAria`가 결정하지만, 미니프로그램 템플릿 컴파일러가 객체 `v-bind`를 지원하지 않아 글루 계층에서 속성 팩을 개별 명시 바인딩으로 펼쳐냅니다.
- **이식 결론**: segmented는 측정도, 오버레이도, document 의존도도 없는 순수 전환 컴포넌트로, 옵션 정규화, 클래스 이름, 접근성 속성은 모두 `@lh-ui/share` core의 순수 함수가 생성하고 이 리포지터리는 반응형 글루만 작성합니다. API는 Vue3 버전과 완전히 동일합니다(`modelValue` / `options` / `disabled` / `block` / `sx`).
