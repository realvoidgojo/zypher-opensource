"use client"

import React, { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import ShipmentManager from "@/components/ShipmentManager"
import ShipmentChart from "@/components/ShipmentChart"

// Stripped types from dynamic import to prevent Next.js compilation crashes
const ShipmentMap = dynamic(
  () => import("@/components/ShipmentMap"),
  {
    ssr: false,
    loading: () => <div className="h-[500px] w-full flex items-center justify-center bg-[#111827] rounded-xl border border-[#1F2937] shadow-sm animate-pulse font-medium text-[#9CA3AF] text-sm tracking-wide">Loading map...</div>
  }
)

function ShipmentsContent() {
  const searchParams = useSearchParams();
  const trackId = searchParams.get('track');

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      <div className="pb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
            <p className="text-[#10B981] font-semibold text-xs">Tracking Active</p>
          </div>
          <h1 className="text-2xl font-semibold text-[#F9FAFB]">Shipments Tracker</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Real-time tracking and estimated arrivals.</p>
        </div>
        {trackId && (
          <button onClick={() => window.location.href = '/shipments'} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm active:translate-y-[1px] whitespace-nowrap">View All</button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <ShipmentMap focusId={trackId} />
        </div>
        <div className="xl:col-span-4">
          <ShipmentChart />
        </div>
      </div>

      <ShipmentManager />
    </div>
  )
}

export default function ShipmentsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-medium text-[#9CA3AF] text-sm tracking-wide animate-pulse">Loading...</div>}>
      <ShipmentsContent />
    </Suspense>
  )
}