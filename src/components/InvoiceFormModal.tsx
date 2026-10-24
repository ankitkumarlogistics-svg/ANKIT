import React, { useState, useEffect } from 'react';
import { FreightInvoice, InvoiceItem, InvoiceStatus, BookingConfirmation } from '../types';
import { X, Plus, Trash2, Sparkles, Link2 } from 'lucide-react';

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: FreightInvoice) => void;
  initialData?: FreightInvoice | null;
  availableBookings?: BookingConfirmation[];
  prefillFromBooking?: BookingConfirmation | null;
}

const COMMON_ITEM_TYPES = [
  'Freight',
  'Doc Fee',
  'THC',
  'Seal Fee',
  'Other Charges',
  'Custom Clearance',
  'Storage',
  'Drayage',
  'Inspection Fee',
  'Courier / BL Fee',
];

export const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  availableBookings = [],
  prefillFromBooking,
}) => {
  const [formData, setFormData] = useState<Partial<FreightInvoice>>({
    invoiceNo: '',
    date: new Date().toISOString().slice(0, 10),
    paymentDueDate: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
    status: 'UNPAID',
    customerName: '',
    customerAddress: '',
    portFrom: 'NAGOYA',
    portTo: 'KARACHI',
    shippingCompany: 'TS LINES',
    vesselVoyage: '',
    etd: '',
    eta: '',
    blNo: '',
    bookingNo: '',
    shipmentMode: 'Container',
    freightTerm: 'PREPAID',
    exchangeRate: 155.0,
    containerCount: 1,
    subTotalJpy: 0,
    discountJpy: 0,
    remarks: '',
    grandTotalJpy: 0,
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);

  // Calculate row total JPY
  const calculateLineTotal = (
    currency: 'USD' | 'JPY',
    unitPrice: number,
    quantity: number,
    taxRate: number,
    rate: number
  ) => {
    const base = unitPrice * quantity;
    const withTax = base * (1 + taxRate / 100);
    if (currency === 'USD') {
      return Math.round(withTax * (rate || 1));
    }
    return Math.round(withTax);
  };

  // Recompute overall totals whenever items, exchange rate, or discount change
  useEffect(() => {
    const rate = formData.exchangeRate || 1;
    const updatedItems = items.map((item) => ({
      ...item,
      lineTotalJpy: calculateLineTotal(
        item.currency,
        item.unitPrice,
        item.quantity,
        item.taxRate,
        rate
      ),
    }));

    const subTotal = updatedItems.reduce((acc, cur) => acc + cur.lineTotalJpy, 0);
    const discount = formData.discountJpy || 0;
    const grandTotal = Math.max(0, subTotal - discount);

    setFormData((prev) => ({
      ...prev,
      subTotalJpy: subTotal,
      grandTotalJpy: grandTotal,
    }));
  }, [items, formData.exchangeRate, formData.discountJpy]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setItems(initialData.items || []);
    } else if (prefillFromBooking) {
      applyBookingData(prefillFromBooking);
    } else {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      setFormData({
        invoiceNo: `YTL-FI-${randomNum}`,
        date: new Date().toISOString().slice(0, 10),
        paymentDueDate: new Date(Date.now() + 22 * 86400000).toISOString().slice(0, 10),
        status: 'UNPAID',
        customerName: 'HBI CO., LTD',
        customerAddress: 'YATOMI-SHI, TOKAI, JAPAN',
        portFrom: 'NAGOYA',
        portTo: 'KARACHI',
        shippingCompany: 'TS LINES',
        vesselVoyage: 'OKEE AURELIA 167W',
        etd: new Date().toISOString().slice(0, 10),
        eta: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
        blNo: '',
        bookingNo: '',
        shipmentMode: 'Container',
        freightTerm: 'PREPAID',
        exchangeRate: 155.0,
        containerCount: 1,
        subTotalJpy: 0,
        discountJpy: 0,
        remarks: 'SHIPPER - CARCADE INTERNATIONAL LTD.',
        grandTotalJpy: 0,
      });
      setItems([
        {
          id: `item-${Date.now()}-1`,
          details: 'Freight',
          description: 'OCEAN FREIGHT - $ 1,800 X 1 CONT. TAX FREE',
          currency: 'USD',
          unitPrice: 1800,
          quantity: 1,
          taxRate: 0,
          lineTotalJpy: 1800 * 155,
        },
        {
          id: `item-${Date.now()}-2`,
          details: 'Doc Fee',
          description: 'DOCUMENTATION FEE',
          currency: 'JPY',
          unitPrice: 6100,
          quantity: 1,
          taxRate: 0,
          lineTotalJpy: 6100,
        },
        {
          id: `item-${Date.now()}-3`,
          details: 'THC',
          description: 'CONTAINER SEAL FEE',
          currency: 'JPY',
          unitPrice: 2800,
          quantity: 1,
          taxRate: 0,
          lineTotalJpy: 2800,
        },
      ]);
    }
  }, [initialData, prefillFromBooking, isOpen]);

  if (!isOpen) return null;

  const applyBookingData = (booking: BookingConfirmation) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData((prev) => ({
      ...prev,
      invoiceNo: prev.invoiceNo || `YTL-FI-${randomNum}`,
      date: new Date().toISOString().slice(0, 10),
      paymentDueDate: new Date(Date.now() + 22 * 86400000).toISOString().slice(0, 10),
      status: 'UNPAID',
      customerName: booking.customerCompany,
      customerAddress: booking.customerCompany.includes('HBI')
        ? 'YATOMI-SHI, TOKAI, JAPAN'
        : 'TOKYO, JAPAN',
      portFrom: booking.pol || booking.por || 'NAGOYA',
      portTo: booking.pod || booking.pody || 'DUBLIN',
      shippingCompany: booking.shippingCompany,
      vesselVoyage: `${booking.vessel} ${booking.voyage}`.trim(),
      etd: booking.etd,
      eta: booking.eta,
      bookingNo: booking.bookingNumber,
      blNo: `BL-${booking.bookingNumber}`,
      shipmentMode: booking.cargoVolumeSize || 'Container',
      freightTerm: booking.freightTerm.includes('COLLECT') ? 'COLLECT' : 'PREPAID',
      exchangeRate: 155.0,
      containerCount: 1,
      linkedBookingId: booking.id,
      remarks: `SHIPPER: ${booking.shipperCompany || 'AS ACTUAL'} · COMMODITY: ${booking.commodity}`,
    }));

    if (items.length === 0) {
      setItems([
        {
          id: `item-${Date.now()}-1`,
          details: 'Freight',
          description: `OCEAN FREIGHT TO ${booking.pod} - 1 CONT. TAX FREE`,
          currency: 'USD',
          unitPrice: 2200,
          quantity: 1,
          taxRate: 0,
          lineTotalJpy: 2200 * 155,
        },
        {
          id: `item-${Date.now()}-2`,
          details: 'Doc Fee',
          description: 'DOCUMENTATION FEE',
          currency: 'JPY',
          unitPrice: 6600,
          quantity: 1,
          taxRate: 10,
          lineTotalJpy: 7260,
        },
        {
          id: `item-${Date.now()}-3`,
          details: 'THC',
          description: 'TERMINAL HANDLING CHARGE',
          currency: 'JPY',
          unitPrice: 35000,
          quantity: 1,
          taxRate: 10,
          lineTotalJpy: 38500,
        },
      ]);
    }
  };

  const handleFieldChange = (field: keyof FreightInvoice, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (detailsType = 'Other Charges') => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      details: detailsType,
      description: `${detailsType.toUpperCase()} CHARGE`,
      currency: 'JPY',
      unitPrice: 5000,
      quantity: 1,
      taxRate: 0,
      lineTotalJpy: 5000,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: any
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAutoNumber = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData((prev) => ({ ...prev, invoiceNo: `YTL-FI-${randomNum}` }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.invoiceNo || !formData.customerName) {
      alert('Please enter Invoice Number and Customer Name');
      return;
    }

    const rate = formData.exchangeRate || 1;
    const finalItems = items.map((item) => ({
      ...item,
      lineTotalJpy: calculateLineTotal(
        item.currency,
        item.unitPrice,
        item.quantity,
        item.taxRate,
        rate
      ),
    }));

    const subTotal = finalItems.reduce((acc, cur) => acc + cur.lineTotalJpy, 0);
    const discount = Number(formData.discountJpy) || 0;
    const grandTotal = Math.max(0, subTotal - discount);
    const now = new Date().toISOString();

    const finalInvoice: FreightInvoice = {
      ...(formData as FreightInvoice),
      id: initialData?.id || `inv-${Date.now()}`,
      items: finalItems,
      subTotalJpy: subTotal,
      discountJpy: discount,
      grandTotalJpy: grandTotal,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };

    onSave(finalInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {initialData ? 'Edit Freight Invoice' : 'Create New Freight Invoice'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Auto-computes USD/JPY exchange rates, tax breakdown, and A4 print layout
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Link from Booking Banner if available */}
        {availableBookings.length > 0 && !initialData && (
          <div className="px-6 py-2.5 bg-sky-50 border-b border-sky-100 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-sky-900 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-sky-600" />
              Autofill from Booking:
            </span>
            <select
              onChange={(e) => {
                const b = availableBookings.find((x) => x.id === e.target.value);
                if (b) applyBookingData(b);
              }}
              className="text-xs bg-white border border-sky-300 rounded px-2.5 py-1 text-slate-800 font-medium"
              defaultValue=""
            >
              <option value="" disabled>
                Select a booking to import...
              </option>
              {availableBookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bookingNumber} · {b.customerCompany} ({b.pod})
                </option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Invoice Header Info */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Invoice No *
                </label>
                <button
                  type="button"
                  onClick={handleAutoNumber}
                  className="text-[11px] text-sky-700 hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3" /> Auto
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.invoiceNo || ''}
                onChange={(e) => handleFieldChange('invoiceNo', e.target.value.toUpperCase())}
                placeholder="YTL-FI-133916"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-700 mb-1">
                Payment Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.paymentDueDate || ''}
                onChange={(e) => handleFieldChange('paymentDueDate', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-rose-300 bg-rose-50/40 rounded-lg focus:ring-2 focus:ring-rose-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Status
              </label>
              <select
                value={formData.status || 'UNPAID'}
                onChange={(e) => handleFieldChange('status', e.target.value as InvoiceStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-medium"
              >
                <option value="UNPAID">UNPAID</option>
                <option value="PAID">PAID</option>
                <option value="PARTIAL">PARTIAL</option>
                <option value="OVERDUE">OVERDUE</option>
              </select>
            </div>
          </div>

          {/* Section 2: Customer M/S & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                M / S (Customer Name) *
              </label>
              <input
                type="text"
                required
                value={formData.customerName || ''}
                onChange={(e) => handleFieldChange('customerName', e.target.value)}
                placeholder="e.g. HBI CO., LTD"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Address
              </label>
              <input
                type="text"
                value={formData.customerAddress || ''}
                onChange={(e) => handleFieldChange('customerAddress', e.target.value)}
                placeholder="e.g. YATOMI-SHI, TOKAI, AICHI"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Section 3: Vessel, Voyage, Ports, Reference */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Shipment & Logistics Parameters
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Port from
                </label>
                <input
                  type="text"
                  value={formData.portFrom || ''}
                  onChange={(e) => handleFieldChange('portFrom', e.target.value.toUpperCase())}
                  placeholder="NAGOYA"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Port to
                </label>
                <input
                  type="text"
                  value={formData.portTo || ''}
                  onChange={(e) => handleFieldChange('portTo', e.target.value.toUpperCase())}
                  placeholder="KARACHI"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shipping Line
                </label>
                <input
                  type="text"
                  value={formData.shippingCompany || ''}
                  onChange={(e) => handleFieldChange('shippingCompany', e.target.value)}
                  placeholder="TS LINES"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vessel & Voy
                </label>
                <input
                  type="text"
                  value={formData.vesselVoyage || ''}
                  onChange={(e) => handleFieldChange('vesselVoyage', e.target.value)}
                  placeholder="OKEE AURELIA 167W"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ETD
                </label>
                <input
                  type="text"
                  value={formData.etd || ''}
                  onChange={(e) => handleFieldChange('etd', e.target.value)}
                  placeholder="30-Aug-2026"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ETA
                </label>
                <input
                  type="text"
                  value={formData.eta || ''}
                  onChange={(e) => handleFieldChange('eta', e.target.value)}
                  placeholder="20-Sep-2026"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  B/L No.
                </label>
                <input
                  type="text"
                  value={formData.blNo || ''}
                  onChange={(e) => handleFieldChange('blNo', e.target.value)}
                  placeholder="120610087601"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Booking No
                </label>
                <input
                  type="text"
                  value={formData.bookingNo || ''}
                  onChange={(e) => handleFieldChange('bookingNo', e.target.value)}
                  placeholder="120BK6009764"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shipment Mode
                </label>
                <input
                  type="text"
                  value={formData.shipmentMode || ''}
                  onChange={(e) => handleFieldChange('shipmentMode', e.target.value)}
                  placeholder="Container"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Freight Term
                </label>
                <select
                  value={formData.freightTerm || 'PREPAID'}
                  onChange={(e) => handleFieldChange('freightTerm', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
                >
                  <option value="PREPAID">PREPAID</option>
                  <option value="COLLECT">COLLECT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sky-800 mb-1">
                  Exchange Rate (USD → JPY)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.exchangeRate || 155}
                  onChange={(e) => handleFieldChange('exchangeRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-sky-300 bg-sky-50/40 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. of Containers
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.containerCount || 1}
                  onChange={(e) => handleFieldChange('containerCount', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Line Items Table */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Line Items & Charges Breakdown
                </h4>
                <p className="text-[11px] text-slate-500">
                  Select USD or JPY; USD items automatically convert to JPY at rate {formData.exchangeRate}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddItem('Other Charges')}
                  className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Charge Item
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => {
                const calculatedJpy = calculateLineTotal(
                  item.currency,
                  item.unitPrice,
                  item.quantity,
                  item.taxRate,
                  formData.exchangeRate || 1
                );

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-12 gap-2.5 items-center"
                  >
                    {/* Item Details Type */}
                    <div className="col-span-12 sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Details Type
                      </label>
                      <input
                        type="text"
                        list={`item-types-${index}`}
                        value={item.details}
                        onChange={(e) => handleItemChange(index, 'details', e.target.value)}
                        placeholder="Freight / THC"
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white font-medium"
                      />
                      <datalist id={`item-types-${index}`}>
                        {COMMON_ITEM_TYPES.map((t) => (
                          <option key={t} value={t} />
                        ))}
                      </datalist>
                    </div>

                    {/* Description */}
                    <div className="col-span-12 sm:col-span-4">
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="e.g. FREIGHT - $ 1830 X 1 CONT. TAX FREE"
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      />
                    </div>

                    {/* Currency */}
                    <div className="col-span-4 sm:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Curr
                      </label>
                      <select
                        value={item.currency}
                        onChange={(e) =>
                          handleItemChange(index, 'currency', e.target.value as 'USD' | 'JPY')
                        }
                        className="w-full px-1.5 py-1.5 text-xs border border-slate-300 rounded bg-white font-mono font-bold"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>

                    {/* Price */}
                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Price {item.currency === 'USD' ? '($)' : '(¥)'}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white font-mono"
                      />
                    </div>

                    {/* Tax Rate */}
                    <div className="col-span-4 sm:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        Tax %
                      </label>
                      <select
                        value={item.taxRate}
                        onChange={(e) =>
                          handleItemChange(index, 'taxRate', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-1 py-1.5 text-xs border border-slate-300 rounded bg-white font-mono"
                      >
                        <option value="0">0%</option>
                        <option value="10">10%</option>
                      </select>
                    </div>

                    {/* Calculated JPY Total */}
                    <div className="col-span-10 sm:col-span-1 text-right">
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                        JPY Total
                      </label>
                      <span className="font-mono text-xs font-bold text-slate-900 block py-1">
                        ¥{calculatedJpy.toLocaleString()}
                      </span>
                    </div>

                    {/* Delete button */}
                    <div className="col-span-2 sm:col-span-1 text-center">
                      <label className="block text-[10px] text-transparent mb-0.5">X</label>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Totals, Discount & Remarks */}
          <div className="border-t border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Remarks (e.g. Shipper / Reference)
              </label>
              <textarea
                rows={3}
                value={formData.remarks || ''}
                onChange={(e) => handleFieldChange('remarks', e.target.value)}
                placeholder="SHIPPER - CARCADE INTERNATIONAL LTD."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Sub Total (JPY):</span>
                <span className="font-mono font-semibold text-slate-900">
                  ¥{(formData.subTotalJpy || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-600">
                <span>Discount (JPY):</span>
                <div className="w-32">
                  <input
                    type="number"
                    min="0"
                    value={formData.discountJpy || 0}
                    onChange={(e) =>
                      handleFieldChange('discountJpy', parseInt(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-right font-mono"
                  />
                </div>
              </div>

              <div className="border-t border-slate-300 pt-2 flex justify-between items-center bg-emerald-50 p-2.5 rounded">
                <span className="font-bold text-slate-900 text-sm">Grand Total:</span>
                <span className="font-mono font-extrabold text-base text-emerald-800">
                  ¥{(formData.grandTotalJpy || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 shadow-sm transition-colors"
            >
              {initialData ? 'Update Freight Invoice' : 'Save & Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
