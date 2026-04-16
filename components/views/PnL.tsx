"use client";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";

export default function PnL() {
    const { invoices, expenses, updateState } = useAppContext();
    const [form, setForm] = useState({ cat: "Rent", desc: "", amt: 0, date: new Date().toISOString().split('T')[0] });

    const rev = invoices.reduce((s, i) => s + i.amount, 0);
    const cogs = invoices.reduce((s, i) => s + (i.cogs || 0), 0);
    const gp = rev - cogs;
    const expTotal = expenses.reduce((s, e) => s + e.amt, 0);
    const netProfit = gp - expTotal;
    const gm = rev > 0 ? (gp / rev * 100) : 0;

    const addExpense = () => {
        if (!form.amt) return;
        updateState({ expenses: [...expenses, { ...form }] });
        setForm({ ...form, desc: "", amt: 0 });
    };

    return (
        <div>
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Revenue</div><div className="text-2xl font-bold text-green-600">{rev.toFixed(2)}</div></div>
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">COGS</div><div className="text-2xl font-bold text-red-600">{cogs.toFixed(2)}</div></div>
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Gross Profit</div><div className="text-2xl font-bold text-green-600">{gp.toFixed(2)}</div></div>
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Gross Margin</div><div className="text-2xl font-bold text-slate-800">{gm.toFixed(1)}%</div></div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Add Expense</h2>
                    <div className="flex flex-col gap-3 mb-6">
                        <select className="border p-2 rounded text-sm outline-none" value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}>
                            <option>Rent</option><option>Salaries</option><option>Utilities</option><option>Marketing</option><option>Other</option>
                        </select>
                        <input className="border p-2 rounded text-sm outline-none" placeholder="Description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
                        <div className="flex gap-2">
                            <input type="number" className="border p-2 rounded text-sm outline-none flex-1" placeholder="Amount" value={form.amt || ''} onChange={e => setForm({ ...form, amt: parseFloat(e.target.value) || 0 })} />
                            <button onClick={addExpense} className="bg-blue-600 text-white px-4 rounded text-sm font-medium hover:bg-blue-700">Add</button>
                        </div>
                    </div>
                    <div>
                        {expenses.map((e, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b text-sm">
                                <span><span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs mr-2">{e.cat}</span>{e.desc || '—'}</span>
                                <span className="font-medium text-red-600">-{e.amt.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border rounded-lg p-6 h-fit">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">P&L Summary</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm py-1 border-b"><span>Revenue</span><span className="text-green-600 font-medium">{rev.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm py-1 border-b"><span>COGS</span><span className="text-red-600 font-medium">-{cogs.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm py-1 border-b"><span>Gross Profit</span><span className={`font-medium ${gp >= 0 ? 'text-green-600' : 'text-red-600'}`}>{gp.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm py-1 border-b"><span>Operating Expenses</span><span className="text-red-600 font-medium">-{expTotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-base py-2 font-bold mt-2 border-t"><span>Net Profit</span><span className={netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>{netProfit.toFixed(2)}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}