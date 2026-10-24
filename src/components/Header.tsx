import React from 'react';
import { ActiveTab, CompanyProfile } from '../types';
import { CompanyLogo } from './CompanyLogo';
import { FileSpreadsheet, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  company: CompanyProfile;
  onOpenSettings: () => void;
  onExportAllExcel: () => void;
  onNewBooking: () => void;
  onNewInvoice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  company,
  onOpenSettings,
  onExportAllExcel,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single-element Brand Wordmark */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer shrink-0 flex items-center gap-3 select-none"
          >
            <CompanyLogo
              customLogoUrl={company.customLogoUrl}
              size="md"
              showSubtitle={true}
            />
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-sky-600 text-sky-900 font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Overview
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
                activeTab === 'bookings'
                  ? 'border-sky-600 text-sky-900 font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Bookings
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('invoices')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
                activeTab === 'invoices'
                  ? 'border-sky-600 text-sky-900 font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Freight Invoices
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="whitespace-nowrap shrink-0 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Settings
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onExportAllExcel}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Download all booking confirmations and invoices into a multi-sheet Excel spreadsheet"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-950" />
              <span>Download Excel</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
