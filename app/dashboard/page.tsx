"use client"

import DashboardCards from "@/components/DashboardCards"
import ShipmentChart from "@/components/ShipmentChart"
import AlertsPanel from "@/components/AlertsPanel"
import { useEffect, useState } from "react"
import { supabase } from "@/services/supabaseClient"

const StatusPulse = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-cyan-400 animate-pulse"><circle cx="12" cy="12" r="10" /></svg>;

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({ products: 0, warehouses: 0, activeShipments: 0, delayedShipments: 0, lowStock: 0, incomingShipments: 0 })
  const [chartData, setChartData] = useState<{ name: string, value: number }[]>([])
  const [activeShipments, setActiveShipments] = useState<any[]>([])

  useEffect(() => {
    fetchGlobalData()
    const channel = supabase.channel('dashboard-monitor').on('postgres_changes', { event: '*', schema: 'public' }, () => fetchGlobalData()).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchGlobalData() {
    const sid = typeof window !== 'undefined' ? localStorage.getItem("supplier_id") : null;
    if (!sid) return;

    try {
      setLoading(true)
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('owner_id', sid)
      const { count: warehouseCount } = await supabase.from('warehouses').select('*', { count: 'exact', head: true }).eq('owner_id', sid)
      const { data: shipments } = await supabase.from('shipments').select('*').or(`owner_id.eq.${sid},buyer_owner_id.eq.${sid}`).eq('status', 'In Transit')
      const { data: invData } = await supabase.from('inventory').select('stock_quantity, reorder_level').eq('owner_id', sid)

      const outgoing = shipments?.filter(s => s.owner_id === sid) || []
      const incoming = shipments?.filter(s => s.buyer_owner_id === sid) || []
      const lowStockCount = invData?.filter(item => item.stock_quantity < item.reorder_level).length || 0

      const now = new Date().toISOString();
      const delayedCount = shipments?.filter(s => s.estimated_delivery_time < now).length || 0;

      setMetrics({
        products: productCount || 0,
        warehouses: warehouseCount || 0,
        activeShipments: outgoing.length,
        incomingShipments: incoming.length,
        delayedShipments: delayedCount,
        lowStock: lowStockCount
      })

      setActiveShipments(shipments || [])

      if (outgoing.length === 0 && incoming.length === 0) {
        setChartData([{ name: "Idle Network", value: 1 }]);
      } else {
        setChartData([
          { name: "Active Dispatches", value: outgoing.length },
          { name: "Incoming Supply", value: incoming.length }
        ]);
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="bg-[#0f1423] p-8 lg:p-10 rounded-4xl border border-white/5 h-48 w-full shadow-2xl">
          <div className="h-4 bg-white/10 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-white/10 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-40 rounded-3xl bg-[#0f1423] border border-white/5 p-6 flex flex-col justify-between">
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
              <div className="h-10 bg-white/10 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 h-[500px] bg-[#0f1423] rounded-[2.5rem] border border-white/5 p-8 inline-flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-8 border-white/5"></div>
          </div>
          <div className="xl:col-span-7 h-[500px] bg-[#0f1423] rounded-[2.5rem] border border-white/5 p-8 flex flex-col">
            <div className="flex justify-between w-full mb-8">
              <div className="h-8 bg-white/10 rounded w-1/4"></div>
              <div className="h-8 bg-white/10 rounded w-1/5"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-[#161b2a] rounded-3xl border border-white/5"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* HEADER SECTION */}
      <div className="bg-[#0f1423] p-8 lg:p-10 rounded-4xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-900/20 blur-[80px] pointer-events-none rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            {StatusPulse}
            <p className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.3em]">System Online • Live Sync</p>
          </div>
          <h1 className="text-4xl font-light text-white tracking-tight">Global Command Center</h1>
          <p className="text-slate-400 font-medium mt-2 tracking-wide text-sm">Autonomous tracking & supply chain intelligence.</p>
        </div>
        <div className="hidden lg:block text-right relative z-10">
          <p className="text-4xl font-black bg-clip-text text-transparent bg-linear-to-b from-slate-100 to-slate-500 tracking-tighter">ZYPHER</p>
          <p className="text-[10px] font-black text-cyan-500/80 uppercase tracking-[0.4em] mt-1">Team Roarz</p>
        </div>
      </div>

      <DashboardCards metrics={metrics} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5 h-full">
          <ShipmentChart data={chartData} />
        </div>
        <div className="xl:col-span-7 h-full">
          <AlertsPanel shipments={activeShipments} runRealTimeAI={fetchGlobalData} />
        </div>
      </div>
    </div>
  )
}