# WeChat 미니프로그램 수동 회귀 체크리스트

> 사용자(또는 유지보수자)가 WeChat 개발자 도구에서 점검용으로 사용합니다. 빌드 스모크는 WXSS가 유효하고 컴파일이
> 통과하는지만 보장합니다; **동작의 올바름은 반드시 수동 회귀해야 합니다** — vitest는 H5 시맨틱을 실행하며, MP 측의
> 이벤트와 렌더링 차이는 테스트할 수 없습니다.
>
> 빌드: `pnpm dev:mp-weixin`(또는 `pnpm build:mp-weixin`), 산출물은 `dist/dev/mp-weixin`
> (또는 `dist/build/mp-weixin`)이며, WeChat 개발자 도구로 해당 디렉터리를 엽니다.
>
> 전제: WeChat 기본 라이브러리 **≥ 2.25.2**(root-portal 의존; 낮은 버전은 페이지 내 fixed 폴백 브랜치로 이동하며,
> 폴백 경로를 전문적으로 검증하려면 기본 라이브러리를 2.25.2 미만으로 조정한 후 "레이어 계열" 세 항목을 다시 실행).

## 공통 기준(모든 페이지에서 점검)

| # | 항목 | 통과 기준 |
| --- | --- | --- |
| G1 | 열기 | 페이지 렌더링이 하얗게 뜨지 않고, "컴포넌트가 등록되지 않음"을 보고하지 않음 |
| G2 | 다크 | 입구에서 다크로 전환 시 페이지 내 컴포넌트 색상이 모두 따라감(배경만 바뀌는 것이 아님) |
| G3 | 중 / 영 | 입구에서 언어 전환 시 컴포넌트 내 문구(예: form 검증 메시지, 버튼 문구)가 전환을 따라감 |
| G4 | 콘솔 | 전체 과정에 `console.error` 없음(message/loading의 "마운트 지점 없음" 경고가 나타나지 않아야 함에 특히 주의) |

## 컴포넌트 점검표

| 페이지 경로 | 컴포넌트 | 주요 상호작용(공통 기준 외) |
| --- | --- | --- |
| `pages/button/button` | button | 클릭 시 반동 상태; loading / disabled / plain / round / circle / block 모두 렌더링; 아이콘 버튼의 iconfont가 정상적으로 출력 |
| `pages/icon/icon` | icon | 37개 아이콘 모두 출력(빈 사각형이 아님); size / color 적용; loading 아이콘 회전 |
| `pages/tag/tag` | tag | 각 type 색상 올바름; round / hit 전환; closable 클릭 시 닫히고 콜백 도달 |
| `pages/input/input` | input | v-model 양방향; 플레이스홀더 스타일이 `placeholder-style`으로 적용(**`::placeholder`는 점검하지 않음**); textarea 높이 자동 조절; 글자 수 카운트; clearable 비움; error 상태 테두리 빨간색 |
| `pages/switch/switch` | switch | 클릭 전환 시 슬라이더 애니메이션; loading / disabled는 클릭에 반응하지 않음; activeText / inactiveText 표시 |
| `pages/checkbox/checkbox` | checkbox / checkbox-group | 단일 클릭으로 체크; group 내 다중 선택이 서로 영향 주지 않음; disabled 항목 반응 없음; indeterminate 중간 상태 |
| `pages/radio/radio` | radio / radio-group | 옵션 배타적(다른 항목 클릭 시 이전 항목 해제); disabled 항목 반응 없음 |
| `pages/form/form` | form / form-item | blur / input이 검증 트리거; 오류 문구가 `<text>`에 정상 표시; `validate()`가 반환하는 Promise가 "제출" 버튼에서 올바르게 resolve; 필수 별표 표시 |
| `pages/select/select` | select | 클릭 시 listbox 팝업(**root-portal, 층위가 오버레이 위**); 옵션 클릭으로 선택 후 닫힘; clearable 비움; filterable 레이어 내 입력 상자 사용 가능; **키보드 탐색 없음은 정상**(MP에서 제거) |
| `pages/tooltip/tooltip` | tooltip | trigger 클릭 시 말풍선 팝업; 위치와 placement 일치(2프레임 측정 후 위치 지정, **첫 프레임에 깜빡임이나 어긋남이 없어야 함**); 외부 클릭으로 닫힘; trigger="hover"가 MP에서 작동하지 않는 것은 정상으로 간주 |
| `pages/dialog/dialog` | dialog | 열면 오버레이와 전환 효과; 오버레이 클릭 시 `closeOnClick-modal`에 따라 닫힘; bottom 위치가 풀스크린 기기에서 `safe-area-inset-bottom` 적용; **Esc와 lockScroll이 MP에서 작동하지 않는 것은 정상**; 전체 화면 모드 꽉 채움 |
| `pages/services/services` | message / loading | 아래 절 참조 |

## message / loading 전용

| # | 항목 | 통과 기준 |
| --- | --- | --- |
| S1 | 각 유형 메시지 | success / info / warning / danger / loading 5가지 유형 팝업, 아이콘과 색상 올바름 |
| S2 | 자동 닫힘 | 기본 3초 후 사라지며, 사라질 때 전환 애니메이션(**순간적으로 사라지는 것이 아님**) |
| S3 | 수동 닫힘 | loading 유형은 자동으로 닫히지 않으며, `handle.close()` 후에야 사라짐 |
| S4 | 여러 개 누적 | 연속으로 여러 개 호출 시 세로로 누적되어 겹치지 않음; max 개수를 초과하면 오래된 것이 밀려남 |
| S5 | 전체 화면 오버레이 | loading.show 시 전체 화면 오버레이 나타나며, 오버레이 기간 동안 하위 레이어 클릭 불가 |
| S6 | 닫힘 콜백 | onClose 콜백이 메시지가 사라질 때 트리거 |
| S7 | 마운트되지 않음 경고 | (전문 검증: 페이지에서 `<lh-message />`를 지우고 다시 호출) 콘솔에 `console.error`로 명확히 경고, **조용히 넘어가지 않음** |

## 알려진 MP 측 "비결함"(발견해도 버그로 신고하지 마십시오)

- select / dialog / tooltip은 **키보드 탐색 / Esc / focus-trap / lockScroll 없음** — 컴파일 시 제거,
  [플랫폼 지원](/ko/guide/platform) 참조.
- tooltip의 `trigger="hover"`는 MP 측에서 트리거되지 않음 — hover 시맨틱이 없으니 click 사용.
- message / loading은 반드시 먼저 마운트 지점을 배치해야 하며, 이것은 설계이지 버그가 아닙니다.
- icon은 폰트 렌더링이며, CSS에서 `fill` / `stroke`는 작동하지 않고 `color`만 사용 가능.

## 회귀 결과 기록

표 오른쪽에 "통과 / 실패(현상)" 열을 추가하고, 실패 항목은 먼저 개발자 도구의 Console과 WXML 패널 스크린샷을 첨부한 뒤,
`docs/uniapp/uniapp组件库计划.md`의 플랫폼 기능 매트릭스와 대조하여 "예상된 폴백"인지 실제 결함인지 판정합니다.
