# InputTag 태그 입력

입력과 동시에 제출되는 태그 그룹으로, 트리거 키, 상한, 중복 제거, 클릭 삭제를 지원합니다.

## 기본 사용법

```vue
<script setup>
import { ref } from 'vue'
const tags = ref(['수묵', '여백'])
</script>

<template>
  <lh-input-tag v-model="tags" placeholder="입력 후 Enter로 제출" />
</template>
```

## 트리거 키

`trigger`는 `enter`(기본) / `space` / `comma`를 지원합니다. `space` / `comma`로 트리거할 때 공백은 입력창에 들어가지 않습니다.

```vue
<template>
  <lh-input-tag v-model="tags" trigger="comma" placeholder="쉼표로 제출" />
</template>
```

## 상한과 중복 제거

```vue
<template>
  <lh-input-tag v-model="tags" :max="3" allow-duplicate />
</template>
```

`max`가 양수일 경우 상한입니다(초과 시 제출되지 않고 입력이 비워집니다). 기본적으로 중복을 허용하지 않습니다(중복은 제출되지 않습니다).

## 읽기 전용과 비활성화

```vue
<template>
  <lh-input-tag v-model="tags" readonly />
  <lh-input-tag v-model="tags" disabled />
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 태그 목록(v-model) | `string[]` | `[]` |
| trigger | 제출 트리거 키(미니프로그램에서는 항상 완료 키) | `'enter' \| 'space' \| 'comma'` | `'enter'` |
| placeholder | 자리표시 힌트(태그가 없을 때만 표시) | `string` | `''` |
| placeholderStyle | 자리표시 스타일(`::placeholder` 대체) | `string` | — |
| max | 태그 상한(양수가 아닌 값은 무제한) | `number` | `0` |
| allowDuplicate | 중복 태그 허용 | `boolean` | `false` |
| readonly | 읽기 전용 | `boolean` | `false` |
| disabled | 비활성화 | `boolean` | `false` |
| ariaLabel | 접근성 이름 | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| update:modelValue | 태그 목록 변경 | `(value: string[])` |
| change | 태그 목록 변경(modelValue와 동일) | `(value: string[])` |
| add | 단일 태그 제출 | `(tag: string)` |
| remove | 단일 태그 삭제 | `(tag: string)` |

## 메서드(defineExpose)

| 메서드 | 설명 |
| --- | --- |
| focus | 입력창에 포커스 |
| commit | 현재 입력 제출 |

## 플랫폼 차이

| 기능 | H5 | 미니프로그램 |
| --- | --- | --- |
| 제출 트리거 키 | `trigger` 모두 지원(Enter / Space / Comma 키보드 이벤트) | 항상 **완료 키**(`@confirm`). `space` / `comma` 트리거 키 의미는 H5 전용 |
| Backspace 삭제 | 입력이 비어 있을 때 Backspace로 마지막 태그 삭제 | 키보드 이벤트 없음, 삭제는 각 태그의 **× 버튼**(양쪽 모두 사용 가능) |
| 블러 시 제출 | 있음 | 있음 |
| 포커스 테두리 | `:has()` 포커스 스타일 적용 | 포커스 테두리 없음(WXSS는 `:has()` 미지원), 입력은 정상 |
