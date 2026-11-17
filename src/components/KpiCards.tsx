import React from 'react';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';
import {
  TRANSACTION_TYPES,
  formatCurrency,
} from '../config/budgetConfig';

interface KpiCardsProps {
  totalIncome: number;
  totalExpenses: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  totalIncome,
  totalExpenses,
}) => {
  const netBalance = totalIncome - totalExpenses;
  const isPositive = netBalance >= 0;

  const savingsPercentage =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0;

  return (
    <section
      aria-label="סיכום מדדים חודשי"
      className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
    >
      {/* Total Income Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs print-card relative overflow-hidden">
        <div
          className="absolute top-0 right-0 h-full w-1.5"
          style={{ backgroundColor: TRANSACTION_TYPES.income.color }}
        />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">סך הכנסות</p>
            <p
              className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: TRANSACTION_TYPES.income.color }}
            >
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${TRANSACTION_TYPES.income.color}18`,
              color: TRANSACTION_TYPES.income.color,
            }}
          >
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          כלל ההכנסות שהוזנו בחודש הפעיל
        </p>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs print-card relative overflow-hidden">
        <div
          className="absolute top-0 right-0 h-full w-1.5"
          style={{ backgroundColor: TRANSACTION_TYPES.expense.color }}
        />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">סך הוצאות</p>
            <p
              className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: TRANSACTION_TYPES.expense.color }}
            >
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${TRANSACTION_TYPES.expense.color}18`,
              color: TRANSACTION_TYPES.expense.color,
            }}
          >
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          כלל ההוצאות שהוזנו בחודש הפעיל
        </p>
      </div>

      {/* Net Balance Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs print-card relative overflow-hidden">
        <div
          className="absolute top-0 right-0 h-full w-1.5"
          style={{
            backgroundColor: isPositive
              ? TRANSACTION_TYPES.income.color
              : TRANSACTION_TYPES.expense.color,
          }}
        />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              מאזן חודשי נטו
            </p>
            <p
              className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{
                color: isPositive
                  ? TRANSACTION_TYPES.income.color
                  : TRANSACTION_TYPES.expense.color,
              }}
            >
              {formatCurrency(netBalance)}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: isPositive
                ? `${TRANSACTION_TYPES.income.color}18`
                : `${TRANSACTION_TYPES.expense.color}18`,
              color: isPositive
                ? TRANSACTION_TYPES.income.color
                : TRANSACTION_TYPES.expense.color,
            }}
          >
            <Scale className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            אחוז חיסכון: {savingsPercentage}%
          </span>
        </div>
      </div>
    </section>
  );
};
