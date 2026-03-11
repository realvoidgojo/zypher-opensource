"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function SimulationPage() {
  const [demandSpike, setDemandSpike] = useState(0);
  const [delayDays, setDelayDays] = useState(0);

  // Real-Time DB State
  const [realBaseStock, setRealBaseStock] = useState(1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRealInventory() {
      const sid =
        typeof window !== "undefined"
          ? localStorage.getItem("supplier_id")
          : null;
      if (!sid) return;

      // Fetch ALL inventory for this supplier
      const { data: invData, error } = await supabase
        .from("inventory")
        .select("stock_quantity")
        .eq("owner_id", sid);

      if (!error && invData) {
        // Sum up the entire network's stock to get a global baseline
        const totalStock = invData.reduce(
          (acc, item) => acc + item.stock_quantity,
          0,
        );
        if (totalStock > 0) {
          setRealBaseStock(totalStock);
        }
      }
      setLoading(false);
    }
    fetchRealInventory();
  }, []);

  // Generate simulated chart data based on slider inputs AND Real DB Stock
  const generateData = () => {
    // Dynamically scale the daily depletion rate based on how much stock exists
    // (Assume they normally sell 5% of their total stock per day)
    const baseDepletion = Math.max(10, Math.floor(realBaseStock * 0.05));

    return Array.from({ length: 30 }).map((_, i) => {
      let normalStock = Math.max(0, realBaseStock - baseDepletion * i);

      const simDepletion = baseDepletion * (1 + demandSpike / 100);
      let simStock = Math.max(0, realBaseStock - simDepletion * i);

      // Dynamically scale the restock volume to match the size of the company
      const restockVolume = Math.floor(realBaseStock * 0.6);

      if (i > 15 + delayDays) simStock += restockVolume;
      if (i > 15) normalStock += restockVolume;

      return {
        day: `Day ${i + 1}`,
        baseline: normalStock,
        simulated: simStock,
      };
    });
  };

  const chartData = generateData();

  if (loading)
    return (
      <div className="p-20 flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin" />
        <p className="mt-6 text-[#9CA3AF] font-medium text-xs animate-pulse">
          Loading simulation...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      {/* HEADER */}
      <div className="bg-[#111827] p-6 lg:p-10 rounded-[2.5rem] border border-[#1F2937] shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-ping"></div>
              <p className="text-rose-400 font-semibold text-xs">
                Simulation
              </p>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#F9FAFB]">
              Simulation Suite
            </h1>
            <p className="text-[#9CA3AF] font-medium mt-1 text-sm max-w-2xl">
              Stress-test resilience against demand spikes and delays.
            </p>
          </div>

          {/* Displaying the live DB metric to prove it's connected */}
          <div className="bg-[#111827] border border-[#1F2937] px-6 py-4 rounded-xl shadow-sm text-left md:text-right w-full md:w-auto">
            <p className="text-xs font-semibold text-[#9CA3AF] mb-1">
              Global Baseline
            </p>
            <p className="text-2xl font-medium text-rose-400">
              {realBaseStock.toLocaleString()}{" "}
              <span className="text-sm text-[#9CA3AF] font-medium">Units</span>
            </p>
          </div>
        </div>
      </div>

      {/* SIMULATOR GRID */}
      {/* SIMULATOR GRID - THE FIX: Replaced strict 'h-[550px]' with 'lg:h-[550px]' so it stacks nicely on mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:h-[550px]">
        {/* CONTROL PANEL */}
        <div className="xl:col-span-4 bg-[#111827] p-6 lg:p-8 rounded-[2.5rem] border border-[#1F2937] shadow-sm flex flex-col min-h-[400px] lg:h-full">
          <h3 className="text-lg font-medium text-[#F9FAFB] mb-8 border-b border-[#1F2937] pb-4">
            Parameters
          </h3>

          <div className="space-y-10 flex-1">
            {/* Demand Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-semibold text-[#3B82F6]">
                  Demand Spike
                </label>
                <span className="text-lg font-medium text-[#F9FAFB]">
                  +{demandSpike}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={demandSpike}
                onChange={(e) => setDemandSpike(parseInt(e.target.value))}
                className="w-full h-2 bg-[#161b2a] rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <p className="text-xs text-[#9CA3AF] font-medium leading-relaxed">
                Simulates unexpected market demand or viral marketing.
              </p>
            </div>

            {/* Delay Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-semibold text-rose-500">
                  Supply Delay
                </label>
                <span className="text-lg font-medium text-[#F9FAFB]">
                  {delayDays} Days
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                value={delayDays}
                onChange={(e) => setDelayDays(parseInt(e.target.value))}
                className="w-full h-2 bg-[#161b2a] rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <p className="text-xs text-[#9CA3AF] font-medium leading-relaxed">
                Simulates port closures, weather events, or vendor
                failure.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setDemandSpike(0);
              setDelayDays(0);
            }}
            className="w-full py-3 border border-[#374151] rounded-lg text-sm font-semibold text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB] transition-all mt-8 active:scale-95 shadow-sm"
          >
            Reset Parameters
          </button>
        </div>

        {/* VISUALIZATION CHART */}
        <div className="xl:col-span-8 bg-[#111827] p-4 sm:p-6 lg:p-8 rounded-[2.5rem] border border-[#1F2937] shadow-sm flex flex-col relative overflow-hidden min-h-[400px] lg:h-full">
          <h3 className="text-xs md:text-sm font-semibold text-[#9CA3AF] mb-6 relative z-10 px-2">
            Inventory Impact
          </h3>

          <div
            className="relative w-full flex-1"
            style={{ minHeight: "300px" }}
          >
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#374151" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#374151" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#1F2937"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={30}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9CA3AF" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderRadius: "8px",
                      border: "1px solid #1F2937",
                      color: "#F9FAFB",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "12px",
                      color: "#9CA3AF",
                      fontWeight: "500",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="baseline"
                    name="Stable Baseline"
                    stroke="#9CA3AF"
                    fill="url(#colorBase)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="simulated"
                    name="Simulated Trajectory"
                    stroke="#EF4444"
                    fill="url(#colorSim)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
