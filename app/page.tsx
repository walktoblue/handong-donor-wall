export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
        한동대학교 온라인 도너월
      </h1>
      <p className="text-muted-foreground">
        한동대 후원자가 이름을 검색하면 갈대상자 컨셉의 감사 메시지를 받는 기부자 감사 웹앱
      </p>
      <p className="text-sm text-muted-foreground">곧 만나요</p>
    </main>
  );
}
