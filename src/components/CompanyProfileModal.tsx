import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import { CompanyLogo } from './CompanyLogo';
import { X, Upload, RotateCcw, Check } from 'lucide-react';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CompanyProfile;
  onSave: (updated: CompanyProfile) => void;
  onResetData: () => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onResetData,
}) => {
  const [formData, setFormData] = useState<CompanyProfile>(profile);
  const [savedAlert, setSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof CompanyProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankChange = (field: keyof CompanyProfile['bankDetails'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value,
      },
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange('customLogoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Company Branding & Bank Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These details automatically populate all Booking Confirmations, Freight Invoices, and Bank Transfer instructions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {savedAlert && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Company profile updated successfully!
            </div>
          )}

          {/* Logo & Brand Display */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <CompanyLogo customLogoUrl={formData.customLogoUrl} size="lg" />
              <div>
                <div className="text-xs font-bold text-slate-800">Company Logo & Mark</div>
                <div className="text-[11px] text-slate-500">
                  Default is Yokohama Trading & Logistics emblem or upload your custom logo PNG/JPG
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 flex items-center gap-1.5 shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              {formData.customLogoUrl && (
                <button
                  type="button"
                  onClick={() => handleFieldChange('customLogoUrl', undefined)}
                  className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded"
                >
                  Reset Logo
                </button>
              )}
            </div>
          </div>

          {/* Section 1: Company Names & Representative */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name (English) *
              </label>
              <input
                type="text"
                required
                value={formData.companyNameEn}
                onChange={(e) => handleFieldChange('companyNameEn', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name (Japanese)
              </label>
              <input
                type="text"
                value={formData.companyNameJp}
                onChange={(e) => handleFieldChange('companyNameJp', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Representative / Owner Name
              </label>
              <input
                type="text"
                value={formData.ownerNameEn}
                onChange={(e) => handleFieldChange('ownerNameEn', e.target.value)}
                placeholder="Muhammad Fareed"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registration No (登録番号)
              </label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => handleFieldChange('registrationNumber', e.target.value)}
                placeholder="T9120001213448"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono font-semibold"
              />
            </div>
          </div>

          {/* Section 2: Addresses & Contact Numbers */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Location & Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Address (Japanese)
                </label>
                <input
                  type="text"
                  value={formData.addressJp}
                  onChange={(e) => handleFieldChange('addressJp', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Address (English)
                </label>
                <input
                  type="text"
                  value={formData.addressEn}
                  onChange={(e) => handleFieldChange('addressEn', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Office Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Phone
                </label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => handleFieldChange('mobile', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fax
                </label>
                <input
                  type="text"
                  value={formData.fax}
                  onChange={(e) => handleFieldChange('fax', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Dual Bank Details */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Bank Account Details (Printed on Invoices)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Japanese Bank Details */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
                <div className="text-xs font-bold text-sky-900 border-b pb-1">
                  Japanese Account (日本語表記)
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">口座名義</label>
                  <input
                    type="text"
                    value={formData.bankDetails.accountNameJp}
                    onChange={(e) => handleBankChange('accountNameJp', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">銀行名</label>
                    <input
                      type="text"
                      value={formData.bankDetails.bankNameJp}
                      onChange={(e) => handleBankChange('bankNameJp', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">銀行コード</label>
                    <input
                      type="text"
                      value={formData.bankDetails.bankCode}
                      onChange={(e) => handleBankChange('bankCode', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">支店名</label>
                    <input
                      type="text"
                      value={formData.bankDetails.branchNameJp}
                      onChange={(e) => handleBankChange('branchNameJp', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">支店コード</label>
                    <input
                      type="text"
                      value={formData.bankDetails.branchCode}
                      onChange={(e) => handleBankChange('branchCode', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">口座番号</label>
                    <input
                      type="text"
                      value={formData.bankDetails.accountNumber}
                      onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">SWIFTコード</label>
                    <input
                      type="text"
                      value={formData.bankDetails.swiftCode}
                      onChange={(e) => handleBankChange('swiftCode', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* English Bank Details */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
                <div className="text-xs font-bold text-sky-900 border-b pb-1">
                  English Account (For International Wires)
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">ACCOUNT NAME</label>
                  <input
                    type="text"
                    value={formData.bankDetails.accountNameEn}
                    onChange={(e) => handleBankChange('accountNameEn', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">BANK NAME</label>
                  <input
                    type="text"
                    value={formData.bankDetails.bankNameEn}
                    onChange={(e) => handleBankChange('bankNameEn', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">BRANCH</label>
                    <input
                      type="text"
                      value={formData.bankDetails.branchNameEn}
                      onChange={(e) => handleBankChange('branchNameEn', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">ACCOUNT TYPE</label>
                    <input
                      type="text"
                      value={formData.bankDetails.accountTypeEn}
                      onChange={(e) => handleBankChange('accountTypeEn', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reset Demo Data options */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    'Reset all bookings, invoices, and settings to original sample records?'
                  )
                ) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Records to Default
            </button>

            <div className="flex items-center gap-3">
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
                Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
