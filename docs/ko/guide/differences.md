# Vue3 버전과의 API 차이

본 라이브러리는 `@lh-ui/vue3`(plus)와 `@lh-ui/share`의 core 순수 함수를 공유하며, **Props 명명과 이벤트 명명은 거의
일치**합니다. 다음은 uni-app 타깃 플랫폼에서 비롯된 불가피한 차이입니다. 여기에 나열되지 않은 API는 Vue3 버전과 동일하게
동작합니다.

## icon: 인라인 SVG가 아닌 폰트 렌더링

| | Vue3 버전(plus) | 본 라이브러리 |
| --- | --- | --- |
| 렌더링 방식 | 인라인 `<svg><path>` | `<text class="lh-iconfont lh-iconfont--<name>">` |
| 색상 | `currentColor`(부모 color 상속) | 명시적인 `color` prop / 부모 color(CSS 폰트 색상, 의미상 동등) |
| 크기 | `size` prop | `size` prop(font-size 설정) |

미니프로그램은 `<svg>` 태그를 지원하지 않아, 아이콘은 빌드 시 share의 SVG path 집합에서 iconfont 폰트로 변환됩니다
(base64가 `iconfont.css`에 인라인, 37개 아이콘, 24×24 단색). 시각적으로는 같은 글리프지만 본질은 폰트이므로 CSS에서
`fill` / `stroke`를 **사용할 수 없고** `color`만 사용할 수 있습니다.

## input: 플레이스홀더 스타일은 prop으로

MP는 `::placeholder` 의사 요소를 지원하지 않습니다. 플레이스홀더 스타일은 prop으로 지정하십시오:

```vue
<lh-input placeholder="입력하세요" placeholder-style="color: #999" />
```

| prop | 설명 |
| --- | --- |
| `placeholder-style` | 플레이스홀더 텍스트의 인라인 스타일 문자열 |
| `placeholder-class` | 플레이스홀더 텍스트의 클래스명(style과 둘 중 하나 선택) |

나머지 API(`v-model`, `maxlength`, 글자 수 카운트 `show-word-limit`, `type`)는 Vue3 버전과 동일합니다.

## select / dialog / tooltip: 데스크톱급 기능은 H5 전용

| 기능 | H5 | WeChat 미니프로그램 |
| --- | --- | --- |
| 키보드 탐색(방향키 / Enter / Esc) | ✅ | ❌ 컴파일 시 제거 |
| focus-trap(대화상자 포커스 순환) | ✅ | ❌ 컴파일 시 호출하지 않음 |
| lockScroll(배경 스크롤 잠금) | ✅ | ❌(오버레이 가로채기로 폴백) |
| hover 트리거(tooltip) | ✅ | ❌, click / touchstart로 변경 |

**tooltip의 `trigger`**: 여전히 `'click' | 'hover'`를 지원하지만, 미니프로그램에서는 `hover`가 의미가 없습니다 —
미니프로그램 측에서는 `trigger="click"`(또는 기본값)을 사용하여 클릭 / 터치로 트리거하십시오.

**select의 이벤트**는 변경되지 않고(`update:modelValue` / `change` / `visible-change`),
"비우기"와 "선택"은 MP 측에서 listbox 항목을 클릭하는 방법뿐이며, 키보드 경로는 없습니다.

## message / loading: 마운트 지점 패턴

**가장 큰 사용 방식 차이**입니다. Vue3 버전은 `createApp + document.body에 마운트`로 호출 즉시 표시되지만,
미니프로그램에는 document가 없어 **먼저 마운트 지점 컴포넌트를 배치해야 합니다**:

```vue
<!-- 페이지에 한 번 배치 -->
<lh-message />
<lh-loading />
```

```ts
const { success, closeAll } = useLhMessage()
const loading = useLhLoading()

loading.show({ text: '로딩 중...' })
// ...
loading.close()
```

자세한 내용은 [설치 - 명령형 서비스는 마운트 지점이 필요합니다](/ko/guide/installation#명령형-서비스는-마운트-지점이-필요합니다)를
참조하십시오.

::: tip Notification 컴포넌트는 초판에 없음
Vue3 버전에는 `lh-notification`이 있지만, 본 라이브러리 초판에서는 **만들지 않습니다**(미니프로그램 측 가치가 낮고,
알림은 일반적으로 시스템 기능을 사용). 알림류 팁이 필요할 때 `lh-message`로 대체하십시오.
:::

## config-provider: 다크는 document가 아닌 클래스명으로

| | Vue3 버전 | 본 라이브러리 |
| --- | --- | --- |
| 다크 전환 | `document.documentElement`에 class 추가 | 감싸는 노드에 `dark` 클래스 추가(미니프로그램에는 document 없음) |
| `theme` prop | `'light' \| 'dark'` | 동일(내부 구현은 다름) |

사용법은 동일하며, 모두 `<lh-config-provider :theme="dark">`입니다. 본 라이브러리의 `theme/index.css`에서
다크 변수는 `page.dark, .dark`에 걸려 있어, 다크 스코프는 ConfigProvider의 감싸는 노드를 따릅니다.

## 단위: px 그대로 출력

본 라이브러리는 **px→rpx 변환을 하지 않으며**, 스타일 소스는 px 기준 그대로 출력합니다 — wot-design-uni /
uview-plus / uni-ui / TDesign 등 주요 uni 컴포넌트 라이브러리와 동일합니다(uni 공식 컴파일 시에도 px→rpx를 자동
변환하지 않습니다). 프로젝트에 `postcss-px-to-rpx` 같은 플러그인을 설정한 경우, 본 라이브러리의 산출물도 함께 변환되므로
특별한 처리가 필요 없습니다.

## 컴포넌트 SFC에 포함된 미니프로그램 옵션

각 컴포넌트의 SFC는 다음을 선언합니다:

```ts
defineOptions({
  name: 'LhXxx',
  options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' },
})
```

- `virtualHost: true` —— 컴포넌트가 불필요한 감싸는 노드를 만들지 않아, custom-class / customStyle이 대상 요소에
  도달합니다.
- `addGlobalClass: true` —— 컴포넌트 내에서 전역 스타일(`app.wxss` / 페이지 스타일)을 사용할 수 있습니다.
- `styleIsolation: 'shared'` —— 스타일 격리가 공유 모드여서 컴포넌트 스타일과 페이지 스타일이 서로 보입니다.

**사용자는 pages.json이나 프로젝트에서 이 세 가지를 추가로 설정할 필요가 없습니다** —— 이미 컴포넌트 자체의 json에
선언되어 있습니다. 컴포넌트 스타일이 이상할 때(클래스명은 모두 있는데 스타일이 적용되지 않을 때)는 프로젝트의
`styleIsolation` 재정의 설정이 컴포넌트 수준 선언을 덮어쓰고 있는지 먼저 확인하십시오.
