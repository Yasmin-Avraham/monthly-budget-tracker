import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { APP_CONFIG } from '../config/budgetConfig';
import { formatHebrewMonthYear } from '../utils/dateUtils';

interface MonthSwitchModalProps {
  isOpen: boolean;
  targetMonth: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const MonthSwitchModal: React.FC<MonthSwitchModalProps> = ({
  isOpen,
  targetMonth,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !targetMonth) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-month-switch-title"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="סגור"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3
              id="modal-month-switch-title"
              className="text-lg font-bold text-slate-900"
            >
              מעבר לחודש {formatHebrewMonthYear(targetMonth)}
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {APP_CONFIG.monthSwitchConfirmText}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            ביטול
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-600/20 transition-colors"
          >
            כן, החלף חודש ומחק נתונים
          </button>
        </div>
      </div>
    </div>
  );
};
