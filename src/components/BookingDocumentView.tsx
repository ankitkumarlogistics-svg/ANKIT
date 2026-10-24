import React from 'react';
import { BookingConfirmation, CompanyProfile } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface BookingDocumentViewProps {
  booking: BookingConfirmation;
  company: CompanyProfile;
  id?: string;
}

export const BookingDocumentView: React.FC<BookingDocumentViewProps> = ({
  booking,
  company,
  id = 'booking-print-document',
}) => {
  return (
    <div
      id={id}
      className="printable-sheet bg-white text-slate-900 mx-auto w-full max-w-[800px] border border-slate-300 shadow-sm p-6 sm:p-10 font-sans print:border-none print:shadow-none print:p-0 print:max-w-none"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Outer Border wrapping the entire document just like the reference PDF */}
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

            {/* Right: Company Title & Curved Banner for BOOKING DETAILS */}
            <div className="flex flex-col sm:items-end justify-between self-stretch">
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
                  {company.companyNameEn}
                </div>
                <div className="text-xs text-slate-600 font-medium tracking-wide">
                  {company.companyNameJp}
                </div>
              </div>

              {/* Header Title with curved styling matching attachment */}
              <div className="mt-4 sm:mt-auto relative">
                <div className="bg-sky-600 text-white font-bold tracking-wider text-base sm:text-lg px-6 py-2 rounded-l-full sm:rounded-l-3xl shadow-sm text-center uppercase">
                  BOOKING DETAILS
                </div>
              </div>
            </div>
          </div>

          {/* Main Booking Details Table */}
          <div className="mt-4 border-t-2 border-slate-700">
            <table className="w-full text-xs sm:text-[12.5px] border-collapse border border-slate-400">
              <tbody>
                {/* Customer Company */}
                <tr className="border-b border-slate-300">
                  <td className="w-1/3 p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    Customer Company
                  </td>
                  <td className="w-2/3 p-2 font-semibold text-slate-900 col-span-3">
                    {booking.customerCompany || '—'}
                  </td>
                </tr>

                {/* Forwarder Company */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    Forwarder Company
                  </td>
                  <td className="p-2 text-slate-800">
                    {booking.forwarderCompany || company.companyNameEn}
                  </td>
                </tr>

                {/* Shipper Company on B/L */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    Shipper Company on B/L
                  </td>
                  <td className="p-2 text-slate-800">
                    {booking.shipperCompany || 'AS ACTUAL'}
                  </td>
                </tr>

                {/* Consignee Company on B/L */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    Consignee Company on B/L
                  </td>
                  <td className="p-2 text-slate-800">
                    {booking.consigneeCompany || 'AS ACTUAL'}
                  </td>
                </tr>

                {/* Notify Party on B/L */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    Notify Party on B/L
                  </td>
                  <td className="p-2 text-slate-800">
                    {booking.notifyParty || 'AS ACTUAL'}
                  </td>
                </tr>

                {/* Booking Number */}
                <tr className="border-b border-slate-300 bg-sky-50/50">
                  <td className="p-2 font-bold bg-slate-100 border-r border-slate-300 text-slate-900">
                    Booking Number
                  </td>
                  <td className="p-2 font-mono font-bold text-sky-900 text-[13.5px]">
                    {booking.bookingNumber}
                  </td>
                </tr>

                {/* Shipping Company */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    Shipping Company
                  </td>
                  <td className="p-2 font-semibold text-slate-900">
                    {booking.shippingCompany}
                  </td>
                </tr>

                {/* Vessel & Voyage (Dual Split) */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    Vessel
                  </td>
                  <td className="p-2 text-slate-900">
                    <div className="grid grid-cols-2">
                      <span className="font-semibold">{booking.vessel}</span>
                      <div>
                        <span className="font-bold text-slate-700 mr-2">Voyage:</span>
                        <span className="font-mono">{booking.voyage}</span>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* CY Open Date & CY Cut Date */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    CY Open Date
                  </td>
                  <td className="p-2 text-slate-900">
                    <div className="grid grid-cols-2">
                      <span>{booking.cyOpenDate}</span>
                      <div>
                        <span className="font-bold text-rose-800 mr-2">CY Cut Date:</span>
                        <span className="font-bold text-rose-700">{booking.cyCutDate}</span>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* ETD & ETA */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    ETD
                  </td>
                  <td className="p-2 text-slate-900">
                    <div className="grid grid-cols-2">
                      <span>{booking.etd}</span>
                      <div>
                        <span className="font-bold text-slate-700 mr-2">ETA:</span>
                        <span>{booking.eta}</span>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* POR & POL */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    POR
                  </td>
                  <td className="p-2 text-slate-900">
                    <div className="grid grid-cols-2">
                      <span>{booking.por}</span>
                      <div>
                        <span className="font-bold text-slate-700 mr-2">POL:</span>
                        <span>{booking.pol}</span>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* POD & PODY */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    POD
                  </td>
                  <td className="p-2 text-slate-900">
                    <div className="grid grid-cols-2">
                      <span className="font-semibold">{booking.pod}</span>
                      <div>
                        <span className="font-bold text-slate-700 mr-2">PODY:</span>
                        <span>{booking.pody}</span>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Cargo Volume & Size */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    Cargo Volume & Size
                  </td>
                  <td className="p-2 font-semibold text-slate-900">
                    {booking.cargoVolumeSize}
                  </td>
                </tr>

                {/* Commodity */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    Commodity
                  </td>
                  <td className="p-2 font-semibold text-slate-900">
                    {booking.commodity}
                  </td>
                </tr>

                {/* B/L Type */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    B/L Type
                  </td>
                  <td className="p-2 text-slate-800">
                    {booking.blType}
                  </td>
                </tr>

                {/* B/L Description */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    B/L Description
                  </td>
                  <td className="p-2 text-slate-800">
                    {booking.blDescription}
                  </td>
                </tr>

                {/* FREIGHT */}
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    FREIGHT
                  </td>
                  <td className="p-2 font-semibold text-slate-900">
                    {booking.freightTerm}
                  </td>
                </tr>

                {/* BL Issue Place */}
                <tr>
                  <td className="p-2 font-bold bg-slate-50 border-r border-slate-300 text-slate-800">
                    BL Issue Place
                  </td>
                  <td className="p-2 text-slate-800">
                    {booking.blIssuePlace}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Remarks Section */}
          <div className="mt-4 p-2.5 bg-slate-50 border border-slate-300 text-xs sm:text-[12px] leading-relaxed">
            <span className="font-bold text-slate-900">Remarks : </span>
            <span className="text-slate-800 font-medium">{booking.remarks || 'None'}</span>
          </div>

          {/* Note Box */}
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-300 text-xs text-rose-900 font-semibold leading-relaxed">
            <div className="font-bold mb-0.5">Note:</div>
            <div>{booking.note || 'KINDLY SEND US D/R(ACL) AND S/I ONE DAY PRIOR OF CY CUT DATE TO AVOID ANY PENALTY.'}</div>
            <div className="mt-1 font-mono">FAX: {company.fax} | TEL: {company.phone}</div>
          </div>
        </div>

        {/* Footer info & watermark */}
        <div className="mt-6 pt-3 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500">
          <div>Generated by {company.companyNameEn} Management System</div>
          <div className="font-mono">Ref: {booking.bookingNumber} · Status: {booking.status}</div>
        </div>
      </div>
    </div>
  );
};
