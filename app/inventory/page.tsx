import InventoryTable from "@/components/InventoryTable"
import OptimizationEngine from "@/components/OptimizationEngine"

export default function InventoryPage() {
  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      {/* 🚀 HEADER SECTION - DARK MODE */}
      <div className="bg-[#111827] p-8 lg:p-10 rounded-[2rem] border border-[#1F2937] shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
            <p className="text-[#10B981] font-semibold text-xs">Live Data</p>
          </div>
          <h1 className="text-2xl font-semibold text-[#F9FAFB]">Inventory</h1>
          <p className="text-[#9CA3AF] font-medium mt-1 text-sm max-w-3xl">
            Global product tracking across all warehouses. Monitor stock levels in real-time.
          </p>
        </div>
      </div>

      <OptimizationEngine />

      <InventoryTable />
    </div>
  )
}