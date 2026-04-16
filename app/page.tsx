"use client";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import InvoiceBuilder from "@/components/views/InvoiceBuilder";
import InvoiceList from "@/components/views/InvoiceList";
import Inventory from "@/components/views/Inventory";
import Revenue from "@/components/views/Revenue";
import PnL from "@/components/views/PnL";
import WatchRepair from "@/components/views/WatchRepair";
import Settings from "@/components/views/Settings";
import { useAppContext } from "@/context/AppContext";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { activeTab } = useAppContext();

  return (
    <div className="flex h-screen min-h-[700px] bg-slate-50/40">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full max-w-7xl mx-auto"
            >
              {activeTab === "invoice" && <InvoiceBuilder />}
              {activeTab === "invoices" && <InvoiceList />}
              {activeTab === "inventory" && <Inventory />}
              {activeTab === "revenue" && <Revenue />}
              {activeTab === "pnl" && <PnL />}
              {activeTab === "repairs" && <WatchRepair />}
              {activeTab === "settings" && <Settings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}