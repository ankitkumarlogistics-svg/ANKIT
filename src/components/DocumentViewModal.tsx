import React, { useState } from 'react';
import { BookingConfirmation, FreightInvoice, CompanyProfile } from '../types';
import { BookingDocumentView } from './BookingDocumentView';
import { InvoiceDocumentView } from './InvoiceDocumentView';
import { downloadElementAsPdf, printElement } from '../utils/pdfExport';
import { exportBookingsToExcel, exportInvoicesToExcel } from '../utils/excelExport';
import { X, Printer, Download, FileSpreadsheet, Edit3, ArrowRight, Check } from 'lucide-react';

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'booking' | 'invoice';
  booking?: BookingConfirmation | null;
  invoice?: FreightInvoice | null;
  company: CompanyProfile;
  onEdit: () => void;
  onConvertToInvoice?: (booking: BookingConfirmation) => void;
  onOpenSendModal?: () => void;
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  isOpen,
  onClose,
  documentType,
  booking,
  invoice,
  company,
  onEdit,
  onConvertToInvoice,
  onOpenSendModal,
}) => {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const title =
    documentType === 'booking'
      ? `Booking Confirmation #${booking?.bookingNumber}`
      : `Freight Invoice #${invoice?.invoiceNo}`;

  const elementId =
    documentType === 'booking' ? 'booking-print-document' : 'invoice-print-document';

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      const filename =
        documentType === 'booking'
          ? `Booking_${booking?.bookingNumber || 'doc'}.pdf`
          : `Invoice_${invoice?.invoiceNo || 'doc'}.pdf`;

      await downloadElementAsPdf({ elementId, filename });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback directly to native print dialog
      alert('Generating high-res print view. Please click "Save as PDF" in the destination box.');
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleExcelExportSingle = () => {
    if (documentType === 'booking' && booking) {
      exportBookingsToExcel([booking]);
    } else if (documentType === 'invoice' && invoice) {
      exportInvoicesToExcel([invoice]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 rounded-xl shadow-2xl border border-slate-300 w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[96vh]">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">{title}</h3>
              <p className="text-xs text-slate-400">
                Official Document · Ready to download as PDF and send to customer
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct PDF Download button - PROMINENT */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  PDF Downloaded!
                </>
              ) : isDownloadingPdf ? (
                'Creating PDF...'
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </button>

            {/* Print / Save as PDF native vector print */}
            <button
              type="button"
              onClick={printElement}
              className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              title="Print directly or save as vector PDF with native print dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>

            {/* Send to Customer button */}
            {onOpenSendModal && (
              <button
                type="button"
                onClick={onOpenSendModal}
                className="px-3.5 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                title="Send via Email or Copy WhatsApp Message"
              >
                Send to Customer
              </button>
            )}

            {/* Convert to Invoice button if it is a booking */}
            {documentType === 'booking' && booking && onConvertToInvoice && (
              <button
                type="button"
                onClick={() => {
                  onConvertToInvoice(booking);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-sky-100 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Create an invoice from this booking"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                To Invoice
              </button>
            )}

            {/* Edit button */}
            <button
              type="button"
              onClick={() => {
                onEdit();
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>

            {/* Excel export */}
            <button
              type="button"
              onClick={handleExcelExportSingle}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-200 bg-emerald-950/80 hover:bg-emerald-900 rounded-md border border-emerald-800 flex items-center gap-1.5 transition-colors"
              title="Download this record in Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Excel
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>


        {/* Document Scrollable Area */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-200/80 flex-1 flex justify-center">
          {documentType === 'booking' && booking && (
            <BookingDocumentView booking={booking} company={company} id={elementId} />
          )}

          {documentType === 'invoice' && invoice && (
            <InvoiceDocumentView invoice={invoice} company={company} id={elementId} />
          )}
        </div>
      </div>
    </div>
  );
};
