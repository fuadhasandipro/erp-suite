export interface Column { id: string; label: string; on: boolean; isCustom?: boolean; }
export interface Row { sku: string; desc: string; qty: number; unit: string; price: number; disc: number; [key: string]: any; }
export interface Invoice { id: string; client: string; date: string; amount: number; status: string; rows: Row[]; cogs: number; }
export interface InventoryItem { sku: string; name: string; cost: number; price: number; qty: number; cat: string; }
export interface Expense { cat: string; desc: string; amt: number; date: string; }
export interface RepairJob { id: string; customer: string; watch: string; issue: string; type: string; cost: number; price: number; status: string; color: string; date: string; }
export interface CustomField { name: string; value: string; }

export interface AppState {
    activeTab: string;
    invoices: Invoice[];
    inventory: InventoryItem[];
    expenses: Expense[];
    repairs: RepairJob[];
    columns: Column[];
    customFields: CustomField[];
    rows: Row[];
    logoLeft: string | null;
    logoRight: string | null;
    invCounter: number;
    settings: {
        company: string;
        email: string;
        phone: string;
        logoPos: string;
        currency: string;
        tax: number;
        prefix: string;
        notes: string;
    };
    isMobileMenuOpen: boolean;
}