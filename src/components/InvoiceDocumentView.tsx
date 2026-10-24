import React from 'react';
import { FreightInvoice, CompanyProfile } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface InvoiceDocumentViewProps {
  invoice: FreightInvoice;
  company: CompanyProfile;
  id?: string;
}

export const InvoiceDocumentView: React.FC<InvoiceDocumentViewProps> = ({
  invoice,
  company,
  id = 'invoice-print-document',
}) => {
  return (
    <div
      id={id}
      className="printable-sheet bg-white text-slate-900 mx-auto w-full max-w-[800px] border border-slate-300 shadow-sm p-6 sm:p-10 font-sans print:border-none print:shadow-none print:p-0 print:max-w-none"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Outer Border wrapping the entire invoice */}
      <div className="border border-slate-400 p-4 sm:p-6 bg-white min-h-[960px] flex flex-col justify-between">
        <div>
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3">
            {/* Left: Logo & Company Address Badge */}
            <div className="flex flex-col">
              <CompanyLogo customLogoUrl={company.customLogoUrl} size="lg" />
              <div className="mt-2 text-[10px] sm:text-[11px] leading-tight text-slate-700 bg-sky-900 text-white p-2.5 rounded-sm max-w-[340px]">
                <div className="font-bold text-sky-100 mb-0.5">Address :</div>
                <div>{company.postalCode} {company.addressJp}</div>
                <div className="text-[9.5px] text-sky-200">{company.addressEn}</div>
                <div className="grid grid-cols-2 gap-x-2 mt-1 pt-1 border-t border-sky-800">
                  <div><span className="text-sky-300 font-semibold">Phone :</span> {company.phone}</div>
                  <div><span className="text-sky-300 font-semibold">Mobile :</span> {company.mobile}</div>
                  <div><span className="text-sky-300 font-semibold">Fax :</span> {company.fax}</div>
                  <div><span className="text-sky-300 font-semibold">Email :</span> {company.email}</div>
                </div>
              </div>
            </div>

            {/* Right: Company Name, Registration No, and curved FREIGHT INVOICE banner */}
            <div className="flex flex-col sm:items-end justify-between self-stretch">
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
                  {company.companyNameEn}
                </div>
                <div className="text-xs text-slate-600 font-medium tracking-wide">
                  {company.companyNameJp}
                </div>
                <div className="text-[11px] font-mono font-semibold text-slate-700 mt-1">
                  登録番号 : {company.registrationNumber}
                </div>
              </div>

              {/* Title curved banner */}
              <div className="mt-3 sm:mt-auto relative">
                <div className="bg-sky-700 text-white font-extrabold tracking-wider text-base sm:text-lg px-6 py-2 rounded-l-full sm:rounded-l-3xl shadow-sm text-center uppercase">
                  FREIGHT INVOICE
                </div>
              </div>
            </div>
          </div>

          {/* Primary Invoice Header Grid (Customer, Vessel, Voyage, Dates, BL, Rate) */}
          <div className="mt-3 border-t-2 border-slate-700">
            <table className="w-full text-xs sm:text-[12px] border-collapse border border-slate-400">
              <tbody>
                {/* Row 1: M/S & Invoice No */}
                <tr className="border-b border-slate-300">
                  <td className="w-[18%] p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    M / S
                  </td>
                  <td className="w-[32%] p-1.5 font-bold text-slate-900 border-r border-slate-300">
                    {invoice.customerName}
                  </td>
                  <td className="w-[18%] p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    INVOICE NO
                  </td>
                  <td className="w-[32%] p-1.5 font-mono font-bold text-sky-900">
                    {invoice.invoiceNo}
                  </td>
                </tr>

                {/* Row 2: Address & Date */}
                <tr className="border-b border-slate-300">
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    ADDRESS
                  </td>
                  <td className="p-1.5 text-slate-800 border-r border-slate-300">
                    {invoice.customerAddress}
                  </td>
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    DATE
                  </td>
                  <td className="p-1.5 font-semibold text-slate-900">
                    {invoice.date}
                  </td>
                </tr>

                {/* Row 3: Port from & Port to */}
                <tr className="border-b border-slate-300">
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    Port from
                  </td>
                  <td className="p-1.5 font-semibold text-slate-900 border-r border-slate-300">
                    {invoice.portFrom}
                  </td>
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    Port to
                  </td>
                  <td className="p-1.5 font-semibold text-slate-900">
                    {invoice.portTo}
                  </td>
                </tr>

                {/* Row 4: Shipping company & Vessel & Voy */}
                <tr className="border-b border-slate-300">
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    Shipping company
                  </td>
                  <td className="p-1.5 text-slate-900 border-r border-slate-300">
                    {invoice.shippingCompany}
                  </td>
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    Vessel & Voy
                  </td>
                  <td className="p-1.5 font-semibold text-slate-900">
                    {invoice.vesselVoyage}
                  </td>
                </tr>

                {/* Row 5: ETD & ETA */}
                <tr className="border-b border-slate-300">
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    ETD
                  </td>
                  <td className="p-1.5 text-slate-900 border-r border-slate-300">
                    {invoice.etd}
                  </td>
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    ETA
                  </td>
                  <td className="p-1.5 text-slate-900">
                    {invoice.eta}
                  </td>
                </tr>

                {/* Row 6: B/L No. & Booking No */}
                <tr className="border-b border-slate-300">
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    B/L No.
                  </td>
                  <td className="p-1.5 font-mono text-slate-900 border-r border-slate-300">
                    {invoice.blNo}
                  </td>
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    Booking No
                  </td>
                  <td className="p-1.5 font-mono text-slate-900">
                    {invoice.bookingNo}
                  </td>
                </tr>

                {/* Row 7: Shipment mode & Freight */}
                <tr className="border-b border-slate-300">
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    Shipment mode
                  </td>
                  <td className="p-1.5 text-slate-900 border-r border-slate-300">
                    {invoice.shipmentMode}
                  </td>
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    Freight
                  </td>
                  <td className="p-1.5 font-bold text-slate-900">
                    {invoice.freightTerm}
                  </td>
                </tr>

                {/* Row 8: Exchange Rate & No. of Containers */}
                <tr>
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    Exchange Rate
                  </td>
                  <td className="p-1.5 font-mono text-slate-900 border-r border-slate-300">
                    {invoice.exchangeRate > 0 ? invoice.exchangeRate.toFixed(2) : '—'}
                  </td>
                  <td className="p-1.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                    No. of Containers
                  </td>
                  <td className="p-1.5 font-semibold text-slate-900">
                    {invoice.containerCount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Line Items Table */}
          <div className="mt-4">
            <table className="w-full text-xs sm:text-[12px] border-collapse border border-slate-400">
              <thead>
                <tr className="bg-slate-200 text-slate-900 border-b border-slate-400">
                  <th className="p-2 text-left font-bold border-r border-slate-400 w-[18%]">
                    DETAILS
                  </th>
                  <th className="p-2 text-left font-bold border-r border-slate-400 w-[44%]">
                    DESCRIPTION
                  </th>
                  <th className="p-2 text-right font-bold border-r border-slate-400 w-[14%]">
                    PRICE
                  </th>
                  <th className="p-2 text-center font-bold border-r border-slate-400 w-[10%]">
                    TAX (10%)
                  </th>
                  <th className="p-2 text-right font-bold w-[14%]">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="border-b border-slate-300 hover:bg-slate-50/50"
                  >
                    <td className="p-2 font-bold text-slate-800 border-r border-slate-300">
                      {item.details}
                    </td>
                    <td className="p-2 text-slate-800 border-r border-slate-300">
                      {item.description}
                    </td>
                    <td className="p-2 text-right font-mono text-slate-800 border-r border-slate-300">
                      {item.currency === 'USD'
                        ? `$${item.unitPrice.toLocaleString()}`
                        : `¥${item.unitPrice.toLocaleString()}`}
                    </td>
                    <td className="p-2 text-center font-mono text-slate-700 border-r border-slate-300">
                      {item.taxRate > 0 ? `${item.taxRate}%` : '0'}
                    </td>
                    <td className="p-2 text-right font-mono font-semibold text-slate-900">
                      ¥{item.lineTotalJpy.toLocaleString()}
                    </td>
                  </tr>
                ))}

                {/* Fill empty rows if fewer than 4 items */}
                {invoice.items.length < 4 &&
                  Array.from({ length: 4 - invoice.items.length }).map((_, i) => (
                    <tr key={`empty-${i}`} className="border-b border-slate-300 h-8">
                      <td className="p-2 border-r border-slate-300">&nbsp;</td>
                      <td className="p-2 border-r border-slate-300">&nbsp;</td>
                      <td className="p-2 border-r border-slate-300 text-right font-mono text-slate-400">¥0</td>
                      <td className="p-2 border-r border-slate-300 text-center font-mono text-slate-400">¥0</td>
                      <td className="p-2 text-right font-mono text-slate-400">¥0</td>
                    </tr>
                  ))}

                {/* Sub Total */}
                <tr className="border-b border-slate-300 font-bold bg-slate-50">
                  <td colSpan={2} className="p-2 border-r border-slate-300">
                    Sub Total
                  </td>
                  <td colSpan={2} className="border-r border-slate-300"></td>
                  <td className="p-2 text-right font-mono text-slate-900">
                    ¥{invoice.subTotalJpy.toLocaleString()}
                  </td>
                </tr>

                {/* Discount */}
                <tr className="border-b border-slate-300">
                  <td colSpan={2} className="p-2 font-bold text-slate-800 border-r border-slate-300">
                    Discount
                  </td>
                  <td colSpan={2} className="border-r border-slate-300"></td>
                  <td className="p-2 text-right font-mono text-rose-700 font-semibold">
                    -{invoice.discountJpy > 0 ? `¥${invoice.discountJpy.toLocaleString()}` : '0'}
                  </td>
                </tr>

                {/* Remarks */}
                <tr className="border-b border-slate-400">
                  <td className="p-2 font-bold text-slate-800 border-r border-slate-300">
                    Remarks
                  </td>
                  <td colSpan={4} className="p-2 text-slate-800 font-medium">
                    {invoice.remarks || '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Grand Total Highlight Bar */}
          <div className="mt-3 border border-slate-400 rounded-sm overflow-hidden">
            <div className="flex items-center justify-between bg-emerald-50/90 border-b border-slate-300 px-6 py-2">
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-wide">
                Grand total
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900">
                ¥{invoice.grandTotalJpy.toLocaleString()}
              </span>
            </div>
            {/* Payment Due Date row */}
            <div className="flex items-center justify-between bg-white px-6 py-2">
              <span className="text-sm font-bold text-slate-800">
                Payment due date
              </span>
              <span className="text-base font-bold text-rose-700 tracking-wide font-mono">
                {invoice.paymentDueDate}
              </span>
            </div>
          </div>

          {/* Dual Bank Account Section (Japanese & English) */}
          <div className="mt-4 border border-sky-900 rounded-sm overflow-hidden">
            <div className="grid grid-cols-2 bg-sky-900 text-white text-xs font-bold py-1.5 px-4 text-center">
              <div>JAPANESE</div>
              <div className="border-l border-sky-800">ENGLISH</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 text-[10.5px] leading-snug divide-y md:divide-y-0 md:divide-x divide-slate-300 p-2.5 bg-slate-50">
              {/* Japanese Bank Box */}
              <div className="space-y-0.5 pr-3">
                <div className="flex">
                  <span className="font-bold w-20 text-slate-700">口座名義:</span>
                  <span className="font-semibold text-slate-900">{company.bankDetails.accountNameJp}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-20 text-slate-700">銀行名:</span>
                  <span className="text-slate-900">{company.bankDetails.bankNameJp}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-20 text-slate-700">銀行コード:</span>
                  <span className="font-mono text-slate-900">{company.bankDetails.bankCode}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-20 text-slate-700">支店名:</span>
                  <span className="text-slate-900">{company.bankDetails.branchNameJp}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-20 text-slate-700">支店コード:</span>
                  <span className="font-mono text-slate-900">{company.bankDetails.branchCode}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-20 text-slate-700">口座種別:</span>
                  <span className="text-slate-900">{company.bankDetails.accountTypeJp}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-20 text-slate-700">円口座番号:</span>
                  <span className="font-mono font-bold text-slate-900">{company.bankDetails.accountNumber}</span>
                  <span className="ml-4 font-bold text-slate-700">スイフト:</span>
                  <span className="font-mono ml-1 text-slate-900">{company.bankDetails.swiftCode}</span>
                </div>
              </div>

              {/* English Bank Box */}
              <div className="space-y-0.5 pl-3 pt-2 md:pt-0">
                <div className="flex">
                  <span className="font-bold w-24 text-slate-700">ACCOUNT NAME:</span>
                  <span className="font-semibold text-slate-900">{company.bankDetails.accountNameEn}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-24 text-slate-700">BANK NAME:</span>
                  <span className="text-slate-900">{company.bankDetails.bankNameEn}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-24 text-slate-700">BANK CODE:</span>
                  <span className="font-mono text-slate-900">{company.bankDetails.bankCode}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-24 text-slate-700">BRANCH:</span>
                  <span className="text-slate-900">{company.bankDetails.branchNameEn} (CODE: {company.bankDetails.branchCode})</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-24 text-slate-700">ACCOUNT TYPE:</span>
                  <span className="text-slate-900">{company.bankDetails.accountTypeEn}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-24 text-slate-700">JPY ACCOUNT:</span>
                  <span className="font-mono font-bold text-slate-900">{company.bankDetails.accountNumber}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-24 text-slate-700">SWIFT CODE:</span>
                  <span className="font-mono font-bold text-slate-900">{company.bankDetails.swiftCode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & watermark */}
        <div className="mt-5 pt-3 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500">
          <div>{company.companyNameEn} · Official Tax Invoice</div>
          <div className="font-mono">Invoice #{invoice.invoiceNo} · Status: {invoice.status}</div>
        </div>
      </div>
    </div>
  );
};
