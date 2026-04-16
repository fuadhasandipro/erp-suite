"use client";
import { useAppContext } from "@/context/AppContext";
import { Receipt, ClipboardList, Package, DollarSign, BarChart2, Wrench, Settings, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
    const { activeTab, setActiveTab, settings, isMobileMenuOpen, updateState } = useAppContext();

    const navItems = [
        { id: "invoice", label: "Invoice", icon: Receipt },
        { id: "invoices", label: "All Invoices", icon: ClipboardList },
        { id: "inventory", label: "Inventory", icon: Package },
        { id: "revenue", label: "Revenue", icon: DollarSign },
        { id: "pnl", label: "P&L", icon: BarChart2 },
        { id: "repairs", label: "Watch Repair", icon: Wrench },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <>
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => updateState({ isMobileMenuOpen: false })}
                />
            )}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 shrink-0 bg-[var(--background)] border-r border-slate-200/60 flex flex-col pt-6 pb-4 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="px-6 mb-8 flex items-center justify-between">
                    <div className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm shadow-sm">
                            ERP
                        </div>
                        {settings.company.substring(0, 12)}
                    </div>
                    <button 
                        className="lg:hidden text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-md transition-colors" 
                        onClick={() => updateState({ isMobileMenuOpen: false })}
                    >
                        <X size={18} />
                    </button>
                </div>
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    updateState({ isMobileMenuOpen: false });
                                }}
                                className={`w-full relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${isActive
                                        ? "text-blue-700"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-lg"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <div className="relative z-10 flex items-center gap-3">
                                    <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
                                    {item.label}
                                </div>
                            </button>
                        );
                    })}
                </nav>
                <div className="px-6 mt-auto pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-400 font-medium">v2.0 Minimal</div>
                </div>
            </div>
        </>
    );
}