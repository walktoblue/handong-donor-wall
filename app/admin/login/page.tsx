"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.")
      setLoading(false)
    } else {
      router.push("/admin")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8" style={{ backgroundColor: "#f1f4f9" }}>
      <div className="w-full max-w-[440px]">
        {/* 브랜딩 헤더 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            관리자 로그인
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">발전기금 관리 시스템에 접속합니다.</p>
        </div>

        {/* 로그인 카드 */}
        <Card className="shadow-lg border-border/30">
          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이메일 */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-muted-foreground">이메일 계정</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@handong.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted/30"
                />
              </div>

              {/* 비밀번호 */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-muted-foreground">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-muted/30 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {showPassword ? "숨기기" : "보기"}
                  </button>
                </div>
              </div>

              {/* 오류 메시지 */}
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                className="w-full py-6 text-base"
                disabled={loading}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            {/* 보안 안내 */}
            <div className="mt-8 border-t border-border/30 pt-6 text-center">
              <p className="text-xs text-muted-foreground">보안 프로토콜 적용 중 (SSL 256-bit)</p>
            </div>
          </CardContent>
        </Card>

        {/* 하단 링크 */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="https://sarang.handong.edu" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            발전기금 안내
          </a>
          <a href="https://www.handong.edu" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            한동대학교 공식 홈페이지
          </a>
        </div>
      </div>
    </main>
  )
}
