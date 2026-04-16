"use client";
import { useAppContext } from "@/context/AppContext";

export default function Settings() {
    const { settings, updateState } = useAppContext();

    const handleUpdate = (field: keyof typeof settings, value: any) => {
        updateState({ settings: { ...settings, [field]: value } });
    };

    return (
        <div className="bg-white border rounded-lg p-6 max-w-3xl">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Company & Branding Settings</h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Company Name</label>
                    <input className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" value={settings.company} onChange={e => handleUpdate('company', e.target.value)} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                    <input className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" placeholder="+1 555 0000" value={settings.phone} onChange={e => handleUpdate('phone', e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Logo Position</label>
                    <select className="w-full border p-2 rounded text-sm outline-none bg-white" value={settings.logoPos} onChange={e => handleUpdate('logoPos', e.target.value)}>
                        <option value="left">Left</option><option value="right">Right</option><option value="both">Both sides</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Currency</label>
                    <select className="w-full border p-2 rounded text-sm outline-none bg-white" value={settings.currency} onChange={e => handleUpdate('currency', e.target.value)}>
                        <option>USD</option><option>EUR</option><option>GBP</option><option>BDT</option><option>AED</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Default Tax %</label>
                    <input type="number" className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" value={settings.tax} onChange={e => handleUpdate('tax', parseFloat(e.target.value) || 0)} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Invoice Prefix</label>
                    <input className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" value={settings.prefix} onChange={e => handleUpdate('prefix', e.target.value)} />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Default Notes</label>
                    <textarea className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500" rows={3} value={settings.notes} onChange={e => handleUpdate('notes', e.target.value)} placeholder="Thank you for your business!"></textarea>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded text-sm text-blue-800 flex items-start gap-2">
                ℹ️ Logo upload is available directly on the New Invoice builder page.
            </div>
        </div>
    );
}