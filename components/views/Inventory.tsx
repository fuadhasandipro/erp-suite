"use client";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";

export default function Inventory() {
    const { inventory, updateState } = useAppContext();
    const [form, setForm] = useState({ sku: "", name: "", cost: 0, price: 0, qty: 0, cat: "" });

    const add = () => {
        if (!form.name) return;
        const item = { ...form, sku: form.sku || `SKU-${String(inventory.length + 1).padStart(3, "0")}` };
        updateState({ inventory: [...inventory, item] });
        setForm({ sku: "", name: "", cost: 0, price: 0, qty: 0, cat: "" });
    };

    const totalValue = inventory.reduce((s, i) => s + (i.price * i.qty), 0);
    const lowStock = inventory.filter(i => i.qty < 5).length;
    const categories = new Set(inventory.map(i => i.cat)).size;

    return (
        <div>
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Total SKUs</div><div className="text-2xl font-bold text-blue-600">{inventory.length}</div></div>
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Total Value</div><div className="text-2xl font-bold text-green-600">{totalValue.toFixed(0)}</div></div>
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Low Stock Items</div><div className="text-2xl font-bold text-amber-600">{lowStock}</div></div>
                <div className="bg-white p-4 rounded-lg border shadow-sm"><div className="text-xs text-slate-500 mb-1">Categories</div><div className="text-2xl font-bold text-slate-800">{categories}</div></div>
            </div>

            <div className="bg-white rounded-lg border p-6">
                <div className="flex gap-2 mb-6">
                    <input className="border p-2 rounded text-sm w-24 outline-none" placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
                    <input className="border p-2 rounded text-sm flex-1 outline-none" placeholder="Item Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input type="number" className="border p-2 rounded text-sm w-24 outline-none" placeholder="Cost" value={form.cost || ''} onChange={e => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })} />
                    <input type="number" className="border p-2 rounded text-sm w-24 outline-none" placeholder="Price" value={form.price || ''} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
                    <input type="number" className="border p-2 rounded text-sm w-20 outline-none" placeholder="Qty" value={form.qty || ''} onChange={e => setForm({ ...form, qty: parseInt(e.target.value) || 0 })} />
                    <input className="border p-2 rounded text-sm w-32 outline-none" placeholder="Category" value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })} />
                    <button onClick={add} className="bg-blue-600 text-white px-4 rounded text-sm font-medium hover:bg-blue-700">Add</button>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 border-b">
                        <tr><th className="p-3">SKU</th><th className="p-3">Name</th><th className="p-3">Cost</th><th className="p-3">Price</th><th className="p-3">Qty</th><th className="p-3">Category</th><th className="p-3">Status</th></tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.sku} className="border-b hover:bg-slate-50">
                                <td className="p-3 text-slate-400">{item.sku}</td>
                                <td className="p-3 font-medium">{item.name}</td>
                                <td className="p-3">{item.cost.toFixed(2)}</td>
                                <td className="p-3">{item.price.toFixed(2)}</td>
                                <td className="p-3">{item.qty}</td>
                                <td className="p-3"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{item.cat || 'General'}</span></td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${item.qty < 1 ? 'bg-red-100 text-red-700' : item.qty < 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                        {item.qty < 1 ? 'Out of stock' : item.qty < 5 ? 'Low stock' : 'In stock'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}