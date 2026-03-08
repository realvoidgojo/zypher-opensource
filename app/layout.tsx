"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  LayoutDashboard,
  Package,
  Truck,
  ShieldCheck,
  TrendingUp,
  Map as MapIcon,
  ShoppingCart,
  Activity,
  LogOut,
  Menu,
  X
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

const Icons = {
  Command: <LayoutDashboard size={18} />,
  Inventory: <Package size={18} />,
  Fleet: <Truck size={18} />,
  Trust: <ShieldCheck size={18} />,
  Forecast: <TrendingUp size={18} />,
  Heatmap: <MapIcon size={18} />,
  Procurement: <ShoppingCart size={18} />,
  Simulation: <Activity size={18} />,
  Logout: <LogOut size={18} />,
  Menu: <Menu size={24} />,
  Close: <X size={24} />,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const sid = localStorage.getItem("supplier_id");
    const sname = localStorage.getItem("supplier_name");

    if (sid) {
      setIsLoggedIn(true);
      setSupplierName(sname || "Operator");
      if (pathname === "/login" || pathname === "/")
        router.replace("/dashboard");
    } else {
      setIsLoggedIn(false);
      if (pathname !== "/login" && pathname !== "/") router.replace("/login");
    }
  }, [pathname, router]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    router.replace("/login");
  };

  return (
    <html lang="en">
      <body className={`${inter.className} text-[#F9FAFB] selection:bg-[#3B82F6]/30 selection:text-[#F9FAFB] antialiased bg-[#0B0F14]`}>
        {!mounted ? (
          <div className="h-screen w-full bg-[#0B0F14] flex flex-col items-center justify-center font-semibold">
            <div className="w-8 h-8 border-2 border-[#1F2937] border-t-[#3B82F6] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {!isLoggedIn || pathname === "/login" ? (
              <div className="w-full min-h-screen bg-[#0B0F14]">{children}</div>
            ) : (
              <div className="flex h-screen overflow-hidden bg-[#0B0F14]">
                {/* MOBILE TOP HEADER */}
                <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-[#0B0F14]/90 backdrop-blur-md border-b border-[#1F2937] z-40 flex items-center px-4">
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors p-2 mr-2 -ml-2"
                  >
                    {Icons.Menu}
                  </button>
                  <span className="text-xl font-semibold text-[#F9FAFB]">
                    Zypher
                  </span>
                </div>

                {/* MOBILE OVERLAY BACKDROP */}
                {isMobileMenuOpen && (
                  <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                )}

                {/* SIDEBAR */}
                <aside
                  className={`
                    fixed lg:relative top-0 left-0 h-full z-50 w-64 bg-[#0B0F14] text-[#F9FAFB] flex flex-col border-r border-[#1F2937]
                    transition-transform duration-300 ease-in-out lg:translate-x-0
                    ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                `}
                >
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-5 right-5 z-50 lg:hidden text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
                  >
                    {Icons.Close}
                  </button>

                  <div className="p-6 relative z-10 flex-1 overflow-y-auto no-scrollbar">
                    <h1 className="text-xl font-semibold mb-8 text-[#F9FAFB] mt-2 lg:mt-0">
                      Zypher
                    </h1>

                    <div className="mb-8">
                      <p className="text-xs text-[#9CA3AF] mb-1">Workspace</p>
                      <p className="font-medium text-sm text-[#F9FAFB] truncate">
                        {supplierName}
                      </p>
                    </div>

                    <nav className="flex flex-col space-y-1">
                      {[
                        { name: "Dashboard", href: "/dashboard", icon: Icons.Command },
                        { name: "Inventory", href: "/inventory", icon: Icons.Inventory },
                        { name: "Shipments", href: "/shipments", icon: Icons.Fleet },
                        { name: "Suppliers", href: "/suppliers", icon: Icons.Trust },
                        { name: "Forecast", href: "/forecast", icon: Icons.Forecast },
                        { name: "Heatmap", href: "/heatmap", icon: Icons.Heatmap },
                        { name: "Procurement", href: "/procurement", icon: Icons.Procurement },
                        { name: "Simulation", href: "/simulation", icon: Icons.Simulation },
                      ].map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 text-sm font-medium ${isActive
                              ? "bg-[#111827] text-[#F9FAFB]"
                              : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#111827]/50"
                              }`}
                          >
                            <span className={isActive ? "text-[#F9FAFB]" : "text-[#9CA3AF]"}>
                              {item.icon}
                            </span>
                            {item.name}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="p-6 border-t border-[#1F2937] bg-[#0B0F14]">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#111827] text-[#9CA3AF] p-2 rounded-md transition-all duration-150 text-sm font-medium border border-transparent hover:border-[#374151]"
                    >
                      <span>{Icons.Logout}</span> Sign Out
                    </button>
                  </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 overflow-y-auto bg-[#0B0F14] relative pt-16 lg:pt-0">
                  <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto min-h-full">
                    {children}
                  </div>
                </main>
              </div>
            )}
          </>
        )}
      </body>
    </html>
  );
}
