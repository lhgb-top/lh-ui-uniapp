---
layout: home

hero:
  name: lh-ui uniapp
  text: uni-app 컴포넌트 라이브러리
  tagline: 하나의 코드로 H5 + WeChat 미니프로그램. 컴포넌트 로직과 스타일 소스는 Vue3 / Vue2 / React 버전과 같은 출처를 공유합니다
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/guide/installation
    - theme: alt
      text: 플랫폼 지원
      link: /ko/guide/platform

features:
  - title: 하나의 core로 여러 플랫폼 재사용
    details: 컴포넌트 로직(상태 머신, 검증, popper 계산, i18n)은 @lh-ui/share의 순수 함수이며, 본 라이브러리는 반응형 접착 코드만 작성합니다. Vue3 / Vue2 / React 버전과 동작이 일치합니다.
  - title: H5 + WeChat 미니프로그램
    details: 초판은 양단을 지원합니다. 미니프로그램의 스타일 제한(WXSS 화이트리스트, svg 없음, document 없음)은 빌드 시 정제 계층에서 일괄 처리되므로 사용자 측의 sass 의존성이 필요 없습니다.
  - title: easycom 필요할 때만 도입
    details: npm 설치 후 pages.json에 규칙 한 줄을 추가하면 템플릿에 태그를 바로 써서 사용할 수 있습니다. app.use로 전체 등록할 수도 있습니다.
  - title: 명령형 서비스 사용 가능
    details: Message / Loading은 마운트 지점 패턴을 채택하여 미니프로그램에서도 명령형 호출을 사용할 수 있습니다. 마운트하지 않은 경우 개발 중에 명확하게 경고하며, 조용히 폴백하지 않습니다.
---

::: tip 패밀리의 다른 단말과의 관계
본 라이브러리는 lh-ui 패밀리 Web 혈통의 uni-app 단말이며, `@lh-ui/vue3`(plus), `@lh-ui/vue2`, `@lh-ui/react`와
`@lh-ui/share`의 core 순수 함수 및 스타일 소스를 공유합니다. Props 명명은 Vue3 버전과 거의 동일하며, 플랫폼별 차이는
[Vue3 버전과의 API 차이](/ko/guide/differences)를 참조하십시오.
:::
