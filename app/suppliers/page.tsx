import SupplierAnalytics from "@/components/SupplierAnalytics"

export default function SuppliersPage() {
  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      {/* 🚀 HEADER SECTION - DARK MODE */}
      <div className="bg-[#111827] p-8 lg:p-10 rounded-[2.5rem] border border-[#1F2937] shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-ping"></div>
            <p className="text-[#3B82F6] font-semibold text-xs">Network Reliability</p>
          </div>
          <h1 className="text-2xl font-semibold text-[#F9FAFB]">Suppliers</h1>
          <p className="text-[#9CA3AF] font-medium mt-1 text-sm max-w-3xl">
            Track and analyze logistics partner performance. Suppliers with a reliability score below 70% are flagged as high risk to prevent supply chain disruptions.
          </p>
        </div>
      </div>

      {/* THE DATA MATRIX */}
      <SupplierAnalytics />
    </div>
  )
}