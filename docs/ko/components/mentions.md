# Mentions 멘션

`@` 입력으로 발동하는 멤버 멘션 입력창으로, 필터링, 여러 줄, 선택 콜백을 지원합니다.

## 기본 사용법

```vue
<script setup>
import { ref } from 'vue'
const value = ref('')
const members = [
  { label: '수묵', value: 'ink' },
  { label: '여백', value: 'blank' },
]
</script>

<template>
  <lh-mentions v-model="value" :options="members" />
</template>
```

`@`를 입력하면 제안 패널이 펼쳐지고, 이어서 입력하면 label 기준으로 필터링됩니다. 선택 시 되돌려 쓰이는 것은 `label`(사람이 읽을 수 있는 `@수묵 `)이며, 기계 판독이 가능한 식별자 `value`는 `select` 이벤트로 비즈니스 계층에 전달됩니다.

## 여러 줄

```vue
<template>
  <lh-mentions v-model="value" :options="members" multiline />
</template>
```

`multiline`은 단일 줄 input을 textarea로 바꿉니다.

## 트리거 문자

```vue
<template>
  <lh-mentions v-model="value" :options="members" prefix="#" />
</template>
```

`prefix`의 기본값은 `'@'`입니다. ASCII 단어 문자에 바로 붙은 의사 접두사(이메일의 `user@` 등)는 발동하지 않습니다.

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue | 텍스트 내용(v-model) | `string` | `''` |
| options | 제안 멤버 | `LhMentionOption[]` | `[]` |
| prefix | 트리거 문자 | `string` | `'@'` |
| placeholder | 플레이스홀더 힌트(기본값은 언어 팩 mentions.placeholder에서 가져옴) | `string` | — |
| placeholderStyle | 플레이스홀더 스타일(`::placeholder` 대체) | `string` | — |
| disabled | 비활성화 | `boolean` | `false` |
| multiline | 여러 줄 textarea | `boolean` | `false` |
| ariaLabel | 접근성 이름 | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| sx | 퀵 레이아웃 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| empty | 일치하는 항목이 없을 때의 빈 상태(기본 문구는 언어 팩 mentions.noMatch에서 가져옴) |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| update:modelValue | 입력이나 선택 후 되돌려 씀 | `(value: string)` |
| change | 텍스트 변화 | `(value: string)` |
| select | 멘션 항목 선택됨 | `(option: LhMentionOption)` |

## 메서드(defineExpose)

| 메서드 | 설명 |
| --- | --- |
| updateContext | 커서 컨텍스트를 수동으로 새로고침 |
| close | 제안 패널 닫기 |

## 플랫폼 차이

| 기능 | H5 | 미니프로그램 |
| --- | --- | --- |
| 드롭다운 배치 | root-portal + 2프레임 계측(select와 동일) | Alipay는 베이스 라이브러리 버전에 따라 root-portal / 페이지 내 fixed를 전환, Douyin은 페이지 내 fixed |
| 커서 컨텍스트 | 네이티브 `selectionStart`(텍스트 중간에서도 멘션 발동 가능) | **커서 위치를 가져올 수 없어 텍스트 끝으로 근사**——입력된 텍스트 중간에서 멘션을 발동하는 경우는 작동하지 않고 끝에 삽입하는 것으로 폴백 |
| 키보드 조작 / Esc | 방향키로 하이라이트 이동, Enter로 선택, Esc로 닫기 | 키보드 이벤트 없음, 클릭으로만 선택 |
| 선택 후 커서 위치 | 멘션 바로 뒤에 정확히 배치 | 제어되는 되돌려쓰기 이후 커서는 끝에 위치 |
