"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function NewDonorPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [story, setStory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isLarge = Number(amount) >= 10_000_000

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let photo_url: string | null = null

      // 대형 후원자 사진 업로드
      if (isLarge && photo) {
        const ext = photo.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from("donor-photos")
          .upload(fileName, photo)

        if (uploadError) throw new Error("사진 업로드 실패: " + uploadError.message)

        const { data: urlData } = supabase.storage
          .from("donor-photos")
          .getPublicUrl(fileName)
        photo_url = urlData.publicUrl
      }

      const { error: insertError } = await supabase.from("donors").insert({
        name: name.trim(),
        donation_amount: Number(amount),
        photo_url: isLarge ? photo_url : null,
        story: isLarge && story.trim() ? story.trim() : null,
        is_active: true,
      })

      if (insertError) throw new Error("저장 실패: " + insertError.message)

      router.push("/admin")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f4f9" }}>
      {/* 헤더 */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">기부자 관리</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-primary">신규 등록</span>
        </div>
      </header>

      <main className="flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <Card className="overflow-hidden shadow-sm">
            {/* 폼 헤더 */}
            <div className="bg-primary px-10 py-8 text-center">
              <h1 className="text-xl font-semibold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                기부자 등록
              </h1>
              <p className="mt-1 text-sm text-primary-foreground/80">
                한동의 미래를 함께 엮어가는 소중한 동역자의 정보를 기록합니다.
              </p>
            </div>

            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 이름 */}
                <div className="space-y-1.5">
                  <Label htmlFor="name">이름 <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="기부자 성함을 입력해 주세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* 기부 금액 */}
                <div className="space-y-1.5">
                  <Label htmlFor="amount">기부 금액 (원) <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="금액을 입력해 주세요"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      min={1}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">원</span>
                  </div>
                  {amount && (
                    <p className="text-xs text-muted-foreground">
                      {Number(amount).toLocaleString()}원
                      {isLarge && <span className="ml-2 text-primary font-medium">— 대형 후원자 (사진+스토리 입력 가능)</span>}
                    </p>
                  )}
                </div>

                {/* 대형 후원자 전용: 사진 업로드 */}
                {isLarge && (
                  <div className="space-y-1.5">
                    <Label htmlFor="photo">사진 업로드</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors">
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                      />
                      <label htmlFor="photo" className="cursor-pointer">
                        {photo ? (
                          <p className="text-sm font-medium text-primary">{photo.name}</p>
                        ) : (
                          <>
                            <p className="text-sm text-muted-foreground">사진 파일을 선택하거나 드래그하세요</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG · 최대 10MB</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {/* 대형 후원자 전용: 스토리 */}
                {isLarge && (
                  <div className="space-y-1.5">
                    <Label htmlFor="story">기부 스토리</Label>
                    <Textarea
                      id="story"
                      placeholder="나눔의 마음을 담은 짧은 이야기를 들려주세요"
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      rows={5}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">{story.length} / 500 자</p>
                  </div>
                )}

                {/* 오류 */}
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}

                {/* 버튼 */}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => router.push("/admin")}>
                    취소
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "저장 중..." : "기부자 정보 저장하기"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
