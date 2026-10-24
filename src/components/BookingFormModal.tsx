import React, { useState, useEffect } from 'react';
import { BookingConfirmation, BookingStatus } from '../types';
import { X, Sparkles } from 'lucide-react';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: BookingConfirmation) => void;
  initialData?: BookingConfirmation | null;
}

const COMMON_PORTS = [
  'NAGOYA',
  'YOKOHAMA',
  'KOBE',
  'OSAKA',
  'TOKYO',
  'MOJI',
  'DUBLIN',
  'KARACHI',
  'MOMBASA',
  'JEBEL ALI',
  'DAR ES SALAAM',
  'SINGAPORE',
  'ROTTERDAM',
  'HAMBURG',
  'CHENNAI',
];

const SHIPPING_LINES = [
  'CMA-CGM',
  'TS LINES',
  'OCEAN NETWORK EXPRESS (ONE)',
  'MSC',
  'MAERSK',
  'EVERGREEN',
  'COSCO SHIPPING',
  'WAN HAI LINES',
  'HAPAG-LLOYD',
];

const CONTAINER_SIZES = [
  "1 X 40' Dry High",
  "1 X 20' Dry",
  "2 X 40' Dry High",
  "1 X 40' Standard",
  '2 X 20\' Dry',
  'RORO (Roll-on/Roll-off)',
  'FLAT RACK 40\'',
];

const COMMODITIES = [
  'USED VEHICLE',
  'USED VEHICLES (TOYOTA LAND CRUISER)',
  'USED MOTOR VEHICLES',
  'AUTO PARTS & SPARES',
  'COMMERCIAL TRUCKS',
  'CONSTRUCTION MACHINERY',
  'GENERAL MERCHANDISE',
];

export const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<BookingConfirmation>>({
    bookingNumber: '',
    status: 'CONFIRMED',
    date: new Date().toISOString().slice(0, 10),
    customerCompany: '',
    forwarderCompany: 'YOKOHAMA TRADING & LOGISTICS',
    shipperCompany: 'AS ACTUAL',
    consigneeCompany: 'AS ACTUAL',
    notifyParty: 'AS ACTUAL',
    shippingCompany: 'CMA-CGM',
    vessel: '',
    voyage: '',
    cyOpenDate: '',
    cyCutDate: '',
    etd: '',
    eta: '',
    por: 'NAGOYA',
    pol: 'NAGOYA',
    pod: 'DUBLIN',
    pody: 'DUBLIN',
    cargoVolumeSize: "1 X 40' Dry High",
    commodity: 'USED VEHICLE',
    blType: 'WAYBILL',
    blDescription: 'SHIPPER REQUEST',
    freightTerm: 'PREPAID as arranged.',
    blIssuePlace: 'OSAKA, JAPAN',
    remarks: 'CUSTOM BY CUSTOMER >> DOC CUT: 10/20 >> CY CUT: 10/22 >> BOOKING SLIDE TO NEXT VESSEL, AS PER CUSTOMER REQUEST',
    note: 'KINDLY SEND US D/R(ACL) AND S/I ONE DAY PRIOR OF CY CUT DATE TO AVOID ANY PENALTY. FAX: 0280-33-6367',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Generate clean new booking number
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      setFormData({
        bookingNumber: `TYO${randomNum}`,
        status: 'CONFIRMED',
        date: new Date().toISOString().slice(0, 10),
        customerCompany: '',
        forwarderCompany: 'YOKOHAMA TRADING & LOGISTICS',
        shipperCompany: 'AS ACTUAL',
        consigneeCompany: 'AS ACTUAL',
        notifyParty: 'AS ACTUAL',
        shippingCompany: 'CMA-CGM',
        vessel: 'CMA CGM ELBE',
        voyage: '0R11MW1MA',
        cyOpenDate: new Date().toISOString().slice(0, 10),
        cyCutDate: new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10),
        etd: new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10),
        eta: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
        por: 'NAGOYA',
        pol: 'NAGOYA',
        pod: 'DUBLIN',
        pody: 'DUBLIN',
        cargoVolumeSize: "1 X 40' Dry High",
        commodity: 'USED VEHICLE',
        blType: 'WAYBILL',
        blDescription: 'SHIPPER REQUEST',
        freightTerm: 'PREPAID as arranged.',
        blIssuePlace: 'OSAKA, JAPAN',
        remarks: 'CUSTOM BY CUSTOMER >> DOC CUT: 10/20 >> CY CUT: 10/22 >> BOOKING SLIDE TO NEXT VESSEL, AS PER CUSTOMER REQUEST',
        note: 'KINDLY SEND US D/R(ACL) AND S/I ONE DAY PRIOR OF CY CUT DATE TO AVOID ANY PENALTY. FAX: 0280-33-6367',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    field: keyof BookingConfirmation,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickNumber = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData((prev) => ({ ...prev, bookingNumber: `TYO${randomNum}` }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookingNumber || !formData.customerCompany) {
      alert('Please enter Booking Number and Customer Company');
      return;
    }

    const now = new Date().toISOString();
    const finalRecord: BookingConfirmation = {
      ...(formData as BookingConfirmation),
      id: initialData?.id || `bkg-${Date.now()}`,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };

    onSave(finalRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {initialData ? 'Edit Booking Confirmation' : 'Create New Booking Confirmation'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill shipping details to generate printable A4 booking order and PDF
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Identification & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Booking Number *
                </label>
                <button
                  type="button"
                  onClick={handleQuickNumber}
                  className="text-[11px] text-sky-700 hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3" /> Auto
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.bookingNumber || ''}
                onChange={(e) => handleChange('bookingNumber', e.target.value.toUpperCase())}
                placeholder="e.g. TYO0799646"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Booking Date
              </label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={formData.status || 'CONFIRMED'}
                onChange={(e) => handleChange('status', e.target.value as BookingStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-medium"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          {/* Section 2: Parties Information */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Shipping Parties
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Company *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerCompany || ''}
                  onChange={(e) => handleChange('customerCompany', e.target.value)}
                  placeholder="e.g. HBI CO., LTD"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Forwarder Company
                </label>
                <input
                  type="text"
                  value={formData.forwarderCompany || ''}
                  onChange={(e) => handleChange('forwarderCompany', e.target.value)}
                  placeholder="e.g. YOKOHAMA TRADING & LOGISTICS"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shipper Company on B/L
                </label>
                <input
                  type="text"
                  value={formData.shipperCompany || ''}
                  onChange={(e) => handleChange('shipperCompany', e.target.value)}
                  placeholder="e.g. AS ACTUAL or CARCADE INTERNATIONAL"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Consignee Company on B/L
                </label>
                <input
                  type="text"
                  value={formData.consigneeCompany || ''}
                  onChange={(e) => handleChange('consigneeCompany', e.target.value)}
                  placeholder="e.g. AS ACTUAL or PAK CARGO"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notify Party on B/L
                </label>
                <input
                  type="text"
                  value={formData.notifyParty || ''}
                  onChange={(e) => handleChange('notifyParty', e.target.value)}
                  placeholder="e.g. AS ACTUAL or SAME AS CONSIGNEE"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Vessel, Voyage & Dates */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Vessel & Schedule
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shipping Line
                </label>
                <input
                  type="text"
                  list="shipping-lines"
                  value={formData.shippingCompany || ''}
                  onChange={(e) => handleChange('shippingCompany', e.target.value)}
                  placeholder="e.g. CMA-CGM"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
                <datalist id="shipping-lines">
                  {SHIPPING_LINES.map((line) => (
                    <option key={line} value={line} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vessel
                </label>
                <input
                  type="text"
                  value={formData.vessel || ''}
                  onChange={(e) => handleChange('vessel', e.target.value)}
                  placeholder="e.g. CMA CGM ELBE"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Voyage
                </label>
                <input
                  type="text"
                  value={formData.voyage || ''}
                  onChange={(e) => handleChange('voyage', e.target.value)}
                  placeholder="e.g. 0R11MW1MA"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CY Open Date
                </label>
                <input
                  type="text"
                  value={formData.cyOpenDate || ''}
                  onChange={(e) => handleChange('cyOpenDate', e.target.value)}
                  placeholder="e.g. 14-Oct-2026"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-700 mb-1">
                  CY Cut Date *
                </label>
                <input
                  type="text"
                  value={formData.cyCutDate || ''}
                  onChange={(e) => handleChange('cyCutDate', e.target.value)}
                  placeholder="e.g. 20-Oct-2026"
                  className="w-full px-3 py-2 text-sm border border-rose-300 bg-rose-50/40 rounded-lg focus:ring-2 focus:ring-rose-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ETD & ETA
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.etd || ''}
                    onChange={(e) => handleChange('etd', e.target.value)}
                    placeholder="ETD (e.g. 23-Oct)"
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                  <input
                    type="text"
                    value={formData.eta || ''}
                    onChange={(e) => handleChange('eta', e.target.value)}
                    placeholder="ETA (e.g. 14-Dec)"
                    className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Routing & Ports */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Ports & Routing
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  POR (Receipt)
                </label>
                <input
                  type="text"
                  list="ports-list"
                  value={formData.por || ''}
                  onChange={(e) => handleChange('por', e.target.value.toUpperCase())}
                  placeholder="e.g. NAGOYA"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  POL (Loading)
                </label>
                <input
                  type="text"
                  list="ports-list"
                  value={formData.pol || ''}
                  onChange={(e) => handleChange('pol', e.target.value.toUpperCase())}
                  placeholder="e.g. NAGOYA"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  POD (Discharge)
                </label>
                <input
                  type="text"
                  list="ports-list"
                  value={formData.pod || ''}
                  onChange={(e) => handleChange('pod', e.target.value.toUpperCase())}
                  placeholder="e.g. DUBLIN"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold text-sky-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PODY (Delivery)
                </label>
                <input
                  type="text"
                  list="ports-list"
                  value={formData.pody || ''}
                  onChange={(e) => handleChange('pody', e.target.value.toUpperCase())}
                  placeholder="e.g. DUBLIN"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>
            </div>
            <datalist id="ports-list">
              {COMMON_PORTS.map((port) => (
                <option key={port} value={port} />
              ))}
            </datalist>
          </div>

          {/* Section 5: Cargo, Commodity, B/L Terms */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Cargo & B/L Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cargo Volume & Size
                </label>
                <input
                  type="text"
                  list="container-sizes"
                  value={formData.cargoVolumeSize || ''}
                  onChange={(e) => handleChange('cargoVolumeSize', e.target.value)}
                  placeholder="e.g. 1 X 40' Dry High"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
                <datalist id="container-sizes">
                  {CONTAINER_SIZES.map((size) => (
                    <option key={size} value={size} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commodity
                </label>
                <input
                  type="text"
                  list="commodities-list"
                  value={formData.commodity || ''}
                  onChange={(e) => handleChange('commodity', e.target.value)}
                  placeholder="e.g. USED VEHICLE"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
                <datalist id="commodities-list">
                  {COMMODITIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  B/L Type
                </label>
                <input
                  type="text"
                  value={formData.blType || ''}
                  onChange={(e) => handleChange('blType', e.target.value)}
                  placeholder="WAYBILL, ORIGINAL B/L, etc."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  B/L Description
                </label>
                <input
                  type="text"
                  value={formData.blDescription || ''}
                  onChange={(e) => handleChange('blDescription', e.target.value)}
                  placeholder="e.g. SHIPPER REQUEST"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  FREIGHT Terms
                </label>
                <input
                  type="text"
                  value={formData.freightTerm || ''}
                  onChange={(e) => handleChange('freightTerm', e.target.value)}
                  placeholder="PREPAID as arranged."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  B/L Issue Place
                </label>
                <input
                  type="text"
                  value={formData.blIssuePlace || ''}
                  onChange={(e) => handleChange('blIssuePlace', e.target.value)}
                  placeholder="e.g. OSAKA, JAPAN"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Remarks & Note */}
          <div className="border-t border-slate-200 pt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Remarks
              </label>
              <textarea
                rows={2}
                value={formData.remarks || ''}
                onChange={(e) => handleChange('remarks', e.target.value)}
                placeholder="Special cuts, custom notes, booking slide instructions..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instruction Note (Shown on Booking Document)
              </label>
              <textarea
                rows={2}
                value={formData.note || ''}
                onChange={(e) => handleChange('note', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-sans"
              />
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
              {initialData ? 'Update Booking' : 'Save & Generate Confirmation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
