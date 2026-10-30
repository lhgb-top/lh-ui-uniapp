# Dialog 대화상자

## 기본 사용법

```vue
<template>
  <lh-button @click="visible = true">대화상자 열기</lh-button>

  <lh-dialog v-model="visible" title="제목" width="80%">
    <view>대화상자 내용입니다</view>
    <template #footer>
      <lh-button @click="visible = false">취소</lh-button>
      <lh-button type="primary" @click="visible = false">확인</lh-button>
    </template>
  </lh-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## 위치 지정

```vue
<template>
  <lh-dialog v-model="visible" position="bottom" title="하단 레이어">
    <view>하단 내용</view>
  </lh-dialog>

  <lh-dialog v-model="visible" fullscreen title="전체 화면">
    <view>전체 화면 내용</view>
  </lh-dialog>
</template>
```

하단 레이어는 자동으로 `env(safe-area-inset-bottom)`을 가져와 풀스크린 기기에 대응합니다.

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue (v-model) | 표시 여부 | `boolean` | `false` |
| title | 제목 | `string` | — |
| width | 너비 | `string \| number` | — |
| top | 상단 거리 | `string \| number` | — |
| fullscreen | 전체 화면 | `boolean` | `false` |
| position | 위치 | `'center' \| 'top' \| 'bottom'` | `'center'` |
| closeOnClickModal | 오버레이 클릭 시 닫힘 | `boolean` | `true` |
| closeOnPressEscape | Esc 닫힘(**MP에는 키보드 이벤트가 없어 작동하지 않음**) | `boolean` | `true` |
| lockScroll | 배경 스크롤 잠금(**H5 전용**) | `boolean` | `true` |
| zIndex | 층위(미전달 시 자동 증가 할당) | `number` | — |
| customClass | 커스텀 클래스명 | `string` | — |
| themeVars | 컴포넌트 수준 테마 변수 | `Record<string, string>` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 내용 |
| footer | 하단 버튼 영역 |

## Events

| 이벤트 | 설명 | 콜백 매개변수 |
| --- | --- | --- |
| update:modelValue | 표시 / 숨김 변화 | `(visible: boolean)` |
| open | 열기 | — |
| close | 닫기 | — |

::: tip Vue3 버전과의 차이
- 레이어 마운트는 `root-portal`을 사용합니다(H5는 teleport, MP는 root-portal 또는 페이지 내 fixed 폴백).
- **focus-trap은 MP 측에서 사용 불가**: `LH_IS_H5` 컴파일 시 게이트가 바로 false를 반환하며 focus-trap을 호출하지
  않습니다.
- **lockScroll은 MP 측에서 작동하지 않음**: 미니프로그램에는 body 스크롤 잠금이 없어 오버레이가 클릭을 가로채어
  폴백합니다.
- `closeOnPressEscape`는 MP 측에서 작동하지 않습니다(키보드 이벤트 없음).
:::
