import { api } from '@/lib/api';

// ---- Products ----

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  unitPrice: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface BackendProduct {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  unit_price: number;
  status: Product['status'];
}

export function mapProduct(p: BackendProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    sku: p.sku,
    stock: p.stock,
    unitPrice: p.unit_price,
    status: p.status
  };
}

/** supplier only — their own products. */
export function listSupplierProducts() {
  return api.get<BackendProduct[]>('/supplier/products');
}

// ---- Orders ----

export interface SupplyOrder {
  id: string;
  poNumber: string;
  hospital: string;
  items: string;
  total: number;
  ordered: string;
  status: string;
}

export interface BackendSupplierOrderItem {
  name?: string;
  qty?: number;
  quantity?: number;
}

export interface BackendSupplierOrder {
  id: string;
  total: number;
  status: string;
  order_date: string;
  items: BackendSupplierOrderItem[];
}

function formatItems(items: BackendSupplierOrderItem[]): string {
  if (!items || items.length === 0) return 'No items';
  return items
    .map((it) => {
      const name = it.name ?? 'Item';
      const qty = it.qty ?? it.quantity;
      return qty !== undefined ? `${name} x ${qty}` : name;
    })
    .join(', ');
}

export function mapSupplierOrder(o: BackendSupplierOrder): SupplyOrder {
  return {
    id: o.id,
    poNumber: `PO-${o.id.slice(-6).toUpperCase()}`,
    hospital: 'MediCare Plus Pharmacy',
    items: formatItems(o.items),
    total: o.total,
    ordered: o.order_date,
    status: o.status
  };
}

/** supplier only — their own orders. */
export function listSupplierOrders() {
  return api.get<BackendSupplierOrder[]>('/supplier/orders');
}
