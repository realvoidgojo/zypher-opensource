"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["#3B82F6", "#10B981"]; // Primary and Grid colors

export default function ShipmentChart({
  data: initialData,
}: {
  data?: { name: string; value: number }[];
}) {
  const [data, setData] = useState<{ name: string; value: number }[]>(
    initialData || [],
  );

  useEffect(() => {
    if (!initialData) {
      fetchChartData();
    } else {
      setData(initialData);
    }
  }, [initialData]);

  async function fetchChartData() {
    const sid =
      typeof window !== "undefined"
        ? localStorage.getItem("supplier_id")
        : null;
    if (!sid) return;

    try {
      const { data: shipments, error } = await supabase
        .from("shipments")
        .select("owner_id, buyer_owner_id, status")
        .or(`owner_id.eq.${sid},buyer_owner_id.eq.${sid}`)
        .eq("status", "In Transit");

      if (error) return;

      const outgoing = shipments?.filter((s) => s.owner_id === sid).length || 0;
      const incoming =
        shipments?.filter((s) => s.buyer_owner_id === sid).length || 0;

      if (outgoing === 0 && incoming === 0) {
        setData([{ name: "Idle Network", value: 1 }]);
      } else {
        setData([
          { name: "Active Dispatches", value: outgoing },
          { name: "Incoming Supply", value: incoming },
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="bg-[#111827] p-6 lg:p-8 rounded-xl border border-[#1F2937] h-[500px] flex flex-col relative overflow-hidden shadow-sm w-full">
      <div className="flex items-center gap-2 mb-6 relative z-10 border-b border-[#1F2937] pb-4">
        <PieChartIcon size={20} className="text-[#9CA3AF]" />
        <div>
          <h2 className="text-[14px] font-medium text-[#F9FAFB] tracking-wide">
            Network Load
          </h2>
        </div>
      </div>

      <div className="flex-1 relative w-full mt-2 min-h-[250px]">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart key={`piechart-${data.length}`}>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "#111827",
                  borderRadius: "8px",
                  border: "1px solid #1F2937",
                  color: "#F9FAFB",
                  fontSize: "13px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                itemStyle={{ color: "#F9FAFB", fontWeight: 500 }}
              />
              <Legend
                verticalAlign="bottom"
                height={40}
                iconType="circle"
                wrapperStyle={{
                  fontSize: "12px",
                  color: "#9CA3AF",
                  fontWeight: "500",
                  paddingTop: "24px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
