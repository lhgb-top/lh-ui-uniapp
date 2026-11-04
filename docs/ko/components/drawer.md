# Drawer 드로어

화면 가장자리에서 슬라이드 인하는 패널로, Dialog보다 더 넓은 공간이 필요한 임시 작업(상세, 필터, 위저드 단계)에 적합합니다. Dialog과 마찬가지로 `role="dialog"` + `aria-modal="true"`를 사용하며, 마스크 클릭과 Esc(H5)로 닫을 수 있습니다.

## 기본 사용법

```vue
<template>
  <lh-button @click="visible = true">드로어 열기</lh-button>

  <lh-drawer v-model="visible" title="주문 상세">
    <view>여기에 드로어 본문 내용을 넣습니다.</view>
    <view>패널 너비는 size로 제어하며, 기본값은 뷰포트 너비의 30%입니다.</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>
```

## 네 방향

`direction`은 `right`(기본값) / `left` / `top` / `bottom`을 받으며, 패널은 해당 가장자리에서 슬라이드 인합니다.

```vue
<template>
  <!-- 오른쪽 드로어 열기 -->
  <lh-button @click="openDir('right')">right</lh-button>
  <!-- 왼쪽 드로어 열기 -->
  <lh-button @click="openDir('left')">left</lh-button>
  <!-- 위 드로어 열기 -->
  <lh-button @click="openDir('top')">top</lh-button>
  <!-- 아래 드로어 열기 -->
  <lh-button @click="openDir('bottom')">bottom</lh-button>

  <!-- 지정한 방향으로 슬라이드 아웃 -->
  <lh-drawer v-model="dirVisible" :title="`${direction} 드로어`" :direction="direction" size="40%">
    <view>현재 방향: {{ direction }}</view>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LhDrawerDirection } from '@lh-ui/uniapp'

const dirVisible = ref(false)
const direction = ref<LhDrawerDirection>('right')
function openDir(d: LhDrawerDirection) {
  direction.value = d
  dirVisible.value = true
}
</script>
```

## 크기 커스터마이즈

`size`는 숫자면 px, 문자열이면 백분율을 지원합니다(예: `'40%'`). 좌우 방향은 너비에, 상하 방향은 높이에 적용됩니다.

```vue
<template>
  <!-- 너비 480px 드로어 열기 -->
  <lh-button @click="sized = true">너비 480px 드로어</lh-button>

  <!-- 고정 크기 드로어, 하단은 작업 영역 -->
  <lh-drawer v-model="sized" title="필터 조건" :size="480">
    <view>이름, 태그로 데이터를 필터링합니다.</view>
    <template #footer>
      <lh-button @click="sized = false">취소</lh-button>
      <lh-button type="primary" @click="sized = false">필터 적용</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const sized = ref(false)
</script>
```

## 동작 스위치

`mask-closable`은 마스크 클릭 닫기, `show-close`는 오른쪽 위 닫기 버튼, `close-on-esc`는 Esc 닫기(H5 전용), `lock-scroll`는 열려 있는 동안 페이지 스크롤 잠금(H5 전용)을 제어합니다.

```vue
<template>
  <!-- 「버튼으로만 닫기」드로어 열기 -->
  <lh-button @click="locked = true">버튼으로만 닫기</lh-button>

  <!-- 마스크 클릭과 Esc 모두 닫지 않으며 버튼으로만 닫을 수 있음 -->
  <lh-drawer
    v-model="locked"
    title="버튼으로만 닫기"
    :mask-closable="false"
    :show-close="false"
    :close-on-esc="false"
  >
    <view>마스크 클릭이나 Esc(H5)로도 닫히지 않습니다.</view>
    <template #footer>
      <lh-button type="primary" @click="locked = false">닫기</lh-button>
    </template>
  </lh-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const locked = ref(false)
</script>
```

## Drawer API

### Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| modelValue (v-model) | 표시 여부 | `boolean` | `false` |
| title | 제목(header 슬롯도 가능) | `string` | — |
| direction | 방향 | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` |
| size | 크기: 숫자는 px, 문자열은 백분율 지원 | `string \| number` | `'30%'` |
| maskClosable | 마스크 클릭으로 닫을지 여부 | `boolean` | `true` |
| showClose | 닫기 버튼 표시 여부 | `boolean` | `true` |
| lockScroll | 열려 있는 동안 페이지 스크롤 잠금(**H5 전용**) | `boolean` | `true` |
| closeOnEsc | Esc 닫기 응답 여부(**H5 전용**) | `boolean` | `true` |
| customClass | 커스텀 클래스명(루트 노드에 전달) | `string` | — |
| themeVars | 컴포넌트 단위 테마 변수 | `Record<string, string>` | — |
| bgPattern | 컴포넌트 단위 배경 패턴, ConfigProvider 설정을 덮어씀 | `string` | — |
| sx | sx 빠른 레이아웃 속성(패널에 적용) | `LhSxProps` | — |

### Events

| 이벤트 | 설명 | 콜백 인자 |
| --- | --- | --- |
| update:modelValue | 표시 상태 변경(애니메이션 종료 후 발생) | `(visible: boolean)` |
| open | 열림 | — |
| close | 닫힘(애니메이션 종료 후 발생) | — |

### Slots

| 슬롯 | 설명 |
| --- | --- |
| default | 본문 내용 |
| header | 헤더 제목 영역 커스텀(title 텍스트 대체) |
| footer | 하단 작업 영역 |

### Methods

| 메서드 | 설명 |
| --- | --- |
| open | 프로그래밍 방식으로 열기 |
| close | 프로그래밍 방식으로 닫기 |

### 접근성

- 루트 노드는 `role="dialog"` + `aria-modal="true"`. 제목이 있으면 `aria-labelledby`로 연결하고, 없으면 언어 팩의 `drawer.title`을 `aria-label` 폴백으로 사용
- 마스크는 장식 노드(`aria-hidden="true"`)
- 닫기 버튼은 `role="button"`과 언어 팩 `drawer.close`의 `aria-label`을 가짐
- Esc로 닫기(`close-on-esc`로 비활성화 가능, H5 전용)

::: tip 플랫폼 차이(Vue3 버전과의 차이)
- **오버레이 담체**: `teleportTarget` prop 없음——미니프로그램에는 DOM teleport가 없어 오버레이는 `root-portal`이 담당합니다(H5는 teleport). **WeChat의 `root-portal`은 베이스 라이브러리 ≥ 2.25.2가 필요**하며, 낮은 버전은 자동으로 페이지 내 `fixed`로 폴백합니다(페이지 노드 트리에서 벗어나지 않지만 계층은 자동 증가 z-index가 보장하므로 기능에 영향이 없습니다).
- **열림/닫힘 전환**: plus는 `<Transition name="lh-drawer-fade">`로 슬라이드 애니메이션을 구동하지만, 미니프로그램에는 `<Transition>` 컴포넌트가 없고 `transitionend` 이벤트도 신뢰할 수 없어, 이 포트는 Vue Transition의 클래스 시퀀스를 수동으로 재현하고(시작 상태를 한 프레임 뒤에 제거 → 활성 상태 → 종료 시 언마운트) share SCSS의 300ms transition 길이를 `setTimeout`으로 맞춥니다——마스크 페이드 + 방향별 패널 슬라이드는 양쪽에서 동일하게 보입니다.
- **포커스 트랩(focus-trap)은 키보드 포커스 의미론이 H5에만 있으며 이 포트에서는 미지원**: plus는 열려 있는 동안 Tab 포커스를 패널 안에 가두지만, 미니프로그램에는 키보드 포커스 의미론이 없고(share의 shouldDrawerTrapFocus는 LH_IS_H5 컴파일 시 가드로 단락됨) Dialog과 마찬가지로 share의 focus-trap을 호출하지 않습니다. Esc 닫기만 유지합니다.
- **lockScroll은 H5 전용**: 미니프로그램에는 body 스크롤 잠금 수단이 없어 전체 화면 마스크가 클릭을 가로채는 방식으로 대체합니다.
- **closeOnEsc는 H5 전용**: Esc는 문서 레벨 키보드 리스너로, 여러 오버레이가 쌓였을 때 최상위만 응답합니다. 미니프로그램에는 키보드 이벤트가 없어 전체가 조건부 컴파일로 제거됩니다.
- **teleportTarget 미구현**: select / tooltip / dropdown 선례에 맞춥니다(미니프로그램에는 DOM teleport가 없음).
- **하단 드로어 세이프 에어리어**: `direction="bottom"`일 때 패널이 자동으로 `env(safe-area-inset-bottom)` 안쪽 여백을 가져 풀스크린 기기에 대응합니다(uni-app 고유 대응으로, share 스타일 소스에는 없는 플랫폼 특화).
:::
