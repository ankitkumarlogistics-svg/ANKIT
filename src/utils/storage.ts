import { CompanyProfile, BookingConfirmation, FreightInvoice } from '../types';

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  companyNameEn: 'YOKOHAMA TRADING & LOGISTICS',
  companyNameJp: '横浜トレーディング株式会社',
  ownerNameEn: 'Muhammad Fareed',
  ownerNameJp: 'ファリード ムハンマド',
  roleTitleEn: 'Owner of Yokohama TRADING & LOGISTICS & Prominent Car Export Company',
  registrationNumber: 'T9120001213448',
  postalCode: '〒306-0501',
  addressJp: '茨城県坂東市逆井2833番地165',
  addressEn: '2833-165 Sakasai, Bando-shi, Ibaraki-ken 306-0501, Japan',
  phone: '0280-33-3423',
  mobile: '090-6950-0555',
  fax: '0280-33-6367',
  email: 'logistics@ytandl.co.jp',
  website: 'www.yokohamalogistics.jp',
  bankDetails: {
    accountNameJp: '横浜トレーディング(株)',
    bankNameJp: '三井住友銀行',
    bankCode: '0009',
    branchNameJp: '上町支店',
    branchCode: '106',
    accountTypeJp: '普通',
    accountNumber: '1439210',
    swiftCode: 'SMBCJPJT',
    accountNameEn: 'YOKOHAMA TRADING & LOGISTICS CO., LTD.',
    bankNameEn: 'SUMITOMO MITSUI BANKING CORPORATION',
    branchNameEn: 'UEMACHI BRANCH',
    accountTypeEn: 'NORMAL',
  },
};

export const INITIAL_BOOKINGS: BookingConfirmation[] = [
  {
    id: 'bkg-1',
    bookingNumber: 'TYO0799646',
    date: '2026-10-14',
    status: 'CONFIRMED',
    customerCompany: 'HBI CO., LTD',
    forwarderCompany: 'YOKOHAMA TRADING & LOGISTICS',
    shipperCompany: 'AS ACTUAL',
    consigneeCompany: 'AS ACTUAL',
    notifyParty: 'AS ACTUAL',
    shippingCompany: 'CMA-CGM',
    vessel: 'CMA CGM ELBE',
    voyage: '0R11MW1MA',
    cyOpenDate: '2026-10-14',
    cyCutDate: '2026-10-20',
    etd: '2026-10-23',
    eta: '2026-12-14',
    por: 'NAGOYA',
    pol: 'NAGOYA',
    pod: 'DUBLIN',
    pody: 'DUBLIN',
    cargoVolumeSize: '1 X 40\' Dry High',
    commodity: 'USED VEHICLE',
    blType: 'WAYBILL',
    blDescription: 'SHIPPER REQUEST',
    freightTerm: 'PREPAID as arranged.',
    blIssuePlace: 'OSAKA, JAPAN',
    remarks: 'CUSTOM BY CUSTOMER >> DOC CUT: 10/20 >> CY CUT: 10/22 >> BOOKING SLIDE TO NEXT VESSEL, AS PER CUSTOMER REQUEST',
    note: 'KINDLY SEND US D/R(ACL) AND S/I ONE DAY PRIOR OF CY CUT DATE TO AVOID ANY PENALTY. FAX: 0280-33-6367',
    createdAt: '2026-10-14T08:30:00Z',
    updatedAt: '2026-10-14T08:30:00Z',
  },
  {
    id: 'bkg-2',
    bookingNumber: '120BK6009764',
    date: '2026-08-25',
    status: 'SHIPPED',
    customerCompany: 'HBI CO., LTD',
    forwarderCompany: 'YOKOHAMA TRADING & LOGISTICS',
    shipperCompany: 'CARCADE INTERNATIONAL LTD.',
    consigneeCompany: 'PAK CARGO LOGISTICS KARACHI',
    notifyParty: 'SAME AS CONSIGNEE',
    shippingCompany: 'TS LINES',
    vessel: 'OKEE AURELIA',
    voyage: '167W',
    cyOpenDate: '2026-08-20',
    cyCutDate: '2026-08-27',
    etd: '2026-08-30',
    eta: '2026-09-20',
    por: 'NAGOYA',
    pol: 'NAGOYA',
    pod: 'KARACHI',
    pody: 'KARACHI',
    cargoVolumeSize: '1 X 40\' High Cube',
    commodity: 'USED MOTOR VEHICLES',
    blType: 'ORIGINAL B/L',
    blDescription: 'SHIPPER COUNT LOAD & SEAL',
    freightTerm: 'PREPAID',
    blIssuePlace: 'TOKYO, JAPAN',
    remarks: 'VEHICLE CHASSIS NUMBERS SUBMITTED WITH JAPAN EXPORT CERTIFICATE',
    note: 'PLEASE SUBMIT B/L SURRENDER REQUEST 2 DAYS BEFORE ARRIVAL.',
    createdAt: '2026-08-25T09:00:00Z',
    updatedAt: '2026-08-30T11:20:00Z',
  },
  {
    id: 'bkg-3',
    bookingNumber: 'ONE-YOK-99210',
    date: '2026-10-18',
    status: 'DRAFT',
    customerCompany: 'AL-ZAHRA AUTO TRADING LLC',
    forwarderCompany: 'YOKOHAMA TRADING & LOGISTICS',
    shipperCompany: 'YOKOHAMA TRADING & LOGISTICS',
    consigneeCompany: 'AL-ZAHRA MOTORS JEBEL ALI',
    notifyParty: 'SAME AS CONSIGNEE',
    shippingCompany: 'OCEAN NETWORK EXPRESS (ONE)',
    vessel: 'ONE HUMBER',
    voyage: '024E',
    cyOpenDate: '2026-10-22',
    cyCutDate: '2026-10-28',
    etd: '2026-11-02',
    eta: '2026-11-24',
    por: 'YOKOHAMA',
    pol: 'YOKOHAMA',
    pod: 'JEBEL ALI',
    pody: 'JEBEL ALI',
    cargoVolumeSize: '2 X 40\' High Cube',
    commodity: 'USED VEHICLES (TOYOTA LAND CRUISER)',
    blType: 'SEAWAY BILL',
    blDescription: 'AS PER SHIPPER DECLARATION',
    freightTerm: 'PREPAID as arranged.',
    blIssuePlace: 'YOKOHAMA, JAPAN',
    remarks: 'SPECIAL DECK STOWAGE REQUESTED. DIRECT DISCHARGE.',
    note: 'SEND ALL D/R DOCUMENTS TO FAX 0280-33-6367 OR EMAIL BEFORE CUT DATE.',
    createdAt: '2026-10-18T10:15:00Z',
    updatedAt: '2026-10-18T10:15:00Z',
  },
];

export const INITIAL_INVOICES: FreightInvoice[] = [
  {
    id: 'inv-1',
    invoiceNo: 'YTL-FI-133916',
    date: '2026-08-31',
    paymentDueDate: '2026-09-22',
    status: 'PAID',
    customerName: 'HBI CO., LTD',
    customerAddress: 'YATOMI-SHI, TOKAI, AICHI, JAPAN',
    portFrom: 'NAGOYA',
    portTo: 'KARACHI',
    shippingCompany: 'TS LINES',
    vesselVoyage: 'OKEE AURELIA 167W',
    etd: '2026-08-30',
    eta: '2026-09-20',
    blNo: '120610087601',
    bookingNo: '120BK6009764',
    shipmentMode: 'Container',
    freightTerm: 'PREPAID',
    exchangeRate: 162.22,
    containerCount: 1,
    items: [
      {
        id: 'item-1',
        details: 'Freight',
        description: 'FREIGHT - $ 1830 X 1 CONT. TAX FREE',
        currency: 'USD',
        unitPrice: 1830,
        quantity: 1,
        taxRate: 0,
        lineTotalJpy: 296863,
      },
      {
        id: 'item-2',
        details: 'Doc Fee',
        description: 'DOC FEE - 6100 YEN X 1 B/L',
        currency: 'JPY',
        unitPrice: 6100,
        quantity: 1,
        taxRate: 0,
        lineTotalJpy: 6100,
      },
      {
        id: 'item-3',
        details: 'THC',
        description: 'SEAL FEE - 2800 YEN X 1 CONT.',
        currency: 'JPY',
        unitPrice: 2800,
        quantity: 1,
        taxRate: 0,
        lineTotalJpy: 2800,
      },
      {
        id: 'item-4',
        details: 'Other Charges',
        description: 'PORT SECURITY CHARGE',
        currency: 'JPY',
        unitPrice: 0,
        quantity: 1,
        taxRate: 0,
        lineTotalJpy: 0,
      },
    ],
    subTotalJpy: 305763,
    discountJpy: 0,
    remarks: 'SHIPPER - CARCADE INTERNATIONAL LTD.',
    grandTotalJpy: 305763,
    linkedBookingId: 'bkg-2',
    createdAt: '2026-08-31T05:00:00Z',
    updatedAt: '2026-09-20T04:00:00Z',
  },
  {
    id: 'inv-2',
    invoiceNo: 'YTL-FI-133988',
    date: '2026-10-15',
    paymentDueDate: '2026-11-05',
    status: 'UNPAID',
    customerName: 'HBI CO., LTD',
    customerAddress: 'YATOMI-SHI, TOKAI, AICHI, JAPAN',
    portFrom: 'NAGOYA',
    portTo: 'DUBLIN',
    shippingCompany: 'CMA-CGM',
    vesselVoyage: 'CMA CGM ELBE 0R11MW1MA',
    etd: '2026-10-23',
    eta: '2026-12-14',
    blNo: 'CMA-NGO-788912',
    bookingNo: 'TYO0799646',
    shipmentMode: 'Container (1 X 40\' HC)',
    freightTerm: 'PREPAID',
    exchangeRate: 153.50,
    containerCount: 1,
    items: [
      {
        id: 'item-201',
        details: 'Freight',
        description: 'OCEAN FREIGHT TO DUBLIN - $ 2,450 X 1 CONT.',
        currency: 'USD',
        unitPrice: 2450,
        quantity: 1,
        taxRate: 0,
        lineTotalJpy: 376075,
      },
      {
        id: 'item-202',
        details: 'Doc Fee',
        description: 'DOCUMENTATION FEE',
        currency: 'JPY',
        unitPrice: 6600,
        quantity: 1,
        taxRate: 10,
        lineTotalJpy: 7260,
      },
      {
        id: 'item-203',
        details: 'THC',
        description: 'TERMINAL HANDLING CHARGE (THC)',
        currency: 'JPY',
        unitPrice: 38000,
        quantity: 1,
        taxRate: 10,
        lineTotalJpy: 41800,
      },
      {
        id: 'item-204',
        details: 'Seal Fee',
        description: 'CONTAINER SEAL FEE',
        currency: 'JPY',
        unitPrice: 2800,
        quantity: 1,
        taxRate: 10,
        lineTotalJpy: 3080,
      },
    ],
    subTotalJpy: 428215,
    discountJpy: 5000,
    remarks: 'BOOKING REF: TYO0799646 - USED VEHICLE SHIPMENT',
    grandTotalJpy: 423215,
    linkedBookingId: 'bkg-1',
    createdAt: '2026-10-15T09:30:00Z',
    updatedAt: '2026-10-15T09:30:00Z',
  },
];

const STORAGE_KEYS = {
  PROFILE: 'ytl_company_profile_v1',
  BOOKINGS: 'ytl_bookings_v1',
  INVOICES: 'ytl_invoices_v1',
};

export const getCompanyProfile = (): CompanyProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_COMPANY_PROFILE;
    const parsed = JSON.parse(raw);
    if (!parsed.email || parsed.email === 'yokohamatradingandlogistics@gmail.com') {
      parsed.email = 'logistics@ytandl.co.jp';
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_COMPANY_PROFILE;
  }
};

export const saveCompanyProfile = (profile: CompanyProfile): void => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const getBookings = (): BookingConfirmation[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
};

export const saveBookings = (bookings: BookingConfirmation[]): void => {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const getInvoices = (): FreightInvoice[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
      return INITIAL_INVOICES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_INVOICES;
  }
};

export const saveInvoices = (invoices: FreightInvoice[]): void => {
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
};

export const resetAllToDefault = (): void => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_COMPANY_PROFILE));
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
};
