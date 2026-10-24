import React from 'react';
import { BookingConfirmation, FreightInvoice } from '../types';
import { FileText, Receipt, DollarSign, Clock } from 'lucide-react';

interface StatsOverviewProps {
  bookings: BookingConfirmation[];
  invoices: FreightInvoice[];
  onSelectBookingsTab: () => void;
  onSelectInvoicesTab: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  bookings,
  invoices,
  onSelectBookingsTab,
  onSelectInvoicesTab,
}) => {
  const totalBilledJpy = invoices.reduce((sum, inv) => sum + inv.grandTotalJpy, 0);
  const paidJpy = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.grandTotalJpy, 0);
  const outstandingJpy = invoices
    .filter((inv) => inv.status !== 'PAID')
    .reduce((sum, inv) => sum + inv.grandTotalJpy, 0);

  const activeBookingsCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Stat 1: Bookings */}
      <div
        onClick={onSelectBookingsTab}
        className="cursor-pointer bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all shadow-xs group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Booking Orders
          </span>
          <div className="p-2 bg-sky-50 text-sky-700 rounded-lg group-hover:bg-sky-100 transition-colors">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {bookings.length}
          </span>
          <span className="text-xs text-sky-700 font-medium">
            ({activeBookingsCount} active)
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Click to manage records</span>
          <span className="font-medium text-slate-700">A4 PDF Ready</span>
        </div>
      </div>

      {/* Stat 2: Invoices */}
      <div
        onClick={onSelectInvoicesTab}
        className="cursor-pointer bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all shadow-xs group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Freight Invoices
          </span>
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg group-hover:bg-indigo-100 transition-colors">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {invoices.length}
          </span>
          <span className="text-xs text-indigo-600 font-medium">
            ({invoices.filter((i) => i.status === 'PAID').length} settled)
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>USD / JPY conversions</span>
          <span className="font-medium text-slate-700">Tax Breakdown</span>
        </div>
      </div>

      {/* Stat 3: Total Gross Billed */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Invoiced (JPY)
          </span>
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            ¥{totalBilledJpy.toLocaleString()}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center justify-between">
          <span>Collected: ¥{paidJpy.toLocaleString()}</span>
        </div>
      </div>

      {/* Stat 4: Outstanding Receivables */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Outstanding Due
          </span>
          <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-amber-700 tabular-nums">
            ¥{outstandingJpy.toLocaleString()}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>{invoices.filter((i) => i.status !== 'PAID').length} pending payment</span>
          <span className="font-medium text-slate-600">SMBC Bank Info</span>
        </div>
      </div>
    </div>
  );
};
