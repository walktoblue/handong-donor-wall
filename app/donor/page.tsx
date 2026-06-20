"use client"

import { Suspense } from "react"
import DonorPageInner from "./DonorPageInner"

export default function DonorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">불러오는 중...</p>
      </div>
    }>
      <DonorPageInner />
    </Suspense>
  )
}
