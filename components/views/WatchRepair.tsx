"use client";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";

const COLORS = [
    { name: 'Silver', hex: '#C0C0C0' }, { name: 'Gold', hex: '#FFD700' }, { name: 'Black PVD', hex: '#1A1A1A' },
    { name: 'Rose gold', hex: '#B87333' }, { name: 'Blue DLC', hex: '#4169E1' }, { name: 'Green', hex: '#228B22' }, { name: 'Red', hex: '#8B0000' }
];

export default function WatchRepair() {
    const { repairs, updateState } = useAppContext();
    const [form, setForm] = useState({ cust: "", watch: "", issue: "", type: "Full service", cost: 0, price: 0, status: "open", color: "" });

    const add = () => {
        if (!form.cust) return;
        const job = { id: `REP-${String(repairs.length + 1).padStart(3, "0")}`, customer: form.cust, watch: form.watch, issue: form.issue, type: form.type, cost: form.cost, price: form.price, status: form.status, color: form.color, date: new Date().toISOString().split('T')[0] };
        updateState({ repairs: [...repairs, job] });
        setForm({ ...form, cust: "", watch: "", issue: "", cost: 0, price: 0 });
    };

    const updateStatus = (id: string, status: string) => {
        updateState({ repairs: repairs.map(r => r.id === id ? { ...r, status } : r) });
    };

    return (
        <div>
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Open Jobs</div><div className="text-2xl font-bold text-blue-600">{repairs.filter(r => r.status === 'open').length}</div></div>
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">In Progress</div><div className="text-2xl font-bold text-amber-600">{repairs.filter(r => r.status === 'in-progress' || r.status === 'waiting-parts').length}</div></div>
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Completed</div><div className="text-2xl font-bold text-green-600">{repairs.filter(r => r.status === 'done').length}</div></div>
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Revenue</div><div className="text-2xl font-bold text-slate-800">${repairs.filter(r => r.status === 'done').reduce((s, r) => s + r.price, 0).toFixed(2)}</div></div>
            </div>

            <div className="bg-white border rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">New Repair Job</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <input className="border p-2 rounded text-sm outline-none" placeholder="Customer Name" value={form.cust} onChange={e => setForm({ ...form, cust: e.target.value })} />
                    <input className="border p-2 rounded text-sm outline-none" placeholder="Watch Brand/Model" value={form.watch} onChange={e => setForm({ ...form, watch: e.target.value })} />
                    <input className="border p-2 rounded text-sm outline-none" placeholder="Issue" value={form.issue} onChange={e => setForm({ ...form, issue: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4 items-end">
                    <select className="border p-2 rounded text-sm outline-none" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option>Full service</option><option>Battery replacement</option><option>Crystal replacement</option><option>Polishing</option>
                    </select>
                    <input type="number" className="border p-2 rounded text-sm outline-none" placeholder="Cost Quote" value={form.cost || ''} onChange={e => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })} />
                    <input type="number" className="border p-2 rounded text-sm outline-none" placeholder="Price Quote" value={form.price || ''} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
                    <button onClick={add} className="bg-blue-600 text-white p-2 rounded text-sm font-medium hover:bg-blue-700">Add Job</button>
                </div>
                <div className="flex gap-2 items-center">
                    <span className="text-xs text-slate-500 font-medium mr-2">Color/Finish:</span>
                    {COLORS.map(c => (
                        <div key={c.name} onClick={() => setForm({ ...form, color: c.name })} className={`w-6 h-6 rounded-full cursor-pointer border-2 ${form.color === c.name ? 'border-blue-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} title={c.name}></div>
                    ))}
                </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Repair Jobs</h2>
                {repairs.length === 0 ? <div className="text-sm text-slate-500 text-center py-6">No repair jobs yet.</div> : (
                    <div className="space-y-3">
                        {[...repairs].reverse().map((job) => (
                            <div key={job.id} className="border p-4 rounded flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div>
                                    <div className="font-medium text-slate-800">{job.customer} <span className="text-slate-400 font-normal ml-2">{job.watch}</span></div>
                                    <div className="text-sm text-slate-500 mt-1">{job.type} {job.issue && `· ${job.issue}`}</div>
                                    <div className="mt-2 flex gap-2 items-center text-xs">
                                        <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded">{job.date}</span>
                                        {job.color && <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.find(c => c.name === job.color)?.hex }}></div>{job.color}</span>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-500">Cost: ${job.cost.toFixed(2)}</div>
                                    <div className="font-bold text-lg mb-2 text-slate-800">${job.price.toFixed(2)}</div>
                                    <select className="border p-1 rounded text-xs bg-white outline-none" value={job.status} onChange={(e) => updateStatus(job.id, e.target.value)}>
                                        <option value="open">Open</option><option value="in-progress">In Progress</option><option value="waiting-parts">Waiting Parts</option><option value="done">Done</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}