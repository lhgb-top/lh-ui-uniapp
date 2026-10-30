# Input 입력 상자

## 기본 사용법

```vue
<template>
  <lh-input v-model="text" placeholder="입력하세요" />
  <lh-input v-model="text" type="textarea" :rows="3" autosize placeholder="여러 줄" />
  <lh-input v-model="text" type="password" placeholder="비밀번호" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
```

## 플레이스홀더 스타일(MP 필수)

::: warning 미니프로그램은 `::placeholder`를 지원하지 않음
WeChat 미니프로그램의 WXSS는 `::placeholder` 의사 요소를 지원하지 않습니다. 플레이스홀더 스타일은 prop으로 전달하고,
CSS에 `::placeholder`를 **쓰지 마십시오**(빌드 시 게이트도 차단).
:::

```vue
<lh-input placeholder="입력하세요" placeholder-style="color: #999; font-size: 13px" />
<!-- 또는 클래스명 사용 -->
<lh-input placeholder="입력하세요" placeholder-class="my-placeholder" />
```

## 아이콘과 상태 포함

```vue
<template>
  <lh-input v-model="text" prefix-icon="search" placeholder="검색" clearable />
  <lh-input v-model="text" suffix-icon="close" placeholder="접미사 아이콘" />
  <lh-input v-model="text" state="error" placeholder="검증 실패 상태" />
  <lh-input v-model="text" :maxlength="20" show-word-limit placeholder="글자 수 카운트" />
</template>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue (v-model) | 바인딩 값 | `string` | — |
| type | 유형 | `'text' \| 'textarea' \| 'password' \| 'number' \| 'email' \| 'url' \| 'tel' \| 'date' \| 'time'` | `'text'` |
| size | 크기 | `'small' \| 'medium' \| 'large'` | — |
| disabled | 비활성화 | `boolean` | `false` |
| readonly | 읽기 전용 | `boolean` | `false` |
| placeholder | 플레이스홀더 텍스트 | `string` | — |
| placeholderStyle | 플레이스홀더 인라인 스타일(`::placeholder` 대체) | `string` | — |
| placeholderClass | 플레이스홀더 클래스명(placeholderStyle와 둘 중 하나 선택) | `string` | — |
| maxlength | 최대 길이 | `number` | — |
| minlength | 최소 길이 | `number` | — |
| showWordLimit | 글자 수 카운트 표시 | `boolean` | `false` |
| clearable | 비우기 가능 | `boolean` | `false` |
| prefixIcon | 접두사 아이콘 | `LhIconName` | — |
| suffixIcon | 접미사 아이콘 | `LhIconName` | — |
| state | 검증 상태 | `'error' \| 'success' \| 'warning'` | — |
| name | 네이티브 name(폼 수집용) | `string` | — |
| password | 비밀번호 모드 | `boolean` | `false` |
| rows | textarea 줄 수 | `number` | — |
| autosize | textarea 높이 자동 조절(MP의 auto-height) | `boolean` | `false` |
| label | 레이블 문구 | `string` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| themeVars | 컴포넌트 수준 테마 변수 | `Record<string, string>` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| update:modelValue | 값 변경 | `(value: string)` |
| input | 입력(`event.detail.value`에서 취득) | `(value: string)` |
| blur | 포커스 아웃 | — |
| focus | 포커스 | — |
| clear | 비우기 | — |

::: tip Vue3 버전과의 차이
`autocomplete` / `autofocus` / `resize` / `form` / `tabindex` / `nativeType` /
`inputStyle`은 미니프로그램에 대응하는 기능이 없어 본 라이브러리에서 **구현하지 않습니다**. `autosize`는 미니프로그램
textarea의 `auto-height` 속성을 사용합니다.
:::
