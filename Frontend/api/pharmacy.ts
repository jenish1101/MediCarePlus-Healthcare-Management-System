import { api } from '@/lib/api';
import { mapInventory, mapOrder, BackendInventory, BackendOrder } from '@/lib/mappers';
import { OrderMedicine } from '@/types';

export type { BackendInventory, BackendOrder };
export { mapInventory, mapOrder };

// ---- Inventory ----

export function listInventory(lowStockOnly?: boolean) {
  return api.get<BackendInventory[]>('/pharmacy/inventory', lowStockOnly ? { low_stock: true } : undefined);
}

export interface AddInventoryInput {
  medicine_name: string;
  batch_number: string;
  quantity: number;
  expiry_date: string;
  supplier: string;
  price: number;
}

/** pharmacist/admin. */
export function addInventoryItem(body: AddInventoryInput) {
  return api.post<BackendInventory>('/pharmacy/inventory', body);
}

// ---- Orders ----

/** Scoped server-side: a patient's own orders, or all orders for pharmacist/admin. */
export function listOrders() {
  return api.get<BackendOrder[]>('/pharmacy/orders');
}

export interface CreateOrderInput {
  medicines: OrderMedicine[];
  address: string;
  prescription_id?: string;
}

/** Patient only. */
export function createOrder(body: CreateOrderInput) {
  return api.post<BackendOrder>('/pharmacy/orders', body);
}

/** pharmacist/admin. `status` is sent as a query param per the backend's signature. */
export function updateOrderStatus(id: string, status: string) {
  return api.patch<BackendOrder>(`/pharmacy/orders/${id}/status`, undefined, { status_value: status });
}

// ---- Fulfillment (dispensing workflow) ----

export type FulfillmentStatus = 'pending' | 'dispensing' | 'dispensed';

export interface FulfillmentRx {
  id: string;
  rxId: string;
  patientName: string;
  doctorName: string;
  date: string;
  medicines: string[];
  status: FulfillmentStatus;
}

export interface BackendFulfillment {
  id: string;
  rx_id: string;
  prescription_id: string;
  patient_name: string;
  doctor_name: string;
  date: string;
  medicines: string[];
  status: FulfillmentStatus;
}

export function mapFulfillment(f: BackendFulfillment): FulfillmentRx {
  return {
    id: f.id,
    rxId: f.rx_id,
    patientName: f.patient_name,
    doctorName: f.doctor_name,
    date: f.date,
    medicines: f.medicines,
    status: f.status
  };
}

/** pharmacist only. */
export function listFulfillment() {
  return api.get<BackendFulfillment[]>('/pharmacy/fulfillment');
}

export function advanceFulfillment(id: string) {
  return api.post<BackendFulfillment>(`/pharmacy/fulfillment/${id}/advance`);
}

// ---- Purchase orders ----

export type PurchaseOrderStatus = 'draft' | 'ordered' | 'shipped' | 'received';

export interface PurchaseOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  items: PurchaseOrderItem[];
  total: number;
  orderDate: string;
  expectedDelivery: string;
  status: PurchaseOrderStatus;
}

export interface BackendPurchaseOrderItem {
  name: string;
  quantity: number;
  unit_price: number;
}

export interface BackendPurchaseOrder {
  id: string;
  supplier: string;
  items: BackendPurchaseOrderItem[];
  total: number;
  order_date: string;
  expected_delivery: string;
  status: PurchaseOrderStatus;
}

export function mapPurchaseOrder(o: BackendPurchaseOrder): PurchaseOrder {
  return {
    id: o.id,
    supplier: o.supplier,
    items: o.items.map((it) => ({ name: it.name, quantity: it.quantity, unitPrice: it.unit_price })),
    total: o.total,
    orderDate: o.order_date,
    expectedDelivery: o.expected_delivery,
    status: o.status
  };
}

/** pharmacist only. */
export function listPurchaseOrders() {
  return api.get<BackendPurchaseOrder[]>('/pharmacy/purchase-orders');
}

export interface CreatePurchaseOrderInput {
  supplier: string;
  items: BackendPurchaseOrderItem[];
  order_date: string;
  expected_delivery: string;
}

export function createPurchaseOrder(body: CreatePurchaseOrderInput) {
  return api.post<BackendPurchaseOrder>('/pharmacy/purchase-orders', body);
}

// ---- Returns ----

export type ReturnStatus = 'pending' | 'approved' | 'refunded' | 'rejected';

export interface ReturnRequest {
  id: string;
  orderId: string;
  patientName: string;
  medicines: string[];
  amount: number;
  reason: string;
  requestDate: string;
  status: ReturnStatus;
}

export interface BackendReturn {
  id: string;
  order_id: string;
  patient_name: string;
  medicines: string[];
  amount: number;
  reason: string;
  request_date: string;
  status: ReturnStatus;
}

export function mapReturn(r: BackendReturn): ReturnRequest {
  return {
    id: r.id,
    orderId: r.order_id,
    patientName: r.patient_name,
    medicines: r.medicines,
    amount: r.amount,
    reason: r.reason,
    requestDate: r.request_date,
    status: r.status
  };
}

/** pharmacist only. */
export function listReturns() {
  return api.get<BackendReturn[]>('/pharmacy/returns');
}

/** `status` is sent as a query param per the backend's signature. */
export function updateReturnStatus(id: string, status: ReturnStatus) {
  return api.patch<BackendReturn>(`/pharmacy/returns/${id}/status`, undefined, { status_value: status });
}

// ---- Suppliers ----

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  productsCount: number;
}

export interface BackendSupplier {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  products_count: number;
}

export function mapSupplier(s: BackendSupplier): Supplier {
  return {
    id: s.id,
    name: s.name,
    email: s.contact_email,
    phone: s.contact_phone,
    address: s.address,
    productsCount: s.products_count
  };
}

/** pharmacist/admin. */
export function listSuppliers() {
  return api.get<BackendSupplier[]>('/pharmacy/suppliers');
}

// ---- Expiry alerts ----

export type ExpiryAlertType = 'expired' | 'expiring_soon' | 'low_stock';

export interface ExpiryAlert {
  id: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  isLowStock: boolean;
  isExpiring: boolean;
  isExpired: boolean;
}

export interface BackendExpiryAlert {
  id: string;
  medicine_name: string;
  batch_number: string;
  quantity: number;
  expiry_date: string;
  alert_type: ExpiryAlertType;
}

export function mapExpiryAlert(a: BackendExpiryAlert): ExpiryAlert {
  return {
    id: a.id,
    medicineName: a.medicine_name,
    batchNumber: a.batch_number,
    quantity: a.quantity,
    expiryDate: a.expiry_date,
    isLowStock: a.alert_type === 'low_stock',
    isExpiring: a.alert_type === 'expiring_soon' || a.alert_type === 'expired',
    isExpired: a.alert_type === 'expired'
  };
}

/** pharmacist/admin. */
export function listExpiryAlerts() {
  return api.get<BackendExpiryAlert[]>('/pharmacy/expiry-alerts');
}

// ---- Sales summary ----

export interface MonthlySalesPoint {
  month: string;
  sales: number;
}

export interface TopSeller {
  name: string;
  units: number;
  revenue: number;
}

export interface SalesSummary {
  monthly_sales: number;
  growth_percent: number;
  total_orders: number;
  units_sold: number;
  monthly: MonthlySalesPoint[];
  top_sellers: TopSeller[];
}

/** pharmacist/admin. */
export function getSalesSummary() {
  return api.get<SalesSummary>('/pharmacy/sales');
}
