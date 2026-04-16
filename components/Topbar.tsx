"use client";
import { useAppContext } from "@/context/AppContext";
import { RefreshCw, Printer, Menu } from "lucide-react";

export default function Topbar() {
    const { activeTab, updateState } = useAppContext();

    const titles: Record<string, string> = {
        invoice: "New Invoice", invoices: "All Invoices", inventory: "Inventory",
        revenue: "Revenue", pnl: "Profit & Loss", repairs: "Watch Repair", settings: "Settings"
    };

    const handleClear = () => updateState({ rows: [] });

    return (
        <header className="bg-[var(--background)] px-4 md:px-8 py-4 md:py-5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-opacity-80 border-b border-slate-200 lg:border-none">
            <div className="flex items-center gap-2 md:gap-3">
                <button onClick={() => updateState({ isMobileMenuOpen: true })} className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <Menu size={20} />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">{titles[activeTab] || activeTab}</h1>
            </div>
            {activeTab === "invoice" && (
                <div className="flex gap-2 md:gap-3">
                    <button onClick={handleClear} className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
                        <RefreshCw size={14} /> <span className="hidden sm:inline">Clear</span>
                    </button>
                    <button className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all" onClick={() => window.print()}>
                        <Printer size={14} /> <span className="hidden sm:inline">Print</span>
                    </button>
                </div>
            )}
        </header>
    );
}