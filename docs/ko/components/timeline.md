# Timeline 타임라인

세로 방향 이벤트 흐름입니다. 시간 순서가 문서 순서이며, 타임스탬프, 의미 타입, 속이 빈 점, 좌우 교대 레이아웃을 지원합니다.

> 순수 표시 컴포넌트: 이벤트도 제어 상태도 없으며 H5와 WeChat 미니프로그램 양쪽에서 완전히 동일하게 동작합니다(끝의 "플랫폼 차이" 참고).

## 기본 사용법

`timestamp`로 타임스탬프 텍스트를 지정합니다; `type`으로 노드 점에 의미 색상(`'primary'` / `'success'` / `'warning'` / `'danger'`)을 부여합니다.

```vue
<template>
  <lh-timeline>
    <lh-timeline-item timestamp="2026-09-01">
      프로젝트 시작 리뷰
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-15"
      type="success"
    >
      1차 납품
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="2026-09-25"
      type="warning"
    >
      수검 진행 중
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## 좌우 교대

`mode="alternate"`는 컨테이너 중심축을 기준으로 항목을 인덱스 순으로 좌우 교대로 배치합니다(짝수 인덱스는 왼쪽, 홀수 인덱스는 오른쪽).

```vue
<template>
  <lh-timeline mode="alternate">
    <lh-timeline-item timestamp="Q1">
      기획
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      개발
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="danger"
    >
      부하 테스트
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q4"
      type="success"
    >
      출시
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## 속이 빈 점

`hollow`는 노드를 속이 빈 점으로 렌더링합니다. 미완료 상태에 자주 사용합니다.

```vue
<template>
  <lh-timeline>
    <lh-timeline-item
      timestamp="Q1"
      hollow
    >
      시작 전
    </lh-timeline-item>
    <lh-timeline-item timestamp="Q2">
      진행 중
    </lh-timeline-item>
    <lh-timeline-item
      timestamp="Q3"
      type="success"
    >
      완료
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## 타임스탬프와 점 커스터마이징

`timestamp`와 `dot` 모두 슬롯입니다: prop 대신 `#timestamp` 슬롯을 사용하면 임의의 내용을 넣을 수 있습니다; `#dot` 슬롯은 기본 점을 대체합니다(아이콘 등).

```vue
<template>
  <lh-timeline>
    <lh-timeline-item type="primary">
      <template #timestamp>
        2026년 9월
      </template>
      커스텀 타임스탬프 내용
    </lh-timeline-item>
    <lh-timeline-item type="success">
      <template #dot>
        <lh-icon
          name="check"
          :size="12"
        />
      </template>
      커스텀 점(lh-icon 아이콘)
    </lh-timeline-item>
  </lh-timeline>
</template>
```

## Timeline Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| mode | 레이아웃: `'left'` 한쪽 / `'alternate'` 좌우 교대 | `'left' \| 'alternate'` | `'left'` |
| customClass | 커스텀 클래스 이름 | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## TimelineItem Props

| Prop | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| timestamp | 타임스탬프 텍스트(`#timestamp` 슬롯도 가능) | `string` | — |
| type | 노드 의미 타입(점 테두리를 토큰 색상으로 칠함) | `'primary' \| 'success' \| 'warning' \| 'danger'` | — |
| hollow | 속이 빈 노드(미완료 상태에 자주 사용) | `boolean` | `false` |
| customClass | 커스텀 클래스 이름(항목 루트 노드로 전달) | `string` | — |
| sx | 빠른 레이아웃 속성 | `LhSxProps` | — |

## Slots

| Slot | 설명 |
| --- | --- |
| Timeline default | 항목 노드(`lh-timeline-item`) |
| TimelineItem default | 항목 본문 내용 |
| TimelineItem timestamp | 타임스탬프 내용 (prop도 슬롯도 없으면 해당 줄은 렌더링되지 않습니다) |
| TimelineItem dot | 커스텀 점(기본 점은 순수 장식이며 접근성 트리에 들어가지 않습니다) |

## 플랫폼 차이

- 타임라인은 **순수 표시 컴포넌트**입니다: 이벤트, 제어 상태, 측정 및 플랫폼 API 호출이 없으며 H5와 WeChat 미니프로그램 모두에서 완전히 사용 가능하고 동일하게 표시됩니다.
- 의미론적 `<ol>` / `<li>` 목록은 양쪽 플랫폼 모두 `<view>`로 구현합니다(WXSS는 태그 선택자를 금지하므로 클래스 이름으로 스타일을 적용), 목록 의미는 `role="list"` / `role="listitem"`로 유지됩니다; 미니프로그램 화면 낭독 지원은 플랫폼 능력에 따라 다릅니다.
- 연결선과 중심축은 모두 CSS 의사 요소(`::before`)이며 JS 측정에 의존하지 않습니다; `alternate`의 좌우 교대는 인덱스 홀수/짝수와 flex 방향으로 구현되어 양쪽이 동일합니다.
- **WXSS 정화**: share 스타일 소스의 `.lh-timeline__item:not(.lh-timeline__item--last)`는 빌드 시 `:not()` 수식자를 제거합니다(WXSS는 `:not()`을 지원하지 않음). 마지막이 아닌 항목의 연결선 표시 여부는 특이도가 그보다 낮지 않은 `.lh-timeline__item--last::before` 규칙이 맡으며, 양쪽 플랫폼의 렌더링 결과는 변하지 않습니다.
- 접근성: 노드 점은 순수 장식(`aria-hidden="true"`)이며 커스텀 점 슬롯도 접근성 트리에 들어가지 않습니다. Vue3 버전과 동일합니다.
- **이식 결정(Vue3 버전에 정렬, 정의되지 않은 API 도입 없음)**: 이식 시점에 plus 참조 소스와 `@lh-ui/share` core에 `placement`(타임스탬프 위치), `center`(중앙 레이아웃) API가 아직 없었으므로 이 라이브러리에서도 제공하지 않습니다; `mode`는 현재 `'left'` / `'alternate'` 두 가지만 제공합니다. 참조 소스에 추가되면 따라서 업그레이드합니다.
