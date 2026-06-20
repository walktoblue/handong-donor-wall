"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button, buttonVariants } from "@/components/ui/button"

type Donor = {
  id: string
  name: string
  donation_amount: number
  photo_url: string | null
  story: string | null
  is_active: boolean
}

export default function DonorPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const name = searchParams.get("name") || ""

  const [donor, setDonor] = useState<Donor | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!name) {
      router.replace("/")
      return
    }
    async function fetchDonor() {
      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .eq("name", name)
        .eq("is_active", true)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setDonor(data)
      }
      setLoading(false)
    }
    fetchDonor()
  }, [name, router])

  const drawCanvas = useCallback(async () => {
    if (!canvasRef.current || !donor) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 1080
    canvas.height = 1080

    // 배경 이미지 (갈대상자)
    const bgImg = new window.Image()
    bgImg.crossOrigin = "anonymous"
    bgImg.src = "/reed-basket.png"

    bgImg.onload = () => {
      // 배경
      ctx.drawImage(bgImg, 0, 0, 1080, 1080)

      // 어두운 오버레이
      const gradient = ctx.createLinearGradient(0, 0, 0, 1080)
      gradient.addColorStop(0, "rgba(0, 67, 116, 0.35)")
      gradient.addColorStop(0.5, "rgba(0, 67, 116, 0.2)")
      gradient.addColorStop(1, "rgba(0, 67, 116, 0.75)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 1080, 1080)

      // "DONOR RECOGNITION" 레이블
      ctx.fillStyle = "rgba(255,255,255,0.7)"
      ctx.font = "bold 24px 'Noto Sans KR', sans-serif"
      ctx.letterSpacing = "10px"
      ctx.textAlign = "center"
      ctx.fillText("DONOR RECOGNITION", 540, 280)

      // 구분선
      ctx.fillStyle = "#004374"
      ctx.fillRect(490, 300, 100, 2)

      // 이름
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 96px 'Noto Serif', serif"
      ctx.letterSpacing = "0px"
      ctx.textAlign = "center"
      ctx.fillText(donor.name, 540, 420)

      // "님" 텍스트
      ctx.fillStyle = "rgba(255,255,255,0.8)"
      ctx.font = "40px 'Noto Sans KR', sans-serif"
      ctx.fillText("님의 소중한 후원이", 540, 490)
      ctx.fillText("한동의 인재를 키우는 갈대상자가 됩니다", 540, 545)

      // 성경 구절 카드 배경
      ctx.fillStyle = "rgba(255,255,255,0.15)"
      const cardX = 140, cardY = 610, cardW = 800, cardH = 250
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardW, cardH, 20)
      ctx.fill()

      // 성경 구절
      ctx.fillStyle = "rgba(255,255,255,0.9)"
      ctx.font = "italic 26px 'Noto Serif', serif"
      ctx.textAlign = "center"
      const verse1 = "\"그를 위하여 갈대 상자를 가져다가"
      const verse2 = "역청과 나무 진을 칠하고 아기를 거기 담아"
      const verse3 = "나일 강 가 갈대 사이에 두고\""
      ctx.fillText(verse1, 540, 668)
      ctx.fillText(verse2, 540, 712)
      ctx.fillText(verse3, 540, 756)

      // 출애굽기 2:3
      ctx.fillStyle = "#C6A96F"
      ctx.font = "bold 22px 'Noto Sans KR', sans-serif"
      ctx.letterSpacing = "6px"
      ctx.fillText("— 출애굽기 2:3", 540, 820)

      // 한동 로고 텍스트 (하단)
      ctx.fillStyle = "rgba(255,255,255,0.5)"
      ctx.font = "18px 'Noto Sans KR', sans-serif"
      ctx.letterSpacing = "2px"
      ctx.fillText("한동대학교 온라인 도너월", 540, 1020)
    }

    bgImg.onerror = () => {
      // 배경 이미지 로드 실패 시 단색 배경
      ctx.fillStyle = "#004374"
      ctx.fillRect(0, 0, 1080, 1080)

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 80px 'Noto Serif', serif"
      ctx.textAlign = "center"
      ctx.fillText(donor.name, 540, 540)

      ctx.fillStyle = "#C6A96F"
      ctx.font = "32px 'Noto Sans KR', sans-serif"
      ctx.fillText("DONOR RECOGNITION", 540, 620)
    }
  }, [donor])

  useEffect(() => {
    if (donor && donor.donation_amount < 10_000_000) {
      drawCanvas()
    }
  }, [donor, drawCanvas])

  async function handleSaveImage() {
    if (!canvasRef.current) return
    setSaving(true)
    await drawCanvas()
    setTimeout(() => {
      const link = document.createElement("a")
      link.download = `감사카드-${donor?.name || "donor"}.png`
      link.href = canvasRef.current!.toDataURL("image/png")
      link.click()
      setSaving(false)
    }, 600)
  }

  // ────── 로딩 상태 ──────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#fbf9f8" }}>
        <p className="text-muted-foreground text-sm">검색 중...</p>
      </div>
    )
  }

  // ────── 검색 결과 없음 ──────
  if (notFound || !donor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center" style={{ background: "#fbf9f8" }}>
        <div className="text-5xl mb-2">🌾</div>
        <h2 className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
          후원자 정보를 찾을 수 없습니다
        </h2>
        <p className="text-muted-foreground max-w-sm leading-relaxed">
          <strong>"{name}"</strong> 이름으로 등록된 후원자 정보가 없습니다.<br />
          이름을 다시 확인하시거나, 후원 문의는 대외협력팀으로 연락해 주세요.
        </p>
        <div className="flex gap-3 mt-2">
          <Button onClick={() => router.push("/")} variant="outline">
            다시 검색
          </Button>
          <a href="mailto:sarang@handong.edu" className={buttonVariants({ variant: "default" })}>
            문의하기
          </a>
        </div>
        <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors mt-4">
          ← 홈으로
        </Link>
      </div>
    )
  }

  const isLarge = donor.donation_amount >= 10_000_000

  // ────── 대형 후원자 화면 ──────
  if (isLarge) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#fbf9f8" }}>
        {/* 헤더 */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-sm text-primary hover:underline underline-offset-4">
              ← 홈으로
            </Link>
            <span className="text-xs font-semibold text-primary/60 tracking-widest uppercase">Major Donor</span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-20">
          {/* 프로필 영역 */}
          <div className="flex flex-col items-center text-center mb-16">
            {/* 프로필 사진 */}
            {donor.photo_url ? (
              <div className="relative mb-8">
                <div className="w-52 h-52 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary shadow-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white border-4 border-white">
                    <img src={donor.photo_url} alt={`${donor.name} 후원자`} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold tracking-widest uppercase whitespace-nowrap">
                  ★ MAJOR DONOR
                </div>
              </div>
            ) : (
              <div className="relative mb-8">
                <div className="w-52 h-52 rounded-full bg-gradient-to-tr from-primary to-secondary shadow-2xl flex items-center justify-center">
                  <span className="text-white text-6xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    {donor.name.charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full shadow-lg text-xs font-bold tracking-widest uppercase whitespace-nowrap">
                  ★ MAJOR DONOR
                </div>
              </div>
            )}

            <h1 className="mt-6 text-5xl font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
              {donor.name}
            </h1>

            {/* 감사 메시지 */}
            <div className="mt-12 w-full max-w-xl">
              <div className="relative py-10 px-8 bg-muted/40 rounded-2xl">
                <span className="absolute top-4 left-6 text-4xl text-primary/20 select-none">"</span>
                <p className="text-2xl font-bold text-primary text-center leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                  한동의 미래를 함께 만들어 주셔서 감사합니다
                </p>
                <p className="mt-4 text-xs text-muted-foreground tracking-widest uppercase text-center">
                  — 한동대학교 총장 및 구성원 일동
                </p>
              </div>
            </div>
          </div>

          {/* 스토리 */}
          {donor.story && (
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-border relative overflow-hidden mb-8">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-2xl" />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl">📖</div>
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  후원 이야기
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-heading)" }}>
                {donor.story}
              </p>
              <div className="mt-8 pt-8 border-t border-border flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-xl text-sm">
                  <span className="text-primary">💰</span>
                  <span className="font-bold text-primary">
                    기탁 금액: {donor.donation_amount.toLocaleString()} KRW
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 성경 구절 */}
          <div className="bg-primary text-white rounded-2xl p-10 text-center shadow-lg">
            <span className="text-4xl text-white/20 select-none">"</span>
            <p className="mt-2 text-lg italic leading-relaxed text-white/90" style={{ fontFamily: "var(--font-heading)" }}>
              그를 위하여 갈대 상자를 가져다가 역청과 나무 진을 칠하고<br />
              아기를 거기 담아 나일 강 가 갈대 사이에 두고
            </p>
            <p className="mt-4 text-sm font-bold text-secondary tracking-widest uppercase">— 출애굽기 2:3</p>
          </div>

          {/* 하단 버튼 */}
          <div className="mt-12 flex justify-center">
            <Button variant="outline" onClick={() => router.push("/")} className="px-8">
              ← 홈으로 돌아가기
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // ────── 소형 후원자 화면 (갈대상자 이미지 — 밝은 스타일) ──────
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#fbf9f8" }}>
      {/* 배경 레이어 (position fixed처럼 전체 채움) */}
      <div className="fixed inset-0 z-0">
        <img
          src="/reed-basket.png"
          alt="갈대상자"
          className="w-full h-full object-cover"
        />
        {/* 크림 그라디언트 오버레이: 위아래는 크림, 중간은 투명하게 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(251,249,248,0.45) 0%, transparent 22%, transparent 78%, rgba(251,249,248,0.92) 100%)",
          }}
        />
        {/* 아주 연한 네이비 tint */}
        <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
      </div>

      {/* 헤더 */}
      <header className="relative z-10 sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-border/40 px-5 md:px-20 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-sm font-medium text-primary" style={{ fontFamily: "var(--font-heading)" }}>
            한동대학교 발전기금
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="https://sarang.handong.edu" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">후원안내</a>
          <a href="https://sarang.handong.edu" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">참여하기</a>
          <Link href="/" className="hover:text-primary transition-colors">나의후원</Link>
        </nav>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-5 md:px-20 overflow-hidden">
        <div className="w-full max-w-3xl text-center space-y-8">

          {/* 구분선 + DONOR RECOGNITION 레이블 */}
          <div className="inline-flex flex-col items-center gap-2">
            <span className="w-12 h-0.5 rounded-full bg-primary" />
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-primary">
              DONOR RECOGNITION
            </p>
          </div>

          {/* 이름 */}
          <div className="space-y-4">
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary tracking-tight"
              style={{
                fontFamily: "var(--font-heading)",
                textShadow: "0 2px 10px rgba(0,0,0,0.15)",
              }}
            >
              {donor.name}{" "}
              <span
                className="text-3xl sm:text-4xl font-semibold text-foreground align-middle"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                님
              </span>
            </h1>
            <p className="text-xl font-semibold text-muted-foreground leading-tight max-w-xl mx-auto">
              {donor.name}님의 소중한 후원이<br />
              한동의 인재를 키우는 갈대상자가 됩니다
            </p>
          </div>

          {/* 성경 구절 Glass 카드 */}
          <div
            className="rounded-2xl shadow-2xl border border-white/60 mx-auto max-w-xl mt-8 p-8 md:p-10 transition-transform hover:scale-[1.02] duration-500"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <div className="flex justify-center mb-5">
              <span className="text-4xl text-primary/30 select-none leading-none">"</span>
            </div>
            <blockquote
              className="text-base md:text-lg text-foreground italic leading-relaxed px-2 mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              "그를 위하여 갈대 상자를 가져다가 역청과 나무 진을 칠하고 아기를 거기 담아 나일 강 가 갈대 사이에 두고"
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-primary/20" />
              <cite className="text-xs font-bold text-primary not-italic tracking-widest uppercase">
                EXODUS 2:3
              </cite>
              <div className="h-px w-8 bg-primary/20" />
            </div>
          </div>

          {/* Sustaining Member 뱃지 */}
          <div className="flex justify-center pt-2">
            <div
              className="flex items-center gap-2 px-6 py-3 rounded-full shadow-lg border border-primary/20"
              style={{ background: "rgba(255,255,255,0.90)", backdropFilter: "blur(8px)" }}
            >
              <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-semibold text-primary">Sustaining Member</span>
            </div>
          </div>
        </div>

        {/* 이미지 저장 버튼 */}
        <div className="relative z-10 mt-14 mb-10 flex flex-col items-center gap-6">
          <button
            onClick={handleSaveImage}
            disabled={saving}
            className="group relative flex items-center justify-center gap-3 px-12 py-5 bg-primary text-white rounded-xl shadow-[0_10px_20px_rgba(0,91,154,0.3)] transition-all duration-300 hover:opacity-90 hover:-translate-y-1 active:scale-95 overflow-hidden font-semibold text-sm disabled:opacity-70"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="relative z-10 tracking-widest">
              {saving ? "이미지 생성 중..." : "이미지 저장하기"}
            </span>
          </button>
        </div>

        {/* 숨겨진 Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </main>

      {/* 푸터 */}
      <footer
        className="relative z-10 border-t border-border/40 px-5 md:px-20 py-12"
        style={{ backgroundColor: "rgba(239,237,237,0.95)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="space-y-3">
            <p className="font-semibold text-primary text-sm" style={{ fontFamily: "var(--font-heading)" }}>
              한동대학교 발전기금
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              (37554) 경상북도 포항시 북구 흥해읍 한동로 558<br />
              Handong Global University, Pohang, Korea
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-xs">
            <div className="space-y-2">
              <h4 className="font-bold text-foreground">문의하기</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>대표전화: 054-260-1114</li>
                <li>대외협력팀: 054-260-1062</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-foreground">관련사이트</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>
                  <a href="https://www.handong.edu" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                    한동대학교 홈페이지
                  </a>
                </li>
                <li>
                  <a href="https://sarang.handong.edu" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">
                    한동사랑 사이트
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <h4 className="font-bold text-foreground">소셜 미디어</h4>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/handong.univ" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-border flex items-center justify-center hover:bg-primary hover:text-white text-muted-foreground transition-colors text-xs font-bold">f</a>
                <a href="mailto:sarang@handong.edu" className="w-8 h-8 rounded-full bg-border flex items-center justify-center hover:bg-primary hover:text-white text-muted-foreground transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-10 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2024 Handong Global University. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-foreground transition-colors">이용약관</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
