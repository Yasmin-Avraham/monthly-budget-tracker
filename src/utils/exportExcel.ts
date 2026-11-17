import * as XLSX from 'xlsx';
import {
  APP_CONFIG,
  TRANSACTION_TYPES,
  Transaction,
  getCategoryById,
} from '../config/budgetConfig';
import { formatDateDisplay, formatHebrewMonthYear } from './dateUtils';

export function exportTransactionsToExcel(
  transactions: Transaction[],
  yearMonth: string
): void {
  const hebrewMonthYear = formatHebrewMonthYear(yearMonth);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Sort transactions chronologically (oldest to newest)
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  // Build rows for SheetJS
  const rows: (string | number)[][] = [
    [`דוח תקציב חודשי - ${hebrewMonthYear}`],
    [],
    ['סיכום חודשי', `סכום (${APP_CONFIG.currencySymbol})`],
    ['סך הכנסות', totalIncome],
    ['סך הוצאות', totalExpenses],
    ['מאזן נטו', netBalance],
    [], // Empty separator row
    ['תאריך', 'סוג', 'קטגוריה', 'תיאור', `סכום (${APP_CONFIG.currencySymbol})`],
  ];

  sorted.forEach((tx) => {
    const typeConfig = TRANSACTION_TYPES[tx.type];
    const categoryConfig = getCategoryById(tx.categoryId);
    rows.push([
      formatDateDisplay(tx.date),
      typeConfig.label,
      categoryConfig?.label ?? tx.categoryId,
      tx.description || '-',
      tx.amount,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set RTL worksheet view
  ws['!views'] = [{ rightToLeft: true }];

  // Set column widths for clean readability
  ws['!cols'] = [
    { wch: 16 }, // תאריך / סיכום
    { wch: 14 }, // סוג
    { wch: 22 }, // קטגוריה
    { wch: 34 }, // תיאור
    { wch: 16 }, // סכום (₪)
  ];

  const wb = XLSX.utils.book_new();
  wb.Workbook = {
    Views: [{ RTL: true }],
  };

  XLSX.utils.book_append_sheet(wb, ws, hebrewMonthYear.slice(0, 31));

  const fileName = `${APP_CONFIG.excelFilePrefix}_${yearMonth}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
