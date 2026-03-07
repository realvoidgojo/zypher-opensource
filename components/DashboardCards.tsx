"use client"

const Icons = {
  Out: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>,
  In: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 12H5" /><path d="m12 19-7-7 7-7" /></svg>,
  Warn: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  Risk: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
  Assets: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
}

export default function DashboardCards({ metrics }: { metrics: { products: number, warehouses: number, activeShipments: number, delayedShipments: number, lowStock: number, incomingShipments: number } }) {
  const cards = [
    { title: "Active Dispatches", value: metrics.activeShipments, subtitle: "Moving Out", icon: Icons.Out, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { title: "Incoming Supply", value: metrics.incomingShipments, subtitle: "Moving In", icon: Icons.In, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { title: "Critical Stock", value: metrics.lowStock, subtitle: "Needs Reorder", icon: Icons.Warn, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { title: "Delay Alerts", value: metrics.delayedShipments, subtitle: "Risk Detected", icon: Icons.Risk, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { title: "Total Assets", value: metrics.products + metrics.warehouses, subtitle: "Nodes & SKUs", icon: Icons.Assets, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {cards.map((m, i) => (
        <div key={m.title} className={`p-6 rounded-3xl border ${m.border} bg-[#0f1423] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-default`}>
          <div className={`absolute -right-4 -top-4 w-24 h-24 ${m.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-6">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] w-2/3 leading-relaxed">{m.title}</p>
              <div className={`${m.color} opacity-80 group-hover:opacity-100 transition-opacity`}>{m.icon}</div>
            </div>
            <div>
              <h2 className="text-4xl font-light text-white tracking-tight mb-1">{m.value}</h2>
              <p className="text-slate-500 text-xs font-medium">{m.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}