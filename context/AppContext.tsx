"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { AppState, Row, Invoice, InventoryItem, Expense, RepairJob } from "../types";

interface AppContextType extends AppState {
    setActiveTab: (tab: string) => void;
    updateState: (updates: Partial<AppState>) => void;
    addRow: () => void;
    updateRow: (idx: number, field: keyof Row, value: any) => void;
    removeRow: (idx: number) => void;
}

const defaultState: AppState = {
    activeTab: "invoice",
    invoices: [],
    inventory: [],
    expenses: [],
    repairs: [],
    columns: [
        { id: "sl", label: "SL", on: true },
        { id: "sku", label: "SKU", on: true },
        { id: "desc", label: "Description", on: true },
        { id: "qty", label: "Qty", on: true },
        { id: "unit", label: "Unit", on: false },
        { id: "price", label: "Unit price", on: true },
        { id: "disc", label: "Disc %", on: false },
        { id: "total", label: "Total", on: true },
        { id: "action", label: "", on: true },
    ],
    customFields: [],
    rows: [{ sku: "", desc: "", qty: 1, price: 0, unit: "", disc: 0 }],
    logoLeft: null,
    logoRight: null,
    invCounter: 1,
    settings: {
        company: "Acme Trading Co.",
        email: "",
        phone: "",
        logoPos: "left",
        currency: "USD",
        tax: 0,
        prefix: "INV-",
        notes: "",
    },
    isMobileMenuOpen: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AppState>(defaultState);

    const updateState = (updates: Partial<AppState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const addRow = () => {
        setState((prev) => ({
            ...prev,
            rows: [...prev.rows, { sku: "", desc: "", qty: 1, price: 0, unit: "", disc: 0 }],
        }));
    };

    const updateRow = (idx: number, field: keyof Row, value: any) => {
        setState((prev) => {
            const newRows = [...prev.rows];
            newRows[idx] = { ...newRows[idx], [field]: value };

            // Autofill logic
            if (field === 'sku') {
                const item = prev.inventory.find(i => i.sku === value);
                if (item) {
                    newRows[idx].desc = item.name;
                    newRows[idx].price = item.price;
                }
            }
            return { ...prev, rows: newRows };
        });
    };

    const removeRow = (idx: number) => {
        setState((prev) => ({
            ...prev,
            rows: prev.rows.filter((_, i) => i !== idx),
        }));
    };

    return (
        <AppContext.Provider value={{ ...state, setActiveTab: (tab) => updateState({ activeTab: tab }), updateState, addRow, updateRow, removeRow }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within an AppProvider");
    return context;
};