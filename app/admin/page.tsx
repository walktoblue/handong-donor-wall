"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Donor = {
  id: string
  name: string
  donation_amount: number
  photo_url: string | null
  story: string | null
  is_active: boolean
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDonors()
  }, [])

  async function fetchDonors() {
    setLoading(true)
    const { data, error } = await supabase
      .from("donors")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      setError("데이터를 불러오지 못했습니다.")
    } else {
      setDonors(data || [])
    }
    setLoading(false)
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" 후원자를 삭제할까요?`)) return
    const { error } = await supabase.from("donors").delete().eq("id", id)
    if (error) {
      alert("삭제 중 오류가 발생했습니다.")
    } else {
      setDonors((prev) => prev.filter((d) => d.id !== id))
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const filtered = donors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalAmount = donors.reduce((sum, d) => sum + d.donation_amount, 0)
  const largeCount = donors.filter((d) => d.donation_amount >= 10_000_000).length

  function formatAmount(amount: number) {
    if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}억`
    if (amount >= 10_000) return `${(amount / 10_000).toFixed(0)}만원`
    return `${amount.toLocaleString()}원`
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f4f9" }}>
      {/* 헤더 */}
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              기부자 조회 홈
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium text-primary">기부자 관리</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* 페이지 제목 + 추가 버튼 */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              기부자 관리
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">후원자 정보를 등록하고 관리합니다.</p>
          </div>
          <Link href="/admin/donors/new" className={buttonVariants({ variant: "default" })}>
            + 기부자 추가
          </Link>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">총 등록 후원자</p>
            <p className="text-2xl font-bold text-foreground">{donors.length}<span className="text-sm font-normal text-muted-foreground ml-1">명</span></p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
            <p className="text-xs text-muted-foreground mb-1">대형 후원자 (≥1천만)</p>
            <p className="text-2xl font-bold text-foreground">{largeCount}<span className="text-sm font-normal text-muted-foreground ml-1">명</span></p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-border shadow-sm col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground mb-1">총 누적 기부액</p>
            <p className="text-2xl font-bold text-foreground">{formatAmount(totalAmount)}</p>
          </div>
        </div>

        {/* 테이블 카드 */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="font-semibold text-foreground">기부자 목록</h2>
            <Input
              placeholder="이름으로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>

          {loading ? (
            <div className="py-16 text-center text-muted-foreground text-sm">불러오는 중...</div>
          ) : error ? (
            <div className="py-16 text-center text-red-500 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground text-sm">
                {search ? "검색 결과가 없습니다." : "등록된 후원자가 없습니다. 기부자 추가 버튼을 눌러주세요."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-bold text-primary uppercase tracking-wider">이름</TableHead>
                    <TableHead className="text-xs font-bold text-primary uppercase tracking-wider">기부 금액</TableHead>
                    <TableHead className="text-xs font-bold text-primary uppercase tracking-wider">구분</TableHead>
                    <TableHead className="text-xs font-bold text-primary uppercase tracking-wider">등록일</TableHead>
                    <TableHead className="text-xs font-bold text-primary uppercase tracking-wider text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((donor) => {
                    const isLarge = donor.donation_amount >= 10_000_000
                    return (
                      <TableRow key={donor.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-medium">{donor.name}</TableCell>
                        <TableCell>{donor.donation_amount.toLocaleString()}원</TableCell>
                        <TableCell>
                          <Badge variant={isLarge ? "default" : "secondary"}>
                            {isLarge ? "대형 후원자" : "후원자"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(donor.created_at).toLocaleDateString("ko-KR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/donors/${donor.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                              수정
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                              onClick={() => handleDelete(donor.id, donor.name)}
                            >
                              삭제
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
