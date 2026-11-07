# ColorPicker 색상 선택기

트리거를 클릭하면 컬러 패널이 열립니다: 채도 / 명도 보드 드래그 + 색상 / 투명도 슬라이더 + hex / rgb 입력 + 프리셋 팔레트. 색 변환은 전부 `@lh-ui/share/core/color-picker` 순수 함수를 사용하며(hex/rgb ↔ HSV 양방향 왕복, 채널은 전 구간 클램프), H5와 위챗 미니프로그램 렌더링이 일치합니다.

## 기본 사용법

```vue
<template>
  <lh-color-picker v-model="color" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('#2B4C7C')
</script>
```

## 투명도와 프리셋 팔레트

```vue
<template>
  <lh-color-picker
    v-model="color"
    show-alpha
    :predefine="predefine"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const color = ref('rgba(43, 76, 124, 0.6)')
// showAlpha를 켜면 hex는 8자리(#2b4c7c99)로, rgb는 rgba()로 출력 — alpha 값이 있으면 절대 조용히 유실되지 않습니다
const predefine = ['#2B4C7C', '#5B8C5A', '#C4A35A', '#B23A3A']
</script>
```

## 출력 포맷

```vue
<lh-color-picker v-model="color" format="rgb" />
```

`format`은 `v-model`의 출력 형태(`hex` 또는 `rgb`)에만 영향을 주며, 잘못된 값은 `hex`로 폴백합니다.

## 크기 / 지우기 / 비활성화

```vue
<lh-color-picker v-model="color" size="small" />
<lh-color-picker v-model="color" clearable />
<lh-color-picker v-model="color" disabled />
```

`clearable`을 켜면 값이 있을 때 트리거 안에 지우기 버튼이 나타나고, 클릭하면 값을 비우고 `clear` 이벤트를 발생시킵니다.

## 명령형 열기 / 닫기

```vue
<template>
  <lh-color-picker ref="pickerRef" v-model="color" />
  <lh-button size="small" @click="pickerRef?.open()">패널 열기</lh-button>
</template>
```

컴포넌트는 ref를 통해 `open` / `close` / `isOpen`을 노출합니다.

## ColorPicker API

### Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| model-value | 바인딩 값(제어형 v-model, hex 또는 rgb() 문자열, format에 따라 출력) | `string` | `''` |
| format | 출력 포맷(잘못된 값은 hex로 폴백) | `'hex' \| 'rgb'` | `hex` |
| show-alpha | 투명도 채널(켜면 8자리 hex / rgba() 출력) | `boolean` | `false` |
| predefine | 프리셋 팔레트 | `string[]` | `[]` |
| size | 크기 | `'mini' \| 'small' \| 'medium' \| 'large' \| 'x-large'` | `medium` |
| disabled | 비활성화 | `boolean` | `false` |
| clearable | 지우기(값 비우기) 버튼 | `boolean` | `false` |
| placeholder | 플레이스홀더 안내(빈 값일 때; 미지정 시 언어 팩 colorPicker.placeholder 사용) | `string` | `''` |
| aria-label | 접근성 이름(미지정 시 언어 팩 colorPicker.label 사용) | `string` | — |
| custom-class | 루트 노드로 전달되는 커스텀 클래스명 | `string` | — |
| sx | sx 레이아웃 단축 속성 | `LhSxProps` | — |

### Events

| Event | 설명 | Parameters |
| --- | --- | --- |
| update:model-value | 색 변경(v-model) | `(value: string)` |
| change | 색 확정 변경(update:model-value와 동일한 페이로드) | `(value: string)` |
| clear | 지우기 버튼 클릭 | — |

### Expose

| 메서드 | 설명 |
| --- | --- |
| open | 패널 열기 |
| close | 패널 닫기 |
| isOpen | 패널 열림 여부(ref) |

### 접근성

- 트리거는 `role="button"`이며 `aria-expanded`와 `aria-label`을 갖습니다(언어 팩 colorPicker.label).
- 색상 / 투명도 슬라이더는 `role="slider"`이며 `aria-valuenow/min/max`를 갖고, 방향키로 미세 조정합니다(Shift로 가속).
- 프리셋 팔레트의 각 칸은 클릭할 수 있으며, 접근 가능한 이름은 색 값 문자열 그 자체입니다.

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **드래그 방식**: MP는 터치 대상을 따라 touchmove / touchend를 전달하며 document 감시가 필요 없습니다. H5는 별도로 document 레벨 마우스 감시를 사용합니다(컴포넌트 밖으로 나가도 드래그 지속). 패러다임은 Slider와 동일합니다.
- **패널 내 hex / rgb 입력은 uni `<input>` 사용**: 엔터 제출은 `@confirm`으로(키보드 「완료」), 포커스 이탈 제출은 `@blur`로 처리합니다(MP에는 keydown.enter가 없음).
- **키보드 조작은 H5 전용**: 방향키 미세 조정, Enter / Space 열기·닫기, Esc 닫기는 H5에서만 동작하며, MP에는 키보드 이벤트가 없습니다.
- **패널 위치 결정**: root-portal + 2프레임 측정으로 처리합니다(measure → 위치 결정 → 표시, 깜빡임 방지).
:::
