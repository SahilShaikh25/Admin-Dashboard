"use client";

import { Spinner } from "@/components/ui/spinner";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <Spinner />
    </div>
  )
}