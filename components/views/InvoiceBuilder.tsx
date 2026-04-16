"use client";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal, Plus, Settings2, Trash2 } from "lucide-react";

// Sortable Header Component
function SortableHeader({ column, children }: { column: any, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as const,
    };

    return (
        <th ref={setNodeRef} style={style} className={`block sm:table-cell p-2 sm:p-3 font-semibold text-slate-600 bg-white sm:bg-slate-50/80 rounded-lg sm:rounded-none border sm:border-transparent border-slate-200 group whitespace-nowrap shadow-sm sm:shadow-none ${isDragging ? 'shadow-xl bg-blue-50 ring-2 ring-blue-400 opacity-80' : ''}`}>
            <div className="flex items-center gap-2">
                <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 transition-colors bg-white p-1 rounded border border-slate-200 hover:border-slate-300 shadow-sm opacity-50 group-hover:opacity-100">
                    <GripHorizontal size={14} />
                </button>
                {children}
            </div>
        </th>
    );
}

export default function InvoiceBuilder() {
    const { columns, rows, updateState, addRow, updateRow, removeRow, settings, inventory, logoLeft, logoRight, invoices, invCounter } = useAppContext();
    const [discount, setDiscount] = useState(0);
    const [billTo, setBillTo] = useState("");
    const [customFieldLabel, setCustomFieldLabel] = useState("");

    const today = new Date().toISOString().split('T')[0];

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = columns.findIndex(col => col.id === active.id);
            const newIndex = columns.findIndex(col => col.id === over?.id);
            updateState({ columns: arrayMove(columns, oldIndex, newIndex) });
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (side === 'left') updateState({ logoLeft: ev.target?.result as string });
                else updateState({ logoRight: ev.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const addCustomField = () => {
        if (!customFieldLabel.trim()) return;
        const newId = `custom_${customFieldLabel.toLowerCase().replace(/\s+/g, '_')}`;
        // Ensure id doesn't already exist
        if (columns.find(c => c.id === newId)) return;

        const newCol = { id: newId, label: customFieldLabel, on: true, isCustom: true };
        const newColumns = [...columns];
        // Insert before action column if exists
        const actionIdx = newColumns.findIndex(c => c.id === 'action');
        if (actionIdx > -1) newColumns.splice(actionIdx, 0, newCol);
        else newColumns.push(newCol);

        updateState({ columns: newColumns });
        setCustomFieldLabel("");
    };

    let subtotal = rows.reduce((acc, row) => acc + (row.qty * row.price * (1 - row.disc / 100)), 0);
    let afterDisc = subtotal * (1 - discount / 100);
    let taxAmt = afterDisc * (settings.tax / 100);
    let total = afterDisc + taxAmt;

    const saveInvoice = () => {
        const inv = {
            id: `${settings.prefix}${String(invCounter).padStart(4, "0")}`,
            client: billTo || "—",
            date: today,
            amount: total,
            status: "unpaid",
            rows: [...rows],
            cogs: rows.reduce((s, r) => { const item = inventory.find(i => i.sku === r.sku); return s + (item ? item.cost * r.qty : 0); }, 0)
        };
        updateState({ invoices: [...invoices, inv], invCounter: invCounter + 1 });
        alert(`Invoice saved: ${inv.id}`);
    };

    return (
        <div className="bg-white border text-sm border-slate-100 rounded-2xl p-4 sm:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.02)]" id="invoice-card">
            
            <div className={`flex flex-col sm:flex-row justify-between items-start mb-8 sm:mb-12 gap-8 ${settings.logoPos === 'right' ? 'sm:flex-row-reverse sm:text-right' : ''}`}>
                <div className="w-full sm:flex-1">
                    <div className={`mb-4 flex ${settings.logoPos === 'right' ? 'sm:justify-end' : ''}`}>
                        {(settings.logoPos === 'left' ? logoLeft : logoRight) ? (
                            <img src={settings.logoPos === 'left' ? logoLeft! : logoRight!} className="max-h-16 cursor-pointer rounded-md border border-slate-100" onClick={() => document.getElementById(`logo-${settings.logoPos}-input`)?.click()} />
                        ) : (
                            <div className="border border-dashed border-slate-300 bg-slate-50/50 rounded-xl p-4 text-center cursor-pointer text-slate-400 w-40 hover:bg-slate-50 transition-colors" onClick={() => document.getElementById(`logo-${settings.logoPos}-input`)?.click()}>
                                <Plus size={20} className="mx-auto mb-1 text-slate-300" />
                                Add Logo
                            </div>
                        )}
                        <input type="file" id={`logo-${settings.logoPos}-input`} className="hidden" accept="image/*" onChange={(e) => handleLogoUpload(e, settings.logoPos as 'left'|'right')} />
                    </div>
                    <input className={`block font-bold text-2xl mb-1 outline-none w-full placeholder:text-slate-300 ${settings.logoPos === 'right' ? 'sm:text-right' : ''}`} defaultValue={settings.company} placeholder="Company Name" />
                    <input className={`block text-slate-400 outline-none w-full placeholder:text-slate-300 ${settings.logoPos === 'right' ? 'sm:text-right' : ''}`} placeholder="Company Address" />
                </div>
                
                <div className={`w-full sm:w-auto text-left sm:text-right ${settings.logoPos === 'right' ? 'sm:text-left' : ''}`}>
                    <div className={`flex items-center gap-3 mb-6 ${settings.logoPos === 'right' ? 'sm:justify-start sm:flex-row-reverse' : 'sm:justify-end'}`}>
                        <button onClick={() => updateState({ settings: { ...settings, logoPos: settings.logoPos === 'left' ? 'right' : 'left' } })} className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors border border-slate-100" title="Switch Logo Side">
                            <Settings2 size={16} />
                        </button>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tighter">INVOICE</h2>
                    </div>
                    <div className={`grid grid-cols-2 gap-3 items-center w-full sm:w-auto ${settings.logoPos === 'right' ? '' : 'sm:justify-items-end'}`}>
                        <span className="text-slate-400 font-semibold text-xs uppercase tracking-widest text-left sm:text-right">Invoice #</span>
                        <input className="border border-slate-200 p-2 rounded-lg bg-slate-50/80 w-full sm:w-32 outline-none focus:border-blue-400" value={`${settings.prefix}${String(invCounter).padStart(4, "0")}`} readOnly />
                        <span className="text-slate-400 font-semibold text-xs uppercase tracking-widest text-left sm:text-right">Date</span>
                        <input type="date" className="border border-slate-200 p-2 rounded-lg bg-slate-50/80 w-full sm:w-32 outline-none cursor-text focus:border-blue-400 text-slate-700" defaultValue={today} />
                    </div>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Billed To</label>
                    <input className="w-full border-b-2 border-slate-200 p-2 text-base outline-none focus:border-blue-500 transition-colors bg-transparent placeholder:text-slate-300 font-medium" placeholder="Client Name" value={billTo} onChange={e => setBillTo(e.target.value)} />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Client Address</label>
                    <input className="w-full border-b-2 border-slate-200 p-2 text-base outline-none focus:border-blue-500 transition-colors bg-transparent placeholder:text-slate-300" placeholder="123 Client St..." />
                </div>
            </div>

            <div className="mb-6 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-inner">
                <div className="w-full md:flex-1">
                    <div className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <Settings2 size={12}/> View Configurations
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {columns.filter(c => c.id !== 'action').map(c => (
                            <button key={c.id} onClick={() => {
                                const newCols = columns.map(col => col.id === c.id ? { ...col, on: !col.on } : col);
                                updateState({ columns: newCols });
                            }} className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all border ${c.on ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}>
                                {c.label} {c.isCustom && <span className="ml-1 opacity-60 text-[10px] font-normal border border-white/20 px-1 rounded-sm">Custom</span>}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-2 md:border-l border-t md:border-t-0 border-slate-200 md:pl-6 pt-4 md:pt-0 border-dashed">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full text-left md:text-right">Add Custom Column</div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input 
                            type="text" 
                            value={customFieldLabel}
                            onChange={(e) => setCustomFieldLabel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addCustomField()}
                            placeholder="e.g. Color, Size..." 
                            className="flex-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white font-medium"
                        />
                        <button onClick={addCustomField} className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="sm:hidden text-[10px] font-bold text-slate-400 mb-3 px-1 uppercase tracking-widest flex items-center gap-2">
                    <GripHorizontal size={12}/> Drag pills below to reorder fields
                </div>
                <DndContext id="invoice-builder-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <table className="w-full text-left border-collapse block sm:table">
                        <thead className="block sm:table-header-group text-xs uppercase tracking-wider mb-4 sm:mb-0 rounded-xl sm:rounded-none overflow-hidden bg-slate-50/50 sm:bg-transparent">
                            <tr className="flex flex-wrap sm:table-row p-3 gap-2 sm:gap-0 sm:p-0 sm:border-b sm:border-slate-200">
                                <SortableContext items={columns.filter(c => c.on).map(c => c.id)} strategy={rectSortingStrategy}>
                                    {columns.filter(c => c.on).map(c => (
                                        <SortableHeader key={c.id} column={c}>
                                            {c.label}
                                        </SortableHeader>
                                    ))}
                                </SortableContext>
                            </tr>
                        </thead>
                        <tbody className="block sm:table-row-group">
                            {rows.map((row, idx) => (
                                <tr key={idx} className="block sm:table-row border border-slate-200 sm:border-slate-100 sm:border-x-transparent sm:border-t-transparent sm:last:border-b-0 hover:bg-slate-50/30 sm:hover:bg-slate-50/60 transition-colors group p-4 sm:p-0 relative bg-white sm:bg-transparent rounded-2xl sm:rounded-none mb-4 sm:mb-0 shadow-[0_2px_10px_rgb(0,0,0,0.02)] sm:shadow-none">
                                    <td className="sm:hidden block absolute top-4 right-4 z-10 p-0 border-0">
                                         <button onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-all shadow-sm"><Trash2 size={16} /></button>
                                    </td>
                                    
                                    {columns.filter(c => c.on).map(c => (
                                        <td key={c.id} className={`block sm:table-cell p-0 sm:p-3 pb-3 sm:pb-3 ${c.id === 'action' ? 'hidden sm:table-cell' : 'border-b border-dashed border-slate-100 sm:border-0 mb-3 sm:mb-0 last:border-0 last:mb-0 last:pb-0'}`}>
                                            <div className="flex sm:block flex-col gap-1.5 sm:gap-0">
                                                <span className="sm:hidden text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                    {c.label}
                                                </span>
                                                <div className="w-full">
                                                    {c.id === 'sl' && <div className="text-slate-400 font-medium sm:text-center text-left sm:px-2">{idx + 1}</div>}
                                                    {c.id === 'sku' && <input className="w-full sm:w-24 bg-slate-50 sm:bg-transparent outline-none p-2.5 sm:p-2 font-medium focus:bg-white border border-slate-200 sm:border-transparent focus:border-blue-400 sm:focus:border-blue-200 rounded-xl sm:rounded-lg focus:shadow-sm transition-all" placeholder="SKU" value={row.sku} onChange={(e) => updateRow(idx, 'sku', e.target.value)} />}
                                                    {c.id === 'desc' && <input className="w-full min-w-0 sm:min-w-[150px] bg-slate-50 sm:bg-transparent outline-none p-2.5 sm:p-2 font-medium focus:bg-white border border-slate-200 sm:border-transparent focus:border-blue-400 sm:focus:border-blue-200 rounded-xl sm:rounded-lg focus:shadow-sm transition-all" placeholder="Description/Item details..." value={row.desc} onChange={(e) => updateRow(idx, 'desc', e.target.value)} />}
                                                    {c.id === 'qty' && <input type="number" className="w-full sm:w-20 bg-slate-50 sm:bg-transparent outline-none p-2.5 sm:p-2 font-medium focus:bg-white border border-slate-200 sm:border-transparent focus:border-blue-400 sm:focus:border-blue-200 rounded-xl sm:rounded-lg focus:shadow-sm transition-all" value={row.qty} onChange={(e) => updateRow(idx, 'qty', parseFloat(e.target.value) || 0)} />}
                                                    {c.id === 'price' && <input type="number" className="w-full sm:w-24 bg-slate-50 sm:bg-transparent outline-none p-2.5 sm:p-2 font-medium focus:bg-white border border-slate-200 sm:border-transparent focus:border-blue-400 sm:focus:border-blue-200 rounded-xl sm:rounded-lg focus:shadow-sm transition-all" value={row.price} onChange={(e) => updateRow(idx, 'price', parseFloat(e.target.value) || 0)} />}
                                                    {c.id === 'disc' && <input type="number" className="w-full sm:w-20 bg-slate-50 sm:bg-transparent outline-none p-2.5 sm:p-2 font-medium focus:bg-white border border-slate-200 sm:border-transparent focus:border-blue-400 sm:focus:border-blue-200 rounded-xl sm:rounded-lg focus:shadow-sm transition-all" value={row.disc} onChange={(e) => updateRow(idx, 'disc', parseFloat(e.target.value) || 0)} />}
                                                    {c.id === 'total' && <div className="font-bold text-slate-700 text-lg sm:text-base sm:px-2">{(row.qty * row.price * (1 - row.disc / 100)).toFixed(2)}</div>}
                                                    {c.id === 'action' && <button onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>}
                                                    {c.isCustom && <input className="w-full sm:w-28 bg-slate-50 sm:bg-transparent outline-none p-2.5 sm:p-2 font-medium focus:bg-white border border-slate-200 sm:border-transparent focus:border-blue-400 sm:focus:border-blue-200 rounded-xl sm:rounded-lg focus:shadow-sm transition-all text-blue-600 placeholder:text-blue-200" placeholder="—" value={row[c.id] || ''} onChange={(e) => updateRow(idx, c.id as any, e.target.value)} />}
                                                </div>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DndContext>
            </div>

            <button onClick={addRow} className="group flex items-center gap-2 mb-12 px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm">
                <div className="bg-white p-1 rounded-md shadow-sm border border-slate-100 text-slate-600 group-hover:scale-110 transition-transform"><Plus size={14} /></div>
                Add Line Item
            </button>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:flex-1">
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Notes / Terms</label>
                    <textarea className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl p-5 text-sm outline-none focus:border-blue-500 focus:bg-white focus:shadow-md transition-all resize-none" rows={5} defaultValue={settings.notes} placeholder="Payment details, shipping instructions..."></textarea>
                </div>
                <div className="w-full md:w-80 lg:w-96 bg-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-end">
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex justify-between text-sm items-center"><span className="text-slate-400 font-medium">Subtotal</span><span className="font-semibold text-lg">{subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-slate-400 font-medium">Discount %</span>
                            <div className="relative">
                                <input type="number" className="w-20 bg-white/10 border border-white/20 rounded-lg p-2 text-right outline-none focus:border-white focus:bg-white/20 text-white font-medium transition-all" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} />
                            </div>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-slate-400 font-medium">Tax %</span>
                            <div className="relative">
                                <input type="number" className="w-20 bg-white/5 border border-white/10 rounded-lg p-2 text-right outline-none text-slate-300 cursor-not-allowed" value={settings.tax} readOnly />
                            </div>
                        </div>
                        <div className="flex justify-between pt-5 border-t border-white/10 mt-2 text-xl sm:text-2xl font-black tracking-tight">
                            <span>Total</span>
                            <span>{settings.currency} {total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 sm:mt-10 flex justify-end">
                <button onClick={saveInvoice} className="w-full sm:w-auto flex justify-center items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-1">
                    💾 Save & Generate Invoice
                </button>
            </div>
        </div>
    );
}