// ============================================================
// Property Management CRM — Constants & Enums
// ============================================================

// --- Lead ---
export const LEAD_SOURCES = ['Website', 'Referral', 'Social Media', 'Walk-in', 'Google Ads', 'Broker', 'Cold Call', 'Other'] as const;
export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Unqualified', 'Converted'] as const;
export const OWNER_TYPES = ['Individual', 'Company', 'NRI'] as const;
export const SERVICES = ['Tenant Finding', 'Rent Collection', 'Maintenance', 'Full Management'] as const;

// --- Property ---
export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Commercial', 'Warehouse', 'Plot'] as const;

// --- Unit ---
export const BHK_TYPES = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Studio', 'Duplex'] as const;
export const FURNISHING_STATUSES = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'] as const;
export const OCCUPANCY_STATUSES = ['Vacant', 'Occupied', 'Under Maintenance'] as const;

// --- Tenant ---
export const TENANT_STATUSES = ['Active', 'Renewed', 'Vacating Soon', 'Vacated'] as const;

// --- Rent ---
export const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Online'] as const;
export const RENT_STATUSES = ['Paid', 'Pending', 'Overdue'] as const;

// --- Maintenance ---
export const ISSUE_CATEGORIES = ['Plumbing', 'Electrical', 'HVAC', 'Structural', 'Appliance', 'Pest Control', 'Other'] as const;
export const MAINTENANCE_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
export const MAINTENANCE_STATUSES = ['Open', 'In Progress', 'Completed'] as const;

// --- Expenses ---
export const EXPENSE_TYPES = [
  'EB Bill',
  'Water Bill',
  'Association Charges',
  'Security Charges',
  'Cleaning Charges',
  'Property Tax',
  'Insurance',
  'Misc',
] as const;

export const EXPENSE_STATUSES = ['Paid', 'Pending'] as const;

// --- Documents ---
export const DOCUMENT_CATEGORIES = [
  'image', 'video', 'document', 'aadhaar', 'pan', 'passport',
  'sale_deed', 'tax_receipt', 'noc', 'floor_plan',
] as const;

// --- Status Colors ---
export const STATUS_COLORS: Record<string, string> = {
  // Lead
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Contacted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  Qualified: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  Converted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  Unqualified: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',

  // Occupancy
  Vacant: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  Occupied: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Under Maintenance': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',

  // Tenant
  Active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  Renewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'Vacating Soon': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Vacated: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',

  // Rent
  Paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',

  // Maintenance Priority
  Low: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  High: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',

  // Maintenance Status
  Open: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'In Progress': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  Completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',

  // Deposit
  Settled: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
};

// --- Pagination ---
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// --- Navigation ---
export const NAV_ITEMS = [
  { title: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { title: 'Leads', href: '/leads', icon: 'UserPlus' },
  { title: 'Accounts', href: '/accounts', icon: 'Users' },
  { title: 'Contacts', href: '/contacts', icon: 'Contact' },
  { title: 'Properties', href: '/properties', icon: 'Building2' },
  { title: 'Units', href: '/units', icon: 'DoorOpen' },
  { title: 'Unit Board', href: '/units/board', icon: 'Kanban' },
  { title: 'Tenants', href: '/tenants', icon: 'UserCheck' },
  { title: 'Rent Collection', href: '/rent-collection', icon: 'IndianRupee' },
  { title: 'Maintenance', href: '/maintenance', icon: 'Wrench' },
  { title: 'Expenses', href: '/expenses', icon: 'Receipt' },
] as const;

// --- Currency ---
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_LOCALE = 'en-IN';
