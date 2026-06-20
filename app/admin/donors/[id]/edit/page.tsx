"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function EditDonorPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null)
  const [story, setStory] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")

  const isLarge = Number(amount) >= 10_000_000

  useEffect(() => {
    async function fetchDonor() {
      const { data, error } = await supabase.from("donors").select("*").eq("id", id).single()
      if (error || !data) {
        setError("후원자 정보를 불러올 수 없습니다.")
        setFetching(false)
        return
      }
      setName(data.name)
      setAmount(String(data.donation_amount))
      setExistingPhotoUrl(data.photo_url)
      setStory(data.story || "")
      setIsActive(data.is_active)
      setFetching(false)
    }
    fetchDonor()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let photo_url = existingPhotoUrl

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

      const { error: updateError } = await supabase
        .from("donors")
        .update({
          name: name.trim(),
          donation_amount: Number(amount),
          photo_url: isLarge ? photo_url : null,
          story: isLarge && story.trim() ? story.trim() : null,
          is_active: isActive,
        })
        .eq("id", id)

      if (updateError) throw new Error("저장 실패: " + updateError.message)

      router.push("/admin")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.")
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f4f9" }}>
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">기부자 관리</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-primary">정보 수정</span>
        </div>
      </header>

      <main className="flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <Card className="overflow-hidden shadow-sm">
            <div className="bg-primary px-10 py-8 text-center">
              <h1 className="text-xl font-semibold text-primary-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                기부자 정보 수정
              </h1>
              <p className="mt-1 text-sm text-primary-foreground/80">
                후원자 정보를 수정합니다.
              </p>
            </div>

            <CardContent className="p-8 md:p-12">
              {error && !fetching ? (
                <div className="text-center py-8">
                  <p className="text-red-600 text-sm">{error}</p>
                  <Button variant="outline" className="mt-4" onClick={() => router.push("/admin")}>
                    목록으로
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">이름 <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      placeholder="기부자 성함"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="amount">기부 금액 (원) <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="금액"
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
                        {isLarge && <span className="ml-2 text-primary font-medium">— 대형 후원자</span>}
                      </p>
                    )}
                  </div>

                  {isLarge && (
                    <div className="space-y-1.5">
                      <Label htmlFor="photo">사진 업로드</Label>
                      {existingPhotoUrl && !photo && (
                        <div className="mb-2">
                          <img src={existingPhotoUrl} alt="현재 사진" className="h-20 w-20 rounded-full object-cover border border-border" />
                          <p className="text-xs text-muted-foreground mt-1">현재 사진 — 새 파일 선택 시 교체됩니다</p>
                        </div>
                      )}
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
                            <p className="text-sm text-muted-foreground">새 사진을 선택하려면 클릭하세요</p>
                          )}
                        </label>
                      </div>
                    </div>
                  )}

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

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isActive" className="cursor-pointer text-sm">공개 (체크 해제 시 검색 결과에서 숨겨짐)</Label>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => router.push("/admin")}>
                      취소
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? "저장 중..." : "저장하기"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
