import React from 'react';
import {
  Wallet,
  Calendar,
  FileSpreadsheet,
  Printer,
  Plus,
  Info,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { APP_CONFIG } from '../config/budgetConfig';
import {
  formatHebrewMonthYear,
  generateSelectableMonths,
  getCurrentYearMonth,
  isFutureYearMonth,
  shiftYearMonth,
} from '../utils/dateUtils';

interface HeaderProps {
  selectedMonth: string;
  onSelectMonth: (newMonth: string) => void;
  onOpenDrawer: () => void;
  onExportExcel: () => void;
  onPrintPdf: () => void;
  hasTransactions: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedMonth,
  onSelectMonth,
  onOpenDrawer,
  onExportExcel,
  onPrintPdf,
  hasTransactions,
}) => {
  const currentYearMonth = getCurrentYearMonth();
  const monthOptions = React.useMemo(() => {
    const baseOptions = generateSelectableMonths();
    // Ensure selectedMonth is present in case user navigated further back in the past
    if (
      !isFutureYearMonth(selectedMonth) &&
      !baseOptions.some((o) => o.value === selectedMonth)
    ) {
      return [
        { value: selectedMonth, label: formatHebrewMonthYear(selectedMonth) },
        ...baseOptions,
      ].sort((a, b) => a.value.localeCompare(b.value));
    }
    return baseOptions;
  }, [selectedMonth]);

  const nextMonth = shiftYearMonth(selectedMonth, 1);
  const isNextMonthDisabled = nextMonth > currentYearMonth;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
      {/* Subtle session warning banner */}
      <div className="bg-amber-50/90 border-b border-amber-200/70 px-4 py-1.5 text-amber-900 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center font-medium">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{APP_CONFIG.sessionNotice}</span>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Brand / Title & Month Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  ניהול תקציב חודשי
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  מעקב הכנסות והוצאות אישי • {formatHebrewMonthYear(selectedMonth)}
                </p>
              </div>
            </div>

            {/* Month/Year Selector (Current or Past Months Only) */}
            <div className="flex items-center bg-slate-100/90 border border-slate-200/80 rounded-xl p-1 shadow-inner">
              <button
                type="button"
                onClick={() => onSelectMonth(shiftYearMonth(selectedMonth, -1))}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
                title="חודש קודם"
                aria-label="חודש קודם"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="relative flex items-center px-2">
                <Calendar className="w-4 h-4 text-emerald-600 ml-2 pointer-events-none" />
                <select
                  aria-label="בחירת חודש ושנה"
                  value={selectedMonth}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!isFutureYearMonth(val)) {
                      onSelectMonth(val);
                    }
                  }}
                  className="bg-transparent font-bold text-slate-800 text-sm sm:text-base focus:outline-none cursor-pointer pr-1 pl-2 py-1"
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                disabled={isNextMonthDisabled}
                onClick={() => {
                  if (!isNextMonthDisabled) {
                    onSelectMonth(nextMonth);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-35 disabled:pointer-events-none transition-all"
                title={
                  isNextMonthDisabled
                    ? 'לא ניתן לבחור חודש עתידי'
                    : 'חודש הבא'
                }
                aria-label="חודש הבא"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onExportExcel}
              disabled={!hasTransactions}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-45 disabled:pointer-events-none transition-all shadow-sm"
              title="ייצוא הנתונים לקובץ Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>ייצוא לאקסל</span>
            </button>

            <button
              type="button"
              onClick={onPrintPdf}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              title="תצוגת הדפסה או שמירה כ-PDF"
            >
              <Printer className="w-4 h-4 text-sky-600" />
              <span>תצוגת PDF / הדפסה</span>
            </button>

            <button
              type="button"
              onClick={onOpenDrawer}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-600/20 transition-all mr-auto lg:mr-0"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>+ הוספת הכנסה / הוצאה</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
