# 한동대학교 온라인 도너월 — 만들기 기록

## 기획 (2026-06-20)

**무엇을 / 누구를 위해**
한동대학교 온라인 도너월. 한동대 후원팀이 운영하고, 기존·신규 기부자가 방문해 자신의 이름을 검색하면 개인화된 감사 화면을 보는 웹앱이다. 이름을 치는 단순한 행동 하나로 "내 후원이 실제로 기여했다"는 것을 시각적으로 체감하는 것이 핵심이다.

**왜 이렇게 정했나 — 현재 방식의 고통점**
지금은 이메일/우편 감사 레터와 홈페이지 이름 나열 수준으로 감사를 표하고 있었다. 후원자들이 온라인으로만 기부에 참여하다 보니, 자신의 후원금이 어디에 쓰였는지 체감하기 어렵다는 피드백이 있었다. 특히 "온라인으로 기부 → 아무런 시각적 피드백 없이 끝"이라는 경험 공백이 문제였다. 이 웹앱은 그 공백을 메운다.

**갈대상자 컨셉 선택 이유**
한동대학교가 출애굽기 2:3(나일강가에 띄워진 모세를 갈대상자가 보호했다는 말씀)에서 따온 "기독인재를 길러내는 갈대상자"라는 정체성을 갖고 있다. 이 컨셉을 그대로 시각화해서 — 후원자 이름이 갈대상자 이미지 위에 각인되는 형태 — 기부의 의미를 성경적 맥락에서 전달하기로 했다. 단순한 "감사합니다" 메시지보다 훨씬 강한 의미 부여가 가능하다.

**티어 구분 결정**
기부 금액 1천만 원을 기준으로 두 가지 감사 방식을 나눴다:
- 소형(< 1천만): 갈대상자 이미지 위에 이름 합성 → 개인화 이미지 다운로드
- 대형(≥ 1천만): 후원자 사진 + 기부 스토리가 화면에 전시 → 더 깊은 스토리텔링

이 기준은 후원팀이 운영 경험상 "1천만 원 이상은 개인적으로 관계를 관리하는 VIP급"이라고 판단해서 나온 것이다. 기술적으로는 같은 `/donor/[name]` URL에서 금액 기준으로 조건부 렌더링한다.

**데이터 관리 방식**
CSV 업로드보다 관리자 페이지 직접 입력을 선택했다. 이유: 대형 후원자는 사진과 긴 스토리 텍스트가 필요한데, 엑셀/CSV로는 사진을 다루기 어렵다. 관리자 로그인 → 기부자 목록 → 등록/수정 폼의 단순한 CRUD 흐름으로 결정했다.

**AI API 불필요 결정**
처음에는 AI 이미지 생성을 고려했지만, 갈대상자 이미지는 미리 디자인된 템플릿 위에 Canvas API로 이름 텍스트를 합성하는 방식으로 구현 가능하다. AI API를 쓰면 호출당 비용이 발생하고 응답 속도도 느려진다. 템플릿 합성 방식이 더 빠르고 비용 없고, 결과 품질도 일관적이다.

**고민하다 버린 선택지**
- CSV 업로드: 사진 처리 불가로 탈락
- AI 이미지 생성: 비용·속도 문제로 탈락, Canvas 합성으로 대체
- SNS 공유 버튼: MVP 범위 초과, 다음 버전으로 미룸
- 기부 금액 더 세분화(5천만/1억 등 티어): 복잡도 증가, 다음 버전으로 미룸

**첫 번째 독자**
한동대 후원팀 내부 직원들이 먼저 본다. 공개 배포 전에 내부 검토용으로 먼저 쓰는 것이 목표다.

## 연결 (2026-06-20)

**스택·배포 연결 순서**
1. Next.js 스캐폴드 생성 (create-next-app@latest, TypeScript·Tailwind·App Router)
2. shadcn/ui 설치 (`npx shadcn@latest init --defaults` + button·card·input·label·select·textarea·table·badge)
3. 폰트: Noto Serif (헤딩) + Noto Sans KR (본문) — `app/layout.tsx`에 설정
4. 디자인 토큰: Stitch "Covenant Heritage" 테마(딥 네이비 #004374 + 골드 #C6A96F + 크림 배경 #fbf9f8)를 `app/globals.css` CSS 변수에 반영
5. GitHub 레포 생성: `gh repo create handong-donor-wall --public --push`
6. Vercel 연결: `vercel link` → `vercel git connect` (자동배포 준비)
7. Supabase 프로비저닝: `vercel integration add supabase` → `.env.local` 자동 생성
8. Supabase CLI link: `supabase link --project-ref zbxnadgqarloklefhrph`

**막힌 설정과 해결**
- **Vercel GitHub 연결 오류**: `vercel link` 실행 시 "You need to add a Login Connection" 에러. Vercel 계정이 이메일로만 만들어져 GitHub 로그인 연결이 없었던 것. `vercel.com/account/login-connections`에서 GitHub 연결로 해결.
- **Vercel GitHub App 미설치**: `vercel git connect`에서 "Make sure you have access" 에러. GitHub에 Vercel 앱이 설치되지 않아 발생. `github.com/apps/vercel`에서 `walktoblue` 계정에 앱 설치 후 해결.
- **Supabase 이용약관 미동의**: `vercel integration add supabase` 첫 실행 시 `action_required: integration_terms_acceptance_required`. Vercel에서 제공한 링크에서 동의 후 재실행으로 해결.
- **Supabase CLI 비대화형 로그인 불가**: `supabase login`이 TTY 없는 환경에서 실패. `supabase.com/dashboard/account/tokens`에서 개인 액세스 토큰 발급 후 `SUPABASE_ACCESS_TOKEN` 환경변수로 우회.
- **Scoop 없음**: Supabase CLI 설치를 위해 Scoop 패키지 매니저를 먼저 설치해야 했다. PowerShell에서 `irm get.scoop.sh | iex`로 설치 후 `scoop install supabase`로 진행.

**배포 현황**
- GitHub: https://github.com/walktoblue/handong-donor-wall
- Supabase 프로젝트 ref: `zbxnadgqarloklefhrph`
- 라이브: 배포 전 (구현 완료 후 자동 배포됨)
