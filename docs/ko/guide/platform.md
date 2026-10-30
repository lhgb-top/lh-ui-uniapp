# 플랫폼 지원

## 초판 플랫폼 범위

| 플랫폼 | 상태 | 설명 |
| --- | --- | --- |
| **H5** | ✅ 완전 | 모든 컴포넌트가 완전한 기능 |
| **WeChat 미니프로그램** | ✅ 완전(일부 폴백) | 레이어 계열 컴포넌트의 데스크톱급 기능이 폴백됩니다. 아래 표를 참조 |
| Alipay / Douyin 미니프로그램 | 🚫 초판 미지원 | 추후 조건부 컴파일로 단말별 검증 후 열 추가 |
| App(nvue) | 🚫 안 함 | nvue 렌더링 체계가 webview와 달라 로드맵에 없음 |

## 컴포넌트별 기능 매트릭스

"폴백"이란 **플랫폼이 지원하지 않는 기능이 컴파일 시 게이트에 의해 직접 제거되는 것**(미니프로그램 패키지에 죽은 코드가
없음)을 의미하며, 런타임 실패가 아닙니다.

| 컴포넌트 | H5 | WeChat 미니프로그램 | 폴백 전략 / 설명 |
| --- | --- | --- | --- |
| config-provider | 완전 | 완전 | provide/inject + 인라인 CSS 변수는 모든 플랫폼에서 사용 가능; 다크는 `page.dark` 클래스 전환(document 없음) |
| button / tag | 완전 | 완전 | — |
| icon | 완전 | 완전 | iconfont 폰트 방식(web 버전은 인라인 SVG, 아래 "icon 렌더링 차이" 참조) |
| input | 완전 | 완전 | 플레이스홀더 스타일은 `placeholder-style` prop 사용(MP는 `::placeholder` 미지원) |
| checkbox / radio / switch | 완전 | 완전 | **view 자체 그리기**(네이티브 컴포넌트를 사용하지 않고 lh 시각 언어 통일) |
| form / form-item | 완전 | 완전 | 검증 로직은 core 순수 함수, 플랫폼 의존성 없음 |
| select | 완전 | 폴백 | root-portal + 2프레임 측정 배치; **키보드 탐색은 H5 전용**, MP는 클릭 + scroll-view |
| dialog | 완전 | 폴백 | root-portal; **focus-trap / lockScroll은 H5 전용**, MP는 오버레이 가로채기로 폴백 |
| tooltip | 완전 | 폴백 | 2프레임 측정 배치; **hover 없음**, MP 단말에서는 클릭 / 터치로 트리거 |
| message / loading | 완전 | 완전 | 마운트 지점 패턴(미니프로그램에는 document가 없어 JS로 DOM을 생성할 수 없음) |

## WeChat 미니프로그램의 구체적인 제한과 대안

| 제한 | 대안 |
| --- | --- |
| `<svg>` 태그 미지원 | 아이콘을 컴파일 시 iconfont 폰트로 변환(base64 인라인), `<text class="lh-iconfont">`로 렌더링 |
| `::placeholder` 미지원 | input의 `placeholder-style` / `placeholder-class` prop |
| `*` 와일드카드 / 속성 선택자 / `:not()` / `:nth-*` 미지원 | 빌드 시 정제: `*` 와일드카드는 flex + gap으로 매핑, 나머지는 동등한 클래스명으로 교체 |
| `document` / `document.body` 없음 | 레이어는 `root-portal` 사용; 명령형 서비스는 마운트 지점 패턴 사용 |
| 키보드 포커스 시맨틱 없음 | focus-trap / 키보드 탐색은 `LH_IS_H5` 게이트가 호출하지 않음; aria 속성은 화면 판독기를 위해 계속 출력 |
| `transitionend` 신뢰 불가 | 등장 / 퇴장 애니메이션은 CSS transition + setTimeout으로 시간 정렬 |
| `onLoad` 단계에서 컴포넌트 생성 미완료 | 모든 ref / 측정 호출은 `onReady` 이후에 해야 함 |

## WeChat 기본 라이브러리 버전

- **root-portal은 기본 라이브러리 ≥ 2.25.2가 필요**(select / dialog / tooltip의 레이어 마운트가 의존).
- 낮은 버전에서는 자동으로 **페이지 내 fixed 위치**로 폴백(`getLhLibVersion()` 판정), 레이어는 계속 존재하지만 층위가
  페이지 흐름의 제약을 받게 됩니다.

## root-portal과 DingTalk 등 단말

`lh-root-portal` 내부는 조건부 컴파일로 세 갈래로 나뉩니다: H5는 `<teleport to="body">`, WeChat는 `<root-portal>`,
DingTalk 등 root-portal을 지원하지 않는 단말은 페이지 내 fixed로 갑니다. **내부 컴포넌트이므로 사용자가 신경 쓸 필요가
없습니다**. 여기에 나열한 것은 레이어 동작의 플랫폼 차이 출처를 설명하기 위함입니다.
