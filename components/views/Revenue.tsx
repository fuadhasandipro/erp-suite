"use client";
import { useAppContext } from "@/context/AppContext";

export default function Revenue() {
    const { invoices } = useAppContext();
    const paid = invoices.filter(i => i.status === 'paid');
    const totalRev = paid.reduce((s, i) => s + i.amount, 0);
    const avg = invoices.length ? (invoices.reduce((s, i) => s + i.amount, 0) / invoices.length) : 0;

    // Group by client
    const clients: Record<string, number> = {};
    paid.forEach(inv => { clients[inv.client] = (clients[inv.client] || 0) + inv.amount; });
    const topClients = Object.entries(clients).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return (
        <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Total Revenue</div><div className="text-2xl font-bold text-green-600">${totalRev.toFixed(2)}</div></div>
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Invoices Issued</div><div className="text-2xl font-bold text-slate-800">{invoices.length}</div></div>
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Avg Invoice Value</div><div className="text-2xl font-bold text-blue-600">${avg.toFixed(2)}</div></div>
            </div>

            <div className="bg-white border rounded-lg p-6">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Top Clients</h2>
                {topClients.length ? topClients.map(([name, amt]) => (
                    <div key={name} className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-700">{name}</span>
                            <span>${amt.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(amt / totalRev) * 100}%` }}></div>
                        </div>
                    </div>
                )) : <div className="text-sm text-slate-500">No revenue data yet.</div>}
            </div>
        </div>
    );
}