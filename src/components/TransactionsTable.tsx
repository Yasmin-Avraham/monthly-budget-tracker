import React, { useState, useMemo } from 'react';
import {
  Trash2,
  ArrowUpDown,
  Sparkles,
  PlusCircle,
  ListFilter,
  ReceiptText,
} from 'lucide-react';
import {
  TRANSACTION_TYPES,
  Transaction,
  TransactionTypeId,
  formatCurrency,
  getCategoryById,
} from '../config/budgetConfig';
import { formatDateDisplay, formatHebrewMonthYear } from '../utils/dateUtils';

interface TransactionsTableProps {
  transactions: Transaction[];
  selectedMonth: string;
  onDeleteTransaction: (id: string) => void;
  onLoadSampleData: () => void;
  onOpenDrawer: () => void;
}

type FilterTab = 'all' | TransactionTypeId;
type SortField = 'date' | 'amount';
type SortDirection = 'desc' | 'asc';

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  selectedMonth,
  onDeleteTransaction,
  onLoadSampleData,
  onOpenDrawer,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    const filtered =
      activeFilter === 'all'
        ? transactions
        : transactions.filter((t) => t.type === activeFilter);

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = a.date.localeCompare(b.date);
      } else {
        comparison = a.amount - b.amount;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [transactions, activeFilter, sortField, sortDirection]);

  return (
    <section
      aria-label="פירוט תנועות חודשי"
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs print-card overflow-hidden"
    >
      {/* Table Header & Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <ReceiptText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              פירוט תנועות ({filteredAndSorted.length})
            </h2>
            <p className="text-xs text-slate-500">
              רשימת כל ההכנסות וההוצאות לחודש {formatHebrewMonthYear(selectedMonth)}
            </p>
          </div>
        </div>

        {/* Filter Tabs & Sort Toggle (Hidden in Print) */}
        <div className="flex flex-wrap items-center gap-3 no-print">
          {/* Filter Tabs */}
          <div
            role="tablist"
            aria-label="סינון תנועות לפי סוג"
            className="inline-flex rounded-xl bg-slate-100 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              הכל ({transactions.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'income'}
              onClick={() => setActiveFilter('income')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeFilter === 'income'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              הכנסות ({transactions.filter((t) => t.type === 'income').length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'expense'}
              onClick={() => setActiveFilter('expense')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeFilter === 'expense'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              הוצאות ({transactions.filter((t) => t.type === 'expense').length})
            </button>
          </div>

          {/* Sort Controls */}
          <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-1">
            <span className="text-xs text-slate-500 px-2 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              מיון:
            </span>
            <button
              type="button"
              onClick={() => handleSortToggle('date')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                sortField === 'date'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              תאריך {sortField === 'date' && (sortDirection === 'desc' ? '↓' : '↑')}
            </button>
            <button
              type="button"
              onClick={() => handleSortToggle('amount')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                sortField === 'amount'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              סכום {sortField === 'amount' && (sortDirection === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {transactions.length === 0 ? (
        <div className="p-10 sm:p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <ListFilter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            עדיין לא הוזנו תנועות בחודש {formatHebrewMonthYear(selectedMonth)}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">
            התחל להזין הכנסות והוצאות או טען נתוני דוגמה כדי להתרשם מהתרשימים, הסיכומים וייצוא הדוחות.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 no-print">
            <button
              type="button"
              onClick={onOpenDrawer}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ הוספת הכנסה / הוצאה</span>
            </button>
            <button
              type="button"
              onClick={onLoadSampleData}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>טען נתוני דוגמה</span>
            </button>
          </div>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="p-10 text-center text-slate-500 text-sm">
          לא נמצאו תנועות המתאימות לסינון שנבחר.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/80 text-slate-600 text-xs font-bold uppercase">
                <th className="py-3.5 px-4 sm:px-6">תאריך</th>
                <th className="py-3.5 px-4">סוג</th>
                <th className="py-3.5 px-4">קטגוריה</th>
                <th className="py-3.5 px-4">תיאור</th>
                <th className="py-3.5 px-4 sm:px-6">סכום</th>
                <th className="py-3.5 px-4 text-center no-print w-16">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAndSorted.map((tx) => {
                const typeConfig = TRANSACTION_TYPES[tx.type];
                const categoryConfig = getCategoryById(tx.categoryId);

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 transition-colors group print-break-inside-avoid"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-700 whitespace-nowrap">
                      {formatDateDisplay(tx.date)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: `${typeConfig.color}18`,
                          color: typeConfig.color,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: typeConfig.color }}
                        />
                        {typeConfig.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {categoryConfig && (
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: categoryConfig.color }}
                          />
                        )}
                        <span className="font-semibold text-slate-800">
                          {categoryConfig?.label ?? tx.categoryId}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {tx.description || (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td
                      className="py-3.5 px-4 sm:px-6 font-extrabold whitespace-nowrap"
                      style={{ color: typeConfig.color }}
                    >
                      {tx.type === 'expense' ? '-' : '+'}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-center no-print">
                      <button
                        type="button"
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="מחק תנועה"
                        aria-label={`מחק תנועה ${tx.description || categoryConfig?.label || ''}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
