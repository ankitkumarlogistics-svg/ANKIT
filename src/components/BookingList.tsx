import React, { useState, useMemo } from 'react';
import { BookingConfirmation, BookingStatus } from '../types';
import {
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Copy,
  FileSpreadsheet,
  ArrowRight,
  Filter,
  Ship,
  Anchor,
  Download,
  Mail,
} from 'lucide-react';
import { exportBookingsToExcel } from '../utils/excelExport';

interface BookingListProps {
  bookings: BookingConfirmation[];
  onView: (booking: BookingConfirmation) => void;
  onEdit: (booking: BookingConfirmation) => void;
  onDelete: (id: string) => void;
  onDuplicate: (booking: BookingConfirmation) => void;
  onConvertToInvoice: (booking: BookingConfirmation) => void;
  onDownloadPdf: (booking: BookingConfirmation) => void;
  onSendCustomer: (booking: BookingConfirmation) => void;
  onCreateNew: () => void;
}

export const BookingList: React.FC<BookingListProps> = ({
  bookings,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onConvertToInvoice,
  onDownloadPdf,
  onSendCustomer,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtered and searched records
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        searchTerm === '' ||
        b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.vessel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.shippingCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.por.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.pod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.commodity.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredBookings.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportSelected = () => {
    const listToExport =
      selectedIds.length > 0
        ? bookings.filter((b) => selectedIds.includes(b.id))
        : filteredBookings;
    exportBookingsToExcel(listToExport);
  };

  const statusStyles: Record<BookingStatus, string> = {
    CONFIRMED: 'text-emerald-700 font-semibold',
    DRAFT: 'text-slate-600 font-medium',
    SHIPPED: 'text-sky-700 font-semibold',
    CANCELLED: 'text-rose-600 font-medium',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Top Filter & Action Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex flex-1 items-center gap-3 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search booking #, customer, vessel, port, commodity..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="DRAFT">Draft</option>
              <option value="SHIPPED">Shipped</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export to Excel */}
          <button
            type="button"
            onClick={handleExportSelected}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Download records in Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Excel ({selectedIds.length > 0 ? selectedIds.length : 'All'})
          </button>

          {/* Create New Booking Button */}
          <button
            type="button"
            onClick={onCreateNew}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="py-16 text-center">
          <Ship className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-700">No Booking Confirmations Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchTerm
              ? 'Try modifying your search criteria or clear the filters.'
              : 'Create your first shipping booking confirmation to print A4 confirmation and generate invoices.'}
          </p>
          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg"
          >
            Create New Booking
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === filteredBookings.length &&
                      filteredBookings.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                </th>
                <th className="py-3 px-3 font-bold">Booking No</th>
                <th className="py-3 px-3 font-bold">Customer Company</th>
                <th className="py-3 px-3 font-bold">Shipping Line & Vessel</th>
                <th className="py-3 px-3 font-bold">Routing (POL → POD)</th>
                <th className="py-3 px-3 font-bold">CY Cut Date</th>
                <th className="py-3 px-3 font-bold">Cargo & Commodity</th>
                <th className="py-3 px-3 font-bold">Status</th>
                <th className="py-3 px-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-slate-50/80 transition-colors group text-slate-800"
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(b.id)}
                      onChange={() => handleSelectOne(b.id)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                  </td>

                  {/* Booking Number */}
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-sky-900 flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      {b.bookingNumber}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{b.date}</div>
                  </td>

                  {/* Customer Company */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{b.customerCompany}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                      Shipper: {b.shipperCompany || 'AS ACTUAL'}
                    </div>
                  </td>

                  {/* Shipping Line & Vessel */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-900">{b.shippingCompany}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {b.vessel} {b.voyage && `· Voy ${b.voyage}`}
                    </div>
                  </td>

                  {/* Routing */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-900">
                      {b.pol || b.por} → <span className="font-bold text-sky-900">{b.pod}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      ETD: {b.etd} · ETA: {b.eta}
                    </div>
                  </td>

                  {/* CY Cut Date */}
                  <td className="py-3 px-3 font-mono font-bold text-rose-700">
                    {b.cyCutDate || '—'}
                  </td>

                  {/* Cargo & Commodity */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-900">{b.cargoVolumeSize}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                      {b.commodity}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-xs">
                    <span className={statusStyles[b.status]}>{b.status}</span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Direct PDF Download */}
                      <button
                        type="button"
                        onClick={() => onDownloadPdf(b)}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded flex items-center gap-1 shadow-xs transition-colors"
                        title="Download PDF to send to customer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </button>

                      {/* Send to Customer */}
                      <button
                        type="button"
                        onClick={() => onSendCustomer(b)}
                        className="px-2 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded flex items-center gap-1 transition-colors"
                        title="Send document to customer via email or message"
                      >
                        <Mail className="w-3.5 h-3.5 text-emerald-600" />
                        Send
                      </button>

                      {/* View & Preview */}
                      <button
                        type="button"
                        onClick={() => onView(b)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                        title="Preview Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Convert to Invoice */}
                      <button
                        type="button"
                        onClick={() => onConvertToInvoice(b)}
                        className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded"
                        title="1-Click Convert to Freight Invoice"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => onEdit(b)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                        title="Edit Booking"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={() => onDuplicate(b)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                        title="Duplicate Booking"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete Booking #${b.bookingNumber}?`
                            )
                          ) {
                            onDelete(b.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                        title="Delete Booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Footer info */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing {filteredBookings.length} of {bookings.length} booking records
        </div>
        <div className="flex items-center gap-3">
          <span>Click any row action to View/Print PDF or Convert to Invoice</span>
        </div>
      </div>
    </div>
  );
};
