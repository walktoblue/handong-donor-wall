# 한동대학교 온라인 도너월

한동대 후원자가 이름을 검색하면 갈대상자 컨셉의 감사 메시지를 받는 기부자 감사 웹앱. Orange Build로 만든 입문자 MVP다.

## 스택
Next.js (App Router, TypeScript) · Tailwind CSS v4 · shadcn/ui · Supabase · Vercel

## 규칙
- 화면·디자인은 `PLAN.md`를 따른다 — 특히 `## 디자인` 토큰과 각 화면의 `상태:` 명세.
- UI는 `components/ui/`의 shadcn/ui 컴포넌트를 우선 쓴다. 색·모서리는 `app/globals.css`의 CSS 변수를 따른다.
- `app/globals.css`의 `@import` 줄은 건드리지 않는다 (Tailwind v4 파서가 깨진다). 폰트는 `app/layout.tsx`에 Noto Serif (헤딩) + Noto Sans KR (본문)으로 설정돼 있다 — 그대로 쓴다.
- URL 경로·slug·DB 키는 ASCII만 쓴다. 한글은 화면 표시용으로만.
- Supabase는 `lib/supabase.ts`의 클라이언트로 읽고 쓴다.
- `PLAN.md`에 없는 화면·기능을 임의로 더하지 않는다.
- 디자인 참고: `design/_1` ~ `design/_6` (각 화면별 Stitch HTML), `design/covenant_heritage/DESIGN.md` (디자인 시스템).
