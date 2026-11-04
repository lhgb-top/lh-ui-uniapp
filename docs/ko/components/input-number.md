# InputNumber 숫자 입력

숫자 입력 필드: 직접 입력 또는 증감 버튼으로 값을 변경하며, 범위 클램프·스텝·정밀도·엄격한 스텝을 지원합니다. 파라미터 정규화·스텝 처리·제출 시 클램프는 모두 `@lh-ui/share` core 순수 함수가 담당합니다.

## 기본 사용법

```vue
<template>
  <lh-input-number v-model="value" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const value = ref<number | null>(1)
</script>
```

## 범위 제한

`min` / `max`는 버튼 스텝과 입력값 제출 모두에 적용됩니다(범위를 벗어난 값은 클램프됩니다).

```vue
<template>
  <lh-input-number v-model="level" :min="1" :max="10" />
</template>
```

## 스텝과 정밀도

`step`으로 스텝 크기를 조정하고, `precision`으로 소수 자릿수를 고정하며(클램프보다 먼저 적용), `step-strictly`는 입력값을 step 그리드에 반올림하여 맞춥니다.

```vue
<template>
  <lh-input-number v-model="value" :step="2" />
  <lh-input-number v-model="value" :precision="2" placeholder="소수 2자리" />
  <lh-input-number v-model="value" :step="10" step-strictly placeholder="10의 배수만" />
</template>
```

## 크기와 컨트롤 버튼

`size`로 small / medium / large 단계를 전환하고, `controls`로 증감 버튼을 숨길 수 있습니다(입력 전용).

```vue
<template>
  <lh-input-number v-model="value" size="small" />
  <lh-input-number v-model="value" size="large" />
  <lh-input-number v-model="value" :controls="false" placeholder="버튼 없음" />
</template>
```

## 비활성화와 폼 이름

`disabled`는 전체를 비활성화하고(버튼 클릭 불가·입력 불가), `name`은 네이티브 폼 이름입니다.

```vue
<template>
  <lh-input-number :model-value="5" disabled />
  <lh-input-number v-model="value" name="quantity" />
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue / v-model | 현재 값(null은 빈 값) | `number \| null` | `null` |
| min | 최솟값 | `number` | `-Infinity` |
| max | 최댓값 | `number` | `Infinity` |
| step | 스텝 크기 | `number` | `1` |
| step-strictly | step의 배수만 입력 가능 | `boolean` | `false` |
| precision | 수치 정밀도(소수 자릿수) | `number` | — |
| disabled | 비활성화 여부 | `boolean` | `false` |
| size | 크기 | `"small" \| "medium" \| "large" \| "mini" \| "x-large"` | `'medium'` |
| controls | 증감 버튼 표시 여부 | `boolean` | `true` |
| placeholder | 플레이스홀더 | `string` | `''` |
| name | 네이티브 폼 이름 | `string` | `''` |
| customClass | 커스텀 클래스명(루트 노드에 전달) | `string` | — |
| sx | sx 레이아웃 단축 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 인자 |
| --- | --- | --- |
| update:modelValue / change | 값 제출(버튼은 즉시 제출, 입력값은 블러 / 확인 시 제출 — plus의 네이티브 change와 동일한 시점) | `(value: number \| null)` |

## 플랫폼 차이

- **제출 시점(드래프트 모델)**: uni의 input 컴포넌트에는 네이티브 change 이벤트가 없습니다(미니프로그램은 input / blur / confirm만 존재). 입력 중에는 내부 드래프트만 동기화하고 제출하지 않으며, 블러 또는 confirm(H5의 Enter / 미니프로그램 키보드의 '완료') 시 한 번에 제출합니다 — plus의 네이티브 change가 제출 시점에만 발생하는 것과 동등한 의미입니다(react 패키지와 동일한 방식). 동일 값은 중복 발생하지 않습니다(MP에서는 confirm 후 blur가 한 번 더 발생하므로 중복을 제거합니다).
- **증감 버튼은 view 자체 구현**: plus의 `<button>`을 `<view role="button">`으로 교체했습니다(MP의 button은 기본 스타일을 리셋할 수 없음). 클릭은 전 플랫폼에서 동작합니다. view에는 `:disabled` 의사 클래스가 없으므로 비활성화 외관은 동일한 토큰의 컴포넌트 인라인 폴백 규칙이 담당합니다.
- **키보드 상하키 스텝은 H5 전용**: ↑ 증가 / ↓ 감소(Enter 제출은 keydown에 묶지 않습니다 — H5에서는 keydown과 confirm이 동시에 발생하므로 이중 제출을 피하기 위해 confirm으로 통일); 미니프로그램에는 키보드 이벤트가 없어 동작 차이가 없습니다.
- **placeholder 스타일**: share의 `::placeholder` 규칙은 H5 산출물에만 포함되며, 미니프로그램은 `placeholder-style` prop을 사용합니다(토큰 색 폴백).
- **폼 검증 연동 미연결**: plus는 form 컨텍스트를 통해 input에 `aria-invalid`를 출력하지만, 본 패키지의 input 계열 컴포넌트는 폼 컨텍스트 aria 전달에 연결되어 있지 않습니다. 값과 검증 동작에는 영향이 없습니다.

::: tip Vue3 버전과의 차이
- 로직 기준(파라미터 정규화·스텝·precision / min/max / stepStrictly 클램프)은 plus와 완전히 동일합니다(같은 share core).
- `customClass` prop 추가: uni-app에서는 커스텀 클래스가 `styleIsolation`을 관통할 수 없어 prop으로 전달합니다.
- 입력값 제출 시점은 「플랫폼 차이」 첫 항목 참조(드래프트 모델, plus의 change 의미와 동등).
:::
