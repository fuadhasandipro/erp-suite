"use client";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";

export default function InvoiceList() {
    const { invoices, updateState } = useAppContext();
    const [search, setSearch] = useState("");

    const filtered = invoices.filter(i => i.client.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()));

    const markPaid = (id: string) => {
        updateState({ invoices: invoices.map(i => i.id === id ? { ...i, status: 'paid' } : i) });
    };

    return (
        <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-800">All Invoices</h2>
                <input type="text" placeholder="Search invoices..." className="border rounded px-3 py-2 text-sm outline-none focus:border-blue-500" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">No invoices found.</div>
            ) : (
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b">
                        <tr>
                            <th className="p-3">Invoice #</th><th className="p-3">Client</th><th className="p-3">Date</th><th className="p-3">Amount</th><th className="p-3">Status</th><th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(inv => (
                            <tr key={inv.id} className="border-b hover:bg-slate-50">
                                <td className="p-3 font-medium">{inv.id}</td>
                                <td className="p-3">{inv.client}</td>
                                <td className="p-3">{inv.date}</td>
                                <td className="p-3 font-medium">{inv.amount.toFixed(2)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {inv.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-3">
                                    {inv.status !== 'paid' && <button onClick={() => markPaid(inv.id)} className="text-xs bg-slate-100 border px-3 py-1 rounded hover:bg-slate-200">Mark Paid</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}