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
        <div className="flex flex-col items-center justify-center min-h-[500px] bg-[#0f1423] p-8 rounded-4xl border border-rose-500/20 shadow-2xl">
            <h2 className="text-3xl font-light text-rose-500 mb-4 tracking-wide">System Malfunction Detected</h2>
            <p className="text-slate-400 font-medium tracking-wide mb-8">An anomaly has been detected in the Command Center data feed.</p>

            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-rose-500/10 text-rose-400 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-rose-500/20 border border-rose-500/20 transition-all active:scale-95 shadow-[inset_0_0_20px_rgba(244,63,94,0.1)]"
            >
                Reboot System
            </button>
        </div>
    )
}
