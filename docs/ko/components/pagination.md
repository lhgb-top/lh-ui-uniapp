# Pagination 페이지네이션

페이지 내비게이션: 이전 페이지 / 페이지 번호 / 생략 기호 / 다음 페이지 / 총 항목 수 / 페이지 크기 변경 /
페이지 이동. 페이지 창 축소 알고리즘(첫·마지막 페이지 상시 표시, 현재 페이지 양옆에 인접 페이지 표시,
실제 간격이 생길 때만 생략 기호 출력)은 `@lh-ui/share` core 층의 순수 함수로 구현되어 있습니다.

## 기본 사용법

`total`은 데이터 총 개수(필수)입니다. 기본 페이지 크기는 10입니다.

```vue
<template>
  <lh-pagination :total="120" />
</template>
```

## 총 개수와 페이지 크기 변경

`show-total`은 총 개수를 표시하고, `show-size-changer`는 페이지 크기 변경기를 표시합니다
(uni 측에서는 내장 picker로 담당합니다).

```vue
<template>
  <lh-pagination :total="480" show-total show-size-changer />
</template>
```

## 페이지 이동

`show-jumper`는 이동 입력을 표시합니다. 페이지 번호를 입력한 뒤 엔터(confirm) 또는 포커스 아웃으로
제출하며, 범위를 벗어나면 자동으로 클램프됩니다.

```vue
<template>
  <lh-pagination :total="480" show-total show-jumper />
</template>
```

## 간결 모드

`simple`은 페이지 번호 영역을 접고 "현재 페이지 / 총 페이지 수"만 표시합니다.

```vue
<template>
  <lh-pagination :total="480" simple show-jumper />
</template>
```

## 제어(受控) 사용법

현재 페이지는 `v-model:current`로 제어합니다.

```vue
<template>
  <lh-pagination v-model:current="page" :total="95" />
  <text>현재 페이지: {{ page }}</text>
</template>

<script setup>
import { ref } from 'vue'
const page = ref(2)
</script>
```

## 페이지 크기와 비활성화

`v-model:page-size`로 페이지 크기를 제어하고, `page-sizes`로 크기 옵션을 커스터마이즈합니다.
크기 변경 후 현재 페이지가 범위를 벗어나면 자동으로 클램프됩니다. `disabled`는 전체를 비활성화합니다.

```vue
<template>
  <lh-pagination
    v-model:page-size="pageSize"
    :total="480"
    show-size-changer
    :page-sizes="[10, 20, 50, 100]"
  />
  <text>페이지 크기: {{ pageSize }}</text>
  <lh-pagination :total="480" disabled />
</template>

<script setup>
import { ref } from 'vue'
const pageSize = ref(20)
</script>
```

## Props

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| total | 데이터 총 개수(필수) | `number` | — |
| pageSize | 페이지 크기(`update:pageSize` 이벤트로 제어) | `number` | `10` |
| current | 현재 페이지(`v-model:current`) | `number` | — |
| pageSizes | 페이지 크기 옵션 | `number[]` | `[10, 20, 30, 40]` |
| showTotal | 총 개수 표시 여부 | `boolean` | `false` |
| showSizeChanger | 페이지 크기 변경기 표시 여부 | `boolean` | `false` |
| showJumper | 페이지 이동 입력 표시 여부 | `boolean` | `false` |
| simple | 간결 모드 | `boolean` | `false` |
| disabled | 비활성화 여부 | `boolean` | `false` |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Events

| 이벤트 이름 | 설명 | 콜백 인자 |
| --- | --- | --- |
| update:current | 현재 페이지가 바뀔 때 트리거(`v-model:current`와 함께 사용) | `(page: number)` |
| update:pageSize | 페이지 크기가 바뀔 때 트리거(`v-model:page-size`와 함께 사용) | `(size: number)` |
| change | 현재 페이지가 바뀔 때 트리거(페이지 번호 / 앞뒤 이동 / 페이지 이동 모두) | `(page: number)` |
| size-change | 페이지 크기가 바뀔 때 트리거 | `(size: number)` |

## 접근성

- 루트 노드는 `role="navigation"` + `aria-label="pagination"`
- 현재 페이지 버튼에는 자동으로 `aria-current="page"`가 설정되고, 각 페이지 번호 버튼과
  이전 / 다음 버튼에는 개별 `aria-label`이 붙습니다(언어 팩의 `pagination.page` / `prev` /
  `next` 사용). 기호만 있는「‹」「›」는 `aria-hidden`으로 숨깁니다
- 페이지 번호 버튼과 앞뒤 버튼은 `role="button"`이며, 비활성 시 `aria-disabled`를 출력합니다
- 생략 기호는 순수 표시용 `aria-hidden` 요소로 읽기에 방해가 되지 않습니다

## 플랫폼 차이

- **view 자체 그리기 터치 인터랙션, 전 플랫폼 사용 가능**: Vue 3 버전의 `<nav>` / `<button>` /
  `<ul>` / `<span>`은 본 라이브러리에서 `<view>` / `<text>`로 교체됩니다(WXSS는 태그 선택자를
  금지하므로 클래스명으로 스타일을 적용합니다). 페이지 번호와 앞뒤 이동은 `@click`으로 트리거하며
  H5와 WeChat 미니프로그램에서 동일하게 동작합니다.
- **페이지 넘침 생략 로직은 core**: 창 축소 알고리즘(첫·마지막 페이지 상시 표시, 현재 페이지 양옆에
  1개씩 표시, 부족하면 가장자리로 흡착, 실제 간격이 생길 때만 생략 기호 출력)은 `@lh-ui/share`
  core의 순수 함수 `getPaginationRange`이며, 클램프 `clampPage`와 총 페이지 수 `getPageCount`
  역시 core에서 제공됩니다. 저장소는 반응형 글루만 작성합니다.
- **페이지 크기 변경은 내장 picker로 담당**: uni에는 `<select>`가 없으므로 `show-size-changer`는
  uni 내장 `<picker mode="selector">`로 담당하며, 옵션은 `page-sizes`입니다. change 이벤트의
  값은 `event.detail.value`(옵션 인덱스)에 담깁니다. H5에서는 uni의 선택기 패널이, 미니프로그램에서는
  네이티브 휠 선택기가 열립니다.
- **페이지 이동 입력의 제출 시점이 다름**: uni의 input에는 네이티브 change 이벤트가 없으므로 제출은
  엔터(confirm — H5 엔터와 미니프로그램 키보드의 "완료" 모두 트리거) 또는 포커스 아웃(blur) 시
  일괄 수행되며, 입력 이벤트의 값은 `event.detail.value`에서 읽습니다(lh-input-number와 같은
  선례). 네이티브 `min` / `max` 속성은 전달하지 않고 페이지 번호는 항상 core의 `clampPage`로
  클램프합니다. Vue 3 버전은 입력 후 비우고 포커스 아웃하면 1페이지로 돌아가지만, 본 라이브러리는
  이동하지 않도록 엄격화했습니다(빈 문자열과 잘못된 숫자는 이벤트를 트리거하지 않습니다).
- **비활성 외관은 클래스명 폴백**: share 스타일 소스의 비활성 스타일은 `&:disabled` 의사 클래스
  (button 요소만 매칭)에 작성되어 있지만 view에는 이 의사 클래스가 없으므로, 동일한 토큰
  (`--lh-disabled-text-color`)으로 `lh-pagination__btn--disabled` 클래스 규칙을 SFC 인라인에
  보완합니다(lh-segmented / lh-input-number와 같은 인라인 폴백 선례로, 정제 산출물에는
  포함되지 않습니다).
- **접근성 속성 개별 바인딩**: 페이지 버튼의 `aria-current` / `aria-label` 계약은 share의
  `getPaginationItemAria`가 결정하지만, 미니프로그램 템플릿 컴파일러는 `v-bind` 객체를
  지원하지 않으므로 글루 층에서 속성 묶음을 항목별 명시적 바인딩으로 펼칩니다.
- **이식 결론**: pagination은 측정 없음 / 팝업 없음 / document 의존 없음의 순수 전환 컴포넌트로,
  페이지 범위·클램프·접근성 속성은 모두 `@lh-ui/share` core 순수 함수에서 산출되며 저장소는
  반응형 글루만 작성합니다. API는 Vue 3 버전과 완전히 일치합니다(`total` / `pageSize` /
  `current` / `pageSizes` / `showTotal` / `showSizeChanger` / `showJumper` / `simple` /
  `disabled` / `sx`).
