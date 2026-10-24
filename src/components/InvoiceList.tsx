import React, { useState, useMemo } from 'react';
import { FreightInvoice, InvoiceStatus } from '../types';
import {
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Copy,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Filter,
  Receipt,
  Download,
  Mail,
} from 'lucide-react';
import { exportInvoicesToExcel } from '../utils/excelExport';

interface InvoiceListProps {
  invoices: FreightInvoice[];
  onView: (invoice: FreightInvoice) => void;
  onEdit: (invoice: FreightInvoice) => void;
  onDelete: (id: string) => void;
  onDuplicate: (invoice: FreightInvoice) => void;
  onToggleStatus: (id: string) => void;
  onDownloadPdf: (invoice: FreightInvoice) => void;
  onSendCustomer: (invoice: FreightInvoice) => void;
  onCreateNew: () => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onDownloadPdf,
  onSendCustomer,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        searchTerm === '' ||
        inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.bookingNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.blNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.portFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.portTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.vesselVoyage.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredInvoices.map((i) => i.id));
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
        ? invoices.filter((i) => selectedIds.includes(i.id))
        : filteredInvoices;
    exportInvoicesToExcel(listToExport);
  };

  const statusStyles: Record<InvoiceStatus, { text: string; icon: any }> = {
    PAID: { text: 'text-emerald-700 font-semibold', icon: CheckCircle2 },
    UNPAID: { text: 'text-amber-700 font-semibold', icon: AlertCircle },
    PARTIAL: { text: 'text-sky-700 font-semibold', icon: AlertCircle },
    OVERDUE: { text: 'text-rose-700 font-semibold', icon: AlertCircle },
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
              placeholder="Search invoice #, customer, booking #, B/L #, port..."
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
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
              <option value="PARTIAL">Partial</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Excel download */}
          <button
            type="button"
            onClick={handleExportSelected}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Download records in Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Excel ({selectedIds.length > 0 ? selectedIds.length : 'All'})
          </button>

          {/* Create New Invoice Button */}
          <button
            type="button"
            onClick={onCreateNew}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      {filteredInvoices.length === 0 ? (
        <div className="py-16 text-center">
          <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-700">No Freight Invoices Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {searchTerm
              ? 'Try modifying your search criteria or clear the filters.'
              : 'Create a new invoice with USD/JPY exchange rates, tax items, and Japanese/English bank instructions.'}
          </p>
          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg"
          >
            Create New Invoice
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
                      selectedIds.length === filteredInvoices.length &&
                      filteredInvoices.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                </th>
                <th className="py-3 px-3 font-bold">Invoice No</th>
                <th className="py-3 px-3 font-bold">Customer (M/S)</th>
                <th className="py-3 px-3 font-bold">Routing & Vessel</th>
                <th className="py-3 px-3 font-bold">B/L & Booking Ref</th>
                <th className="py-3 px-3 font-bold">Rate</th>
                <th className="py-3 px-3 font-bold text-right">Grand Total (JPY)</th>
                <th className="py-3 px-3 font-bold">Payment Due</th>
                <th className="py-3 px-3 font-bold">Status</th>
                <th className="py-3 px-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInvoices.map((inv) => {
                const StatusIcon = statusStyles[inv.status].icon;
                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/80 transition-colors group text-slate-800"
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(inv.id)}
                        onChange={() => handleSelectOne(inv.id)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                    </td>

                    {/* Invoice Number */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-sky-900 flex items-center gap-1.5">
                        <Receipt className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        {inv.invoiceNo}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{inv.date}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{inv.customerName}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[170px]">
                        {inv.customerAddress}
                      </div>
                    </td>

                    {/* Routing & Vessel */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900">
                        {inv.portFrom} → <span className="font-bold text-sky-900">{inv.portTo}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {inv.vesselVoyage}
                      </div>
                    </td>

                    {/* B/L & Booking Ref */}
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <div>BL: {inv.blNo || '—'}</div>
                      <div className="text-slate-500">BK: {inv.bookingNo || '—'}</div>
                    </td>

                    {/* Rate & Containers */}
                    <td className="py-3 px-3 text-[11px] font-mono">
                      <div>${inv.exchangeRate}</div>
                      <div className="text-[10px] text-slate-500">{inv.containerCount} Cont.</div>
                    </td>

                    {/* Grand Total */}
                    <td className="py-3 px-3 text-right">
                      <div className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                        ¥{inv.grandTotalJpy.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {inv.items.length} line items
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-3 px-3 font-mono text-slate-700 text-xs">
                      {inv.paymentDueDate}
                    </td>

                    {/* Status with Toggle Button */}
                    <td className="py-3 px-3 text-xs">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(inv.id)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                        title="Click to toggle Paid/Unpaid"
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span className="font-semibold">{inv.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Direct PDF Download */}
                        <button
                          type="button"
                          onClick={() => onDownloadPdf(inv)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded flex items-center gap-1 shadow-xs transition-colors"
                          title="Download PDF to send to customer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </button>

                        {/* Send to Customer */}
                        <button
                          type="button"
                          onClick={() => onSendCustomer(inv)}
                          className="px-2 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded flex items-center gap-1 transition-colors"
                          title="Send invoice to customer via email or message"
                        >
                          <Mail className="w-3.5 h-3.5 text-emerald-600" />
                          Send
                        </button>

                        {/* View & Preview */}
                        <button
                          type="button"
                          onClick={() => onView(inv)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="Preview Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => onEdit(inv)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="Edit Invoice"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => onDuplicate(inv)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="Duplicate Invoice"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete Invoice #${inv.invoiceNo}?`
                              )
                            ) {
                              onDelete(inv.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Table Footer info */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </div>
        <div className="flex items-center gap-3">
          <span>Click status button to quickly toggle Paid / Unpaid</span>
        </div>
      </div>
    </div>
  );
};
