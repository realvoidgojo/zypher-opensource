"use client"

import { useEffect } from "react"

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Dashboard error:", error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-[#111827] p-8 rounded-4xl border border-[#1F2937] shadow-sm">
            <h2 className="text-3xl font-light text-rose-500 mb-4 tracking-wide">System Malfunction Detected</h2>
            <p className="text-slate-400 font-medium tracking-wide mb-8">An anomaly has been detected in the Command Center data feed.</p>

            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-[#EF4444] text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-[#DC2626] border border-[#B91C1C] transition-all active:scale-95 shadow-sm"
            >
                Reboot System
            </button>
        </div>
    )
}
