import { useState } from 'react';
import { flushSync } from 'react-dom';
import {
  BookingConfirmation,
  FreightInvoice,
  InvoiceStatus,
  CompanyProfile,
  ActiveTab,
} from './types';
import {
  getCompanyProfile,
  saveCompanyProfile,
  getBookings,
  saveBookings,
  getInvoices,
  saveInvoices,
  resetAllToDefault,
} from './utils/storage';
import { exportAllRecordsToExcel } from './utils/excelExport';
import { downloadElementAsPdf } from './utils/pdfExport';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { BookingList } from './components/BookingList';
import { InvoiceList } from './components/InvoiceList';
import { BookingFormModal } from './components/BookingFormModal';
import { InvoiceFormModal } from './components/InvoiceFormModal';
import { DocumentViewModal } from './components/DocumentViewModal';
import { CompanyProfileModal } from './components/CompanyProfileModal';
import { SendCustomerModal } from './components/SendCustomerModal';
import { BookingDocumentView } from './components/BookingDocumentView';
import { InvoiceDocumentView } from './components/InvoiceDocumentView';
import {
  FileText,
  Receipt,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Download,
  Mail,
  Check,
  Loader2,
} from 'lucide-react';

export default function App() {
  const [company, setCompany] = useState<CompanyProfile>(getCompanyProfile);
  const [bookings, setBookings] = useState<BookingConfirmation[]>(getBookings);
  const [invoices, setInvoices] = useState<FreightInvoice[]>(getInvoices);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingConfirmation | null>(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<FreightInvoice | null>(null);
  const [prefillBookingForInvoice, setPrefillBookingForInvoice] =
    useState<BookingConfirmation | null>(null);

  const [isDocViewOpen, setIsDocViewOpen] = useState(false);
  const [docViewType, setDocViewType] = useState<'booking' | 'invoice'>('booking');
  const [viewingBooking, setViewingBooking] = useState<BookingConfirmation | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<FreightInvoice | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Send to Customer Modal state
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendDocType, setSendDocType] = useState<'booking' | 'invoice'>('booking');
  const [sendBooking, setSendBooking] = useState<BookingConfirmation | null>(null);
  const [sendInvoice, setSendInvoice] = useState<FreightInvoice | null>(null);

  // Offscreen PDF state for instant table-row PDF downloads
  const [activeBookingForPdf, setActiveBookingForPdf] = useState<BookingConfirmation | null>(
    () => bookings[0] || null
  );
  const [activeInvoiceForPdf, setActiveInvoiceForPdf] = useState<FreightInvoice | null>(
    () => invoices[0] || null
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Direct PDF Download Handler for Bookings
  const handleDirectDownloadBooking = async (booking: BookingConfirmation) => {
    try {
      flushSync(() => {
        setActiveBookingForPdf(booking);
        setDownloadingId(booking.id);
      });

      await downloadElementAsPdf({
        elementId: 'direct-pdf-booking',
        filename: `Booking_${booking.bookingNumber}.pdf`,
      });
      setDownloadSuccessMessage(`Booking #${booking.bookingNumber} PDF downloaded successfully!`);
      setTimeout(() => setDownloadSuccessMessage(null), 3500);
    } catch (err) {
      console.error('PDF error:', err);
      handleViewBooking(booking);
    } finally {
      setDownloadingId(null);
    }
  };

  // Direct PDF Download Handler for Invoices
  const handleDirectDownloadInvoice = async (invoice: FreightInvoice) => {
    try {
      flushSync(() => {
        setActiveInvoiceForPdf(invoice);
        setDownloadingId(invoice.id);
      });

      await downloadElementAsPdf({
        elementId: 'direct-pdf-invoice',
        filename: `Invoice_${invoice.invoiceNo}.pdf`,
      });
      setDownloadSuccessMessage(`Invoice #${invoice.invoiceNo} PDF downloaded successfully!`);
      setTimeout(() => setDownloadSuccessMessage(null), 3500);
    } catch (err) {
      console.error('PDF error:', err);
      handleViewInvoice(invoice);
    } finally {
      setDownloadingId(null);
    }
  };

  // Send to Customer Handlers
  const handleSendBooking = (booking: BookingConfirmation) => {
    setSendBooking(booking);
    setSendInvoice(null);
    setSendDocType('booking');
    setIsSendModalOpen(true);
  };

  const handleSendInvoice = (invoice: FreightInvoice) => {
    setSendInvoice(invoice);
    setSendBooking(null);
    setSendDocType('invoice');
    setIsSendModalOpen(true);
  };

  // --- Booking CRUD Handlers ---
  const handleSaveBooking = (booking: BookingConfirmation) => {
    let updated: BookingConfirmation[];
    const exists = bookings.some((b) => b.id === booking.id);
    if (exists) {
      updated = bookings.map((b) => (b.id === booking.id ? booking : b));
    } else {
      updated = [booking, ...bookings];
    }
    setBookings(updated);
    saveBookings(updated);
  };

  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    saveBookings(updated);
  };

  const handleDuplicateBooking = (booking: BookingConfirmation) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const duplicated: BookingConfirmation = {
      ...booking,
      id: `bkg-${Date.now()}`,
      bookingNumber: `TYO${randomNum}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...bookings];
    setBookings(updated);
    saveBookings(updated);
  };

  const handleViewBooking = (booking: BookingConfirmation) => {
    setViewingBooking(booking);
    setViewingInvoice(null);
    setDocViewType('booking');
    setIsDocViewOpen(true);
  };

  const handleEditBooking = (booking: BookingConfirmation) => {
    setEditingBooking(booking);
    setIsBookingModalOpen(true);
  };

  // --- Invoice CRUD Handlers ---
  const handleSaveInvoice = (invoice: FreightInvoice) => {
    let updated: FreightInvoice[];
    const exists = invoices.some((i) => i.id === invoice.id);
    if (exists) {
      updated = invoices.map((i) => (i.id === invoice.id ? invoice : i));
    } else {
      updated = [invoice, ...invoices];
    }
    setInvoices(updated);
    saveInvoices(updated);
  };

  const handleDeleteInvoice = (id: string) => {
    const updated = invoices.filter((i) => i.id !== id);
    setInvoices(updated);
    saveInvoices(updated);
  };

  const handleDuplicateInvoice = (invoice: FreightInvoice) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const duplicated: FreightInvoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNo: `YTL-FI-${randomNum}`,
      date: new Date().toISOString().slice(0, 10),
      paymentDueDate: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
      status: 'UNPAID',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...invoices];
    setInvoices(updated);
    saveInvoices(updated);
  };

  const handleToggleInvoiceStatus = (id: string) => {
    const updated: FreightInvoice[] = invoices.map((inv) => {
      if (inv.id === id) {
        const nextStatus: InvoiceStatus = inv.status === 'PAID' ? 'UNPAID' : 'PAID';
        return { ...inv, status: nextStatus, updatedAt: new Date().toISOString() };
      }
      return inv;
    });
    setInvoices(updated);
    saveInvoices(updated);
  };

  const handleViewInvoice = (invoice: FreightInvoice) => {
    setViewingInvoice(invoice);
    setViewingBooking(null);
    setDocViewType('invoice');
    setIsDocViewOpen(true);
  };

  const handleEditInvoice = (invoice: FreightInvoice) => {
    setEditingInvoice(invoice);
    setPrefillBookingForInvoice(null);
    setIsInvoiceModalOpen(true);
  };

  // Convert Booking to Invoice
  const handleConvertToInvoice = (booking: BookingConfirmation) => {
    setEditingInvoice(null);
    setPrefillBookingForInvoice(booking);
    setIsInvoiceModalOpen(true);
  };

  // Company Profile save
  const handleSaveCompany = (updated: CompanyProfile) => {
    setCompany(updated);
    saveCompanyProfile(updated);
  };

  // Reset to default sample records
  const handleResetData = () => {
    resetAllToDefault();
    setCompany(getCompanyProfile());
    setBookings(getBookings());
    setInvoices(getInvoices());
  };

  // Excel export all
  const handleExportAllExcel = () => {
    exportAllRecordsToExcel(bookings, invoices);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Offscreen PDF render targets for Instant Table-row PDF Downloads */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '850px',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: -999,
        }}
      >
        {activeBookingForPdf && (
          <div id="direct-pdf-booking">
            <BookingDocumentView
              booking={activeBookingForPdf}
              company={company}
              id="booking-doc-render"
            />
          </div>
        )}
        {activeInvoiceForPdf && (
          <div id="direct-pdf-invoice">
            <InvoiceDocumentView
              invoice={activeInvoiceForPdf}
              company={company}
              id="invoice-doc-render"
            />
          </div>
        )}
      </div>

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        company={company}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportAllExcel={handleExportAllExcel}
        onNewBooking={() => {
          setEditingBooking(null);
          setIsBookingModalOpen(true);
        }}
        onNewInvoice={() => {
          setEditingInvoice(null);
          setPrefillBookingForInvoice(null);
          setIsInvoiceModalOpen(true);
        }}
      />

      {/* Download Toast Notification */}
      {downloadSuccessMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-white" />
          <span>{downloadSuccessMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Navigation Tabs for Mobile */}
        <div className="flex sm:hidden items-center justify-between bg-white border border-slate-200 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-sky-700 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'bookings'
                ? 'bg-sky-700 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bookings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'invoices'
                ? 'bg-sky-700 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Invoices
          </button>
        </div>

        {/* VIEW 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Quick Action Strip */}
            <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-400 uppercase">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Freight Forwarding & Vehicle Export Operations</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {company.companyNameEn}
                </h1>
                <p className="text-sm text-slate-300 font-normal leading-relaxed">
                  Generate official A4 Booking Details and Freight Invoices with real-time USD/JPY conversion,
                  instant PDF download for sending to customers, and full Excel record management.
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {company.companyNameJp}
                  </span>
                  <span>·</span>
                  <span>登録番号: {company.registrationNumber}</span>
                  <span>·</span>
                  <span className="text-sky-300 font-semibold">{company.email}</span>
                </div>
              </div>

              {/* Primary Actions Buttons */}
              <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBooking(null);
                    setIsBookingModalOpen(true);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Booking Confirmation
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingInvoice(null);
                    setPrefillBookingForInvoice(null);
                    setIsInvoiceModalOpen(true);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Receipt className="w-4 h-4 text-sky-700" />
                  Create Freight Invoice
                </button>

                <button
                  type="button"
                  onClick={handleExportAllExcel}
                  className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-800 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  Download All Records (Excel)
                </button>
              </div>
            </div>

            {/* Metric KPI cards */}
            <StatsOverview
              bookings={bookings}
              invoices={invoices}
              onSelectBookingsTab={() => setActiveTab('bookings')}
              onSelectInvoicesTab={() => setActiveTab('invoices')}
            />

            {/* Split Grid: Recent Bookings & Invoices with Direct PDF Download */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-sky-700" />
                      <h2 className="text-sm font-bold text-slate-900">Recent Booking Orders</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('bookings')}
                      className="text-xs text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
                    >
                      View All ({bookings.length}) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 mt-2">
                    {bookings.slice(0, 4).map((b) => (
                      <div
                        key={b.id}
                        className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-lg transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sky-900 text-xs">
                              {b.bookingNumber}
                            </span>
                            <span className="text-[11px] text-slate-500">·</span>
                            <span className="font-semibold text-xs text-slate-900">
                              {b.customerCompany}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {b.shippingCompany} · {b.pol} →{' '}
                            <span className="font-semibold text-slate-700">{b.pod}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Direct PDF Download button */}
                          <button
                            type="button"
                            onClick={() => handleDirectDownloadBooking(b)}
                            disabled={downloadingId === b.id}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded flex items-center gap-1 shadow-xs transition-colors disabled:opacity-50"
                            title="Download PDF to send to customer"
                          >
                            {downloadingId === b.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            PDF
                          </button>

                          {/* Send to Customer */}
                          <button
                            type="button"
                            onClick={() => handleSendBooking(b)}
                            className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded"
                            title="Send to Customer"
                          >
                            <Mail className="w-4 h-4 text-emerald-600" />
                          </button>

                          {/* Convert to Invoice */}
                          <button
                            type="button"
                            onClick={() => handleConvertToInvoice(b)}
                            className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                            title="Convert to invoice"
                          >
                            Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBooking(null);
                      setIsBookingModalOpen(true);
                    }}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900"
                  >
                    + Add New Booking
                  </button>
                </div>
              </div>

              {/* Recent Invoices Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-emerald-700" />
                      <h2 className="text-sm font-bold text-slate-900">Recent Freight Invoices</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('invoices')}
                      className="text-xs text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1"
                    >
                      View All ({invoices.length}) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 mt-2">
                    {invoices.slice(0, 4).map((inv) => (
                      <div
                        key={inv.id}
                        className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-lg transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sky-900 text-xs">
                              {inv.invoiceNo}
                            </span>
                            <span className="text-[11px] text-slate-500">·</span>
                            <span className="font-semibold text-xs text-slate-900">
                              {inv.customerName}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {inv.portFrom} → {inv.portTo} · Due: {inv.paymentDueDate}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right mr-1">
                            <div className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                              ¥{inv.grandTotalJpy.toLocaleString()}
                            </div>
                            <span
                              className={`text-[10px] font-semibold ${
                                inv.status === 'PAID' ? 'text-emerald-700' : 'text-amber-700'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </div>

                          {/* Direct PDF Download button */}
                          <button
                            type="button"
                            onClick={() => handleDirectDownloadInvoice(inv)}
                            disabled={downloadingId === inv.id}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded flex items-center gap-1 shadow-xs transition-colors disabled:opacity-50"
                            title="Download PDF to send to customer"
                          >
                            {downloadingId === inv.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            PDF
                          </button>

                          {/* Send to Customer */}
                          <button
                            type="button"
                            onClick={() => handleSendInvoice(inv)}
                            className="p-1.5 text-emerald-800 hover:bg-emerald-50 rounded"
                            title="Send to Customer"
                          >
                            <Mail className="w-4 h-4 text-emerald-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingInvoice(null);
                      setPrefillBookingForInvoice(null);
                      setIsInvoiceModalOpen(true);
                    }}
                    className="text-xs font-semibold text-sky-700 hover:text-sky-900"
                  >
                    + Add New Invoice
                  </button>
                </div>
              </div>
            </div>

            {/* Operational Notes Banner */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 text-sky-800 rounded-lg shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-sky-900">Customer Communication Email: </span>
                  <span className="font-mono font-semibold text-sky-950">{company.email}</span>
                  <span className="text-sky-800 ml-2">
                    · Official Booking Confirmations and Freight Invoices can be downloaded as PDF or sent to overseas buyers instantly.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="text-sky-800 hover:text-sky-950 font-semibold underline shrink-0"
              >
                Settings & Bank Details
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Booking Confirmations</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click [PDF] on any row to immediately download the A4 PDF file to send to your customer
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingBooking(null);
                  setIsBookingModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                New Booking
              </button>
            </div>

            <BookingList
              bookings={bookings}
              onView={handleViewBooking}
              onEdit={handleEditBooking}
              onDelete={handleDeleteBooking}
              onDuplicate={handleDuplicateBooking}
              onConvertToInvoice={handleConvertToInvoice}
              onDownloadPdf={handleDirectDownloadBooking}
              onSendCustomer={handleSendBooking}
              onCreateNew={() => {
                setEditingBooking(null);
                setIsBookingModalOpen(true);
              }}
            />
          </div>
        )}

        {/* VIEW 3: INVOICES TAB */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Freight Invoices</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click [PDF] on any invoice to immediately download the customer invoice PDF with bank details
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingInvoice(null);
                  setPrefillBookingForInvoice(null);
                  setIsInvoiceModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                New Invoice
              </button>
            </div>

            <InvoiceList
              invoices={invoices}
              onView={handleViewInvoice}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteInvoice}
              onDuplicate={handleDuplicateInvoice}
              onToggleStatus={handleToggleInvoiceStatus}
              onDownloadPdf={handleDirectDownloadInvoice}
              onSendCustomer={handleSendInvoice}
              onCreateNew={() => {
                setEditingInvoice(null);
                setPrefillBookingForInvoice(null);
                setIsInvoiceModalOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">{company.companyNameEn}</span>
            <span>·</span>
            <span>{company.companyNameJp}</span>
            <span>·</span>
            <span className="font-mono text-sky-800">{company.email}</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={handleExportAllExcel}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 font-semibold text-emerald-800"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Download All Records (.xlsx)
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Settings & Branding
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Booking Form Modal */}
      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSave={handleSaveBooking}
        initialData={editingBooking}
      />

      {/* 2. Invoice Form Modal */}
      <InvoiceFormModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
        initialData={editingInvoice}
        availableBookings={bookings}
        prefillFromBooking={prefillBookingForInvoice}
      />

      {/* 3. Document View & PDF Generator Modal */}
      <DocumentViewModal
        isOpen={isDocViewOpen}
        onClose={() => setIsDocViewOpen(false)}
        documentType={docViewType}
        booking={viewingBooking}
        invoice={viewingInvoice}
        company={company}
        onEdit={() => {
          if (docViewType === 'booking' && viewingBooking) {
            handleEditBooking(viewingBooking);
          } else if (docViewType === 'invoice' && viewingInvoice) {
            handleEditInvoice(viewingInvoice);
          }
        }}
        onConvertToInvoice={(b) => handleConvertToInvoice(b)}
        onOpenSendModal={() => {
          if (docViewType === 'booking' && viewingBooking) {
            handleSendBooking(viewingBooking);
          } else if (docViewType === 'invoice' && viewingInvoice) {
            handleSendInvoice(viewingInvoice);
          }
        }}
      />

      {/* 4. Company Profile & Settings Modal */}
      <CompanyProfileModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={company}
        onSave={handleSaveCompany}
        onResetData={handleResetData}
      />

      {/* 5. Send to Customer Modal */}
      <SendCustomerModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        documentType={sendDocType}
        booking={sendBooking}
        invoice={sendInvoice}
        company={company}
        onDownloadPdf={() => {
          if (sendDocType === 'booking' && sendBooking) {
            handleDirectDownloadBooking(sendBooking);
          } else if (sendDocType === 'invoice' && sendInvoice) {
            handleDirectDownloadInvoice(sendInvoice);
          }
        }}
      />
    </div>
  );
}
