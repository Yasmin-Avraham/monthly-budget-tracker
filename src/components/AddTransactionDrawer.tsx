import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Calendar,
  Tag,
  FileText,
  Coins,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  APP_CONFIG,
  TRANSACTION_TYPES,
  Transaction,
  TransactionTypeId,
  getCategoriesByType,
} from '../config/budgetConfig';
import {
  formatDateDisplay,
  formatHebrewMonthYear,
  getCurrentYearMonth,
  getDefaultDateForMonth,
  getMonthDateBounds,
  isDateInMonth,
} from '../utils/dateUtils';

interface AddTransactionDrawerProps {
  isOpen: boolean;
  selectedMonth: string;
  onClose: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionDrawer: React.FC<AddTransactionDrawerProps> = ({
  isOpen,
  selectedMonth,
  onClose,
  onAddTransaction,
}) => {
  const [type, setType] = useState<TransactionTypeId>('expense');
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(() =>
    getDefaultDateForMonth(selectedMonth)
  );
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const availableCategories = React.useMemo(
    () => getCategoriesByType(type),
    [type]
  );

  const { minDate, maxDate } = React.useMemo(
    () => getMonthDateBounds(selectedMonth),
    [selectedMonth]
  );

  const isCurrentActiveMonth = selectedMonth === getCurrentYearMonth();

  // Reset category when type changes
  useEffect(() => {
    if (availableCategories.length > 0) {
      setCategoryId(availableCategories[0].id);
    }
  }, [type, availableCategories]);

  // Reset date when selectedMonth changes or drawer opens
  useEffect(() => {
    if (isOpen) {
      setDate(getDefaultDateForMonth(selectedMonth));
      setError(null);
    }
  }, [selectedMonth, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('יש להזין סכום חיובי הגדול מ-0');
      return;
    }

    if (!categoryId) {
      setError('יש לבחור קטגוריה');
      return;
    }

    if (!isDateInMonth(date, selectedMonth)) {
      setError(
        isCurrentActiveMonth
          ? `התאריך חייב להיות בחודש ${formatHebrewMonthYear(selectedMonth)} ולא מאוחר מהיום (${formatDateDisplay(maxDate)})`
          : `התאריך חייב להיות בתוך החודש הנבחר (${formatHebrewMonthYear(selectedMonth)})`
      );
      return;
    }

    onAddTransaction({
      type,
      categoryId,
      amount: Math.round(parsedAmount * 100) / 100,
      date,
      description: description.trim() || undefined,
    });

    // Clear form fields for next entry and close drawer
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden no-print"
      aria-labelledby="drawer-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-r border-slate-200 flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div>
              <h2
                id="drawer-title"
                className="text-lg font-extrabold text-slate-900"
              >
                הוספת תנועה חדשה
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                חודש פעיל: <strong className="text-slate-700">{formatHebrewMonthYear(selectedMonth)}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              aria-label="סגור חלונית"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Prominent Type Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                סוג תנועה
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    type === 'expense'
                      ? 'bg-white shadow-sm text-rose-600 ring-1 ring-rose-500/20'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>{TRANSACTION_TYPES.expense.label}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                    type === 'income'
                      ? 'bg-white shadow-sm text-emerald-600 ring-1 ring-emerald-500/20'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{TRANSACTION_TYPES.income.label}</span>
                </button>
              </div>
            </div>

            {/* 2. Category Selector */}
            <div>
              <label
                htmlFor="tx-category"
                className="block text-xs font-bold text-slate-700 mb-2"
              >
                קטגוריה
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="tx-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Amount Input */}
            <div>
              <label
                htmlFor="tx-amount"
                className="block text-xs font-bold text-slate-700 mb-2"
              >
                סכום ({APP_CONFIG.currencySymbol})
              </label>
              <div className="relative">
                <Coins className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="tx-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pr-10 pl-10 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 font-extrabold text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
                  {APP_CONFIG.currencySymbol}
                </span>
              </div>
            </div>

            {/* 4. Date Input (Strictly locked to selected month, and capped at today if current month) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="tx-date"
                  className="block text-xs font-bold text-slate-700"
                >
                  תאריך
                </label>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {isCurrentActiveMonth
                    ? `עד היום (${formatDateDisplay(maxDate)})`
                    : `מוגבל ל-${formatHebrewMonthYear(selectedMonth)}`}
                </span>
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="tx-date"
                  type="date"
                  required
                  min={minDate}
                  max={maxDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* 5. Description Input */}
            <div>
              <label
                htmlFor="tx-description"
                className="block text-xs font-bold text-slate-700 mb-2"
              >
                תיאור / הערה (אופציונלי)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                <input
                  id="tx-description"
                  type="text"
                  maxLength={100}
                  placeholder="לדוגמה: קניות לשבת, משכורת חודשית..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm text-white shadow-md transition-all"
                style={{
                  backgroundColor:
                    type === 'income'
                      ? TRANSACTION_TYPES.income.color
                      : TRANSACTION_TYPES.expense.color,
                }}
              >
                <Plus className="w-5 h-5" />
                <span>
                  הוסף {TRANSACTION_TYPES[type].label}
                </span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
