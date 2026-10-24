export interface BankDetails {
  accountNameJp: string;
  bankNameJp: string;
  bankCode: string;
  branchNameJp: string;
  branchCode: string;
  accountTypeJp: string;
  accountNumber: string;
  swiftCode: string;
  accountNameEn: string;
  bankNameEn: string;
  branchNameEn: string;
  accountTypeEn: string;
}

export interface CompanyProfile {
  companyNameEn: string;
  companyNameJp: string;
  ownerNameEn: string;
  ownerNameJp: string;
  roleTitleEn: string;
  registrationNumber: string; // 登録番号 e.g. T9120001213448
  addressJp: string;
  addressEn: string;
  postalCode: string;
  phone: string;
  mobile: string;
  fax: string;
  email: string;
  website: string;
  customLogoUrl?: string;
  bankDetails: BankDetails;
}

export type BookingStatus = 'DRAFT' | 'CONFIRMED' | 'SHIPPED' | 'CANCELLED';

export interface BookingConfirmation {
  id: string;
  bookingNumber: string;
  date: string;
  status: BookingStatus;
  customerCompany: string;
  forwarderCompany?: string;
  shipperCompany: string;
  consigneeCompany: string;
  notifyParty: string;
  shippingCompany: string;
  vessel: string;
  voyage: string;
  cyOpenDate: string;
  cyCutDate: string;
  etd: string;
  eta: string;
  por: string;
  pol: string;
  pod: string;
  pody: string;
  cargoVolumeSize: string;
  commodity: string;
  blType: string;
  blDescription: string;
  freightTerm: string;
  blIssuePlace: string;
  remarks: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  details: string; // Freight, Doc Fee, THC, Seal Fee, Custom, etc.
  description: string;
  currency: 'USD' | 'JPY';
  unitPrice: number;
  quantity: number;
  taxRate: number; // 0 or 10
  lineTotalJpy: number;
}

export type InvoiceStatus = 'UNPAID' | 'PAID' | 'PARTIAL' | 'OVERDUE';

export interface FreightInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  paymentDueDate: string;
  status: InvoiceStatus;
  customerName: string;
  customerAddress: string;
  portFrom: string;
  portTo: string;
  shippingCompany: string;
  vesselVoyage: string;
  etd: string;
  eta: string;
  blNo: string;
  bookingNo: string;
  shipmentMode: string;
  freightTerm: string; // PREPAID, COLLECT
  exchangeRate: number;
  containerCount: number;
  items: InvoiceItem[];
  subTotalJpy: number;
  discountJpy: number;
  remarks: string;
  grandTotalJpy: number;
  linkedBookingId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ActiveTab = 'dashboard' | 'bookings' | 'invoices' | 'settings';
