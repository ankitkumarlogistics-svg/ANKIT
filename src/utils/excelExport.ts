import * as XLSX from 'xlsx';
import { BookingConfirmation, FreightInvoice } from '../types';

export const exportAllRecordsToExcel = (
  bookings: BookingConfirmation[],
  invoices: FreightInvoice[]
): void => {
  const wb = XLSX.utils.book_new();

  // 1. Booking Confirmations Sheet
  const bookingsData = bookings.map((b) => ({
    'Booking Number': b.bookingNumber,
    'Status': b.status,
    'Date': b.date,
    'Customer Company': b.customerCompany,
    'Forwarder Company': b.forwarderCompany || '',
    'Shipper on B/L': b.shipperCompany,
    'Consignee on B/L': b.consigneeCompany,
    'Notify Party': b.notifyParty,
    'Shipping Line': b.shippingCompany,
    'Vessel': b.vessel,
    'Voyage': b.voyage,
    'CY Open Date': b.cyOpenDate,
    'CY Cut Date': b.cyCutDate,
    'ETD': b.etd,
    'ETA': b.eta,
    'Port of Receipt (POR)': b.por,
    'Port of Loading (POL)': b.pol,
    'Port of Discharge (POD)': b.pod,
    'Port of Delivery (PODY)': b.pody,
    'Cargo Volume & Size': b.cargoVolumeSize,
    'Commodity': b.commodity,
    'B/L Type': b.blType,
    'B/L Description': b.blDescription,
    'Freight Terms': b.freightTerm,
    'B/L Issue Place': b.blIssuePlace,
    'Remarks': b.remarks,
    'Special Instructions / Note': b.note,
    'Created At': b.createdAt,
  }));

  const wsBookings = XLSX.utils.json_to_sheet(bookingsData);
  // Auto-fit column widths roughly
  wsBookings['!cols'] = [
    { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 25 },
    { wch: 22 }, { wch: 22 }, { wch: 20 }, { wch: 18 }, { wch: 18 },
    { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 20 },
    { wch: 22 }, { wch: 16 }, { wch: 20 }, { wch: 16 }, { wch: 16 },
    { wch: 35 }, { wch: 40 }, { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, wsBookings, 'Booking Confirmations');

  // 2. Freight Invoices Sheet
  const invoicesData = invoices.map((inv) => ({
    'Invoice Number': inv.invoiceNo,
    'Status': inv.status,
    'Invoice Date': inv.date,
    'Payment Due Date': inv.paymentDueDate,
    'Customer (M/S)': inv.customerName,
    'Customer Address': inv.customerAddress,
    'Port From': inv.portFrom,
    'Port To': inv.portTo,
    'Shipping Company': inv.shippingCompany,
    'Vessel & Voyage': inv.vesselVoyage,
    'ETD': inv.etd,
    'ETA': inv.eta,
    'B/L No': inv.blNo,
    'Booking No': inv.bookingNo,
    'Shipment Mode': inv.shipmentMode,
    'Containers Count': inv.containerCount,
    'Freight Term': inv.freightTerm,
    'Exchange Rate (USD/JPY)': inv.exchangeRate,
    'Sub Total (JPY)': inv.subTotalJpy,
    'Discount (JPY)': inv.discountJpy,
    'Grand Total (JPY)': inv.grandTotalJpy,
    'Remarks': inv.remarks,
    'Created At': inv.createdAt,
  }));

  const wsInvoices = XLSX.utils.json_to_sheet(invoicesData);
  wsInvoices['!cols'] = [
    { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 25 },
    { wch: 30 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 22 },
    { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 18 },
    { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 14 },
    { wch: 18 }, { wch: 35 }, { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, wsInvoices, 'Freight Invoices');

  // 3. Itemized Invoice Items Sheet
  const itemsData: Array<{
    'Invoice Number': string;
    'Customer': string;
    'Item Type': string;
    'Description': string;
    'Currency': string;
    'Unit Price': number;
    'Quantity': number;
    'Tax Rate (%)': number;
    'Total JPY': number;
  }> = [];

  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      itemsData.push({
        'Invoice Number': inv.invoiceNo,
        'Customer': inv.customerName,
        'Item Type': item.details,
        'Description': item.description,
        'Currency': item.currency,
        'Unit Price': item.unitPrice,
        'Quantity': item.quantity,
        'Tax Rate (%)': item.taxRate,
        'Total JPY': item.lineTotalJpy,
      });
    });
  });

  const wsItems = XLSX.utils.json_to_sheet(itemsData);
  wsItems['!cols'] = [
    { wch: 18 }, { wch: 22 }, { wch: 16 }, { wch: 35 }, { wch: 10 },
    { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, wsItems, 'Invoice Line Items');

  // 4. Financial Summary Sheet
  const totalBilled = invoices.reduce((acc, cur) => acc + cur.grandTotalJpy, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((acc, cur) => acc + cur.grandTotalJpy, 0);
  const totalUnpaid = invoices
    .filter((inv) => inv.status !== 'PAID')
    .reduce((acc, cur) => acc + cur.grandTotalJpy, 0);

  const summaryData = [
    { Metric: 'Total Booking Records', Value: bookings.length },
    { Metric: 'Total Invoice Records', Value: invoices.length },
    { Metric: 'Total Gross Invoiced (JPY)', Value: `¥${totalBilled.toLocaleString()}` },
    { Metric: 'Total Amount Collected (JPY)', Value: `¥${totalPaid.toLocaleString()}` },
    { Metric: 'Total Outstanding Balance (JPY)', Value: `¥${totalUnpaid.toLocaleString()}` },
    { Metric: 'Report Generated At', Value: new Date().toLocaleString() },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 32 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary Overview');

  // Trigger download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Yokohama_Logistics_Records_${dateStr}.xlsx`);
};

export const exportBookingsToExcel = (bookings: BookingConfirmation[]): void => {
  const wb = XLSX.utils.book_new();
  const bookingsData = bookings.map((b) => ({
    'Booking Number': b.bookingNumber,
    'Status': b.status,
    'Date': b.date,
    'Customer Company': b.customerCompany,
    'Forwarder Company': b.forwarderCompany || '',
    'Shipper on B/L': b.shipperCompany,
    'Consignee on B/L': b.consigneeCompany,
    'Notify Party': b.notifyParty,
    'Shipping Line': b.shippingCompany,
    'Vessel': b.vessel,
    'Voyage': b.voyage,
    'CY Open Date': b.cyOpenDate,
    'CY Cut Date': b.cyCutDate,
    'ETD': b.etd,
    'ETA': b.eta,
    'Port of Receipt': b.por,
    'Port of Loading': b.pol,
    'Port of Discharge': b.pod,
    'Port of Delivery': b.pody,
    'Cargo Volume & Size': b.cargoVolumeSize,
    'Commodity': b.commodity,
    'B/L Type': b.blType,
    'B/L Description': b.blDescription,
    'Freight': b.freightTerm,
    'BL Issue Place': b.blIssuePlace,
    'Remarks': b.remarks,
    'Instructions': b.note,
  }));
  const ws = XLSX.utils.json_to_sheet(bookingsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Yokohama_Bookings_${dateStr}.xlsx`);
};

export const exportInvoicesToExcel = (invoices: FreightInvoice[]): void => {
  const wb = XLSX.utils.book_new();
  const invoicesData = invoices.map((inv) => ({
    'Invoice Number': inv.invoiceNo,
    'Status': inv.status,
    'Date': inv.date,
    'Due Date': inv.paymentDueDate,
    'Customer': inv.customerName,
    'Address': inv.customerAddress,
    'Port From': inv.portFrom,
    'Port To': inv.portTo,
    'Shipping Line': inv.shippingCompany,
    'Vessel & Voy': inv.vesselVoyage,
    'ETD': inv.etd,
    'ETA': inv.eta,
    'B/L No': inv.blNo,
    'Booking No': inv.bookingNo,
    'Shipment Mode': inv.shipmentMode,
    'Containers': inv.containerCount,
    'Exchange Rate': inv.exchangeRate,
    'Grand Total (JPY)': inv.grandTotalJpy,
    'Remarks': inv.remarks,
  }));
  const ws = XLSX.utils.json_to_sheet(invoicesData);
  XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Yokohama_Invoices_${dateStr}.xlsx`);
};
