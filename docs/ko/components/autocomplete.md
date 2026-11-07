# Autocomplete 자동 완성

입력에 따라 필터링하는 제안 입력창으로, 입력창(combobox)과 드롭다운 제안 목록(listbox)으로 구성됩니다.

## 기본 사용법

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { label: '수묵' },
  { label: '여백' },
  { label: '인장', value: 'seal' },
]
</script>

<template>
  <lh-autocomplete v-model="value" :options="options" />
</template>
```

옵션에 `label`만 작성한 경우 제출 값은 label 그대로입니다. 기계 판독이 가능한 식별자가 필요하면 `value`를 작성합니다. 비활성화된 옵션은 목록에 남아 회색으로 표시되며 선택할 수 없습니다.

## 필터링

기본적으로 `label`이 조회 문자열을 포함하는지로 필터링합니다(대소문자를 구분하지 않고, 양끝의 공백은 매칭에서 제외):

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" case-sensitive />
</template>
```

`case-sensitive`로 대소문자 구분 매칭을 켭니다. `trim`에 `false`를 전달하면 공백을 포함하여 매칭합니다.

## 선택 콜백

```vue
<template>
  <lh-autocomplete v-model="value" :options="options" @select="onSelect" />
</template>
```

`select` 이벤트의 매개변수는 제출 값과 원본 옵션 객체입니다.

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 입력값(v-model) | `string` | `''` |
| options | 제안 옵션 | `LhAutocompleteOption[]` | `[]` |
| caseSensitive | 대소문자 구분 매칭 | `boolean` | `false` |
| trim | 조회 문자열의 양끝 공백을 제거 후 매칭 | `boolean` | `true` |
| placeholder | 플레이스홀더 힌트 | `string` | — |
| placeholderStyle | 플레이스홀더 스타일(`::placeholder` 대체) | `string` | — |
| disabled | 비활성화 | `boolean` | `false` |
| openOnFocus | 포커스 시 제안 패널 펼침 | `boolean` | `true` |
| ariaLabel | 접근성 이름 | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 퀵 레이아웃 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| empty | 일치하는 항목이 없을 때의 빈 상태(기본 문구는 언어 팩 autocomplete.noMatch에서 가져옴) |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| update:modelValue | 입력이나 선택 후 되돌려 씀 | `(value: string)` |
| change | 입력값 변화 | `(value: string)` |
| select | 제안 항목 선택됨 | `(value: string \| number, option: LhAutocompleteOption)` |

## 메서드(defineExpose)

| 메서드 | 설명 |
| --- | --- |
| open / close | 패널을 수동으로 펼침 / 닫음 |
| isOpen | 현재 펼침/닫힘 상태(읽기 전용) |

## 플랫폼 차이

| 기능 | H5 | 미니프로그램 |
| --- | --- | --- |
| 드롭다운 배치 | root-portal + 2프레임 계측(select와 동일) | Alipay는 베이스 라이브러리 버전에 따라 root-portal / 페이지 내 fixed를 전환, Douyin은 페이지 내 fixed |
| 키보드 조작 / Esc | 방향키로 하이라이트 이동, Enter로 선택, Esc로 닫기 | 키보드 이벤트 없음, 클릭으로만 선택 |
| hover 하이라이트 | 있음 | 없음(클릭 즉시 선택) |
| openOnFocus | 포커스 시 펼침 | 포커스 시 펼침 |
