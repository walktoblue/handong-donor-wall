"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    router.push(`/donor?name=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(160deg, #fbf9f8 0%, #eef3f8 50%, #fbf9f8 100%)",
      }}
    >
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-primary font-semibold text-sm tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>
            한동대학교 발전기금
          </span>
          <a
            href="https://sarang.handong.edu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            후원하기 →
          </a>
        </div>
      </header>

      {/* 메인 히어로 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* 뱃지 */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase">
          Honor Roll · 명예의 전당
        </div>

        {/* 타이틀 */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-primary tracking-tight mb-6 max-w-2xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          한동대학교<br className="sm:hidden" /> 온라인 도너월
        </h1>

        {/* 서브타이틀 */}
        <p className="text-center text-muted-foreground mb-4 max-w-md leading-relaxed">
          사랑과 정성으로 세워가는 갈대상자,
        </p>
        <p className="text-center text-primary/80 font-medium mb-14 max-w-md leading-relaxed">
          당신의 헌신이 한동의 미래를 만듭니다.
        </p>

        {/* 검색 */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl bg-white rounded-xl shadow-[0_20px_50px_rgba(0,67,116,0.1)] border border-border/50 flex items-center gap-2 p-2 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all"
        >
          <div className="flex-1 flex items-center gap-3 pl-4">
            <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              type="text"
              placeholder="성함 또는 법인명을 입력해 주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 bg-transparent px-0 text-base placeholder:text-muted-foreground/60"
            />
          </div>
          <Button type="submit" className="px-8 py-5 text-sm whitespace-nowrap" disabled={!name.trim()}>
            검색하기
          </Button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground text-center">
          후원 기록이 있으시면 성함을 입력하시면 감사 메시지를 확인하실 수 있습니다.
        </p>

        {/* 하단 카드 */}
        <div className="mt-20 max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center mb-5 text-xl">
              🌾
            </div>
            <h3 className="font-semibold text-primary mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              갈대상자의 의미
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              출애굽기 2장 3절처럼, 한동대학교는 믿음으로 미래를 지키는 갈대상자가 되고자 합니다.
              후원자분들의 사랑이 한동의 인재를 세웁니다.
            </p>
          </div>

          <div className="bg-primary text-white rounded-xl p-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">
                함께한 후원자
              </div>
              <h3 className="font-semibold text-xl mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                모든 후원자께 감사드립니다
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                소중한 후원이 한동의 학생들에게 꿈과 기회를 만들어 주고 있습니다.
              </p>
            </div>
            <div className="absolute -right-6 -bottom-6 text-[100px] opacity-5 select-none">🎓</div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2024 한동대학교 발전기금팀. All rights reserved.</p>
          <div className="flex gap-4">
            <span>경북 포항시 북구 흥해읍 한동로 558</span>
            <span>054-260-1064</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
