# Notification

전역 알림 서비스입니다. 뷰포트 네 모서리에 제목과 본문이 있는 카드를 표시하며, 사용자의 주의가 필요한 결과 피드백에 자주 사용됩니다. Message / Loading 과 마찬가지로 **마운트 포인트 방식**을 사용합니다——미니프로그램은 JS로 DOM을 만들 수 없으므로 페이지에 먼저 마운트 포인트 컴포넌트를 두어야 합니다.

## 마운트 포인트 배치

알림이 필요한 페이지(또는 상시 존재하는 루트 래퍼 컴포넌트)에 한 번 배치합니다:

```vue
<template>
  <lh-config-provider>
    <view><!-- 페이지 내용 --></view>
    <lh-notification />
  </lh-config-provider>
</template>
```

::: danger 마운트 포인트가 없으면 경고
`useLhNotification()`을 호출했는데 페이지에 `<lh-notification />`이 없으면 개발 중에 `console.error`로 명확히 경고하며, **조용히 저하되지 않습니다**. Message와 동일: 조용한 저하는 "호출은 성공한 것 같지만 아무 일도 일어나지 않는" 숨은 버그로 이어집니다.
:::

## 호출

```ts
import { useLhNotification } from '@lh-ui/uniapp'

const notification = useLhNotification()

notification.success({ title: '성공 알림', content: '문서가 클라우드에 저장되었습니다' })
notification.info({ title: '정보 알림' })
notification.warning({ title: '경고 알림' })
notification.danger({ title: '위험 알림' })

// 네 모서리 각각 독립적으로 표시
notification.info({ title: '왼쪽 위', position: 'top-left' })

// 자동으로 닫지 않음, 수동으로 종료
const handle = notification.warning({ title: '상시 경고', duration: 0 })
handle.close()

// 모두 닫기
notification.closeAll()
```

## 메서드

| 메서드 | 설명 | 매개변수 |
| --- | --- | --- |
| (직접 호출) | `notification(options)` 으로 알림을 엽니다 | `(options: LhNotificationOptions)` |
| success / info / warning / danger | 해당하는 의미 유형의 알림을 엽니다 | `(options: LhNotificationOptions)` |
| close | 지정한 id의 알림을 닫습니다 | `(id: number)` |
| closeAll | 모두 닫습니다 | — |
| config | 전역 기본 설정을 변경합니다 | `(config: LhNotificationConfig)` |

## LhNotificationOptions

| 속성 | 설명 | 타입 | 기본값 |
| --- | --- | --- | --- |
| title | 제목(필수) | `string` | — |
| content | 본문 내용 | `string` | — |
| type | 의미 유형 | `'success' \| 'info' \| 'warning' \| 'danger' \| 'error'` | `'info'` |
| duration | 자동 닫힘까지의 밀리초, 0이면 자동 닫힘 없음 | `number` | `4500` |
| position | 표시 위치 | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| showClose | 닫기 버튼 표시 | `boolean` | `true` |
| sx | sx 빠른 레이아웃 속성 | `LhSxProps` | — |
| onClick | 카드 클릭 콜백(전달하면 카드가 button 의미로 렌더링됨) | `() => void` | — |
| onClose | 닫힌(자동 및 수동 포함) 후 콜백 | `() => void` | — |

::: tip error 타입
`error`는 `danger`의 별칭 의미입니다(share core의 `LhNotificationType`에 포함). 서비스 메서드는 plus와 동일하게 success / info / warning / danger만 노출합니다. error가 필요하면 `notification({ title: '...', type: 'error' })`을 직접 호출하세요.
:::

## 전역 설정

```ts
const notification = useLhNotification()
notification.config({ duration: 3000, offset: 24 })
```

| 설정 | 설명 | 기본값 |
| --- | --- | --- |
| duration | 기본 자동 닫힘 밀리초, 0이면 자동 닫힘 없음 | `4500` |
| offset | 뷰포트 가장자리로부터의 오프셋(px) | `20` |

## 동작 설명

- **네 모서리 독립 컨테이너**: 레코드는 `position`별로 그룹화되어 렌더링되며, 같은 모서리 안에서는 시간 순으로 쌓입니다(아래 두 모서리는 `column-reverse`로 새 알림이 아래 가장자리에 붙습니다). 쌓임 간격은 스타일 소스의 `--lh-notification-gap`(기본 16px)으로 제어합니다.
- **자동 닫힘**: `duration` 밀리초 후 자동으로 제거되며 `onClose`가 발생합니다. `duration: 0`은 상시 표시를 의미합니다.
- **카드 클릭**: 닫지 않습니다(plus와 동일) `onClick`만 발생시킵니다. 닫기는 닫기 버튼이나 자동 타이머로만 이루어집니다.
- **접근성**: 네 모서리 컨테이너는 `role="region"` + `aria-live="polite"`. `onClick`을 전달한 카드는 `role="button"`으로 렌더링됩니다. 닫기 버튼에는 언어 팩 `notification.close`의 접근 가능한 이름이 붙습니다(share 언어 팩에 수록됨, 언어 전환 시 자동 갱신).

## 플랫폼 차이(Vue3 버전과의 차이)

- **마운트 포인트 방식**: plus는 `createApp`으로 host를 `document.body`에 마운트하지만, 미니프로그램에는 `document`가 없습니다. "모듈 수준 싱글턴 store + 페이지에 `<lh-notification />` 마운트 포인트 컴포넌트" 방식으로 변경하고, API는 `useLhNotification()`으로 노출합니다(plus는 `LhNotification` 직접 호출 + install 등록).
- **`appendTo` 없음**: 웹 버전은 마운트 컨테이너를 선택할 수 있지만, 미니프로그램에는 그 개념이 없으며 표시 위치는 마운트 포인트 컴포넌트가 렌더링하는 네 모서리의 fixed 컨테이너가 결정합니다.
- **표시 전환 애니메이션 축소**: plus는 `TransitionGroup`으로 슬라이드 인 / FLIP을 처리하지만, 미니프로그램에서는 `transitionend`가 신뢰할 수 없어 첫 버전은 노드 추가·제거만 하고 애니메이션하지 않습니다(스타일 소스의 전환 클래스명은 유지되며, H5에서 자체 Transition으로 감싸면 재사용할 수 있습니다).
- **클릭 가능 카드의 키보드 의미 미이식**: plus는 `onClick`을 전달한 카드에 `tabindex`와 Enter / Space 트리거를 추가하지만, 미니프로그램에는 DOM 포커스 모델이 없어 클릭과 `role="button"` 의미만 남깁니다.
