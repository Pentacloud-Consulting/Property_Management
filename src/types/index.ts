// ============================================================
// Property Management CRM — TypeScript Interfaces
// ============================================================

// --- Common Types ---
export interface MediaItem {
  url: string;
  publicId: string;
  caption?: string;
}

export interface DocumentItem {
  url: string;
  publicId: string;
  name?: string;
  type?: string;
}

export interface MeterReading {
  electricity: string;
  water: string;
  gas: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// --- Lead ---
export type LeadSource = 'Website' | 'Referral' | 'Social Media' | 'Walk-in' | 'Other';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export interface ILead {
  _id: string;
  leadName: string;
  mobileNumber: string;
  email?: string;
  source: LeadSource;
  notes?: string;
  status: LeadStatus;
  convertedToOwnerId?: string | null;
  convertedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// --- Property Owner ---
export interface IAccount {
  _id: string;
  accountName: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  notes?: string;
  leadId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Virtual/populated fields
  _propertyCount?: number;
  _unitCount?: number;
  _occupiedUnits?: number;
  _monthlyRevenue?: number;
}

// --- Property ---
export type PropertyType = 'Apartment' | 'Villa' | 'Commercial' | 'Warehouse' | 'Plot';

export interface IProperty {
  _id: string;
  accountId: string | IAccount;
  propertyName: string;
  propertyType: PropertyType;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  totalFloors?: number;
  totalUnits?: number;
  description?: string;
  media: {
    images: MediaItem[];
    videos: MediaItem[];
    documents: DocumentItem[];
  };
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  _occupancyRate?: number;
  _vacantUnits?: number;
  _pendingMaintenance?: number;
}

// --- Unit ---
export type BHKType = '1 RK' | '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | 'Studio' | 'Duplex';
export type FurnishingStatus = 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
export type OccupancyStatus = 'Vacant' | 'Occupied' | 'Under Maintenance';

export interface IUnit {
  _id: string;
  propertyId: string | IProperty;
  unitNumber: string;
  bhkType?: BHKType;
  unitSize?: number;
  floorNumber?: number;
  furnishingStatus?: FurnishingStatus;
  monthlyRent: number;
  securityDeposit?: number;
  occupancyStatus: OccupancyStatus;
  currentTenantId?: string | null;
  media: {
    photos: MediaItem[];
    videos: MediaItem[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// --- Tenant ---
export type TenantStatus = 'Active' | 'Renewed' | 'Vacating Soon' | 'Vacated';
export type DepositSettlementStatus = 'Pending' | 'Settled';

export interface IMoveInChecklist {
  tenantRegistration: boolean;
  kycVerification: boolean;
  securityDepositCollected: boolean;
  advanceRentCollected: boolean;
  propertyInspection: boolean;
  utilityMeterReading: boolean;
  photoUpload: boolean;
  videoUpload: boolean;
  confirmed: boolean;
}

export interface IMoveOutChecklist {
  exitInspection: boolean;
  damageAssessment: boolean;
  utilityMeterReading: boolean;
  paintingChargesAssessed: boolean;
  cleaningChargesAssessed: boolean;
  serviceChargesAssessed: boolean;
  deductionCalculated: boolean;
  depositSettled: boolean;
  finalPhotoUpload: boolean;
  finalVideoUpload: boolean;
  confirmed: boolean;
}

export interface IMoveInData {
  date: Date;
  depositAmount?: number;
  advanceRent?: number;
  meterReading?: MeterReading;
  inspectionNotes?: string;
  entryPhotos: MediaItem[];
  entryVideos: MediaItem[];
  checklist: IMoveInChecklist;
}

export interface IMoveOutData {
  date?: Date | null;
  reason?: string;
  meterReading?: MeterReading;
  inspectionNotes?: string;
  exitPhotos: MediaItem[];
  exitVideos: MediaItem[];
  checklist: IMoveOutChecklist;
}

export interface IDepositSettlement {
  securityDeposit: number;
  damageCharges: number;
  paintingCharges: number;
  cleaningCharges: number;
  serviceCharges: number;
  utilityCharges: number;
  totalDeductions: number;
  refundAmount: number;
  settlementDate?: Date | null;
  status: DepositSettlementStatus;
}

export interface IRenewalHistoryEntry {
  renewedAt: Date;
  previousExpectedVacateDate: Date;
  newExpectedVacateDate: Date;
}

export interface ITenantDocuments {
  aadhaarCopy: MediaItem[];
  panCopy: MediaItem[];
  passport: MediaItem[];
  photos: MediaItem[];
  otherDocuments: DocumentItem[];
}

export interface ITenant {
  _id: string;
  unitId: string | IUnit;
  propertyId: string | IProperty;
  tenantName: string;
  mobileNumber: string;
  email?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  occupation?: string;
  companyName?: string;
  emergencyContact?: string;
  status: TenantStatus;
  occupancyStartDate?: Date;
  expectedVacateDate?: Date | null;
  renewalHistory: IRenewalHistoryEntry[];
  moveIn: IMoveInData;
  moveOut: IMoveOutData;
  depositSettlement: IDepositSettlement;
  documents: ITenantDocuments;
  createdAt: Date;
  updatedAt: Date;
}

// --- Rent Collection ---
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Online';
export type RentStatus = 'Paid' | 'Pending' | 'Overdue';

export interface IRentCollection {
  _id: string;
  tenantId: string | ITenant;
  unitId: string | IUnit;
  propertyId: string | IProperty;
  rentAmount: number;
  dueDate: Date;
  paymentDate?: Date | null;
  paymentMethod?: PaymentMethod;
  transactionReference?: string;
  status: RentStatus;
  month: number;
  year: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Maintenance ---
export type IssueCategory = 'Plumbing' | 'Electrical' | 'HVAC' | 'Structural' | 'Appliance' | 'Pest Control' | 'Other';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type MaintenanceStatus = 'Open' | 'In Progress' | 'Completed';

export interface IMaintenanceRequest {
  _id: string;
  ticketNumber: string;
  propertyId: string | IProperty;
  unitId: string | IUnit;
  tenantId?: string | ITenant | null;
  issueCategory: IssueCategory;
  description: string;
  priority: MaintenancePriority;
  cost?: number;
  status: MaintenanceStatus;
  media: {
    beforeImages: MediaItem[];
    afterImages: MediaItem[];
  };
  resolvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// --- Property Expenses ---
export type ExpenseType =
  | 'EB Bill'
  | 'Water Bill'
  | 'Association Charges'
  | 'Security Charges'
  | 'Cleaning Charges'
  | 'Property Tax'
  | 'Insurance'
  | 'Misc';

export type ExpenseStatus = 'Paid' | 'Pending';

export interface IPropertyExpense {
  _id: string;
  propertyId: string | IProperty;
  unitId?: string | IUnit | null;
  expenseType: ExpenseType;
  amount: number;
  expenseDate: Date;
  paidDate?: Date | null;
  notes?: string;
  attachment?: {
    url: string;
    publicId: string;
    fileName: string;
  } | null;
  status: ExpenseStatus;
  createdAt: Date;
  updatedAt: Date;
}

// --- Unit History ---
export interface IUnitHistory {
  _id: string;
  unitId: string | IUnit;
  propertyId: string | IProperty;
  tenantId: string | ITenant;
  tenantName: string;
  moveInDate: Date;
  moveOutDate: Date;
  rentAmount: number;
  depositAmount: number;
  createdAt: Date;
}

// --- Activity Log ---
export type EntityType = 'lead' | 'account' | 'property' | 'unit' | 'tenant' | 'rent' | 'maintenance' | 'expense';
export type ActivityAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'converted'
  | 'statusChanged'
  | 'moveIn'
  | 'moveOut'
  | 'rentPaid'
  | 'renewed';

export interface IActivityLog {
  _id: string;
  entityType: EntityType;
  entityId: string;
  action: ActivityAction;
  description: string;
  metadata?: Record<string, unknown>;
  propertyId?: string | null;
  unitId?: string | null;
  createdAt: Date;
}

// --- Document ---
export type DocumentCategory = 'image' | 'video' | 'document' | 'aadhaar' | 'pan' | 'passport' | 'sale_deed' | 'tax_receipt' | 'noc' | 'floor_plan';

export interface IDocument {
  _id: string;
  entityType: string;
  entityId: string;
  category: DocumentCategory;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  publicId: string;
  caption?: string;
  createdAt: Date;
}

// --- Dashboard ---
export interface IDashboardStats {
  totalOwners: number;
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  activeTenants: number;
  monthlyRentCollected: number;
  pendingRent: number;
  propertyExpenses: number;
  netRevenue: number;
  upcomingVacating: number;
  openMaintenanceTickets: number;
}

export interface IChartData {
  occupancy: { name: string; occupied: number; vacant: number }[];
  revenue: { month: string; revenue: number; expenses: number; net: number }[];
  rentCollection: { month: string; paid: number; pending: number; overdue: number }[];
  vacancy: { property: string; vacant: number; occupied: number; maintenance: number }[];
}

// --- Sidebar Navigation ---
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
}
